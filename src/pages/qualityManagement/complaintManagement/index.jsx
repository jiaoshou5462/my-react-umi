/*
 * @Author: wangzhushan
 * @Date: 2022-05-06 09:39:38
 * @LastEditTime: 2022-05-19 17:03:32
 * @LastEditors: wangzhushan
 * @Description: 投诉管理
 */
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Tag, Row, Col, Form, Space, Input, Table, Select, Button, Pagination, Modal, Badge, message, DatePicker, Tooltip } from "antd"
import { QueryFilter, ProFormText, ProFormDatePicker,ProFormDateRangePicker,ProFormSelect } from '@ant-design/pro-form';
import { UploadOutlined, ExclamationCircleOutlined, DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import style from "./style.less";
import { parseToThousandth } from '@/utils/date';
import {downloadFile, precisionMultiplication} from '@/utils/utils';
import moment from 'moment';
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";


const complaintManagement = (props) => {
  let { dispatch } = props;
  let [form] = Form.useForm();
  let [pageNum, setPageNum] = useState(1)
  let [pageSize, setPageSize] = useState(10);
  let [callList, setCallList] = useState(false);
  let [complainQueryComplainList, setComplainQueryComplainList] = useState([]); // 投诉来源
  let [complainPageInfo, setComplainPageInfo] = useState([]); // 列表及分页数据
  let [complainMout, setComplainMouth] = useState({}); // 当月投诉管理数据
  

  useEffect(() => {
    queryComplainQueryComplain();
    queryDriverAssessMouth();
  }, [])

  useEffect(() => {
    queryComplainPage();
  }, [callList])
  // 不分页查询投诉来源
  let queryComplainQueryComplain = () => {
    dispatch({
      type: 'complaintManagement/queryComplainQueryComplain',
      payload: {
        method: 'postJSON',
      },
      callback: (res) => {
        if(res.result.code == 0) {
          setComplainQueryComplainList(res.body)
        }else{
          message.error(res.result.message)
        }
      }
    })
  }
  // 查询当月投诉管理数据
  let queryDriverAssessMouth = () => {
    dispatch({
      type: 'complaintManagement/queryComplainMouth',
      payload: {
        method: 'postJSON',
        params: {
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          complainStartDate: moment().startOf('month').format('YYYY-MM-DD'),//当前自然月的第一天
          complainEndDate:moment().startOf('day').format('YYYY-MM-DD'),// 今天
        }
      },
      callback: (res) => {
        if(res.result.code === '0') {
          setComplainMouth(res.body);
        }else{
          message.error(res.result.message)
        }
      }
    })
  }
  //  分页查询投诉管理列表
  let queryComplainPage = () => {
    let formValue = form.getFieldsValue();
    let info = JSON.parse(JSON.stringify(formValue));
    if(info.date) {
      info.complainStartDate = moment(info.date[0]).format('YYYY-MM-DD');
      info.complainEndDate = moment(info.date[1]).format('YYYY-MM-DD');
    }
    delete info.date;
    dispatch({
      type: 'complaintManagement/queryComplainPage',
      payload: {
        method: 'postJSON',
        params: {
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          pageNum,
          pageSize,
          ...info,
        }
      },
      callback: (res) => {
        if(res.result.code == 0) {
          setComplainPageInfo(res.body)
        }else{
          message.error(res.result.message)
        }
      }
    })
  }
  // 投诉管理导出
  let queryComplainExport = () => {
    let formValue = form.getFieldsValue();
    let info = JSON.parse(JSON.stringify(formValue));
    if(info.date) {
      info.complainStartDate = moment(info.date[0]).format('YYYY-MM-DD');
      info.complainEndDate = moment(info.date[1]).format('YYYY-MM-DD');
    }
    delete info.date;
    dispatch({
      type: 'complaintManagement/queryComplainExport',
      payload: {
        method: 'postJSON',
        params: {
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          pageNum,
          pageSize,
          ...info,
        }
      },
      callback: (res) => {
        if(res.result.code == 0) {
          getFileLoad(res.body.fileId)
        }else{
          message.error(res.result.message)
        }
      }
    })
  }

  // 根据fileId下载文件
  let getFileLoad = (fileId) => {
    dispatch({
      type: 'billHandleModel/fileDownload',
      payload: {
        method: 'get',
        fileCode: fileId,
        responseType: 'blob',
      },
      callback: (res) => {
        if (res) {
          downloadFile(res, '投诉管理.xlsx')
        }
      }
    })
  }

  /**
   * 解决状态，需要显示调整为已解决状态的时间，根据当前时间减去调整状态的时间(向上取整)
   * ＞60分钟，显示小时；
   * ＞24小时，显示天；
   * ＞30天，显示月；
   * ＞12个月，显示年；
   * */ 
  let resolutionStatus = (settleStatusName, record) => {
    if(record.settleStatus==2) { // 已解决状态才显示分钟
      let nowDate = new Date().getTime();// 当前时间戳
      let AdjustmentStateDate = new Date(record.updateTimeStr).getTime(); // 调整状态
      let showDate = nowDate- AdjustmentStateDate;
      if((showDate/(1000*60*60*24*30)) > 12) { // 大于12个月显示年份（向上取整）
        let year = Math.ceil(((showDate/(1000*60*60*24*30)) / 10 )) 
        return <div className={style.badge_box}><Badge className={style.badge_span_first} color="#2FB6E4" text={settleStatusName} /><span className={style.badge_span}>{year}年前</span></div>
      }
      if((showDate/(1000*60*60*24)) > 30) { // 大于30显示月份（向上取整）
        let month = Math.ceil(( (showDate/(1000*60*60*24)) / 30 )) 
        return <div className={style.badge_box}><Badge className={style.badge_span_first} color="#2FB6E4" text={settleStatusName} /><span className={style.badge_span}>{month}个月前</span></div>
      }
      if(Math.ceil((showDate/(1000*60*60))) > 24) { // 大于24显示天数（向上取整）
        let day = Math.ceil((showDate/(1000*60*60)) / 24 ) 
        return <div className={style.badge_box}><Badge className={style.badge_span_first} color="#2FB6E4" text={settleStatusName} /><span className={style.badge_span}>{day}天前</span></div>
      }
      if(Math.ceil(showDate/(1000*60*60 / 60)) > 60) { // 大于60显示分钟（向上取整）
        let hours = Math.ceil(showDate/(1000*60*60 / 60) / 60) 
        return <div className={style.badge_box}><Badge className={style.badge_span_first} color="#2FB6E4" text={settleStatusName} /><span className={style.badge_span}>{hours}小时前</span></div>
      }else{
        let minutes = Math.ceil(showDate/(1000*60*60 / 60)) 
        return <div className={style.badge_box}><Badge className={style.badge_span_first} color="#2FB6E4" text={settleStatusName} /><span className={style.badge_span}>{minutes}分钟前</span></div>
      }
    }else {
      return <div className={style.badge_box}><Badge className={style.badge_span_first} color="#FF4A1A" text={settleStatusName} /></div>
    }
    
  }
  // 服务项目渲染 
  let ServiceItemsType = (type, record) => {
    let num = Math.floor(Math.random()*10+1);
    if(record.serviceId==1) return <TypeTags color="#2FB6E4">{type}</TypeTags>
    if(record.serviceId==2) return <TypeTags color="#32D1AD">{type}</TypeTags>
    if(record.serviceId==4) return <TypeTags color="#28CB6B">{type}</TypeTags>
    if(record.serviceId==5) return <TypeTags color="#7545A7">{type}</TypeTags>
    if(record.serviceId==13) return <TypeTags color="#C91132">{type}</TypeTags>
    if(record.serviceId==14) return <TypeTags color="#FF4A1A">{type}</TypeTags>
    if(record.serviceId==15) return <TypeTags color="#FFC500">{type}</TypeTags>
    
    if(record.serviceId==18) return <TypeTags color="#4B7FE8">{type}</TypeTags>
    if(record.serviceId==19) return <TypeTags color="#0084FF">{type}</TypeTags>
    if(record.serviceId==16) return <TypeTags color="#AF52DE">{type}</TypeTags>

    if(num==1 || num==2) return <TypeTags color="#FF9500">{type}</TypeTags>
    if(num==3 || num==4) return <TypeTags color="#5E5CE6">{type}</TypeTags>
    if(num==5 || num==6) return <TypeTags color="#32D74B">{type}</TypeTags>
    if(num==7 || num==8) return <TypeTags color="#FF2D55">{type}</TypeTags>
    if(num==9) return <TypeTags color="#6236FF">{type}</TypeTags>
    if(num==10)return <TypeTags color="#FF3030">{type}</TypeTags>
  }
  // 表单搜索
  let orderListSearch = (val) => {
    setPageNum(1);
    setPageSize(10);
    setCallList(!callList)
  };
  // 表单重置
  let resetForm = () => {
    form.resetFields();
    setPageNum(1);
    setPageSize(10);
    setCallList(!callList)
  };
  // 点击下一页上一页
  let onNextChange = (page, pageSize) => {    
    setPageNum(page)
    setPageSize(pageSize)
    setCallList(!callList);
  }

  let renderColumns = () => {
    return (
      [
        {
          title: '订单号',
          width: 200,
          dataIndex: 'orderNo',
          render: (orderNo, record) => <span className={style.span_blue} onClick={()=> { history.push( {pathname: '/order/complaintOrder/list/detail' , state: {caseId: record.caseId, detailInfo: record} }  ) }}>{orderNo}</span>
        }, 
        {
          title: '投诉时间',
          dataIndex: 'createTimeStr',
          width: 170,
          render: (createTimeStr) => <ListTableTime>{createTimeStr}</ListTableTime>
        },
        {
          title: '投诉来源',
          width: 140,
          dataIndex: 'complainSourceName',
        },
        {
          title: '服务项目',
          dataIndex: 'serviceName',
          width: 140,
          render: (serviceName, record) => ServiceItemsType(serviceName, record)
        },
        {
          title: '用户姓名',
          width: 140,
          dataIndex: 'customerName',
          render: (customerName, record) => <>{customerName||'-'}</>
        },
        {
          title: '手机号',
          dataIndex: 'customerPhone',
          width: 160,
          render: (customerPhone, record) => <>{customerPhone||'-'}</>
        },
        {
          title: '车牌号',
          width: 160,
          dataIndex: 'vehicleCode',
          render: (vehicleCode, record) => <>{vehicleCode||'-'}</>
        },
        {
          title: '解决状态',
          dataIndex: 'settleStatusName',
          width: 180,
          render: (settleStatusName, record) => resolutionStatus(settleStatusName, record)
        },
        {
          title: '解决方式',
          width: 140,
          dataIndex: 'settleCategoryName',
          render: (settleCategoryName, record) => <>{settleCategoryName||'-'}</>
        },
      ]
    )
  }


  return (
    <>
      <div className={style.evaluateManagement_top}>
        <ul>
          <li>
            <div className={style.img_box}><img src={require('../../../assets/quality/complaintManagement/unresolved.png')} /></div>
            <div className={style.evaluateManagement_item}>
              <span>当前未解决</span>
              <div className={style.item_text}>
                <div className={style.item_title}>{complainMout && complainMout.unresolvedNum ? complainMout.unresolvedNum : 0}</div>
              </div>
            </div>
          </li>
          <li>
            <div className={style.img_box}><img src={require('../../../assets/quality/complaintManagement/complaint.png')} /></div>
            <div className={style.evaluateManagement_item}>
              <span>当月投诉
                <Tooltip placement="top" title="当前自然月总投诉数量">
                  <InfoCircleOutlined style={{marginLeft: '8px'}}/>
                </Tooltip>
              </span>
              <div className={style.item_text}>
                <div className={style.item_title}>{complainMout && complainMout.currentMonthComplainNum ? complainMout.currentMonthComplainNum : 0}</div>
                <div className={style.triangle_box}>
                  {
                    complainMout && complainMout.chainCurrentMonthComplainNum ?
                    <div className={`${complainMout.chainCurrentMonthComplainNum*100>0 ? style.triangle_top : style.triangle_bottom}`}></div>: null
                  }
                  <div className={style.triangle_text}>{complainMout && complainMout.chainCurrentMonthComplainNum==null ? '—' : precisionMultiplication(Math.abs(complainMout.chainCurrentMonthComplainNum),100)+'%' }</div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className={style.img_box}><img src={require('../../../assets/quality/complaintManagement/solve.png')} /></div>
            <div className={style.evaluateManagement_item}>
              <span>当月解决
                <Tooltip placement="top" title="当前自然月新增投诉，且状态为已解决投诉数量">
                  <InfoCircleOutlined style={{marginLeft: '8px'}}/>
                </Tooltip>
              </span>
              <div className={style.item_text}>
                <div className={style.item_title}>{complainMout && complainMout.currentMonthSolveNum ? complainMout.currentMonthSolveNum : 0}</div>
                <div className={style.triangle_box}>
                  {
                    complainMout && complainMout.chainCurrentMonthSolveNum ?
                    <div className={`${complainMout.chainCurrentMonthSolveNum*100>0 ? style.triangle_top : style.triangle_bottom}`}></div>: null
                  }
                  <div className={style.triangle_text}>{complainMout && complainMout.chainCurrentMonthSolveNum==null ? '—' : precisionMultiplication(Math.abs(complainMout.chainCurrentMonthSolveNum),100)+'%' }</div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className={style.img_box}><img src={require('../../../assets/quality/complaintManagement/times.png')} /></div>
            <div className={style.evaluateManagement_item}>
              <span>平均响应时间(分钟)
                <Tooltip placement="top" title="当前自然月，所有投诉，变更投诉状态为已受理所用时间，向上取整数">
                  <InfoCircleOutlined style={{marginLeft: '8px'}}/>
                </Tooltip>
              </span>
              <div className={style.item_text}>
                <div className={style.item_title}>{complainMout && complainMout.averageResponseTime ? complainMout.averageResponseTime : 0}</div>
                <div className={style.triangle_box}>
                  {
                    complainMout && complainMout.chainAverageResponseTime ?
                    <div className={`${complainMout.chainAverageResponseTime*100>0 ? style.triangle_top : style.triangle_bottom}`}></div>: null
                  }
                  <div className={style.triangle_text}>{complainMout && complainMout.chainAverageResponseTime==null ? '—' : precisionMultiplication(Math.abs(complainMout.chainAverageResponseTime),100)+'%' }</div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className={style.account}>
        <QueryFilter className={style.form} form={form} defaultCollapsed labelWidth={120}  onFinish={orderListSearch} onReset={resetForm}>
          <ProFormText name="orderNo" label='订单号' />
          <ProFormSelect name="settleStatus" label='解决状态' 
            options={[
              {value:1, label:'未解决'},
              {value:2, label:'已解决'},
              {value:3, label:'撤诉'},
              {value:4, label:'不处理'},
            ]} />
          <ProFormText name="customerPhone" label='手机号' />
          <ProFormSelect name="complainSource" label="投诉来源" 
            options={ complainQueryComplainList.map((v)=>{
              return {value:v.id, label:v.sourceName}
            })} />
          <ProFormDateRangePicker format="YYYY-MM-DD" name="date" label='投诉时间' placeholder={['开始时间', '结束时间']} />         
        </QueryFilter>
      </div>
      <div className={style.account}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
            <Button onClick={queryComplainExport} type='primary'>导出</Button>
          </Space>
        </ListTitle>
        <ListTable showPagination total={complainPageInfo.total} onChange={onNextChange} current={pageNum} pageSize={pageSize}>
          <Table columns={renderColumns()} dataSource={complainPageInfo.list} pagination={false} scroll={{ x: 1200 }} />
        </ListTable>
      </div>
    </>
  )
}


export default connect(({  }) => ({

}))(complaintManagement)