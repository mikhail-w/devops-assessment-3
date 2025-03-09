import apiClient from './apiClient';

export const getPokemonSpecies = async pokemonId => {
  const response = await apiClient.get(`/pokemon-species/${pokemonId}`);
  return response.data;
};

export const getEvolutionChain = async url => {
  const response = await apiClient.get(url);
  return response.data;
};

export const getPokemonById = async id => {
  const response = await apiClient.get(`/pokemon/${id}`);
  return response.data;
};

export const getPokemonByName = async name => {
  const response = await apiClient.get(`/pokemon/${name.toLowerCase()}`);
  return response.data;
};

export const getPokemonTeam = async typeUrl => {
  const response = await apiClient.get(typeUrl);
  return response.data;
};

export const getPokemonByType = async typeUrl => {
  const response = await apiClient.get(typeUrl);
  return response.data;
};
