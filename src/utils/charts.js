// -------------------------------------------------------------------------------------------------

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4plugins_forceDirected from '@amcharts/amcharts4/plugins/forceDirected';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import { dateTimeToFormat } from './timeHandler'

am4core.useTheme(am4themes_animated);

const interfaceColors = new am4core.InterfaceColorSet();

// -------------------------------------------------------------------------------------------------

export function createForceDirectedTree(htmlElement) {
  return am4core.create(htmlElement, am4plugins_forceDirected.ForceDirectedTree);
}

export function createForceDirectedSeries(chart) {
  const series = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries());

  // Data fields
  series.dataFields.linkWith = 'linkWith';
  series.dataFields.name = 'name';
  series.dataFields.id = 'id';
  series.dataFields.value = 'value';
  series.dataFields.children = 'children';
  series.dataFields.color = 'color';

  // Series
  series.data = [];
  series.fontSize = 8;
  series.linkWithStrength = 0;
  // series.manyBodyStrength = 20;

  // Node template
  const nodeTemplate = series.nodes.template;
  nodeTemplate.tooltipText = '{name}';
  nodeTemplate.fillOpacity = 1;
  nodeTemplate.label.hideOversized = true;
  nodeTemplate.label.text = '{name}';
  nodeTemplate.label.truncate = true;

  // Link template
  const linkTemplate = series.links.template;
  linkTemplate.strokeWidth = 1;

  // Link over states
  const linkHoverState = linkTemplate.states.create('hover');
  linkHoverState.properties.strokeOpacity = 1;
  linkHoverState.properties.strokeWidth = 2;

  // nodeTemplate.events.on('over', function (event) {
  //   console.log('hover')
  //   const dataItem = event.target.dataItem;
  //   dataItem.childLinks.each(function (link) {
  //     link.isHover = true;
  //   })
  // });
  //
  // nodeTemplate.events.on('out', function (event) {
  //   console.log('out')
  //   const dataItem = event.target.dataItem;
  //   dataItem.childLinks.each(function (link) {
  //     link.isHover = false;
  //   })
  // });

  return series
}

export function createGradientAreaChart(htmlElement) {
  // ----------  Chart  ----------

  const chart = am4core.create(htmlElement, am4charts.XYChart);

  chart.hiddenState.properties.opacity = 0;
  chart.padding(0, 0, 0, 0);
  chart.zoomOutButton.disabled = true;


  // ----------  Date axis  ----------

  const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.grid.template.location = 0;
  dateAxis.renderer.minGridDistance = 30;
  dateAxis.dateFormats.setKey('second', 'ss');
  dateAxis.periodChangeDateFormats.setKey('second', '[bold]h:mm a');
  dateAxis.periodChangeDateFormats.setKey('minute', '[bold]h:mm a');
  dateAxis.periodChangeDateFormats.setKey('hour', '[bold]h:mm a');
  dateAxis.renderer.inside = true;
  dateAxis.renderer.axisFills.template.disabled = true;
  dateAxis.renderer.ticks.template.disabled = true;


  // ----------  Value axis  ----------

  const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  // valueAxis.tooltip.disabled = true;
  valueAxis.interpolationDuration = 500;
  valueAxis.rangeChangeDuration = 500;
  valueAxis.renderer.inside = true;
  valueAxis.renderer.minLabelPosition = 0.05;
  valueAxis.renderer.maxLabelPosition = 0.95;
  valueAxis.renderer.axisFills.template.disabled = true;
  valueAxis.renderer.ticks.template.disabled = true;


  // ----------  Series  ----------

  const series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.dateX = 'date';
  series.dataFields.valueY = 'value';
  series.interpolationDuration = 500;
  series.defaultState.transitionDuration = 0;
  series.tensionX = 0.8;
  // series.tooltipText = 'Date:{date}\nValue:{value}';

  chart.events.on('datavalidated', function () {
    dateAxis.zoom({ start: 1 / 15, end: 1.2 }, false, true);
  });

  dateAxis.interpolationDuration = 500;
  dateAxis.rangeChangeDuration = 500;

  // All the below is optional, makes some fancy effects
  // Gradient fill of the series
  series.fillOpacity = 1;
  const gradient = new am4core.LinearGradient();
  gradient.addColor(chart.colors.getIndex(0), 0.2);
  gradient.addColor(chart.colors.getIndex(0), 0);
  series.fill = gradient;

  // Make date axis labels to fade out
  dateAxis.renderer.labels.template.adapter.add('fillOpacity', function (fillOpacity, target) {
    const dataItem = target.dataItem;
    return dataItem.position;
  });

  // Need to set this, otherwise fillOpacity is not changed and not set
  dateAxis.events.on('validated', function () {
    am4core.iter.each(dateAxis.renderer.labels.iterator(), function (label) {
      label.fillOpacity = label.fillOpacity;
    })
  });

  // Make date axis labels which are at equal minutes to be rotated
  dateAxis.renderer.labels.template.adapter.add('rotation', function (rotation, target) {
    const dataItem = target.dataItem;
    if (dataItem.date && dataItem.date.getTime() === am4core.time.round(new Date(dataItem.date.getTime()), 'minute').getTime()) {
      target.verticalCenter = 'middle';
      target.horizontalCenter = 'left';
      return -90;
    }
    else {
      target.verticalCenter = 'bottom';
      target.horizontalCenter = 'middle';
      return 0;
    }
  });

  // Bullet at the front of the line
  const bullet = series.createChild(am4charts.CircleBullet);
  bullet.circle.radius = 5;
  bullet.fillOpacity = 1;
  bullet.fill = chart.colors.getIndex(0);
  bullet.isMeasured = false;

  series.events.on('validated', function() {
    if (series.dataItems.last) {
      bullet.moveTo(series.dataItems.last.point);
      bullet.validatePosition();
    }
  });

  return { chart, series }
}

