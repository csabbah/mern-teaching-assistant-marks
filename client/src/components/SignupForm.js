import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

import Auth from "../utils/auth";

import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";

const SignupForm = () => {
  const [validated] = useState(false);

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const [addUser] = useMutation(ADD_USER);

  const [displayErr, setDisplayErr] = useState({ reveal: false, msg: "" });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });
      Auth.login(data.addUser.token);
    } catch (error) {
      setDisplayErr({ reveal: true, msg: error.message });
    }
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Form.Group>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email address"
            name="email"
            onChange={handleChange}
            value={formState.email}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleChange}
            value={formState.password}
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
          <div className="signup-failed">{displayErr.msg}</div>
        )}
      </Form>
    </>
  );
};

export default SignupForm;
