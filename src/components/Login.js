import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = ({ login }) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!name.trim() || !id.trim()) {
      setError("Both username and ID are required.");
      return;
    }

    login({ name: name.trim(), id: id.trim() }); // update App user state
    navigate("/movies"); // redirect to movies list
  };

  return (
    <Form className="mt-4" onSubmit={handleLogin}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>User ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </Form.Group>

      <Button type="submit" variant="primary">
        Login
      </Button>
    </Form>
  );
};

export default Login;