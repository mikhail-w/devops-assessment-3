import { useCallback } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { FaArrowLeftLong } from 'react-icons/fa6';

// Reusable back button component with improved event handling
const ModalBackButton = ({ onClose }) => {
  const handleClick = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      // Ensure we're not in the middle of another animation
      requestAnimationFrame(() => {
        onClose();
      });
    },
    [onClose]
  );

  return (
    <Box
      as={FaArrowLeftLong}
      className="modal-return"
      onClick={handleClick}
      fontSize="1.8rem"
      cursor="pointer"
      role="button"
      aria-label="Close modal"
      _hover={{ opacity: 0.8 }}
      transition="opacity 0.2s"
    />
  );
};

export default ModalBackButton;
