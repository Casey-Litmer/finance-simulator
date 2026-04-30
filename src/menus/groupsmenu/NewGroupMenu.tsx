import { UUID } from "crypto";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSim } from "src/contexts";
import { DeleteButton, SaveButton } from "src/components/buttons";
import { InputField } from "src/components/dataentry";
import { Menu, MenuDivider, MenuItemContainer, ScrollContainer } from "src/components/menu";
import { defaultEventGroup } from "src/globals";
import { EventGroupJSON } from "src/types";



interface NewGroupMenuProps {
  groupId?: UUID;
};

export function NewGroupMenu(props: NewGroupMenuProps) {
  const { groupId } = props;
  const simulation = useSim();
  const [openState, setOpenState] = useState(false);

  // ============================================================================
  // Form Setup
  // ============================================================================

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<EventGroupJSON>({
    mode: 'onChange',
    defaultValues: (groupId !== undefined) ? 
      simulation.saveState.groups[groupId] : 
      defaultEventGroup(),
  });

  // ============================================================================
  // Display Parameters
  // ============================================================================

  const title = (groupId === undefined) ? 'New Group' : 'Edit Group';

  //=================================================================================
  // Save / Delete
  //=================================================================================

  const handleSave = (eventGroupJSON: EventGroupJSON) => {
    setOpenState((prev) => !prev);
    if (groupId === undefined) {
      simulation.addEventGroup(eventGroupJSON);
    } else {
      simulation.dispatchSaveState({ partial: { groups: { [groupId]: eventGroupJSON } } });
    };
  };

  const handleDelete = () => {
    setOpenState((prev) => !prev);
    simulation.deleteEventGroup(groupId!);
  };

  //=================================================================================
  return (
    <Menu title={title} openState={openState} setOpenState={setOpenState}>
      <ScrollContainer>
      <form onSubmit={handleSubmit(handleSave)}>

{/* Group Name */}
        <MenuItemContainer className="DataEntryStyles">
          Group Name
          <InputField
            type='string'
            errors={errors}
            register={register('name')}
            control={control}
            convertInput={nm => nm ?? ''}
            convertOutput={nm => nm.length ? nm : undefined}
          />
        </MenuItemContainer>

        <MenuDivider />

{/* Save and Delete */}
        <MenuItemContainer className="SaveDeleteStyles">
          <SaveButton />
          {groupId !== undefined && <DeleteButton onClick={handleDelete} />}
        </MenuItemContainer>

      </form>
      </ScrollContainer>
    </Menu>
  );
};
