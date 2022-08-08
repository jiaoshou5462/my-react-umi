import React, { useEffect, useState } from "react";
import { Link, connect, history } from 'umi';
import { Row, Col, Tooltip, Tag, Space, Input, Modal, Table, Select, Tabs, Radio, Button, message, DatePicker } from "antd"
import style from "./style.less";
import AreaChart from "../components/areaChart";
import FunnelChart from '../components/funnelChart';
import CircleChart from '../components/circleChart';
import ColumnChart from '../components/columnChart';
import LineChart from "../components/lineChart";
import BartChart from '../components/barChart';
import { formatDate } from '@/utils/date';
import { textChange } from '../dataChange'
import { micrometerChange } from '../dataChange'
const { Option } = Select;
const { RangePicker } = DatePicker;
import moment from 'moment';  // 日期处理
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { TabPane } = Tabs;
// let smallChart = [
//   {
//     title: '发放卡券总数',
//     value: 'couponTotalNums',
//     color: '#60A1FF',
//     type: 'couponTotalNumsTextName'
//   },
//   {
//     title: '领取卡券总数',
//     value: 'couponCollectNums',
//     color: '#4DCB73',
//     type: 'couponCollectNumsTextName'
//   },
//   {
//     title: '享权卡券数',
//     value: 'couponEntitlementNums',
//     color: '#B37FEB',
//     type: 'couponEntitlementNumsTextName'
//   },
//   {
//     title: '享权用户数',
//     value: 'usersEntitlementNums',
//     color: '#37CBCB',
//     type: 'usersEntitlementNumsTextName'
//   },
//   {
//     title: '转赠次数',
//     value: 'couponsTransferNums',
//     color: '#F2637B',
//     type: 'couponsTransferNumsTextName'
//   },
//   {
//     title: '转赠人数',
//     value: 'usersTransferNums',
//     color: '#FF7A45',
//     type: 'usersTransferNumsTextName'
//   }
// ]

