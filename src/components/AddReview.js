import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import MovieDataService from "../services/movies";

const AddReview = ({ user }) => {
  const { id: movieId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const currentReview = location.state?.currentReview || null;
  const editing = Boolean(currentReview?._id);

  const [review, setReview] = useState(currentReview?.review ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const saveReview = async () => {
    if (!review.trim()) {
      setError("Review cannot be empty.");
      return;
    }

    if (!user) {
      setError("You must be logged in.");
      return;
    }

    try {
      setLoading(true);

      if (editing) {
        await MovieDataService.updateReview({
          movie_id: movieId,
          review_id: currentReview._id,
          user_id: user.id,
          text: review.trim(),
        });
      } else {
        await MovieDataService.createReview({
          movie_id: movieId,
          user_id: user.id,
          name: user.name,
          text: review.trim(),
        });
      }

      setSubmitted(true);

      // Go back to movie details page
      setTimeout(() => navigate(`/movies/${movieId}`), 500);
    } catch (e) {
      console.error(e);
      setError("Failed to save review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {submitted && (
        <Alert variant="success">
          Review saved successfully!
        </Alert>
      )}

      {!submitted && (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              {editing ? "Edit Review" : "Create Review"}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}

          <Button
            onClick={(e) => {
              e.preventDefault();
              saveReview();
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Saving...
              </>
            ) : (
              "Submit"
            )}
          </Button>{" "}
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </Button>
        </Form>
      )}
    </div>
  );
};

export default AddReview;