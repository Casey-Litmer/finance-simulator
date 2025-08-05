import React from 'react';
import DatePicker from 'react-datepicker';
import './BoundSelector.css';
import { useSim } from '../../contexts/SimProvider';
import { convertTime } from '../../simulation/helpers/timeMethods';
import { FOOTER_HEIGHT } from '../../globals/CONSTANTS';



export default function BoundSelectors() {

  //=================================================================================
  return (<div 
    style={{height: FOOTER_HEIGHT}}
    className='
      relative flex items-center w-screen z-50 
      border-t-[1px]
      border-secondary-top bg-secondary-middle
    '
  >
    <BoundSelector bound='min' style={{ width: '64px', left: 32 }} />
    <BoundSelector bound='max' style={{ width: '64px', right: 136 }} />
  </div>);
};

//=================================================================================

interface BoundSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  bound: 'min' | 'max';
};

function BoundSelector({ bound, style }: BoundSelectorProps) {
  const simulation = useSim();
  const xDomain = simulation.saveState.xDomain;

  //=================================================================================

  const handleChange = (date: Date | null) => {
    const newValue = convertTime(date, 'number');
    simulation.dispatchSaveState({
      partial:
        (bound === 'min') ? { xDomain: { start: newValue } } : { xDomain: { stop: newValue } }
    });
  };

  //=================================================================================
  return (
    <label className='absolute' style={style}>
      <p className='m-0 whitespace-nowrap'>
        {`${(bound === 'min') ? 'Start' : 'End'} Date`}
      </p>
      <DatePicker
        onChange={handleChange}
        selected={convertTime((bound === 'min') ? xDomain.start : xDomain.stop, 'Date')}
        fixedHeight
      />
    </label>
  );
};
