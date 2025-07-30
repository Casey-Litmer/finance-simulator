import { useState } from 'react';
import { useSim } from '../../contexts/SimProvider';
import UtilityButton from '../../components/buttons/UtitlityButton';
import MenuItemContainer, { DropdownContainer, FixedText } from '../../components/menu/MenuItemContainer';
import { Add, ChevronLeft, ChevronRight, Edit, KeyboardDoubleArrowRight } from '@mui/icons-material';
import EventsMenu from '../eventsmenu/EventsMenu';
import NewAccountMenu from './NewAccountMenu';
import NewEventMenu from '../eventsmenu/NewEventMenu';
import { useTheme } from '@mui/material';
import { useMenu } from '../../contexts/MenuProvider';
import ColorSelect from '../../components/colorselector/ColorSelect';
import { ScatterLine } from 'plotly.js';
import VisibilityButton from '../../components/buttons/VisibilityButton';




interface AccountItemProps {
  accountId: number;
};

export default function AccountItem(props: AccountItemProps) {
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
  const account = simulation.saveState.accounts[Number(accountId)]
  const accountName = account.args.name ?? account.accountType;
  const line = simulation.saveState.accountsDisplay[accountId].line;

  //=========================================================================================
  const handleEdit = () => openMenu(<NewAccountMenu accountId={accountId} />);
  const handleExpand = () => setOpenDropdown((prev) => !prev);
  const handleNewEvent = () => { openMenu(<NewEventMenu accountId={accountId} />) };
  const handleEvents = () => { openMenu(<EventsMenu accountId={accountId} />) };
  const handleColorCallback = (line: Partial<ScatterLine>) => { simulation.dispatchSaveState({ partial: { accountsDisplay: { [accountId]: { line } } } }) };

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
      <VisibilityButton accountId={accountId} />

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

