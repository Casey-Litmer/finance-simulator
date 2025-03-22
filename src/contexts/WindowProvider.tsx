import { createContext, useContext, useEffect, useState } from 'react';

type WindowContextProviderProps = {
    children: React.ReactNode;
};

type WindowContextType = {
    windowWidth: number
    windowHeight: number
};

export const WindowContext = createContext({} as WindowContextType);

export const WindowProvider = ({ children }: WindowContextProviderProps) => {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    },[]);

    return (
        <WindowContext.Provider
            value={{windowHeight, windowWidth}}
        >
            {children}
        </WindowContext.Provider>
    );
};


export const useWindow = () => {
    const context = useContext(WindowContext);

    return context;
}