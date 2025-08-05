import { CSSProperties, ReactNode, } from 'react';
import { twMerge } from 'tailwind-merge';
import './Menu.css';




interface MenuItemContainerProps {
  children: ReactNode;
  className?: string;
};

export default function MenuItemContainer(props: MenuItemContainerProps) {
  const { children, className } = props;
  return (
    <div className={twMerge(`MenuItemContainer ${className}`)} >
      {children}
    </div>
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
      <div className='DropdownContainer' >
        {children}
      </div> : <></>}
  </>);
};


interface FixedTextProps {
  text: string;
  maxWidth?: number | string;
  style?: CSSProperties;
  className?: string;
}
export function FixedText(props: FixedTextProps) {
  const { text, maxWidth, style, className } = props;
  return (
    <div 
      className={twMerge(`overflow-hidden whitespace-nowrap content-center ${className}`)}
      style={{
        maxWidth: maxWidth ?? '60%',
        ...style
      }}
    >
      {text}
    </div>
  );
};

//=================================================================================

export function MenuDivider() {
  return <div className='w-full h-[1px] mt-[0.5px] mx-0.5 bg-primary-top' />;

  //return <Divider sx={{
  //  marginTop: 0.5,
  //  // marginTop:0.1, 
  //  marginLeft: 2,
  //  marginRight: 2,
  //  backgroundColor: palette.primary.top
  //}} />
};