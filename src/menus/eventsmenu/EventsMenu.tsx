import React from "react";
import { UUID } from "crypto";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { Add, Edit, KeyboardDoubleArrowRight } from "@mui/icons-material";
import { useMenu, useSim } from "src/contexts";
import { filterEvents } from "src/utils";
import { eventDisplay } from "src/utils/eventDisplay";
import { FilterMenu } from "../filtermenu";
import { NewEventMenu } from "./NewEventMenu";
import { Menu, MenuDivider, MenuItemContainer, ScrollContainer } from "src/components/menu";
import { UtilityButton, VisibilityButton } from "src/components/buttons";
import { EventGroupMenu, NewGroupMenu } from "../groupsmenu";
import { NULL_GROUP_ID } from "src/globals";


interface EventsMenuProps {
  accountId?: UUID
}

export function EventsMenu(props: EventsMenuProps) {
  const { accountId } = props;
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

  const account = accountId ? simulation.saveState.accounts[accountId] : undefined;
  const events = (accountId === undefined) ? 
    simulation.saveState.events :                        // If all events
    Object.fromEntries(                                  // If account events
      simulation.saveState.accounts[accountId].eventIds
      .map(id => [id, simulation.saveState.events[id]])  
    );
  
  const filteredEvents = filterEvents(events, simulation.saveState.filter);

  const eventIds = Object.keys(events);
  const filteredEventIds = Object.keys(filteredEvents);
  const ungroupedEventIds = filteredEventIds
    .filter(id => simulation.saveState.events[id as UUID].eventGroupId === NULL_GROUP_ID);

  const groups = Object.entries(simulation.saveState.groups)
    .filter(([_, { eventIds }]) => eventIds.length > 0);

  //=================================================================================
  // Event Mapping
  //=================================================================================

  const eventItems = eventDisplay(simulation.simData?.eventsData ?? {}, ungroupedEventIds as UUID[]);

  //=================================================================================
  // Close menu on empty
  //=================================================================================

  useEffect(() => {
    if (!eventIds.length) setOpenState(false);
  }, [eventIds]);

  //=================================================================================
  // Conditions
  //=================================================================================

  const hasGroups = Object.keys(simulation.saveState.groups).length > 0;

  //=========================================================================================
  // Handlers
  //=========================================================================================

  const handleFilterMenu = () => { openMenu(<FilterMenu />) };
  const handleEventGroupsMenu = (groupId: UUID) => { openMenu(<EventGroupMenu groupId={groupId} accountId={accountId} />) };
  const handleNewEvent = () => { openMenu(<NewEventMenu accountId={accountId} />) };
  const handleEditGroup = (groupId: UUID) => () => { openMenu(<NewGroupMenu groupId={groupId} />) };

  //=================================================================================
  return (
    <Menu 
      title={`${account?.args.name ?? 'All'} Events`} 
      openState={openState} 
      setOpenState={setOpenState}
    >

{/* Filter */}
      <MenuItemContainer>
        <UtilityButton
          name='Filter Menu'
          icon={KeyboardDoubleArrowRight}
          handleClick={handleFilterMenu}
        />
        Filter
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

      <ScrollContainer>

  {/* Groups */}
        {hasGroups && groups.map(([groupId, { name }]) => <React.Fragment key={groupId}>
          <MenuItemContainer>
            
            <UtilityButton
              name='Edit Event'
              icon={Edit}
              handleClick={handleEditGroup(groupId as UUID)}
            />

            <UtilityButton
              name={name}
              icon={KeyboardDoubleArrowRight}
              handleClick={() => handleEventGroupsMenu(groupId as UUID)}
              />

              {name}

              <VisibilityButton type='group' id={groupId as UUID} />

          </MenuItemContainer>
          
          <MenuDivider />
        </React.Fragment>)}

  {/* Events */}
        {eventItems}

      </ScrollContainer>
        
    </Menu>
  );
};