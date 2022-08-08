import React,{useEffect, useState} from "react"
import { connect,history } from 'umi'
import {
  Row,
  Col,
  Form,
  Space,
  Input,
  Table,
  Select,
  Button,
  message,
  Progress,
  DatePicker,
  Pagination,
  ConfigProvider,
  Tooltip,
} from "antd"
import style from "./style.less"
import { Line } from '@ant-design/charts'
const { Option } = Select
const { RangePicker } = DatePicker
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from "antd/lib/date-picker/locale/zh_CN";
import moment from 'moment'
import 'moment/locale/zh-cn'
import {InfoCircleOutlined} from "@ant-design/icons";
moment.locale('zh-cn')
let unitList = [{
  type: 1,
  unit: '人'
},{
  type: 2,
  unit: '人'
},{
  type: 3,
  unit: '人'
},{
  type: 4,
  unit: '人'
},{
  type: 5,
  unit: '次'
},{
  type: 6,
  unit: '人'
},{
  type: 7,
  unit: '次'
},{
  type: 8,
  unit: '人'
}]
const taskDataViewPage =(props)=>{
  let {dispatch, location, pageTotal, list, teamList, branchList, finishTrend, finishDegree} = props,
    [form] = Form.useForm()
    let [propsData, setPropsData] = useState(location.state && location.state.data || '')
    let [btnArr, setBtnArr] = useState([{
      type: 3,
      status: true,
      title: '门店排名'
    }, {
      type: 2,
      status: false,
      title: '团队排名'
    }, {
      type: 1,
      status: false,
      title: '个人排名'
    },])
    let [checkDate, setCheckDate] = useState([null, moment()]) //选中时间时的数据，做限制处理
    let [filterTime, setFilterTime] = useState([moment().subtract(6, 'd'), moment()]) //筛选时间默认值
    let [btnStatus, setBtnStatus] = useState(false) //按钮loading
    let [taskId, setTaskId] = useState('') //任务id
    let [finishList, setFinishList] = useState([]) //完成度列表
    let [finishTrendList, setFinishTrendList] = useState([]) //完成度折线图列表
    let [lineColor, setLineColor] = useState([])
    let [lineConfig, setLineConfig] = useState(null)
    let [pageSize, setPageSize] = useState(5)
    let [pageNo, setPage] = useState(1)
    let [payload, setPayload] = useState({
      pageInfoVO: {
        pageNo,
        pageSize,
      },
      orgType: 3,
      taskId
    })
  useEffect(() => {
    if(Object.keys(propsData).length > 0){
      if (propsData.taskStatus === 2) {
        setCheckDate([null, moment(propsData.endTime)])
        setFilterTime([moment(propsData.endTime).subtract(6, 'd'), moment(propsData.endTime)])
      }
      setTaskId(propsData.taskId)
      form.setFieldsValue({channelName: propsData.channelName})
    }
  },[propsData])
  useEffect(() => {
    if(taskId) {
      getTaskBranchList()
      getTaskFinishDegree()
      if (filterTime && filterTime.length > 0) {
        getTaskFinishTrend()
      }
    }
  },[taskId, filterTime])
  useEffect(() => {
    if (taskId) {
      getList()
    }
  }, [payload, taskId])
  /*处理完成度数据*/
  useEffect(() => {
    let temp = []
    if(finishDegree.length > 0) {
      if(finishDegree.length > 1){
        let tempData = []
        finishDegree.map((item, key) => {
          if(item.type === 0){
            tempData = finishDegree.splice(key, 1)
          }
        })
        finishDegree.unshift(tempData[0])
      }
      temp = onListChange(finishDegree)
      let tempColor = []
      temp.map(item => {
        tempColor.push(item.color)
      })
      setLineColor(tempColor)
    }
    setFinishList(temp)
  }, [finishDegree])
  /*处理折线图数据*/
  useEffect(() => {
    let temp = []
    if(finishTrend.length > 0) {
      temp = onListChange(finishTrend)
    }
    setFinishTrendList(temp)
  }, [finishTrend])
  /*渲染折线图*/
  useEffect(() => {
    if (finishTrendList.length > 0) {
      onLineConfig()
    }
  },[finishTrendList])
  let onListChange = (temp) => {
    temp.map(item => {
      item.kpiFormat = onNumFormat(item.kpi)
      item.countFormat = onNumFormat(item.count)
      if (item.type === 0) {
        item.color = '#8E60BE'
      }else {
        if (item.type % 2 === 1) {
          item.color = '#2FB6E4'
        }else {
          item.color = '#32D1AD'
        }
      }
      unitList.map(value => {
        if (item.type === value.type) item.unit = value.unit
      })
    })
    return temp
  }
  /*获取 任务相关门店列表*/
  let getTaskBranchList = () => {
    dispatch({
      type: 'taskDataView/getTaskBranchList',
      payload: {
        method: 'get',
        params: {taskId}
      },
    })
  }
  /*获取 任务相关团队列表列表*/
  let getTaskTeamList = (branchId) => {
    dispatch({
      type: 'taskDataView/getTaskTeamList',
      payload: {
        method: 'get',
        params: {taskId, branchId}
      },
    })
  }
  /*获取 当前任务完成度*/
  let getTaskFinishDegree = (branchId, teamId) => {
    let data = {
      taskId,
      orgId: teamId ? teamId : branchId,
      orgType: teamId ? 2 : branchId ? 3 : '',
    }
    dispatch({
      type: 'taskDataView/getTaskFinishDegree',
      payload: {
        method: 'get',
        params: data
      },
    })
  }
  /*获取 查询任务完成度趋势-折线图*/
  let getTaskFinishTrend = (branchId, teamId) => {
    let endTime = filterTime[1] && filterTime[1].format('YYYY-MM-DD')
    let startTime = filterTime[0] && filterTime[0].format('YYYY-MM-DD')
    let data = {
      taskId,
      endTime,
      startTime,
      orgId: teamId ? teamId : branchId,
      orgType: teamId ? 2 : branchId ? 3 : '',
    }
    dispatch({
      type: 'taskDataView/getTaskFinishTrend',
      payload: {
        method: 'postJSON',
        params: data
      },
    })
  }
  /*获取 任务门店-团队-个人排行 列表*/
  let getList = () => {
    payload.taskId = taskId
    dispatch({
      type: 'taskDataView/getList',
      payload: {
        method: 'postJSON',
        params: payload
      },
    })
  }
  /*折线图配置*/
  let onLineConfig = () => {
    let config = {
      data: finishTrendList,
      xField: 'time',
      yField: 'finishDegree',
      seriesField: 'name',
      autoFit: true,
      color: lineColor,
      legend: {
        position: 'bottom',
      },
      animation: {
        appear: {
          animation: 'path-in',
          duration: 3000,
        },
      },
      xAxis: {
        range: [0, 1],
      },
      yAxis: {
        label: {
          formatter: (v) => `${v} %`,
        },
      },
      tooltip: {
        containerTpl: 'tooltip_box',
        customContent: (title, data) => {
          let tempHtml = `<div class=${style.tooltip_box}>
          <div class=${style.tooltip_title}>${title}</div>
          ${
              data.length > 0 ? data.map(item => {
                let temp = item.data || {}
                let tempStyle = "background:" + temp.color
                return `<div style="display: flex; margin-bottom: 6px;">
                 <div class=${style.tooltip_dots} style= ${tempStyle}> </div>   
                 <div style="display: flex;">
                    ${temp.name + ' '} ${temp.type !== 0 ? temp.count + temp.unit + `<div class=${style.tooltip_dots}> </div>`  + '完成度' : ' '} ${temp.finishDegree}%
                 </div>
              </div>`
              }) : null
          }
        </div>`
          let tempContent = tempHtml.replace(/,/g, '')
          return tempContent
        }
      }
    }
    let yDefaultNum = false
    finishTrendList.forEach(item => {
      if (item.type === 0 && item.finishDegree === 0){
        yDefaultNum = true
        return
      }
    })
    setLineConfig(config)
  }
  let renderColumns = () => {
    return (
        [{
          title: '序号',
          align: 'center',
          dataIndex: 'type',
          render: (type, record, index) => {
            return index + 1
          }
        }, {
          title: () => {
            return <div>
              总排名
              <Tooltip title={'总排名为集团维度的任务排名，即所有参加任务的门店/团队/个人的总排名'} >
                <InfoCircleOutlined className={style.tooltip_icon} />
              </Tooltip>
            </div>
          },
          align: 'center',
          dataIndex: 'ranking',
        }, {
          title: () => {
            return <div>
              {payload.orgType === 1 ? '销售' : payload.orgType === 2 ? '团队' : '门店'}
            </div>
          },
          align: 'center',
          dataIndex: 'name',
        }, {
          title: '实际完成数/目标KPI数',
          align: 'center',
          dataIndex: 'taskTargets',
          render: (taskTargets, record) => taskRender(taskTargets, record)
        }, {
          title: () => {
            return <div>
              任务完成度
              <Tooltip title={'任务完成度 = 指标完成度 * 指标权重的总和'} >
                <InfoCircleOutlined className={style.tooltip_icon} />
              </Tooltip>
            </div>
          },
          align: 'center',
          dataIndex: 'finishDegree',
          width: 300,
          render: (finishDegree) => completeRender(finishDegree)
        }]
    )
  }
  let taskRender = (taskTargets) => {
    return <div>
      {
        taskTargets.map(item => {
          let kpiFormat = onNumFormat(item.kpi)
          let countFormat = onNumFormat(item.count)
          return `${item.name}：${countFormat} / ${kpiFormat} ${unitList[item.type - 1].unit}；`
        })
      }
    </div>

  }
  /*任务完成度 组件*/
  let completeRender = (value) => {
    let tempColor = ''
    if(value <= 30) {
      tempColor = '#FF724D'
    }
    if(value > 30 && value <= 60) {
      tempColor = '#FFD500'
    }
    if(value > 60) {
      tempColor = '#28CB6B'
    }
    return <div style={{display: 'flex'}}>
      <Progress percent={value} strokeColor={tempColor} showInfo={false}/>
      <div className={style.list_num}>{value}%</div>
    </div>
  }
  /*查询*/
  let onSearch = (e) => {
    getTaskFinishTrend(e.branchId, e.teamId)
    getTaskFinishDegree(e.branchId, e.teamId)
  }
  /*重置*/
  let onReset = () => {
    form.resetFields()
    getTaskFinishTrend()
    getTaskFinishDegree()
    dispatch({
      type: 'taskDataView/onReset'
    })
    form.setFieldsValue({channelName: propsData.channelName})
  }
  /*数字千位格式化*/
  let onNumFormat = (e) => {
    return (e || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  }
  /*排名列表tab点击*/
  let onTabClick = (e) => {
    setPage(1)
    let temp = JSON.parse(JSON.stringify(btnArr))
    let tempPayload = JSON.parse(JSON.stringify(payload))
    let tempType = 3
    temp.map((item, key) => {
      item.status = key === e ? true : false
      if(item.status){
        tempType = item.type
      }
    })
    setBtnArr(temp)
    tempPayload.orgType = tempType
    tempPayload.pageInfoVO.pageNo = 1
    setPayload(tempPayload)
  }
  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) =>{
    let tempPayload = JSON.parse(JSON.stringify(payload))
    tempPayload.pageInfoVO.pageNo = page
    setPage(page)
    setPageSize(pageSize)
    setPayload(tempPayload)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) =>{
    let tempPayload = JSON.parse(JSON.stringify(payload))
    tempPayload.pageInfoVO.pageNo = page
    tempPayload.pageInfoVO.pageSize = pageSize
    setPage(page)
    setPageSize(pageSize)
    setPayload(tempPayload)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) =>{
    let totalPage  = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNo} / ${totalPage}  页`
  }
  /*门店change*/
  let onBranchChange = (e) => {
    getTaskTeamList(e)
    dispatch({
      type: 'taskDataView/onReset'
    })
    form.resetFields(['teamId'])
  }
  /* 选中时间时*/
  let onCalendarChange = (e) => {
    setCheckDate(e)
  }
  /*限制日期只能选择七天*/
  let onDisabledDate = (current) => {
    if (!checkDate || checkDate.length === 0) {
      return false
    }
    let start = ''
    let end = ''
    if (checkDate[0]) {
      let startTime = checkDate[0]
      start = startTime && startTime.format("YYYY-MM-DD") > current.format("YYYY-MM-DD")
      end = startTime && moment(startTime).add(6,'days').format("YYYY-MM-DD") < current.format("YYYY-MM-DD")
    }
    if (checkDate[1]) {
      let endTime = checkDate[1]
      end = endTime && endTime.format("YYYY-MM-DD") < current.format("YYYY-MM-DD")
      start = endTime && moment(endTime).subtract(6,'days').format("YYYY-MM-DD") > current.format("YYYY-MM-DD")
    }
    return start || end
  }
  /*时间change*/
  let onTimeChange = (e) => {
    setFilterTime(e)
  }
  /*获取 下载当前任务门店-团队-个人排行 文件code*/
  let onDownloadTaskRank = () => {
    dispatch({
      type: 'taskDataView/onDownloadTaskRank',
      payload: {
        method: 'postJSON',
        params: payload
      },
      callback: (res) => {
        if (res.result.code === '0') {
          onDownloadExcel(res.body)
        } else {
          message.info(res.result.message)
        }
      }
    })
  }
  /*导出任务排名excel*/
  let onDownloadExcel = (fileCode) => {
    dispatch({
      type: 'cardDetailList/onImportExcelFile',
      payload: {
        method: 'getDownloadExcel',
        params: {fileCode},
      },
      callback: (res) => {
        const url = window.URL.createObjectURL(new Blob([res], { type: "application/vnd.ms-excel" }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '任务排名.xls')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    })
  }
  return(
    <div>
      <div className={style.form__cont}>
        <Form form={form} onFinish={onSearch}>
          <Row>
            <Col span={6}>
              <Form.Item label="集团" name="channelName" labelCol={{ flex: '0 0 80px' }} style={{margin: 0}}>
                <Input placeholder="暂无" allowClear disabled/>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="门店" name="branchId" labelCol={{ flex: '0 0 80px' }} style={{margin: 0}}>
                <Select placeholder="请选择" allowClear onChange={onBranchChange}>
                  {
                    branchList.map((item, key) => {
                      return <Option key={key} value={item.id}>{item.name}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="团队" name="teamId" labelCol={{ flex: '0 0 80px' }} style={{margin: 0}}>
                <Select placeholder="请选择" allowClear>
                  {
                    teamList.map((item, key) => {
                      return <Option key={key} value={item.id}>{item.name}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Row justify="end">
                <Space size={22}>
                  <Button htmlType="button" onClick={onReset}>重置</Button>
                  <Button htmlType="submit" type="primary">查询</Button>
                </Space>
              </Row>
            </Col>
          </Row>
        </Form>
      </div>

      <div style={{display: 'flex'}}>
        <div className={style.content_box} style={{marginRight: '16px'}}>
          <div className={style.content_heading}>
            <div className={style.content_title}>当前任务完成度</div>
            <div>任务有效期：{propsData.startTime}～{propsData.endTime}</div>
          </div>
          <div style={{display: 'flex', marginTop: '20px'}}>
            {
              finishList.map(item => {
                return <div className={style.progress_box}>
                  <div>
                    <div className={style.progress_num}>
                      {item.finishDegree}
                      <span>%</span>
                    </div>
                    <Progress width={150} type="circle" percent={item.finishDegree} strokeColor={item.color} showInfo={false} strokeWidth={8}/>
                  </div>
                  <div className={style.progress_title}>{item.name} {item.type !== 0 ? `（${item.unit}）` : null}</div>
                  <div className={style.progress_text}>实际/目标</div>
                  <div className={style.progress_num2}>{item.countFormat}/{item.kpiFormat}</div>
                </div>
              })
            }
          </div>
        </div>
        <div className={style.content_box}>
          <div className={style.content_heading}>
            <div style={{display: 'flex'}}>
              <div className={style.content_title}>任务完成度趋势</div>
              <div>任务有效期：{propsData.startTime}～{propsData.endTime}</div>
            </div>
            <RangePicker
                allowClear
                locale={locale}
                value={filterTime}
                className={style.time_box}
                onChange={onTimeChange}
                disabledDate={onDisabledDate}
                onCalendarChange={onCalendarChange}
                placeholder={['开始时间', '结束时间']}
            />
          </div>
          {
            lineConfig ? <div>
              <div className={style.line_title}>完成度（%）</div>
              <div className={style.line_box}>
                <Line {...lineConfig} />
              </div>
            </div> : null
          }
        </div>
      </div>
      <div className={style.content_box} style={{height: 'auto'}}>
        <div className={style.content_heading}>
          <div className={style.content_title}>任务排名</div>
          <div>任务有效期：{propsData.startTime}～{propsData.endTime}</div>
          <div className={style.content_btnBox}>
            {
              btnArr.map((item, key) => {
                return <div key={key} className={`${style.content_btn} ${item.status ? style.content_btn_check : ''}`} onClick={() => {onTabClick(key)}}>{item.title}</div>
              })
            }
          </div>
        </div>
        <Button type="primary" loading={btnStatus} className={style.list_btn} onClick={onDownloadTaskRank}>导出明细</Button>
        <div className={style.list_box}>
          <Table
              locale={{emptyText: '暂无数据'}}
              columns={renderColumns()}
              dataSource={list}
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
                current={pageNo}
                defaultPageSize={pageSize}
                total={pageTotal}
                onChange={onNextChange}
                pageSizeOptions={['5', '10', '20']}
                onShowSizeChange={onSizeChange}
                showTotal={onPageTotal}
            />
          </ConfigProvider>
        </div>
      </div>
    </div>
  )
}
export default connect(({taskDataView})=>({
  ...taskDataView
}))(taskDataViewPage)
