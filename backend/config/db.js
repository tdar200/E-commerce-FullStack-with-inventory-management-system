const mongoose = require("mongoose");

function getConnectionsNumber() {
  return mongoose.connection.base.connections.length;
}

console.log(getConnectionsNumber());

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      maxPoolSize: 1,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error:${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
