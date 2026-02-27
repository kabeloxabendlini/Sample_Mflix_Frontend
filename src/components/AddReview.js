// Import React and useState hook for managing local component state
import React, { useState } from "react";

// Import Bootstrap form components
import { Form, Button } from "react-bootstrap";

// Import routing utilities from react-router-dom (v5)
import { Link, useParams, useLocation, useHistory } from "react-router-dom";

// Import the data service responsible for API calls
import MovieDataService from "../services/movies";


// Functional component receives `user` as a prop from App
const AddReview = ({ user }) => {

  // Extract movie id from URL parameters
  // Example: /movies/123 → movieId = 123
  const { id: movieId } = useParams();

  // Access route state (used when editing a review)
  const location = useLocation();

  // Allows programmatic navigation (redirects)
  const history = useHistory();

  // ---------------- Edit Mode Logic ----------------

  // Safely check if we received a review to edit via location.state
  const currentReview = location.state?.currentReview || null;

  // Boolean flag: true if editing an existing review
  const editing = Boolean(currentReview?._id);

  // ---------------- Component State ----------------

  // Review text (pre-filled if editing)
  const [review, setReview] = useState(currentReview?.review ?? "");

  // Track submission success
  const [submitted, setSubmitted] = useState(false);

  // Store validation or server errors
  const [error, setError] = useState("");

  // ---------------- Authentication Guard ----------------

  // If user is not logged in, prevent access
  if (!user) {
    return <p>Please log in to add or edit a review.</p>;
  }

  // ---------------- Save Review Function ----------------

  const saveReview = async () => {

    // Prevent empty review submission
    if (!review.trim()) {
      setError("Review cannot be empty.");
      return;
    }

    try {
      // Prepare data object to send to backend
      const data = {
        review: review.trim(),   // Clean whitespace
        name: user.name,         // Review author's name
        user_id: user.id,        // Logged-in user ID
        movie_id: movieId,       // Current movie ID
      };

      // If editing → update existing review
      if (editing) {
        data.review_id = currentReview._id;
        await MovieDataService.updateReview(data);
      } 
      // If creating → create new review
      else {
        await MovieDataService.createReview(data);
      }

      // Show success message
      setSubmitted(true);

      // Redirect back to movie details page after 1 second
      setTimeout(() => {
        history.push(`/movies/${movieId}`);
      }, 1000);

    } catch (e) {
      // Log error for debugging
      console.error("Error saving review:", e);

      // Display user-friendly error message
      setError("Failed to save review. Please try again.");
    }
  };

  // ---------------- Component UI ----------------

  return (
    <div className="mt-4">

      {/* Show success message after submission */}
      {submitted ? (
        <h4>Review submitted successfully!</h4>
      ) : (

        // Review form
        <Form>

          {/* Review input field */}
          <Form.Group className="mb-3">
            <Form.Label>
              {editing ? "Edit Review" : "Create Review"}
            </Form.Label>

            <Form.Control
              type="text"
              required
              value={review}
              onChange={(e) => setReview(e.target.value)} // Update state on input change
            />
          </Form.Group>

          {/* Display error if present */}
          {error && <p className="text-danger">{error}</p>}

          {/* Submit button */}
          <Button
            onClick={(e) => {
              e.preventDefault(); // Prevent default form reload
              saveReview();       // Call save function
            }}
          >
            Submit
          </Button>{" "}

          {/* Cancel button (navigates back to movie page) */}
          <Link to={`/movies/${movieId}`}>
            <Button variant="secondary">Cancel</Button>
          </Link>

        </Form>
      )}
    </div>
  );
};

// Export component for use in routing
export default AddReview;
