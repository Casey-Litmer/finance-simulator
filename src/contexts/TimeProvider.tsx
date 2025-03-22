import { createContext, useContext } from 'react';

type ContextProviderProps = {
    children: React.ReactNode;
};

type ContextType = {
    today: number
};

export const TimeContext = createContext({} as ContextType);

export const TimeProvider = ({ children }: ContextProviderProps) => {

    const today = 9000;

    return (
        <TimeContext.Provider
            value={{today}}
        >
            {children}
        </TimeContext.Provider>
    );
};


export const useTime = () => {
    const context = useContext(TimeContext);

    return context;
}