// Import React and the useState hook for managing component state
import React, { useState } from "react";

// Import routing components from react-router-dom (v5 style)
import { Switch, Route, Link } from "react-router-dom";

// Import Bootstrap CSS styles
import "bootstrap/dist/css/bootstrap.min.css";

// Import specific Bootstrap components for layout and navigation
import { Navbar, Nav, Container } from "react-bootstrap";

// ----------- Custom Components -----------
import MoviesList from "./components/MoviesList";
import Movie from "./components/Movie";
import AddReview from "./components/AddReview";
import Login from "./components/Login";

function App() {
  // State to store the currently logged-in user
  // Default is null (no user logged in)
  const [user, setUser] = useState(null);

  // Function to set the logged-in user
  // Called after successful login
  const login = (user = null) => setUser(user);

  // Function to log the user out
  // Clears the user state
  const logout = () => setUser(null);

  return (
    <div className="App">
      {/* Bootstrap container for proper spacing and layout */}
      <Container>

        {/* ================= NAVBAR ================= */}
        <Navbar bg="light" expand="lg" className="mb-4">
          
          {/* Application Title */}
          <Navbar.Brand>Movie Reviews</Navbar.Brand>

          {/* Hamburger menu for smaller screens */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          {/* Collapsible navigation section */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">

              {/* Link to Movies page */}
              <Nav.Link as={Link} to="/movies">
                Movies
              </Nav.Link>

              {/* Conditional rendering:
                 If user exists → show Logout
                 If no user → show Login
              */}
              {user ? (
                <Nav.Link onClick={logout}>Logout User</Nav.Link>
              ) : (
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              )}

            </Nav>
          </Navbar.Collapse>
        </Navbar>

        {/* ================= ROUTING ================= */}
        <Switch>

          {/* Route for Movies list
             Loads at "/" and "/movies"
          */}
          <Route exact path={["/", "/movies"]} component={MoviesList} />

          {/* Route for Adding or Editing a review
             Passes user as a prop to AddReview component
          */}
          <Route
            path="/movies/:id/review"
            render={(props) => <AddReview {...props} user={user} />}
          />

          {/* Movie detail page
             :id is a dynamic URL parameter
             Passes user for authentication-based features
          */}
          <Route
            path="/movies/:id"
            render={(props) => <Movie {...props} user={user} />}
          />

          {/* Login route
             Passes login function so Login component can update user state
          */}
          <Route
            path="/login"
            render={(props) => <Login {...props} login={login} />}
          />

        </Switch>
      </Container>
    </div>
  );
}

// Export App so it can be rendered in index.js
export default App;
