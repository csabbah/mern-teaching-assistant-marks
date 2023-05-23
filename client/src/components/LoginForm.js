import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

import Auth from "../utils/auth";

import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";

const LoginForm = () => {
  const [validated] = useState(false);

  const [login] = useMutation(LOGIN_USER);
  const [displayErr, setDisplayErr] = useState({ reveal: false, msg: "" });

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
    } catch (error) {
      setDisplayErr({ reveal: true, msg: error.message });
    }
  };

  const [formState, setFormState] = useState({ email: "", password: "" });

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Form.Group>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            value={formState.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button
          disabled={!(formState.email && formState.password)}
          type="submit"
          variant="success"
        >
          Submit
        </Button>
        {displayErr.reveal && (
          <div className="login-failed">{displayErr.msg}</div>
        )}
      </Form>
    </>
  );
};

export default LoginForm;
