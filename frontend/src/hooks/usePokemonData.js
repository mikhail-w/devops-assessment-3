import { useState, useCallback } from 'react';
import {
  getPokemonSpecies,
  getEvolutionChain,
} from '../services/pokemonService';

export function usePokemonData() {
  const [pokeInfo, setPokeInfo] = useState(null); // Assume only one Pokemon is fetched at a time
  const [flavorTextArray, setFlavorTextArray] = useState([]);
  const [evoNames, setEvoNames] = useState([]);

  const fetchPokemonData = useCallback(async id => {
    try {
      // Fetch species data
      const speciesData = await getPokemonSpecies(id);

      // Remove duplicate flavor text entries
      const uniqueFlavorTexts = Array.from(
        new Set(
          speciesData.flavor_text_entries
            .filter(entry => entry.language.name === 'en')
            .map(entry => entry.flavor_text)
        )
      );

      // Update state in a single batch
      setPokeInfo(speciesData);
      setFlavorTextArray(uniqueFlavorTexts);

      // Fetch evolution data
      const evolutionData = await getEvolutionChain(
        speciesData.evolution_chain.url
      );

      // Build evolution chain
      const evoChain = [];
      let evoData = evolutionData.chain;

      while (evoData) {
        const evoDetails = evoData.evolution_details[0] || {};
        const idMatch = evoData.species.url.match(/\/(\d+)\/$/);

        evoChain.push({
          species_name: evoData.species.name,
          id: idMatch ? idMatch[1] : null,
          min_level: evoDetails.min_level || 1,
          trigger_name: evoDetails.trigger?.name || null,
          item: evoDetails.item || null,
        });

        evoData = evoData.evolves_to[0]; // Move to the next evolution stage
      }

      setEvoNames(evoChain.map(({ species_name, id }) => [species_name, id]));
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    }
  }, []); // Dependencies array ensures memoization

  return {
    pokeInfo,
    flavorTextArray,
    evoNames,
    fetchPokemonData,
  };
}
