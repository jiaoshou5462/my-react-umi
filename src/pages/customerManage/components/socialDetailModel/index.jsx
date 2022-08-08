import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import { Row, Col, Tag, Form, Checkbox, Input, Modal, Table, Select, Button, message,Pagination} from "antd";
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import style from "./style.less"

const { TextArea } = Input;
const socialDetailModel = (props) => {
  const [form] = Form.useForm();
  let { dispatch, socialDetailVisible, detailId, hiddleSocialDetailModel } = props,
    [behaviorsList, setBehaviorsList] = useState([]),
    [showMore, setShowMore] = useState(false),
    [visible, setVisible] = useState(false),
    [detailData, setDetailData] = useState({}),
    [totalCount,  setTotalCount] = useState(0),
    [behaviorsData, setBehaviorsData] = useState({
      pageInfo: {     
        pageNo: 1,
        pageSize: 30
      }
    })
  /*回调*/
  useEffect(() => {
    if (socialDetailVisible) {
      setVisible(socialDetailVisible);
    }
  }, [socialDetailVisible])
  useEffect(() => {
    if (detailId && socialDetailVisible) {
      getUserDetail()
      getInteractionRecord()
    }
  }, [detailId,socialDetailVisible])
  let handleCancel = () => {
    setVisible(false)
    hiddleSocialDetailModel(false)
  }
  let handleOk = () =>{
    // setConfirmVisible(true)
    form.submit();
  }
  let getUserDetail = () => {
    dispatch({
      type: 'customerListDetail/toSocietyCustomerDetail',
      payload: {
        method: 'postJSON',
        params: {
          customerId:detailId
        }
      },
      callback: (res) => {
        if(res.result.code === '0') {
          setDetailData(res.body)
        }else {
          message.error(res.result.message)
        } 

    }})
    
  }
  /* 获取用户行为时间 */
/*获取用户行为次数详情*/
let getinteractionRecordTime = (time,isShow,index) => {
  let data = {
    objectId: detailId,
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
let data =behaviorsData
data.objectId = detailId
dispatch({
  type: 'customerListDetail/interactionRecord',
  payload: {
    method: 'postJSON',
    params: data
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
      <Modal
        width={630}
        title="社交好友信息卡片"
        maskClosable={false}
        visible={visible}
        onOk={handleOk} 
        onCancel={handleCancel}
        footer={[<Button className={style.btn_radius} htmlType="submit" onClick={handleCancel}>取消</Button>]}
      >
        <div className={style.content}>
           <div className={style.avatar}>
             <img src={detailData.headImageUrl}/>
             <div className={style.phone}>
               <a style={{display:'block'}} onClick={() => { location.replace(location.href) }}>{detailData.customerName}</a>
             </div>
             <Row>
               <Col span={8}>
                  <div>联系方式</div>
                  <div>{detailData.customerPhone}</div>
               </Col>
               <Col span={8}>
                  <div>微信昵称</div>
                  <div>{detailData.nickName}</div>
               </Col>
               <Col span={8}>
                  <div>微信地区</div>
                  <div>{detailData.country} {detailData.province} {detailData.city}</div>
               </Col>
             </Row>
           </div>
           <div className={style.total}>社交事件：{totalCount}件</div>
            <div>
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
          </div>
        </div>
      </Modal>
    </>
  )
};
export default connect(({ customerListDetail }) => ({
}))(socialDetailModel)
