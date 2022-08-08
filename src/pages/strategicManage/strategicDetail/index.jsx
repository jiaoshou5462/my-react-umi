import React, { useEffect, useState } from "react";
import { Link, connect, history } from 'umi';
import { Row, Col, Table, message, ConfigProvider, Pagination, Space } from "antd"
import style from "./style.less";
import { formatDate } from '@/utils/date';

import moment from 'moment';  // 日期处理
import 'moment/locale/zh-cn';
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const strategicDetailPage = (props) => {
  let { dispatch } = props,
      [pageInfo, setPageInfo] =  useState({
        pageNo:1,
        pageSize:10,
        id:''
      })
  let queryId = history.location.query.id
  let renderColumns = () => {
    return (
      [{
        title: '日期',
        dataIndex: 'time' 
      },{
        title: '执行任务',
        dataIndex: 'performTasks'
      },{
        title: '任务类型',
        dataIndex: 'taskStr'
      },{
        title: '触达内容',
        dataIndex: 'touchContent'  
      },{
        title: '任务完成率',
        dataIndex: 'taskRate'
      },{
        title: '计划触发人次',
        dataIndex: 'planNum'
      },{
        title: '实际触发人次',
        dataIndex: 'actualNum'
      },{
        title: '操作',
        fixed: 'right',
        render: (text, record) => {
          return  <Space size="middle">
                    <a  onClick={()=>{toTriggerLog(record)}}>查看执行明细</a>
                  </Space>
        }}])
    }
  // 进入执行记录
  let toTriggerLog = (record) => {
    history.push({
      pathname: '/strategicManage/triggerLog',
      query: {
        strategyName:record.strategyName 
      }
    })
  }
  let [detailData, setDetailData] = useState({}),
      [taskDetailVOList, setTaskDetailVOList] = useState([]),
      [taskDetailVOListInfo,setTaskDetailVOListInfo] = useState({}),
      [taskNumVOList, setTaskNumVOList] = useState([])
  useEffect(() => {
    dispatch({
      type: 'strategicDetail/queryStrategyDetail',
      payload: {
        method: 'get',
        params: {
          id:queryId
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
            setDetailData(res.body.body)
            console.log(res.body.body.taskNumVOList)
            setTaskNumVOList(res.body.body.taskNumVOList)
        } else {
          message.error(res.result.message)
        }
      }
    })
  },[])
  useEffect(()=>{
    queryStrategyDetailList()
  },[pageInfo])

  let queryStrategyDetailList = () => {
    pageInfo.id = queryId
    dispatch({
      type: 'strategicDetail/queryStrategyDetailList',
      payload: {
        method: 'postJSON',
        params:pageInfo
      },
      callback: (res) => {
        if (res.result.code === '0') {
          setTaskDetailVOList(res.body.body.list)
          setTaskDetailVOListInfo({
            total:res.body.body.total,
            pageNum:res.body.body.pageNum,
            pages:res.body.body.pages
          })
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

    //分页切换
    const handleTableChange = (page,pageSize) => {
      setPageInfo({
        pageNo:page,
        pageSize:pageSize
      })
    }
    // 列表条数切换
    const onSizeChange = (page,pageSize) => {
      setPageInfo({
        pageNo:page,
        pageSize:pageSize
      })
      onPageTotal()
    }
    // 显示条数
    const onPageTotal = (total, range) => {
      return `共${taskDetailVOListInfo.total?taskDetailVOListInfo.total:0}条记录 第 ${taskDetailVOListInfo.pageNum?taskDetailVOListInfo.pageNum:1} / ${taskDetailVOListInfo.pages?taskDetailVOListInfo.pages:1}  页`
    }
    const micrometerChange = (v)=>{
      return v?window.number_to_thousandth(v):0
    }
    
  return (
    <div>
      <div className={style.block__cont}>
        <div className={style.block__header}>
          <span className={style.header_title}>{detailData.strategyName}</span>
        </div>
        <div className={`${style.part_content} ${style.part_content_line}`}>
          <Row className={style.row_gap}>
            <Col span={8}>
              营销项目：{detailData.projectName}
            </Col>
            <Col span={8}>
              触发类型：{detailData.strategyTypeStr}
            </Col>
            <Col span={8}>
              <span className={style.lable_name_l}>受众用户：</span>
              <span className={style.lable_name_r}>{detailData.userSourceStr}</span>
            </Col>
            {detailData.strategyType == 2?
              <><Col span={8}>
                <span className={style.lable_name_l}>触发场景：</span>
                <span className={style.lable_name_r}>{detailData.triggerSence}</span>
              </Col>
              <Col span={16}>
                触发条件：{detailData.triggeringConditions}
              </Col>
              </>:null}
          </Row>
        </div>
        <div className={style.part_content}>
          <Row>
            <Col span={4}>
              <div className={style.operation_tip}>累计触发人次</div>
              <div className={style.num} style={{color:'#4B7FE8'}}>{micrometerChange(detailData.allNum)}</div>
            </Col>
            <Col span={20}>
              <Row>
                {taskNumVOList.map((item,index)=>{
                  return <Col span={5} >
                    <div className={style.operation_tip}>执行任务{item.sort+1}({item.taskTypeStr})</div>
                    <div className={style.operation_tip}>触发人次</div>
                    <div className={style.num}>{micrometerChange(item.count)}</div>
                 </Col>
                })}
              </Row>
            </Col>
          </Row>
        </div>
      </div>
      <div className={style.block__cont} style={{marginTop:'-10px', paddingBottom: '100px'}}>
          <div className={style.block__header}><span className={style.header_title}>趋势分析</span><span className={style.trend_time}>最近一次触发日期：{detailData.lastExecuteTime}</span></div>
          <div className={style.table_part}>
            <Table
                locale={{ emptyText: '暂无数据' }}
                columns={renderColumns()}
                dataSource={taskDetailVOList}
                pagination={false}
                loading={{
                  spinning: false,
                  delay: 500
                }}
              />
              <ConfigProvider locale={zh_CN}>
                <Pagination
                  className={style.pagination}
                  showQuickJumper
                  showTitle={false}
                  current={pageInfo.pageNo}
                  defaultPageSize={pageInfo.pageSize}
                  total={taskDetailVOListInfo.total}
                  onChange={handleTableChange}
                  showSizeChanger 
                  pageSizeOptions={['10', '20', '30', '60']}
                  onShowSizeChange={onSizeChange}
                  showTotal={onPageTotal}
                />
              </ConfigProvider>
          </div>
      </div>
    </div>
  )
};
export default connect(({strategicDetail }) => ({
}))(strategicDetailPage)
