import { UUID } from "crypto";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSim } from "src/contexts";
import { getToday } from "src/utils";
import { DeleteButton, SaveButton } from "src/components/buttons";
import { DateSelector, DropdownSelect, InputField } from "src/components/dataentry";
import { Menu, MenuDivider, MenuItemContainer, ScrollContainer } from "src/components/menu";
import { NULL_MARKER_ID, TODAY_MARKER_ID } from "src/globals";
import { validatePercentValueBounds, validateValueBounds, valueLabelFromEventType } from "./eventsMenuUtils";
import { BreakpointJSON } from "src/types";



interface NewEventBreakpointMenuProps {
  eventId: UUID;
  breakpointId?: UUID;
}

/**
 * Create init arguments if no accountId is given, else edit json.
 */
export function NewEventBreakpointMenu(props: NewEventBreakpointMenuProps) {
  const { eventId, breakpointId } = props;

  const simulation = useSim();
  const [openState, setOpenState] = useState(false);
  
  const today = getToday().time;
  const event = simulation.saveState.events[eventId];

  //=================================================================================
  // Data Setup
  //=================================================================================

  const markers = Object.keys(simulation.saveState.markers)
      .filter((key) => key !== TODAY_MARKER_ID);

  //============================================================================
  //  Form Setup
  //============================================================================

  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = useForm<BreakpointJSON>({
    mode: 'onChange',
    defaultValues:
      breakpointId !== undefined
        ? simulation.saveState.breakpoints[breakpointId]
        : {
            time: today,
            value: event.args.value ?? 0,
            eventId: eventId,
            markerControlId: NULL_MARKER_ID,
          },
  });
  const currentState = watch();

  //=================================================================================
  // Conditions
  //=================================================================================

  const hasPercentMode = ['Withdrawal', 'Transfer'].some(s => event.eventType.includes(s));
  const percentMode = event.args.percentMode;
  const isControlled = currentState.markerControlId !== NULL_MARKER_ID;

  // ================================================================================
  // Display Parameters
  // ================================================================================

  const title = breakpointId === undefined ? 'New Breakpoint' : 'Edit Breakpoint';
  const valueLabel = valueLabelFromEventType(event.eventType);
  const markerTime = isControlled ? 
    simulation.saveState.markers[currentState.markerControlId as UUID].time : 
    today;

  //=================================================================================
  // Save / Delete
  //=================================================================================

  const handleSave = (breakpoint: BreakpointJSON) => {
    setOpenState((prev) => !prev);
    if (breakpointId === undefined) {
      simulation.addBreakpoint(breakpoint);
    } else {
      simulation.dispatchSaveState({ partial: { breakpoints: { [breakpointId!]: breakpoint } } });
    };
  };

  // Delete Event
  const handleDelete = () => {
    setOpenState((prev) => !prev);
    simulation.deleteBreakpoint(breakpointId!);
  };

  //=================================================================================
  return (
    <Menu title={title} openState={openState} setOpenState={setOpenState}>
      <ScrollContainer>
      <form onSubmit={handleSubmit(handleSave)}>

{/* Breakpoint Name */}
        <MenuItemContainer className="DataEntryStyles">
          Breakpoint Name
          <InputField
            type="string"
            errors={errors}
            register={register('name')}
            control={control}
            convertInput={(nm) => nm ?? ''}
            convertOutput={(nm) => (nm.length ? nm : undefined)}
          />
        </MenuItemContainer>

        <MenuDivider />

{/* Breakpoint Date */}
        <MenuItemContainer className="DataEntryStyles">
          Breakpoint Date
          {!isControlled ? (
            <DateSelector
              register={register('time')}
              control={control}
              selected={currentState.time}
            />
          ) : (<DateSelector selected={markerTime} />)}
        </MenuItemContainer>

{/* Marker Control */}        
        {markers.length > 0 && (
          <MenuItemContainer className="DataEntryStyles">
            Marker
            <DropdownSelect
              register={register('markerControlId')}
              control={control}
              style={{ maxWidth: '50%' }}
            >
              {[NULL_MARKER_ID, ...markers].map((id) => (
                <option key={id} value={id}>
                  {simulation.saveState.markers[id as UUID]?.name ?? 'None'}
                </option>
              ))}
            </DropdownSelect>
          </MenuItemContainer>
        )}

{/* Breakpoint Value */}
        <MenuItemContainer className="DataEntryStyles">
          Amount
          {/*`${valueLabel}:`*/}
          <InputField
            type="number"
            errors={errors}
            register={register('value', {
              valueAsNumber: true,
              validate: {
                validateValue:
                  percentMode && hasPercentMode
                    ? validatePercentValueBounds(valueLabel)
                    : validateValueBounds(valueLabel),
              },
            })}
            control={control}
            convertOutput={(x) => Number(Number(x).toFixed(2))}
            defaultValue={currentState.value}
          />
        </MenuItemContainer>

        <MenuDivider />

{/* Save and Delete */}
        <MenuItemContainer className='SaveDeleteStyles'>
          <SaveButton />
          {eventId !== undefined && <DeleteButton onClick={handleDelete} />}
        </MenuItemContainer>

      </form>
      </ScrollContainer>
    </Menu>
  );
};
