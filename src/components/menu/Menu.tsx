import React, { ReactNode, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useMenu } from '../../contexts/MenuProvider';
import ExitButton from '../buttons/ExitButton';
import { MENU_TITLE_HEIGHT } from '../../globals/CONSTANTS';
import './Menu.css';



export type MenuRefProps = 'open' | 'closed';

interface MenuProps {
  children?: ReactNode;
  title?: string;
  openState: boolean;
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Menu(props: MenuProps) {
  const { title, openState, setOpenState } = props;
  const { menuWidth, menuHeight, closeMenu } = useMenu();

  const menuContentsPadding = 32;
  const menuContentsHeight = menuHeight - MENU_TITLE_HEIGHT - menuContentsPadding;

  //=========================================================================================
  
  // Set openState on mount
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
      }}>
{/* Title */}
      <div className='Title'>
        <h3 className='mt-0 pt-3'>
          {title}
        </h3>
        <ExitButton className='right-4 top-3'
          openState={openState} 
          setOpenState={setOpenState}
        />
      </div>
{/* Body */}
      <div 
        className='MenuContents'
        style={{
          height: menuContentsHeight,
          paddingTop: `${menuContentsPadding / 2}px`,
          paddingBottom: `${menuContentsPadding / 2}px`
        }}>
        {props.children}
      </div>
    </animated.div>
  );
};
