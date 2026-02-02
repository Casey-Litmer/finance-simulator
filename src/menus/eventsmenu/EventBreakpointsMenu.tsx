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

  //=========================================================================================
  // Data
  //=========================================================================================

  const event = simulation.saveState.events[eventId];
  const eventBreakpoints = Object.entries(simulation.saveState.breakpoints)
    .filter(([_, breakpoint]) => breakpoint.eventId === eventId)
    .sort(([_, A], [__, B]) => A.time - B.time)
    .map(([id, _]) => id);
  const breakpointItems = eventBreakpoints.map((id) => 
    <EventBreakpointItem key={id} breakpointId={id as UUID} eventId={eventId} />
  );

  //=================================================================================
  // Close menu on empty
  //=================================================================================

  useEffect(() => {
    if (!eventBreakpoints.length) setOpenState(false);
  }, [JSON.stringify(eventBreakpoints)]);

  //=========================================================================================
  // Handlers
  //=========================================================================================

  const handleNewBreakpoint = () => { openMenu(<NewEventBreakpointMenu eventId={eventId} />) };

  //=================================================================================
  return (
    <Menu 
      title={`${event.args.name ?? event.eventType} Breakpoints`} 
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