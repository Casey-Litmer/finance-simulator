import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { Add, KeyboardDoubleArrowRight } from "@mui/icons-material";
import { useMenu, useSim } from "src/contexts";
import { addToEventTable, filterEvents, makeEventQueue } from "src/utils";
import { EventItem } from "./EventItem";
import { FilterMenu } from "../FilterMenu";
import { NewEventMenu } from "./NewEventMenu";
import { Menu, MenuDivider, MenuItemContainer, ScrollContainer } from "src/components/menu";
import { UtilityButton } from "src/components/buttons";
import { AccountEvent } from "src/simulation/events";
import { EventTable } from "src/simulation/types";



interface EventsMenuProps {
  accountId?: number
}

export function EventsMenu(props: EventsMenuProps) {
  const { accountId } = props;
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
  // Event Mapping

  console.log(simulation.saveState.events)

  const filteredEvents = filterEvents(
    (accountId === undefined) ? 
    simulation.saveState.events : 
    simulation.saveState.accounts[accountId].eventIds
    .map(id => simulation.saveState.events[id])
  , simulation.saveState.filter);

  console.log('filtered', filteredEvents) //TODO this is turning into an array and getting the wrong keys

  const eventIds = Object.keys(filteredEvents).map(Number);

  //const eventIds = (accountId === undefined) ?
  //  Object.keys(simulation.saveState.events).map(Number) :
  //  simulation.saveState.accounts[accountId].eventIds;

  const eventObjects = Object.values(simulation.simData?.eventsData ?? {})
    .map(evData => evData.event)
    .filter(ev => eventIds.includes(ev.id));

  //Use eventTableMethods to order by time/precedence like in the sim
  let orderedEvents = {} as EventTable;
  for (const ev of eventObjects) {
    orderedEvents = addToEventTable(orderedEvents, ev as AccountEvent);
  };

  //Squash list and map back to ids, components...
  const orderedEventIds = makeEventQueue(orderedEvents).getItems().map((ev) => ev.id);
  const eventItems = orderedEventIds.map((id) => <EventItem key={id} eventId={Number(id)} />);

  //=================================================================================
  //Close menu on empty

  useEffect(() => {
    if (!eventIds.length) setOpenState(false);
  }, [eventIds]);

  //=================================================================================

  const handleFilterMenu = () => { openMenu(<FilterMenu />) };
  const handleNewEvent = () => { openMenu(<NewEventMenu accountId={accountId} />) };

  //=================================================================================
  return (
    <Menu title='Events' openState={openState} setOpenState={setOpenState}>
      <ScrollContainer>
{/* Filter */}
        <MenuItemContainer>
          <div style={{ flex: 1, flexDirection: 'row' }}>
            <UtilityButton
              name='Filter Menu'
              icon={KeyboardDoubleArrowRight}
              handleClick={handleFilterMenu}
            />
          </div>
        </MenuItemContainer>

        <MenuDivider />

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
        {eventItems}
          
      </ScrollContainer>
    </Menu>
  );
};