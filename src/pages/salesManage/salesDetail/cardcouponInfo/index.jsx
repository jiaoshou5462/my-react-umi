import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Table, Select, Row, Space, Button, DatePicker, Radio, Pagination, Tag, Modal, message, Col } from "antd";
import style from "./style.less";
import moment from 'moment';
import { Tooltip } from 'antd';
import DownOutlined from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 
const cardcouponInfo = (props) => {
  let { dispatch,carInfo } = props;
  console.log(carInfo)
  let [tabTitle, setTabTitle] = useState('1');// 我的卡券我的套餐
  const [group1, setGroup1] = useState('unUse');// 卡券
  const [group2, setGroup2] = useState('unsend');// 套餐
  let [callList, setCallList] = useState(false);
  let [couponList1, setCouponList1] = useState([]);// 卡券列表
  let [couponList2, setCouponList2] = useState([]);// 套餐列表
  useEffect(() => {
    querySaleCards('unUse');// 初始化加载卡券列表
  },[callList])
  // 我的卡券查询
  const querySaleCards = (label) => {
    dispatch({
      type: 'salesManageModel/querySaleCards',
      payload: {
        method: 'get',
        params: {
          label,//状态
          mobilePhone:carInfo.telephone,//手机号
          objectId:history.location.query.objectId,//销售ID
        },
      },
      callback: (res) => {
        setCouponList1(res.body)
      }
    })
  }
  // 我的套餐查询
  const querySaleCardPackages = (label) => {
    dispatch({
      type: 'salesManageModel/querySaleCardPackages',
      payload: {
        method: 'get',
        params: {
          label,//状态
          mobilePhone:carInfo.telephone,//手机号
          objectId:history.location.query.objectId,//销售ID
        },
      },
      callback: (res) => {
        setCouponList2(res.body)
      }
    })
  }
  // 切换监听
  const cardCheckTab = (e) => {
    console.log(e.target.value,'cardCheckTab')
    setTabTitle(e.target.value)
    if(e.target.value==1) {
      querySaleCards('unUse');
      setGroup1('unUse');
      return false;
    }
    if(e.target.value==2) {
      querySaleCardPackages('unsend');
      setGroup2('unsend');
      return false;
    }
  }
  // 温馨提示
  let explainText = <div>
    <p style={{ fontSize: '16px' }}>使用说明：</p>
    <span>说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明</span>
  </div>;
  return (
    <>
      <div className={style.cardcouponInfoPage}>
        <div className={style.chooseTop}>
          <div className={style.left}>
            <Radio.Group onChange={(e)=> {cardCheckTab(e)}} defaultValue="1">
              <Radio.Button style={{ margin: '10px' }} value="1">我的卡券</Radio.Button>
              <Radio.Button style={{ margin: '10px' }} value="2">我的套餐</Radio.Button>
            </Radio.Group>
          </div>
          <div className={style.right}>
            {
              tabTitle == '1' ? (
                <Radio.Group defaultValue={group1} onChange={(e)=> {querySaleCards(e.target.value)}}>
                  <Radio.Button value="unUse">未使用/赠送</Radio.Button>
                  <Radio.Button value="used">已使用</Radio.Button>
                  <Radio.Button value="send">已赠送</Radio.Button>
                  <Radio.Button value="expired">已过期</Radio.Button>
                </Radio.Group>
              ) 
              : 
              (
                <Radio.Group defaultValue={group2} onChange={(e)=> {querySaleCardPackages(e.target.value)}}>
                  <Radio.Button value="unsend">未赠送</Radio.Button>
                  <Radio.Button value="send">已赠送</Radio.Button>
                  <Radio.Button value="expire">已过期</Radio.Button>
                </Radio.Group>
              )
            }
          </div>
        </div>
        <div className={style.cardBottom}>
          <ul>
            {
              tabTitle==1? 
                couponList1 && couponList1.length ? 
                <>
                  {
                    couponList1.map(c1 => {
                      return (
                        <li>
                          <div className={style.viewLeft}>￥{c1.yltCardAmount}</div>
                          <div className={style.explainRight}>
                            <div>{c1.yltCardName}</div>
                            <div style={{ margin: '8px 0 4px' }}>
                              <Tag color="#CEAE75">{c1.count}张</Tag>
                              <span style={{ color: '#999999' }}>有效期至:{c1.yltCardEffectiveEnd}</span>
                            </div>
                            <div>
                              <Tooltip placement="bottom" title={explainText}>
                                <span style={{ color: '#999999' }}>查看使用说明</span>
                              </Tooltip>
                            </div>
                          </div>
                        </li>
                      )
                    })  
                  }
                </> : <div style={{width: '100%', height:'300px', textAlign:'center'}}>暂无卡券</div>
               : 
                couponList2 && couponList2.length ?
                <>
                 {
                    couponList2.map( item => {
                      return (
                        <li>
                          {
                            item.packageContent.map( mItem => <div className={style.viewLeft}>￥{mItem.scCount}</div>)
                          }
                          <div className={style.explainRight}>
                            <div>{item.packageName}</div>
                            <div style={{ margin: '8px 0 4px' }}>
                              <Tag color="#CEAE75">{item.count}张</Tag>
                              <span style={{ color: '#999999' }}>有效期至:{item.yltPackageEffectiveEnd}</span>
                            </div>
                            <div>
                              <Tooltip placement="bottom" title={explainText}>
                                <span style={{ color: '#999999' }}>查看使用说明</span>
                              </Tooltip>
                            </div>
                          </div>
                        </li>
                      )
                    })
                 }
                </> : <div style={{width: '100%', height:'300px', textAlign:'center'}}>暂无卡券</div>
            } 
          </ul>
        </div>

      </div>
    </>
  )
}

export default connect(({ salesManageModel }) => ({
}))(cardcouponInfo)