import { UUID } from "crypto";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useMenu, useSim } from "src/contexts";
import { Menu, MenuDivider, MenuItemContainer, ScrollContainer } from "src/components/menu";
import { UtilityButton } from "src/components/buttons";
import { NewGroupMenu } from "./NewGroupMenu";
import { GroupItem } from "./GroupItem";



export function GroupsMenu() {
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

  const groupIds = Object.keys(simulation.saveState.groups) as UUID[];
  const groupItems = groupIds
    .map((id) => <GroupItem key={id} groupId={id} />);

  //=================================================================================
  // Close menu on empty
  //=================================================================================

  useEffect(() => {
    if (groupIds.length <= 0) setOpenState(false);
  }, [groupIds]);

  //=========================================================================================
  // Handlers
  //=========================================================================================

  const handleNewGroup = () => { openMenu(<NewGroupMenu/>) };

  //=================================================================================
  return (
    <Menu title='Groups' openState={openState} setOpenState={setOpenState}>
{/* New Group */}        
      <MenuItemContainer sx={ContainerSx}>
        <UtilityButton
          name='New Group'
          icon={Add}
          handleClick={handleNewGroup}
        />
        New Group
      </MenuItemContainer>
      
      <MenuDivider />

{/* Groups */}
      <ScrollContainer>
        {groupItems}
      </ScrollContainer>
      
    </Menu>
  );
};