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
  const marker = simulation.saveState.markers[markerId];
  const markerTime = formatDatetime(convertTime(marker.time, 'DateTime')).padEnd(10, '\u00A0');
  const markerName = `\u00A0${marker.name || 'Marker'}`;
  const line = marker.display.line;

  //=========================================================================================
  const handleExpand = () => { setOpenDropdown((prev) => !prev) };
  const handleEdit = () => { openMenu(<NewMarkerMenu markerId={markerId} />) };
  const handleColorCallback = (line: Partial<ScatterLine>) => { simulation.dispatchSaveState({ partial: { markers: { [markerId]: { display: { line } } } } }) };

  //=========================================================================================
  const dropdownContents = () => {
    const fields = Object.values(simulation.saveState.events)
      .filter(event => event.markerControl.markerId === markerId)
      .map(event => ({
        condition: true,
        row: {
          left: `"${event.args.name || event.eventType}":`,
          right: {
            'eventDate': 'Event Date',
            'endDate': 'End Date',
          }[event.markerControl.attribute]
        },
      }));

    return fields;
  };

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
      <FixedText maxWidth={'90%'} text={markerName} />
      <ColorSelect line={line} callback={handleColorCallback} />
      <VisibilityButton type='marker' id={markerId} />

      <DropdownMenu 
        style={{ gridTemplateColumns: 'auto 0.9fr' }}
        sx={ContainerSx}
        fields={dropdownContents()}
        open={openDropdown}
      />
    </MenuItemContainer>
  );
};

