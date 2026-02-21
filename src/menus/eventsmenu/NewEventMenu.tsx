import { UUID } from "crypto";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckBoxOutlineBlank, CheckBoxOutlineBlankTwoTone, CheckBoxOutlined } from "@mui/icons-material";
import { useSim } from "src/contexts";
import { getToday } from "src/utils";
import { DeleteButton, SaveButton, UtilityButton } from "src/components/buttons";
import { DateSelector, DropdownSelect, InputField } from "src/components/dataentry";
import { Menu, MenuDivider, MenuItemContainer, MenuItemRow, ScrollContainer } from "src/components/menu";
import { EventConstructorMap } from "src/simulation";
import { ACC_SUM_TOTAL_ID, NULL_MARKER_ID, TODAY_MARKER_ID } from "src/globals";
import { EventJSON } from "src/types";
import { validateInterestRateBounds, validateMarkerDayOfMonthBounds, validateMonthlyCanUseDay, validateMonthlyPeriodIsInt, validatePercentValueBounds, validatePeriodBounds, validateValueBounds, valueLabelFromEventType } from "./eventsMenuUtils";


interface NewEventMenuProps {
  accountId?: UUID;
  eventId?: UUID;
}

/**
 * Create init arguments if no accountId is given, else edit json.
 */
