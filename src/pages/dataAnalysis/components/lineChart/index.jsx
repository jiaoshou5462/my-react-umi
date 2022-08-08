import React, { useEffect, useState } from "react";
import { connect, history } from 'umi';
import { Steps, message } from 'antd';
import style from "./style.less";
import { Line  } from '@ant-design/charts';
import { micrometerChange } from '../../dataChange'

const { Step } = Steps;

const lineChartPage = (props) => {
  let { dispatch, lineChartData } = props,
      [dataList,setDataList] = useState([]),
      [config, setConfig] = useState({
        data: [],
        xField: 'statisticsDays',
        yField: 'value',
        seriesField: 'category',
        xAxis: { },
        legend:{
          position: 'bottom'
        }
      })
  
  useEffect(()=>{
    if(lineChartData.length>0){
      let config = {
        data: lineChartData,
        xField: 'statisticsDays',
        yField: 'value',
        seriesField: 'category',
        xAxis: {},
        legend:{
          position: 'bottom'
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
            return { name: datum.category, value: micrometerChange(datum.value) };
          }
        },
      }
      setConfig(config)
    }else{
      let config = {
        data: [],
        xField: '',
        yField: 'value',
        seriesField: 'category',
        xAxis: { },
        legend:{
          position: 'bottom'
        }
      }
      setConfig(config)
    }

},[lineChartData])

 

  return (
    <>
      <div className={style.chart_content}>
        <Line {...config} />
      </div>
    </>
  )
};
export default connect(({  }) => ({
}))(lineChartPage)
