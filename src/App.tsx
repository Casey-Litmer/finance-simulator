import './App.css';
import { FileProvider, MenuProvider, SimProvider, ThemeContextProvider, TimeProvider, WindowProvider } from './contexts';
import { Header } from './components/header';
import { BoundSelectors } from './components/boundselector';
import { MenuContainer } from './menus';
import { SimPlot } from './plot';



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
    <div id='flex-view' style = {{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      height: '100vh'
    }}>
      <Header/>
      <div id='menu-plot-view' style={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        height: '100%'
      }}>
        <MenuContainer />
        <SimPlot />
      </div>
      <BoundSelectors />
    </div>
  );
};
