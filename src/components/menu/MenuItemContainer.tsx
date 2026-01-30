import { CSSProperties, ReactNode, } from 'react';
import { Theme } from '@emotion/react';
import { Divider, Paper, SxProps, useTheme } from '@mui/material';



interface MenuItemContainerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  sx?: SxProps<Theme>;
};

export function MenuItemContainer(props: MenuItemContainerProps) {
  const { children, className, style, sx } = props;
  return (
    <Paper
      className={`MenuItemContainer ${className ?? ''}`}
      style={style}
      sx={{ borderRadius: 0, ...sx }}
    >
      {children}
    </Paper>
  );
};

//=================================================================================

interface DropdownContainerProps {
  children?: ReactNode;
  open: boolean;
};

export function DropdownContainer(props: DropdownContainerProps) {
  const { children, open } = props;
  return (<>
    {(open) ?
      <div className='DropdownContainer'>
        {children}
      </div> : <></>}
  </>);
};

//=================================================================================

interface FixedTextProps {
  text: string;
  maxWidth?: number | string;
  style?: CSSProperties;
}

export function FixedText(props: FixedTextProps) {
  const { text, maxWidth, style } = props;
  return (
    <div style={{
      maxWidth: maxWidth ?? '60%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      alignContent: 'center',
      ...style
    }}>
      {text}
    </div>
  );
};

//=================================================================================

export function MenuDivider() {
  const { palette } = useTheme();
  return <Divider sx={{
    marginTop: 0.5,
    // marginTop:0.1, 
    marginLeft: 2,
    marginRight: 2,
    backgroundColor: palette.primary.top
  }} />
};