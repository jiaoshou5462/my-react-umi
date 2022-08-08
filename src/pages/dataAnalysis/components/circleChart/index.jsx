import React, { useEffect, useState } from "react";
import { connect, history } from 'umi';
import { Row,Col, message } from 'antd';
import style from "./style.less";
import { Pie    } from '@ant-design/charts';
import { micrometerChange } from '../../dataChange'

const circleChart = (props) => {
  let { dispatch,typeChart,circleChartData,pieChartData,innerRadius } = props,
      [config,setConfig] = useState({}),
      [configs,setConfigs] = useState({})
  useEffect(()=>{
    let config = {
      appendPadding: 30,
      data: circleChartData,
      angleField: 'itemCount',
      colorField: 'itemName',
      width:600,
      height:400,
      radius: 0.8,
      innerRadius: innerRadius,
      interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
      tooltip: {
        formatter:(datum) => {
          return { name: datum.itemName, value: micrometerChange(datum.itemCount) };
        }
      },
      label: {
        type: 'spider',
        labelHeight: 28,
        formatter: (datum) => {
          return `${datum.itemName}\n${micrometerChange(datum.itemCount)}人 | ${((datum.percent) * 100).toFixed(2)}%`;
        },
        style: {
          fontSize: 12,
          fill: "#999"
        }
      },  
      statistic: {
        title: false,
        content: {
          style: {
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
          content: '',
        },
      },
      legend: false
    };
    setConfig(config)
  },[circleChartData])

  useEffect(()=>{
    var configs= {
      data: pieChartData,
      angleField: 'itemCount',
      colorField: 'itemName',
      radius: 0.8,
      with: 300,
      height:300,
      label:{
        content:'{percentage}'
      },
      // color: ['#36CBCB', '#F2637B', '#F2CC09','#F2CC09','#EE4C35','#FF7A45','#37CBCB'],
      // tooltip: {
      //     customContent: (title,items) => {
      //       return (
      //         <div style={{ padding: '10px 0 ', fontSize: '12px', width: 'auto', height: 'auto' }}>
      //           <div><span style={{display:'inline-block',width:'8px',height:'8px',borderRadius:'100%',marginRight: '16px',background:items[0]?items[0].mappingData.color:'gray'}}></span>{title} {items[0]?items[0].value:''}</div>
      //           <div style={{marginLeft:'24px',marginTop:'10px'}}>占比:</div>
      //         </div>
      //       );
      //     }
      //   },
      interactions: [{ type: 'element-active' }],
    };
  
  setConfigs(configs)
},[pieChartData])

  return (
    <>
      <div className={style.chart_content}>
        {configs.data?<Pie {...configs}/>:null}
        {config.data?<Pie {...config}/>:null}
      </div>
    </>
  )
};
export default connect(({ }) => ({
}))(circleChart)
