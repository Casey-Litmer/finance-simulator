import { UUID } from "crypto";
import { useEffect, useMemo, useState } from "react";
import Plot from 'react-plotly.js';
import { PlotData, Shape } from "plotly.js";
import { useTheme } from "@mui/material";
import { useMenu, useSim, useWindow } from 'src/contexts';
import { formatDatetime, getToday } from "src/utils";
import { FOOTER_HEIGHT, HEADER_HEIGHT, MENU_MIN_WIDTH } from "src/globals/CONSTANTS";
import { SimulationData } from "src/simulation/types";




export const SimPlot = () => {
  const { palette } = useTheme();
  const { windowHeight, windowWidth } = useWindow();
  const [plotWidth, setPlotWidth] = useState(0);
  const [plotHeight, setPlotHeight] = useState(0);
  const [plotTranslateX, setPlotTranslateX] = useState(0);
  const simulation = useSim();
  const { menuWidth, openState } = useMenu();

  //=========================================================================================
  
  // Set height from constants
  useEffect(() => {
    setPlotHeight(
      windowHeight - HEADER_HEIGHT - FOOTER_HEIGHT
    );
  }, [windowHeight]);

  // Manually set width and translation.  This is actually an optimization from resize observers :)
  useEffect(() => {
    setPlotWidth(
      openState ?
        windowWidth - menuWidth : windowWidth
    );
    setPlotTranslateX(
      openState ? 0 : -MENU_MIN_WIDTH
    );
  }, [openState, windowWidth, menuWidth]);

  //=========================================================================================

  ///////////////
  // Plot Data //
  ///////////////

  //Back-reference accounts from traceIdx (curveNumber) 
  const traceMap = new Map();

  /*Simdata -> PlotlyData */
  const formatData = (simData?: SimulationData) => {
    if (!simData) return [];

    const timeDomain = simData.timeDomain;
    const formattedTimes = timeDomain.map(time => formatDatetime(time, 'plot'));
    const accountsData = simData.accountsData;

    let traceIdx = 0;

    const traces = Object.entries(accountsData)
      .filter(([key, _]) => //Filter out all non-visible accounts
        simulation.saveState.accounts[key as UUID].display.visible ?? false
      ).map(//to traces
        ([key, accData]) => {
          //Add key to back-map
          traceMap.set(traceIdx, key);
          traceIdx++;

          const labels = formattedTimes.map((time, idx) =>
            `$${accData.bals[idx]?.toFixed(2)}<br>${time}`);
          const lineStyle = simulation.saveState.accounts[key as UUID].display.line;

          return {
            x: formattedTimes,
            y: accData.bals,
            name: accData.account.name,
            hovertemplate: labels,
            mode: 'lines',
            line: { width: 2, simplify: true, ...lineStyle },
          } as PlotData;
        }
      );
    
    return traces;
  };

  // Formatted Data
  const traces = useMemo(() => formatData(simulation.simData),
    [simulation.simData, simulation.saveState.accounts]);

  //=================================================================================
  
  /////////////
  // Markers //
  /////////////

  const today = formatDatetime(getToday().time, 'plot');

  const todayMarkerShape = {
    type: 'line',
    x0: today, x1: today,
    y0: 0, y1: 1,
    xref: 'x', yref: 'paper',
    line: {
      color: 'red',
      width: 2,
      dash: 'dash'
    }
  } as Partial<Shape>;


  //=========================================================================================

  ////////////////////////
  // Chart Interactions //
  ////////////////////////

  const handleClick = (event: Plotly.PlotMouseEvent) => {
    const traceIdx = event.points[0].curveNumber;
    console.log(traceMap.get(traceIdx));
    console.log(simulation.saveState.accounts[traceMap.get(traceIdx)]);
    //Do something with this!
  };

  //=========================================================================================
  return (
    <Plot
      style={{ color: 'black', transform: `translateX(${plotTranslateX}px)` }}
      data={traces}
      onClick={handleClick}
      config={{ displayModeBar: false }}
      layout={{
        //=================================================================================
        // Styles
        //=================================================================================
        title: "Simulation Data",
        plot_bgcolor: palette.primary.main,
        paper_bgcolor: palette.primary.main,
        width: plotWidth,
        height: plotHeight,
        autosize: true,
        margin: { l: 0, r: 4, t: 4, b: 20 }, // Reduce margins
        hovermode: 'x',
        font: {
          shadow: '0px 0px 1px #000000'
        },
        showlegend: false,
        legend: {
          x: 0.25, y: 0.95, // Inside the graph
          xanchor: 'right', yanchor: 'top'
        },
        //=================================================================================
        // Axis
        //=================================================================================
        xaxis: {
          title: "Time",
          tickfont: { color: palette.primary.contrastText },
          color: palette.primary.contrastText,
          ticklabelposition: 'outside',
        },
        yaxis: {
          title: "Balance",
          tickfont: { color: palette.primary.contrastText },
          tickprefix: '$',
          color: palette.primary.contrastText,
          ticklabelposition: 'inside top',
          rangemode: 'tozero',
        },
        //=================================================================================
        // Markers
        //=================================================================================
        shapes: [todayMarkerShape]
      }}
    />
  );
};

