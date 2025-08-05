import { Theme, ThemeProvider, useMediaQuery } from '@mui/material';
import { createContext, useContext, useEffect, useState } from 'react';
import { darkTheme, lightTheme } from '../globals/appTheme';



export enum IThemeMode {
  DARK = 'dark',
  LIGHT = 'light',
  SYSTEM = 'system'
};

type ThemeContextProviderProps = {
  children: React.ReactNode;
};

type ThemeContextType = {
  themeMode: IThemeMode;
  setThemeMode: React.Dispatch<React.SetStateAction<IThemeMode>>;
};

export const ThemeContext = createContext({} as ThemeContextType);

export const ThemeContextProvider = ({ children }: ThemeContextProviderProps) => {

  const [themeMode, setThemeMode] = useState<IThemeMode>(IThemeMode.DARK);
  const [theme, setTheme] = useState<Theme>(darkTheme);

  const SYSTEM_THEME: Exclude<IThemeMode, IThemeMode.SYSTEM> = useMediaQuery(
    '(prefers-color-scheme: dark)') ? IThemeMode.DARK : IThemeMode.LIGHT;

  useEffect(() => {
    const mode = (themeMode === IThemeMode.SYSTEM) ?
      SYSTEM_THEME : themeMode;
    switch (mode) {
      case IThemeMode.DARK:
        setTheme(darkTheme); break;
      case IThemeMode.LIGHT:
        setTheme(lightTheme); break;
      default: setTheme(lightTheme); break;
    };
  }, [themeMode, SYSTEM_THEME]);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode
      }}
    >
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};


export function useThemeContext() {
  const context = useContext(ThemeContext);
  return context;
};