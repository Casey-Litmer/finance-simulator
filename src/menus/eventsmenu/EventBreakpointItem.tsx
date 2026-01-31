import { UUID } from "crypto";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Edit } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { useMenu, useSim } from "src/contexts";
import { convertTime, formatDatetime } from "src/utils";
import { FixedText, MenuItemContainer } from "src/components/menu";
import { UtilityButton, VisibilityButton } from "src/components/buttons";
import { DropdownFields, DropdownMenu } from "src/components/menu/DropDownMenu";
import { NewEventBreakpointMenu } from "./NewEventBreakpointMenu";



interface EventBreakpointItemProps {
  eventId: UUID;
  breakpointId: UUID;
};

export function EventBreakpointItem(props: EventBreakpointItemProps) {
  const { breakpointId, eventId } = props;
  const { palette } = useTheme();
  const simulation = useSim();
  const { openMenu } = useMenu();
  const [openDropdown, setOpenDropdown] = useState(false);
  const breakpoint = simulation.saveState.events[eventId].args.breakpoints![breakpointId];

  const ContainerSx = {
    borderRadius: '4px',
    width: '100%',
    backgroundColor: palette.primary.top
  };

  //=========================================================================================
  const breakpointName = `\u00A0${breakpoint.name ?? "Breakpoint"}`;
  const breakpointTime = breakpoint.time;
  const breakpointDate = formatDatetime(convertTime(breakpointTime, 'DateTime')).padEnd(10, '\u00A0');
  const breakpointValue = breakpoint.value;

  //=========================================================================================
  const handleEdit = () => { openMenu(<NewEventBreakpointMenu eventId={eventId} breakpointId={breakpointId} />) };
  const handleExpand = () => { setOpenDropdown((prev) => !prev) };

  //=========================================================================================

  const fields: DropdownFields[] = [
    { condition: true, row: { left: 'New Value:', right: breakpointValue } },
  ];

  //=========================================================================================
  return (
    <MenuItemContainer>
      <UtilityButton
        name='Edit Breakpoint'
        icon={Edit}
        handleClick={handleEdit}
      />
      <UtilityButton
        name='Expand'
        icon={(openDropdown) ? ChevronLeft : ChevronRight}
        handleClick={handleExpand}
      />
      {/*v- hotfix for chrome */}
      <FixedText text={breakpointDate} style={{ fontSize: '75%', lineHeight: 2 }} />
      <FixedText maxWidth={'90%'} text={breakpointName} />
      <VisibilityButton type='event' id={eventId} />

      <DropdownMenu 
        sx={ContainerSx} 
        style={{gridTemplateColumns: 'auto 0.9fr'}}
        fields={fields} 
        open={openDropdown} 
      />
    </MenuItemContainer>
  );
};