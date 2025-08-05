import { useState } from 'react'
import { Delete } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';


interface DeleteButtonProps {
  text?: string;
  className?: string;
  onClick: () => void;
};

export default function DeleteButton(props: DeleteButtonProps) {
  const { text, className, onClick } = props;
  const [showValidation, setShowValidation] = useState(false);

  //=================================================================================
  const handleClick = () => {
    setShowValidation(true);
  };
  const handleYes = () => {
    setShowValidation(false);
    onClick();
  };
  const handleNo = () => {
    setShowValidation(false);
  };

  //=================================================================================
  return (<>
    <button 
      onClick={handleClick}
      className={`IconButton ${className}`}
    >
      <Delete />
      {text ?? 'Delete'}
    </button>
    
    {(showValidation) &&
      <Dialog open={showValidation}>
        <DialogTitle>Hello</DialogTitle>
        <DialogContent>
          Deleting this will end the universe
        </DialogContent>
        <DialogActions>
          <Button color='error' variant='contained' onClick={handleNo}>
            No
          </Button>
          <Button color='success' variant='contained' onClick={handleYes}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    }
  </>);

  //<IconButton
  //  onClick={handleClick}
  //  sx={{...buttonSX, ...sx}}>
  //  <Delete />
  //  {text ?? 'Delete'}
  //</IconButton>
};