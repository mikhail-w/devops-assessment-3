import { useState, useEffect } from 'react';
import backendApiClient from './services/backendApiClient';
import NavBar from './components/NavBar';
import { Outlet, useNavigate } from 'react-router-dom';
import './App.css';
import { getRandomID } from './utils';

function App() {
  const [team, setTeam] = useState([]);
  const [myTeam, setMyTeam] = useState([]);
  const [valid, setValid] = useState(false);
  const [passed, setPassed] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pokemon, setPokemon] = useState(null);
  const [randomID, setrandomID] = useState(getRandomID(999));
  const navigate = useNavigate();

  // Function to fetch user team
  const fetchUserTeam = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const data = await backendApiClient.getUserTeam(token);
        setMyTeam(data.current_team);
      } catch (error) {
        console.error('Failed to fetch user team:', error);
        // Handle token expiration
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh');
          setMyTeam([]);
          navigate('/login');
        }
      }
    }
  };

  // Initial team fetch
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserTeam();
    }
  }, []);

  // Listen for auth state changes to update team data
  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem('token');
      if (token) {
        fetchUserTeam();
      } else {
        setMyTeam([]);
      }
    };

    window.addEventListener('authStateChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('authStateChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  return (
    <>
      <NavBar myTeam={myTeam} isLoading={isLoading} />
      <Outlet
        context={{
          team,
          setTeam,
          passed,
          setPassed,
          myTeam,
          valid,
          setValid,
          setMyTeam,
          disabled,
          setDisabled,
          isLoading,
          setIsLoading,
          pokemon,
          setPokemon,
          randomID,
          setrandomID,
          fetchUserTeam,
        }}
      />
    </>
  );
}

export default App;
