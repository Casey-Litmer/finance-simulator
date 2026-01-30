import { UUID } from "crypto";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Edit } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { useMenu, useSim } from "src/contexts";
import { convertTime, formatDatetime } from "src/utils";
import { NewEventMenu } from "./NewEventMenu";
import { FixedText, MenuItemContainer } from "src/components/menu";
import { UtilityButton, VisibilityButton } from "src/components/buttons";
import { DropdownFields, DropdownMenu } from "src/components/menu/DropDownMenu";
import { NULL_MARKER_ID } from "src/globals";



interface EventItemProps {
  eventId: UUID;
};

export function EventItem(props: EventItemProps) {
  const { eventId } = props;
  const { palette } = useTheme();
  const simulation = useSim();
  const { openMenu } = useMenu();
  const [openDropdown, setOpenDropdown] = useState(false);
  const event = simulation.saveState.events[eventId];

  const ContainerSx = {
    borderRadius: '4px',
    width: '100%',
    backgroundColor: palette.primary.top
  };

  //=========================================================================================
  const eventTime = event.markerControl.markerId === NULL_MARKER_ID 
    || event.markerControl.attribute !== 'eventDate' ?
      event.args.eventTime : simulation.saveState.markers[event.markerControl.markerId].time;
  const eventDate = formatDatetime(convertTime(eventTime, 'DateTime')).padEnd(10, '\u00A0');
  const endTime = event.markerControl.markerId === NULL_MARKER_ID 
    || event.markerControl.attribute !== 'endDate' ?
      event.args.endTime ?? 0 : simulation.saveState.markers[event.markerControl.markerId].time; 
  const endDate = convertTime(endTime, 'DateTime');
  const eventName = `\u00A0${event.args.name ?? event.eventType}`;

  //=========================================================================================
  const handleEdit = () => { openMenu(<NewEventMenu eventId={eventId} />) };
  const handleExpand = () => { setOpenDropdown((prev) => !prev) };

  //=========================================================================================
  const dropdownContents = () => {
    const accountIds = event.accountIds;
    const getAccountName = (id: UUID) => simulation.saveState.accounts[id]?.args.name ?? '';

    //=================================================================================
    const accountFieldCondition = ['Transfer', 'Periodic Transfer'].includes(event.eventType);
    const eventFieldCondition = ['Deposit', 'Withdrawal', 'Transfer', 'Periodic Transfer', 
      'Periodic Deposit', 'Periodic Withdrawal'].includes(event.eventType);
    const adjustmentFieldCondition = ['Adjustment'].includes(event.eventType);
    const changeInterestRateFieldCondition = ['Change Interest Rate'].includes(event.eventType);
    const periodicEventFieldCondition = event.eventType.includes('Periodic');

    const periodModeValue = `${event.args.eventPeriod} 
      ${{ 'monthly': 'months', 'constant': 'days' }[event.args.periodMode ?? 'constant']}`;

    //=================================================================================
    const fields: DropdownFields[] = [
      //Type 
      { condition: true, row: { left: 'Type:', right: event.eventType } },
      //Accounts
      { condition: accountFieldCondition, row: { left: 'From:', right: getAccountName(accountIds[0])! } },
      { condition: accountFieldCondition, row: { left: 'To:', right: getAccountName(accountIds[1])! } },
      { condition: !accountFieldCondition, row: { left: 'Account:', right: getAccountName(accountIds[0])! } },
      //Values
      { condition: eventFieldCondition, row: { left: 'Amount:', right: (event.args.percentMode) ? `${event.args.value}%` : `$${event.args.value}` } },
      { condition: adjustmentFieldCondition, row: { left: 'Balance:', right: `$${event.args.value}` } },
      { condition: changeInterestRateFieldCondition, row: { left: 'New Rate:', right: `${event.args.value! * 100}%` } },
      //Periods
      { condition: periodicEventFieldCondition, row: { left: 'Period:', right: periodModeValue } },
      { condition: periodicEventFieldCondition && !!event.args.doesEnd, row: { left: 'End Date:', right: `${formatDatetime(endDate, 'mdy')}` } },
    ];

    return fields;
  };

  //=========================================================================================
  return (
    <MenuItemContainer>
      <UtilityButton
        name='Edit Event'
        icon={Edit}
        handleClick={handleEdit}
      />
      <UtilityButton
        name='Expand'
        icon={(openDropdown) ? ChevronLeft : ChevronRight}
        handleClick={handleExpand}
      />
      {/*v- hotfix for chrome */}
      <FixedText text={eventDate} style={{ fontSize: '75%', lineHeight: 2 }} />
      <FixedText maxWidth={'90%'} text={eventName} />
      <VisibilityButton type='event' id={eventId} />

      <DropdownMenu 
        sx={ContainerSx} 
        style={{gridTemplateColumns: 'auto 0.9fr'}}
        fields={dropdownContents()} 
        open={openDropdown} 
      />
    </MenuItemContainer>
  );
};