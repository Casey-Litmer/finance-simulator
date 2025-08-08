import { CSSProperties, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckBoxOutlineBlank, CheckBoxOutlined } from "@mui/icons-material";
import { useSim } from "src/contexts";
import { AccountConstructorMap } from "src/simulation";
import { AccountJSON } from "src/simulation/types";
import { Menu, MenuItemContainer } from "src/components/menu";
import { DeleteButton, SaveButton, UtilityButton } from "src/components/buttons";
import { DateSelector, DropdownSelect, InputField } from "src/components/dataentry";
import { getToday } from "src/utils";




interface NewAccountMenuProps {
  accountId?: number;
};

/*Create init arguments if no accountId is given, else, edit json.*/
export function NewAccountMenu(props: NewAccountMenuProps) {
  const { accountId } = props;
  const simulation = useSim();
  const today = getToday().time;
  const [openState, setOpenState] = useState(false);
  const { handleSubmit,
    register,
    watch,
    setValue,
    control,
    formState: { errors } } =
    useForm<AccountJSON>({
      mode: 'onChange',
      defaultValues: (accountId !== undefined) ?
        simulation.saveState.accounts[accountId] : {
          args: {
            openDate: today,
            name: `Account ${simulation.getLastAccId() + 1}`,
          },
          accountType: 'Checking Account',
          eventIds: []
        }
    }
    );
  const currentState = watch();

  //=========================================================================================
  //Params
  const title = (accountId === undefined) ? 'New Account' : `Edit ${simulation.saveState.accounts[accountId]?.args.name}`;

  //=========================================================================================
  //Hydration Station
  const accountTypes = Object.keys(AccountConstructorMap)
    .filter((key) => key !== 'Account')
    .map((key, i) => (<option key={i} value={key}>{key}</option>));

  //=========================================================================================
  //Conditions
  const isSavingsAccount = (currentState.accountType === 'Savings Account');

  //=========================================================================================
  //Errors
  const initialBalBounds = (value: any) => {
    return (value < 0) ?
      'Starting balance must be positive' : true;
  };
  const interestRateBounds = (value: any) => {
    return (value < 0 || value > 1) ?
      'Interest rate must be in the range [0, 100]' : true;
  };
  const interestPeriodBounds = (value: any) => {
    return (value < 1) ?
      `Event period must be >= 1 days` : true;
  };

  //=========================================================================================
  //Dispatch to simProvider
  const handleSave = (accountJSON: AccountJSON) => {
    setOpenState((prev) => !prev);

    if (accountId === undefined) {
      simulation.addAccount(accountJSON);
    } else {
      simulation.dispatchSaveState({ partial: { accounts: { [accountId]: accountJSON } } });
    };
  };

  //Delete Account
  const handleDelete = () => {
    //Are you sure?...
    setOpenState((prev) => !prev);
    simulation.deleteAccount(accountId!);
  };

  //=========================================================================================
  return (
    <Menu title={title} openState={openState} setOpenState={setOpenState}>
      <form onSubmit={handleSubmit(handleSave)}>

        <MenuItemContainer sx={dataEntryStyles}>
          Account Name
          <InputField
            type='string'
            errors={errors}
            register={register('args.name')}
            control={control}
          />
        </MenuItemContainer>

        <MenuItemContainer sx={dataEntryStyles}>
          Open Date
          <DateSelector
            errors={errors}
            register={register('args.openDate')}
            control={control}
            selected={currentState.args.openDate}
          />
        </MenuItemContainer>

        <MenuItemContainer sx={dataEntryStyles}>
          Starting Balance
          <InputField
            type='number'
            errors={errors}
            register={register('args.initialBal', {
              valueAsNumber: true,
              validate: { initialBalBounds }
            })}
            control={control}
            convertOutput={Number}
            defaultValue={currentState.args.initialBal ?? 0}
          />
        </MenuItemContainer>

        <MenuItemContainer sx={dataEntryStyles}>
          Account Type
          <DropdownSelect
            register={register('accountType')}
            control={control}
          >
            {accountTypes}
          </DropdownSelect>
        </MenuItemContainer>

        {(isSavingsAccount) && <>
          <MenuItemContainer sx={dataEntryStyles}>
            Interest Rate (%)
            <InputField
              type='number'
              errors={errors}
              register={register('args.interestRate', {
                valueAsNumber: true,
                validate: { interestRateBounds }
              })}
              control={control}
              defaultValue={currentState.args.interestRate ?? 0}
              convertInput={(val: number) => val * 100}
              convertOutput={(val: string) => Number(val) / 100}
            />
          </MenuItemContainer>

          <MenuItemContainer sx={dataEntryStyles}>
            Interest Period (Days)
            <InputField
              type='number'
              errors={errors}
              register={register('args.interestPeriod', {
                valueAsNumber: true,
                validate: { interestPeriodBounds }
              })}
              control={control}
              convertOutput={Number}
              defaultValue={currentState.args.interestPeriod ?? 1}
            />
          </MenuItemContainer>

          <MenuItemContainer sx={dataEntryStyles}>
            Period Start Date
            <DateSelector
              register={register('args.periodStart')}
              control={control}
              selected={currentState.args.periodStart ?? today}
            />
          </MenuItemContainer>

          <MenuItemContainer sx={dataEntryStyles}>
            Prorate
            <UtilityButton
              name="Prorate"
              icon={currentState.args.prorate ? CheckBoxOutlineBlank : CheckBoxOutlined}
              handleClick={() => setValue('args.prorate', !currentState.args.prorate)}
            />
          </MenuItemContainer>
        </>}

        <MenuItemContainer sx={{ gap: '16px', paddingTop: '8px' }}>
          <SaveButton />
          {(accountId !== undefined) &&
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