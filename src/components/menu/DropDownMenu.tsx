import { CSSProperties, Fragment } from "react";
import { FixedText, MenuItemContainer } from "./MenuItemContainer";
import { SxProps } from "@mui/material";
import { Theme } from "@emotion/react";


export type DropdownFields = {
  condition: boolean;
  row: { left: any, right: any };
};

//=================================================================================
export interface DropdownMenuProps {
  open: boolean;
  sx?: SxProps<Theme>;
  style?: CSSProperties;
  fields: DropdownFields[];
};

export const DropdownMenu = ({ fields, open, sx, style }: DropdownMenuProps) => {
  const properties: { left: any, right: any }[] = [];

  //=================================================================================
  //Add properties
  for (const field of fields) {
    const { condition, row } = field;
    if (condition) properties.push(row);
  };

  //=================================================================================
  return (open ?
    <MenuItemContainer sx={sx} style={style} className="DropdownContainer">
      {
        properties.map(({ left, right }, n) => <Fragment key={n}>
          <FixedText key={n + 0.1} text={left} maxWidth={'100%'} />
          <FixedText key={n + 0.2} text={right} maxWidth={'100%'} />
        </Fragment>)
      }
    </MenuItemContainer> 
  : <></>);
};