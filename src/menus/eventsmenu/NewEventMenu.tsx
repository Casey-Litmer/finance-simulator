import { UUID } from "crypto";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckBoxOutlineBlank, CheckBoxOutlineBlankTwoTone, CheckBoxOutlined } from "@mui/icons-material";
import { useSim } from "src/contexts";
import { getToday } from "src/utils";
import { DeleteButton, SaveButton, UtilityButton } from "src/components/buttons";
import { DateSelector, DropdownSelect, InputField } from "src/components/dataentry";
import { Menu, MenuItemContainer } from "src/components/menu";
import { EventConstructorMap } from "src/simulation";
import { ACC_SUM_TOTAL_ID, NULL_MARKER_ID, TODAY_MARKER_ID } from "src/globals";
import { EventJSON } from "src/types";
import { validateInterestRateBounds, validateMonthlyCanUseDay, validateMonthlyPeriodIsInt, validatePercentValueBounds, validatePeriodBounds, validateValueBounds, valueLabelFromEventType } from "./eventsMenuUtils";


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
              markerId: NULL_MARKER_ID,
              attribute: 'eventDate',
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
  const isControlled = currentState.markerControl.markerId !== NULL_MARKER_ID;

  // ============================================================================
  // Display Parameters
  // ============================================================================

  const title = eventId === undefined ? 'New Event' : `Edit ${simulation.saveState.events[eventId]?.eventType}`;
  const valueLabel = valueLabelFromEventType(currentState.eventType);
  const periodUnits = { 'monthly': 'months', 'constant': 'days' }[currentState.args.periodMode ?? 'constant']
    ?.replace(currentState.args.eventPeriod === 1 ? 's' : '', '');
  const markerTime = isControlled ? 
    simulation.saveState.markers[currentState.markerControl.markerId as UUID].time : 
    today;
  const markerAttribute = currentState.markerControl.attribute;

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

{/* Event Date */}
        <MenuItemContainer className="DataEntryStyles">
          Event Date
          {!isControlled || markerAttribute !== 'eventDate' ? (
            <DateSelector
              register={register('args.eventTime')}
              control={control}
              selected={currentState.args.eventTime}
            />
          ) : (<DateSelector selected={markerTime} />)}
        </MenuItemContainer>

{/* Marker Control */}        
        {markers.length > 0 && (
          <MenuItemContainer className="DataEntryStyles" style={{flexDirection: 'row'}}>
  {/* Marker Id */}
            <div style={{display: 'flex', flexDirection: 'column'}}>
              Marker
              <DropdownSelect
                register={register('markerControl.markerId')}
                control={control}
              >
                {[NULL_MARKER_ID, ...markers].map((id) => (
                  <option key={id} value={id}>
                    {simulation.saveState.markers[id as UUID]?.name ?? 'None'}
                  </option>
                ))}
              </DropdownSelect>
            </div>

  {/* Marker Control Attribute */}
            <div style={{display: 'flex', flexDirection: 'column'}}>
              Parameter
              <DropdownSelect
                register={register('markerControl.attribute')}
                control={control}
              >
                <option key='eventDate' value='eventDate'>Event Date</option>
                <option key='endDate' value='endDate'>End Date</option>
              </DropdownSelect>
            </div>
          </MenuItemContainer>
        )}

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

{/* Event Value */}
        {(hasValue && !isChangeInterestRate) && (
          <MenuItemContainer className="DataEntryStyles">
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
          </MenuItemContainer>
        )}

{/* Percent Mode */}
        {(hasPercentMode) && (
          <MenuItemContainer className="DataEntryStyles">
            Percentage Mode
            <UtilityButton
              name="Percentage"
              icon={!percentMode ? CheckBoxOutlineBlank : CheckBoxOutlined}
              handleClick={() => setValue('args.percentMode', !percentMode)}
            />
          </MenuItemContainer>
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
          <>
  {/* Transfer to */}
            <MenuItemContainer className="DataEntryStyles">
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
            </MenuItemContainer>

  {/* Swap Transfer */}
            <MenuItemContainer sx={{ gap: '16px', paddingTop: '8px' }}>
              Swap Transfer
              <UtilityButton
                name="Swap Transfer"
                icon={CheckBoxOutlineBlankTwoTone}
                handleClick={handleSwap}
              />
            </MenuItemContainer>
          </>
        )}

{/* Periodic */}
        {isPeriodic && (<>
  {/* Period */}
          <MenuItemContainer className="DataEntryStyles">
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
          </MenuItemContainer>

  {/* Period Mode */}
          <MenuItemContainer className="DataEntryStyles">
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
          </MenuItemContainer>

  {/* Doesn't End */}
          <MenuItemContainer className="DataEntryStyles">
            Doesn't End
            <UtilityButton
              name="Doesn't End"
              icon={doesEnd ? CheckBoxOutlineBlank : CheckBoxOutlined}
              handleClick={() => {
                if (currentState.args.endTime === undefined) {
                  setValue('args.endTime', currentState.args.eventTime);
                };
                setValue('args.doesEnd', !doesEnd);
              }}
            />
          </MenuItemContainer>

  {/* Does End */}
          {doesEnd && (
            <>
    {/* End Date */}
              <MenuItemContainer className="DataEntryStyles">
                End Date
                {!isControlled || markerAttribute !== 'endDate' ? (
                  <DateSelector
                    register={register('args.endTime')}
                    control={control}
                    selected={currentState.args.endTime!}
                  />
                ) : (
                  <DateSelector selected={markerTime} />
                )}
              </MenuItemContainer>
            </>
          )}
        </>)}

{/* Save and Delete */}
        <MenuItemContainer sx={{ gap: '16px', paddingTop: '8px' }}>
          <SaveButton />
          {eventId !== undefined && <DeleteButton onClick={handleDelete} />}
        </MenuItemContainer>

      </form>
    </Menu>
  );
};
