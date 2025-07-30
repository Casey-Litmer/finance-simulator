import React from 'react';
import { useSim } from '../../contexts/SimProvider';
import UtilityButton from '../../components/buttons/UtitlityButton';
import AccountItem from './AccountItem';
import MenuItemContainer, { MenuDivider } from '../../components/menu/MenuItemContainer';
import { Add, KeyboardDoubleArrowRight } from '@mui/icons-material';
import Menu from '../../components/menu/Menu';
import EventsMenu from '../eventsmenu/EventsMenu';
import NewAccountMenu from '../accountsmenu/NewAccountMenu';
import ScrollContainer from '../../components/menu/ScrollContainer';
import { useMenu } from '../../contexts/MenuProvider';
import VisibilityButton from '../../components/buttons/VisibilityButton';
import ColorSelect from '../../components/colorselector/ColorSelect';
import { ScatterLine } from 'plotly.js';


interface MainMenuProps {
  openState: boolean
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>
}

export default function MainMenu(props: MainMenuProps) {
  //MainMenu is a bit different from other menus as the openState is elevated to the container
  const { openState, setOpenState } = props;
  const { openMenu } = useMenu();
  const simulation = useSim();
  const accounts = simulation.saveState.accounts;

  //=========================================================================================
  const totalLine = simulation.saveState.accountsDisplay[-1].line;

  const accountItems = Object.keys(accounts)
    .filter(id => Number(id) >= 0)
    .map(id => <AccountItem key={id} accountId={Number(id)} />);

  //=========================================================================================
  const hasEvents = Object.keys(simulation.saveState.events).length > 0;
  const hasAccounts = accountItems.length > 0;

  //=========================================================================================
  const handleNewAccount = () => openMenu(<NewAccountMenu />);
  const handleAllEvents = () => openMenu(<EventsMenu />);
  const handleTotalColorCallback = (line: Partial<ScatterLine>) => { simulation.dispatchSaveState({ partial: { accountsDisplay: { [-1]: { line } } } }) };

  //=========================================================================================
  return (
    <Menu title='Accounts' openState={openState} setOpenState={setOpenState}>

      <MenuDivider />

      <MenuItemContainer>
        <UtilityButton
          name='New Account'
          icon={Add}
          handleClick={handleNewAccount}
        />
        New Account
      </MenuItemContainer>

      {hasEvents &&
        <MenuItemContainer>
          <UtilityButton
            name="All Events"
            icon={KeyboardDoubleArrowRight}
            handleClick={handleAllEvents}
          />
          All Events
        </MenuItemContainer>
      }

      <MenuDivider />

      <MenuItemContainer sx={{ height: 28 }}>
        <div style={{ marginLeft: 24 }}>Total Balance</div>
        <ColorSelect line={totalLine} callback={handleTotalColorCallback} />
        <VisibilityButton accountId={-1} sx={{ top: '0px' }} />
      </MenuItemContainer>

      {hasAccounts && <MenuDivider />}

      <ScrollContainer>
        {accountItems}
      </ScrollContainer>
    </Menu>
  );
};
