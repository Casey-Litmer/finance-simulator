import { createTheme, PaletteMode} from "@mui/material";


declare module "@mui/material/styles" {
    interface PaletteColor {
        middle?: string;
        top?: string;
    }
    interface SimplePaletteColorOptions {
        middle?: string; 
        top?: string;
    }
};


export const darkTheme = createTheme({
    cssVariables: true,
    palette:{
        mode: 'dark',
        primary: {
            main: '#222831',
            middle: '#2F343D',
            top: '#3F4651',
            contrastText: '#FFFFFF'   
        },
        secondary: {
            main: 'rgb(46, 71, 92)',
            middle: 'rgb(61, 94, 122)',
            top: 'rgb(109, 142, 155)',
            contrastText: 'rgb(17, 22, 36)'
        },
        background: {
            paper: '#2F343D', //primary.middle
        }
    },
});

export const lightTheme = createTheme({
    cssVariables: true,
    palette:{
        primary: {
            main: 'rgb(243, 243, 243)',
            middle: 'rgb(207, 223, 223)',
            top: 'rgb(194, 213, 214)',
        },
        secondary: {
            main: 'rgb(127, 199, 204)',
            middle: 'rgb(141, 177, 180)',
            top: 'rgb(75, 95, 104)',
        },
        background: {
            paper: 'rgb(220, 236, 236)', //primary.middle
        }
    },
});
