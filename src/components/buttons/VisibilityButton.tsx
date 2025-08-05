import UtilityButton from './UtitlityButton';
import { useSim } from '../../contexts/SimProvider';
import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@mui/icons-material';


interface VisibilityButtonProps {
  id: number;
  type: 'account' | 'event';
  className?: string;
};

export default function VisibilityButton(props: VisibilityButtonProps) {
  const { id, type, className } = props;
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
      icon={visible ? CheckBoxOutlined : CheckBoxOutlineBlank}
      handleClick={handleVisible}
      className={`absolute right-4 ${className}`}
    />
  );
};
