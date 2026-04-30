import { UUID } from "crypto";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { useMenu, useSim } from "src/contexts";
import { filterEvents } from "src/utils";
import { eventDisplay } from "src/utils/eventDisplay";
import { Menu, MenuDivider, MenuItemContainer, ScrollContainer } from "src/components/menu";
import { UtilityButton } from "src/components/buttons";
import { Add } from "@mui/icons-material";
import { NewEventMenu } from "../eventsmenu";



interface EventGroupMenuProps {
  groupId: UUID;
  accountId?: UUID;
}

export function EventGroupMenu(props: EventGroupMenuProps) {
  const { groupId, accountId } = props;
  const simulation = useSim();
  const { palette } = useTheme();
  const { openMenu } = useMenu();
  const [openState, setOpenState] = useState(false);

  const ContainerSx = {
    borderRadius: '4px',
    backgroundColor: palette.primary.top
  };

  //=========================================================================================
  // Data
  //=========================================================================================

  const eventGroupIds = simulation.saveState.groups[groupId].eventIds;
  const group = simulation.saveState.groups[groupId];

  const events = Object.fromEntries(
    ((accountId === undefined) ? 
      eventGroupIds :             // If account events, intersect with account events
      eventGroupIds.filter(id => simulation.saveState.accounts[accountId].eventIds.includes(id)))
    .map(id => [id, simulation.saveState.events[id]])  
  );
  
  // Apply filter to group events?
  const filteredEvents = filterEvents(events, simulation.saveState.filter);
  const eventIds = Object.keys(events);
  const filteredEventIds = Object.keys(filteredEvents);

  //=================================================================================
  // Event Mapping
  //=================================================================================

  const eventItems = eventDisplay(simulation.simData?.eventsData ?? {}, filteredEventIds as UUID[]);

  //=================================================================================
  // Close menu on empty
  //=================================================================================

  useEffect(() => {
    if (!eventIds.length) setOpenState(false);
  }, [eventIds]);

  //=================================================================================
  // Handlers
  //=================================================================================

  const handleNewEvent = () => {openMenu(<NewEventMenu accountId={accountId} groupId={groupId} />)};

  //=================================================================================
  return (
    <Menu 
      title={`${group.name} Events`} 
      openState={openState} 
      setOpenState={setOpenState}
    >

{/* New Event */}        
      {accountId !== undefined && <>
        <MenuItemContainer sx={ContainerSx}>
          <UtilityButton
            name='New Event'
            icon={Add}
            handleClick={handleNewEvent}
          />
          New Event
        </MenuItemContainer>
        
        <MenuDivider />
      </>}

{/* Events */}
      <ScrollContainer>
        {eventItems}
      </ScrollContainer>
        
    </Menu>
  );
};