import { useState } from 'react';
import Menu from '../components/menu/Menu';
import ScrollContainer from '../components/menu/ScrollContainer';
import { useSim } from '../contexts/SimProvider';
import MenuItemContainer, { MenuDivider } from '../components/menu/MenuItemContainer';
import { useForm } from 'react-hook-form';
import { FilterJSON } from '../simulation/types';
import { getToday } from '../simulation/helpers/timeMethods';
import { DateSelector, InputField } from '../components/dataentry/DataEntry';
import '../index.css';  
import SaveButton from '../components/buttons/SaveButton';


interface FilterMenuProps {

};

const FilterMenu = (props: FilterMenuProps) => {
  const { } = props;
  const simulation = useSim();
  const [openState, setOpenState] = useState(false);

  const {
    handleSubmit,
    register,
    watch,
    control,
    //formState: { errors },
  } = useForm<FilterJSON>({  //TODO move to defaults
    mode: 'onChange',
    defaultValues: simulation.saveState.filter ?? {
      filter: true,
      filterBy: { 
        deposit: true,
        withdrawal: true,
        transfer: true,
        closeAccount: true,
        changeInterestRate: true,
        adjustment: true,
        periodicDeposit: true,
        periodicWithdrawal: true,
        periodicTransfer: true, 
        singular: true,
        periodic: true,
        name: '',
        range: {
            after: false,
            startTime: getToday().time,
            before: false,
            endTime: getToday().time + 365*2,
        }
      }
    }
  });
  const currentState = watch();

  //=========================================================================================
  //Dispatch to simProvider

  const handleSave = (filterJSON: FilterJSON) => {
    setOpenState((prev) => !prev);
    simulation.dispatchSaveState({ partial: { filter: filterJSON }});
  };

  //=================================================================================
  return (
    <Menu title='Filter' openState={openState} setOpenState={setOpenState}>
      <ScrollContainer>
        <form onSubmit={handleSubmit(handleSave)}>
{/* Singular */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('filterBy.singular')}
              defaultValue={currentState.filterBy.singular}
              control={control}
            />
            Singular
          </MenuItemContainer>
{/* Periodic */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('filterBy.periodic')}
              defaultValue={currentState.filterBy.periodic}
              control={control}
            />
            Periodic
          </MenuItemContainer>

          <MenuDivider />

{/* Deposits */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('filterBy.deposit')}
              defaultValue={currentState.filterBy.deposit}
              control={control}
            />
            Deposits
          </MenuItemContainer>
{/* Withdrawals */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('filterBy.withdrawal')}
              defaultValue={currentState.filterBy.withdrawal}
              control={control}
            />
            Withdrawals
          </MenuItemContainer>
{/* Transfers */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('filterBy.transfer')}
              defaultValue={currentState.filterBy.transfer}
              control={control}
            />
            Transfers
          </MenuItemContainer>
{/* Close Account */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('filterBy.closeAccount')}
              defaultValue={currentState.filterBy.closeAccount}
              control={control}
            />
            Close Account
          </MenuItemContainer>
{/* Rate Changes */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('filterBy.changeInterestRate')}
              defaultValue={currentState.filterBy.changeInterestRate}
              control={control}
            />
            Rate Changes
          </MenuItemContainer>
{/* Adjustments */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('filterBy.adjustment')}
              defaultValue={currentState.filterBy.adjustment}
              control={control}
            />
            Adjustments
          </MenuItemContainer>

          <MenuDivider />

{/* Periodic Deposits */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('filterBy.periodicDeposit')}
              defaultValue={currentState.filterBy.periodicDeposit}
              control={control}
            />
            Periodic Deposits
          </MenuItemContainer>
{/* Periodic Withdrawals */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('filterBy.periodicWithdrawal')}
              defaultValue={currentState.filterBy.periodicWithdrawal}
              control={control}
            />
            Periodic Withdrawals
          </MenuItemContainer>
{/* Periodic Transfers */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('filterBy.periodicTransfer')}
              defaultValue={currentState.filterBy.periodicTransfer}
              control={control}
            />
            Periodic Transfers
          </MenuItemContainer>

          <MenuDivider />

{/* After */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('filterBy.range.after')}
              defaultValue={currentState.filterBy.range.after}
              control={control}
            />
            After
          </MenuItemContainer>
{/* Start Time */}
          <MenuItemContainer>
            <DateSelector
              register={register('filterBy.range.startTime')}
              control={control}
              selected={currentState.filterBy.range.startTime}
            />
          </MenuItemContainer>
{/* Before */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('filterBy.range.before')}
              defaultValue={currentState.filterBy.range.before}
              control={control}
            />
            Before
          </MenuItemContainer>
{/* End Time */}
          <MenuItemContainer>
            <DateSelector
              register={register('filterBy.range.endTime')}
              control={control}
              selected={currentState.filterBy.range.endTime}
            />
          </MenuItemContainer>
{/* Save */}
          <MenuItemContainer sx={{paddingTop: '8px' }}>
            <SaveButton text='Apply' />
          </MenuItemContainer>
        </form>
      </ScrollContainer>
    </Menu>
  );
};

export { FilterMenu };