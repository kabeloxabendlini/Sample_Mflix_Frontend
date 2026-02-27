// Import React and useState hook for managing component state
import React, { useState } from "react";

// Import Bootstrap form components for styling
import { Form, Button } from "react-bootstrap";


// Functional Login component
// Receives props from App (login function + routing history)
const Login = (props) => {

  // ---------------- State ----------------

  // Store username entered by user
  const [name, setName] = useState("");

  // Store user ID entered by user
  const [id, setId] = useState("");

  // ---------------- Login Function ----------------

  const login = () => {

    // Call login function passed from App component
    // This updates the global user state
    props.login({ name, id });

    // Redirect user to movies page after login
    // history is provided by React Router (v5)
    props.history.push("/movies");
  };

  // ---------------- Component UI ----------------

  return (
    <Form>

      {/* Username Input Field */}
      <Form.Group className="mb-2">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={name} // Controlled component
          onChange={(e) => setName(e.target.value)} // Update state when typing
        />
      </Form.Group>

      {/* User ID Input Field */}
      <Form.Group className="mb-2">
        <Form.Label>ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter ID"
          value={id} // Controlled component
          onChange={(e) => setId(e.target.value)} // Update state when typing
        />
      </Form.Group>

      {/* Submit Button */}
      <Button onClick={login}>
        Submit
      </Button>

    </Form>
  );
};

// Export component for use in routing
export default Login;
