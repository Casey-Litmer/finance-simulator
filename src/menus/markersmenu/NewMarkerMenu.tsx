import { UUID } from "crypto";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSim } from "src/contexts";
import { DeleteButton, SaveButton } from "src/components/buttons";
import { DateSelector, InputField } from "src/components/dataentry";
import { Menu, MenuDivider, MenuItemContainer } from "src/components/menu";
import { defaultMarker } from "src/globals";
import { MarkerJSON } from "src/types";




interface NewMarkerMenuProps {
  markerId?: UUID;
};

/*Create init arguments if no accountId is given, else, edit json.*/
export function NewMarkerMenu(props: NewMarkerMenuProps) {
  const { markerId } = props;
  const simulation = useSim();
  const [openState, setOpenState] = useState(false);

  // ============================================================================
  // Form Setup
  // ============================================================================

  const { 
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = useForm<MarkerJSON>({
    mode: 'onChange',
    defaultValues: (markerId !== undefined) ? 
      simulation.saveState.markers[markerId] :
      defaultMarker({})
  });
  const currentState = watch();

  // ============================================================================
  // Display Parameters
  // ============================================================================

  const title = (markerId === undefined) ? 'New Marker' : 'Edit Marker';

  //=================================================================================
  // Save / Delete
  //=================================================================================

  const handleSave = (markerJSON: MarkerJSON) => {
    setOpenState((prev) => !prev);
    if (markerId === undefined) {
      simulation.addMarker(markerJSON);
    } else {
      simulation.dispatchSaveState({ partial: { markers: { [markerId]: markerJSON } } });
    };
  };

  // Delete Marker
  const handleDelete = () => {
    setOpenState((prev) => !prev);
    simulation.deleteMarker(markerId!);
  };

  //=========================================================================================
  return (
    <Menu title={title} openState={openState} setOpenState={setOpenState}>
      <form onSubmit={handleSubmit(handleSave)}>

{/* Marker Name */}
        <MenuItemContainer className="DataEntryStyles">
          Marker Name
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

{/* Marker Time */}
        <MenuItemContainer className="DataEntryStyles">
          Marker Location
          <DateSelector
            register={register('time')}
            control={control}
            selected={currentState.time}
          />
        </MenuItemContainer>

        <MenuDivider />

{/* Save and Delete */}
        <MenuItemContainer className='SaveDeleteStyles'>
          <SaveButton />
          {(markerId !== undefined) &&
          <DeleteButton onClick={handleDelete} />}
        </MenuItemContainer>
      </form>
    </Menu>
  );
};

