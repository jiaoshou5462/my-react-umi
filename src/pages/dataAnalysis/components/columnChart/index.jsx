import React, { useEffect, useState } from "react";
import { connect, history } from 'umi';
import style from "./style.less";
import { Column } from '@ant-design/charts';
import { micrometerChange } from '../../dataChange'

const columnChart = (props) => {
  let { dispatch,columnChartData } = props,
      [config, setConfig] = useState({})
  
  useEffect(() => {
  let config = {
    data: columnChartData,
    xField: 'itemName',
    yField: 'itemCount',
    label: {
      content:'',
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter:(v) => {
          return micrometerChange(v)
        }
      }
    },
    tooltip: {
      formatter:(datum) => {
        return { name: datum.itemName, value: micrometerChange(datum.itemCount)};
      }
    },
    color: "#5AC5E9",
    meta: {
      itemName: { alias: '年龄' },
      itemCount: { alias: '用户人数' },
    }
  };
  setConfig(config)
},[columnChartData])
  return (
    <>
      <div className={style.chart_content}>
        {config.data?<Column {...config} height={370}/>:null}
      </div>
    </>
  )
};
export default connect(({  }) => ({
}))(columnChart)
