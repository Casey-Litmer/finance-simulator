import { UUID } from "crypto";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useMenu, useSim } from "src/contexts";
import { Menu, MenuDivider, MenuItemContainer, ScrollContainer } from "src/components/menu";
import { UtilityButton } from "src/components/buttons";
import { NewMarkerMenu } from "./NewMarkerMenu";
import { MarkerItem } from "./MarkerItem";



interface MarkersMenuProps {
  accountId?: UUID
}

export function MarkersMenu(props: MarkersMenuProps) {
  const { accountId } = props;
  const simulation = useSim();
  const { palette } = useTheme();
  const { openMenu } = useMenu();
  const [openState, setOpenState] = useState(false);

  //=================================================================================
  // Styles

  const ContainerSx = {
    borderRadius: '4px',
    backgroundColor: palette.primary.top
  };

  //=================================================================================
  // Filter markerJSON

  const markerIds = Object.keys(simulation.saveState.markers) as UUID[];
  const markerItems = markerIds.map((id) => <MarkerItem key={id} markerId={id} />);

  //=================================================================================
  // Close menu on empty

  useEffect(() => {
    if (!markerIds.length) setOpenState(false);
  }, [markerIds]);

  //=================================================================================
  // Handlers

  const handleNewMarker = () => { openMenu(<NewMarkerMenu/>) };

  //=================================================================================
  return (
    <Menu title='Markers' openState={openState} setOpenState={setOpenState}>
      <ScrollContainer>
{/* New Marker */}        
        {accountId !== undefined && <>
          <MenuItemContainer sx={ContainerSx}>
            <UtilityButton
              name='New Marker'
              icon={Add}
              handleClick={handleNewMarker}
            />
            New Marker
          </MenuItemContainer>
          <MenuDivider />
        </>}

{/* Markers */}
        {markerItems}
          
      </ScrollContainer>
    </Menu>
  );
};