import React, { useState } from 'react'
import { Delete } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, SxProps, useTheme } from '@mui/material';
import { Theme } from '@emotion/react';
import { buttonSX } from './UtitlityButton';




interface DeleteButtonProps {
    sx?: SxProps<Theme>;
    text?: string;
    onClick: () => void;
};

export default function DeleteButton(props: DeleteButtonProps) {

    const {sx, text, onClick} = props;

    const [showValidation, setShowValidation] = useState(false);
    const {palette} = useTheme();



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

    return (
        <>
        <IconButton 
            onClick={handleClick}
            sx={{
                ...buttonSX,
                ...sx
            }}>
            <Delete/>
            {text ?? 'Delete'}
        </IconButton>

        {(showValidation) && 
            <Dialog open = {showValidation}>
                <DialogTitle>Hello</DialogTitle>
                <DialogContent>
                    Deleting this will end the universe
                </DialogContent>
                <DialogActions>
                    <Button color='error'variant='contained' onClick={handleNo}>
                        No
                    </Button>
                    <Button color='success' variant='contained' onClick={handleYes}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        }
        </>
    );
};