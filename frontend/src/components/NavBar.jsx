'use client';
import '../assets/styles/NavBar.css';
import pokeball from '../assets/images/pokeballs/pokeball.png';

import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useRef, useState, useEffect } from 'react';
import { CgPokemon } from 'react-icons/cg';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  useColorMode,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

function NavBar({ myTeam }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const inputRef = useRef();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // Listen for changes to localStorage token
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    // Check initial state
    checkLoginStatus();

    // Add event listener for storage changes
    window.addEventListener('storage', checkLoginStatus);

    // Custom event listener for login/logout
    window.addEventListener('authStateChange', checkLoginStatus);

    // Check status on focus
    window.addEventListener('focus', checkLoginStatus);

    // Regular interval check (every 30 seconds)
    const interval = setInterval(checkLoginStatus, 30000);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('authStateChange', checkLoginStatus);
      window.removeEventListener('focus', checkLoginStatus);
      clearInterval(interval);
    };
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    const pokemonName = inputRef.current?.value.trim();
    if (pokemonName) {
      setSearch('');
      navigate(`/pokemon/${pokemonName}`);
      onClose();
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleLogin = () => {
    navigate('/login');
    onClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    onClose();
  };

  const handleLogout = () => {
    // Simply clear local storage and update UI state
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    setIsLoggedIn(false);

    // Notify other components about the logout
    window.dispatchEvent(new Event('authStateChange'));

    navigate('/');

    toast({
      title: 'Logged out successfully',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSignup = () => {
    navigate('/signup');
    onClose();
  };

  const bgColor = colorMode === 'light' ? 'gray.100' : 'gray.900';
  const searchButtonColor = colorMode === 'light' ? '#396bba' : '#e53e3e';

  const SearchBar = (
    <Box maxW="250px" ml={2}>
      <InputGroup borderRadius={50} size="sm">
        <InputLeftElement />
        <Input
          type="text"
          placeholder="Search Pokemon..."
          border="1px solid #949494"
          onChange={e => setSearch(e.target.value)}
          ref={inputRef}
          value={search}
          onKeyDown={handleKeyDown}
        />
        <InputRightAddon p={0} border="none">
          <Button
            size="sm"
            onClick={handleSubmit}
            borderLeftRadius={0}
            border="1px solid #949494"
            colorScheme="red"
            bg={searchButtonColor}
          >
            Search
          </Button>
        </InputRightAddon>
      </InputGroup>
    </Box>
  );

  // Define menu items based on authentication status
  const getMenuItems = () => {
    const commonItems = [
      <CustomMenuItem key="home" to="/">
        Home
      </CustomMenuItem>,
      <CustomMenuItem key="flip" to="/flip/">
        Pokemon Flip Game
      </CustomMenuItem>,
      <CustomMenuItem key="random" to="/random/">
        Get Random Pokemon
      </CustomMenuItem>,
      <CustomMenuItem key="list" to="/list/">
        Pokemon List
      </CustomMenuItem>,
      <CustomMenuItem key="team" to="/team">
        My Team #{myTeam.length}
      </CustomMenuItem>,
    ];

    const authItems = isLoggedIn
      ? [
          <MenuItem key="logout" onClick={handleLogout}>
            Logout
          </MenuItem>,
          <MenuItem key="profile" onClick={handleProfile}>
            Profile
          </MenuItem>,
        ]
      : [
          <MenuItem key="login" onClick={handleLogin}>
            Login
          </MenuItem>,
          <MenuItem key="signup" onClick={handleSignup}>
            Sign Up
          </MenuItem>,
        ];

    return [...commonItems, <MenuDivider key="divider" />, ...authItems];
  };

  return (
    <Box className="navBar" bg={bgColor} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Logo Section */}
        <Link className="link" to="/">
          <Box className="logo-title">
            P<CgPokemon className="inline-img" />
            KEDEX
          </Box>
        </Link>

        {/* Right Section */}
        <Flex alignItems="center">
          <Stack direction="row" spacing={7}>
            <Box display={{ base: 'none', md: 'block' }}>{SearchBar}</Box>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
            <Menu isOpen={isOpen} onClose={onClose}>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
                mr={2}
                onClick={onOpen}
              >
                <Avatar size="sm" src={pokeball} />
              </MenuButton>
              <MenuList alignItems="center">
                <Center>
                  <Avatar src={pokeball} />
                </Center>
                <Center>
                  <p>Menu</p>
                </Center>
                <MenuDivider />
                <Box display={{ base: 'block', md: 'none' }} p={2}>
                  {SearchBar}
                </Box>
                <MenuDivider />
                {getMenuItems()}
              </MenuList>
            </Menu>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}

const CustomMenuItem = ({ to, children }) => (
  <MenuItem>
    <Link className="link" to={to}>
      {children}
    </Link>
  </MenuItem>
);

export default NavBar;
