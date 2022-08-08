/*
 * @Author: wangzhushan
 * @Date: 2022-05-06 09:39:32
 * @LastEditTime: 2022-05-19 17:03:13
 * @LastEditors: wangzhushan
 * @Description: 评价管理
 */
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Form, Input,Tag, Table, Select, Row, Col, Pagination, Tooltip, Button, DatePicker, Badge, message, Space } from "antd";
import { QueryFilter, ProFormText, ProFormDatePicker,ProFormDateRangePicker,ProFormSelect } from '@ant-design/pro-form';
import { InfoCircleOutlined,QuestionCircleOutlined } from '@ant-design/icons';
import style from "./style.less";
import { parseToThousandth } from '@/utils/date'
import {downloadFile, precisionMultiplication} from '@/utils/utils'
import moment from 'moment';
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";



const evaluateManagement = (props) => {
  let { dispatch } = props;
  let [form] = Form.useForm();
  let [pageNum, setPageNum] = useState(1)
  let [pageSize, setPageSize] = useState(10);
  let [callList, setCallList] = useState(false);
  let [driverAssessMouth, setDriverAssessMouth] = useState({});
  let [driverAssessPageInfo, setDriverAssessPageInfo] = useState({});
  let [driverAssessQueryTypeList, setDriverAssessQueryTypeList] = useState([]); // 服务项目
  useEffect(()=> {
    queryDriverAssessQueryType();
    queryDriverAssessMouth();
    let threeMonths = moment(new Date()).subtract(3, 'months').format('YYYY-MM-DD');// 当前月份的前三个月
    let startDay = moment().startOf('day').format('YYYY-MM-DD');// 当前月份
    form.setFieldsValue({
      date: [moment(threeMonths), moment(startDay)],
    });
  },[])
  
  useEffect(() => {
    queryDriverAssessPage();
  },[callList])

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
  // 不分页查询服务项目
  let queryDriverAssessQueryType = () => {
    dispatch({
      type: 'evaluateManagement/queryDriverAssessQueryType',
      payload: {
        method: 'postJSON',
      },
      callback: (res) => {
        if(res.result.code == 0) {
          setDriverAssessQueryTypeList(res.body)
        }else{
          message.error(res.result.message)
        }
      }
    })
  }
  // 查询当月评价数据
  let queryDriverAssessMouth = () => {
    dispatch({
      type: 'evaluateManagement/queryDriverAssessMouth',
      payload: {
        method: 'postJSON',
        params: {
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          assessStartDate: moment().startOf('month').format('YYYY-MM-DD'),//当前自然月的第一天
          assessEndDate:moment().startOf('day').format('YYYY-MM-DD'),// 今天
        }
      },
      callback: (res) => {
        if(res.result.code === '0') {
          setDriverAssessMouth(res.body);
        }else{
          message.error(res.result.message)
        }
      }
    })
  }
  // 分页查询评价管理列表
  let queryDriverAssessPage = () => {
    let formValue = form.getFieldsValue();
    let info = JSON.parse(JSON.stringify(formValue));
    if(info.date) {
      info.assessStartDate = moment(info.date[0]).format('YYYY-MM-DD');
      info.assessEndDate = moment(info.date[1]).format('YYYY-MM-DD');
    }
    delete info.date;
    dispatch({
      type: 'evaluateManagement/queryDriverAssessPage',
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
          setDriverAssessPageInfo(res.body)
        }else{
          message.error(res.result.message)
        }
      }
    })
  }
  // 依据查询条件导出
  let queryDriverAssessExport = () => {
    let formValue = form.getFieldsValue();
    let info = JSON.parse(JSON.stringify(formValue));
    if(info.date) {
      info.assessStartDate = moment(info.date[0]).format('YYYY-MM-DD');
      info.assessEndDate = moment(info.date[1]).format('YYYY-MM-DD');
    }
    delete info.date;
    dispatch({
      type: 'evaluateManagement/queryDriverAssessExport',
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
        if(res.result.code === '0') {
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
          downloadFile(res, '评价管理.xlsx')
        }
      }
    })
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
  // 评价登记翻译
  let ensembleAssessmentType = (ensembleAssessmentStr, info) => {
    if(info.ensembleAssessment==1) return <Badge color='#ED1F45' text={ensembleAssessmentStr} />
    if(info.ensembleAssessment==2) return <Badge color='#FFD500' text={ensembleAssessmentStr} />
    if(info.ensembleAssessment==3) return <Badge color="#32D1AD" text={ensembleAssessmentStr} />
  }

  let renderColumns = () => {
    return (
      [
        {
          title: '订单号',
          dataIndex: 'orderNo',
          width: 200,
          render: (orderNo, record) => <span className={style.span_blue} onClick={()=> { history.push( {pathname: '/order/evaluateOrder/list/detail' , state: {caseId: record.caseId} }  ) }}>{orderNo}</span>
        }, 
        {
          title: '评价时间',
          dataIndex: 'assessTime',
          width: 170,
          render: (assessTime) => <ListTableTime>{assessTime}</ListTableTime>
        },
        {
          title: '服务项目',
          dataIndex: 'serviceName',
          width: 140,
          render: (serviceName, record) => ServiceItemsType(serviceName, record)
        },
        {
          title: '用户姓名',
          width: 190,
          dataIndex: 'customerName',
          render: customerName => <span>{customerName || '-'}</span>
        },
        {
          title: '手机号',
          width: 160,
          dataIndex: 'contactPhone',
          render: contactPhone => <span>{contactPhone || '-'}</span>
        },
        {
          title: '评价等级',
          width: 160,
          dataIndex: 'ensembleAssessmentName',
          render: (ensembleAssessmentName, record) => ensembleAssessmentType(ensembleAssessmentName, record)
        },
        {
          title: '质量',
          width: 120,
          dataIndex: 'qualityAssessment',
          render: qualityAssessment => <span>{qualityAssessment || '-'}</span>
        },
        {
          title: '速度',
          width: 120,
          dataIndex: 'speedAssessment',
          render: speedAssessment => <span>{speedAssessment || '-'}</span>
        },
        {
          title: '态度',
          width: 120,
          dataIndex: 'attitudeAssessment',
          render: attitudeAssessment => <span>{attitudeAssessment || '-'}</span>
        },
      ]
    )
  }
  
  return (
    <>
      <div className={style.evaluateManagement_top}>
        <ul>
          <li>
            <div className={style.img_box}><img src={require('../../../assets/quality/evaluateManagement/Praise.png')} /></div>
            <div className={style.evaluateManagement_item}>
              <span>当月好评数
                <Tooltip placement="top" title="当前自然月总好评数量">
                  <InfoCircleOutlined style={{marginLeft: '8px'}}/>
                </Tooltip>
              </span>
              <div className={style.item_text}>
                <div className={style.item_title}>{driverAssessMouth && driverAssessMouth.praiseNum ? driverAssessMouth.praiseNum : 0}</div>
                <div className={style.triangle_box}>
                  {
                    driverAssessMouth && driverAssessMouth.chainPraiseNum ?
                    <div className={`${driverAssessMouth.chainPraiseNum*100>0 ? style.triangle_top : style.triangle_bottom}`}></div> : null
                  }
                  <div className={style.triangle_text}>{driverAssessMouth && driverAssessMouth.chainPraiseNum==null ? '—' :  precisionMultiplication(Math.abs(driverAssessMouth.chainPraiseNum), 100)+'%' }</div>  
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className={style.img_box}><img src={require('../../../assets/quality/evaluateManagement/negative.png')} /></div>
            <div className={style.evaluateManagement_item}>
              <span>当月差评数
                <Tooltip placement="top" title="当前自然月总差评数量">
                  <InfoCircleOutlined style={{marginLeft: '8px'}}/>
                </Tooltip>
              </span>
              <div className={style.item_text}>
                <div className={style.item_title}>{driverAssessMouth && driverAssessMouth.errorNum ? driverAssessMouth.errorNum : 0 }</div>
                <div className={style.triangle_box}>
                  {
                    driverAssessMouth && driverAssessMouth.chainErrorNum ?
                    <div className={`${driverAssessMouth.chainErrorNum*100>0 ? style.triangle_top : style.triangle_bottom}`}></div>: null
                  }
                  <div className={style.triangle_text}>{driverAssessMouth && driverAssessMouth.chainErrorNum==null ? '—' : precisionMultiplication(Math.abs(driverAssessMouth.chainErrorNum), 100)+'%'}</div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className={style.img_box}><img src={require('../../../assets/quality/evaluateManagement/quality.png')} /></div>
            <div className={style.evaluateManagement_item}>
              <span>质量评分
                <Tooltip placement="top" title="当前自然月，所有质量评分的平均值">
                  <InfoCircleOutlined style={{marginLeft: '8px'}}/>
                </Tooltip>
              </span>
              <div className={style.item_text}>
                <div className={style.item_title}>{driverAssessMouth && driverAssessMouth.qualityAssessmentStr ? driverAssessMouth.qualityAssessmentStr : 0}</div>
                <div className={style.triangle_box}>
                  {
                    driverAssessMouth && driverAssessMouth.chainQualityAssessmentStr ?
                    <div className={`${driverAssessMouth.chainQualityAssessmentStr*100>0 ? style.triangle_top : style.triangle_bottom}`}></div>: null
                  }
                  <div className={style.triangle_text}>{driverAssessMouth && driverAssessMouth.chainQualityAssessmentStr==null ? '—' : precisionMultiplication(Math.abs(driverAssessMouth.chainQualityAssessmentStr), 100)+'%' }</div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className={style.img_box}><img src={require('../../../assets/quality/evaluateManagement/speed.png')} /></div>
            <div className={style.evaluateManagement_item}>
              <span>速度评分
                <Tooltip placement="top" title="当前自然月，所有速度评分的平均值">
                  <InfoCircleOutlined style={{marginLeft: '8px'}}/>
                </Tooltip>
              </span>
              <div className={style.item_text}>
                <div className={style.item_title}>{driverAssessMouth && driverAssessMouth.speedAssessmentStr ? driverAssessMouth.speedAssessmentStr : 0}</div>
                <div className={style.triangle_box}>
                  {
                    driverAssessMouth && driverAssessMouth.chainSpeedAssessmentStr ?
                    <div className={`${driverAssessMouth.chainSpeedAssessmentStr*100>0 ? style.triangle_top : style.triangle_bottom}`}></div>: null
                  }
                  <div className={style.triangle_text}>{driverAssessMouth && driverAssessMouth.chainSpeedAssessmentStr==null ? '—' : precisionMultiplication(Math.abs(driverAssessMouth.chainSpeedAssessmentStr), 100)+'%' }</div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className={style.img_box}><img src={require('../../../assets/quality/evaluateManagement/attitude.png')} /></div>
            <div className={style.evaluateManagement_item}>
              <span>态度评分
                <Tooltip placement="top" title="当前自然月，所有态度评分的平均值">
                  <InfoCircleOutlined style={{marginLeft: '8px'}}/>
                </Tooltip>
              </span>
              <div className={style.item_text}>
                <div className={style.item_title}>{driverAssessMouth && driverAssessMouth.attitudeAssessmentStr ? driverAssessMouth.attitudeAssessmentStr : 0}</div>
                <div className={style.triangle_box}>
                  {
                    driverAssessMouth && driverAssessMouth.chainAttitudeAssessmentStr ?
                    <div className={`${driverAssessMouth.chainAttitudeAssessmentStr*100>0 ? style.triangle_top : style.triangle_bottom}`}></div>: null
                  }
                  <div className={style.triangle_text}>{driverAssessMouth && driverAssessMouth.chainAttitudeAssessmentStr==null ? '—' :  precisionMultiplication(Math.abs(driverAssessMouth.chainAttitudeAssessmentStr), 100)+'%' }</div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className={style.account}>
        <QueryFilter className={style.form} form={form}  defaultCollapsed labelWidth={120}  onFinish={orderListSearch} onReset={resetForm}>
          <ProFormText name="orderNo" label='订单号' />
          <ProFormSelect name="ensembleAssess" label="评价等级" 
            options={[
              {value:1, label:'差评'},
              {value:2, label:'中评'},
              {value:3, label:'好评'},
            ]} />
          <ProFormText name="customerPhone" label='手机号' />
          <ProFormSelect name="serviceId" label='服务项目' 
            options={ driverAssessQueryTypeList.map((v)=>{
              return {value:v.id, label:v.typeName}
            })} 
          />
          <ProFormDateRangePicker format="YYYY-MM-DD" name="date" label='评价时间' placeholder={['开始时间', '结束时间']} />         
        </QueryFilter>
      </div>
      <div className={style.account}>
        <ListTitle titleName="结果列表">
            <Space size={8}>
              <Button type='primary' onClick={queryDriverAssessExport}>导出</Button>
            </Space>
        </ListTitle>
        <ListTable showPagination current={pageNum} pageSize={pageSize} total={driverAssessPageInfo.total} onChange={onNextChange}>
          <Table columns={renderColumns()} scroll={{ x: 1200 }} dataSource={driverAssessPageInfo.list} pagination={false} />
        </ListTable>
      </div>
    </>
  )
}


export default connect(({  }) => ({

}))(evaluateManagement)