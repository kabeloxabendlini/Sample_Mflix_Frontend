import React, { useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container } from "react-bootstrap";

import MoviesList from "./components/MoviesList";
import MovieDetails from "./components/MovieDetails";
import AddReview from "./components/AddReview";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <Container>

      <Navbar bg="light" expand="lg" className="mb-4">
        <Navbar.Brand>Movie Reviews</Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link as={Link} to="/movies">
            Movies
          </Nav.Link>
        </Nav>

        <Nav>
          {user ? (
            <>
              <Navbar.Text className="me-3">
                Signed in as: <strong>{user.name}</strong>
              </Navbar.Text>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </>
          ) : (
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
          )}
        </Nav>
      </Navbar>

      <Routes>
        <Route path="/" element={<Navigate to="/movies" replace />} />
        <Route path="/movies" element={<MoviesList />} />
        <Route path="/movies/:id" element={<MovieDetails user={user} />} />
        <Route path="/movies/:id/review" element={<AddReview user={user} />} />
        <Route path="/login" element={<Login login={login} />} />
      </Routes>

    </Container>
  );
}

export default App;