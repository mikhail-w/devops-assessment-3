import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Container,
  useColorModeValue,
  Link,
  Alert,
  AlertIcon,
  Code,
  useToast,
} from '@chakra-ui/react';
import backendApiClient from '../services/backendApiClient';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { username, password } = formData;
      const data = await backendApiClient.login(username, password);

      setDebugInfo({
        status: 'success',
        message: 'Login successful!',
        details: data,
      });

      localStorage.setItem('token', data.access);
      localStorage.setItem('refresh', data.refresh);

      // Dispatch auth state change event before navigation
      window.dispatchEvent(new Event('authStateChange'));

      toast({
        title: 'Login successful!',
        description: "You're now logged in. Redirecting...",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Wait 2 seconds before redirecting to let user see the success message
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      setError(err.message);
      setDebugInfo({
        status: 'error',
        message: err.message,
        details: err,
      });

      toast({
        title: 'Login failed',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const bg = useColorModeValue('gray.50', 'gray.800');
  const boxBg = useColorModeValue('white', 'gray.700');

  return (
    <Box bg={bg} py={12} px={4} minH="90vh">
      <Container maxW="lg">
        <Box bg={boxBg} p={8} borderRadius="lg" boxShadow="lg">
          <VStack spacing={6} as="form" onSubmit={handleSubmit}>
            <Heading size="lg">Log In</Heading>

            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}

            {debugInfo && (
              <Alert
                status={debugInfo.status === 'success' ? 'success' : 'info'}
              >
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold">{debugInfo.message}</Text>
                  <Code fontSize="sm" whiteSpace="pre-wrap">
                    {JSON.stringify(debugInfo.details, null, 2)}
                  </Code>
                </Box>
              </Alert>
            )}

            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                size="lg"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                size="lg"
              />
            </FormControl>

            <Button
              colorScheme="blue"
              size="lg"
              width="full"
              type="submit"
              isLoading={isLoading}
              loadingText="Logging in..."
              mt={4}
            >
              Log In
            </Button>

            <Text>
              Don't have an account?{' '}
              <Link color="blue.500" onClick={() => navigate('/signup')}>
                Sign up
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginPage;
