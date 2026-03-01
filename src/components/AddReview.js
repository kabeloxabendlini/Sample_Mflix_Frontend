import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner, Card, Image } from "react-bootstrap";
import { Link, useParams, useLocation, useHistory } from "react-router-dom";
import MovieDataService from "../services/movies";

const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="300">
      <rect width="100%" height="100%" fill="#ddd"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-size="16" fill="#555">No Image</text>
    </svg>
  `);

const AddReview = ({ user }) => {
  const { id: movieId } = useParams();
  const location = useLocation();
  const history = useHistory();

  const currentReview = location.state?.currentReview || null;
  const editing = Boolean(currentReview?._id);

  const [movie, setMovie] = useState(null);
  const [review, setReview] = useState(currentReview?.review ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMovie, setLoadingMovie] = useState(true);

  // Fetch movie info
  useEffect(() => {
    const fetchMovie = async () => {
      setLoadingMovie(true);
      try {
        const data = await MovieDataService.get(movieId);
        setMovie({
          id: data._id,
          title: data.title,
          poster: data.poster,
          plot: data.plot,
          rated: data.rated,
          release_year: data.release_year,
          runtime: data.runtime,
          genre: data.genre,
        });
      } catch (e) {
        console.error(e);
        setError("Failed to load movie info.");
      } finally {
        setLoadingMovie(false);
      }
    };
    fetchMovie();
  }, [movieId]);

  // Pre-fill review only if creating new review
  useEffect(() => {
    if (!editing && movie) {
      setReview((prev) =>
        prev.trim() === "" 
          ? `I watched this ${movie.genre || ""} movie released in ${movie.release_year || ""}. ` 
          : prev
      );
    }
  }, [movie, editing]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGE;
  };

  const saveReview = async () => {
    if (!review.trim()) {
      setError("Review cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = {
        review: review.trim(),
        name: user.name,
        user_id: user.id,
        movie_id: movieId,
      };
      if (editing) data.review_id = currentReview._id;

      await (editing
        ? MovieDataService.updateReview(data)
        : MovieDataService.createReview(data));

      setSubmitted(true);
      setTimeout(() => history.push(`/movies/${movieId}`), 1000);
    } catch (e) {
      console.error(e);
      setError("Failed to save review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingMovie) return <Spinner animation="border" variant="primary" />;

  return (
    <div className="mt-4">
      {!user && <Alert variant="warning">Please log in to add or edit a review.</Alert>}

      {movie && (
        <Card className="mb-3">
          <Card.Body className="d-flex align-items-start">
            <Image
              src={movie.poster && movie.poster.startsWith("http") ? movie.poster : FALLBACK_IMAGE}
              onError={handleImageError}
              style={{ width: "100px", height: "150px", objectFit: "cover", marginRight: "1rem" }}
            />
            <div>
              <Card.Title>{movie.title}</Card.Title>
              <Card.Text style={{ fontStyle: "italic" }}>{movie.plot || "No plot available."}</Card.Text>
              <Card.Text>
                <strong>Rating:</strong> {movie.rated || "N/A"} |{" "}
                {movie.release_year && <>Year: {movie.release_year} | </>}
                {movie.runtime && <>Runtime: {movie.runtime} min | </>}
                {movie.genre && <>Genre: {movie.genre}</>}
              </Card.Text>
            </div>
          </Card.Body>
        </Card>
      )}

      {submitted && <Alert variant="success">Review submitted successfully!</Alert>}

      {!submitted && user && (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{editing ? "Edit Review" : "Create Review"}</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              required
              value={review}
              onChange={(e) => setReview(e.target.value)}
              disabled={loading}
              placeholder="Write your review here..."
            />
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}

          <Button
            onClick={(e) => { e.preventDefault(); saveReview(); }}
            disabled={loading}
          >
            {loading ? <><Spinner as="span" animation="border" size="sm" /> Saving...</> : "Submit"}
          </Button>{" "}
          <Link to={`/movies/${movieId}`}>
            <Button variant="secondary" disabled={loading}>Cancel</Button>
          </Link>
        </Form>
      )}
    </div>
  );
};

export default AddReview;