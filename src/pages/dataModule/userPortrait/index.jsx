//用户分群列表
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { DatePicker, Radio, Table, message , Row, Col} from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import { Line, Funnel, Column, Area, Radar, Pie, Bar } from '@ant-design/charts';
import { parseToThousandth } from '@/utils/date';
import moment from 'moment'
import 'moment/locale/zh-cn'
import style from './styles.less';
const { RangePicker } = DatePicker;
let typeAll = {
  chart1: 2,   //数量统计
  chart2: 2,   //数量统计 -累计2、当期1
  chart3: 2,   //转化率分析
  chart4: 2,   //用户活跃度结构
  chart5: 1,   //卡券偏好
  chart6: 1,   //活动偏好
  chart7: 1,   //用户来源统计
  chart8: 1,   //用户活跃时间段分布
  chartTime1: null,   //数量统计- 所选日期
  chartTime2: null,   //转化率分析- 所选日期
  chartTime3: null,   //用户活跃度结构- 所选日期
}
const userPortraitPage = (props) => {
  let { dispatch } = props;
  //总统计
  let [dataInfo, setDataInfo] = useState({
    "registeredUsersNums": 0,
    "usersConcernedNums": 0,
    "authorizedUsersNums": 0,
    "invitedUsersNums": 0
  });
  let [timeArr, setTimeArr] = useState(["", "", ""]);
  //用户数量统计
  let [dataChart1, setDataChart1] = useState([]);
  let configChart1 = {
    data: dataChart1,
    xField: 'itemName',
    yField: 'itemCount',
    seriesField: 'title',
    xAxis: {
      // type: 'time',
    },
    yAxis: {
      label: { formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`), },  //千分位
      grid: {    //设置虚线警示线
        line: {
          style: {
            lineDash: [4, 2],
            strokeOpacity: 0.7,
          },
        },
      },
    },
    legend: {
      position: 'bottom',
      offsetY: 20
    },

  }

  //转化率分析
  let [dataChart2, setDataChart2] = useState([]);
  let configChart2 = {
    data: dataChart2,
    xField: 'stage',
    yField: 'number',
    legend: false,
    label: {
      formatter: (datum) => {
        return `${datum.stage}\n${datum.number}人`;
      },
      style: {
        fontSize: 15
      }
    },
    maxSize: 0.9,
    conversionTag: {
      formatter: (datum) => {
        return `转化率：${((datum['$$percentage$$']) * 100).toFixed(2)}%`;
      },
    },
    color: ['#1A9AC6', '#2FB6E4', '#5CC6EA', '#93E2FF', '#BCEDFF']
  }

  //用户活跃度结构
  let [dataChart3, setDataChart3] = useState([]);
  let configChart3 = {
    data: dataChart3,
    isStack: true,
    xField: 'year',
    yField: 'value',
    seriesField: 'category',
    label: {
      formatter: (datum) => {
        return ' ';
      },
    },
    yAxis: {
      grid: {
        line: {
          style: {
            lineDash: [4, 2],
            strokeOpacity: 0.7,
          },
        },
      },
    },
    legend: {
      position: 'bottom',
      offsetY: 7
    },
    color: ['#5CC6EA', '#5BDABD', '#FFDB26', '#1A9AC6', '#93E2FF']
  };

  // 用户价值分析
  let [dataChart4, setDataChart4] = useState([
    {
      "year": "2021-10-23",
      "value": 12,
      "category": "优质客户"
    },
    {
      "year": "2021-10-24",
      "value": 22,
      "category": "优质客户"
    },
    {
      "year": "2021-10-25",
      "value": 32,
      "category": "优质客户"
    },
    {
      "year": "2021-10-26",
      "value": 44,
      "category": "优质客户"
    },
  ]);
  let configChart4 = {
    data: dataChart4,
    xField: 'year',
    yField: 'value',
    seriesField: 'category',
    yAxis: {
      label: { formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`), },
      grid: {
        line: {
          style: {
            lineDash: [4, 2],
            strokeOpacity: 0.7,
          },
        },
      },
    },
    legend: false
  };

  //卡券偏好
  let [dataChart5, setDataChart5] = useState([])
  let columns1 = () => {
    return (
      [{ title: '类型', dataIndex: 'itemName' },
      { title: '发放数量', dataIndex: 'totalNum' },
      { title: '领取数量', dataIndex: 'itemCount' },
      {
        title: '领取率', dataIndex: 'precentage', render: (precentage, record) => {
          return <span>{precentage}%</span>
        }
      }]
    )
  }
  let configChart5 = {
    // data: dataChart5.map((d) => ({ ...d, num2: Math.sqrt(d.totalNum) })),
    data: dataChart5,
    xField: 'itemName',
    yField: 'totalNum',
    appendPadding: [10, 10, 0, 10],
    meta: {
      totalNum: {
        alias: '卡券偏好',
        min: 0,
        nice: true,
        formatter: (v) => Number(v).toFixed(0),
      },
    },
    xAxis: {
      line: null,
      tickLine: null,
      grid: {
        line: {
          style: {
            lineDash: null,
          },
        },
      },
    },
    yAxis: {
      grid: {
        line: {
          type: 'line',
          style: {
            lineDash: null,
          },
        },
        alternateColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
    tooltip: {
      customContent: (title, data) => {
        if (title) {
          return `<div class=${style.tools}><h5>${title}</h5><p>发放数量：${data[0].data.totalNum}</p><p>领取数量：${data[0].data.itemCount}</p><p>领取率：${data[0].data.precentage}%</p></div>`;
        }
      }
    },
    color: "#3AD2B0",
    // 开启辅助点
    point: {
      size: 2,
    },
    area: {},
  };

  // 活动偏好
  let [dataChart6, setDataChart6] = useState([])
  let columns2 = () => {
    return (
      [{ title: '活动类型', dataIndex: 'itemName' },
      { title: '访问人次', dataIndex: 'totalNum' },
      { title: '参与人次', dataIndex: 'itemCount' },
      {
        title: '参与率', dataIndex: 'precentage', render: (precentage, record) => {
          return <span>{precentage}%</span>
        }
      }]
    )
  }
  let configChart6 = {
    data: dataChart6,
    xField: 'itemName',
    yField: 'totalNum',
    appendPadding: [10, 10, 0, 10],
    meta: {
      totalNum: {
        alias: '活动偏好',
        min: 0,
        nice: true,
        formatter: (v) => Number(v).toFixed(0),
      },
    },
    xAxis: {
      line: null,
      tickLine: null,
      grid: {
        line: {
          style: {
            lineDash: null,
          },
        },
      },
    },
    yAxis: {
      grid: {
        line: {
          type: 'line',
          style: {
            lineDash: null,
          },
        },
        alternateColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
    color: "#3AD2B0",
    // 开启辅助点
    point: {
      size: 2,
    },
    area: {},
  };

  //用户来源统计
  let [dataChart7, setDataChart7] = useState([])
  let configChart7 = {
    appendPadding: 30,
    data: dataChart7,
    angleField: 'itemCount',
    colorField: 'itemName',
    radius: 0.82,
    innerRadius: 0.7,
    label: {
      type: 'spider',
      labelHeight: 28,
      formatter: (datum) => {
        return `${datum.itemName}\n${datum.itemCount}人 | ${((datum.percent) * 100).toFixed(2)}%`;
      },
      style: {
        fontSize: 12,
        fill: "#999"
      }
    },
    statistic: {
      title: false,
      content: false,
    },
    legend: false
  };

  // 用户活跃时间段分布
  let [dataChart8, setDataChart8] = useState([])
  const configChart8 = {
    data: dataChart8,
    xField: 'itemName',
    yField: 'itemCount',
    label: {
      formatter: (datum) => {
        return ' ';
      },
    },
    legend: false,
    yAxis: {
      label: { formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`), },
      grid: {
        line: {
          style: {
            lineDash: [4, 2],
            strokeOpacity: 0.7,
          },
        },
      },
    },
    xAxis: {
      label: { formatter: (v) => `${v}时`, },
    },
    color: "#FFDE36",
    tooltip: {
      formatter: (datum) => {
        return { name: '用户活跃', value: datum.itemCount + '次' };
      },
      title: (e) => {
        return e + '时'
      }
    }
  };

  // 用户性别分布
  let [dataChart9, setDataChart9] = useState([])
  let configChart9 = {
    appendPadding: 30,
    data: dataChart9,
    angleField: 'itemCount',
    colorField: 'itemName',
    radius: 0.82,
    innerRadius: 0.7,
    label: {
      type: 'spider',
      labelHeight: 28,
      formatter: (datum) => {
        return `${datum.itemName}\n${datum.itemCount}人 | ${((datum.percent) * 100).toFixed(2)}%`;
      },
      style: {
        fontSize: 12,
        fill: "#999"
      }
    },
    statistic: {
      title: false,
      content: false,
    },
    legend: false
  };

  // 用户年龄分布
  let [dataChart10, setDataChart10] = useState([])
  let configChart10 = {
    data: dataChart10,
    xField: 'itemName',
    yField: 'itemCount',
    label: {
      formatter: (datum) => {
        return ' ';
      },
    },
    legend: false,
    yAxis: {
      label: { formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`), },
      grid: {
        line: {
          style: {
            lineDash: [4, 2],
            strokeOpacity: 0.7,
          },
        },
      },
    },
    color: "#5AC5E9",
    tooltip: {
      formatter: (datum) => {
        return { name: '用户人数', value: datum.itemCount + '人' };
      },
    }
  };

  // TOP 10城市排名
  let [dataChart11, setDataChart11] = useState([]);
  let configChart11 = {
    data: dataChart11,
    xField: 'precentage',
    yField: 'itemName',
    seriesField: 'itemCount',
    legend: false,
    color: "#7AE0C8",
    yAxis: {
      label: { formatter: (v) => `${v}` },
      grid: {
        line: false
      }
    },
    meta: {
      precentage: {
        min: 0,
        max: 100,
      }
    },
    xAxis: {
      label: { formatter: (v) => `${v}%` },
      grid: {
        line: {
          style: {
            lineDash: [4, 2],
            strokeOpacity: 0.7,
          }
        }
      },

    },
    label: {
      style: {
        fill: '#111',
        opacity: 0.7
      },
      position: "right",
      formatter: (datum) => {
        return `${datum.precentage}%`;
      },
    },
    tooltip: {
      customContent: (title, data) => {
        if (title) {
          return `<div class=${style.tools}><h5>${title}</h5><p>人数：${data[0].data.itemCount}</p><p>占比：${data[0].data.precentage}%</p></div>`;
        }

      }
    }
  };

  // TOP 10省份排名
  let [dataChart12, setDataChart12] = useState([]);
  let configChart12 = {
    data: dataChart12,
    xField: 'precentage',
    yField: 'itemName',
    seriesField: 'itemCount',
    legend: false,
    color: "#7AE0C8",
    yAxis: {
      label: { formatter: (v) => `${v}` },
      grid: {
        line: false
      }
    },
    meta: {
      precentage: {
        min: 0,
        max: 100,
      }
    },
    xAxis: {
      label: { formatter: (v) => `${v}%` },
      grid: {
        line: {
          style: {
            lineDash: [4, 2],
            strokeOpacity: 0.7,
          }
        }
      },

    },
    label: {
      style: {
        fill: '#111',
        opacity: 0.7
      },
      position: "right",
      formatter: (datum) => {
        return `${datum.precentage}%`;
      },
    },
    tooltip: {
      customContent: (title, data) => {
        if (title) {
          return `<div class=${style.tools}><h5>${title}</h5><p>人数：${data[0].data.itemCount}</p><p>占比：${data[0].data.precentage}%</p></div>`;
        }
      }
    }
  };

  //最近7天
  let getInitTime1 = () => {
    let initTime = [];
    initTime.push(moment().day(moment().day() - 7).format("YYYY-MM-DD"));
    initTime.push(moment().day(moment().day() - 1).format("YYYY-MM-DD"));
    return initTime;
  }
  //最近30天
  let getInitTime2 = () => {
    let initTime = [];
    initTime.push(moment().day(moment().day() - 31).format("YYYY-MM-DD"));
    initTime.push(moment().day(moment().day() - 1).format("YYYY-MM-DD"));
    return initTime;
  }
  //最近6个月
  let getInitTime3 = () => {
    let initTime = [];
    initTime.push(moment().subtract(6, "months").format("YYYY-MM-DD"));
    initTime.push(moment().day(moment().day() - 1).format("YYYY-MM-DD"));
    return initTime;
  }
  //最近一年
  let getInitTime4 = () => {
    let initTime = [];
    initTime.push(moment().subtract(1, "years").format("YYYY-MM-DD"));
    initTime.push(moment().day(moment().day() - 1).format("YYYY-MM-DD"));
    return initTime;
  }
  //类型切换-通用
  // let [typeAll, setTypeAll] = useState({
  //   chart1: 1,   //数量统计
  //   chart2: 2,   //数量统计 -累计2、当期1
  //   chart3: 1,   //转化率分析
  //   chart4: 1,   //用户活跃度结构
  //   chart5: 1,   //卡券偏好
  //   chart6: 1,   //活动偏好
  //   chart7: 1,   //用户来源统计
  //   chart8: 1,   //用户活跃时间段分布
  //   chartTime1: null,   //数量统计- 所选日期
  //   chartTime2: null,   //转化率分析- 所选日期
  //   chartTime3: null,   //用户活跃度结构- 所选日期
  // })

  //选择最近日期
  let changeType = (name, type) => {
    let toTypeAll = typeAll;
    toTypeAll[name] = type;
    typeAll = { ...toTypeAll };
    let getInitTimes;
    if (type == 1 && (name == 'chart1' || name == 'chart3' || name == 'chart4')) {
      getInitTimes = getInitTime1();
    } else if (type == 2 && (name == 'chart1' || name == 'chart3' || name == 'chart4')) {
      getInitTimes = getInitTime2();
    }
    if (type == 1 && (name == 'chart5' || name == 'chart6' || name == 'chart7' || name == 'chart8')) {
      getInitTimes = getInitTime3();
    } else if (type == 2 && (name == 'chart5' || name == 'chart6' || name == 'chart7' || name == 'chart8')) {
      getInitTimes = getInitTime4();
    }
    let toTimeArr = timeArr;
    if (name == 'chart1') {  //数量统计
      toTimeArr[0] = [moment(getInitTimes[0]), moment(getInitTimes[1])];
      findCustomerDataList(typeAll.chart2, getInitTimes);
    } else if (name == 'chart3') {  //转化率分析
      toTimeArr[1] = [moment(getInitTimes[0]), moment(getInitTimes[1])];
      findUserConversionAnalysisList(getInitTimes);
    } else if (name == 'chart4') {  //用户活跃度分析
      toTimeArr[2] = [moment(getInitTimes[0]), moment(getInitTimes[1])];
      findUserActivityAnalysisList(getInitTimes);
    } else if (name == 'chart7') {  //用户来源统计
      findSourcePersonList(getInitTimes);
    } else if (name == 'chart5') {  //卡券偏好
      findCouponPreferenceList(getInitTimes);
    } else if (name == 'chart6') {  //活动偏好
      findActivityPreferenceList(type);
    } else if (name == 'chart8') {  //用户活跃时间段分布
      findUserActivePeriodList(type);
    }
    setTimeArr([...toTimeArr])
  };
  let changeType2 = (type, name) => {
    let toTypeAll = typeAll;
    toTypeAll[name] = type.target.value;
    if (toTypeAll.chart1 == 1) {
      typeAll = toTypeAll;
      findCustomerDataList(type.target.value, getInitTime1());
    } else if (toTypeAll.chart1 == 2) {
      typeAll = toTypeAll;
      findCustomerDataList(type.target.value, getInitTime2());
    } else {
      if (toTypeAll.chartTime1) {
        typeAll = toTypeAll;
        let toTimes = [];
        toTimes.push(moment(toTypeAll.chartTime1[0]).format('YYYY-MM-DD'));
        toTimes.push(moment(toTypeAll.chartTime1[1]).format('YYYY-MM-DD'));
        findCustomerDataList(type.target.value, toTimes);
      } else {
        message.error("请选择日期！")
      }
    }

  };
  let changeType3 = (type, name1, name2) => {
    console.log(type)
    let toTypeAll = typeAll;
    toTypeAll[name1] = type;
    toTypeAll[name2] = 3;
    typeAll = { ...toTypeAll };
    let toTimeArr = timeArr;
    if (name1 == 'chartTime1') {  //数量统计
      toTimeArr[0] = type;
    } else if (name1 == 'chartTime2') {  //转化率分析
      toTimeArr[1] = type;
    } else if (name1 == 'chartTime3') {  //用户活跃度结构
      toTimeArr[2] = type;
    }
    setTimeArr([...toTimeArr])
    if (type) {
      let toTimes = [];
      toTimes.push(moment(type[0]).format('YYYY-MM-DD'));
      toTimes.push(moment(type[1]).format('YYYY-MM-DD'));
      if (name1 == 'chartTime1') {  //数量统计
        findCustomerDataList(typeAll.chart2, toTimes);
      } else if (name1 == 'chartTime2') {  //转化率分析
        findUserConversionAnalysisList(toTimes);
      } else if (name1 == 'chartTime3') {  //用户活跃度结构
        findUserActivityAnalysisList(toTimes);
      }
    }
  }


  useEffect(() => {
    findUserPortraiListTotalList();
    findCustomerDataList(typeAll.chart2, getInitTime2());
    findUserConversionAnalysisList(getInitTime2());
    findUserActivityAnalysisList(getInitTime2());
    findSourcePersonList(getInitTime3());
    findSexPersonList();
    findTop10CityList();
    findTop10ProvinceList();
    findAgePersonList();
    findCouponPreferenceList(getInitTime3());
    findActivityPreferenceList(1);
    findUserActivePeriodList(1);

    let toTimeArr = timeArr;
    toTimeArr[0] = [moment(getInitTime2()[0]), moment(getInitTime2()[1])];
    toTimeArr[1] = [moment(getInitTime2()[0]), moment(getInitTime2()[1])];
    toTimeArr[2] = [moment(getInitTime2()[0]), moment(getInitTime2()[1])];
    setTimeArr([...toTimeArr])
  }, []);

  //总统计
  let findUserPortraiListTotalList = () => {
    dispatch({
      type: 'userPortrait/findUserPortraiListTotalList',
      payload: {
        method: 'postJSON',
        params: {}
      },
      callback: (res) => {
        setDataInfo({ ...res.body })
      }
    })
  }
  //用户数量统计
  let findCustomerDataList = (type, time) => {
    dispatch({
      type: 'userPortrait/findCustomerDataList',
      payload: {
        method: 'postJSON',
        params: {
          statisticsType: type,
          startTime: time[0],
          endTime: time[1]
        }
      },
      callback: (res) => {
        if (res.body) {
          let registeredUsersNums = res.body.registeredUsersNums ? res.body.registeredUsersNums.map((e) => { e.title = "注册用户数"; return e }) : [];
          let usersConcernedNums = res.body.usersConcernedNums ? res.body.usersConcernedNums.map((e) => { e.title = "关注用户数"; return e }) : [];
          let accessUsersNums = res.body.accessUsersNums ? res.body.accessUsersNums.map((e) => { e.title = "邀请用户数"; return e }) : [];
          let invitedUsersNums = res.body.invitedUsersNums ? res.body.invitedUsersNums.map((e) => { e.title = "访问用户数"; return e }) : [];
          let authorizedUsersNums = res.body.authorizedUsersNums ? res.body.authorizedUsersNums.map((e) => { e.title = "享权用户数"; return e }) : [];
          let allUsersNums = registeredUsersNums.concat(usersConcernedNums).concat(accessUsersNums).concat(invitedUsersNums).concat(authorizedUsersNums);
          setDataChart1([...allUsersNums]);
        } else {
          setDataChart1([...[]]);
        }
      }
    })
  }
  //转化率分析
  let findUserConversionAnalysisList = (time) => {
    dispatch({
      type: 'userPortrait/findUserConversionAnalysisList',
      payload: {
        method: 'postJSON',
        params: {
          startTime: time[0],
          endTime: time[1]
        }
      },
      callback: (res) => {
        let toDataChart2 = [
          {
            stage: 'PV',
            number: 0,
          },
          {
            stage: 'UV',
            number: 0,
          },
          {
            stage: '点击人数',
            number: 0,
          },
          {
            stage: '享权人数',
            number: 0,
          },
          {
            stage: '转发人数',
            number: 0,
          }
        ];
        if (res.body) {
          toDataChart2[0].number = res.body.pvNums ? res.body.pvNums : 0;
          toDataChart2[1].number = res.body.uvNums ? res.body.uvNums : 0;
          toDataChart2[2].number = res.body.clickNums ? res.body.clickNums : 0;
          toDataChart2[3].number = res.body.entitlementNums ? res.body.entitlementNums : 0;
          toDataChart2[4].number = res.body.forwardNums ? res.body.forwardNums : 0;
          setDataChart2([...toDataChart2]);
        } else {
          setDataChart2([...toDataChart2]);
        }
      }
    })
  }
  //用户活跃度
  let findUserActivityAnalysisList = (time) => {
    dispatch({
      type: 'userPortrait/findUserActivityAnalysisList',
      payload: {
        method: 'postJSON',
        params: {
          startTime: time[0],
          endTime: time[1]
        }
      },
      callback: (res) => {
        if (res.body && res.body.length > 0) {
          let toDataChart3 = [];
          res.body.forEach(el => {
            for (var j in el) {
              if (j == 'pvNums') {  //活跃用户
                toDataChart3.push({
                  category: "活跃用户",
                  year: moment(el.statisticsDays).format('YYYY-MM-DD'),
                  value: el[j]
                })
              }
              if (j == 'uvNums') {  //普通用户
                toDataChart3.push({
                  category: "普通用户",
                  year: moment(el.statisticsDays).format('YYYY-MM-DD'),
                  value: el[j]
                })
              }
              if (j == 'clickNums') {  //僵尸用户
                toDataChart3.push({
                  category: "僵尸用户",
                  year: moment(el.statisticsDays).format('YYYY-MM-DD'),
                  value: el[j]
                })
              }
            }
          });
          setDataChart3([...toDataChart3]);
        } else {
          setDataChart3([...[]]);
        }
      }
    })
  }

  //用户来源统计
  let findSourcePersonList = (time) => {
    dispatch({
      type: 'userPortrait/findSourcePersonList',
      payload: {
        method: 'postJSON',
        params: {
          startTime: time[0],
          endTime: time[1]
        }
      },
      callback: (res) => {
        if (res.body && res.body.length > 0) {
          setDataChart7([...res.body]);
        } else {
          setDataChart7([...[]]);
        }
      }
    })
  }

  //用户性别分布
  let findSexPersonList = () => {
    dispatch({
      type: 'userPortrait/findSexPersonList',
      payload: {
        method: 'postJSON',
        params: {}
      },
      callback: (res) => {
        if (res.body && res.body.length > 0) {
          setDataChart9([...res.body]);
        } else {
          setDataChart9([...[]]);
        }
      }
    })
  }
  //Top10城市
  let findTop10CityList = () => {
    dispatch({
      type: 'userPortrait/findTop10CityList',
      payload: {
        method: 'postJSON',
        params: {}
      },
      callback: (res) => {
        if (res.body && res.body.length > 0) {
          setDataChart11([...res.body]);
        } else {
          setDataChart11([...[]]);
        }
      }
    })
  }
  //Top10省份
  let findTop10ProvinceList = () => {
    dispatch({
      type: 'userPortrait/findTop10ProvinceList',
      payload: {
        method: 'postJSON',
        params: {}
      },
      callback: (res) => {
        if (res.body && res.body.length > 0) {
          setDataChart12([...res.body]);
        } else {
          setDataChart12([...[]]);
        }
      }
    })
  }
  //用户年龄分析
  let findAgePersonList = () => {
    dispatch({
      type: 'userPortrait/findAgePersonList',
      payload: {
        method: 'postJSON',
        params: {}
      },
      callback: (res) => {
        if (res.body && res.body.length > 0) {
          setDataChart10([...res.body]);
        } else {
          setDataChart10([...[]]);
        }
      }
    })
  }

  //卡券偏好
  let findCouponPreferenceList = (time) => {
    dispatch({
      type: 'userPortrait/findCouponPreferenceList',
      payload: {
        method: 'postJSON',
        params: {
          startTime: time[0],
          endTime: time[1]
        }
      },
      callback: (res) => {
        if (res.body && res.body.length > 0) {
          setDataChart5([...res.body]);
        } else {
          setDataChart5([...[]]);
        }
      }
    })
  }
  //活动偏好
  let findActivityPreferenceList = (type) => {
    dispatch({
      type: 'userPortrait/findActivityPreferenceList',
      payload: {
        method: 'post',
        params: {
          statisticsType: type
        }
      },
      callback: (res) => {
        if (res.body && res.body.length > 0) {
          setDataChart6([...res.body]);
        } else {
          setDataChart6([...[]]);
        }
      }
    })
  }
  //用户活跃时间段
  let findUserActivePeriodList = (type) => {
    dispatch({
      type: 'userPortrait/findUserActivePeriodList',
      payload: {
        method: 'post',
        params: {
          statisticsType: type
        }
      },
      callback: (res) => {
        if (res.body && res.body.length > 0) {
          setDataChart8([...res.body]);
        } else {
          setDataChart8([...[]]);
        }
      }
    })
  }



  return (
    <>
      <div className={`${style.content} ${style.wrap1}`}>
        <div className={style.wrap1_li}>
          <div className={style.wrap1_li_lf}><img src={require('../../../assets/data/um1.png')} ></img></div>
          <div className={style.wrap1_li_rg}><span>累计注册用户</span><p>{parseToThousandth(parseFloat(dataInfo.registeredUsersNums))}</p></div>
        </div>
        <div className={style.wrap1_li}>
          <div className={style.wrap1_li_lf}><img src={require('../../../assets/data/um2.png')} ></img></div>
          <div className={style.wrap1_li_rg}><span>累计关注用户</span><p>{parseToThousandth(parseFloat(dataInfo.usersConcernedNums))}</p></div>
        </div>
        <div className={style.wrap1_li}>
          <div className={style.wrap1_li_lf}><img src={require('../../../assets/data/um3.png')} ></img></div>
          <div className={style.wrap1_li_rg}><span>累计访问用户</span><p>{parseToThousandth(parseFloat(dataInfo.invitedUsersNums))}</p></div>
        </div>
        <div className={style.wrap1_li}>
          <div className={style.wrap1_li_lf}><img src={require('../../../assets/data/um4.png')} ></img></div>
          <div className={style.wrap1_li_rg}><span>累计享权用户</span><p>{parseToThousandth(parseFloat(dataInfo.authorizedUsersNums))}</p></div>
        </div>
        {/* <div className={style.wrap1_li}>
          <div className={style.wrap1_li_lf}><img src={require('../../../assets/data/um5.png')} ></img></div>
          <div className={style.wrap1_li_rg}><span>当前注册用户</span><p>1239000</p></div>
        </div>
        <div className={style.wrap1_li}>
          <div className={style.wrap1_li_lf}><img src={require('../../../assets/data/um6.png')} ></img></div>
          <div className={style.wrap1_li_rg}><span>当前关注用户</span><p>1239000</p></div>
        </div> */}
      </div>

      <div className={`${style.content} ${style.wrap2}`}>
        <div className={style.wrap_h1}>
          <span className={style.wrap_h1_name}>用户数量统计</span>
          <div className={style.wrap_h1_choice}>
            <i className={typeAll.chart1 == 1 ? style.wrap_h1_bull : null} onClick={() => { changeType('chart1', 1) }}>最近7日</i>
            <i className={typeAll.chart1 == 2 ? style.wrap_h1_bull : null} onClick={() => { changeType('chart1', 2) }}>最近30日</i>
            <RangePicker className={style.wrap_h1_item} format="YYYY-MM-DD" value={timeArr[0]} onChange={(e) => { changeType3(e, 'chartTime1', 'chart1') }} />
          </div>
        </div>
        <div className={style.wrap2_by}>
          <div className={style.wrap2_by_radio}>
            <Radio.Group value={typeAll.chart2} onChange={(e) => { changeType2(e, 'chart2') }}>
              <Radio.Button value={2}>累计</Radio.Button>
              <Radio.Button value={1}>当期</Radio.Button>
            </Radio.Group>
          </div>
          <div className={style.wrap_by_notes}>人数（人）</div>
          <div className={style.wrap2_by_charts}>
            <Line {...configChart1} />
          </div>
        </div>
      </div>

      <Row className={style.wrap3}>
        <Col flex="1 1 480px" className={`${style.content} ${style.wrap4}`}>
          <div className={style.wrap_h1}>
            <span className={style.wrap_h1_name}>转化率分析</span>
            <div className={style.wrap_h1_choice}>
              <i className={typeAll.chart3 == 1 ? style.wrap_h1_bull : null} onClick={() => { changeType('chart3', 1) }}>最近7日</i>
              <i className={typeAll.chart3 == 2 ? style.wrap_h1_bull : null} onClick={() => { changeType('chart3', 2) }}>最近30日</i>
              <RangePicker className={style.wrap_h1_item} value={timeArr[1]} onChange={(e) => { changeType3(e, 'chartTime2', 'chart3') }} />
            </div>
          </div>
          <div className={style.wrap4_by}>
            <Funnel {...configChart2} className={style.wrap4_by_hg} />
          </div>

        </Col>
        <Col flex="1 1 480px" className={`${style.content} ${style.wrap5}`}>
          <div className={style.wrap_h1}>
            <span className={style.wrap_h1_name}>用户活跃度分析</span>
            <div className={style.wrap_h1_choice}>
              <i className={typeAll.chart4 == 1 ? style.wrap_h1_bull : null} onClick={() => { changeType('chart4', 1) }}>最近7日</i>
              <i className={typeAll.chart4 == 2 ? style.wrap_h1_bull : null} onClick={() => { changeType('chart4', 2) }}>最近30日</i>
              <RangePicker className={style.wrap_h1_item} value={timeArr[2]} onChange={(e) => { changeType3(e, 'chartTime3', 'chart4') }} />
            </div>
          </div>
          <div className={style.wrap5_by}>
            <div className={style.wrap_by_notes}>人数（人）</div>
            <Column {...configChart3} />
          </div>
        </Col>
      </Row>

      {/* <div className={`${style.content} ${style.wrap6}`}>
        <div className={style.wrap_h1}>
          <span className={style.wrap_h1_name}>用户价值分析</span>
          <span className={style.wrap_h1_echo}>该统计来源近一年的用户数据分析</span>
        </div>
        <div className={style.wrap6_by}>
          <div className={style.wrap6_cost}>
            <div className={style.wrap6_cost_lf}>
              <em>高</em>
              <i className={style.wrap6_cost_ro1}><img src={require('../../../assets/data/um_j5.png')} ></img></i>
              <span>价值</span>
              <i className={style.wrap6_cost_ro2}><img src={require('../../../assets/data/um_j5.png')} ></img></i>
              <em>低</em>
            </div>
            <div className={style.wrap6_cost_rg}>
              <div className={style.wrap6_cost_rbox}>
                <div className={`${style.wrap6_cost_rli} ${style.wrap6_cost_rli1}`}>
                  <span className={style.wrap6_cost_i1}><img src={require('../../../assets/data/um_j1.png')} ></img></span>
                  <div className={style.wrap6_cost_i2}>
                    <p className={style.wrap6_cost_i3}><em>潜力用户</em><InfoCircleOutlined /></p>
                    <p className={style.wrap6_cost_i4}>121,000人</p>
                  </div>
                </div>
                <div className={`${style.wrap6_cost_rli} ${style.wrap6_cost_rli2}`}>
                  <span className={style.wrap6_cost_i1}><img src={require('../../../assets/data/um_j2.png')} ></img></span>
                  <div className={style.wrap6_cost_i2}>
                    <p className={style.wrap6_cost_i3}><em>优质用户</em><InfoCircleOutlined /></p>
                    <p className={style.wrap6_cost_i4}>121,000人</p>
                  </div>
                </div>
                <div className={`${style.wrap6_cost_rli} ${style.wrap6_cost_rli3}`}>
                  <span className={style.wrap6_cost_i1}><img src={require('../../../assets/data/um_j3.png')} ></img></span>
                  <div className={style.wrap6_cost_i2}>
                    <p className={style.wrap6_cost_i3}><em>低质用户</em><InfoCircleOutlined /></p>
                    <p className={style.wrap6_cost_i4}>121,000人</p>
                  </div>
                </div>
                <div className={`${style.wrap6_cost_rli} ${style.wrap6_cost_rli4}`}>
                  <span className={style.wrap6_cost_i1}><img src={require('../../../assets/data/um_j4.png')} ></img></span>
                  <div className={style.wrap6_cost_i2}>
                    <p className={style.wrap6_cost_i3}><em>忠诚用户</em><InfoCircleOutlined /></p>
                    <p className={style.wrap6_cost_i4}>121,000人</p>
                  </div>
                </div>
              </div>
              <div className={style.wrap6_cost_rbom}>
                <em>低</em>
                <i className={style.wrap6_cost_ro1}><img src={require('../../../assets/data/um_j5.png')} ></img></i>
                <span>活跃度</span>
                <i className={style.wrap6_cost_ro2}><img src={require('../../../assets/data/um_j5.png')} ></img></i>
                <em>高</em>
              </div>
            </div>
          </div>
          <div className={style.wrap6_charts}>
            <div className={style.wrap_by_notes}>人数（人）</div>
            <Area {...configChart4} className={style.wrap6_charts_hg} />
          </div>
        </div>
      </div> */}

      <Row className={style.wrap3}>
        <Col flex="1 1 480px" className={`${style.content} ${style.wrap4}`}>
          <div className={style.wrap_h1}>
            <span className={style.wrap_h1_name}>卡券偏好</span>
            <div className={`${style.wrap_h1_choice} ${style.wrap_h1_choice2}`}>
              <i className={typeAll.chart5 == 1 ? style.wrap_h1_bull : null} onClick={() => { changeType('chart5', 1) }}>最近6个月</i>
              <i className={typeAll.chart5 == 2 ? style.wrap_h1_bull : null} onClick={() => { changeType('chart5', 2) }}>最近12个月</i>
            </div>
          </div>
          <div className={style.wrap7_by}>
            <div className={style.wrap7_charts}>
              <Radar {...configChart5} />
            </div>
            <div className={style.wrap7_table}>
              <Table scroll={{ x: 400,y: 345 }} columns={columns1()} dataSource={dataChart5} locale={{ emptyText: '暂无数据' }} pagination={false} />
            </div>
          </div>

        </Col>
        <Col flex="1 1 480px" className={`${style.content} ${style.wrap5}`}>
          <div className={style.wrap_h1}>
            <span className={style.wrap_h1_name}>活动偏好</span>
            <div className={`${style.wrap_h1_choice} ${style.wrap_h1_choice2}`}>
              <i className={typeAll.chart6 == 1 ? style.wrap_h1_bull : null} onClick={() => { changeType('chart6', 1) }}>最近6个月</i>
              <i className={typeAll.chart6 == 2 ? style.wrap_h1_bull : null} onClick={() => { changeType('chart6', 2) }}>最近12个月</i>
            </div>
          </div>
          <div className={style.wrap7_by}>
            <div className={style.wrap7_charts}>
              <Radar {...configChart6} />
            </div>
            <div className={style.wrap7_table}>
              <Table scroll={{ x: 400,y: 345 }} columns={columns2()} dataSource={dataChart6} locale={{ emptyText: '暂无数据' }} pagination={false} />
            </div>
          </div>
        </Col>
      </Row>

      <Row className={style.wrap3}>
        <Col flex="1 1 480px" className={`${style.content} ${style.wrap4}`}>
          <div className={style.wrap_h1}>
            <span className={style.wrap_h1_name}>用户来源统计</span>
            <div className={`${style.wrap_h1_choice} ${style.wrap_h1_choice2}`}>
              <i className={typeAll.chart7 == 1 ? style.wrap_h1_bull : null} onClick={() => { changeType('chart7', 1) }}>最近6个月</i>
              <i className={typeAll.chart7 == 2 ? style.wrap_h1_bull : null} onClick={() => { changeType('chart7', 2) }}>最近12个月</i>
            </div>
          </div>
          <div className={style.wrap8_by}>
            <Pie {...configChart7} />
          </div>

        </Col>
        <Col flex="1 1 480px" className={`${style.content} ${style.wrap5}`}>
          <div className={style.wrap_h1}>
            <span className={style.wrap_h1_name}>用户活跃时间段分布</span>
            <div className={`${style.wrap_h1_choice} ${style.wrap_h1_choice2}`}>
              <i className={typeAll.chart8 == 1 ? style.wrap_h1_bull : null} onClick={() => { changeType('chart8', 1) }}>最近6个月</i>
              <i className={typeAll.chart8 == 2 ? style.wrap_h1_bull : null} onClick={() => { changeType('chart8', 2) }}>最近12个月</i>
            </div>
          </div>
          <div className={style.wrap9_by}>
            <div className={style.wrap_by_notes}>活跃（次）</div>
            <Column {...configChart8} />
          </div>
        </Col>
      </Row>

      <Row className={style.wrap3}>
        <Col flex="1 1 480px" className={`${style.content} ${style.wrap4}`}>
          <div className={style.wrap_h1}>
            <span className={style.wrap_h1_name}>用户性别分布</span>
          </div>
          <div className={style.wrap8_by}>
            <Pie {...configChart9} />
          </div>

        </Col>
        <Col flex="1 1 480px" className={`${style.content} ${style.wrap5}`}>
          <div className={style.wrap_h1}>
            <span className={style.wrap_h1_name}>用户年龄分布</span>
          </div>
          <div className={style.wrap9_by}>
            <div className={style.wrap_by_notes}>人数（人）</div>
            <Column {...configChart10} />
          </div>
        </Col>
      </Row>

      <Row className={style.wrap3}>
        <Col flex="1 1 480px" className={`${style.content} ${style.wrap4}`}>
          <div className={style.wrap_h1}>
            <span className={style.wrap_h1_name}>TOP 10城市排名</span>
          </div>
          <div className={style.wrap10_by}>
            <Bar {...configChart11} />
          </div>

        </Col>
        <Col flex="1 1 480px" className={`${style.content} ${style.wrap5}`}>
          <div className={style.wrap_h1}>
            <span className={style.wrap_h1_name}>TOP 10省份排名</span>
          </div>
          <div className={style.wrap10_by}>
            <Bar {...configChart12} />
          </div>
        </Col>
      </Row>

    </>
  )
}
export default connect(({ }) => ({

}))(userPortraitPage);