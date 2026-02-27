// Import React hooks
import React, { useState, useEffect } from "react";

// Import Bootstrap layout and UI components
import { Row, Col, Card, Form, Button, Container } from "react-bootstrap";

// Import Link for navigation
import { Link } from "react-router-dom";

// Import service layer for API requests
import MovieDataService from "../services/movies";


/**moviesList component - displays list of movies with search and filter functionality
 * Inline SVG fallback image
 * Prevents broken image icon if poster fails to load
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

const MoviesList = () => {

  // ---------------- State ----------------

  // Store all movies retrieved from backend
  const [movies, setMovies] = useState([]);

  // Store rating categories for dropdown filter
  const [ratings, setRatings] = useState(["All Ratings"]);

  // Store search input (title)
  const [searchTitle, setSearchTitle] = useState("");

  // Store selected rating filter
  const [searchRating, setSearchRating] = useState("All Ratings");


  // ---------------- Lifecycle ----------------

  /**
   * Runs once when component mounts
   * Fetches all movies and rating categories
   */
  useEffect(() => {
    retrieveMovies();
    retrieveRatings();
  }, []);


  // ---------------- Data Fetching ----------------

  /**
   * Retrieve all movies from backend
   */
  const retrieveMovies = () => {
    MovieDataService.getAll()
      .then((res) => setMovies(res.data.movies))
      .catch((e) => console.error(e));
  };

  /**
   * Retrieve list of available ratings (e.g. PG, R, etc.)
   */
  const retrieveRatings = () => {
    MovieDataService.getRatings()
      .then((res) => setRatings(["All Ratings", ...res.data]))
      .catch((e) => console.error(e));
  };


  // ---------------- Search Logic ----------------

  /**
   * Generic find function
   * @param query - search value
   * @param by - field to search by (title or rated)
   */
  const find = (query, by) => {
    MovieDataService.find(query, by)
      .then((res) => setMovies(res.data.movies))
      .catch((e) => console.error(e));
  };

  /**
   * Search movies by title
   */
  const findByTitle = () => find(searchTitle, "title");

  /**
   * Filter movies by rating
   */
  const findByRating = () => {
    if (searchRating === "All Ratings") {
      retrieveMovies(); // Reset filter
    } else {
      find(searchRating, "rated");
    }
  };


  // ---------------- Image Error Handling ----------------

  /**
   * Replace broken poster image with fallback
   */
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = FALLBACK_IMAGE;
  };


  // ---------------- UI ----------------

  return (
    <Container>
      <h2>Movies</h2>

      {/* ------------ Search Form ------------ */}
      <Form className="mb-3">
        <Row>

          {/* Search by Title */}
          <Col>
            <Form.Control
              type="text"
              placeholder="Search by title"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
            <Button className="mt-2" onClick={findByTitle}>
              Search by Title
            </Button>
          </Col>

          {/* Filter by Rating */}
          <Col>
            <Form.Select
              value={searchRating}
              onChange={(e) => setSearchRating(e.target.value)}
            >
              {ratings.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </Form.Select>

            <Button className="mt-2" onClick={findByRating}>
              Filter by Rating
            </Button>
          </Col>

        </Row>
      </Form>


      {/* ------------ Movies Grid ------------ */}
      <Row>
        {movies.length ? (

          // Map through movies safely
          movies.map((movie) => (
            <Col key={movie._id} md={3} className="mb-4">
              <Card>

                {/* Movie Poster */}
                <Card.Img
                  src={movie.poster || FALLBACK_IMAGE}
                  onError={handleImageError}
                  style={{ height: "300px", objectFit: "cover" }}
                />

                {/* Movie Details */}
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <Card.Text>Rating: {movie.rated}</Card.Text>

                  {/* Navigate to movie detail page */}
                  <Link to={`/movies/${movie._id}`}>
                    View Reviews
                  </Link>
                </Card.Body>

              </Card>
            </Col>
          ))

        ) : (
          <p>No movies found.</p>
        )}
      </Row>
    </Container>
  );
};

// Export component
export default MoviesList;
