import React, { CSSProperties, ReactNode } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Control, Controller, FieldErrors, FieldValues, UseFormRegisterReturn } from 'react-hook-form';
import { convertTime, DateFloat } from 'src/utils';



interface FormHookProps {
  errors?: FieldErrors<FieldValues>;
  register?: UseFormRegisterReturn;
  control?: Control<any, any>
  convertInput?: (val: any) => any;
  convertOutput?: (val: any) => any;
};

//=========================================================================================
interface DateSelectorProps extends FormHookProps {
  selected: DateFloat;
};
export function DateSelector(props: DateSelectorProps) {
  const { control, selected, errors, register } = props;

  if (!control) return (
    <DatePicker
      className='DateSelector DataEntry'
      selected={convertTime(selected, 'Date')}
      readOnly
    />
  );
  
  //=================================================================================
  return (
    <Controller
      name='Date'
      control={control}
      {...register}
      render={({ field }) => <>
        <DatePicker
          className='DateSelector DataEntry'
          selected={convertTime(field.value ?? selected, 'Date')}
          onChange={(date) => {
            //Round to ignore daylight savings.
            const converted = Math.round(convertTime(date, 'number'));
            field.onChange(converted);
          }}
        />
        {getError(errors!, register!)}
      </>}
    />
  );
};

//=========================================================================================
interface DropdownSelectProps extends FormHookProps {
  children?: ReactNode;
  style?: CSSProperties;
  defaultValue?: any;
};

export function DropdownSelect(props: DropdownSelectProps) {
  const {
    children,
    style,
    defaultValue,
    errors,
    register,
    control,
    convertInput = (val) => val,
    convertOutput = (val) => val
  } = props;

  if (!control) {
    return (
      <select
        style={style}
        className='DataEntry'
        value={convertInput(defaultValue)}
        disabled
      >
        {children}
      </select>
    );
  }

  //=================================================================================
  return (
    <Controller
      name='Dropdown'
      control={control}
      {...register}
      render={({ field }) => <>
        <select
          style={style}
          className='DataEntry'
          value={convertInput(field.value ?? defaultValue)}
          onChange={(e) => {
            const output = convertOutput(e.target.value);
            field.onChange({ target: { value: output } });
          }}
        >
          {children}
        </select>
        {getError(errors!, register!)}
      </>}
    />
  );
};

//=========================================================================================
interface InputFieldProps extends FormHookProps {
  type: string;
  style?: CSSProperties;
  className?: string;
  defaultValue?: string | number | boolean;
  bounds?: { min?: number, max?: number };
};

/**Must pass defaultValue if using convertInput*/
export function InputField(props: InputFieldProps) {
  const { 
    style,
    className,
    type,
    errors,
    register,
    control,
    defaultValue,
    convertInput = (val) => val,
    convertOutput = (val) => val
  } = props;

  //=================================================================================

  //Prevent enter from submitting form here
  const handleEnter = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') ev.preventDefault();
  };

  if (!control) {
    return (
      <input
        className={`DataEntry ${className ?? ''}`}
        style={{ minWidth: 0, boxSizing: 'border-box', ...style }}
        type={type}
        step='any'
        onKeyDown={handleEnter}
        autoComplete='off'
        defaultValue={convertInput(defaultValue)}
        defaultChecked={(type === 'checkbox' && typeof defaultValue === 'boolean') ? defaultValue : undefined}
        readOnly
      />
    );
  }

  //=================================================================================
  return (
    <Controller
      name='Input'
      control={control}
      {...register}
      render={({ field }) => <>
        <input
          className={`DataEntry ${className ?? ''}`}
          style={{ boxSizing: 'border-box', ...style }}
          type={type}
          step='any'
          onKeyDown={handleEnter}
          autoComplete='off'
          defaultValue={convertInput(field.value ?? defaultValue)}
          defaultChecked={(field.value && type === 'checkbox') ?? defaultValue}
          onChange={(e) => {
            const value = type === 'checkbox' ? e.target.checked : e.target.value;
            const output = convertOutput(value);
            field.onChange({ target: { value: output } });
          }}
        />
        {getError(errors!, register!)}
      </>}
    />
  );
};

//=========================================================================================
//Parses type string and locates the error message at that location.
const getError = (
  errors: FieldErrors<FieldValues>,
  register: UseFormRegisterReturn
) => {
  if (errors && register !== undefined) {
    const errorPath = register.name.split('.')
    let subProp: any = errors;
    for (const prop of errorPath) {
      subProp = subProp?.[prop];
      if (subProp === undefined) {
        return undefined
      };
    };
    return <div style={errorStyles}>{subProp.message}</div>;
  };
  return undefined;
};

//classNames do not dynamically compile :(
const errorStyles = {
  color: 'red',
  'font-size': '12px',
  paddingBottom: '8px',
  'text-align': 'left'
};