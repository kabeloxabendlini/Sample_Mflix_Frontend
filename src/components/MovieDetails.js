import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import MovieDataService from "../services/movies";

const MovieDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const data = await MovieDataService.get(id);
      setMovie(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load movie.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await MovieDataService.deleteReview(id, reviewId, user.id);
      fetchMovie(); // refresh after delete
    } catch (err) {
      console.error(err);
      setError("Failed to delete review.");
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (!movie) return <Alert variant="danger">Movie not found.</Alert>;

  return (
    <div className="container mt-4">

      <Button variant="secondary" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <h2 className="mt-3">{movie.title}</h2>
      <p>{movie.plot}</p>

      {user && (
        <Link to={`/movies/${id}/review`}>
          <Button className="mb-3">Add Review</Button>
        </Link>
      )}

      <h4>Reviews</h4>

      {!movie.reviews?.length && <p>No reviews yet.</p>}

      {movie.reviews?.map((r) => (
        <Card key={r._id} className="mb-3">
          <Card.Body>
            <Card.Title>{r.name}</Card.Title>
            <Card.Text>{r.review}</Card.Text>
            <small>
              {new Date(r.date).toLocaleString()}
            </small>

            {user && user.id === r.user_id && (
              <>
                <Link
                  to={`/movies/${id}/review`}
                  state={{ currentReview: r }}
                >
                  <Button size="sm" variant="warning" className="ms-2">
                    Edit
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant="danger"
                  className="ms-2"
                  onClick={() => handleDelete(r._id)}
                >
                  Delete
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      ))}

      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default MovieDetails;