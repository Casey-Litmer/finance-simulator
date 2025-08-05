import './Header.css';
import { useTheme } from '@mui/material';
import { HEADER_HEIGHT } from '../../globals/CONSTANTS';
import { useFile } from '../../contexts/FileProvider';



export default function Header() {
  const { palette } = useTheme();
  const { SaveButton, LoadButton, FileInput, graphName } = useFile();

  //=================================================================================
  return (
    <div
      style={{height: HEADER_HEIGHT}}
      className='
        flex flex-row items-center
        bg-primary-top
        border-b-[1px] border-secondary-top
      '
    >
{/* File handling */}
      <div className='absolute flex gap-[0.5rem] left-[0.5rem]'>
        {SaveButton()}
        {LoadButton()}
        {FileInput()}
      </div>
{/* Graph Name */}
      <div style={{ margin: '0 auto' }}>
        <p className='m-0'>{graphName}</p>
      </div>
    </div>
  );
};