export function createHorizontalDumbbellPlotChart(htmlElement) {
  const chart = am4core.create(htmlElement, am4charts.XYChart);

  // const data = [];
  // let open = 100;
  // let close = 120;
  //
  // const names = [
  //   'Raina',
  //   'Demarcus',
  //   'Carlo',
  //   'Jacinda',
  //   'Richie',
  //   'Antony',
  //   'Amada',
  //   'Idalia',
  //   'Janella',
  //   'Marla',
  //   'Curtis',
  //   'Shellie',
  //   'Meggan',
  //   'Nathanael',
  //   'Jannette',
  //   'Tyrell',
  //   'Sheena',
  //   'Maranda',
  //   'Briana',
  //   'Rosa',
  //   'Rosanne',
  //   'Herman',
  //   'Wayne',
  //   'Shamika',
  //   'Suk',
  //   'Clair',
  //   'Olivia',
  //   'Hans',
  //   'Glennie',
  // ];
  //
  // for (let i = 0; i < names.length; i += 1) {
  //   open  += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 5);
  //   close  = open + Math.round(Math.random() * 10) + 3;
  //   data.push({ category: names[i], open: open, close: close });
  // }
  //
  // chart.data = data;

  const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.ticks.template.disabled = true;
  categoryAxis.renderer.axisFills.template.disabled = true;
  categoryAxis.dataFields.category = 'category';
  categoryAxis.renderer.minGridDistance = 15;
  categoryAxis.renderer.inversed = true;
  categoryAxis.renderer.inside = true;
  categoryAxis.renderer.grid.template.location = 0.5;
  categoryAxis.renderer.grid.template.strokeDasharray = '1,3';
  categoryAxis.visible = false;

  const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
  valueAxis.tooltip.disabled = true;
  valueAxis.renderer.ticks.template.disabled = true;
  valueAxis.renderer.axisFills.template.disabled = true;

  const format = 'yyyy-MM-dd hh:mm:ss';

  const series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.categoryY = 'category';
  series.dataFields.openValueX = 'open';
  series.dataFields.valueX = 'close';
  // series.tooltipText = '{category}\nstartDate: {openValueX.value}\nendDate: {valueX.value}';
  series.sequencedInterpolation = true;
  series.fillOpacity = 0;
  series.strokeOpacity = 1;
  series.columns.template.height = 0.01;
  series.tooltip.pointerOrientation = 'vertical';

  series.adapter.add("tooltipText", function(text, target) {
    const format = 'yyyy-MM-dd hh:mm:ss';
    const startDate = dateTimeToFormat({ date: target.tooltipDataItem.openValueX * 1000, format });
    const endDate   = dateTimeToFormat({ date: target.tooltipDataItem.valueX     * 1000, format });
    return `{category}\nstartDate: ${startDate}\nendDate: ${endDate}`;
  });

  // valueAxis.adapter.add("getTooltipText", (text) => {
  //   return ">>> " + text + " <<<";
  // });

  valueAxis.renderer.labels.template.adapter.add("text", (label, target, key) => {
    const date = label ? parseInt(label.replace(/,/g, ''), 10) * 1000 : 0;
    return dateTimeToFormat({ date, format: 'yyyy-MM-dd hh:mm:ss' });
  });
  valueAxis.renderer.labels.template.rotation = -15;

  // const openBullet = series.bullets.create(am4charts.CircleBullet);
  // openBullet.locationX = 1;

  // const closeBullet = series.bullets.create(am4charts.CircleBullet);
  //
  // closeBullet.fill = chart.colors.getIndex(4);
  // closeBullet.stroke = closeBullet.fill;

  chart.cursor = new am4charts.XYCursor();
  chart.cursor.behavior = 'zoomY';

  chart.scrollbarX = new am4core.Scrollbar();
  chart.scrollbarY = new am4core.Scrollbar();

  return { chart, series }
}

