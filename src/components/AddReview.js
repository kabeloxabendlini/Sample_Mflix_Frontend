import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import MovieDataService from "../services/movies";

const AddReview = ({ user }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const currentReview = location.state?.currentReview;
  const editing = Boolean(currentReview);

  const [text, setText] = useState(currentReview?.review || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Review cannot be empty.");
      return;
    }

    try {
      setLoading(true);

      if (editing) {
        await MovieDataService.updateReview({
          movie_id: id,
          review_id: currentReview._id,
          user_id: user.id,
          text,
        });
      } else {
        await MovieDataService.createReview({
          movie_id: id,
          user_id: user.id,
          name: user.name,
          text,
        });
      }

      navigate(`/movies/${id}`);

    } catch (err) {
      console.error(err);
      setError("Failed to save review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">

      <Button variant="secondary" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <h3 className="mt-3">
        {editing ? "Edit Review" : "Add Review"}
      </h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" animation="border" /> Saving...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </Form>

    </div>
  );
};

export default AddReview;