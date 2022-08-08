import React, { useEffect, useState } from "react";
import { connect, history } from 'umi';
import { Steps, message } from 'antd';
import { Column } from '@ant-design/charts';
import style from "./style.less";
import locale from 'antd/lib/date-picker/locale/zh_CN';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

const { Step } = Steps;

const behaviorRecord = (props) => {
    let customerId = history.location.query.customerId
    let { dispatch } = props,
        [behaviorsList, setBehaviorsList] = useState([]),
        [behaviorTotals, setBehaviorTotals] = useState(),
        [showMore, setShowMore] = useState(false),
        [behaviorsData, setBehaviorsData] = useState({
          objectId: customerId,
          pageInfo: {     
            pageNo: 1,
            pageSize: 30
          }
        })
    let data = [
      {
        type: '家具家电',
        sales: 38,
      },
      {
        type: '粮油副食',
        sales: 52,
      },
      {
        type: '生鲜水果',
        sales: 61,
      },
      {
        type: '美容洗护',
        sales: 145,
      },
      {
        type: '母婴用品',
        sales: 48,
      },
      {
        type: '进口食品',
        sales: 38,
      },
      {
        type: '食品饮料',
        sales: 38,
      },
      {
        type: '家庭清洁',
        sales: 38,
      },
    ];
    let config = {
        data: data,
        xField: 'type',
        yField: 'sales',
        label: {
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
        meta: {
          type: { alias: '类别' },
          sales: { alias: '销售额' },
        },
        minColumnWidth: 40,
        maxColumnWidth: 40,
    }
    let list = [
      {title:1412421},
      {title:'asdasfasf'}
    ]
  useEffect(()=>{
    if(customerId) {
      getCustomerBehaviors()
    }
  },[customerId])
  /* 获取用户行为时间 */
  let getCustomerBehaviors = (type) => {
    dispatch({
      type: 'customerListDetail/getCustomerBehaviors',
      payload: {
        method: 'postJSON',
        params: behaviorsData
      },
      callback: (res) => {
        if( res.result.code === '0' ) {     
          res.body.list.behaviors.forEach(item => {
            item.isShow = false
          })  
          if(type === 'more') {
            if( res.body.list.behaviors.length>0) {
              let dataList = behaviorsList.concat(res.body.list.behaviors)
              setBehaviorsList(dataList);
            }else {
              setShowMore(false)
            }
          } else {
            setBehaviorsList(res.body.list.behaviors);
          }
          res.body.list.behaviors.length==30?setShowMore(true):setShowMore(false)
          setBehaviorTotals(res.body.list.behaviorTotals)
        }else {
          message.error(res.result.message)
        }
      }
    })
  }
  /*获取用户行为次数详情*/
  let getBehaviorsByTime = (time,isShow,index) => {
    let data = {
      objectId: customerId,
      behaviorTimes:time,
      pageInfo: {
        pageNo: 1,
        pageSize: 30
      }
    }
    dispatch({
      type: 'customerListDetail/getCustomerBehaviorsByTime',
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
        }else {
          message.error(res.result.message)
        } 
      }
    })
  }
/* 展开活跃列表*/
 let openList = (time,isShow,index) => {
    getBehaviorsByTime(time,isShow,index)
 }

 /* 加载更多数据 */
 let addMore = () => {
    behaviorsData.pageInfo.pageNo = behaviorsData.pageInfo.pageNo+1;
    setBehaviorsData(JSON.parse(JSON.stringify(behaviorsData)));
    getCustomerBehaviors('more')
 }

  return (
    <>
      <div className={style.chart_content}>
        {/* <div className={style.chart_title}>近3个月活跃统计</div> */}
        {/* <Column {...config} className={style.chart_part}/> */}
        <div className={style.chart_title}>近3个月总活跃度{behaviorTotals}次</div>
        {behaviorsList.map((item,index)=>{
            return  <div className={style.steps_content}>
            <div className={style.step_part}>
                <div className={style.left_part}>{item.days}</div>
                 <div className={style.middle_line}>
                 </div>
                 <div className={style.dot}></div>
                 <div className={style.right_part}>
                     <div><span className={style.part_title}>活跃度{item.count}次</span> 
                        {!item.isShow?<DownOutlined onClick={()=>{openList(item.days,!item.isShow,index)}}/>:<UpOutlined  onClick={()=>{openList(item.days,!item.isShow,index)}}/>}
                     </div>
                     <ul className={item.isShow?style.show_block:style.hiddle_block}>
                        {item.list?item.list.map((listItem)=>{
                          return <li>{listItem.times} {listItem.behaviorName}<span style={{float:'right',marginLeft:'20px'}}>x{listItem.count}</span></li>
                        }):null}
                     </ul>
                 </div>
             </div>
         </div>
        })}
        {showMore? <div className={style.add_more} onClick={() => {addMore()}}> 加载更多...</div> : null}
      </div>
    </>
  )
};
export default connect(({ customerListDetail }) => ({
}))(behaviorRecord)
