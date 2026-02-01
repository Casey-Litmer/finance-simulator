import { UUID } from "crypto";
import { CSSProperties, useState } from "react";
import { useForm } from "react-hook-form";
import { useSim } from "src/contexts";
import { getToday } from "src/utils";
import { DeleteButton, SaveButton } from "src/components/buttons";
import { DateSelector, DropdownSelect, InputField } from "src/components/dataentry";
import { Menu, MenuItemContainer } from "src/components/menu";
import { EventBreakpoint } from "src/simulation/events";
import { NULL_MARKER_ID, TODAY_MARKER_ID } from "src/globals";


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

  // ============================================================================
  // Form Setup
  // ============================================================================

  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = useForm<EventBreakpoint>({
    mode: 'onChange',
    defaultValues:
      breakpointId !== undefined
        ? simulation.saveState.events[eventId].args.breakpoints![breakpointId]
        : {
            time: today,
            value: event.args.value ?? 0,
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

  // ============================================================================
  // Display Parameters
  // ============================================================================

  const title = breakpointId === undefined ? 'New Breakpoint' : 'Edit Breakpoint';
  const eventTypeParameters = paramsFromEventType(event.eventType);
  const markerTime = isControlled ? 
    simulation.saveState.markers[currentState.markerControlId as UUID].time : 
    today;

  //=================================================================================
  // Errors
  //=================================================================================

  const valueBounds = (value: any) => {
    return value < 0 ? `${eventTypeParameters.label} must be positive` : true;
  };
  
  const percentValueBounds = (value: any) => {
    return (value < 0 || value > 100) ?
      `${eventTypeParameters.label} must be in the range [0%, 100%]` : true;
  };

  //=================================================================================
  // Dispatch to simProvider
  const handleSave = (breakpoint: EventBreakpoint) => {
    setOpenState((prev) => !prev);
    if (breakpointId === undefined) {
      simulation.addEventBreakpoint(breakpoint, eventId);
    } else {
      simulation.dispatchSaveState({ partial: { events: { [eventId]: { args: { breakpoints: { [breakpointId!]: breakpoint } } } } } });
    };
  };

  // Delete Event
  const handleDelete = () => {
    setOpenState((prev) => !prev);
    simulation.deleteEventBreakpoint(breakpointId!);
  };

  //=================================================================================
  return (
    <Menu title={title} openState={openState} setOpenState={setOpenState}>
      <form onSubmit={handleSubmit(handleSave)}>

{/* Breakpoint Name */}
        <MenuItemContainer sx={dataEntryStyles}>
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

{/* Breakpoint Date */}
        <MenuItemContainer sx={dataEntryStyles}>
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
          <MenuItemContainer sx={dataEntryStyles}>
            Marker
            <DropdownSelect
              register={register('markerControlId')}
              control={control}
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
        <MenuItemContainer sx={dataEntryStyles}>
          {`${eventTypeParameters.label}:`}
          <InputField
            type="number"
            errors={errors}
            register={register('value', {
              valueAsNumber: true,
              validate: {
                validateValue:
                  percentMode && hasPercentMode
                    ? percentValueBounds
                    : valueBounds,
              },
            })}
            control={control}
            convertOutput={(x) => Number(Number(x).toFixed(2))}
            defaultValue={currentState.value}
          />
        </MenuItemContainer>

{/* Save and Delete */}
        <MenuItemContainer sx={{ gap: '16px', paddingTop: '8px' }}>
          <SaveButton />
          {eventId !== undefined && <DeleteButton onClick={handleDelete} />}
        </MenuItemContainer>

      </form>
    </Menu>
  );
};

//=============================================================================

const dataEntryStyles = {
  flexDirection: 'column',
  alignItems: 'flex-start',
} as CSSProperties;

// ============================================================================
// Utility Functions
// ============================================================================

const paramsFromEventType = (eventType: string): {
  bounds: { min?: number; max?: number };
  label: string;
} => {
  if (eventType === 'Change Interest Rate') {
    return {
      label: 'New Rate',
      bounds: { min: 0, max: 100 },
    };
  }
  if (eventType === 'Adjustment') {
    return {
      label: 'New Balance',
      bounds: {},
    };
  }
  return {
    label: 'Amount',
    bounds: { min: 0 },
  };
};
