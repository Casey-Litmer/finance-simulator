import { UUID } from "crypto";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useMenu, useSim } from "src/contexts";
import { Menu, MenuDivider, MenuItemContainer, ScrollContainer } from "src/components/menu";
import { UtilityButton } from "src/components/buttons";
import { NewMarkerMenu } from "./NewMarkerMenu";
import { MarkerItem } from "./MarkerItem";
import { TODAY_MARKER_ID } from "src/globals";



export function MarkersMenu() {
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

  const markerIds = Object.keys(simulation.saveState.markers) as UUID[];
  const markerItems = markerIds
    .filter(id => id !== TODAY_MARKER_ID)
    .map((id) => <MarkerItem key={id} markerId={id} />);

  //=================================================================================
  // Close menu on empty
  //=================================================================================

  useEffect(() => {
    if (!markerIds.length) setOpenState(false);
  }, [markerIds]);

  //=========================================================================================
  // Handlers
  //=========================================================================================

  const handleNewMarker = () => { openMenu(<NewMarkerMenu/>) };

  //=================================================================================
  return (
    <Menu title='Markers' openState={openState} setOpenState={setOpenState}>
      <ScrollContainer>
{/* New Marker */}        
        <MenuItemContainer sx={ContainerSx}>
          <UtilityButton
            name='New Marker'
            icon={Add}
            handleClick={handleNewMarker}
          />
          New Marker
        </MenuItemContainer>
        
        <MenuDivider />

{/* Markers */}
        {markerItems}
          
      </ScrollContainer>
    </Menu>
  );
};