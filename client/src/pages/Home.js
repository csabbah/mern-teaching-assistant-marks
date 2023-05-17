import React, { useState, useEffect } from "react";

import Auth from "../utils/auth";
import { useHistory } from "react-router-dom";

import { useMutation } from "@apollo/client";
import { LOGIN_USER, ADD_USER } from "../utils/mutations";

// TODO Need to make sure the errors show up (i.e. 'Incorrect credentials', 'Incorrect password')
const Home = () => {
  const [formState, setFormState] = useState({ email: "", password: "" });

  const [displayErr, setDisplayErr] = useState({ reveal: false, msg: "" });

  const [login] = useMutation(LOGIN_USER, {
    onError: (e) => {
      setDisplayErr({ reveal: true, msg: e.message });
    },
  });

  // submit form
  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
    } catch (error) {}
  };

  const [addUser] = useMutation(ADD_USER);

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();

    if (formState.password.length < 6) {
      return setDisplayErr({
        reveal: true,
        msg: "Password must be longer than 5 letters",
      });
    }

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });
      Auth.login(data.addUser.token);
    } catch (error) {
      setDisplayErr({ reveal: true, msg: "Email already exists" });
    }
  };

  // update state based on form input changes
  const handleChange = (event) => {
    setDisplayErr({ reveal: false, msg: "" });
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value.trim(),
    });
  };

  const [showSignIn, setShowSignIn] = useState(false);

  const history = useHistory();

  // Check if user is logged in
  let loggedIn = Auth.loggedIn();

  useEffect(() => {
    loggedIn && history.push("/your-classes");

    document.title = "Hershy - Home";
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p style={{ position: "absolute", top: 20, left: 20 }}>Hershy's Book</p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "absolute",
          cursor: "pointer",
          userSelect: "none",
          bottom: 20,
          left: 20,
          gap: 15,
        }}
      >
        <p style={{ margin: 0 }}>Privacy</p>
        <p style={{ margin: 0 }}>Help</p>
        <p style={{ margin: 0 }}>About us</p>
        <p style={{ margin: 0 }}>Our Socials</p>
      </div>
      <div className="px-3 w-100">
        <div
          style={{
            alignItems: "center",
          }}
        >
          <h5 style={{ fontWeight: 600 }}>Welcome!</h5>
          <p>Please login or sign up to get started!</p>
        </div>
        <h5 style={{ fontWeight: 600 }} className="mt-5 mb-3">
          {showSignIn ? "Sign in" : "Sign up"}
        </h5>
        {showSignIn ? (
          <form onSubmit={handleLoginSubmit} className="row">
            <div className="col-sm-12 col-lg-6 col-xl-5">
              <label htmlFor="inputEmail4" className="form-label">
                Email
              </label>
              <input
                onChange={(e) => {
                  handleChange(e);
                }}
                name="email"
                type="email"
                className="form-control"
                id="inputEmail4"
              />
              {displayErr.reveal && (
                <p style={{ color: "red", fontSize: 15 }} className="mt-2 mb-0">
                  {displayErr.msg}
                </p>
              )}
            </div>
            <div className="col-sm-12 col-lg-6 col-xl-5 mt-sm-0 mt-3">
              <label htmlFor="inputPassword4" className="form-label">
                Password
              </label>
              <input
                onChange={(e) => {
                  handleChange(e);
                }}
                name="password"
                type="password"
                className="form-control"
                id="inputPassword4"
              />
            </div>
            <div className="col-12 mt-3">
              <button
                style={{ width: 100 }}
                type="submit"
                className="btn btn-primary mb-2"
              >
                Sign in
              </button>
              <p style={{ userSelect: "none", marginTop: 15 }}>
                <span
                  onClick={() => {
                    setShowSignIn(false);
                    setDisplayErr({ reveal: false, msg: "" });
                  }}
                  style={{ color: "blue", cursor: "pointer" }}
                >
                  Go Back
                </span>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUpSubmit} className="row">
            <div className="col-sm-12 col-lg-6 col-xl-5">
              <label htmlFor="inputEmail4" className="form-label">
                Email
              </label>
              <input
                onChange={(e) => {
                  handleChange(e);
                }}
                name="email"
                type="email"
                className="form-control"
                id="inputEmail4"
              />
              {displayErr.reveal && (
                <p style={{ color: "red", fontSize: 15 }} className="mt-2 mb-0">
                  {displayErr.msg}
                </p>
              )}
            </div>
            <div className="col-sm-12 col-lg-6 col-xl-5 mt-sm-0 mt-3">
              <label htmlFor="inputPassword4" className="form-label">
                Password
              </label>
              <input
                onChange={(e) => {
                  handleChange(e);
                }}
                name="password"
                type="password"
                className="form-control"
                id="inputPassword4"
              />
            </div>
            <div className="col-12 mt-3">
              <button
                style={{ width: 100 }}
                type="submit"
                className="btn btn-primary mb-2"
              >
                Sign up
              </button>
              <p style={{ userSelect: "none", marginTop: 15 }}>
                Already a member?{" "}
                <span
                  onClick={() => {
                    setShowSignIn(true);
                    setDisplayErr({ reveal: false, msg: "" });
                  }}
                  style={{
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  Login
                </span>
              </p>
            </div>
          </form>
        )}
      </div>
      <div
        style={{
          backgroundColor: "#333",
          height: "100vh",
        }}
        className="w-50 d-none d-md-flex"
      ></div>
    </div>
  );
};

export default Home;
