import React, { useEffect, useState } from "react";
import { connect, history } from 'umi';
import {  message } from 'antd';
import style from "./style.less";
import { Area,TinyArea} from '@ant-design/charts';
import { formatDate } from '@/utils/date'

const areaChartPage = (props) => {
  let { dispatch, areaChartData,smallChart} = props,
      [areaDataCount, setAreaDataCount] = useState({}),
      [dataList,setDataList] = useState([]),
      [smallChartData,setSmallChartData] = useState([]),
      [xField, setXField] = useState(''),
      [config,setConfig] = useState({})

  useEffect(()=>{
    if(areaChartData.list){
      dataChange()
    }
  },[areaChartData])

  let dataChange = () =>{
    let areaDataList = areaChartData.list
    let smallObj = areaChartData.smallObj
    setConfig({
      data:  areaDataList,
      xField: areaChartData.xField,
      seriesField: areaChartData.defaultValueName,
      yField: areaChartData.defaultValue,
      smooth: true,
      legend: false,
      xAxis: {
        range: [0, 1],
        line: {style:{
          stroke:'#1890FF'
       }} 
      },
      yAxis: {
        line: {
          style:{
            stroke:'#1890FF'
          }
        } 
      },
      areaStyle: {
        fill: '#1890FF'
      }})
    smallChart.forEach(item=>{
      item.config = {
        height: 52,
        width: 142,
        autoFit: false,
        xAxis: {
          range: [0, 1],
          line: {style:{
            stroke:'#1890FF'
         }} 
        },
        data: smallObj[item.value],
        smooth: true,
        areaStyle: { fill: item.color },
      };
    })
    setXField(areaChartData.xField)
    setSmallChartData(smallChart)
    setDataList(areaDataList)
    setAreaDataCount(areaChartData.count?areaChartData.count:{})
  }


  /* 点击更改图表 */
  let selectChartChange = (item) => {
    console.log(xField)
    setConfig({
      data: dataList,
      xField: xField,
      yField: item.value,
      seriesField: item.type,
      smooth: true,
      xAxis: {
        range: [0, 1],
        line: {style:{
          stroke:'#1890FF'
       }} 
      },
      yAxis: {
        line: {
          style:{
            stroke:'#1890FF'
          }
        } 
      },
      areaStyle: {
        fill: item.color
      }})
  }

  return (
    <>
      <div className={style.chart_content}>
        {config.data?<Area {...config} />:null}
        <div className={style.sigle_chart}>
           {smallChartData.map(item=>{
              return <div className={style.chart} onClick={()=>selectChartChange(item)}>
                    <div className={style.chart_title}>{item.title}</div>
                    <div className={style.chart_num}><span>{areaDataCount[item.value]}</span></div>
                    <TinyArea  {...item.config} />
                  </div>
           })}
        </div>
      </div>
    </>
  )
};
export default connect(({  }) => ({
}))(areaChartPage)
