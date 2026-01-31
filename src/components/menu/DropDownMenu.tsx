import { CSSProperties, Fragment, ReactNode } from "react";
import { Theme } from "@emotion/react";
import { SxProps } from "@mui/material";
import { FixedText, MenuItemContainer } from "./MenuItemContainer";


export type DropdownFields = {
  condition: boolean;
  row: { left: any, right: any } | ReactNode;
};

//=================================================================================
export interface DropdownMenuProps {
  open: boolean;
  sx?: SxProps<Theme>;
  style?: CSSProperties;
  fields: DropdownFields[];
};

export const DropdownMenu = ({ fields, open, sx, style }: DropdownMenuProps) => {
  
  //Add rows
  const rows: ({ left: any, right: any } | ReactNode)[] = [];
  for (const field of fields) {
    const { condition, row } = field;
    if (condition) rows.push(row);
  };

  const mappedRows = rows.map((row, n) => {
    if (row && typeof row === 'object' && 'left' in row) {
      return (<Fragment key={n}>
        <FixedText key={n + 0.1} text={row.left} maxWidth={'100%'} />
        <FixedText key={n + 0.2} text={row.right} maxWidth={'100%'} />
      </Fragment>);
    } else {
      return (<Fragment key={n}>
        {row}
        <div />
      </Fragment>);
    };
  });

  //=================================================================================
  return (open ?
    <MenuItemContainer sx={sx} style={style} className="DropdownContainer">
      {mappedRows}
    </MenuItemContainer> 
  : <></>);
};