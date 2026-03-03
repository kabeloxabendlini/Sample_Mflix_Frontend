import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Image, ListGroup, Spinner, Alert } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import MovieDataService from "../services/movies";

const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="450">
      <rect width="100%" height="100%" fill="#ddd"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-size="20" fill="#555">No Image</text>
    </svg>
  `);

const Movie = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const getMovie = async () => {
      if (!id) return setError("Invalid movie ID");
      setLoading(true);
      try {
        const data = await MovieDataService.get(id);
        setMovie({
          ...data,
          id: data._id || data.id,
          reviews: Array.isArray(data.reviews) ? data.reviews : [],
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };
    getMovie();
  }, [id]);

  const handleDelete = async (reviewId) => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      setActionLoading(true);
      await MovieDataService.deleteReview(movie.id, reviewId, user.id);
      setMovie((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((r) => r._id !== reviewId),
      }));
    } catch (err) {
      console.error(err);
      setError("Failed to delete review.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGE;
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!movie) return <Alert variant="warning">Movie not found.</Alert>;

  return (
    <Container className="mt-4">
      <Button variant="secondary" className="mb-3" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Row>
        <Col md={4}>
          <Image
            src={movie.poster?.startsWith("http") ? movie.poster : FALLBACK_IMAGE}
            fluid
            onError={handleImageError}
          />
        </Col>
        <Col md={8}>
          <h2>{movie.title}</h2>
          <p>{movie.plot}</p>
          <p>
            <strong>Rating:</strong> {movie.rated || "N/A"} <br />
            {movie.genre && <span><strong>Genre:</strong> {movie.genre} <br /></span>}
            {movie.release_year && <span><strong>Year:</strong> {movie.release_year} <br /></span>}
            {movie.runtime && <span><strong>Runtime:</strong> {movie.runtime} min</span>}
          </p>

          {user && (
            <Link to={`/movies/${movie.id}/review`}>
              <Button variant="info" className="mb-3">Add Review</Button>
            </Link>
          )}
        </Col>
      </Row>

      <h4 className="mt-4">Reviews</h4>
      {!user && <Alert variant="info">Log in to edit or delete reviews.</Alert>}
      {movie.reviews.length === 0 && <p>No reviews yet.</p>}

      {movie.reviews.map((r) => (
        <Card key={r._id} className="mb-3">
          <Card.Body>
            <Card.Title>{r.name}</Card.Title>
            <Card.Text>{r.review}</Card.Text>
            <Card.Text>
              <small className="text-muted">
                {r.date ? new Date(r.date).toLocaleString() : "Unknown date"}
              </small>
            </Card.Text>

            {user && user.id === r.user_id && (
              <div className="d-flex gap-2">
                <Link to={`/movies/${movie.id}/review`} state={{ currentReview: r }}>
                  <Button variant="warning" size="sm">Edit</Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(r._id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default Movie;