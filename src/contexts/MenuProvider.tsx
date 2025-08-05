import { createContext, ReactNode, useContext, useState } from 'react';
import { useSim } from './SimProvider';
import { MENU_MAX_SCALE, MENU_MIN_WIDTH } from '../globals/CONSTANTS';
import { useWindow } from './WindowProvider';


type MenuContextProviderProps = {
  children: React.ReactNode;
};

type MenuContextType = {
  menuWidth: number;
  setMenuWidth: React.Dispatch<React.SetStateAction<number>>;
  menuHeight: number;
  setMenuHeight: React.Dispatch<React.SetStateAction<number>>;
  openState: boolean;
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
  activeMenus: ReactNode[];
  setActiveMenus: React.Dispatch<React.SetStateAction<ReactNode[]>>;
  openMenu: (menu: ReactNode) => void;
  closeMenu: () => void;
};

export const MenuContext = createContext({} as MenuContextType);

export const MenuProvider = ({ children }: MenuContextProviderProps) => {
  const simulation = useSim();
  const { windowWidth } = useWindow();
  const [menuWidth, setMenuWidth] = useState(Math.max(windowWidth * MENU_MAX_SCALE, MENU_MIN_WIDTH));
  const [menuHeight, setMenuHeight] = useState(0);
  const [openState, setOpenState] = useState(true);
  const [activeMenus, setActiveMenus] = useState<ReactNode[]>([]);

  //=========================================================================================
  //Top level menu management hooks
  const openMenu = (menu: ReactNode) => {
    setActiveMenus((prev) => [...prev, menu]);
  };
  const closeMenu = () => {
    setActiveMenus((prev) => prev.slice(0, prev.length - 1));
    simulation.dispatchDelete();
  };

  //=========================================================================================
  return (
    <MenuContext.Provider
      value={{
        menuWidth,
        setMenuWidth,
        menuHeight,
        setMenuHeight,
        openState,
        setOpenState,
        activeMenus,
        setActiveMenus,
        openMenu,
        closeMenu
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

//=========================================================================================
export const useMenu = () => {
  const context = useContext(MenuContext);
  return context;
};