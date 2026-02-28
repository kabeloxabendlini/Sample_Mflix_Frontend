// MovieDataService.js
// -------------------
// Axios instance + service class for all movie-related API calls
// Fully optimized for deployment with proper CORS and error handling

import axios from "axios";

// Create a single axios instance using environment variable
// Make sure REACT_APP_API_BASE_URL is set in your frontend .env
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL + "/api/v1/movies",
  withCredentials: true, // required if backend uses credentials/cookies
  timeout: 10000, // optional: 10s timeout for network requests
});

class MovieDataService {
  // Fetch all movies
  async getAll() {
    try {
      const res = await api.get("/");
      return res.data;
    } catch (error) {
      console.error("Error fetching all movies:", error);
      throw error;
    }
  }

  // Fetch a single movie by ID
  async get(id) {
    try {
      const res = await api.get(`/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching movie ${id}:`, error);
      throw error;
    }
  }

  // Fetch all available movie ratings
  async getRatings() {
    try {
      const res = await api.get("/ratings");
      return res.data;
    } catch (error) {
      console.error("Error fetching movie ratings:", error);
      throw error;
    }
  }

  // Search for movies dynamically
  async find(query, by) {
    try {
      const res = await api.get(`?${by}=${query}`);
      return res.data;
    } catch (error) {
      console.error(`Error searching movies by ${by} with query "${query}":`, error);
      throw error;
    }
  }

  // Create a new review for a movie
  async createReview(data) {
    try {
      const res = await api.post(`/${data.movie_id}/reviews`, data);
      return res.data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }

  // Update an existing review
  async updateReview(data) {
    try {
      const res = await api.put(`/${data.movie_id}/reviews`, data);
      return res.data;
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  }

  // Delete a review
  async deleteReview(reviewId, userId) {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/reviews`,
        {
          data: {
            review_id: reviewId,
            user_id: userId,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
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