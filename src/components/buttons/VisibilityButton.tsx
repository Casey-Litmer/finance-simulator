import { Theme } from '@emotion/react';
import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@mui/icons-material';
import { SxProps } from '@mui/material';
import { useSim } from 'src/contexts';
import { UtilityButton } from './UtitlityButton';



interface VisibilityButtonProps {
  id: number;
  type: 'account' | 'event';
  sx?: SxProps<Theme>;
};

export function VisibilityButton(props: VisibilityButtonProps) {
  const { id, type, sx } = props;
  const simulation = useSim();

  //=================================================================================

  const visible = (type === 'account') ?
    simulation.saveState.accounts[id].display.visible :
    simulation.saveState.events[id].display.active;

  const handleVisible = () => simulation.dispatchSaveState(
    (type === 'account') ?
      { partial : { accounts: { [id]: { display: { visible: !visible } } }}} :
      { partial : { events: { [id]: { display: { active: !visible } } }}}
    );

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
