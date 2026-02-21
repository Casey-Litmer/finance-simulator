import { useState } from "react";
import { UUID } from "crypto";
import { useTheme } from "@mui/material";
import { ChevronLeft, ChevronRight, Edit } from "@mui/icons-material";
import { useMenu, useSim } from "src/contexts";
import { convertTime, formatDatetime } from "src/utils";
import { FixedText, MenuItemContainer } from "src/components/menu";
import { UtilityButton, VisibilityButton } from "src/components/buttons";
import { DropdownMenu } from "src/components/menu/DropDownMenu";
import { NewMarkerMenu } from "./NewMarkerMenu";
import { ColorSelect } from "src/components/colorselector";
import { ScatterLine } from "plotly.js";


interface MarkerItemProps {
  markerId: UUID;
};

export function MarkerItem(props: MarkerItemProps) {
  const { markerId } = props;
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

  const marker = simulation.saveState.markers[markerId];
  const markerTime = formatDatetime(convertTime(marker.time, 'DateTime')).padEnd(10, '\u00A0');
  const markerName = `\u00A0${marker.name || 'Marker'}`;
  const line = marker.display.line;

  //=========================================================================================
  // Handlers
  //=========================================================================================

  const handleExpand = () => { setOpenDropdown((prev) => !prev) };
  const handleEdit = () => { openMenu(<NewMarkerMenu markerId={markerId} />) };
  const handleColorCallback = (line: Partial<ScatterLine>) => { simulation.dispatchSaveState({ partial: { markers: { [markerId]: { display: { line } } } } }) };

  //=================================================================================
  // Dropdown Info
  //=================================================================================
  
  const fields = Object.values(simulation.saveState.events)
    .map(event => {
      const isStartMarker = event.markerControl.startMarkerId === markerId;
      const isEndMarker = event.markerControl.endMarkerId === markerId 
        && !!event.args.doesEnd && event.eventType.includes('Periodic');
      const breakpointIds = Object.values(event.breakpointIds)
        .map(id => simulation.saveState.breakpoints[id])
        .filter(breakpoint => breakpoint.markerControlId === markerId);

      return [
        {
          condition: isStartMarker,
          row: {
            left: event.args.name || event.eventType,
            right: 'Start Date',
          },
        }, 
        {
          condition: isEndMarker,
          row: {
            left: event.args.name || event.eventType,
            right: 'End Date',
          },
        }, 
        ...breakpointIds.map(breakpoint => ({
          condition: true,
          row: {
            left: event.args.name || event.eventType,
            right: breakpoint.name || 'Breakpoint',
          },
        })),
      ];
    })
    .flatMap(arr => arr);

  //=========================================================================================
  return (
    <MenuItemContainer>

      <UtilityButton
        name='Edit Marker'
        icon={Edit}
        handleClick={handleEdit}
      />

      <UtilityButton
        name='Expand'
        icon={(openDropdown) ? ChevronLeft : ChevronRight}
        handleClick={handleExpand}
      />

      {/*v- hotfix for chrome */}
      <FixedText text={markerTime} style={{ fontSize: '75%', lineHeight: 2 }} />
      <FixedText text={markerName} maxWidth={'38%'} />
      <ColorSelect line={line} callback={handleColorCallback} />
      <VisibilityButton type='marker' id={markerId} />

      <DropdownMenu 
        style={{ gridTemplateColumns: 'auto 0.9fr' }}
        sx={ContainerSx}
        fields={fields}
        open={openDropdown}
      />

    </MenuItemContainer>
  );
};

