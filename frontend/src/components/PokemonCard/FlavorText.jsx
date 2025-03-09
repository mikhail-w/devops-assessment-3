import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import '../../assets/styles/FlavorText.css';
import { Center, Text, useMediaQuery } from '@chakra-ui/react';

const FlavorText = ({ flavorTextArray, onInfo, isMobileLandscape }) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [isMobile] = useMediaQuery('(max-width: 500px)');

  const linesPerPage = 1;
  const pageCount = Math.ceil(flavorTextArray.length / linesPerPage);

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  const currentText = flavorTextArray.slice(
    pageNumber * linesPerPage,
    (pageNumber + 1) * linesPerPage
  );

  // Determine max width based on onInfo
  const maxWidth = onInfo ? '300px' : '100%';

  return (
    <Center flexDirection="column">
      <Text
        // margin={{ base: '30px', md: '40px' }}
        mt={{ base: '20px', md: '20px' }}
        mb={{ base: '-20px', md: '20px' }}
        fontFamily="Alleyn W01 Regular"
        textAlign="center"
        height={{ base: '150px', md: '150px' }}
        overflow="hidden"
        textOverflow="ellipsis"
        fontSize={{ base: '17px', md: '20px' }}
        lineHeight={{ base: '20px', md: '24px' }}
        width={{ base: '300px', md: '500px' }}
        // outline={'2px solid'}
      >
        <span className="flavorText">{currentText}</span>
      </Text>

      <Center
        mt={isMobileLandscape ? '-20px' : { base: '10px', md: '20px' }}
        mb={isMobileLandscape ? '-160px' : { base: '-150px', md: '20px' }}
        width="400px"
        // outline={'2px solid'}
      >
        <ReactPaginate
          previousLabel={'prev'}
          nextLabel={'next'}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          containerClassName="paginationBttns"
          previousLinkClassName="previousBttn"
          nextLinkClassName="nextBttn"
          disabledClassName="paginationDisabled"
          activeClassName="paginationActive"
          breakLabel={isMobile ? null : '...'}
          breakClassName="breakBttn"
          pageClassName={isMobile ? 'hiddenPage' : 'paginationPage'}
          pageLinkClassName={isMobile ? 'hiddenLink' : 'pageLink'}
        />
      </Center>
    </Center>
  );
};

export default FlavorText;
