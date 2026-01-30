import React, { ReactNode, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Paper, useTheme } from '@mui/material';
import { useMenu } from 'src/contexts';
import { MENU_TITLE_HEIGHT } from 'src/globals';
import { ExitButton } from '../buttons';
import './Menu.css';
import { ScrollContainer } from './ScrollContainer';



export type MenuRefProps = 'open' | 'closed';

interface MenuProps {
  children?: ReactNode;
  title?: string;
  openState: boolean;
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Menu(props: MenuProps) {
  const { title, openState, setOpenState } = props;
  const { menuWidth, menuHeight, closeMenu } = useMenu();
  const { palette } = useTheme();

  const menuContentsPadding = 32;
  const menuContentsHeight = menuHeight - MENU_TITLE_HEIGHT - menuContentsPadding;

  //=========================================================================================
  //Fucking React, man...
  useEffect(() => {
    setOpenState(true)
  }, []);

  //animation + Remove menu at end
  const springStyle = useSpring({
    from: { left: -menuWidth },
    left: openState ? 0 : -menuWidth,
    onRest: () => {
      if (!openState) closeMenu();
    }
  });

  //=========================================================================================
  return (
    <animated.div className='Menu'
      style={{
        ...springStyle,
        width: menuWidth,
      }}
    >      
      <Paper sx={{ backgroundColor: palette.primary.main }}>
        <Paper className='Title' sx={{ backgroundColor: palette.primary.middle }}>

          <h3 style={{ marginTop: 0, paddingTop: 12 }}>
            {title}
          </h3>

          <ExitButton openState={openState} setOpenState={setOpenState}
            sx={{ right: 16, top: 12 }} />
        </Paper>

        <Paper className='MenuContents'
          sx={{
            backgroundColor: palette.primary.main,
            height: menuContentsHeight,
            paddingTop: `${menuContentsPadding / 2}px`,
            paddingBottom: `${menuContentsPadding / 2}px`
          }}
        >
          <ScrollContainer>
            {props.children}
          </ScrollContainer>
        </Paper>

      </Paper>
    </animated.div>
  );
};
