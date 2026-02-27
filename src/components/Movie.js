// Import React hooks
import React, { useState, useEffect } from "react";

// Import Bootstrap layout and UI components
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
  ListGroup,
} from "react-bootstrap";

// Import Link for navigation
import { Link } from "react-router-dom";

// Service layer for API calls
import MovieDataService from "../services/movies";

/**
 * Inline fallback image (SVG)
 * Prevents broken image icon if poster URL fails
 */
const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="450">
      <rect width="100%" height="100%" fill="#ddd"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-size="20" fill="#555">No Image</text>
    </svg>
  `);

const Movie = ({ match, user }) => {

  /**
   * Component state
   * Initialize arrays properly to prevent map() errors
   */
  const [movie, setMovie] = useState({
    id: null,
    title: "",
    plot: "",
    rated: "",
    poster: "",
    reviews: [], // Always initialize as empty array
  });

  /**
   * Fetch movie from backend safely
   * Uses optional chaining and fallback defaults
   */
  const getMovie = (id) => {
    MovieDataService.get(id)
      .then((res) => {
        const data = res?.data || {};

        // Normalize response data to prevent undefined issues
        setMovie({
          id: data._id ?? null,
          title: data.title ?? "",
          plot: data.plot ?? "",
          rated: data.rated ?? "",
          poster: data.poster ?? "",
          reviews: Array.isArray(data.reviews) ? data.reviews : [],
        });
      })
      .catch((e) => console.error("Error loading movie:", e));
  };

  /**
   * useEffect runs when component mounts
   * or when match changes
   */
  useEffect(() => {
    if (match?.params?.id) {
      getMovie(match.params.id);
    }
  }, [match]);

  /**
   * Delete review safely
   * After success → update UI without reloading page
   */
  const deleteReview = (reviewId, index) => {
    MovieDataService.deleteReview(reviewId, user.id)
      .then(() => {
        // Remove review from state (immutable update)
        setMovie((prevMovie) => ({
          ...prevMovie,
          reviews: prevMovie.reviews.filter((_, i) => i !== index),
        }));
      })
      .catch((e) => console.error("Error deleting review:", e));
  };

  /**
   * If movie poster fails to load,
   * replace it with fallback SVG
   */
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = FALLBACK_IMAGE;
  };

  return (
    <Container className="mt-4">
      <Row>

        {/* -------- Poster Column -------- */}
        <Col md={4}>
          <Image
            src={movie.poster || FALLBACK_IMAGE}
            fluid
            onError={handleImageError}
          />
        </Col>

        {/* -------- Details Column -------- */}
        <Col md={8}>
          <Card>
            <Card.Header as="h5">{movie.title}</Card.Header>

            <Card.Body>
              <Card.Text>{movie.plot}</Card.Text>

              <Card.Text>
                <strong>Rating:</strong> {movie.rated || "Not Rated"}
              </Card.Text>

              {/* Show Add Review button only if logged in */}
              {user && (
                <Link to={`/movies/${match.params.id}/review`}>
                  Add Review
                </Link>
              )}
            </Card.Body>
          </Card>

          {/* -------- Reviews Section -------- */}
          <h2 className="mt-4">Reviews</h2>

          {movie.reviews?.length > 0 ? (
            <ListGroup className="mt-3">

              {/* Loop through reviews safely */}
              {movie.reviews.map((review, index) => (
                <ListGroup.Item key={review._id || index}>
                  <Card>
                    <Card.Body>

                      {/* Reviewer Name + Date */}
                      <Card.Title>
                        {review.name} reviewed on {review.date}
                      </Card.Title>

                      {/* Review Content */}
                      <Card.Text>{review.review}</Card.Text>

                      {/* Only show Edit/Delete if:
                          - User is logged in
                          - User owns this review
                      */}
                      {user && user.id === review.user_id && (
                        <Row>
                          <Col>

                            {/* Edit Review Link */}
                            <Link
                              to={{
                                pathname: `/movies/${match.params.id}/review`,
                                state: { currentReview: review },
                              }}
                            >
                              Edit
                            </Link>
                          </Col>

                          <Col>
                            {/* Delete Review Button */}
                            <Button
                              variant="link"
                              onClick={() =>
                                deleteReview(review._id, index)
                              }
                            >
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      )}
                    </Card.Body>
                  </Card>
                </ListGroup.Item>
              ))}

            </ListGroup>
          ) : (
            <p>No reviews yet.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

// Export component for routing
export default Movie;
