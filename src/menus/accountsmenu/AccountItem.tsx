import { UUID } from "crypto";
import { useState } from "react";
import { ScatterLine } from "plotly.js";
import { Add, ChevronLeft, ChevronRight, Edit, KeyboardDoubleArrowRight } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { useMenu, useSim } from "src/contexts";
import { NewAccountMenu } from "./NewAccountMenu";
import { EventsMenu, NewEventMenu } from "../eventsmenu";
import { DropdownContainer, FixedText, MenuItemContainer } from "src/components/menu";
import { UtilityButton, VisibilityButton } from "src/components/buttons";
import { ColorSelect } from "src/components/colorselector";




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
    backgroundColor: palette.primary.top
  };

  //=========================================================================================
  const account = simulation.saveState.accounts[accountId]
  const accountName = account.args.name ?? account.accountType;
  const line = account.display.line;

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

      <DropdownContainer open={openDropdown}>
        <MenuItemContainer sx={ContainerSx}>
          <UtilityButton
            name='New Event'
            icon={Add}
            handleClick={handleNewEvent}
          />
          New Event
        </MenuItemContainer>

        {account.eventIds.length > 0 &&
          <MenuItemContainer sx={ContainerSx}>
            <UtilityButton
              name='Events'
              icon={KeyboardDoubleArrowRight}
              handleClick={handleEvents}
            />
            Events
          </MenuItemContainer>
        }
      </DropdownContainer>

    </MenuItemContainer>
  );
};

