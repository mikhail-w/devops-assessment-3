import snorlax from '../assets/images/gifs/snorlax.gif';
import BackButton from '../components/BackButton';
import { useOutletContext } from 'react-router-dom';

import { Center, Image, Text } from '@chakra-ui/react';

function NotFoundPage() {
  return (
    <>
      <Center marginTop={'300px'} flexDirection={'column'}>
        <Image width={'200px'} src={snorlax} alt="" />
        <Text textAlign={'center'} justifyContent={'center'} fontSize={'2rem'}>
          404 Pokemon Not Found
        </Text>
      </Center>
      <BackButton />
    </>
  );
}

export default NotFoundPage;
