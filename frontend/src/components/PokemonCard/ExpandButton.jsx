import React, { memo } from 'react';
import {
  IoArrowForwardCircleOutline,
  IoArrowDownCircleOutline,
} from 'react-icons/io5';

const ExpandButton = memo(({ isMobile, isExpanded, onClick }) => {
  const Icon = isMobile
    ? IoArrowDownCircleOutline
    : IoArrowForwardCircleOutline;
  return (
    <Icon
      onClick={onClick}
      size="3em"
      className={
        isExpanded ? 'isExtended extend-modal' : 'extend-modal notExtended'
      }
    />
  );
});

ExpandButton.displayName = 'ExpandButton';

export default ExpandButton;
