import React from 'react';
import { IconButton, SvgIconTypeMap, SxProps, Theme } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import './UtilityButton.css';



type MuiIcon = OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
  muiName: string;
};

interface UtilityButtonProps {
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  icon?: MuiIcon;
  name?: string;
  sx?: SxProps<Theme>
};


export function UtilityButton(props: UtilityButtonProps) {
  const { handleClick, icon, sx } = props;

  return (
    <div className='UtilityButton'>
      <IconButton onClick={handleClick}
        sx={{...buttonSX, ...sx}}>
        {icon && React.createElement(icon)}
      </IconButton>
    </div>
  );
};

//=================================================================================

export const buttonSX = {
  borderRadius: 0,
  border: "1px solid secondary",
  padding: 0,
  /*backgroundColor: theme.palette.primary,
  '&:hover': {
      backgroundColor: theme.palette.primary
  }*/
};