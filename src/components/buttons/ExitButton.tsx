import React from 'react'
import UtilityButton from './UtitlityButton';
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight } from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material';



interface ExitButtonProps {
  sx?: SxProps<Theme>
  openState: boolean
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ExitButton(props: ExitButtonProps) {
  const { openState, setOpenState, sx } = props;

  const handleCancel = () => setOpenState((prev) => !prev);

  return (
    <UtilityButton
      icon={(openState) ? KeyboardDoubleArrowLeft : KeyboardDoubleArrowRight}
      name={(openState) ? 'Cancel' : 'Expand'}
      handleClick={handleCancel}
      sx={{
        position: 'absolute',
        top: 8,
        scale: '200%',
        ...sx
      }}
    />
  );
};
