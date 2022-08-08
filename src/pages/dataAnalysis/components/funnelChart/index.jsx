import React, { useEffect, useState } from "react";
import { connect, history } from 'umi';
import { Row,Col, message } from 'antd';
import style from "./style.less";
import { Funnel   } from '@ant-design/charts';
import arrow from './arrow.png'
import smallArrow from './smallArrow.png'
import { micrometerChange } from '../../dataChange'

const funnelChartPage = (props) => {
  let { dispatch,funnelChartData,unit} = props,
      [config, setConfig] = useState({})
 
  useEffect(() => {
    let config = {
      data: funnelChartData,
      xField: 'itemName',
      yField: 'itemCount',
      height: 292,
      padding:[20,100,20,100],
      legend: false,
      label: {
        formatter: (datum) => {
          return `${datum.itemName}\n${micrometerChange(datum.itemCount)} ${unit}`;
        },
        style: {
          fontSize: 15
        }
      },
      tooltip: {
        formatter:(datum) => {
          return { name: datum.itemName, value: micrometerChange(datum.itemCount) };
        }
      },
      color: ['#3AA0FF', '#36CBCB', '#4DCB73','#FAD337', '#F2637B'],
    };
    setConfig(config)

  },[funnelChartData])
  return (
    <>
      <div className={style.chart_content}>
        <Row>
          {/* <Col span={8} >
            <div style={{display:'flex'}}>
              <div className={style.left_part}>
                <div>总转化率</div>
                <div>{funnelChartData[0]?funnelChartData[0].precentage+'%':''}</div>
                <img src={arrow} style={{marginTop:'8px'}}></img>
              </div>
              <div className={style.right_part}>
                {funnelChartData.map((item,index) => {
                   return <div>
                     <div className={style.data_part}>
                        <span>{item.itemName}</span>
                        <span className={style.num}>{item.itemCount}{unit}</span>
                      </div>
                      {index+1!==funnelChartData.length?<div className={funnelChartData.length==5?'':style.arrow_space}><img src={smallArrow} className={style.small_arrow}></img> <span>{funnelChartData[index+1].precentage}%</span></div> :null}
                  </div>
                })}
              </div>
            </div>
          </Col> */}
          <Col span={24}>
            {funnelChartData.length>0?<div style={{height:'350px'}}>{config.data?<Funnel {...config} />:null}</div>:null}
          </Col>
        </Row>
      </div>
    </>
  )
};
export default connect(({  }) => ({
}))(funnelChartPage)
