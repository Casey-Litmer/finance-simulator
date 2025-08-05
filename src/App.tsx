import './App.css';
import SimPlot from './plot/Plot';
import { SimProvider } from './contexts/SimProvider';
import { TimeProvider } from './contexts/TimeProvider';
import { WindowProvider } from './contexts/WindowProvider';
import MenuContainer from './menus/MenuContainer';
import BoundSelectors from './components/boundselector/BoundSelector';
import Header from './components/header/Header';
import { ThemeContextProvider } from './contexts/ThemeProvider';
import { MenuProvider } from './contexts/MenuProvider';
import { FileProvider } from './contexts/FileProvider';

function App() {
  return (
    <div className="App">
      <WindowProvider>
        <ThemeContextProvider>
          <TimeProvider>
            <SimProvider>
              <MenuProvider>
                <FileProvider>
                  <FlexView/>
                </FileProvider>
              </MenuProvider>
            </SimProvider>
          </TimeProvider>
        </ThemeContextProvider>
      </WindowProvider>
    </div>
  );
};

export default App;

/////////////////
// Main Layout //
/////////////////

function FlexView() {
  return (
    <div aria-label='flex-view' className='flex flex-col h-screen' >
      <Header/>
      <div aria-label='menu-plot-view' className='flex flex-row h-full bg-black'>
        <MenuContainer />
        <SimPlot />
      </div>
      <BoundSelectors/>
    </div>
  );
};
