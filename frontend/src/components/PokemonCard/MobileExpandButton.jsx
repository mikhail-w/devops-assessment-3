import React, { memo } from 'react';
import {
  IoArrowForwardCircleOutline,
  IoArrowDownCircleOutline,
} from 'react-icons/io5';

const MobileExpandButton = memo(({ isExpanded, onClick }) => {
  const Icon = IoArrowDownCircleOutline;
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

MobileExpandButton.displayName = 'ExpandButton';

export default MobileExpandButton;
