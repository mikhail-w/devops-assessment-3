import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import backendApiClient from '../services/backendApiClient';

const LeaderboardModal = ({ isOpen, onClose }) => {
  const [leaderboard, setLeaderboard] = useState({
    easy: [],
    medium: [],
    hard: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await backendApiClient.getLeaderboard();
        setLeaderboard(response.leaderboard);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen]);

  const renderLeaderboardTable = scores => (
    <Table variant="simple">
      <Thead>
        <Tr color="red.500">
          <Th color="gray.700">Rank</Th>
          <Th color="gray.700">Player</Th>
          <Th color="gray.700" isNumeric>
            Score (Turns)
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {scores.map((score, index) => (
          <Tr key={index}>
            <Td>{index + 1}</Td>
            <Td>{score.username}</Td>
            <Td isNumeric>{score.score}</Td>
          </Tr>
        ))}
        {scores.length === 0 && (
          <Tr>
            <Td colSpan={3} textAlign="center">
              No scores yet
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent
        bg="#f39b2d"
        borderRadius="xl"
        border="4px solid #000"
        mx={{ base: '4', md: 'auto' }}
      >
        <ModalHeader
          textAlign="center"
          fontFamily="'Pokemon Solid', sans-serif"
          letterSpacing="2px"
          color="blue.900"
        >
          Leaderboard
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab _selected={{ color: 'white', bg: 'green.500' }}>Easy</Tab>
              <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Medium</Tab>
              <Tab _selected={{ color: 'white', bg: 'red.500' }}>Hard</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>{renderLeaderboardTable(leaderboard.easy)}</TabPanel>
              <TabPanel>{renderLeaderboardTable(leaderboard.medium)}</TabPanel>
              <TabPanel>{renderLeaderboardTable(leaderboard.hard)}</TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LeaderboardModal;
