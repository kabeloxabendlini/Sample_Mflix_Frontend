import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import MovieDataService from "../services/movies";

const MovieDetails = ({ user }) => {
  const { id: movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const data = await MovieDataService.get(movieId);
      setMovie(data);
      setReviews(data.reviews || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load movie.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [movieId]);

  const handleDelete = async (reviewId) => {
    if (!user) return;
    if (!window.confirm("Delete this review?")) return;

    try {
      setActionLoading(true);
      await MovieDataService.deleteReview(movieId, reviewId, user.id);
      fetchMovie(); // refresh after delete
    } catch (err) {
      console.error(err);
      setError("Failed to delete review.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (!movie) return <Alert variant="danger">Movie not found.</Alert>;

  return (
    <div className="container mt-4">

      <Button
        variant="secondary"
        className="mb-3"
        onClick={() => navigate(-1)}
      >
        ← Back
      </Button>

      <h2>{movie.title}</h2>
      <p>{movie.plot}</p>

      {user && (
        <Link to={`/movies/${movieId}/review`}>
          <Button variant="primary" className="mb-3">
            Add Review
          </Button>
        </Link>
      )}

      <h4 className="mt-4">Reviews</h4>

      {error && <Alert variant="danger">{error}</Alert>}
      {reviews.length === 0 && <p>No reviews yet.</p>}

      {reviews.map((r) => (
        <Card key={r._id} className="mb-3">
          <Card.Body>
            <Card.Title>{r.name}</Card.Title>
            <Card.Text>{r.review}</Card.Text>
            <Card.Text>
              <small className="text-muted">
                {new Date(r.date).toLocaleString()}
              </small>
            </Card.Text>

            {user && user.id === r.user_id && (
              <>
                <Link
                  to={`/movies/${movieId}/review`}
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