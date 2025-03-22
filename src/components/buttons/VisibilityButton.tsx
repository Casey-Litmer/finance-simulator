import React from 'react';
import UtilityButton from './UtitlityButton';
import { useSim } from '../../contexts/SimProvider';
import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@mui/icons-material';
import { Theme } from '@emotion/react';
import { SxProps } from '@mui/material';



interface VisibilityButtonProps {
    accountId: number;
    sx?: SxProps<Theme>;
};

export default function VisibilityButton(props: VisibilityButtonProps) {
    const {accountId, sx} = props;
    const simulation = useSim();
    const visible = simulation.saveState.accountsDisplay[accountId].visible;

    const handleVisible = () => simulation.dispatchSaveState({accountsDisplay:{[accountId]: {visible: !visible}}});

    return (
        <UtilityButton 
            name='Visible'
            icon = {visible ? 
                CheckBoxOutlined : CheckBoxOutlineBlank}
            handleClick={handleVisible}
            sx={{position: 'absolute', right:'16px', ...sx}}
        /> 
    );
};