// export function createMarketDepthChart(htmlElement, url = 'https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH&depth=50') {
export function createMarketDepthChart(htmlElement, rawOrders) {
  // ----------  Chart  ----------

  const chart = am4core.create(htmlElement, am4charts.XYChart);


  // ----------  Data sources  ----------

  // // Add data
  // chart.dataSource.url = url;
  // chart.dataSource.reloadFrequency = 30000;
  // chart.dataSource.adapter.add('parsedData', function(data) {
  //
  // });
  // Function to process (sort and calculate cumulative volume)
  function processData(result, list, type, desc) {
    // Convert to data points
    for (let i = 0; i < list.length; i += 1) {
      list[i] = {
        value: Number(list[i][0]),
        volume: Number(list[i][1]),
      }
    }

    // Sort list just in case
    list.sort(function(a, b) {
           if (a.value > b.value) return  1;
      else if (a.value < b.value) return -1;
      else                        return  0;
    });

    // Calculate cumulative volume
    if (desc) {
      for (let i = list.length - 1; i >= 0; i -= 1) {
        list[i].totalvolume = i < (list.length - 1)
          ? list[i].volume + list[i+1].totalvolume
          : list[i].volume;
        result.unshift({
          ['value']              : list[i].value,
          [`${type}volume`]      : list[i].volume,
          [`${type}totalvolume`] : list[i].totalvolume,
        });
      }
    }
    else {
      for (let i = 0; i < list.length; i += 1) {
        list[i].totalvolume = i > 0
          ? list[i].volume + list[i-1].totalvolume
          : list[i].volume;
        result.push({
          ['value']              : list[i].value,
          [`${type}volume`]      : list[i].volume,
          [`${type}totalvolume`] : list[i].totalvolume,
        });
      }
    }
  }

  // Process data
  const result = [];
  processData(result, rawOrders.data.bid, 'bids', true);
  processData(result, rawOrders.data.ask, 'asks', false);
  // return result;

  // Set up precision for numbers
  chart.numberFormatter.numberFormat = '#,###.####';


  // ----------  Axes  ----------

  const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  xAxis.dataFields.category = 'value';
  // xAxis.renderer.grid.template.location = 0;
  xAxis.renderer.minGridDistance = 50;
  // xAxis.title.text = 'Price (BTC/ETH)';

  const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
  yAxis.title.text = 'Volume';


  // ----------  Series  ----------
  chart.data = result;

  const series = chart.series.push(new am4charts.StepLineSeries());
  series.dataFields.categoryX = 'value';
  series.dataFields.valueY = 'bidstotalvolume';
  series.strokeWidth = 2;
  series.data = result;
  series.stroke = am4core.color('#0f0');
  series.fill = series.stroke;
  series.fillOpacity = 0.1;
  series.tooltipText = 'Bid: [bold]{categoryX}[/]\nTotal volume: [bold]{valueY}[/]\nVolume: [bold]{bidsvolume}[/]';

  const series2 = chart.series.push(new am4charts.StepLineSeries());
  series2.dataFields.categoryX = 'value';
  series2.dataFields.valueY = 'askstotalvolume';
  series2.strokeWidth = 2;
  series2.data = result;
  series2.stroke = am4core.color('#f00');
  series2.fill = series2.stroke;
  series2.fillOpacity = 0.1;
  series2.tooltipText = 'Ask: [bold]{categoryX}[/]\nTotal volume: [bold]{valueY}[/]\nVolume: [bold]{asksvolume}[/]';

  const series3 = chart.series.push(new am4charts.ColumnSeries());
  series3.dataFields.categoryX = 'value';
  series3.dataFields.valueY = 'bidsvolume';
  series3.strokeWidth = 0;
  series3.data = result;
  series3.fill = am4core.color('#000');
  series3.fillOpacity = 0.2;

  const series4 = chart.series.push(new am4charts.ColumnSeries());
  series4.dataFields.categoryX = 'value';
  series4.dataFields.valueY = 'asksvolume';
  series4.strokeWidth = 0;
  series4.data = result;
  series4.fill = am4core.color('#000');
  series4.fillOpacity = 0.2;


  // ----------  Cursor  ----------

  chart.cursor = new am4charts.XYCursor();

  return { chart, series, series2, series3, series4 }
}

