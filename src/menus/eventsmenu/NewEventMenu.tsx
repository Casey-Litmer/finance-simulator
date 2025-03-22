import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { useSim } from '../../contexts/SimProvider';
import Menu from '../../components/menu/Menu';
import ExitButton from '../../components/buttons/ExitButton';
import MenuItemContainer from '../../components/menu/MenuItemContainer';
import { useTime } from '../../contexts/TimeProvider';
import { EventJSON } from '../../simulation/types';
import { EventConstructorMap } from '../../simulation/ConstructorMaps';
import {DateSelector, DropdownSelect, InputField} from '../../components/dataentry/DataEntry';
import SaveButton from '../../components/buttons/SaveButton';
import { useForm } from 'react-hook-form';
import UtilityButton from '../../components/buttons/UtitlityButton';
import { CheckBoxOutlineBlank, CheckBoxOutlineBlankTwoTone, CheckBoxOutlined } from '@mui/icons-material';
import DeleteButton from '../../components/buttons/DeleteButton';
import { convertTime } from '../../simulation/helpers/timeMethods';




interface NewEventMenuProps {
    accountId?: number;  //TODO make optional
    eventId?: number;
};

/*Create init arguments if no accountId is given, else, edit json.*/
export default function NewEventMenu(props: NewEventMenuProps) {

    const {eventId, accountId} = props;

    if (accountId === undefined && eventId === undefined) throw Error('An id must be provided');

    const simulation = useSim();
    const today = useTime().today;
    const [openState, setOpenState] = useState(false);

    const { handleSubmit, 
            register, 
            watch, 
            setValue,
            trigger,
            control, 
            formState: {errors},
        } = useForm<EventJSON>({
            //criteriaMode: 'all',
            mode: 'onChange',
            //reValidateMode: "onChange",
            defaultValues: (eventId !== undefined) ? 
                simulation.saveState.events[eventId] : 
                {   args: {
                        eventTime: today,
                        value: 0,
                        eventPeriod: 7,
                        periodMode: 'constant',
                        doesEnd: false
                    }, 
                    eventType: 'Deposit', 
                    accountIds: [accountId]
                }
        });
    const currentState = watch();

     //Get accountId if eventId is known
    const [currentAccountId, setCurrentAccountId] = useState(
        accountId ?? simulation.saveState.events[eventId!]?.accountIds[0]
    );

    //=========================================================================================
    //Params
    const title = (eventId === undefined) ? 'New Event' : `Edit ${simulation.saveState.events[eventId]?.eventType}`;
    const eventTypeParameters = paramsFromEventType(currentState.eventType);
    const periodUnits = {'monthly': 'months', 'constant': 'days'}[currentState.args.periodMode ?? 'constant']
                        ?.replace(currentState.args.eventPeriod === 1 ? 's' : '','');
                        
    //=========================================================================================
    //Hydration Station
    const eventTypes = Object.keys(EventConstructorMap)
        .filter((key) => key !== 'Event')
        .map((key) => (<option value={key}>{key}</option>));

    const otherAccounts = Object.keys(simulation.saveState.accounts)
        .filter((key) => Number(key) !== currentAccountId)
       
    //=========================================================================================
    //Conditions
    const isTransfer = ['Transfer', 'Periodic Transfer'].includes(currentState.eventType);
    const isPeriodic = currentState.eventType.includes('Periodic');
    const doesEnd = currentState.args.doesEnd;
    const hasValue = !['Close Account'].includes(currentState.eventType);
    const isChangeInterestRate = currentState.eventType === 'Change Interest Rate';
    const isMonthlyMode = currentState.args.periodMode === 'monthly';
    
    //=========================================================================================
    //Errors
    const monthlyCanUseDay = (_: any) => {
        const dayOfMonth = convertTime(currentState.args.eventTime, 'DateTime').day;
        return (isMonthlyMode && isPeriodic && dayOfMonth >= 29) ?
        'Monthly mode can only be used on days up to the 28th of the month.' : true;
    };
    const monthlyPeriodIsInt = (_: any) => {
        const period = currentState.args.eventPeriod;
        return (isMonthlyMode && isPeriodic && period !== Math.floor(period!)) ?
            'Monthly mode requires an integer number of months.' : true;
    };
    const periodBounds = (value: any) => {
        return (value < 1) ?
            `Event period must be >= 1 ${periodUnits}` : true;
    };
    const valueBounds = (value: any) => {
        return (value < 0) ?
            `${eventTypeParameters.label} must be positive` : true;
    };
    const interestRateBounds = (value: any) => {
        return (value > 1 || value < 0) ?
            'Interest rate must be in the range [0, 100]' : true;
    };

    //Error updates
    useEffect(() => {
        trigger('args.periodMode');
    }, [currentState.args.eventTime, currentState.args.periodMode]);

    //=========================================================================================
    //Dispatch to simProvider
    const handleSave = (eventJSON: EventJSON) => {
        setOpenState((prev) => !prev);

        if (eventId === undefined) {
            simulation.addEvent(eventJSON);
        } else {
            simulation.dispatchSaveState({events:{[eventId]:eventJSON}});
        };
    };

    //Delete Event
    const handleDelete = () => {
        setOpenState((prev) => !prev);
        simulation.deleteEvent(eventId!);
    };

    //=========================================================================================
    //Swap transfer
    const handleSwap = () => {
        currentState.accountIds.reverse();
        setCurrentAccountId(currentState.accountIds[0]);
        setValue('accountIds', currentState.accountIds);
    };

    //Manually set default transfer-to
    const [lastIsTransfer, setLastIsTransfer] = useState(isTransfer);
    useEffect(() => {
        if (lastIsTransfer !== isTransfer) {
            setValue('accountIds', 
                (isTransfer && otherAccounts.length > 0) ?
                [currentAccountId, Number(otherAccounts[0])] : [currentAccountId]
            );
            setLastIsTransfer(isTransfer);
        };
    }, [isTransfer]);
 
    //=========================================================================================
    return (
        <Menu title={title} openState={openState} setOpenState={setOpenState}>
            <form onSubmit={handleSubmit(handleSave)}>
                
                <MenuItemContainer sx={dataEntryStyles}>
                    Event Name
                    <InputField
                        type='string'
                        errors={errors}
                        register={register('args.name')}
                        control={control}
                        convertInput={nm => nm ?? ''}
                        convertOutput={nm => nm.length ? nm : undefined}
                    />
                </MenuItemContainer>

                <MenuItemContainer sx={dataEntryStyles}>
                    Event Date
                    <DateSelector 
                        register={register('args.eventTime')}
                        control={control}
                        selected={currentState.args.eventTime}
                    />
                </MenuItemContainer>
                
                <MenuItemContainer sx={dataEntryStyles}>
                    Event Type
                    <DropdownSelect
                        register={register('eventType')}
                        control={control}
                    >
                        {eventTypes}
                    </DropdownSelect>
                </MenuItemContainer>

                {(hasValue && !isChangeInterestRate) &&
                    <MenuItemContainer sx={dataEntryStyles}>
                        {`${eventTypeParameters.label}:`}
                        <InputField
                            type='number'
                            errors={errors}
                            register={register('args.value', {
                                valueAsNumber: true,
                                validate: {valueBounds}
                            })}
                            control={control}
                            convertOutput={x => Number(Number(x).toFixed(2))}
                            defaultValue={currentState.args.value}
                        />
                    </MenuItemContainer>
                }

                {(isChangeInterestRate) &&
                    <MenuItemContainer sx={dataEntryStyles}>
                    {`${eventTypeParameters.label}:`}
                    <InputField
                        type='number'
                        errors={errors}
                        register={register('args.value', {
                            valueAsNumber: true,
                            validate: {interestRateBounds}
                        })}
                        control={control}
                        defaultValue={currentState.args.value}
                        convertInput={(val:number) => val*100}
                        convertOutput={(val:string) => Number(val)/100}
                    />
                </MenuItemContainer>
                }

                {(isTransfer && otherAccounts.length > 0) &&
                    <>
                    <MenuItemContainer sx={dataEntryStyles}>
                        Transfer To
                        <DropdownSelect 
                            register={register('accountIds')}
                            control={control}
                            convertInput={(accIds) => accIds[1]}
                            convertOutput={(accId) => [currentAccountId, Number(accId)]}
                            defaultValue={currentState.accountIds}
                        >
                            {otherAccounts.map((key) => 
                            (<option value={key}>
                                {simulation.saveState.accounts[Number(key)].args.name}
                            </option>))
                            }
                        </DropdownSelect>
                    </MenuItemContainer>  
                    
                    <MenuItemContainer sx={{gap: '16px', paddingTop:'8px'}}>
                        Swap Transfer
                        <UtilityButton
                            name="Swap Transfer"
                            icon={CheckBoxOutlineBlankTwoTone}
                            handleClick={handleSwap}
                        />
                    </MenuItemContainer> 
                    </>
                }

                {(isPeriodic) && <>
                    <MenuItemContainer sx={dataEntryStyles}>
                        {`Period (${periodUnits})`}
                        <InputField
                            type='number'
                            errors={errors}
                            register={register('args.eventPeriod', {
                                valueAsNumber: true,
                                validate: {monthlyPeriodIsInt, periodBounds}
                            })}
                            convertOutput={Number}
                            control={control}
                            defaultValue={currentState.args.eventPeriod}
                        />
                    </MenuItemContainer>
                    
                    <MenuItemContainer sx={dataEntryStyles}>
                        Period Mode
                        <DropdownSelect
                            register={register('args.periodMode', {
                                validate:{monthlyCanUseDay},
                            })} 
                            control={control}
                            errors={errors}
                        >
                            {['constant', 'monthly'].map((mode) => <option value={mode}>{mode}</option>)}
                        </DropdownSelect>
                    </MenuItemContainer>
                    
                    <MenuItemContainer sx={dataEntryStyles}>
                        Doesn't End
                        <UtilityButton 
                            name="Doesn't End"
                            icon={doesEnd ? CheckBoxOutlineBlank : CheckBoxOutlined}
                            handleClick={() => setValue('args.doesEnd', !doesEnd)}
                        />
                    </MenuItemContainer>
                    
                    {(doesEnd) &&
                        <MenuItemContainer sx={dataEntryStyles}>
                            End Date
                            <DateSelector 
                                register={register('args.endTime')}
                                control={control}
                                selected={currentState.args.endTime ?? currentState.args.eventTime}    
                            />
                        </MenuItemContainer>
                    }
                </>}

                <MenuItemContainer sx={{gap: '16px', paddingTop:'8px'}}>
                    <SaveButton />
                    {(eventId !== undefined) &&
                        <DeleteButton onClick={handleDelete}/>
                    }   
                </MenuItemContainer>

            </form>
        </Menu>
     );
};

//=========================================================================================

const dataEntryStyles = {
    flexDirection:'column', 
    alignItems:'flex-start',
} as CSSProperties;



const paramsFromEventType = (eventType: string): {
    bounds: {min?: number, max?: number}
    label: string
} => {
    if (eventType === 'Change Interest Rate') return {
        label: 'New Rate',
        bounds: {min:0, max:100},
    };
    if (eventType === 'Adjustment') return {
        label: 'New Balance',
        bounds: {}
    };
    return {
        label:'Amount',
        bounds: {min: 0}
    };
};   
