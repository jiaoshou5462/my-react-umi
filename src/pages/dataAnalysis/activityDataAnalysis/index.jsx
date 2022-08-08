import React, { useEffect, useState } from "react";
import { Link, connect, history } from 'umi';
import { Row, Col, Tooltip, Tag, Space, Input, Modal, Table, Select, Tabs, Radio, Button, message, DatePicker } from "antd"
import style from "./style.less";
import AreaChart from "../components/areaChart";
import LineChart from "../components/lineChart";
import FunnelChart from '../components/funnelChart';
import CircleChart from '../components/circleChart';
import ColumnChart from '../components/columnChart';
import BartChart from '../components/barChart'
import { formatDate } from '@/utils/date';
import { micrometerChange } from '../dataChange'
const { Option } = Select;
const { RangePicker } = DatePicker;
import moment from 'moment';  // 日期处理
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { TabPane } = Tabs;
let textChange = {
  bannnerPv: "banner点击次数",
  bannnerUv: "banner点击人数",
  invitationPeopleNums: "邀请人数",
  newRegisteredUserNums: "新增注册人数",
  prizeReceivePeopleNums: "中奖人数",
  prizeTotalPeopleNums: "参与人数",
  sharePv: "分享次数",
  shareUv: "分享人数",
  turnIncreaseNums: "转增人数",
  visitNums: "访问次数",
  visitPeopleNums: "访问人数",
}
// let smallChart = [
//     {
//       title: '访问次数',
//       value: 'visitNums',
//       color: '#1890FF',
//       type: 'visitNumsTextName'
//     },
//     {
//       title: '访问人数',
//       value: 'visitPeopleNums',
//       color: '#4DCB73',
//       type: 'visitPeopleNumsTextName'
//     },
//     {
//       title: '参与人数',
//       value: 'prizeTotalPeopleNums',
//       color: '#37CBCB',
//       type: 'prizeTotalPeopleNumsTextName'
//     },
//     {
//       title: '中奖人数',
//       value: 'prizeReceivePeopleNums',
//       color: '#F2637B',
//       type: 'prizeReceivePeopleNumsTextName'
//     },
//     {
//       title: '新增注册人数',
//       value: 'newRegisteredUserNums',
//       color: '#FF7A45',
//       type: 'newRegisteredUserNumsTextName'
//     }
//   ]
const activityDataAnalysisPage = (props) => {
  let { dispatch, selsctMarketingItems } = props,
    [tabName, setTabName] = useState('active'),
    [dates, setDates] = useState(),
    [hackValue, setHackValue] = useState([moment(formatDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 30), 'YYYY-MM-DD'), moment(formatDate(new Date().getTime() - 24 * 60 * 60 * 1000), 'YYYY-MM-DD')]),
    [value, setValue] = useState(),
    [channelName, setChannelName] = useState(''),
    [activeList, setActiveList] = useState([]),
    [activityId, setActivityId] = useState(history.location.query.activityId ? history.location.query.activityId.toString() : null),
    [prizeList, setPrizeList] = useState([]),
    [activeDetail, setActiveDetail] = useState({}),
    [selectDate, setSelectDate] = useState({
      selectStartDate: formatDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 30),
      selectEndDate: formatDate(new Date().getTime() - 24 * 60 * 60 * 1000)
    }),
    [areaChartData, setAreaChartData] = useState({ dataChange: [], count: {} }),
    [lineChartData, setLineChartData] = useState([]),
    [funnelChartData, setFunnelChartData] = useState([]),
    [circleChartData, setCircleChartData] = useState([]),
    [pieChartData, setPieChartData] = useState([]),
    [sexChartData, setSexChartData] = useState([]),
    [cityChartData, setCityChartData] = useState([]),
    [provinceChartData, setProvinceChartData] = useState([]),
    [queryConductActivityData, setQueryConductActivityData] = useState({}),
    [columnChartData, setColumnChartData] = useState([]),
    [timeNum, setTimeNum] = useState(4),
    [showPrize, setShowPrize] = useState(false),
    [isToPage, setIsToPage] = useState(false),
    [marketingChoice, setMarketingChoice] = useState(null),//选中营销项目
    [marketingType, setMarketingType] = useState(false);

  useEffect(() => {
    getChannelInfo();
    selsctAllMarketing();
    if (history.location.query.activityId) {
      activeInfor(history.location.query.activityId, 'to')
    } else {
      allDataChange()
    }
  }, [])
  useEffect(() => {
    if (isToPage) {
      allDataChange()
    }
  }, [isToPage])
  let searchData = () => {
    allDataChange()
  }
  useEffect(() => {
    if (marketingType) {
      allDataChange();
      setMarketingType(false);
    }
  }, [marketingChoice, marketingType])
  let resetData = () => {
    activityId = ''
    setActivityId(null)
    setShowPrize(false)
    setTimeNum(4)
    selectDate.selectStartDate = formatDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 30)
    selectDate.selectEndDate = formatDate(new Date().getTime() - 24 * 60 * 60 * 1000)
    setHackValue(
      [moment(formatDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 30), 'YYYY-MM-DD'), moment(formatDate(new Date().getTime() - 24 * 60 * 60 * 1000), 'YYYY-MM-DD')]
    )
    if (marketingChoice) {
      setMarketingType(true);
      setMarketingChoice(null);
    } else {
      allDataChange()
    }
    getChannelInfo();
  }
  let allDataChange = () => {
    getAreaData()
    activitityTaskStatistics()
    activitityTaskStatisticsSum()
    activityLinkNums(),
      newJudge()
    sexSection()
    activityCitySection()
    activityProvinceSection()
    queryConductActivity()
    ageSection()
    if (activityId) {
      prizeSection(activityId)
    } else {
      setShowPrize(false)
    }
  }

  // 营销活动
  let selsctAllMarketing = () => {
    dispatch({
      type: 'cardgrantManageModel/selsctAllMarketing',
      payload: {
        method: 'postJSON',
        params: {
          type: 1,
          status: 1
        }
      }
    })
  }

  // 获取渠道基本信息
  let getChannelInfo = (objectId) => {
    let channelId = JSON.parse(localStorage.getItem('tokenObj')).channelId;
    dispatch({
      type: 'createStrategic/queryActivityList',
      payload: {
        method: 'postJSON',
        params: {
          channelId: channelId,
          pageNo: 1,
          pageSize: 500,
          objectId: objectId || ''
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          // setChannelName(res.body.channelName)
          setActiveList(res.body.list)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  // 进行中活动列表
  let queryConductActivity = () => {
    dispatch({
      type: 'activityDataAnalysis/queryConductActivity',
      payload: {
        method: 'postJSON',
        params: {
          "status": 4,
          "statisticsDaysStart": selectDate.selectStartDate,
          "statisticsDaysEnd": selectDate.selectEndDate,
          marketProjectId: marketingChoice,
          "activityId": activityId,
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          setQueryConductActivityData(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  // 选择活动
  let onChangeActivity = (e, option) => {
    setActivityId(e)
    if (e) {
      activeInfor(e)
    } else {
      setSelectDate({
        selectStartDate: formatDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 30),
        selectEndDate: formatDate(new Date().getTime() - 24 * 60 * 60 * 1000)
      })
      setTimeNum(4)
      setHackValue([moment(formatDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 30), 'YYYY-MM-DD'), moment(formatDate(new Date().getTime() - 24 * 60 * 60 * 1000), 'YYYY-MM-DD')])
    }
  }
  // 更改活动，获取活动时间
  let activeInfor = (data, type) => {
    dispatch({
      type: 'activityDataAnalysis/prizeSection',
      payload: {
        method: 'postJSON',
        params: {
          activityId: data,
          marketProjectId: marketingChoice
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          if (res.body.info.length && res.body.info[0].statisticsDaysStart && res.body.info[0].statisticsDaysEnd) {
            let statisticsDaysStart = res.body.info[0].statisticsDaysStart
            let statisticsDaysEnd = res.body.info[0].statisticsDaysEnd
            setHackValue([moment(formatDate(new Date(statisticsDaysStart).getTime()), 'YYYY-MM-DD'), moment(formatDate(new Date(statisticsDaysEnd).getTime()), 'YYYY-MM-DD')])
            let activityDate = {
              selectStartDate: statisticsDaysStart,
              selectEndDate: statisticsDaysEnd
            }
            setTimeNum(0)
            setSelectDate(activityDate)
          }
          setIsToPage(type == 'to' ? true : false)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 获取活动奖品详情
  let prizeSection = (data) => {
    dispatch({
      type: 'activityDataAnalysis/prizeSection',
      payload: {
        method: 'postJSON',
        params: {
          activityId: data,
          marketProjectId: marketingChoice
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          setPrizeList(res.body.prize)
          setActiveDetail(res.body.info[0] || {})
          if (res.body.info.length && res.body.info[0].statisticsDaysStart && res.body.info[0].statisticsDaysEnd) {
            let statisticsDaysStart = res.body.info[0].statisticsDaysStart
            let statisticsDaysEnd = res.body.info[0].statisticsDaysEnd
            setHackValue([moment(formatDate(new Date(statisticsDaysStart).getTime()), 'YYYY-MM-DD'), moment(formatDate(new Date(statisticsDaysEnd).getTime()), 'YYYY-MM-DD')])
            let activityDate = {
              selectStartDate: statisticsDaysStart,
              selectEndDate: statisticsDaysEnd
            }
            setTimeNum(0)
            setSelectDate(activityDate)
          }
          setShowPrize(true)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 单个日期选择
  let selectDateChange = (val) => {
    let selectEndDate = ''
    let selectStartDate = ''
    switch (val) {
      case 2:
        selectStartDate = formatDate(new Date().getTime() - 24 * 60 * 60 * 1000)
        selectEndDate = formatDate(new Date().getTime() - 24 * 60 * 60 * 1000)
        break;
      case 3:
        selectStartDate = formatDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 7)
        selectEndDate = formatDate(new Date().getTime() - 24 * 60 * 60 * 1000)
        break;
      case 4:
        selectStartDate = formatDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 30)
        selectEndDate = formatDate(new Date().getTime() - 24 * 60 * 60 * 1000)
        break;
    }
    setSelectDate({
      selectStartDate: selectStartDate,
      selectEndDate: selectEndDate
    })
    setHackValue([(moment(formatDate(selectStartDate), 'YYYY-MM-DD')),
    (moment(formatDate(selectEndDate), 'YYYY-MM-DD')),])
    setTimeNum(val)
  }
  // 获取本月日期
  let selectMonth = (val) => {
    let now = new Date();
    let nowMonth = now.getMonth();
    let nowYear = now.getFullYear();
    let selectStartDate = formatDate(new Date(nowYear, nowMonth, 1).getTime())
    let selectEndDate = formatDate(new Date(nowYear, nowMonth + 1, 0).getTime())
    setSelectDate({
      selectStartDate: selectStartDate,
      selectEndDate: selectEndDate
    })
    setHackValue([(moment(formatDate(selectStartDate), 'YYYY-MM-DD')),
    (moment(formatDate(selectEndDate), 'YYYY-MM-DD')),])
    setTimeNum(val)
  }
  // 切换tab
  let onChangeTags = (e) => {
    setTabName(e.target.value)
  }
  // 日期选择限定在半年内
  let disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 180;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 180;
    return tooEarly || tooLate;
  };
  let onOpenChange = open => {
    if (open) {
      setHackValue([]);
      setDates([]);
    } else {
      setHackValue(undefined);
    }
  };
  let onDateChange = (val) => {
    if (val) {
      if (val[0] && val[1]) {
        setSelectDate({
          selectStartDate: val[0].format('YYYY-MM-DD'),
          selectEndDate: val[1].format('YYYY-MM-DD')
        })
        setTimeNum(0)
      }
    } else {
      setSelectDate({
        selectStartDate: '',
        selectEndDate: ''
      })
      setTimeNum(0)
    }
    setDates(val)
  }

  // 整体趋势数据
  let getAreaData = () => {
    dispatch({
      type: 'activityDataAnalysis/wholeTrendStatistics',
      payload: {
        method: 'postJSON',
        params: {
          "statisticsDaysStart": selectDate.selectStartDate,
          "statisticsDaysEnd": selectDate.selectEndDate,
          "activityId": activityId,
          marketProjectId: marketingChoice
        },
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let areaDataList = res.body.list
          // let smallObj = {}
          // for(let x in areaDataList[0]) {
          //   if(x !=='statisticsDays'){
          //      smallObj[x] = []
          //      areaDataList.forEach(item =>{
          //       let textNameChange = x+'TextName'
          //       item[textNameChange] = textChange[x]
          //       smallObj[x].push(item[x])
          //     })
          //   }
          // }
          // res.body.smallObj = smallObj
          // res.body.defaultValueName = 'visitNumsTextName'
          // res.body.defaultValue = 'visitNums'
          // res.body.xField = 'statisticsDays'
          let dataChange = []
          for (let x in areaDataList[0]) {
            if (x !== 'statisticsDays') {
              areaDataList.forEach(item => {
                let obj = {}
                obj.category = textChange[x]
                obj.type = x
                obj.value = item[x]
                obj.statisticsDays = item.statisticsDays
                dataChange.push(obj)
              })
            }
          }
          res.body.dataChange = dataChange
          setAreaChartData(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 活动任务
  let activitityTaskStatistics = () => {
    dispatch({
      type: 'activityDataAnalysis/activitityTaskStatistics',
      payload: {
        method: 'postJSON',
        params: {
          "statisticsDaysStart": selectDate.selectStartDate,
          "statisticsDaysEnd": selectDate.selectEndDate,
          "activityId": activityId,
          marketProjectId: marketingChoice
        },
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let lineChartData = res.body
          let dataChange = []
          for (let x in lineChartData[0]) {
            if (x !== 'statisticsDays') {
              lineChartData.forEach(item => {
                if (item[x] != null) {
                  let obj = {}
                  obj.category = textChange[x]
                  obj.type = x
                  obj.value = item[x]
                  obj.statisticsDays = item.statisticsDays
                  dataChange.push(obj)
                }
              })
            }
          }
          setLineChartData(dataChange)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 活动转换漏斗
  let activitityTaskStatisticsSum = () => {
    dispatch({
      type: 'activityDataAnalysis/activitityTaskStatisticsSum',
      payload: {
        method: 'postJSON',
        params: {
          "statisticsDaysStart": selectDate.selectStartDate,
          "statisticsDaysEnd": selectDate.selectEndDate,
          "activityId": activityId,
          marketProjectId: marketingChoice
        },
      },
      callback: (res) => {
        if (res.result.code === '0') {
          res.body.forEach(item => {
            item.itemName = item.activityLinkType
            item.itemCount = item.activityCount
            item.precentage = item.proportion
          })
          setFunnelChartData(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 活动来源
  let activityLinkNums = () => {
    dispatch({
      type: 'activityDataAnalysis/activityLinkNums',
      payload: {
        method: 'postJSON',
        params: {
          "statisticsDaysStart": selectDate.selectStartDate,
          "statisticsDaysEnd": selectDate.selectEndDate,
          "activityId": activityId,
          marketProjectId: marketingChoice
        },
      },
      callback: (res) => {
        if (res.result.code === '0') {
          res.body.forEach(item => {
            item.itemName = item.activityLinkType
            item.itemCount = item.activityCount
          })
          setCircleChartData(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 参与用户
  let newJudge = () => {
    dispatch({
      type: 'activityDataAnalysis/newJudge',
      payload: {
        method: 'postJSON',
        params: {
          "statisticsDaysStart": selectDate.selectStartDate,
          "statisticsDaysEnd": selectDate.selectEndDate,
          "activityId": activityId,
          marketProjectId: marketingChoice
        },
      },
      callback: (res) => {
        if (res.result.code === '0') {
          res.body.forEach(item => {
            item.itemName = item.activityLinkType
            item.itemCount = item.activityCount
          })
          setPieChartData(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 性别统计
  let sexSection = () => {
    dispatch({
      type: 'activityDataAnalysis/sexSection',
      payload: {
        method: 'postJSON',
        params: {
          "statisticsDaysStart": selectDate.selectStartDate,
          "statisticsDaysEnd": selectDate.selectEndDate,
          "activityId": activityId,
          marketProjectId: marketingChoice
        },
      },
      callback: (res) => {
        if (res.result.code === '0') {
          res.body.forEach(item => {
            item.itemName = item.activityLinkType
            item.itemCount = item.activityCount
          })
          setSexChartData(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 年龄分布条形图
  let ageSection = () => {
    dispatch({
      type: 'activityDataAnalysis/ageSection',
      payload: {
        method: 'postJSON',
        params: {
          "statisticsDaysStart": selectDate.selectStartDate,
          "statisticsDaysEnd": selectDate.selectEndDate,
          "activityId": activityId,
          marketProjectId: marketingChoice
        },
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let data = []
          res.body.forEach(item => {
            let obj = {}
            obj.itemName = item.activityLinkType
            obj.itemCount = item.activityCount
            data.push(obj)
          })
          setColumnChartData(data)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 城市统计
  let activityCitySection = () => {
    dispatch({
      type: 'activityDataAnalysis/activityCitySection',
      payload: {
        method: 'postJSON',
        params: {
          "statisticsDaysStart": selectDate.selectStartDate,
          "statisticsDaysEnd": selectDate.selectEndDate,
          "activityId": activityId,
          marketProjectId: marketingChoice
        },
      },
      callback: (res) => {
        if (res.result.code === '0') {
          res.body.forEach(item => {
            item.itemName = item.activityLinkType
            item.itemCount = item.activityCount
            item.precentage = Number(item.proportion.replace('%', ''))
          })
          setCityChartData(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  // 省份统计
  let activityProvinceSection = () => {
    dispatch({
      type: 'activityDataAnalysis/activityProvinceSection',
      payload: {
        method: 'postJSON',
        params: {
          "statisticsDaysStart": selectDate.selectStartDate,
          "statisticsDaysEnd": selectDate.selectEndDate,
          "activityId": activityId,
          marketProjectId: marketingChoice
        },
      },
      callback: (res) => {
        if (res.result.code === '0') {
          res.body.forEach(item => {
            item.itemName = item.activityLinkType
            item.itemCount = item.activityCount
            item.precentage = Number(item.proportion.replace('%', ''))
          })
          setProvinceChartData(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  //营销项目选择
  let changeMarketing = (item, i) => {
    setActivityId(null);
    setMarketingChoice(item);
    getChannelInfo(item);
  }
  return (
    <div>
      <div className={style.block__cont}>
        <div className={style.block__header}>
          <div className={style.header_left}>
            <Select placeholder="选择营销项目" allowClear showSearch style={{ width: 180, marginLeft: '0px' }} onChange={(item, i) => {
              changeMarketing(item, i)
            }} value={marketingChoice}>
              {
                selsctMarketingItems && selsctMarketingItems.map((v) => <Option key={v.objectId} value={v.objectId}>{v.marketProjectName}</Option>)
              }
            </Select>
            <Select
              allowClear
              showSearch
              style={{ width: 180, marginLeft: '0px' }}
              placeholder="所有活动"
              value={activityId && Number(activityId)}
              optionFilterProp="children"
              onChange={onChangeActivity}
              filterOption={(input, option) =>
                option.children.indexOf(input) >= 0
              }
            >
              {activeList.map(((item, index) => {
                return <Option value={item.objectId} key={index}>{item.internalName}</Option>
              }))}
            </Select>
            <RangePicker
              format="YYYY-MM-DD"
              style={{ width: 240 }}
              value={hackValue || value}
              disabledDate={disabledDate}
              onCalendarChange={(val) => onDateChange(val)}
              onChange={val => setValue(val)}
              onOpenChange={onOpenChange}
            />
            {/* <span className={timeNum===1?style.time_tag_active:style.time_tag} onClick={()=>selectDateChange(1)}>今日</span> */}
            {/* <span className={timeNum===2?style.time_tag_active:style.time_tag} onClick={()=>selectDateChange(2)}>昨日</span> */}
            <span className={timeNum === 3 ? style.time_tag_active : style.time_tag} onClick={() => selectDateChange(3)}>最近7日</span>
            <span className={timeNum === 4 ? style.time_tag_active : style.time_tag} onClick={() => selectDateChange(4)}>最近30日</span>
            <span className={timeNum === 5 ? style.time_tag_active : style.time_tag} onClick={() => selectMonth(5)}>本月</span>

            <div className={style.header_btn_content}>
              <Button onClick={resetData}>重置</Button>
              <Button type="primary" onClick={searchData}>查询</Button>
            </div>
          </div>
        </div>
      </div>
      <Row>
        <Col span={showPrize ? 12 : 24} className={`${style.block__cont} ${showPrize ? style.block_left : null}`} >
          <div className={style.block__header}>
            <span className={style.header_title}>活动信息</span>
          </div>
          {showPrize ?
            <div className={style.active_detail}>
              <Row >
                <Col span={12}>
                  <span className={style.tag_name}> 活动名称</span>
                  <div className={style.tag_detail}>{activeDetail.activityName}</div>
                </Col>
                <Col span={12}>
                  <span className={style.tag_name}> 活动类型</span>
                  <div className={style.tag_detail}>{activeDetail.marketActivityTypeName}</div>
                </Col>
                <Col span={12}>
                  <span className={style.tag_name}> 活动时间</span>
                  <div className={style.tag_detail}>{activeDetail.statisticsDaysStart} - {activeDetail.statisticsDaysEnd}</div>
                </Col>
                <Col span={12}>
                  <span className={style.tag_name}> 活动状态</span>
                  <div className={style.tag_detail}>{activeDetail.statusName}</div>
                </Col>
              </Row>
            </div> :
            <div className={style.active_data}>
              <Row>
                <Col span={12} >
                  <span className={style.tag_name}>活动数量</span>
                  <div className={style.tag_data}>{queryConductActivityData.activityCount}个</div>
                </Col>
                <Col span={12}>
                  <span className={style.tag_name}>进行中的活动</span>
                  <div className={style.tag_data}>{queryConductActivityData.activityLinkType}</div>
                </Col>
              </Row>
            </div>
          }
        </Col>
        {showPrize ?
          <Col span={12} className={`${style.block__cont} ${style.block_right}`}>
            <div className={style.block__header}>
              <span className={style.header_title}>奖品内容</span>
            </div>
            <div className={style.prize_content}>
              <Row>
                {prizeList.map((item, index) => {
                  return <Col span={12}>
                    <span className={style.tag_name}>{item.prizeName}</span>
                    <div style={{ marginBottom: '10px' }}>共{item.prizeTotalNums ? item.prizeTotalNums : 0}份；已领：{item.prizeReceiveNums ? item.prizeReceiveNums : 0}份；剩余：{item.prizeSurplusNums ? item.prizeSurplusNums : 0}份；</div>
                  </Col>
                })}
              </Row>
            </div>
          </Col> : null}
      </Row>
      <div>
        <div className={style.block__cont} style={{ paddingBottom: '40px' }}>
          <div className={style.block__header}>
            <span className={style.header_title}>整体趋势</span>
          </div>
          <Row className={style.part_2_content}>
            <Col flex="1 1 360px" className={style.part_2_left}>
              <Row >
                <Col span={12}>
                  <div className={style.tag_name}>访问次数</div>
                  <div className={style.tag_num}>{micrometerChange(areaChartData.count.visitNums)}<span>次</span></div>
                </Col>
                <Col span={12}>
                  <div className={style.tag_name}>中奖人数</div>
                  <div className={style.tag_num}>{micrometerChange(areaChartData.count.prizeReceivePeopleNums)}<span>人</span></div>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <div className={style.tag_name}>访问人数</div>
                  <div className={style.tag_num}>{micrometerChange(areaChartData.count.visitPeopleNums)}<span>人</span></div>
                </Col>
                <Col span={12}>
                  <div className={style.tag_name}>新增注册人数</div>
                  <div className={style.tag_num}>{micrometerChange(areaChartData.count.newRegisteredUserNums)}<span>人</span></div>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <div className={style.tag_name}>参与人数</div>
                  <div className={style.tag_num}>{micrometerChange(areaChartData.count.prizeTotalPeopleNums)}<span>人</span></div>
                </Col>
              </Row>
            </Col>
            <Col flex="1 1 600px" className={style.part_2_right}>
              <div className={style.wrap_by_notes}>数量（人/次）</div>
              <LineChart lineChartData={areaChartData.dataChange} />
            </Col>
          </Row>
        </div>
        <div className={style.block__cont}>
          <div className={style.block__header}>
            <span className={style.header_title}>用户数量统计</span>
          </div>
          <div className={style.part_3_content}>
            <div className={style.wrap_by_notes}>数量（人/次）</div>
            <LineChart lineChartData={lineChartData} />
          </div>
        </div>
        <div className={style.block__cont}>
          <div className={style.block__header}>
            <span className={style.header_title}>活动转化漏斗</span>
          </div>
          <div className={style.part_4_content} style={{ width: '80%', marginLeft: '10%' }}>
            <FunnelChart funnelChartData={funnelChartData} unit="人" />
          </div>
        </div>
        <Row className={style.wrap_cen}>
          <Col flex="1 1 480px">
            <div className={style.block__cont}>
              <div className={style.block__header}>
                <span className={style.header_title}>活动来源</span>
              </div>
              <div className={style.part_3_content}>
                <div className={style.chart_width}><CircleChart innerRadius={0.7} circleChartData={circleChartData} /></div>
              </div>
            </div>
          </Col>
          <Col flex="1 1 480px">
            <div className={style.block__cont}>
              <div className={style.block__header}>
                <span className={style.header_title}>参与活动用户</span>
              </div>
              <div className={style.part_3_content}>
                <div className={style.chart_width}><CircleChart innerRadius={0.7} circleChartData={pieChartData} /></div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className={style.wrap_cen}>
          <Col flex="1 1 480px">
            <div className={style.block__cont}>
              <div className={style.block__header}>
                <span className={style.header_title}>用户性别分布</span>
              </div>
              <div className={style.part_3_content}>
                <div className={style.chart_width}><CircleChart innerRadius={0.7} circleChartData={sexChartData} /></div>
              </div>
            </div>
          </Col>
          <Col flex="1 1 480px">
            <div className={style.block__cont}>
              <div className={style.block__header}>
                <span className={style.header_title}>用户年龄分布</span>
              </div>
              <div className={style.part_3_content}>
                <div className={style.wrap_by_notes}>人数（人）</div>
                <ColumnChart columnChartData={columnChartData} />
              </div>
            </div>
          </Col>
        </Row>
        <Row className={style.wrap_cen}>
          <Col flex="1 1 480px">
            <div className={style.block__cont}>
              <div className={style.block__header}>
                <span className={style.header_title}>TOP 10城市排名</span>
              </div>
              <div className={style.part_5_content}>
                <BartChart barChartData={cityChartData}></BartChart>
              </div>
            </div>
          </Col>
          <Col flex="1 1 480px">
            <div className={style.block__cont}>
              <div className={style.block__header}>
                <span className={style.header_title}>TOP 10省份排名</span>
              </div>
              <div className={style.part_5_content}>
                <BartChart barChartData={provinceChartData}></BartChart>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
};
export default connect(({ activityDataAnalysis, cardgrantManageModel, createStrategic }) => ({
  selsctMarketingItems: cardgrantManageModel.selsctMarketingItems,//营销项目
}))(activityDataAnalysisPage)
