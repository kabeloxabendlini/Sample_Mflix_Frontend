import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container } from "react-bootstrap";

import MoviesList from "./components/MoviesList";
import AddReview from "./components/AddReview";
import Login from "./components/Login";
import MovieDetails from "./components/MovieDetails";
import Movie from "./components/Movie";

function App() {
  const [user, setUser] = useState(null);

  const login = (user = null) => setUser(user);
  const logout = () => setUser(null);

  return (
    <Router>
      <div className="App">
        <Container>

          {/* ========== NAVBAR ========== */}
          <Navbar bg="light" expand="lg" className="mb-4">
            <Navbar.Brand>Movie Reviews</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav className="me-auto">

                <Nav.Link as={Link} to="/movies">
                  Movies
                </Nav.Link>

                {user ? (
                  <Nav.Link onClick={logout}>
                    Logout User
                  </Nav.Link>
                ) : (
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                )}

              </Nav>
            </Navbar.Collapse>
          </Navbar>

          {/* ========== ROUTES (v6 syntax) ========== */}
          <Routes>

            <Route
              path="/"
              element={<MoviesList user={user} />}
            />

            <Route
              path="/movies"
              element={<MoviesList user={user} />}
            />

            <Route
              path="/movies/:id"
              element={<MovieDetails user={user} />}
            />

            <Route
              path="/movies/:id/review"
              element={<AddReview user={user} />}
            />

            <Route
              path="/login"
              element={<Login login={login} />}
            />

          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;