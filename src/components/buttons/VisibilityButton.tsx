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
    simulation.saveState.accountsDisplay[id].visible :
    simulation.saveState.eventsDisplay[id].active;

  const handleVisible = () => simulation.dispatchSaveState(
    (type === 'account') ?
      { partial: { accountsDisplay: { [id]: { visible: !visible } } } } :
      { partial: { eventsDisplay: { [id]: { active: !visible } } } }
    );

  //=================================================================================
  return (
    <UtilityButton
      name='Visible'
      icon={visible ?
        CheckBoxOutlined : CheckBoxOutlineBlank}
      handleClick={handleVisible}
      sx={{ position: 'absolute', right: '16px', ...sx }}
    />
  );
};
