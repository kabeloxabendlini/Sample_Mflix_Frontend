import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import MovieDataService from "../services/movies";
import { ButtonGroup } from "react-bootstrap"; // add this import at top
// Inside the return() where the search/filter form is:

const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="450">
      <rect width="100%" height="100%" fill="#ddd"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-size="20" fill="#555">No Image</text>
    </svg>
  `);

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [ratings, setRatings] = useState(["All Ratings"]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchRating, setSearchRating] = useState("All Ratings");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    retrieveMovies();
    retrieveRatings();
  }, []);

  const retrieveMovies = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await MovieDataService.getAll();
      setMovies(res?.movies?.filter(m => m?._id) || []);
    } catch (e) {
      setError("Failed to fetch movies.");
    } finally {
      setLoading(false);
    }
  };

  const retrieveRatings = async () => {
    try {
      const res = await MovieDataService.getRatings();
      setRatings(["All Ratings", ...(res || [])]);
    } catch (e) {
      setError("Failed to fetch ratings.");
    }
  };

  const find = async (query, by) => {
    if (!query) return;
    setLoading(true);
    setError("");
    try {
      const res = await MovieDataService.find(query, by);
      setMovies(res?.movies?.filter(m => m?._id) || []);
    } catch (e) {
      setError(`Failed to search movies by ${by}.`);
    } finally {
      setLoading(false);
    }
  };

  const findByTitle = () => find(searchTitle, "title");
  const findByRating = () => {
    searchRating === "All Ratings" ? retrieveMovies() : find(searchRating, "rated");
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGE;
  };

  return (
    <Container>
      <h2 className="mt-4">Movies</h2>

      <Form className="mb-4">


        <Row className="align-items-end mb-4">
          <Col xs={12} md={6} className="mb-2">
            <Form.Label className="fw-bold">Search by Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter movie title..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
            <Button
              variant="primary"
              className="mt-2 w-100"
              onClick={findByTitle}
              disabled={loading}
            >
              {loading ? <Spinner as="span" animation="border" size="sm" /> : "Search"}
            </Button>
          </Col>

          <Col xs={12} md={6} className="mb-2">
            <Form.Label className="fw-bold">Filter by Rating</Form.Label>
            <div className="d-flex flex-wrap gap-2 mt-1">
              {ratings.map((r, i) => (
                <Button
                  key={i}
                  variant={r === searchRating ? "success" : "outline-success"}
                  size="sm"
                  onClick={() => { setSearchRating(r); findByRating(); }}
                >
                  {r}
                </Button>
              ))}
            </div>
          </Col>
        </Row>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner animation="border" variant="primary" />}

      <Row>
        {movies.length > 0 ? (
          movies.map(movie => (
            <Col key={movie._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100 movie-card" style={{ transition: "transform 0.2s, box-shadow 0.2s" }}>
                <div style={{ position: "relative", paddingTop: "150%", overflow: "hidden" }}>
                  <Card.Img
                    src={movie.poster && movie.poster.startsWith("http") ? movie.poster : FALLBACK_IMAGE}
                    onError={handleImageError}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                <Card.Body className="d-flex flex-column">
                  <Card.Title>{movie.title}</Card.Title>
                  {movie.genre && <Card.Text><span className="badge bg-secondary">{movie.genre}</span></Card.Text>}
                  <Card.Text>Rating: {movie.rated || "N/A"}</Card.Text>

                  {movie._id ? (
                    <Button
                      as={Link}
                      to={`/movies/${movie._id}`}
                      variant="info"
                      className="mt-auto"
                    >
                      View Reviews
                    </Button>
                  ) : (
                    <span>No ID</span>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : !loading ? (
          <p>No movies found.</p>
        ) : null}
      </Row>

      <style>{`
        .movie-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }
      `}
      </style>
    </Container>
  );
};

export default MoviesList;