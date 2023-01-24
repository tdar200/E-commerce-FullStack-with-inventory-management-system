import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer
      style={{
        display: "grid",
        backgroundColor: "floralwhite",
        alignContent: "center",
      }}>
      <Container>
        <Row>
          <Col
            style={{
              fontFamily: "Barlow Condensed,sans-serif",
              fontWeight: "500",
              marginBottom: "20px",
            }}
            className='text-center py-3'>
            © BACKYARD BBQ RESTAURANT ALL RIGHTS RESERVED
          </Col>
          <Col className='text-center py-3'>
            <button
              style={{
                backgroundColor: "#4267B2",
                marginInline: "10px",
                alignContent: "center",
                display: "inline-flex",
                width: "250px",
                justifyContent: "center",
                letterSpacing: "1px",
                padding: "10px",
                margin: "0.5rem",
              }}
              onClick={() =>
                window.open("https://www.facebook.com/Backyardbbqrestaurant")
              }
              className='social-media'>
              <i
                style={{ fontSize: "1.73em", marginRight: "9px" }}
                className='fab fa-facebook-square'></i>{" "}
              LIKE US ON FACEBOOK
            </button>

            <button
              style={{
                backgroundColor: "#F58529",
                marginInline: "10px",
                alignContent: "center",
                display: "inline-flex",
                width: "250px",
                justifyContent: "center",
                letterSpacing: "1px",
                padding: "10px",
                margin: "0.5rem",
              }}
              onClick={() =>
                window.open("https://www.instagram.com/backyard.bbq.restaurant")
              }
              className='social-media'>
              <i
                style={{ fontSize: "1.73em", marginRight: "9px" }}
                className='fab fa-instagram'></i>{" "}
              FOLLOW US ON INSTAGRAM
            </button>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
