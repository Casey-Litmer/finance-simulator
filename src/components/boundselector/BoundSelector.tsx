import React from 'react'
import './BoundSelector.css'
import { useSim } from '../../contexts/SimProvider';
import DatePicker from 'react-datepicker';
import { convertTime } from '../../simulation/helpers/timeMethods';
import { FOOTER_HEIGHT } from '../../globals/CONSTANTS';
import { useTheme } from '@mui/material';



export default function BoundSelectors() {
  const { palette } = useTheme();

  //=================================================================================
  return (
    <div className='BoundSelectors' style={{
      height: FOOTER_HEIGHT,
      backgroundColor: palette.secondary.middle,
      borderColor: palette.secondary.top
    }}>
      <BoundSelector bound='min' style={{ width: '64px', left: 32 }} />
      <BoundSelector bound='max' style={{ width: '64px', right: 136 }} />
    </div>
  );
};


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
    <label className='BoundSelector' style={style}>
      <p style={{ margin: 0, whiteSpace: 'nowrap' }}>
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
