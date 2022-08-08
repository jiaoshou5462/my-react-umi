import React, { useEffect, useState } from "react";
import { connect, history } from 'umi';
import { Steps,message } from 'antd';
import { RadialTreeGraph } from '@ant-design/charts';
import style from "./style.less";
import locale from 'antd/lib/date-picker/locale/zh_CN';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { Row, Col } from "antd"
import SocialDetailModel from '../socialDetailModel'


const { Step } = Steps;
const themeColor = '#1890ff';
const socialCircle = (props) => {
  const config = {
    data:{},
    nodeCfg: {
      size: 40,
      type: 'circle',
      label: {
        style: { 
          fill: '#fff',
        },
      },
      style: {
        fill: themeColor,
        lineWidth: 2,
        strokeOpacity: 0.45,
        shadowColor: themeColor,
        shadowBlur: 0,
      },
      nodeStateStyles: {
        hover: {
          stroke: themeColor,
          lineWidth: 2,
          strokeOpacity: 1,
          cursor: 'pointer'
        },

      },
    },
    edgeCfg: {
      style: {
        stroke: themeColor,
        shadowColor: themeColor,
        shadowBlur: 20,
      },
      endArrow: {
        type: 'triangle',
        fill: themeColor,
        d: 15,
        size: 8,
      },
      edgeStateStyles: {
        hover: {
          stroke: themeColor,
          lineWidth: 2,
        },
      },
    },
    onReady: (graph) => {
      graph.on('node:click', (evt) => {
        setDetailId(evt.item._cfg.model.id)
        setSocialDetailVisible(true)
      });
    },
    behaviors: ['drag-canvas', 'zoom-canvas', 'drag-node']
  }
  let hiddleSocialDetailModel = () =>{
    setSocialDetailVisible(false)
  }
  let customerId = history.location.query.customerId
  let { dispatch } = props,
      [behaviorsList, setBehaviorsList] = useState([]),
      [detailId, setDetailId] = useState(''),
      [socialDetailVisible, setSocialDetailVisible] = useState(false),
      [showMore, setShowMore] = useState(false),
      [showChart, setShowChart] = useState(1),
      [configData, setConfigData] = useState({
        ...config
      }),
      [totalCount,setTotalCount] = useState(0),
      [behaviorsData, setBehaviorsData] = useState({
        objectId: customerId,
        pageInfo: {     
          pageNo: 1,
          pageSize: 30
        }
  })
  useEffect(()=>{
    if(customerId) {
      getInteractionRecord();
      customerSocialCircle()
    }
  },[customerId])
  /*获取图表数据*/

  let customerSocialCircle = () => {
    let data = {
      objectId: customerId
    }
    dispatch({
      type: 'customerListDetail/customerSocialCircle',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if(res.result.code === '0') {
          let data = JSON.parse(JSON.stringify(configData))
          data.data = res.body
          setConfigData(data)
        }else {
          message.error(res.result.message)
        } 
      }
    })
  }


  /*获取用户行为次数详情*/
  let getinteractionRecordTime = (time,isShow,index) => {
    let data = {
      objectId: customerId,
      behaviorTimes:time,
      pageInfo: {
        pageNo: 1,
        pageSize: 30
      }
    }
    dispatch({
      type: 'customerListDetail/interactionRecordTime',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if( res.result.code === '0' ) {  
          let data = JSON.parse(JSON.stringify(behaviorsList))       
          data[index].list = res.body.list
          data[index].isShow = isShow
          setBehaviorsList(data);
        } else {
          message.error(res.result.message)
        } 
      }
    })
  }

/* 获取用户行为时间 */
let getInteractionRecord = (type) => {
  dispatch({
    type: 'customerListDetail/interactionRecord',
    payload: {
      method: 'postJSON',
      params: behaviorsData
    },
    callback: (res) => {
      if( res.result.code === '0' ) {     
        res.body.list.forEach(item => {
          item.isShow = false
        })  
        if(type === 'more') {
          if( res.body.list.length>0) {
            let dataList = behaviorsList.concat(res.body.list)
            setBehaviorsList(dataList);
          }else {
            setShowMore(false)
          }
        } else {
          setBehaviorsList(res.body.list);
        }
        res.body.list.length==30?setShowMore(true):setShowMore(false)
        setTotalCount(res.body.pageInfo.totalCount)
      }else {
        message.error(res.result.message)
      }  
    }
  })
}
/* 展开活跃列表*/
 let openList = (time,isShow,index) => {
    getinteractionRecordTime(time,isShow,index)
 }

 /* 加载更多数据 */
 let addMore = () => {
    behaviorsData.pageInfo.pageNo = behaviorsData.pageInfo.pageNo+1;
    setBehaviorsData(JSON.parse(JSON.stringify(behaviorsData)));
    getInteractionRecord('more')
 }
  return (
    <>
      <div className={style.chart_content}>
        <Row>
          <Col span={12}>
            <div className={style.chart_title}>社会交际{configData.data.children?configData.data.children.length+1:1}人</div>
            {configData.data?<RadialTreeGraph {...configData} className={style.chart_part}/>:null}
          </Col>
          <Col span={12}>
            <div className={style.chart_title_a}>总互动数 {totalCount}次</div>
            {behaviorsList.map((item,index)=>{
            return  <div className={style.steps_content}>
            <div className={style.step_part}>
                <div className={style.left_part}>{item.behaviorTimes}</div>
                 <div className={style.middle_line}>
                     <div className={style.dot}></div>
                 </div>
                 <div className={style.right_part}>
                     <div><span className={style.part_title}>活跃度{item.behaviorCount}次</span> 
                        {!item.isShow?<DownOutlined onClick={()=>{openList(item.behaviorTimes,!item.isShow,index)}}/>:<UpOutlined  onClick={()=>{openList(item.behaviorTimes,!item.isShow,index)}}/>}
                     </div>
                     <ul className={item.isShow?style.show_block:style.hiddle_block}>
                        {item.list?item.list.map((listItem)=>{
                          return <li><span style={{marginRight: '10px'}}>{listItem.behaviorTimes}</span> {listItem.toCustomerName}领取了{listItem.fromCustomerName}转发了{listItem.cardName}</li>
                        }):null}
                     </ul>
                 </div>
             </div>
         </div>
        })}
        {showMore? <div className={style.add_more} onClick={() => {addMore()}}> 加载更多...</div> : null}
          </Col>
        </Row>
        {socialDetailVisible?<SocialDetailModel socialDetailVisible={socialDetailVisible} detailId={detailId} hiddleSocialDetailModel={hiddleSocialDetailModel}/>:null}
      </div>
    </>
  )
};
export default connect(({ customerListDetail }) => ({
}))(socialCircle)
