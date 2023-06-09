import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "../css/Signup-Login.css";
import logo from "../css/logo.png";
import LoadingIndicator from "../Components/LoadingIndicator";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordIncorrect, setPasswordIncorrect] = useState(false);
  const [passwordInformation, setPasswordInformation] = useState(false);
  const [usernameNotFound, setUsernameNotFound] = useState(false);
  const [failure, setFailure] = useState(false);
  const id = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      navigate("/homepage");
    }
  }, [id]);
  const handleLogin = async (e) => {
    e.preventDefault();
    const headers = { "Content-Type": "application/json" };
    const payload = { username, password };
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}api/user/login`,
        payload,
        { headers }
      );
      if (response.status === 200) {
        const { data } = await response;
        const token = data.token;
        const id = data.response._id;
        setIsLoading(false);
        setSuccess(true);
        setTimeout(() => {
          sessionStorage.setItem("jwt", token);
          sessionStorage.setItem("userId", id);
          navigate("/homepage");
        }, 3000);
      } else {
        const errorData = response.data;
        console.log(errorData.response.data);
        setIsLoading(false);
        setFailure(true);
        setTimeout(() => {
          setFailure(false);
        }, 3000);
        throw new Error(errorData.message);
      }
    } catch (err) {
      if (err.response.data === "username not found") {
        setIsLoading(false);
        setUsernameNotFound(true);
      }
      if (err.response.data === "password incorrect") {
        setIsLoading(false);
        setPasswordIncorrect(true);
        setPasswordInformation(true);
      }
      setTimeout(() => {
        setIsLoading(false);
        setPasswordIncorrect(false);
        setUsernameNotFound(false);
      }, 3000);
      console.log(err);
      throw err;
    }
  };
  return isLoading ? (
    <div className="Loading">
      <LoadingIndicator />
    </div>
  ) : success ? (
    <Modal show={true} centered>
      <Modal.Header>
        <Modal.Title>Login Successful!</Modal.Title>
      </Modal.Header>
    </Modal>
  ) : failure ? (
    <Modal show={true} centered>
      <Modal.Header>
        <Modal.Title>Login Failed!</Modal.Title>
      </Modal.Header>
    </Modal>
  ) : usernameNotFound ? (
    <Modal show={true} centered>
      <Modal.Header>
        <Modal.Title>Username Incorrect</Modal.Title>
      </Modal.Header>
    </Modal>
  ) : passwordIncorrect ? (
    <Modal show={true} centered>
      <Modal.Header>
        <Modal.Title>Password Incorrect</Modal.Title>
      </Modal.Header>
    </Modal>
  ) : (
    <div className="container">
      <img className="logo" src={logo} alt="Logo" />
      <Form className="signup-form" onSubmit={handleLogin}>
        <p className="signup-title">
          <span className="signup-title-span">Log in</span> and enjoy our
          GigGuide<span className="signup-title-span">!</span>
        </p>
        <Form.Group controlId="formUsername">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        {passwordInformation ? (
          <div className="passwordInfo col-9 col-sm-8 col-md-8 col-lg-6 col-xl-5">
            <h6>Password must contain at least:</h6>
            <p>8 characters</p>
            <p>1 uppercase letter</p>
            <p>1 lowercase letter</p>
            <p>1 number</p>
            <p>1 special character</p>
          </div>
        ) : null}

        <Button variant="primary" type="submit">
          Log in
        </Button>
      </Form>
    </div>
  );
};

export default Login;
