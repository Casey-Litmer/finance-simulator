import { useState } from "react";
import { UUID } from "crypto";
import { useTheme } from "@mui/material";
import { ChevronLeft, ChevronRight, Edit } from "@mui/icons-material";
import { useMenu, useSim } from "src/contexts";
import { FixedText, MenuItemContainer } from "src/components/menu";
import { UtilityButton, VisibilityButton } from "src/components/buttons";
import { DropdownMenu } from "src/components/menu/DropDownMenu";
import { NewGroupMenu } from "./NewGroupMenu";


interface GroupItemProps {
  groupId: UUID;
};

export function GroupItem(props: GroupItemProps) {
  const { groupId } = props;
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

  const group = simulation.saveState.groups[groupId];
  const groupName = `\u00A0${group.name || 'Group'}`;
  const groupEventNames = group.eventIds.map(id => 
    simulation.saveState.events[id].args.name || simulation.saveState.events[id].eventType
  );
  
  //=========================================================================================
  // Handlers
  //=========================================================================================

  const handleExpand = () => { setOpenDropdown((prev) => !prev) };
  const handleEdit = () => { openMenu(<NewGroupMenu groupId={groupId} />) };

  //=================================================================================
  // Dropdown Info
  //=================================================================================
  
  const fields = groupEventNames.map(name => ({ 
    condition: true, 
    row: [<div>{name}</div>]
  }));

  //=========================================================================================
  return (
    <MenuItemContainer>

      <UtilityButton
        name='Edit Group'
        icon={Edit}
        handleClick={handleEdit}
      />

      <UtilityButton
        name='Expand'
        icon={(openDropdown) ? ChevronLeft : ChevronRight}
        handleClick={handleExpand}
      />

      {/*v- hotfix for chrome */}
      <FixedText text={groupName} maxWidth={'38%'} />
      {/* Toggle Active */}
      <VisibilityButton type='group' id={groupId} />

      <DropdownMenu 
        style={{ gridTemplateColumns: 'auto 0.9fr' }}
        sx={ContainerSx}
        fields={fields}
        open={openDropdown}
      />

    </MenuItemContainer>
  );
};

