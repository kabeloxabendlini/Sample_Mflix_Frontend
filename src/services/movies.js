// MovieDataService.js
// -------------------
// Axios instance + service class for all movie-related API calls

import axios from "axios";

// Create a single axios instance using environment variable
// REACT_APP_API_BASE_URL must be set in your frontend .env
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL + "/api/v1/movies",
});

class MovieDataService {
  /**
   * Fetch all movies
   * GET /api/v1/movies/
   */
  getAll() {
    return api.get("/");
  }

  /**
   * Fetch a single movie by ID
   * GET /api/v1/movies/:id
   * @param {string} id - Movie ID
   */
  get(id) {
    return api.get(`/${id}`);
  }

  /**
   * Fetch all available movie ratings
   * GET /api/v1/movies/ratings
   */
  getRatings() {
    return api.get("/ratings");
  }

  /**
   * Search for movies dynamically
   * Example: find("Inception", "title") → GET /?title=Inception
   * @param {string} query - Search term
   * @param {string} by - Field to search by (title, rated, etc.)
   */
  find(query, by) {
    return api.get(`?${by}=${query}`);
  }

  /**
   * Create a new review for a movie
   * POST /api/v1/movies/:movie_id/reviews
   * @param {object} data - { movie_id, review, name, user_id }
   */
  createReview(data) {
    return api.post(`/${data.movie_id}/reviews`, data);
  }

  /**
   * Update an existing review
   * PUT /api/v1/movies/:movie_id/reviews
   * @param {object} data - { review_id, movie_id, review, user_id }
   */
  updateReview(data) {
    return api.put(`/${data.movie_id}/reviews`, data);
  }

  /**
   * Delete a review
   * DELETE /api/v1/movies/reviews
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

// Export a single instance
const movieDataService = new MovieDataService();
export default movieDataService;

// frontend/src/services/MovieDataService.js
// ----------------------------------------
// Axios instance + service class for all movie-related API calls

// import axios from "axios";

// // Create a single axios instance using environment variable
// // Make sure your frontend .env has:
// // REACT_APP_API_BASE_URL=https://sample-mflix-backend.onrender.com
// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE_URL + "/api/v1/movies", // base path for all movie endpoints
//   withCredentials: true, // send cookies if needed
// });

// class MovieDataService {
//   // Fetch all movies
//   getAll() {
//     return api.get("/"); // GET /api/v1/movies/
//   }

//   // Fetch a single movie by ID
//   get(id) {
//     return api.get(`/${id}`); // GET /api/v1/movies/:id
//   }

//   // Fetch all available movie ratings
//   getRatings() {
//     return api.get("/ratings"); // GET /api/v1/movies/ratings
//   }

//   // Search for movies by field
//   find(query, by) {
//     return api.get(`?${by}=${query}`); // GET /api/v1/movies?title=...
//   }

//   // Create a new review
//   createReview(data) {
//     return api.post(`/${data.movie_id}/review`, data); 
//     // POST /api/v1/movies/:movie_id/review
//   }

//   // Update an existing review
//   updateReview(data) {
//     return api.put(`/${data.movie_id}/review`, data);
//     // PUT /api/v1/movies/:movie_id/review
//   }

//   // Delete a review
//   deleteReview(reviewId, userId) {
//     return api.delete("/review", {
//       data: { review_id: reviewId, user_id: userId },
//     });
//   }
// }

// // Export a single instance
// const movieDataService = new MovieDataService();
// export default movieDataService;