export function createMultiValueAxesChart(htmlElement, seriesConfiguration) {
  // Create chart instance
  const chart = am4core.create(htmlElement, am4charts.XYChart);

  // Increase contrast by taking evey second color
  chart.colors.step = 2;

  // Add data
  chart.data = generateChartData();

  // Create axes
  const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 50;

  // Create series
  function createAxisAndSeries(field, name, opposite, bulletName) {
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = field;
    series.dataFields.dateX = 'date';
    series.strokeWidth = 2;
    series.yAxis = valueAxis;
    series.name = name;
    series.tooltipText = '{name}: [bold]{valueY}[/]';
    series.tensionX = 0.8;

    const interfaceColors = new am4core.InterfaceColorSet();

    switch(bulletName) {
      case 'triangle': {
        const bullet = series.bullets.push(new am4charts.Bullet());
        bullet.width = 12;
        bullet.height = 12;
        bullet.horizontalCenter = 'middle';
        bullet.verticalCenter = 'middle';

        const triangle = bullet.createChild(am4core.Triangle);
        triangle.stroke = interfaceColors.getFor('background');
        triangle.strokeWidth = 2;
        triangle.direction = 'top';
        triangle.width = 12;
        triangle.height = 12;
        break;
      }

      case 'rectangle': {
        const bullet = series.bullets.push(new am4charts.Bullet());
        bullet.width = 10;
        bullet.height = 10;
        bullet.horizontalCenter = 'middle';
        bullet.verticalCenter = 'middle';

        const rectangle = bullet.createChild(am4core.Rectangle);
        rectangle.stroke = interfaceColors.getFor('background');
        rectangle.strokeWidth = 2;
        rectangle.width = 10;
        rectangle.height = 10;
        break;
      }

      default: {
        const bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.stroke = interfaceColors.getFor('background');
        bullet.circle.strokeWidth = 2;
        break;
      }
    }

    valueAxis.renderer.line.strokeOpacity = 1;
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.stroke = series.stroke;
    valueAxis.renderer.labels.template.fill = series.stroke;
    valueAxis.renderer.opposite = opposite;
    valueAxis.renderer.grid.template.disabled = true;
  }

  seriesConfiguration.forEach(x => {
    createAxisAndSeries(x.field, x.name, x.opposite, x.bullet);
  });
  // createAxisAndSeries('visits', 'Visits', false, 'circle');
  // createAxisAndSeries('views',  'Views',  true,  'triangle');
  // createAxisAndSeries('hits',   'Hits',   true,  'rectangle');

  // Add legend
  chart.legend = new am4charts.Legend();

  // Add cursor
  chart.cursor = new am4charts.XYCursor();

  // generate some random data, quite different range
  function generateChartData() {
    const chartData = [];
    const firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - 100);
    firstDate.setHours(0, 0, 0, 0);

    let visits = 1600;
    let hits = 2900;
    let views = 8700;

    for (let i = 0; i < 15; i += 1) {
      // we create date objects here. In your data, you can have date strings
      // and then set format of your dates using chart.dataDateFormat property,
      // however when possible, use date objects, as this will speed up chart rendering.
      const newDate = new Date(firstDate);
      newDate.setDate(newDate.getDate() + i);

      visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      hits   += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      views  += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);

      chartData.push({
        date: newDate,
        visits: visits,
        hits: hits,
        views: views
      });
    }

    return chartData;
  }
}

