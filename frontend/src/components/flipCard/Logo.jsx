import '../../assets/styles/PokeFlipPage.css';
import mainLogo from '../../assets/images/flip/logo.png';
import { Box, Image } from '@chakra-ui/react';

function Logo() {
  return (
    <Box
      // outline={'2px solid'}
      id="spinner"
      // marginBottom={'-100px'}
      height={{ base: '100px', md: '100px' }}
    >
      <Image width={'100%'} className="logo" src={mainLogo} alt="Logo" />
    </Box>
  );
}

export default Logo;
