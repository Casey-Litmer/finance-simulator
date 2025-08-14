import { UUID } from "crypto";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Edit } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { useMenu, useSim } from "src/contexts";
import { convertTime, formatDatetime } from "src/utils";
import { NewEventMenu } from "./NewEventMenu";
import { DropdownContainer, FixedText, MenuItemContainer } from "src/components/menu";
import { UtilityButton, VisibilityButton } from "src/components/buttons";
import { EventJSON, SaveState } from "src/types";




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
    backgroundColor: palette.primary.top
  };

  //=========================================================================================
  const eventDate = formatDatetime(convertTime(event.args.eventTime, 'DateTime')).padEnd(10, '\u00A0');
  const eventName = `\u00A0${event.args.name ?? event.eventType}`;

  //=========================================================================================
  const handleEdit = () => { openMenu(<NewEventMenu eventId={eventId} />) };
  const handleExpand = () => { setOpenDropdown((prev) => !prev) };

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

      <DropdownContainer open={openDropdown}>
        {dropdownContents(event, simulation.saveState, ContainerSx)}
      </DropdownContainer>
    </MenuItemContainer>
  );
};


//=========================================================================================
/**Display event info based on type*/
const dropdownContents = (event: EventJSON, saveState: SaveState, sx: any) => {
  const properties: string[] = [];
  const accountIds = event.accountIds;
  const getAccountName = (id: UUID) => saveState.accounts[id].args.name;

  //=================================================================================
  //Type 
  properties.push(
    `Type:` +
    `${'\u00A0'.repeat(9)}` +
    `${event.eventType}`
  );

  //=================================================================================
  //Accounts
  if (['Transfer', 'Periodic Transfer'].includes(event.eventType)) {
    properties.push(
      `From:` +
      `${'\u00A0'.repeat(9)}` +
      `"${getAccountName(accountIds[0])}"`);
    properties.push(
      'To:' +
      `${'\u00A0'.repeat(14)}` +
      `"${getAccountName(accountIds[1])}"`);
  } else {
    properties.push(
      `Account:` +
      `${'\u00A0'.repeat(4)}` +
      `"${getAccountName(accountIds[0])}"`);
  };

  //=================================================================================
  //Values
  if (['Deposit', 'Withdrawal', 'Transfer',
    'Periodic Transfer', 'Periodic Deposit',
    'Periodic Withdrawal'].includes(event.eventType))
    properties.push(
      `Amount:` +
      `${'\u00A0'.repeat(5)}` +
      `$${event.args.value}`);

  if (['Adjustment'].includes(event.eventType))
    properties.push(
      `Balance:` +
      `${'\u00A0'.repeat(5)}` +
      `$${event.args.value}`);

  if (['Change Interest Rate'].includes(event.eventType))
    properties.push(
      `New Rate:` +
      `${'\u00A0'.repeat(2)}` +
      `${event.args.value}%`);

  //=================================================================================
  //Periods
  if (event.eventType.includes('Periodic')) {
    properties.push(
      `Period:` +
      `${'\u00A0'.repeat(8)}` +
      `${event.args.eventPeriod} 
            ${{ 'monthly': 'months', 'constant': 'days' }[event.args.periodMode ?? 'constant']}`
    );
    if (event.args.doesEnd)
      properties.push(
        `End Date:` +
        `${'\u00A0'.repeat(3)}` +
        `${formatDatetime(event.args.endTime!, 'mdy')}`
      );
  };

  /* Add option for displaying generative events later */
  //=================================================================================
  return properties.map((text, i) =>
    <MenuItemContainer key={i} sx={sx}>
      <FixedText text={text} maxWidth={'100%'} />
    </MenuItemContainer>
  );
};