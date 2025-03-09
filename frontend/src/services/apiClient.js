import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://pokeapi.co/api/v2', // Base URL for PokeAPI
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
