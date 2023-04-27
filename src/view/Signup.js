import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Signup-Login.css";
import logo from "../css/logo.png";
import axios from "axios";
import { countryNames, genreNames } from "../utils";

const Signup = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [userType, setUserType] = useState("fan");
  const [profile, setProfile] = useState({});
  const [email, setEmail] = useState("");
  const [genre, setGenre] = useState("");
  const [id, setId] = useState(sessionStorage.getItem("userId"));
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [failure, setFailure] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;
    setEmailInvalid(!emailRegex.test(inputEmail));
  };

  const handlePasswordValidation = (e) => {
    const inputPassword = e.target.value;
    setPassword(inputPassword);
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+]).{8,}$/;
    setPasswordInvalid(!passwordRegex.test(inputPassword));
  };

  const handlePasswordMatch = (e) => {
    const passwordConfirmation = e.target.value;
    setConfirmPassword(passwordConfirmation);
    setPasswordMatch(passwordConfirmation !== password);
  };

  useEffect(() => {
    if (id) {
      navigate("/homepage");
    }
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !name ||
      !email ||
      !username ||
      !password ||
      !city ||
      !country ||
      !userType ||
      passwordInvalid ||
      passwordMatch ||
      emailInvalid
    ) {
      alert("Please fill out signup correctly");
    } else {
      let formData = new FormData();
      formData.append("profile", profile);
      formData.append("name", name);
      formData.append("age", age);
      formData.append("username", username.toLowerCase());
      formData.append("email", email);
      formData.append("password", password);
      formData.append("city", city);
      formData.append("country", country);
      formData.append("userType", userType);
      formData.append("genre", genre);
      console.log(formData);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}api/user/signup`,
          {
            method: "POST",

            //headers,
            //body: payload,
            body: formData,
          }
        );
        console.log(response);
        if (response.status === 200) {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            navigate("/login");
          }, 3000);
        } else {
          const data = await response.json();
          if (data.message === "email already associated with an account") {
            setEmailTaken(true);
            setTimeout(() => {
              setEmailTaken(false);
            }, 3000);
          }
          if (data.message === "username already exists") {
            setUsernameTaken(true);
            setTimeout(() => {
              setUsernameTaken(false);
            }, 3000);
          }
          console.log(data.message);
          throw new Error(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleFileChange = (e) => {
    const img = e.target.files[0];
    setProfile(img);
  };

  return success ? (
    <Modal show={true} centered>
      <Modal.Header>
        <Modal.Title>Sign Up Successful!</Modal.Title>
      </Modal.Header>
    </Modal>
  ) : failure ? (
    <Modal show={true} centered>
      <Modal.Header>
        <Modal.Title>Sign Up Failed!</Modal.Title>
      </Modal.Header>
    </Modal>
  ) : usernameTaken ? (
    <Modal show={true} centered>
      <Modal.Header>
        <Modal.Title>Username Already Exists</Modal.Title>
      </Modal.Header>
    </Modal>
  ) : emailTaken ? (
    <Modal show={true} centered>
      <Modal.Header>
        <Modal.Title>Email Already Associated with an Account</Modal.Title>
      </Modal.Header>
    </Modal>
  ) : (
    <div className="container signupdiv">
      <img className="logo" src={logo}></img>
      <Form className="signup-form" onSubmit={handleSubmit}>
        <p className="signup-title">
          <span className="signup-title-span">Sign up</span> and enjoy our
          GigGuide<span className="signup-title-span">!</span>
        </p>
        <Form.Group controlId="formName">
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter email"
          />
          {emailInvalid ? <p>Invalid Email</p> : null}
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="formUsername">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={handlePasswordValidation}
            autoComplete="new-password"
          />
          {passwordInvalid ? <p>Invalid Password</p> : null}
        </Form.Group>
        <div className="passwordInfoNotRed col-9 col-sm-8 col-md-8 col-lg-6 col-xl-5">
          <h6>Password must contain at least:</h6>
          <p>8 characters</p>
          <p>1 uppercase letter</p>
          <p>1 lowercase letter</p>
          <p>1 number</p>
          <p>1 special character</p>
        </div>
        <Form.Group controlId="formConfirmPassword">
          <Form.Label>Confirm Password:</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            placeholder="Repeat the password"
            onChange={handlePasswordMatch}
            autoComplete="new-password"
          />
          {passwordMatch ? <p>Password does not match</p> : null}
        </Form.Group>
        <Form.Group>
          <Form.Label>Choose your profile image:</Form.Label>
          <Form.Control
            type="file"
            name="profile"
            onChange={handleFileChange}
          />
          <Form.Text className="text-muted">
            Please select an image to upload.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="formCity">
          <Form.Label>City:</Form.Label>
          <Form.Control
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formCountry">
          <Form.Label>Country:</Form.Label>
          <Form.Select
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
          >
            <option key="blankChoice" hidden value>
              {" "}
              --Country--{" "}
            </option>
            <option>None</option>
            {countryNames.map((countryName) => {
              return <option key={countryName}>{countryName}</option>;
            })}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formUserType">
          <Form.Label style={{ marginRight: "10px" }}>
            Are you a fan or an artist?
          </Form.Label>
          <Form.Check
            inline
            label="Fan"
            type="radio"
            id="fan"
            name="userType"
            value="Fan"
            checked={userType === "Fan"}
            onChange={(e) => setUserType(e.target.value)}
          />
          <Form.Check
            inline
            label="Artist"
            type="radio"
            id="Artist"
            name="userType"
            value="Artist"
            checked={userType === "Artist"}
            onChange={(e) => setUserType(e.target.value)}
          />
        </Form.Group>
        {userType === "Artist" ? (
          <Form.Group controlId="formGenre">
            <Form.Label>Genre:</Form.Label>
            <Form.Select
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Genre"
            >
              <option key="blankChoice" hidden value>
                {" "}
                --Genre--{" "}
              </option>
              <option>None</option>
              {genreNames.map((genreName) => {
                return <option>{genreName}</option>;
              })}
            </Form.Select>
          </Form.Group>
        ) : null}
        {userType === "Fan" ? (
          <Form.Group controlId="formAge">
            <Form.Label>Age:</Form.Label>
            <Form.Control
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </Form.Group>
        ) : null}
        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>
    </div>
  );
};
export default Signup;
