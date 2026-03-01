import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Image, ListGroup, Spinner, Alert } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
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
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getMovie = async (movieId) => {
    if (!movieId || movieId === "null") return;

    setLoading(true);
    setError("");

    try {
      const data = await MovieDataService.get(movieId);

      setMovie({
        id: data._id?.toString() ?? null,
        title: data.title ?? "",
        plot: data.plot ?? "",
        rated: data.rated ?? "",
        poster: data.poster ?? "",
        reviews: Array.isArray(data.reviews) ? data.reviews : [],
      });

    } catch (e) {
      console.error(e);
      setError("Failed to load movie details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id || id === "null" || id === "undefined") {
      setLoading(false);
      setError("Invalid movie ID.");
      return;
    }

    getMovie(id);
  }, [id]);

  const deleteReview = async (reviewId, index) => {
    try {
      await MovieDataService.deleteReview(reviewId, user.id);
      setMovie((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((_, i) => i !== index),
      }));
    } catch (e) {
      console.error(e);
      setError("Failed to delete review.");
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGE;
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Image src={
            movie.poster && movie.poster.startsWith("http")
              ? movie.poster
              : FALLBACK_IMAGE
          } fluid onError={handleImageError} />
        </Col>
        <Col md={8}>
          <Card>
            <Card.Header as="h5">{movie.title}</Card.Header>
            <Card.Body>
              <Card.Text>{movie.plot}</Card.Text>
              <Card.Text><strong>Rating:</strong> {movie.rated || "Not Rated"}</Card.Text>
              {user && movie.id && (
                <Link to={`/movies/${movie.id}/review`}>Add Review</Link>)}
            </Card.Body>
          </Card>

          <h2 className="mt-4">Reviews</h2>
          {movie.reviews.length > 0 ? (
            <ListGroup className="mt-3">
              {movie.reviews.map((review, index) => (
                <ListGroup.Item key={review._id || index}>
                  <Card>
                    <Card.Body>
                      <Card.Title>{review.name} reviewed on {review.date}</Card.Title>
                      <Card.Text>{review.review}</Card.Text>
                      {user && user.id === review.user_id && (
                        <Row>
                          <Col>
                            <Link 
                            to={
                              `/movies/${movie.id}/review`
                            }>
                              Edit Review
                              </Link>
                          </Col>
                          <Col>
                            <Button variant="link" onClick={() => deleteReview(review._id, index)}>Delete</Button>
                          </Col>
                        </Row>
                      )}
                    </Card.Body>
                  </Card>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : <p>No reviews yet.</p>}
        </Col>
      </Row>
    </Container>
  );
};

export default Movie;