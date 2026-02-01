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
  position?: '' | 'top' | 'middle' | 'bottom';
  sx?: SxProps<Theme>;
  style?: CSSProperties;
  fields: DropdownFields[];
};

export const DropdownMenu = ({ fields, open, position, sx, style }: DropdownMenuProps) => {
  
  const radiusStyles = {
    '': {},
    'top': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
    'middle': { borderRadius: 0 },
    'bottom': {  borderTopLeftRadius: 0, borderTopRightRadius: 0  },
  }[position ?? ''];

  //=================================================================================
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
  return (open && mappedRows.length > 0 ?
    <MenuItemContainer sx={sx} style={{ ...style, ...radiusStyles }} className="DropdownContainer">
      {mappedRows}
    </MenuItemContainer> 
  : <></>);
};