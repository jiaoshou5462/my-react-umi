/*
 * @Author: wangzhushan
 * @Date: 2022-05-06 16:42:13
 * @LastEditTime: 2022-06-16 21:30:20
 * @LastEditors: Please set LastEditors
 * @Description: 结算预览
 */
import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Tag, Row, Col, Form, Space, Table, Select, Button, Pagination, Modal, ConfigProvider, message, DatePicker } from "antd"
import {InfoCircleOutlined} from '@ant-design/icons';
import style from "./style.less";
import moment from 'moment';
import { parseToThousandth2, parseToThousandth } from '@/utils/date'
import { getRowSpanCount } from '@/utils/utils'
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";

let style666 = { color: '#666', fontWeight: '400', fontSize: '14px'}
let style4B7FE8 = {color: '#4B7FE8', fontWeight: '400', cursor: 'pointer', fontSize: '14px'}


// 结算对账
const financeManagePreview = (props) => {
  let { dispatch } = props;
  let [form] = Form.useForm();
  let [monthlaType, setMonthlaType] = useState(0); 
  let [callback, setCallback] = useState(false);
  let [monthScopeData, setMonthScopeData] = useState([]); // 2年预览时间段
  let [yearOverviewStatisticsInfo, setYearOverviewStatisticsInfo] = useState({});// 统计年度概览基础信息
  let [yearOverviewMonthDetailList, setYearOverviewMonthDetailList] = useState([]);// 统计年度概览基础信息
  
  useEffect(() => {
    yearOverviewSelectMonthScope();
  },[])

  useEffect(() => {
    if(monthScopeData.length> 0) {
      yearOverviewStatistics(monthScopeData);
      yearOverviewMonthDetail(monthScopeData);
    }
  }, [callback])

  // 查询近两年月份范围
  let yearOverviewSelectMonthScope = () => {
    dispatch({
      type: 'financeManagePreview/yearOverviewSelectMonthScope',
      payload: {
        method: 'get',
      },
      callback: res => {
        if(res.result.code==0) {
          setMonthScopeData(res.body);
          yearOverviewStatistics(res.body);
          yearOverviewMonthDetail(res.body)
        }else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 统计年度概览基础信息
  let yearOverviewStatistics = (list) => {
    let params = filterInfo(list);
    dispatch({
      type: 'financeManagePreview/yearOverviewStatistics',
      payload: {
        method: 'postJSON',
        params
      },
      callback: res => {
        if(res.result.code==0) {
          setYearOverviewStatisticsInfo(res.body);
        }else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 查询月度概览详细
  let yearOverviewMonthDetail = (list) => {
    let params = filterInfo(list);
    dispatch({
      type: 'financeManagePreview/yearOverviewMonthDetail',
      payload: {
        method: 'postJSON',
        params
      },
      callback: res => {
        if(res.result.code==0) {
          setYearOverviewMonthDetailList(res.body);
        }else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 参数返回
  let filterInfo = (list) => {
    let newList = list.filter((item,index) => monthlaType== index);
    let info = {
      channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
      endTime: newList[0].endTime,
      startTime: newList[0].startTime,
    }
    return info;
  }
  
  // 两年内的点击事件
  let changeType = (index) => {
    setMonthlaType(index);
    setCallback(!callback)
  }
   /*列表*/
  let renderColumns = () => {
    return ([
      {
        title: '年月',
        dataIndex: 'yearMonth',
        width: 130,
        render: (value, record, index) => {
          const obj = {
            children: value,
            props: {},
          };
          obj.props.rowSpan = getRowSpanCount(yearOverviewMonthDetailList, 'yearMonth', index);
          obj.children = <div>{record.yearMonth}</div>
          return obj;
        }
      },
      {
        title: '业务类型',
        dataIndex: 'businessTypeStr',
        width: 130,
        render: (businessTypeStr, record) => businessTypeTranslate(record)
      },
      {
        title: '订单（笔）',
        align: 'left',
        children: [
          {
            title: '即将对账',
            width: 130,
            dataIndex: 'yltUnConfirmedCount',
            render: (yltUnConfirmedCount, record) => {
              return <span style={style666}>{ orderTranslate(yltUnConfirmedCount, record) ? '-' : window.number_to_thousandth(yltUnConfirmedCount)}</span>
            }
          },
          {
            title: '待确认',
            width: 130,
            dataIndex: 'unConfirmedCount',
            render: (unConfirmedCount, record) => {
              return <span onClick={()=> { unConfirmedCount==0 ? null : not_comfirm(unConfirmedCount,record)}} style={unConfirmedCount==0 ? style666 : style4B7FE8}>{ orderTranslate(unConfirmedCount, record) ? '-' : window.number_to_thousandth(unConfirmedCount)}</span>
            }
          },
          {
            title: '待生成账单',
            width: 130,
            dataIndex: 'unBillCount',
            render: (unBillCount, record) => {
              return <span onClick={()=> {unBillCount==0 ? null : not_generated(unBillCount, record)}} style={ unBillCount==0 ? style666 : style4B7FE8}>{ orderTranslate(unBillCount, record) ? '-' : window.number_to_thousandth(unBillCount)}</span>
            }
          },
          {
            title: '已生成账单',
            width: 130,
            dataIndex: 'billDetailCount',
            render: (billDetailCount, record) => {
              return <span prefix="" style={style666}>{ orderTranslate(billDetailCount, record) ? '-' : window.number_to_thousandth(billDetailCount)}</span>
            }
          },
        ]
      },
      {
        title: '账单（元）',
        align: 'left',
        children: [
          {
            title: '待提交',
            width: 130,
            dataIndex: 'toSubmitBillAmount',
            align: 'right',
            render: (toSubmitBillAmount, record) => {
              return  <MoneyFormat onClick={() => { toSubmitBillAmount=='0.00' ? null : goToBillHandlePage(toSubmitBillAmount, record, 2) }}
               style={ toSubmitBillAmount=='0.00' ? style666 : style4B7FE8} acc={2}
               prefix={ billTranslate(toSubmitBillAmount, record) ? '' :"￥"}>{ billTranslate(toSubmitBillAmount, record) ? '-' : toSubmitBillAmount}</MoneyFormat>
            }
          },
          {
            title: '待审核',
            width: 130,
            dataIndex: 'toAuditBillAmount',
            align: 'right',
            render: (toAuditBillAmount, record) => {
              return <MoneyFormat onClick={() => { toAuditBillAmount=='0.00' ? null : goToBillHandlePage(toAuditBillAmount, record, 7) }}
               style={ toAuditBillAmount=='0.00' ? style666 : style4B7FE8} acc={2} prefix="￥">{toAuditBillAmount}</MoneyFormat>
            }
          },
          {
            title: '待开票',
            width: 130,
            dataIndex: 'unInvoiceAmount',
            align: 'right',
            render: (unInvoiceAmount, record) => {
              return <MoneyFormat style={style666} acc={2} prefix="￥">{unInvoiceAmount}</MoneyFormat>
            }
          },
          {
            title: '尚未支付',
            width: 130,
            dataIndex: 'toBillRemainAmount',
            align: 'right',
            render: (toBillRemainAmount, record) => {
              return <MoneyFormat style={style666} acc={2} prefix="￥">{toBillRemainAmount}</MoneyFormat>
            }
          }, 
          {
            title: '已支付',
            width: 130,
            dataIndex: 'totalIncomeAmount',
            align: 'right',
            render: (totalIncomeAmount, record) => {
              return <MoneyFormat style={style666} acc={2} prefix="￥">{totalIncomeAmount}</MoneyFormat>
            }
          }, 
        ]
      }
    ])
  }

  // 业务类型翻译
  let businessTypeTranslate = (info) => {
    if(info.businessType==1) return <TypeTags color="#2FB6E4">{info.businessTypeStr}</TypeTags>
    if(info.businessType==2) return <TypeTags color="#FF724D">{info.businessTypeStr}</TypeTags>
    if(info.businessType==3) return <TypeTags color="#8E60BE">{info.businessTypeStr}</TypeTags>
    if(info.businessType==4) return <TypeTags color="#FFD500">{info.businessTypeStr}</TypeTags>
  }
  // orderType 2跳转账单处理页面
  let savaQuery = (queryInfo) => {
    dispatch({
      type: 'billHandleModel/saveQuerySelect',
      payload: {
        queryInfo,
      },
    });
  }

  // 订单翻译
  let orderTranslate = (status, info) => {
    if(status==0 && info.businessType==3 || info.businessType==4) {
      return true
    }else {
      return false
    }
  }

  // 账单翻译
  let billTranslate = (status, info) => {
    if(status=='0.00' && info.businessType==3 || info.businessType==4) {
      return true
    }else {
      return false
    }
  }

  // 待确认点击事件
  let not_comfirm = (status, orderinfo) => {
    let info = { orderType: 1, ...orderinfo }
    history.push({ pathname: '/financeManage/billSettlementReconciliation', state:{ info } });
  }

  // 未生成点击事件
  let not_generated = (status, orderinfo) => {
    let info = { orderType: 1, ...orderinfo }
    history.push({ pathname: '/financeManage/generateBill', state:{ info } });
  }

  // 待提交&&待审核跳转账单处理页面
  let goToBillHandlePage = (status, orderinfo, billStatus) => {
    savaQuery({})
    let info = { orderType: 2, billStatus, ...orderinfo }
    history.push({ pathname: '/financeManage/billHandle', state:{ info } });
  }

  return (
    <>
      <div className={style.block__cont}>
        <div className={style.block__header}>
            <div className={style.block__header_title}>
              <span className={style.title_name}>年度概览</span>
              <InfoCircleOutlined  style={{ fontSize: '10px', color: '#999999' }}/>
              <span>统计近两年数据</span>
            </div>
            <ul className={style.order_box_row}>
              <li className={style.order_box_col}>
                <div className={style.col_box_left}>
                  <img src={require('../../../assets/preview/not_entered.png')} />
                </div>
                <div className={style.col_box_right}>
                  <span>即将对账（笔）</span>
                  <span>{ yearOverviewStatisticsInfo && yearOverviewStatisticsInfo.yltUnConfirmedCount ? parseToThousandth(yearOverviewStatisticsInfo.yltUnConfirmedCount) : 0}</span>
                </div>
              </li>
              <li className={style.order_box_col}>
                <div className={style.col_box_left}>
                  <img src={require('../../../assets/preview/to_be_confirmed.png')} />
                </div>
                <div className={style.col_box_right}>
                  <span>待确认订单（笔）</span>
                  <span>{ yearOverviewStatisticsInfo && yearOverviewStatisticsInfo.unConfirmedCount ? parseToThousandth(yearOverviewStatisticsInfo.unConfirmedCount) : 0}</span>
                </div>
              </li>
              <li className={style.order_box_col}>
                <div className={style.col_box_left}>
                  <img src={require('../../../assets/preview/to_be_generated.png')} />
                </div>
                <div className={style.col_box_right}>
                  <span>待生成账单（笔）</span>
                  <span>{ yearOverviewStatisticsInfo && yearOverviewStatisticsInfo.unBillCount ? parseToThousandth(yearOverviewStatisticsInfo.unBillCount) : 0}</span>
                </div>
              </li>
              <li className={style.order_box_col}>
                <div className={style.col_box_left}>
                  <img src={require('../../../assets/preview/to_be_submitted.png')} />
                </div>
                <div className={style.col_box_right}>
                  <span>待提交账单（元）</span>
                  {
                    yearOverviewStatisticsInfo && yearOverviewStatisticsInfo.toSubmitBillAmount ?
                    <span>
                      <span style={{fontSize: '20px'}}>￥</span>
                      <text style={{fontSize: '26px'}}>{parseToThousandth2(yearOverviewStatisticsInfo.toSubmitBillAmount)}</text>
                    </span>: <span>￥0</span>
                  }
                </div>
              </li>
              <li className={style.order_box_col}>
                <div className={style.col_box_left}>
                  <img src={require('../../../assets/preview/to_be_reviewed.png')} />
                </div>
                <div className={style.col_box_right}>
                  <span>待审核账单（元）</span>
                  {
                    yearOverviewStatisticsInfo && yearOverviewStatisticsInfo.toAuditBillAmount ?
                    <span>
                      <span style={{fontSize: '20px'}}>￥</span>
                      <text style={{fontSize: '26px'}}>{parseToThousandth2(yearOverviewStatisticsInfo.toAuditBillAmount)}</text>
                    </span>: <span>￥0</span>
                  }
                </div>
              </li>
              <li className={style.order_box_col}>
                <div className={style.col_box_left}>
                  <img src={require('../../../assets/preview/unpaid.png')} />
                </div>
                <div className={style.col_box_right}>
                  <span>尚未支付（元）</span>
                  {
                    yearOverviewStatisticsInfo && yearOverviewStatisticsInfo.toBillRemainAmount ?
                    <span>
                      <span style={{fontSize: '20px'}}>￥</span>
                      <text style={{fontSize: '26px'}}>{parseToThousandth2(yearOverviewStatisticsInfo.toBillRemainAmount)}</text>
                    </span>: <span>￥0</span>
                  }
                </div>
              </li>
            </ul>
        </div>
      </div>
      <div className={style.block__cont}>
        <div className={style.monthly_box}>
          <div className={style.monthly_box_title}>
            <span>月度预览</span>
            <div className={style.wrap_h1_choice}>
              {
                monthScopeData && monthScopeData.length ?
                monthScopeData.map((v,i) => {
                  return <i className={i == monthlaType ? style.wrap_h1_bull : null} onClick={()=> { changeType(i) }}>{v.text}</i>
                }) : null
              }
            </div>
          </div>
          <div className={style.table_box}>
            <Table columns={renderColumns()} dataSource={yearOverviewMonthDetailList} bordered pagination={false} />
          </div>
        </div>
      </div>
    </>
  )
}


export default connect(({ }) => ({
}))(financeManagePreview)