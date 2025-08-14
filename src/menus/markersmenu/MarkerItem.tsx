import { UUID } from "crypto";
import { Edit } from "@mui/icons-material";
import { useMenu, useSim } from "src/contexts";
import { convertTime, formatDatetime } from "src/utils";
import { FixedText, MenuItemContainer } from "src/components/menu";
import { UtilityButton, VisibilityButton } from "src/components/buttons";
import { NewMarkerMenu } from "./NewMarkerMenu";



interface MarkerItemProps {
  markerId: UUID;
};

export function MarkerItem(props: MarkerItemProps) {
  const { markerId } = props;
  const simulation = useSim();
  const { openMenu } = useMenu();
  const marker = simulation.saveState.markers[markerId];


  //=========================================================================================
  const markerTime = formatDatetime(convertTime(marker.time, 'DateTime')).padEnd(10, '\u00A0');
  const markerName = `\u00A0${marker.name || 'Marker'}`;

  //=========================================================================================
  const handleEdit = () => { openMenu(<NewMarkerMenu markerId={markerId} />) };

  //=========================================================================================
  return (
    <MenuItemContainer>
      <UtilityButton
        name='Edit Marker'
        icon={Edit}
        handleClick={handleEdit}
      />
      {/*v- hotfix for chrome */}
      <FixedText text={markerTime} style={{ fontSize: '75%', lineHeight: 2 }} />
      <FixedText maxWidth={'90%'} text={markerName} />
      <VisibilityButton type='marker' id={markerId} />
    </MenuItemContainer>
  );
};

