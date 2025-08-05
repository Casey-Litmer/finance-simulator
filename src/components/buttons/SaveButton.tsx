import { Save } from '@mui/icons-material';


interface SaveButtonProps {
  text?: string;
  className?: string;
};

export default function SaveButton(props: SaveButtonProps) {
  const { text, className } = props;

  return (
    <button type='submit' className={`IconButton ${className}`}>
      <Save />
      {text ?? "Save"}
    </button>
  );
    //<IconButton
    //  type='submit'
    //  sx={{...buttonSX, ...sx}}
    //>
    //  <Save />
    //  {text ?? 'Save'}
    //</IconButton>
};







