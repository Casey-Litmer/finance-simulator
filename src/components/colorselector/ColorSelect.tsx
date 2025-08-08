import { useEffect, useState } from 'react';
import { HslStringColorPicker } from "react-colorful";
import { Popover } from '@mui/material';
import SquareIcon from '@mui/icons-material/Square';
import { Color, ScatterLine } from 'plotly.js';
import { UtilityButton } from '../buttons';



const dashes = [
  <option key={0} value={"solid"}>_____</option>,
  <option key={1} value={"dot"}>. . . .</option>,
  <option key={2} value={"dash"}>- - - -</option>,
  <option key={3} value={"longdash"}>-- -- --</option>,
  <option key={4} value={"dashdot"}>- . - . -</option>,
  <option key={5} value={"longdashdot"}>-- . -- .</option>,
];

//=================================================================================

interface ColorSelectProps {
  line: Partial<ScatterLine>;
  callback: (line: Partial<ScatterLine>) => void;
};

export function ColorSelect(props: ColorSelectProps) {
  const { line, callback } = props;
  const { color, dash } = line;
  const [newDash, setNewDash] = useState(dash ?? 'solid');
  const [newColor, setNewColor] = useState(color ?? `hsl(${Math.random()},1,1)`);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isPickingColor, setIsPickingColor] = useState(false);

  //=================================================================================
  // Update Colors / Dashes

  useEffect(() => {
    setNewColor(color ?? `hsl(${Math.random()},1,1)`);
    setNewDash(dash ?? 'solid');
  }, [color, dash]);

  //=================================================================================
  // Handlers

  const handleClick = (e: any) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleColor = (c: Color) => {
    setNewColor(c);
  };
  const handleDash = (e: any) => {
    callback({ dash: e.target.value });
    setNewDash(e.target.value);
  };

  //=================================================================================
  // Registers onMouseUp when outside the color picker

  useEffect(() => {
    const handleMouseUp = () => {
      if (isPickingColor) {
        callback({ color: newColor });
        setIsPickingColor(false);
      };
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [isPickingColor, newColor]);

  //=================================================================================
  return (<>
    <UtilityButton
      name='Color'
      icon={SquareIcon}
      handleClick={handleClick}
      sx={{ position: 'absolute', right: '40px', scale: '80%', color: newColor.toString() }}
    />
    <Popover
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 48
      }}
    >
      <div style={{ padding: '16px' }}>
        <HslStringColorPicker
          style={{ position: 'relative' }}
          color={newColor.toString()}
          onChange={handleColor}
          onMouseDown={() => setIsPickingColor(true)}
        />
        <div style={{ flexDirection: 'row', marginTop: '4px' }}>
          <select
            value={newDash}
            onChange={handleDash}
          >
            {dashes}
          </select>
          {'\u00A0 Line Style'}
        </div>

      </div>
    </Popover>
  </>);
};

