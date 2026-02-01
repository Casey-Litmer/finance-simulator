import { UUID } from "crypto";
import { useState } from "react";
import { ScatterLine } from "plotly.js";
import { Add, ChevronLeft, ChevronRight, Edit, KeyboardDoubleArrowRight } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { useMenu, useSim } from "src/contexts";
import { NewAccountMenu } from "./NewAccountMenu";
import { EventsMenu, NewEventMenu } from "../eventsmenu";
import { FixedText, MenuItemContainer } from "src/components/menu";
import { UtilityButton, VisibilityButton } from "src/components/buttons";
import { ColorSelect } from "src/components/colorselector";
import { DropdownMenu } from "src/components/menu/DropDownMenu";


interface AccountItemProps {
  accountId: UUID;
};

export function AccountItem(props: AccountItemProps) {
  const { accountId } = props;
  const { palette } = useTheme();
  const simulation = useSim();
  const { openMenu } = useMenu();
  const [openDropdown, setOpenDropdown] = useState(false);

  const ContainerSx = {
    borderRadius: '4px',
    paddingLeft: '8px',
    backgroundColor: palette.primary.top
  };

  //=========================================================================================
  // Data
  //=========================================================================================
  
  const account = simulation.saveState.accounts[accountId]
  const accountName = account.args.name ?? account.accountType;
  const line = account.display.line;

  //=========================================================================================
  // Handlers
  //=========================================================================================

  const handleEdit = () => openMenu(<NewAccountMenu accountId={accountId} />);
  const handleExpand = () => setOpenDropdown((prev) => !prev);
  const handleNewEvent = () => { openMenu(<NewEventMenu accountId={accountId} />) };
  const handleEvents = () => { openMenu(<EventsMenu accountId={accountId} />) };
  const handleColorCallback = (line: Partial<ScatterLine>) => { simulation.dispatchSaveState({ partial: { accounts: { [accountId]: { display: { line } } } } }) };

  //=========================================================================================
  return (
    <MenuItemContainer>

      <UtilityButton
        name='Edit Account'
        icon={Edit}
        handleClick={handleEdit}
        />

      <UtilityButton
        name='Expand'
        icon={(openDropdown) ? ChevronLeft : ChevronRight}
        handleClick={handleExpand}
      />

      <FixedText text={accountName} />
      <ColorSelect line={line} callback={handleColorCallback} />
      <VisibilityButton type='account' id={accountId} />

      <DropdownMenu 
        sx={ContainerSx} 
        fields={[
          {condition: true, row: { 
            left: <UtilityButton
              name='New Event'
              icon={Add}
              handleClick={handleNewEvent}
            />, 
            right: "New Event", 
          }},
          {condition: account.eventIds.length > 0, row: { 
            left: <UtilityButton
              name='Events'
              icon={KeyboardDoubleArrowRight}
              handleClick={handleEvents}
            />, 
            right: "Events", 
          }},
        ]} 
        open={openDropdown} 
      />
      
    </MenuItemContainer>
  );
};

