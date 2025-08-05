import React from 'react';
import UtilityButton from './UtitlityButton';
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight } from '@mui/icons-material';



interface ExitButtonProps {
  openState: boolean;
  className?: string;
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ExitButton(props: ExitButtonProps) {
  const { openState, setOpenState, className } = props;

  const handleCancel = () => setOpenState((prev) => !prev);

  //=================================================================================
  return (
    <UtilityButton
      icon={(openState) ? KeyboardDoubleArrowLeft : KeyboardDoubleArrowRight}
      name={(openState) ? 'Cancel' : 'Expand'}
      handleClick={handleCancel}
      className={`absolute top-2 scale-200 ${className}`}
    />
  );
};
