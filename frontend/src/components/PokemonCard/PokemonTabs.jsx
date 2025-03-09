import {
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Divider,
  Box,
  Flex,
  Image,
  Text,
  SimpleGrid,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

const InfoRow = ({ label, value }) => (
  <Box display="flex" padding="8px 0" justifyContent="left" marginBottom="10px">
    <Text className="subtitle">{label}:</Text>
    <Text className="description">{value}</Text>
  </Box>
);

function PokemonTabs({ card, pokeInfo }) {
  const heightInMeters = card.height / 10;
  const totalInches = heightInMeters * 39.3701;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);

  return (
    <Tabs
      className="pokeDetail-info-container"
      isFitted
      variant="soft-rounded"
      colorScheme="green"
      size="sm"
      w={{ base: '100%', md: '100%', lg: '450px' }}
      borderRadius="50px"
      h="280px"
      mt={10}
      display="flex"
      flexDirection="column"
      paddingBottom="50px"
    >
      <TabList
        position="sticky"
        top="0"
        zIndex="1"
        bg="white"
        paddingBottom="5px"
      >
        <Tab fontSize={{ base: 'xs', md: 'md' }}>About</Tab>
        <Tab fontSize={{ base: 'xs', md: 'md' }}>Stats</Tab>
        <Tab fontSize={{ base: 'xs', md: 'md' }}>Moves</Tab>
        <Tab fontSize={{ base: 'xs', md: 'md' }}>Gallery</Tab>
      </TabList>

      <Divider />

      <TabPanels flex="1" overflowY="auto">
        {/* About Panel */}
        <TabPanel h="full">
          <Box h="full" overflowY="auto">
            <InfoRow
              label="Base Experience"
              value={card.base_experience || 'N/A'}
            />
            <InfoRow
              label="Height"
              value={`${heightInMeters.toFixed(2)} m (${feet}'${inches}")`}
            />
            <InfoRow
              label="Weight"
              value={`${((card.weight / 10) * 2.2046).toFixed(2)} lbs`}
            />
            {!pokeInfo ? (
              <Alert status="info" mt={2} borderRadius="md">
                <AlertIcon />
                Additional Pokémon information unavailable
              </Alert>
            ) : (
              <>
                <InfoRow
                  label="Growth Rate"
                  value={pokeInfo.growth_rate?.name || 'N/A'}
                />
                <InfoRow
                  label="Capture Rate"
                  value={pokeInfo.capture_rate || 'N/A'}
                />
                <InfoRow
                  label="Generation"
                  value={pokeInfo.generation?.name || 'N/A'}
                />
              </>
            )}
          </Box>
        </TabPanel>

        {/* Stats Panel */}
        <TabPanel h="full">
          <Box h="full" overflowY="auto">
            <Flex direction="column" wrap="wrap" gap={4}>
              {card.stats.map(stat => (
                <Flex
                  key={card.name + stat.stat.name}
                  width="100%"
                  justifyContent="left"
                  alignItems="center"
                  flexDirection={{ base: 'column', md: 'row' }}
                  marginRight={{ base: '0', md: '10px' }}
                >
                  <Flex marginRight={{ base: '0', md: '10px' }}>
                    <h3 className="stat-name">{stat.stat.name}</h3>
                  </Flex>

                  <Flex width="100%" alignItems="center">
                    <Text
                      className="stat-value"
                      marginRight="10px"
                      display="flex"
                      alignItems="center"
                    >
                      {stat.base_stat}
                    </Text>
                    <Box
                      className="stat-bar-container"
                      display="flex"
                      alignItems="center"
                      flex="1"
                    >
                      <div className="stat-bar-bg"></div>
                      <div
                        className="stat-bar-parent"
                        style={{
                          width: stat.base_stat + '%',
                          maxWidth: '100%',
                        }}
                      >
                        <div
                          className={`stat-bar-fill ${card.types[0].type.name}`}
                        ></div>
                      </div>
                    </Box>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </Box>
        </TabPanel>

        {/* Moves Panel */}
        <TabPanel h="full">
          <Box h="full" overflowY="auto">
            <Box display="flex" flexWrap="wrap" gap={4}>
              {card.moves.slice(0, 4).map((move, index) => (
                <Box
                  key={index}
                  padding={2}
                  borderWidth="1px"
                  borderRadius="md"
                  boxShadow="sm"
                  bg="gray.100"
                  _hover={{ bg: 'gray.200' }}
                >
                  <Text
                    className="description"
                    fontSize={{ base: 'xs', md: 'md' }}
                    fontWeight="300"
                  >
                    {move.move.name || 'N/A'}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>
        </TabPanel>

        {/* Gallery Panel */}
        <TabPanel h="full">
          <Box h="full" overflowY="auto">
            <SimpleGrid
              columns={{ base: 2, md: 3 }}
              spacing={4}
              justifyItems="center"
              alignItems="center"
            >
              {Object.entries(card.sprites)
                .filter(
                  ([_, url]) => typeof url === 'string' && url.endsWith('.png')
                )
                .map(([key, url]) => (
                  <Box
                    key={key}
                    width="100px"
                    height="100px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Image
                      src={url}
                      alt={`${card.name} sprite ${key}`}
                      objectFit="contain"
                      maxWidth="100%"
                      maxHeight="100%"
                    />
                  </Box>
                ))}
            </SimpleGrid>
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default PokemonTabs;
