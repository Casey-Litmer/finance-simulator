import React, { CSSProperties } from 'react';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { twMerge } from 'tailwind-merge';
import './UtilityButton.css';



type MuiIcon = OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
  muiName: string;
};

interface UtilityButtonProps {
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  icon?: MuiIcon;
  name?: string;
  className?: string;
  style?: CSSProperties;
};

export default function UtilityButton(props: UtilityButtonProps) {
  const { handleClick, icon, className, style } = props;

  return (
    <button 
      onClick={handleClick}
      className={twMerge(`UtilityButton ${className}`)} style={style}
    >
      {icon && React.createElement(icon)}
    </button>
  );
      //<IconButton onClick={handleClick}>
      //  {icon && React.createElement(icon)}
      //</IconButton>
};

//=================================================================================

// Deprecated //
export const buttonSX = {
  borderRadius: 0,
  border: "1px solid secondary",
  padding: 0,
  /*backgroundColor: theme.palette.primary,
  '&:hover': {
      backgroundColor: theme.palette.primary
  }*/
};