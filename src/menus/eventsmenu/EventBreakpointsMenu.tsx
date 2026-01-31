import { UUID } from "crypto";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useMenu, useSim } from "src/contexts";
import { Menu, MenuDivider, MenuItemContainer } from "src/components/menu";
import { UtilityButton } from "src/components/buttons";
import { EventBreakpointItem } from "./EventBreakpointItem";
import { NewEventBreakpointMenu } from "./NewEventBreakpointMenu";



interface EventBreakpointsMenuProps {
  eventId: UUID
}

export function EventBreakpointsMenu(props: EventBreakpointsMenuProps) {
  const { eventId } = props;
  const simulation = useSim();
  const { palette } = useTheme();
  const { openMenu } = useMenu();
  const [openState, setOpenState] = useState(false);

  //=================================================================================
  // Styles
  const ContainerSx = {
    borderRadius: '4px',
    backgroundColor: palette.primary.top
  };

  //=================================================================================
  const event = simulation.saveState.events[eventId];
  const breakpoints = event.args.breakpoints ?? {};
  
  const breakpointItems = Object.keys(breakpoints).map((id) => 
    <EventBreakpointItem key={id} breakpointId={id as UUID} eventId={eventId} />
  );

  //=================================================================================
  // Close menu on empty
  useEffect(() => {
    if (!Object.keys(breakpoints).length) setOpenState(false);
  }, [JSON.stringify(breakpoints)]);

  //=================================================================================
  // Handlers
  const handleNewBreakpoint = () => { openMenu(<NewEventBreakpointMenu eventId={eventId} />) };

  //=================================================================================
  return (
    <Menu 
      title={`${event.args.name} Breakpoints`} 
      openState={openState} 
      setOpenState={setOpenState}
    >
{/* New Breakpoint */}        
      <MenuItemContainer sx={ContainerSx}>
        <UtilityButton
          name='New Breakpoint'
          icon={Add}
          handleClick={handleNewBreakpoint}
        />
        New Breakpoint
      </MenuItemContainer>
      <MenuDivider />
      
{/* Breakpoints */}
      {breakpointItems}
        
    </Menu>
  );
};