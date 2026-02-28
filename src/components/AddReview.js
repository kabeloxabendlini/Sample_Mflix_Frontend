import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useParams, useLocation, useHistory } from "react-router-dom";
import MovieDataService from "../services/movies";

const AddReview = ({ user }) => {
  const { id: movieId } = useParams();
  const location = useLocation();
  const history = useHistory();

  const currentReview = location.state?.currentReview || null;
  const editing = Boolean(currentReview?._id);

  const [review, setReview] = useState(currentReview?.review ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <Alert variant="warning">Please log in to add or edit a review.</Alert>;
  }

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

      editing ? await MovieDataService.updateReview(data) : await MovieDataService.createReview(data);

      setSubmitted(true);
      setTimeout(() => history.push(`/movies/${movieId}`), 1000);
    } catch (e) {
      console.error(e);
      setError("Failed to save review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {submitted && <Alert variant="success">Review submitted successfully!</Alert>}

      {!submitted && (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{editing ? "Edit Review" : "Create Review"}</Form.Label>
            <Form.Control
              type="text"
              required
              value={review}
              onChange={(e) => setReview(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}

          <Button onClick={(e) => { e.preventDefault(); saveReview(); }} disabled={loading}>
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