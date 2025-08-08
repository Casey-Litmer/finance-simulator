import { ScatterLine } from "plotly.js";
import { Add, KeyboardDoubleArrowRight } from "@mui/icons-material";
import { useMenu, useSim } from "src/contexts";
import { AccountItem } from "./AccountItem";
import { NewAccountMenu } from "./NewAccountMenu";
import { EventsMenu } from "../eventsmenu";
import { Menu, MenuDivider, MenuItemContainer, ScrollContainer } from "src/components/menu";
import { UtilityButton, VisibilityButton } from "src/components/buttons";
import { ColorSelect } from "src/components/colorselector";




interface MainMenuProps {
  openState: boolean;
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
};

export function MainMenu(props: MainMenuProps) {
  //MainMenu is a bit different from other menus as the openState is elevated to the container
  const { openState, setOpenState } = props;
  const { openMenu } = useMenu();
  const simulation = useSim();
  const accounts = simulation.saveState.accounts;

  //=========================================================================================
  const accountsTotalLine = simulation.saveState.accounts[-1].display.line;

  const accountItems = Object.keys(accounts)
    .filter(id => Number(id) >= 0)
    .map(id => <AccountItem key={id} accountId={Number(id)} />);

  //=========================================================================================
  const hasEvents = Object.keys(simulation.saveState.events).length > 0;
  const hasAccounts = accountItems.length > 0;

  //=========================================================================================
  const handleNewAccount = () => openMenu(<NewAccountMenu />);
  const handleAllEvents = () => openMenu(<EventsMenu />);
  const handleTotalColorCallback = (line: Partial<ScatterLine>) => { simulation.dispatchSaveState(
    { partial: { accounts: { [-1]: { display: { line } } } } }) 
  };

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
        <ColorSelect line={accountsTotalLine} callback={handleTotalColorCallback} />
        <VisibilityButton type='account' id={-1} sx={{ top: '0px' }} />
      </MenuItemContainer>

      {hasAccounts && <MenuDivider />}

      <ScrollContainer>
        {accountItems}
      </ScrollContainer>
    </Menu>
  );
};
