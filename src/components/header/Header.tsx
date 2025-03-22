import React from 'react';
import { useTheme } from '@mui/material';
import { HEADER_HEIGHT } from '../../globals/CONSTANTS';
import './Header.css';


export default function Header() {
    const {palette} = useTheme();

    return (
        <div className='Header' style={{
                backgroundColor: palette.primary.top,
                borderColor: palette.secondary.top,
                height: HEADER_HEIGHT
            }}
        >
            hello
        </div>
    );
};
