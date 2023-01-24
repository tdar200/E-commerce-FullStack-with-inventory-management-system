const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Receipt = require("../models/receiptModel.js");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/authMiddleware");
const axios = require("axios");
const cron = require("node-cron");

async function loop() {
  const config = {
    headers: {
      Authorization: `Bearer ${process.env.LOYVERSE_TOKEN}`,
      "Content-Type": "application/json",
      Origin: "*",
    },
  };

  const { data } = await axios.get(
    `https://api.loyverse.com/v1.0/receipts`,
    config
  );

  const LastData = await Receipt.aggregate([
    {
      $sort: {
        receipt_date: -1,
      },
    },
    {
      $limit: 1,
    },
  ]);

  (async () => {
    if (LastData.length === 1) {
      for (let i = 0; i < data.receipts.length; i++) {
        if (LastData[0].receipt_date < data.receipts[i].receipt_date) {
          let duplicate = await Receipt.find({
            receipt_number: data.receipts[i].receipt_number,
          });
          if (duplicate.length === 0) {
            await Receipt.create(data.receipts[i]);
          }
        }
      }
    } else if (LastData.length === 0) {
      await Receipt.create(data.receipts[0]);
    }
  })();
}

// setInterval(loop, 60000);

router.post("/webhooks/loyverse", async (req, res) => {
  const { receipt_number, receipt_date } = req.body;
  // check if receipt already exists
  let duplicate = await Receipt.find({ receipt_number });
  if (duplicate.length === 0) {
    // create new receipt
    await Receipt.create({ receipt_number, receipt_date });
  }
  res.send("OK");
});

router.route("/").get(
  asyncHandler(async (req, res) => {
    const pageSize = 50;
    const page = req.query.pageNumber ? req.query.pageNumber : 1;

    if (req.query.display === "All") {
      const receipts = await Receipt.aggregate([
        {
          $group: {
            _id: "$receipt_type",
            Total: {
              $sum: {
                $toInt: "$total_money",
              },
            },
          },
        },
      ]);

      res.json(receipts);
    } else {
      const count = await Receipt.countDocuments({});
      const receipts = await Receipt.find({})
        .limit(pageSize)
        .skip(pageSize * (page - 1));

      res.json({ receipts, page, pages: Math.ceil(count / pageSize) });
    }
  })
);

router.route("/sum").get(
  asyncHandler(async (req, res) => {
    const receipts = await Receipt.find({});

    res.json({ receipts });
  })
);

router.route("/unpaid").get(
  asyncHandler(async (req, res) => {
    // const receipts = await Receipt.find({ });

    const receipts = await Receipt.aggregate([
      {
        $match: {
          paid: false,
        },
      },
      {
        $sort: {
          created_at: -1,
        },
      },
    ]);

    res.json(receipts);
  })
);

router.route("/").put(
  asyncHandler(async (req, res) => {
    const receiptNumber = req.query.receiptNumber;

    const receipt = await Receipt.find({
      receipt_number: receiptNumber,
    });

    if (receipt && receipt.receipt_number === receiptNumber) {
      await Receipt.findOneAndUpdate(
        { receipt_number: receiptNumber },
        {
          $set: {
            paid: false,
          },
        },
        { useFindAndModify: false }
      );
    } else {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${process.env.LOYVERSE_TOKEN}`,
            "Content-Type": "application/json",
            Origin: "*",
          },
        };

        const { data } = await axios.get(
          `https://api.loyverse.com/v1.0/receipts/${receiptNumber}`,
          config
        );
        const receipt = [{ ...data, paid: false }];

        await Receipt.create(receipt);
      } catch (error) {
        console.error(error);
      }
    }
  })
);

router.route("/paid").put(
  asyncHandler(async (req, res) => {
    const receiptNumber = req.query.receiptNumber;
    const { date } = req.body;

    await Receipt.findOneAndUpdate(
      { receipt_number: receiptNumber },
      {
        $set: {
          paid: true,
          date_paid: date,
        },
      },
      { useFindAndModify: false }
    );
  })
);

router.route("/remove").put(
  asyncHandler(async (req, res) => {
    const receiptNumber = req.query.receiptNumber;

    await Receipt.findOneAndUpdate(
      { receipt_number: receiptNumber },
      {
        $set: {
          paid: true,
        },
      },
      { useFindAndModify: false }
    );
  })
);

module.exports = router;
