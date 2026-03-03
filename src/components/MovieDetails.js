import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import MovieDataService from "../services/movies";

const MovieDetails = ({ user }) => {
  const { id: movieId } = useParams();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch movie and reviews
  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const data = await MovieDataService.get(movieId);
        setMovie({
          title: data.title,
          plot: data.plot,
          poster: data.poster,
        });
        setReviews(data.reviews || []);
      } catch (e) {
        console.error(e);
        setError("Failed to load movie and reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    if (!user) {
      setError("You must be logged in to delete a review.");
      return;
    }

    try {
      setActionLoading(true);
      await MovieDataService.deleteReview(movieId, reviewId, user.id);

      // Remove deleted review from state
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (e) {
      console.error(e);
      setError("Failed to delete review.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Spinner animation="border" variant="primary" />;

  if (!movie) return <Alert variant="danger">Movie not found.</Alert>;

  return (
    <div className="mt-4">
      <h2>{movie.title}</h2>
      <p>{movie.plot}</p>

      <h4>Reviews</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {reviews.length === 0 && <p>No reviews yet.</p>}

      {reviews.map((r) => (
        <Card key={r._id} className="mb-3">
          <Card.Body>
            <Card.Title>{r.name}</Card.Title>
            <Card.Text>{r.review}</Card.Text>
            <Card.Text>
              <small className="text-muted">{new Date(r.date).toLocaleString()}</small>
            </Card.Text>

            {user && user.id === r.user_id && (
              <>
                <Link
                  to={`/movies/${movieId}/add-review`}
                  state={{ currentReview: r }}
                >
                  <Button variant="warning" size="sm" className="me-2">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(r._id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Deleting..." : "Delete"}
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default MovieDetails;