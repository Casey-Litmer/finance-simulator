import { UUID } from 'crypto';
import { Theme } from '@emotion/react';
import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@mui/icons-material';
import { SxProps } from '@mui/material';
import { useSim } from 'src/contexts';
import { UtilityButton } from './UtitlityButton';



interface VisibilityButtonProps {
  id: UUID;
  type: 'account' | 'event' | 'marker';
  sx?: SxProps<Theme>;
};

export function VisibilityButton(props: VisibilityButtonProps) {
  const { id, type, sx } = props;
  const simulation = useSim();

  //=================================================================================

  const visible = {
    "account": simulation.saveState.accounts[id]?.display.visible,
    "event": simulation.saveState.events[id]?.display.active,
    "marker": simulation.saveState.markers[id]?.display.visible
  }[type];

  const handleVisible = () => simulation.dispatchSaveState({
    "account": { partial : { accounts: { [id]: { display: { visible: !visible } } }}},
    "event": { partial : { events: { [id]: { display: { active: !visible } } }}},
    "marker": { partial : { markers: { [id]: { display: { visible: !visible } } }}}
  }[type]);

  //=================================================================================
  return (
    <UtilityButton
      name='Visible'
      icon={visible ? CheckBoxOutlined : CheckBoxOutlineBlank}
      handleClick={handleVisible}
      sx={{ position: 'absolute', right: '16px', ...sx }}
    />
  );
};
