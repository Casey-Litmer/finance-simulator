import { UUID } from "crypto";
import { ScatterLine } from "plotly.js";
import { Add, KeyboardDoubleArrowRight } from "@mui/icons-material";
import { useMenu, useSim } from "src/contexts";
import { AccountItem } from "./AccountItem";
import { NewAccountMenu } from "./NewAccountMenu";
import { EventsMenu } from "../eventsmenu";
import { MarkersMenu, NewMarkerMenu } from "../markersmenu";
import { Menu, MenuDivider, MenuItemContainer, ScrollContainer } from "src/components/menu";
import { UtilityButton, VisibilityButton } from "src/components/buttons";
import { ColorSelect } from "src/components/colorselector";
import { ACC_SUM_TOTAL_ID } from "src/globals";




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
  const accountsTotalLine = simulation.saveState.accounts[ACC_SUM_TOTAL_ID].display.line;

  const accountItems = Object.keys(accounts)
    .filter(id => id !== ACC_SUM_TOTAL_ID)
    .map(id => <AccountItem key={id} accountId={id as UUID} />);

  //=========================================================================================
  const hasAccounts = accountItems.length > 0;
  const hasEvents = Object.keys(simulation.saveState.events).length > 0;
  const hasMarkers = Object.keys(simulation.saveState.markers).length > 0;

  //=========================================================================================
  const handleNewAccount = () => openMenu(<NewAccountMenu />);
  const handleAllEvents = () => openMenu(<EventsMenu />);
  const handleNewMarker = () => openMenu(<NewMarkerMenu />);
  const handleMarkers = () => openMenu(<MarkersMenu />);
  
  const handleTotalColorCallback = (line: Partial<ScatterLine>) => { simulation.dispatchSaveState(
    { partial: { accounts: { [ACC_SUM_TOTAL_ID]: { display: { line } } } } }) 
  };

  //=========================================================================================
  return (
    <Menu title='Accounts' openState={openState} setOpenState={setOpenState}>

      <MenuDivider />

      <MenuItemContainer>
        <UtilityButton
          name='Add Marker'
          icon={Add}
          handleClick={handleNewMarker}
        />
        Add Marker
      </MenuItemContainer>

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

      {hasMarkers &&
        <MenuItemContainer>
          <UtilityButton
            name="Markers"
            icon={KeyboardDoubleArrowRight}
            handleClick={handleMarkers}
          />
          Markers
        </MenuItemContainer>
      }

      <MenuDivider />

      <MenuItemContainer sx={{ height: 28 }}>
        <div style={{ marginLeft: 24 }}>Total Balance</div>
        <ColorSelect line={accountsTotalLine} callback={handleTotalColorCallback} />
        <VisibilityButton type='account' id={ACC_SUM_TOTAL_ID} sx={{ top: '0px' }} />
      </MenuItemContainer>

      {hasAccounts && <MenuDivider />}

      <ScrollContainer>
        {accountItems}
      </ScrollContainer>
    </Menu>
  );
};
