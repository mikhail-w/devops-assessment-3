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
  Container,
  useColorModeValue,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Text,
  Link,
  Code,
  useToast,
} from '@chakra-ui/react';
import backendApiClient from '../services/backendApiClient';

function SignUpPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  const validateForm = () => {
    const newErrors = {};

    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('Starting signup process...');
    console.log('Form data:', { ...formData, password: '[REDACTED]' });

    if (validateForm()) {
      console.log('Form validation passed');
      setIsLoading(true);
      try {
        const { username, email, password } = formData;
        // Register the user
        const signupResult = await backendApiClient.signup(
          username,
          email,
          password
        );

        // Store the tokens from signup
        localStorage.setItem('token', signupResult.access);
        localStorage.setItem('refresh', signupResult.refresh);

        // Notify other components about the auth state change
        window.dispatchEvent(new Event('authStateChange'));

        setDebugInfo({
          status: 'success',
          message: 'Sign up successful!',
          details: signupResult,
        });

        toast({
          title: 'Account created!',
          description: "You've successfully signed up. Welcome!",
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Redirect to homepage
        navigate('/');
      } catch (error) {
        setDebugInfo({
          status: 'error',
          message: error.message,
          details: error,
        });

        setErrors({ submit: error.message });

        toast({
          title: 'Sign up failed',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
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
            <Heading size="lg">Create Account</Heading>

            {errors.submit && (
              <Alert status="error">
                <AlertIcon />
                {errors.submit}
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

            <FormControl isRequired isInvalid={errors.username}>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                size="lg"
              />
              <FormErrorMessage>{errors.username}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                size="lg"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Choose a password"
                size="lg"
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                size="lg"
              />
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            </FormControl>

            <Button
              colorScheme="blue"
              size="lg"
              width="full"
              type="submit"
              isLoading={isLoading}
              loadingText="Signing up..."
              mt={4}
            >
              Sign Up
            </Button>

            <Text>
              Already have an account?{' '}
              <Link color="blue.500" onClick={() => navigate('/login')}>
                Log in
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}

export default SignUpPage;
