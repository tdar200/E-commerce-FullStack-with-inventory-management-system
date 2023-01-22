import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { login } from "../actions/userActions";

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <div
      className='d-flex flex-column align-items-center'
      style={{ background: "inherit" }}>
      <div
        className='w-75 d-flex flex-column align-items-center mt-5'
        style={{
          backgroundColor: "white",
          boxShadow:
            " 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.25)",
        }}>
        <h3>Sign In</h3>
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}
        <Form className='w-75 py-3' onSubmit={submitHandler}>
          <Form.Group className='w-100 py-2' controlId='email'>
            <Form.Control
              type='email'
              placeholder='Email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group className='w-100 py-2' controlId='password'>
            <Form.Control
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}></Form.Control>
          </Form.Group>

          <button className='login-button  ' type='submit' variant='primary'>
            Sign In
          </button>
        </Form>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            marginTop: "2rem",
            marginBottom: "2rem",
            width: "75%",
          }}>
          <div
            style={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.5)",
              width: "100%",
            }}>
            <p
              style={{
                color: "rgba(0, 0, 0, 1)",
                textAlign: "center",
                textJustify: "inter-word",
                margin: 0,
              }}>
              or
            </p>
          </div>
        </div>

        <button type='button' class='login-with-google-btn'>
          <div className='login-with-google-btn-div'></div>

          <p style={{ margin: 0, paddingLeft: "1rem" }}>Sign in with Google</p>
        </button>

        <Col className='w-100 d-flex flex-column align-items-center py-5'>
          <text>Don't have an account? </text>
          <Link
            className='text-danger py-2'
            to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            <p>Create account</p>
          </Link>
        </Col>
      </div>
    </div>
  );
};

export default LoginScreen;
