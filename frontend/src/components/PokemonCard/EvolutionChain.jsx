import '../../assets/styles/PokeDetail.css';
import { Flex, Image, Text, Box, Center } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

function EvolutionChain({ evoNames }) {
  return (
    <>
      {/* Evolution chain title */}
      <Center className="evoTitle">Evolution Chain</Center>

      {/* Evolution chain images and names */}
      <Flex
        justifyContent="center"
        alignItems="center"
        gap="5px"
        flexWrap="wrap" // Allows wrapping for smaller screens
      >
        {evoNames.map(([species_name, id], index) => (
          <Flex key={index} alignItems="center">
            {/* Evolution Image and Name */}
            <Flex flexDirection="column" alignItems="center">
              <Image
                width={{ base: '50px', md: '120px' }} // Responsive width
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`}
                alt={`${species_name} sprite`}
              />
              <Text className="pname" fontSize={{ base: 'sm', md: 'md' }}>
                {' '}
                {/* Adjust font size */}
                {species_name}
              </Text>
            </Flex>

            {/* Arrow Icon for Transition */}
            {index < evoNames.length - 1 && (
              <Center mx={3}>
                <ArrowForwardIcon
                  size={{ base: 3, md: 8 }} // Responsive size
                  color="gray.700"
                  aria-label="evolution transition"
                />
              </Center>
            )}
          </Flex>
        ))}
      </Flex>
    </>
  );
}

export default EvolutionChain;
