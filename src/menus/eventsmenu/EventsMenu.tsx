import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material';
import { useSim } from '../../contexts/SimProvider';
import Menu from '../../components/menu/Menu';
import EventItem from './EventItem';
import AccountEvent from '../../simulation/events/Event';
import { EventTable } from '../../simulation/types';
import { addToEventTable, makeEventQueue } from '../../simulation/helpers/eventTableMethods';
import ScrollContainer from '../../components/menu/ScrollContainer';
import MenuItemContainer, { MenuDivider } from '../../components/menu/MenuItemContainer';
import UtilityButton from '../../components/buttons/UtitlityButton';
import { useMenu } from '../../contexts/MenuProvider';
import NewEventMenu from './NewEventMenu';
import { Add } from '@mui/icons-material';


interface EventsMenuProps {
  accountId?: number
}

export default function EventsMenu(props: EventsMenuProps) {
  const { accountId } = props;
  const simulation = useSim();
  const { palette } = useTheme();
  const { openMenu } = useMenu();
  const [openState, setOpenState] = useState(false);

  //=================================================================================

  const ContainerSx = {
    borderRadius: '4px',
    backgroundColor: palette.primary.top
  };

  //=================================================================================

  const eventIds = (accountId === undefined) ?
    Object.keys(simulation.saveState.events).map(Number) :
    simulation.saveState.accounts[accountId].eventIds;

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

  const handleNewEvent = () => { openMenu(<NewEventMenu accountId={accountId} />) };

  //=================================================================================
  return (
    <Menu title='Events' openState={openState} setOpenState={setOpenState}>
      <ScrollContainer>
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
        {eventItems}
      </ScrollContainer>
    </Menu>
  );
};