import { Save } from '@mui/icons-material';
import { IconButton, SxProps } from '@mui/material';
import { Theme } from '@emotion/react';
import { buttonSX } from './UtitlityButton';



interface SaveButtonProps {
  sx?: SxProps<Theme>;
  text?: string;
};

export function SaveButton(props: SaveButtonProps) {

  const { sx, text } = props;

  return (
    <IconButton
      type='submit'
      sx={{
        ...buttonSX,
        ...sx
      }}>
      <Save />
      {text ?? 'Save'}
    </IconButton>
  );
};







