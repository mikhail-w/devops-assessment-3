import { isInTeam } from '../../utils';
import { motion } from 'framer-motion';
import { useMemo, useEffect } from 'react';
import { TbPokeballOff } from 'react-icons/tb';
import { useOutletContext } from 'react-router-dom';
import { Box, Image, Tooltip } from '@chakra-ui/react';
import { useToastNotification } from '../../hooks/useToastNotification';
import backendApiClient from '../../services/backendApiClient';

// Import Pokéball images for different states
import catch01 from '../../assets/images/pokeballs/catch1_100.png';
import catch02 from '../../assets/images/pokeballs/catch2_100.png';

function CatchReleaseButton({ id, name }) {
  const { myTeam, setMyTeam } = useOutletContext();
  const { showToast } = useToastNotification();
  // Get authentication token from localStorage
  const token = localStorage.getItem('token');
  const isLoggedIn = Boolean(token);

  // Check if the Pokémon is already in the team
  const isPokemonInTeam = useMemo(() => isInTeam(myTeam, id), [myTeam, id]);

  // Disable button if non-logged in user has reached team limit
  const disabled = useMemo(
    () => !isLoggedIn && myTeam.length >= 6 && !isPokemonInTeam,
    [myTeam, isPokemonInTeam, isLoggedIn]
  );

  // Handle catching/releasing Pokémon
  const handleClick = async () => {
    // Check team size limit for non-logged in users
    if (!isLoggedIn && myTeam.length >= 6 && !isPokemonInTeam) {
      showToast('Team limit reached! Log in to add more Pokémon', 'warning');
      return;
    }

    const action = isPokemonInTeam ? 'release' : 'catch';

    try {
      if (isLoggedIn) {
        // Verify token exists for logged-in users
        const accessToken = localStorage.getItem('token');
        if (!accessToken) {
          showToast('Please log in to manage your team', 'error');
          return;
        }

        // Make API call to update team on backend
        const data = await backendApiClient.updateUserTeam(
          accessToken,
          id,
          action
        );

        // Update local state if backend call succeeds
        if (data && data.current_team) {
          setMyTeam(data.current_team);
          showToast(
            `Pokémon ${name} ${
              action === 'catch' ? 'caught' : 'released'
            } successfully!`,
            'success'
          );
        }
      } else {
        // Handle team updates for non-authenticated users
        if (action === 'catch' && myTeam.length < 6) {
          setMyTeam(prev => [...prev, id]);
        } else if (action === 'release') {
          setMyTeam(prev => prev.filter(pokemonId => pokemonId !== id));
        }

        showToast(
          `Pokémon ${name} ${
            action === 'catch' ? 'caught' : 'released'
          } successfully!`,
          'success'
        );
      }
    } catch (error) {
      console.error('Team update error:', error);
      // Handle authentication errors
      if (error.response?.status === 401) {
        showToast('Your session has expired. Please log in again.', 'error');
        // Optional: Redirect to login page or handle token expiration
      } else {
        showToast(`Failed to ${action} Pokémon. Please try again.`, 'error');
      }
    }
  };

  return (
    <Tooltip
      label={
        disabled
          ? 'Team is full! Log in to add more Pokémon'
          : isPokemonInTeam
          ? 'Release'
          : 'Catch'
      }
      fontSize="lg"
      hasArrow
    >
      <Box
        w="1.6rem"
        h="1.6rem"
        className={
          disabled ? 'disabled' : isPokemonInTeam ? 'release' : 'catch'
        }
        onClick={handleClick}
        cursor={disabled ? 'not-allowed' : 'pointer'}
      >
        {disabled ? (
          <TbPokeballOff size={30} className="disabled-icon" />
        ) : (
          <motion.div whileHover={{ scale: 1.2, rotate: 180 }}>
            <Image src={isPokemonInTeam ? catch02 : catch01} alt="Poké Ball" />
          </motion.div>
        )}
      </Box>
    </Tooltip>
  );
}

export default CatchReleaseButton;
