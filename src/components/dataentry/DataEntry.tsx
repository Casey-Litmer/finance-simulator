import React, {CSSProperties, ReactNode } from 'react'
import DatePicker from 'react-datepicker';
import './DataEntry.css';
import "react-datepicker/dist/react-datepicker.css";
import { Control, Controller, FieldErrors, FieldValues, UseFormRegisterReturn } from 'react-hook-form';
import { convertTime, DateFloat } from '../../simulation/helpers/timeMethods';



interface FormHookProps {
    errors?: FieldErrors<FieldValues>;
    register?: UseFormRegisterReturn;
    control?: Control<any, any>
    convertInput?: (val: any) => any;
    convertOutput?: (val: string) => any;
};

//=========================================================================================
interface DateSelectorProps extends FormHookProps {
    selected: DateFloat;
};
export function DateSelector(props: DateSelectorProps) {
    const {control, selected, errors, register} = props;

    return (
        <Controller
            name='Date'
            control={control}
            {...register}
            render={({field}) => <>
                <DatePicker 
                    className= {'DateSelector DataEntry'}
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
    return (
        <Controller
            name='Dropdown'
            control={control}
            {...register}
            render={({field}) => <>
                <select 
                    style={style} 
                    className='DataEntry'
                    value={convertInput(field.value ?? defaultValue)}
                    onChange={(e) => {
                        const output = convertOutput(e.target.value);
                        field.onChange({target:{value:output}});
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
    defaultValue?: string | number;
    bounds?: {min?: number, max?: number};
};
/**Must pass defaultValue if using convertInput*/
export function InputField(props: InputFieldProps) {
    const { style,  
            type, 
            errors, 
            register,
            control,
            defaultValue,
            convertInput = (val) => val,
            convertOutput = (val) => val
        } = props;

    //Prevent enter from submitting form here
    const handleEnter = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === 'Enter') ev.preventDefault();
    };

    return (
        <Controller 
            name='Input'
            control={control}
            {...register}
            render={({field}) => <>
                <input 
                    className='DataEntry'
                    type={type}
                    step='any'
                    onKeyDown={handleEnter}
                    autoComplete='off'
                    style={style} 
                    defaultValue={convertInput(field.value ?? defaultValue)}
                    onChange={(e) => {
                        const output = convertOutput(e.target.value);
                        field.onChange({target:{value:output}});
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
    errors:FieldErrors<FieldValues>, 
    register:UseFormRegisterReturn
) => {
    if (errors && register !== undefined) {
        const errorPath = register.name.split('.')
        let subProp: any = errors;
        for (const prop of errorPath) {
            subProp = subProp?.[prop];
            if (subProp === undefined) {
                return undefined};
        };
        return <div style={errorStyles}>{subProp.message}</div>;
    };
    return undefined;
};

//classNames do not dynamically compile :(
const errorStyles = {
    color:'red',
    'font-size': '12px',
    paddingBottom: '8px',
    'text-align': 'left'
};