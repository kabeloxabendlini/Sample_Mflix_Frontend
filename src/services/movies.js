// Import axios for making HTTP requests to the backend API
import axios from "axios";

/**
 * Create a reusable axios instance
 * This sets a base URL so you don't have to repeat it in every request.
 * All requests from this instance will automatically prepend this URL.
 */
const api = axios.create({
  baseURL: "http://localhost:5000/api/v1/movies",
});


/**
 * Service class responsible for handling
 * all movie-related API communication.
 *
 * Keeps API logic separate from UI components
 * (Good separation of concerns / clean architecture)
 */
class MovieDataService {

  /**
   * Fetch all movies
   * GET http://localhost:5000/api/v1/movies/
   */
  getAll() {
    return api.get("/");
  }

  /**
   * Fetch a single movie by its ID
   * @param {string} id - Movie ID
   * GET /:id
   */
  get(id) {
    return api.get(`/${id}`);
  }

  /**
   * Fetch all available movie ratings
   * Example response: ["G", "PG", "PG-13", "R"]
   * GET /ratings
   */
  getRatings() {
    return api.get("/ratings");
  }

  /**
   * Search for movies dynamically
   * Example: find("Inception", "title")
   * → GET ?title=Inception
   *
   * @param {string} query - Search value
   * @param {string} by - Field to search by (title, rated, etc.)
   */
  find(query, by) {
    return api.get(`?${by}=${query}`);
  }

  /**
   * Create a new review for a specific movie
   * POST /:movie_id/reviews
   *
   * Expected data object:
   * {
   *   movie_id,
   *   review,
   *   name,
   *   user_id
   * }
   */
  createReview(data) {
    return api.post(`/${data.movie_id}/reviews`, data);
  }

  /**
   * Update an existing review
   * PUT /:movie_id/reviews
   *
   * Expected data object:
   * {
   *   review_id,
   *   movie_id,
   *   review,
   *   user_id
   * }
   */
  updateReview(data) {
    return api.put(`/${data.movie_id}/reviews`, data);
  }

  /**
   * Delete a review
   * DELETE /reviews
   *
   * axios allows sending a request body
   * in DELETE using the "data" property.
   *
   * @param {string} reviewId
   * @param {string} userId
   */
  deleteReview(reviewId, userId) {
    return api.delete("/reviews", {
      data: {
        review_id: reviewId,
        user_id: userId,
      },
    });
  }
}


/**
 * Create a single instance of the service
 * This ensures consistent configuration
 * and avoids creating multiple axios instances
 */
const movieDataService = new MovieDataService();

/**
 * Export the instance
 * So it can be imported anywhere in the app
 */
export default movieDataService;