export function NewEventMenu(props: NewEventMenuProps) {
  const { eventId, accountId } = props;

  if (accountId === undefined && eventId === undefined) {
    throw Error('An id must be provided');
  };

  const simulation = useSim();
  const today = getToday().time;
  const [openState, setOpenState] = useState(false);

  // Get accountId if eventId is known
  const [currentAccountId, setCurrentAccountId] = useState(
    accountId ?? simulation.saveState.events[eventId!]?.accountIds[0]
  );

  // ============================================================================
  // Data Setup
  // ============================================================================

  const eventTypes = Object.keys(EventConstructorMap)
    .filter((key) => key !== 'Event')
    .map((key, i) => (<option key={i} value={key}>{key}</option>));

  const otherAccounts = Object.keys(simulation.saveState.accounts)
    .filter((key) => key !== currentAccountId && key != ACC_SUM_TOTAL_ID); 

  const markers = Object.keys(simulation.saveState.markers)
    .filter((key) => key !== TODAY_MARKER_ID);

  // ============================================================================
  // Form Setup
  // ============================================================================

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useForm<EventJSON>({
    mode: 'onChange',
    defaultValues:
      eventId !== undefined
        ? simulation.saveState.events[eventId]
        : {
            args: {
              eventTime: today,
              value: 0,
              eventPeriod: 7,
              periodMode: 'constant',
              doesEnd: false,
            },
            eventType: 'Deposit',
            accountIds: [accountId],
            breakpointIds: [],
            markerControl: {
              startMarkerId: NULL_MARKER_ID,
              endMarkerId: NULL_MARKER_ID,
              clampToMonthlyDate: true,
              dayOfMonth: 1,
            },
          },
  });
  const currentState = watch();

  // Error updates
  useEffect(() => {
    trigger('args.periodMode');
  }, [currentState.args.eventTime, currentState.args.periodMode]);

  //=================================================================================
  // Conditions
  //=================================================================================

  const isTransfer = ['Transfer', 'Periodic Transfer'].includes(currentState.eventType);
  const isPeriodic = currentState.eventType.includes('Periodic');
  const doesEnd = currentState.args.doesEnd;
  const hasValue = !['Close Account'].includes(currentState.eventType);
  const hasPercentMode = ['Withdrawal', 'Transfer'].some(s => currentState.eventType.includes(s));
  const percentMode = currentState.args.percentMode;
  const isChangeInterestRate = currentState.eventType === 'Change Interest Rate';
  const isControlledStartMarker = currentState.markerControl.startMarkerId !== NULL_MARKER_ID;
  const canClampStartMarker = isControlledStartMarker && isPeriodic && currentState.args.periodMode === 'monthly';
  const clampToMonthlyDate = currentState.markerControl.clampToMonthlyDate;
  const isControlledEndDate = currentState.markerControl.endMarkerId !== NULL_MARKER_ID;

  // ============================================================================
  // Display Parameters
  // ============================================================================

  const title = eventId === undefined ? 'New Event' : `Edit ${simulation.saveState.events[eventId]?.eventType}`;
  const valueLabel = valueLabelFromEventType(currentState.eventType);
  const periodUnits = { 'monthly': 'months', 'constant': 'days' }[currentState.args.periodMode ?? 'constant']
    ?.replace(currentState.args.eventPeriod === 1 ? 's' : '', '');
  const hasMarkers = markers.length > 0;
  const startMarkerTime = isControlledStartMarker ? 
    simulation.saveState.markers[currentState.markerControl.startMarkerId as UUID].time : today;
  const endMarkerTime = isControlledEndDate ? 
    simulation.saveState.markers[currentState.markerControl.endMarkerId as UUID].time : today;
  
  //=================================================================================
  // Save / Delete
  //=================================================================================

  const handleSave = (eventJSON: EventJSON) => {
    setOpenState((prev) => !prev);
    if (eventId === undefined) {
      simulation.addEvent(eventJSON);
    } else {
      simulation.dispatchSaveState({ partial: { events: { [eventId]: eventJSON } } });
    };
  };

  const handleDelete = () => {
    setOpenState((prev) => !prev);
    simulation.deleteEvent(eventId!);
  };

  //=================================================================================
  // Swap transfer
  //=================================================================================

  const handleSwap = () => {
    currentState.accountIds.reverse();
    setCurrentAccountId(currentState.accountIds[0]);
    setValue('accountIds', currentState.accountIds);
  };

  // Manually set default transfer-to
  const [lastIsTransfer, setLastIsTransfer] = useState(isTransfer);
  useEffect(() => {
    if (lastIsTransfer !== isTransfer) {
      setValue(
        'accountIds',
        isTransfer && otherAccounts.length > 0
          ? [currentAccountId, otherAccounts[0] as UUID]
          : [currentAccountId]
      );
      setLastIsTransfer(isTransfer);
    };
  }, [isTransfer]);

  //=================================================================================
  return (
    <Menu title={title} openState={openState} setOpenState={setOpenState}>
      <ScrollContainer>
      <form onSubmit={handleSubmit(handleSave)}>

{/* Event Name */}
        <MenuItemContainer className="DataEntryStyles">
          Event Name
          <InputField
            type="string"
            errors={errors}
            register={register('args.name')}
            control={control}
            convertInput={(nm) => nm ?? ''}
            convertOutput={(nm) => (nm.length ? nm : undefined)}
          />
        </MenuItemContainer>

        <MenuDivider />

{/* Event Date */}
        <MenuItemContainer className="DataEntryStyles">
          Event Date
          {!isControlledStartMarker ? (
            <DateSelector
              register={register('args.eventTime')}
              control={control}
              selected={currentState.args.eventTime}
            />
          ) : (<DateSelector selected={startMarkerTime} />)}
        </MenuItemContainer>

{/* Marker Control */}
        {hasMarkers && (<>
          <MenuItemRow className="DataEntryStyles">      
    {/* Marker Control Start */}        
            <div className="DataEntryStyles" style={{ maxWidth: '50%' }}>
              Marker
              <DropdownSelect
                register={register('markerControl.startMarkerId')}
                control={control}
                >
                {[NULL_MARKER_ID, ...markers].map((id) => (
                  <option key={id} value={id}>
                    {simulation.saveState.markers[id as UUID]?.name ?? 'None'}
                  </option>
                ))}
              </DropdownSelect>
            </div>

    {/* Set Day */}  
            {canClampStartMarker && (
              <div className="DataEntryStyles">
                Set Day
                <UtilityButton
                  name="Clamp"
                  icon={!clampToMonthlyDate ? CheckBoxOutlineBlank : CheckBoxOutlined}
                  handleClick={() => setValue('markerControl.clampToMonthlyDate', !clampToMonthlyDate)}
                />
              </div>
            )}
          </MenuItemRow>

  {/* Day Of Month */}  
          {canClampStartMarker && clampToMonthlyDate && (
              <MenuItemContainer className="DataEntryStyles">
                Day Of Month
                <InputField
                  type="number"
                  errors={errors}
                  register={register('markerControl.dayOfMonth', {
                    valueAsNumber: true,
                    validate: { validateValue: validateMarkerDayOfMonthBounds() },
                  })}
                  control={control}
                  defaultValue={currentState.markerControl.dayOfMonth}
                />
              </MenuItemContainer>
            )}
        </>)}
        
        <MenuDivider />

{/* Event Type */}
        <MenuItemContainer className="DataEntryStyles">
          Event Type
          <DropdownSelect
            register={register('eventType')}
            control={control}
          >
            {eventTypes}
          </DropdownSelect>
        </MenuItemContainer>

        {(hasValue && !isChangeInterestRate) && (
          <MenuItemRow className="DataEntryStyles">
  {/* Event Value */}
            <div className="DataEntryStyles" style={{ maxWidth: '50%' }}>
              {`${valueLabel}:`}
              <InputField
                type="number"
                errors={errors}
                register={register('args.value', {
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
                defaultValue={currentState.args.value}
              />
            </div>

  {/* Percent Mode */}
            {(hasPercentMode) && (
              <div className="DataEntryStyles">
                %
                <UtilityButton
                  name="Percentage"
                  icon={!percentMode ? CheckBoxOutlineBlank : CheckBoxOutlined}
                  handleClick={() => setValue('args.percentMode', !percentMode)}
                />
              </div>
            )}  

          </MenuItemRow>
        )}


{/* Event Rate (change interest rate) */}
        {(isChangeInterestRate) && (
          <MenuItemContainer className="DataEntryStyles">
            {`${valueLabel}:`}
            <InputField
              type="number"
              errors={errors}
              register={register('args.value', {
                valueAsNumber: true,
                validate: { 
                  validateValue: validateInterestRateBounds(),
                },
              })}
              control={control}
              defaultValue={currentState.args.value}
              convertInput={(val: number) => val * 100}
              convertOutput={(val: string) => Number(val) / 100}
            />
          </MenuItemContainer>
        )}

{/* Transfers */}
        {isTransfer && otherAccounts.length > 0 && (
          <MenuItemRow className="DataEntryStyles">
  {/* Transfer to */}
            <div className="DataEntryStyles" style={{ maxWidth: '50%' }}>
              Transfer To
              <DropdownSelect
                register={register('accountIds')}
                control={control}
                convertInput={(accIds) => accIds[1]}
                convertOutput={(accId) => [currentAccountId, Number(accId)]}
              >
                {otherAccounts.map((key) => (
                  <option key={key} value={key}>
                    {simulation.saveState.accounts[key as UUID].args.name}
                  </option>
                ))}
              </DropdownSelect>
            </div>

  {/* Swap Transfer */}
            <div className="DataEntryStyles">
              Swap Transfer
              <UtilityButton
                name="Swap Transfer"
                icon={CheckBoxOutlineBlankTwoTone}
                handleClick={handleSwap}
              />
            </div>
          </MenuItemRow>
        )}

{/* Periodic */}
        {isPeriodic && (<>
          <MenuItemRow className="DataEntryStyles">
    {/* Period */}
            <div className="DataEntryStyles" style={{ maxWidth: '50%' }}>
              {`Period (${periodUnits})`}
              <InputField
                type="number"
                errors={errors}
                register={register('args.eventPeriod', {
                  valueAsNumber: true,
                  validate: { 
                    validateInt: validateMonthlyPeriodIsInt(currentState), 
                    validateValue: validatePeriodBounds(periodUnits),
                  },
                })}
                control={control}
                convertOutput={Number}
                defaultValue={currentState.args.eventPeriod ?? 7}
                />
            </div>

    {/* Period Mode */}
            <div className="DataEntryStyles">
              Period Mode
              <DropdownSelect
                register={register('args.periodMode', { 
                  validate: { 
                    validateDay: validateMonthlyCanUseDay(currentState),
                  },
                })}
                control={control}
                errors={errors}
                >
                <option key="constant" value="constant">constant</option>
                <option key="monthly" value="monthly">monthly</option>
              </DropdownSelect>
            </div>
          </MenuItemRow>

          <MenuItemRow className="DataEntryStyles">
    {/* End */}
            <div className='DataEntryStyles'>
              End
              <UtilityButton
                name="End"
                icon={!doesEnd ? CheckBoxOutlineBlank : CheckBoxOutlined}
                handleClick={() => {
                  if (currentState.args.endTime === undefined) {
                    setValue('args.endTime', currentState.args.eventTime);
                  };
                  setValue('args.doesEnd', !doesEnd);
                }}
              />
            </div>

    {/* End Date */}
            {doesEnd && (
              <div className="DataEntryStyles">
                End Date
                {!isControlledEndDate ? (
                  <DateSelector
                    register={register('args.endTime')}
                    control={control}
                    selected={currentState.args.endTime!}
                  />
                ) : (
                  <DateSelector selected={endMarkerTime} />
                )}
              </div>
            )}
          </MenuItemRow>

  {/* Marker Control End */}
          {doesEnd && hasMarkers && (
            <MenuItemContainer className="DataEntryStyles">
              Marker
              <DropdownSelect
                register={register('markerControl.endMarkerId')}
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
        </>)}

        <MenuDivider />

{/* Save and Delete */}
        <MenuItemContainer className="SaveDeleteStyles">
          <SaveButton />
          {eventId !== undefined && <DeleteButton onClick={handleDelete} />}
        </MenuItemContainer>

      </form>
      </ScrollContainer>
    </Menu>
  );
};
