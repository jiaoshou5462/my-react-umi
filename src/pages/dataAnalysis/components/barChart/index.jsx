import React, { useEffect, useState } from "react";
import { connect, history } from 'umi';
import style from "./style.less";
import { Bar } from '@ant-design/charts';
import { micrometerChange } from '../../dataChange'

const columnChart = (props) => {
  let { dispatch,barChartData } = props,
      [config, setConfig] = useState({})
  
  useEffect(() => {
    let config  = {
      data: barChartData?barChartData:[],
      xField: 'precentage',
      yField: 'itemName',
      seriesField: 'itemCount',
      legend: false,
      color: "#7AE0C8",
      yAxis: {
        label: { formatter: (v) => `${v}` },
        grid: {
          line: false
        }
      },
      meta: {
        precentage: {
          min: 0,
          max: 100,
        }  
      },
      xAxis: {
        label: { formatter: (v) => `${v}%` },
        grid: {
          line: {
            style: {
              lineDash: [4, 2],
              strokeOpacity: 0.7,
            }
          }
        }
      },
      label: {
        style: {
          fill: '#111',
          opacity: 0.7
        },
        position: "right",
        formatter: (datum) => {
          return `${datum.precentage}%`;
        },
      },
      tooltip: {
        customContent: (title, data) => {
          if (title) {
            return `<div class=${style.tools}><h5>${title}</h5><p>人数：${micrometerChange(data[0].data.itemCount)}</p><p>占比：${data[0].data.precentage}%</p></div>`;
          }
        }
      }
    };
  setConfig(config)
},[barChartData])

  return (
    <>
      <div className={style.chart_content}>
        {config.data?<Bar {...config} height={450}/>:null}
      </div>
      
    </>
  )
};
export default connect(({  }) => ({
}))(columnChart)