export function createProfessionalCandlesticksChart(htmlElement) {
  // ----------  Chart  ----------

  const chart = am4core.create(htmlElement, am4charts.XYChart);

  chart.paddingRight = 20;
  chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd';
  // chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd hh:mm:ss';

  // the following line makes value axes to be arranged vertically.
  chart.leftAxesContainer.layout = 'vertical';


  // ----------  Date Axis  ----------

  const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.grid.template.location = 0;
  dateAxis.renderer.ticks.template.length = 8;
  dateAxis.renderer.ticks.template.strokeOpacity = 0.1;
  dateAxis.renderer.grid.template.disabled = true;
  dateAxis.renderer.ticks.template.disabled = false;
  dateAxis.renderer.ticks.template.strokeOpacity = 0.2;
  dateAxis.tooltipDateFormat = 'yyyy-dd-MM HH:mm:ss';

  // These two lines makes the axis to be initially zoomed-in
  // dateAxis.start = 0.7;
  // dateAxis.keepSelection = true;


  // ----------  Value axis  ----------

  const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.tooltip.disabled = true;
  // valueAxis.zIndex = 1;
  // valueAxis.renderer.baseGrid.disabled = true;

  // // Set up axis
  // valueAxis.renderer.inside = true;
  // valueAxis.height = am4core.percent(60);
  // valueAxis.renderer.labels.template.verticalCenter = 'bottom';
  // valueAxis.renderer.labels.template.padding(2,2,2,2);
  // // valueAxis.renderer.maxLabelPosition = 0.95;
  // valueAxis.renderer.fontSize = '0.8em';
  //
  // // Uncomment these lines to fill plot area of this axis with some color
  // valueAxis.renderer.gridContainer.background.fill = interfaceColors.getFor('alternativeBackground');
  // valueAxis.renderer.gridContainer.background.fillOpacity = 0.05;


  // ----------  Value axis 2  ----------

  const valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis2.tooltip.disabled = true;

  // Makes gap between panels
  valueAxis2.marginTop = 30;
  valueAxis2.renderer.baseGrid.disabled = true;
  valueAxis2.renderer.inside = true;
  valueAxis2.height = am4core.percent(40);
  valueAxis2.zIndex = 3;
  valueAxis2.renderer.labels.template.verticalCenter = 'bottom';
  valueAxis2.renderer.labels.template.padding(2,2,2,2);
  // valueAxis2.renderer.maxLabelPosition = 0.95;
  valueAxis2.renderer.fontSize = '0.8em';

  // Uncomment these lines to fill plot area of this axis with some color
  valueAxis2.renderer.gridContainer.background.fill = interfaceColors.getFor('alternativeBackground');
  valueAxis2.renderer.gridContainer.background.fillOpacity = 0.05;


  // ----------  Series  ----------

  const series = chart.series.push(new am4charts.CandlestickSeries());
  series.dataFields.dateX = 'date';
  series.dataFields.valueY = 'close';
  series.dataFields.openValueY = 'open';
  series.dataFields.lowValueY = 'low';
  series.dataFields.highValueY = 'high';
  series.tooltipText = 'Open:${openValueY.value}\nLow:${lowValueY.value}\nHigh:${highValueY.value}\nClose:${valueY.value}';
  series.name = 'OHLC';

  // !!! Important !!!
  // Candlestick series colors are set in states.
  // !!! Important !!!
  //
  // series.riseFromOpenState.properties.fill = am4core.color('#00ff00');
  // series.dropFromOpenState.properties.fill = am4core.color('#FF0000');
  // series.riseFromOpenState.properties.stroke = am4core.color('#00ff00');
  // series.dropFromOpenState.properties.stroke = am4core.color('#FF0000');

  series.riseFromPreviousState.properties.fillOpacity = 1;
  series.dropFromPreviousState.properties.fillOpacity = 0;


  // ----------  Series 2  ----------

  // const series2 = chart.series.push(new am4charts.ColumnSeries());
  // series2.columns.template.width = am4core.percent(50);
  const series2 = chart.series.push(new am4charts.LineSeries());
  series2.dataFields.dateX = 'date';
  series2.dataFields.valueY = 'volume';
  series2.yAxis = valueAxis2;
  series2.tooltipText = 'Volume:{valueY.value}';
  series2.name = 'Volume';


  // ----------  Cursor  ----------

  chart.cursor = new am4charts.XYCursor();
  chart.cursor.xAxis = dateAxis;


  // ----------  Line series  ----------

  // Separate series for scrollbar
  const lineSeries = chart.series.push(new am4charts.LineSeries());
  lineSeries.dataFields.dateX = 'date';
  lineSeries.dataFields.valueY = 'close';
  // Need to set on default state, as initially series is "show"
  lineSeries.defaultState.properties.visible = false;

  // Hide from legend too (in case there is one)
  lineSeries.hiddenInLegend = true;
  lineSeries.fillOpacity = 0.5;
  lineSeries.strokeOpacity = 0.5;


  // ----------  Scroll bar  ----------

  const scrollbarX = new am4charts.XYChartScrollbar();
  scrollbarX.series.push(lineSeries);
  scrollbarX.marginBottom = 20;
  chart.scrollbarX = scrollbarX;

  return { chart, series, series2 };
}

