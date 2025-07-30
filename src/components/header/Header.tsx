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
      className='Header'
      style={{
        backgroundColor: palette.primary.top,
        borderColor: palette.secondary.top,
        height: HEADER_HEIGHT,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
{/* File handling */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem',
        position: 'absolute',
        left: '0.5rem',
      }}>
        {SaveButton()}
        {LoadButton()}
        {FileInput()}
      </div>
{/* Graph Name */}
      <div style={{ margin: '0 auto' }}>
        <p style={{ margin: 0 }}>{graphName}</p>
      </div>
    </div>
  );
};

