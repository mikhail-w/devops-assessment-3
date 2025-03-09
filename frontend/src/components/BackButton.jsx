import { useNavigate } from 'react-router-dom';
import { Button, Center, Text } from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';

function BackButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <Center>
      <Button
        pos="fixed"
        bottom="30px"
        onClick={handleClick}
        marginTop="60px"
        colorScheme="red"
        size="lg"
        px={6}
        _hover={{
          bg: 'red.600',
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px', // Spacing between icon and text
          transition: 'all 0.3s ease', // Smooth hover transition
          ':hover .arrow-icon': {
            transform: 'translateX(-5px)', // Move arrow to the left on hover
          },
        }}
      >
        <FaArrowLeft className="arrow-icon" size="1.8rem" />
        <Text>Go Back</Text>
      </Button>
    </Center>
  );
}

export default BackButton;
