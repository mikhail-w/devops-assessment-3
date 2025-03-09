const BACKEND_API_BASE_URL = 'http://localhost:8000/api';

const backendApiClient = {
  // Handle API responses and error cases
  async handleResponse(response) {
    console.log('API Response:', {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers),
    });

    const data = await response.json().catch(e => {
      console.error('Error parsing JSON:', e);
      return {};
    });

    console.log('Response data:', data);

    if (!response.ok) {
      if (response.status === 401) {
        console.error('Authentication error - invalid or expired token');
        // Clear invalid tokens
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
      }
      throw new Error(
        data.error || `Request failed with status ${response.status}`
      );
    }
    return data;
  },

  // Update a user's Pokemon team (add/remove Pokemon)
  updateUserTeam: async (token, pokemonId, action) => {
    console.log('Updating team:', {
      pokemonId,
      action,
      hasToken: Boolean(token),
      tokenFirstChars: token ? token.substring(0, 20) + '...' : 'none',
    });

    if (!token) {
      console.error('No token provided for updateUserTeam');
      throw new Error('Authentication token is required');
    }

    try {
      console.log(
        'Making request to:',
        `${BACKEND_API_BASE_URL}/users/update_team/`
      );
      const response = await fetch(
        `${BACKEND_API_BASE_URL}/users/update_team/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ pokemon_id: pokemonId, action }),
          credentials: 'include',
        }
      );

      return await backendApiClient.handleResponse(response);
    } catch (error) {
      console.error('Update team error:', {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  },

  // Get the current user's Pokemon team
  getUserTeam: async token => {
    console.log(
      'Fetching team with token:',
      token ? token.substring(0, 20) + '...' : 'none'
    );
    try {
      const response = await fetch(`${BACKEND_API_BASE_URL}/users/team/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      return await backendApiClient.handleResponse(response);
    } catch (error) {
      console.error('Get team error:', {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  },

  // Register a new user
  signup: async (username, email, password) => {
    try {
      const response = await fetch(`${BACKEND_API_BASE_URL}/users/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include',
      });

      return await backendApiClient.handleResponse(response);
    } catch (error) {
      console.error('Signup error:', {
        message: error.message,
        stack: error.stack,
      });
      throw new Error('Sign up failed');
    }
  },

  // Login an existing user
  login: async (username, password) => {
    try {
      const response = await fetch(`${BACKEND_API_BASE_URL}/users/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await backendApiClient.handleResponse(response);
      // Store username along with tokens
      if (data.token) {
        localStorage.setItem('username', username);
        localStorage.setItem('token', data.token);
        localStorage.setItem('refresh', data.refresh);
      }

      return data;
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        stack: error.stack,
      });
      throw new Error('Login failed');
    }
  },

  // Logout the current user
  logout: async refreshToken => {
    try {
      const response = await fetch(`${BACKEND_API_BASE_URL}/users/logout/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
        credentials: 'include',
      });

      if (response.ok) {
        // Clear tokens on successful logout
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
      }

      return await backendApiClient.handleResponse(response);
    } catch (error) {
      console.error('Logout error:', {
        message: error.message,
        stack: error.stack,
      });
      throw new Error('Logout failed');
    }
  },
  updateHighScore: async (token, difficulty, score) => {
    console.log('Updating high score:', {
      difficulty,
      score,
      hasToken: Boolean(token),
    });

    try {
      const response = await fetch(
        `${BACKEND_API_BASE_URL}/users/update_high_score/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ difficulty, score }),
          credentials: 'include',
        }
      );

      return await backendApiClient.handleResponse(response);
    } catch (error) {
      console.error('Update high score error:', error);
      throw error;
    }
  },
  getLeaderboard: async (difficulty = 'all') => {
    try {
      const response = await fetch(
        `${BACKEND_API_BASE_URL}/users/leaderboard/?difficulty=${difficulty}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      return await backendApiClient.handleResponse(response);
    } catch (error) {
      console.error('Get leaderboard error:', error);
      throw error;
    }
  },
};

export default backendApiClient;
