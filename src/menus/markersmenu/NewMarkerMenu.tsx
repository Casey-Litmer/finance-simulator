import { UUID } from "crypto";
import { CSSProperties, useState } from "react";
import { useForm } from "react-hook-form";
import { useSim } from "src/contexts";
import { DeleteButton, SaveButton } from "src/components/buttons";
import { DateSelector, InputField } from "src/components/dataentry";
import { Menu, MenuItemContainer } from "src/components/menu";
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
      defaultMarker({}  
    )
  });
  const currentState = watch();

  //=========================================================================================
  // Params
  const title = (markerId === undefined) ? 'New Marker' : 'Edit Marker';

  //=========================================================================================
  // Dispatch to simProvider
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
        <MenuItemContainer sx={dataEntryStyles}>
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
{/* Marker Time */}
        <MenuItemContainer sx={dataEntryStyles}>
          Marker Location
          <DateSelector
            register={register('time')}
            control={control}
            selected={currentState.time}
          />
        </MenuItemContainer>
{/* Save and Delete */}
        <MenuItemContainer sx={{ gap: '16px', paddingTop: '8px' }}>
          <SaveButton />
          {(markerId !== undefined) &&
          <DeleteButton onClick={handleDelete} />}
        </MenuItemContainer>
      </form>
    </Menu>
  );
};

//=========================================================================================

const dataEntryStyles = {
  flexDirection: 'column',
  alignItems: 'flex-start',
} as CSSProperties;