export function createRangeAreaChart(htmlElement, options = {}) {
  // ----------  Chart  ----------

  const chart = am4core.create(htmlElement, am4charts.XYChart);
  chart.hiddenState.properties.opacity = 0; // this creates initial fade-in


  // ----------  Date axis  ----------

  const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.tooltipDateFormat = 'yyyy-dd-MM HH:mm:ss';


  // ----------  Value axis  ----------

  const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.tooltip.disabled = true;


  // ----------  Series ----------

  const series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.dateX = 'date';
  series.dataFields.openValueY = options.pairA || 'open';
  series.dataFields.valueY = options.pairB || 'close';
  series.dataFields.dateA = 'date';
  series.dataFields.dateB = 'dateB';
  // series.tooltipText = 'pending: {openValueY.value}\nconfirmed: {valueY.value}';
  series.tooltipText = `${options.labelA || 'pending'}: {openValueY.value}\n${options.labelB || 'confirmed'}: {valueY.value}\nDate: {dateA}`;
  // series.stroke = chart.colors.getIndex(2);
  series.stroke = '#000';
  series.sequencedInterpolation = true;
  series.fillOpacity = 0.3;
  series.defaultState.transitionDuration = 100;
  series.tensionX = 1;


  // ----------  Series 2  ----------

  const series2 = chart.series.push(new am4charts.LineSeries());
  series2.dataFields.dateX = 'date';
  series2.dataFields.valueY = options.pairA || 'open';
  series2.sequencedInterpolation = true;
  series2.defaultState.transitionDuration = 100;
  series2.stroke = chart.colors.getIndex(4);
  series2.tensionX = 1;


  // ----------  Cursor & Scrollbar  ----------

  chart.cursor = new am4charts.XYCursor();
  chart.cursor.xAxis = dateAxis;

  chart.scrollbarX = new am4core.Scrollbar();

  return { chart, series, series2 }
}

