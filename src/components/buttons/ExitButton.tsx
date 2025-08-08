import React from 'react'
import { SxProps, Theme } from '@mui/material';
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight } from '@mui/icons-material';
import { UtilityButton } from './UtitlityButton';



interface ExitButtonProps {
  sx?: SxProps<Theme>
  openState: boolean
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>
}

export function ExitButton(props: ExitButtonProps) {
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
