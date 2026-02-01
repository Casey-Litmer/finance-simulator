import React, { CSSProperties, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material';
import { useMenu, useWindow } from 'src/contexts';
import { MainMenu } from './accountsmenu';
import { ExitButton } from 'src/components/buttons';
import { MENU_MAX_SCALE, MENU_MIN_WIDTH } from 'src/globals/CONSTANTS';



/**
 * Blocks out space for menus in the main div
 * */
export function MenuContainer() {
  const {
    openState,
    setOpenState,
    activeMenus,
    menuWidth,
    setMenuWidth,
    setMenuHeight
  } = useMenu();
  const { palette } = useTheme();
  const { windowWidth } = useWindow();
  const menuDivRef = useRef<HTMLDivElement>(null);

  //=========================================================================================

  useEffect(() => {
    const resizeObserver = new ResizeObserver(([entry]) => {
      setMenuHeight(entry.contentRect.height);
    });
    resizeObserver.observe(menuDivRef.current!);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    setMenuWidth(Math.max(windowWidth * MENU_MAX_SCALE, MENU_MIN_WIDTH));
  }, [windowWidth]);

  //=========================================================================================
  const containerStyle: CSSProperties = (openState) ?
    {} : { transform: `translateX(${-MENU_MIN_WIDTH}px)` };
  //^-- Human minds are not intended to comprehend
  //    why we cant use menuWidth here.

  //=========================================================================================
  return (
    <div ref={menuDivRef} className='MenuContainer'
      style={{
        borderRadius: 0,
        ...containerStyle,
        width: menuWidth,
        minWidth: MENU_MIN_WIDTH,
        backgroundColor: palette.primary.main,
      }}
    >

{/* Exit Button */}
      {!openState &&
        <ExitButton openState={openState} setOpenState={setOpenState}
          sx={{ top: 12, right: -32 }}
        />
      }

{/* Main Menu */}
      <MainMenu openState={openState} setOpenState={setOpenState} />

{/* Other Menus */}
      {activeMenus.map((menu, i) => (
        React.cloneElement(menu as React.ReactElement, { key: i })
      ))}
      
    </div>
  );
};