export function createGanttChart(htmlElement, options = {}) {
  const chart = am4core.create(htmlElement, am4charts.XYChart);
  chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
  chart.paddingRight = 30;
  chart.dateFormatter.dateFormat = "yyyy-MM-dd";
  chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

  var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = "category";
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.inversed = true;

  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 70;
  // dateAxis.baseInterval = { count: 1, timeUnit: "day" };
  dateAxis.baseInterval = { count: 1 };
  dateAxis.renderer.tooltipLocation = 0;

  var series1 = chart.series.push(new am4charts.ColumnSeries());
  series1.columns.template.height = am4core.percent(70);
  series1.columns.template.tooltipText = "{task}: [bold]{openDateX}[/] - [bold]{dateX}[/]";
  series1.dataFields.openDateX = "start";
  series1.dataFields.dateX = "end";
  series1.dataFields.categoryY = "category";
  series1.columns.template.propertyFields.fill = "color"; // get color from data
  series1.columns.template.propertyFields.stroke = "color";
  series1.columns.template.strokeOpacity = 1;

  chart.scrollbarX = new am4core.Scrollbar();

  return { chart, series1 }
}

// -------------------------------------------------------------------------------------------------

export function dispose(chart) {
  if (chart) chart.dispose();
}

export function refresh(chart) {
  if (chart) chart.validateData();
  // if (chart) chart.invalidateData();
}

// -------------------------------------------------------------------------------------------------

export function getColorForString(str) {
  const colorSet = new am4core.ColorSet()
  switch (str.toLowerCase()) {
    case 'call':
      return '#3eb56e' // colorSet.getIndex(0)
      break;
    case 'delegatecall':
      return '#67a4bf' // colorSet.getIndex(1)
      break;
    case 'staticcall':
      return '#35393c' // colorSet.getIndex(2)
      break;
    case 'selfdestruct':
      return '#c74444' // colorSet.getIndex(3)
      break;
    default:
      return '#df8b46' // colorSet.getIndex(4)
  }
}

export function createSankeyDiagramChart(htmlElement, options = {}) {
  const chart = am4core.create(htmlElement, am4charts.SankeyDiagram);
  chart.hiddenState.properties.opacity = 0;

  // chart.dataFields.fromName = "from";
  // chart.dataFields.toName = "to";
  // chart.dataFields.value = "value";
  //
  // chart.links.template.propertyFields.id = "id";
  // chart.links.template.colorMode = "solid";
  // chart.links.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
  // chart.links.template.fillOpacity = 0.1;
  // chart.links.template.tooltipText = "";


  let hoverState = chart.links.template.states.create("hover");
  hoverState.properties.fillOpacity = 0.6;

  chart.dataFields.fromName = "from";
  chart.dataFields.toName = "to";
  chart.dataFields.value = "value";

  // for right-most label to fit
  chart.paddingRight = 30;

  // make nodes draggable
  var nodeTemplate = chart.nodes.template;
  nodeTemplate.inert = true;
  nodeTemplate.readerTitle = "Drag me!";
  nodeTemplate.showSystemTooltip = true;
  nodeTemplate.width = 20;

  // make nodes draggable
  var nodeTemplate = chart.nodes.template;
  nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
  nodeTemplate.showSystemTooltip = true;
  nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer

  // // highlight all links with the same id beginning
  // chart.links.template.events.on("over", function(event){
  //   let link = event.target;
  //   let id = link.id.split("-")[0];
  //
  //   chart.links.each(function(link){
  //     if(link.id.indexOf(id) != -1){
  //       link.isHover = true;
  //     }
  //   })
  // })
  //
  // chart.links.template.events.on("out", function(event){
  //   chart.links.each(function(link){
  //     link.isHover = false;
  //   })
  // })

  // for right-most label to fit
  chart.paddingRight = 30;

  return { chart }
}
