import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Image,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Card,
  CardBody,
  Heading,
  Divider,
  Badge,
  SimpleGrid,
  Button,
  Flex,
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import backendApiClient from '../services/backendApiClient';
import Loading from '../components/Loading';
import { getType } from '../utils';
import { getPokemonById } from '../services/pokemonService';
import defaultImage from '../assets/images/default.png';
import DemoCard from '../components/DemoCard';

// Custom hooks for data fetching and state management
const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await backendApiClient.getUserTeam(token);

        setUserData({
          username: response?.username,
          teamCount: response?.current_team?.length || 0,
          joinDate: new Date().toLocaleDateString(),
          easy_high_score: response?.easy_high_score,
          medium_high_score: response?.medium_high_score,
          hard_high_score: response?.hard_high_score,
          easy_rank: response?.easy_rank,
          medium_rank: response?.medium_rank,
          hard_rank: response?.hard_rank,
        });

        if (response?.current_team?.length > 0) {
          const pokemonResponses = await Promise.all(
            response.current_team.map(id => getPokemonById(id))
          );
          setPokemonData(pokemonResponses.filter(pokemon => pokemon !== null));
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
        setError(error);
        setUserData({
          username: 'Trainer',
          teamCount: 0,
          joinDate: new Date().toLocaleDateString(),
          easy_high_score: null,
          medium_high_score: null,
          hard_high_score: null,
          easy_rank: null,
          medium_rank: null,
          hard_rank: null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  return { userData, pokemonData, loading, error };
};

// Reusable components
const ProfileHeader = ({ username }) => (
  <Card>
    <Box
      bgGradient="linear(to-r, yellow.400, yellow.300, yellow.400)"
      p={1}
      borderRadius="xl"
    >
      <Box bg="blue.600" p="2px" borderRadius="xl">
        <Box
          bgGradient="linear(to-r, yellow.400, yellow.300, yellow.400)"
          p={8}
          borderRadius="xl"
        >
          <VStack spacing={4}>
            <Image
              src={defaultImage}
              alt="Profile"
              width="150px"
              height="150px"
              objectFit="cover"
            />
            <Heading
              fontFamily={'Alleyn W01 Regular'}
              textTransform={'capitalize'}
              color="blue.900"
              size="lg"
            >
              {username}'s Profile
            </Heading>
            <Badge
              colorScheme="purple"
              color={'black'}
              fontSize="md"
              px={4}
              py={1}
              borderRadius="full"
            >
              Pokémon Trainer
            </Badge>
          </VStack>
        </Box>
      </Box>
    </Box>
  </Card>
);

const StatCard = ({ label, value, color = 'yellow.500' }) => (
  <Card>
    <CardBody>
      <StatGroup>
        <Stat>
          <StatLabel
            color={useColorModeValue('blue.900', 'white')}
            fontWeight="semibold"
          >
            {label}
          </StatLabel>
          <StatNumber color={color}>{value}</StatNumber>
        </Stat>
      </StatGroup>
    </CardBody>
  </Card>
);

const DifficultyCard = ({ difficulty, score, rank, color }) => (
  <Box
    p={5}
    shadow="md"
    borderWidth="1px"
    borderRadius="lg"
    bg={useColorModeValue('white', 'gray.700')}
  >
    <Text fontSize="lg" fontWeight="bold" color={color} mb={2}>
      {difficulty}
    </Text>
    <StatGroup>
      <Stat>
        <StatLabel>Best Score</StatLabel>
        <StatNumber>
          {score === null ? 'No games played' : `${score} turns`}
        </StatNumber>
        <StatLabel mt={2}>Your Ranking</StatLabel>
        <StatNumber fontSize="lg" color={color}>
          {rank ? `#${rank}` : 'Not ranked'}
        </StatNumber>
      </Stat>
    </StatGroup>
  </Box>
);

const PokemonTeamSection = ({ pokemonData, headingColor }) => (
  <Card>
    <CardBody>
      <Heading
        fontFamily={'Alleyn W01 Regular'}
        textTransform={'uppercase'}
        size="md"
        mb={4}
        color={headingColor}
      >
        Current Team
      </Heading>
      <Divider mb={10} />

      {pokemonData.length > 0 ? (
        <Box width="100%">
          <Flex direction="column" align="center">
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={5}
              width="100%"
              justifyItems="center"
            >
              {pokemonData.map(
                pokemon =>
                  pokemon && (
                    <Box key={pokemon.id} maxW="sm" width="100%">
                      <DemoCard
                        id={pokemon.id}
                        name={pokemon.name}
                        type={getType(pokemon.types)}
                        isCaught={'True'}
                        imageUrl={
                          pokemon.sprites?.other?.['official-artwork']
                            ?.front_default
                        }
                      />
                    </Box>
                  )
              )}
            </SimpleGrid>
          </Flex>
        </Box>
      ) : (
        <Text textAlign="center" color="gray.500">
          No Pokémon in team yet
        </Text>
      )}
    </CardBody>
  </Card>
);

const ProfilePage = () => {
  const { userData, pokemonData, loading, error } = useUserData();
  const navigate = useNavigate();
  const headingColor = useColorModeValue('blue.900', 'white');

  const teamPower = useMemo(
    () =>
      pokemonData.reduce(
        (sum, pokemon) => sum + (pokemon?.base_experience || 0),
        0
      ),
    [pokemonData]
  );

  if (loading) {
    return (
      <Box h="80vh" display="flex" alignItems="center" justifyContent="center">
        <Loading />
      </Box>
    );
  }

  if (error) {
    return (
      <Box h="80vh" display="flex" alignItems="center" justifyContent="center">
        <Text color="red.500">Error loading profile. Please try again.</Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" pt={'70px'} pb={'50px'}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Profile Header */}
          <ProfileHeader username={userData?.username} />

          {/* Stats Section */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {[
              { label: 'Team Size', value: userData?.teamCount || 0 },
              { label: 'Trainer Since', value: userData?.joinDate || '-' },
              { label: 'Team Power', value: teamPower },
            ].map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </SimpleGrid>

          {/* High Scores Section */}
          <Card>
            <CardBody>
              <Heading size="md" mb={4} color={headingColor}>
                Memory Game High Scores
              </Heading>
              <Divider mb={6} />
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                {[
                  {
                    difficulty: 'Easy',
                    score: userData?.easy_high_score,
                    rank: userData?.easy_rank,
                    color: 'green.500',
                  },
                  {
                    difficulty: 'Medium',
                    score: userData?.medium_high_score,
                    rank: userData?.medium_rank,
                    color: 'yellow.500',
                  },
                  {
                    difficulty: 'Hard',
                    score: userData?.hard_high_score,
                    rank: userData?.hard_rank,
                    color: 'red.500',
                  },
                ].map((level, index) => (
                  <DifficultyCard key={index} {...level} />
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Pokemon Team Section */}
          <PokemonTeamSection
            pokemonData={pokemonData}
            headingColor={headingColor}
          />

          {/* Navigation */}
          <HStack spacing={4} justify="center">
            <Button
              colorScheme="blue"
              onClick={() => navigate('/team')}
              size="lg"
              borderRadius="full"
            >
              Manage Team
            </Button>
            <Button
              colorScheme="green"
              onClick={() => navigate('/random')}
              size="lg"
              borderRadius="full"
            >
              Catch Pokémon
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default ProfilePage;
