import { useState } from "react";
import { useForm } from "react-hook-form";
import { SaveButton } from "src/components/buttons";
import { DateSelector, InputField } from "src/components/dataentry";
import { Menu, MenuDivider, MenuItemContainer, ScrollContainer } from "src/components/menu";
import { useSim } from "src/contexts";
import { defaultFilter } from "src/globals";
import { FilterJSON } from "src/simulation/types";



interface FilterMenuProps {

};

export const FilterMenu = (props: FilterMenuProps) => {
  const { } = props;
  const simulation = useSim();
  const [openState, setOpenState] = useState(false);

  const {
    handleSubmit,
    register,
    watch,
    control,
    //formState: { errors },
  } = useForm<FilterJSON>({
    mode: 'onChange',
    defaultValues: simulation.saveState.filter ?? defaultFilter
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
              register={register('singular')}
              defaultValue={currentState.singular}
              control={control}
            />
            Singular
          </MenuItemContainer>
{/* Periodic */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('periodic')}
              defaultValue={currentState.periodic}
              control={control}
            />
            Periodic
          </MenuItemContainer>

          <MenuDivider />

{/* Deposits */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('deposit')}
              defaultValue={currentState.deposit}
              control={control}
            />
            Deposits
          </MenuItemContainer>
{/* Withdrawals */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('withdrawal')}
              defaultValue={currentState.withdrawal}
              control={control}
            />
            Withdrawals
          </MenuItemContainer>
{/* Transfers */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('transfer')}
              defaultValue={currentState.transfer}
              control={control}
            />
            Transfers
          </MenuItemContainer>
{/* Close Account */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('closeAccount')}
              defaultValue={currentState.closeAccount}
              control={control}
            />
            Close Account
          </MenuItemContainer>
{/* Rate Changes */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('changeInterestRate')}
              defaultValue={currentState.changeInterestRate}
              control={control}
            />
            Rate Changes
          </MenuItemContainer>
{/* Adjustments */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('adjustment')}
              defaultValue={currentState.adjustment}
              control={control}
            />
            Adjustments
          </MenuItemContainer>

          <MenuDivider />

{/* Periodic Deposits */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('periodicDeposit')}
              defaultValue={currentState.periodicDeposit}
              control={control}
            />
            Periodic Deposits
          </MenuItemContainer>
{/* Periodic Withdrawals */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('periodicWithdrawal')}
              defaultValue={currentState.periodicWithdrawal}
              control={control}
            />
            Periodic Withdrawals
          </MenuItemContainer>
{/* Periodic Transfers */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('periodicTransfer')}
              defaultValue={currentState.periodicTransfer}
              control={control}
            />
            Periodic Transfers
          </MenuItemContainer>

          <MenuDivider />

{/* After */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('range.after')}
              defaultValue={currentState.range.after}
              control={control}
            />
            After
          </MenuItemContainer>
{/* Start Time */}
          <MenuItemContainer>
            <DateSelector
              register={register('range.startTime')}
              control={control}
              selected={currentState.range.startTime}
            />
          </MenuItemContainer>
{/* Before */}
          <MenuItemContainer>
            <InputField className='checkbox'
              type='checkbox'
              register={register('range.before')}
              defaultValue={currentState.range.before}
              control={control}
            />
            Before
          </MenuItemContainer>
{/* End Time */}
          <MenuItemContainer>
            <DateSelector
              register={register('range.endTime')}
              control={control}
              selected={currentState.range.endTime}
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