const cardDataAnalysisPage = (props) => {
  let { dispatch, selsctMarketingItems } = props,
    [tabName, setTabName] = useState('active'),
    [dates, setDates] = useState([]),
    [hackValue, setHackValue] = useState([moment(formatDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 30), 'YYYY-MM-DD'), moment(formatDate(new Date().getTime() - 24 * 60 * 60 * 1000), 'YYYY-MM-DD')]),
    [value, setValue] = useState(),
    [channelName, setChannelName] = useState(''),
    [activityId, setActivityId] = useState(''),
    [selectDate, setSelectDate] = useState({
      selectStartDate: formatDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 30) + ' 00:00:00',
      selectEndDate: formatDate(new Date().getTime() - 24 * 60 * 60 * 1000) + ' 23:59:59'
    }),
    [areaChartData, setAreaChartData] = useState({
      count: {},
      dataChange: []
    }),
    [funnelChartData, setFunnelChartData] = useState([]),
    [circleChartData, setCircleChartData] = useState([]),
    [pieChartData, setPieChartData] = useState([]),
    [pieSexChartData, setPieSexChartData] = useState([]),
    [columnChartData, setColumnChartData] = useState([]),
    [provinceData, setProvinceData] = useState([]),
    [cityData, setcityData] = useState([]),
    [timeNum, setTimeNum] = useState(2),
    [marketingChoice, setMarketingChoice] = useState(null),//选中营销项目
    [marketingType, setMarketingType] = useState(false);

  useEffect(() => {
    selsctAllMarketing();
    getChannelInfo();
    allDataChange();
  }, [])

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

  // 查询
  let searchData = () => {
    allDataChange()
  }
  useEffect(() => {
    if (marketingType) {
      allDataChange();
      setMarketingType(false);
    }
  }, [marketingChoice, marketingType])
  // 重置
  let resetData = () => {
    selectDate.selectStartDate = formatDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 30) + ' 00:00:00',
      selectDate.selectEndDate = formatDate(new Date().getTime() - 24 * 60 * 60 * 1000) + ' 23:59:59'
    setHackValue(
      [moment(formatDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 30), 'YYYY-MM-DD'), moment(formatDate(new Date().getTime() - 24 * 60 * 60 * 1000), 'YYYY-MM-DD')]
    )
    setTimeNum(2)
    console.log(marketingChoice)
    if (marketingChoice) {
      setMarketingType(true);
      setMarketingChoice(null);
    } else {
      allDataChange()
    }
  }

  let allDataChange = () => {
    getAreaData()
    findTotalCouponStatisticsListForName()
    findCouponSourceList()
    findCouponUserList()
    findCouponUserSexList()
    findCouponUserAgeList()
    findCouponUserProvinceList()
    findCouponUserCityList()
  }

  // 获取渠道基本信息
  let getChannelInfo = () => {
    dispatch({
      type: 'activityDataAnalysis/getChannelInfo',
      payload: {
        method: 'postJSON',
        params: {}
      },
      callback: (res) => {
        if (res.result.code === '0') {
          setChannelName(res.body.channelName)
        } else {
          message.error(res.result.message)
        }
      }
    })

  }
  // 单个日期选择
  let selectDateChange = (val) => {
    let selectEndDate = formatDate(new Date().getTime() - 24 * 60 * 60 * 1000) + ' 23:59:59'
    let selectStartDate = ''
    switch (val) {
      case 1:
        selectStartDate = formatDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 7) + ' 00:00:00'
        break;
      case 2:
        selectStartDate = formatDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 30) + ' 00:00:00'
        break;
      case 3:
        selectStartDate = formatDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 90) + ' 00:00:00'
        break;
      case 4:
        selectStartDate = formatDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 180) + ' 00:00:00'
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
          selectStartDate: val[0].format('YYYY-MM-DD') + ' 00:00:00',
          selectEndDate: val[1].format('YYYY-MM-DD') + ' 23:59:59'
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

  // 卡券发放统计
  let getAreaData = () => {
    dispatch({
      type: 'cardDataAnalysis/findCouponStatisticsList',
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
          // 面积图数据处理
          // let areaChartData = {}
          // let areaDataList = res.body
          // let smallObj = {}
          // for(let x in areaDataList[0]) {
          //   if(x !=='collectCouponsTime'){
          //      smallObj[x] = []
          //      areaDataList.forEach(item =>{
          //       let textNameChange = x+'TextName'
          //       item.collectCouponsTime = formatDate(item.collectCouponsTime)
          //       item[textNameChange] = textChange[x]
          //       smallObj[x].push(item[x])
          //     })
          //   }
          // }
          // areaChartData.list = areaDataList
          // areaChartData.smallObj = smallObj
          // areaChartData.defaultValueName = 'couponTotalNumsTextName'
          // areaChartData.defaultValue = 'couponTotalNums'
          // areaChartData.xField = 'collectCouponsTime'
          // res.areaChartData = areaChartData
          let lineChartData = res.body
          let dataChange = []
          for (let x in lineChartData[0]) {
            if (x !== 'collectCouponsTime') {
              lineChartData.forEach(item => {
                let obj = {}
                obj.category = textChange[x]
                obj.type = x
                obj.value = item[x]
                obj.statisticsDays = formatDate(item.collectCouponsTime)
                dataChange.push(obj)
              })
            }
          }
          res.dataChange = dataChange
        } else {
          message.error(res.result.message)
        }
      }
    }).then(resBody => {
      dispatch({
        type: 'cardDataAnalysis/findTotalCouponStatisticsList',
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
            resBody.count = res.body[0] ? res.body[0] : {
              couponTotalNums: 0,
              couponCollectNums: 0,
              couponEntitlementNums: 0,
              usersEntitlementNums: 0,
              couponsTransferNums: 0,
              usersTransferNums: 0
            }
            let areaChartData = {
              count: resBody.count,
              dataChange: resBody.dataChange
            }
            setAreaChartData(areaChartData)
          } else {
            message.error(res.result.message)
          }
        }
      })
    })
  }


  // 活动转换漏斗
  let findTotalCouponStatisticsListForName = () => {
    dispatch({
      type: 'cardDataAnalysis/findTotalCouponStatisticsListForName',
      payload: {
        method: 'postJSON',
        params: {
          "statisticsDaysStart": selectDate.selectStartDate,
          "statisticsDaysEnd": selectDate.selectEndDate,
          marketProjectId: marketingChoice
        },
      },
      callback: (res) => {
        if (res.result.code === '0') {
          setFunnelChartData(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 发放渠道
  let findCouponSourceList = () => {
    dispatch({
      type: 'cardDataAnalysis/findCouponSourceList',
      payload: {
        method: 'postJSON',
        params: {
          "statisticsDaysStart": selectDate.selectStartDate,
          "statisticsDaysEnd": selectDate.selectEndDate,
          marketProjectId: marketingChoice
        },
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let dataList = []
          let data = res.body[0]
          for (let x in data) {
            if (data[x] > 0) {
              let obj = {}
              obj.itemName = textChange[x]
              obj.itemCount = data[x]
              dataList.push(obj)
            }
          }
          if (dataList.length == 0) {
            dataList.push({ itemName: '暂无数据', itemCount: 0 })
          }
          setCircleChartData(dataList)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 参与用户
  let findCouponUserList = () => {
    dispatch({
      type: 'cardDataAnalysis/findCouponUserList',
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
          setPieChartData(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 性别
  let findCouponUserSexList = () => {
    dispatch({
      type: 'cardDataAnalysis/findCouponUserSexList',
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
          setPieSexChartData(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 年龄分布条形图
  let findCouponUserAgeList = () => {
    dispatch({
      type: 'cardDataAnalysis/findCouponUserAgeList',
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
          setColumnChartData(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 省份
  let findCouponUserProvinceList = () => {
    dispatch({
      type: 'cardDataAnalysis/findCouponUserProvinceList',
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
          setProvinceData(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 省份
  let findCouponUserCityList = () => {
    dispatch({
      type: 'cardDataAnalysis/findCouponUserCityList',
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
          setcityData(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  //营销项目选择
  let changeMarketing = (item, i) => {
    setMarketingChoice(item);
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
            <span className={style.time_select}>
              <RangePicker
                style={{ width: 220 }}
                format="YYYY-MM-DD"
                value={hackValue || value}
                disabledDate={disabledDate}
                onCalendarChange={(val) => onDateChange(val)}
                onChange={val => setValue(val)}
                onOpenChange={onOpenChange}
              />
            </span>
            <span className={timeNum === 1 ? style.time_tag_active : style.time_tag} onClick={() => selectDateChange(1)}>最近7天</span>
            <span className={timeNum === 2 ? style.time_tag_active : style.time_tag} onClick={() => selectDateChange(2)}>最近30日</span>
            <span className={timeNum === 3 ? style.time_tag_active : style.time_tag} onClick={() => selectDateChange(3)}>最近3个月</span>
            <span className={timeNum === 4 ? style.time_tag_active : style.time_tag} onClick={() => selectDateChange(4)}>最近6个月</span>
            <div className={style.header_btn_content}>
              <Button onClick={resetData}>重置</Button>
              <Button type="primary" onClick={searchData}>查询</Button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className={style.block__cont} style={{ paddingBottom: '50px' }}>
          <div className={style.block__header}>
            <span className={style.header_title}>卡券发放统计</span>
          </div>
          <Row className={style.part_2_content}>
            <Col flex="1 1 360px" className={style.part_2_left}>
              <Row >
                <Col span={12}>
                  <div className={style.tag_name}>卡券发放总数</div>
                  <div className={style.tag_num}>{micrometerChange(areaChartData.count.couponTotalNums)}<span>张</span></div>
                </Col>
                <Col span={12}>
                  <div className={style.tag_name}>享权用户数</div>
                  <div className={style.tag_num}>{micrometerChange(areaChartData.count.usersEntitlementNums)}<span>人</span></div>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <div className={style.tag_name}>领取卡券总数</div>
                  <div className={style.tag_num}>{micrometerChange(areaChartData.count.couponCollectNums)}<span>张</span></div>
                </Col>
                <Col span={12}>
                  <div className={style.tag_name}>转增次数</div>
                  <div className={style.tag_num}>{micrometerChange(areaChartData.count.couponsTransferNums)}<span>次</span></div>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <div className={style.tag_name}>享权卡券总数</div>
                  <div className={style.tag_num}>{micrometerChange(areaChartData.count.couponEntitlementNums)}<span>张</span></div>
                </Col>
                <Col span={12}>
                  <div className={style.tag_name}>转赠人数</div>
                  <div className={style.tag_num}>{micrometerChange(areaChartData.count.usersTransferNums)}<span>人</span></div>
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
            <span className={style.header_title}>卡券转化漏斗</span>
          </div>
          <div className={style.part_4_content} style={{ width: '80%', marginLeft: '10%' }}>
            <FunnelChart funnelChartData={funnelChartData} unit="张" />
          </div>
        </div>
        <Row className={style.wrap_cen}>
          <Col flex="1 1 480px">
            <div className={style.block__cont}>
              <div className={style.block__header}>
                <span className={style.header_title}>发放渠道</span>
              </div>
              <div className={style.part_3_content}>
                <div className={style.chart_width}><CircleChart innerRadius={0.7} circleChartData={circleChartData} /></div>
              </div>
            </div>
          </Col>
          <Col flex="1 1 480px">
            <div className={style.block__cont}>
              <div className={style.block__header}>
                <span className={style.header_title}>获得卡券用户</span>
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
                <div className={style.chart_width}><CircleChart innerRadius={0.7} circleChartData={pieSexChartData} /></div>
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
                <BartChart barChartData={cityData}></BartChart>
              </div>
            </div>
          </Col>
          <Col flex="1 1 480px">
            <div className={style.block__cont}>
              <div className={style.block__header}>
                <span className={style.header_title}>TOP 10省份排名</span>
              </div>
              <div className={style.part_5_content}>
                <BartChart barChartData={provinceData}></BartChart>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
};
export default connect(({ cardDataAnalysis, cardgrantManageModel }) => ({
  selsctMarketingItems: cardgrantManageModel.selsctMarketingItems,//营销项目
}))(cardDataAnalysisPage)
