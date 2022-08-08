import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Table, Select, Row, Space, Button, DatePicker, Radio, Tooltip, Timeline } from "antd";
import style from "./style.less";
import moment from 'moment';
import { DownloadOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
const { Option } = Select;
const { RangePicker } = DatePicker;

// 行为信息
const behaviorInfo = (props) => {
  let { dispatch, relationUserId, behaviorTotals, behaviors, behaviorsTimesArr, pointsObj, behaviorPointArr, behaviorsPointTimeArr } = props;
  let [form] = Form.useForm();

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [payload, setPayload] = useState({});

  const [showBehaviorMore, setShowBehaviorMore] = useState(false);//加载更多1
  const [showPointMore, setShowPointMore] = useState(false);//加载更多2

  const [showBehaviorTimeMore, setShowBehaviorTimeMore] = useState(false);//加载更多3
  const [showPointTimeMore, setShowPointTimeMore] = useState(false);//加载更多4


  const [pageInfo, setPageInfo] = useState({
    pageNo: 1,
    pageSize: 10,
    totalCount: null,
    totalPage: null
  });//分页信息
  const [pagePointInfo, setPagePointInfo] = useState({
    pageNo: 1,
    pageSize: 10,
    totalCount: null,
    totalPage: null
  });//分页信息
  const [pageTimeInfo, setPageTimeInfo] = useState({
    pageNo: 1,
    pageSize: 2,
    totalCount: null,
    totalPage: null
  });//分页信息
  const [pagePointTimeInfo, setPagePointTimeInfo] = useState({
    pageNo: 1,
    pageSize: 10,
    totalCount: null,
    totalPage: null
  });//分页信息

  useEffect(() => {
    getSaleBehaviors()//1
    getPointsStatistics()//3
    getPointsBehaviors()
  }, [])

  // 1销售行为记录
  const getSaleBehaviors = (type) => {
    dispatch({
      type: 'salesManageModel/getSaleBehaviors',
      payload: {
        method: 'get',
        params: {
          pageNo: pageInfo.pageNo,//current,
          pageSize: pageInfo.pageSize,
          userId: relationUserId,//销售id
        }
      },
      callback: (res) => {
        let dataList = behaviors.concat(res.body.data.behaviors)
        if (res.result.code === '0') {
          res.body.data.behaviors && res.body.data.behaviors.forEach(item => {
            item.isShow = false
          })
          if (type === 'more') {
            if (res.body.data.behaviors.length > 0) {
              let dataList = behaviors.concat(res.body.data.behaviors)

              dispatch({
                type: 'salesManageModel/setSaleBehaviors',
                payload: {
                  behaviors: dataList,
                  behaviorTotals: res.body.data.behaviorTotals
                }
              })
            } else {
              setShowBehaviorMore(false)
            }
          } else {

            dispatch({
              type: 'salesManageModel/setSaleBehaviors',
              payload: {
                behaviors: dataList,
                behaviorTotals: res.body.data.behaviorTotals
              }
            })
          }
          res.body.pageInfo.totalPage == pageInfo.pageNo ? setShowBehaviorMore(false) : setShowBehaviorMore(true)
          // setBehaviorTotals(res.body.data.behaviorTotals)
          dispatch({
            type: 'salesManageModel/setSaleBehaviors',
            payload: {
              behaviors: dataList,
              behaviorTotals: res.body.data.behaviorTotals
            }
          })
        } else {
          message.error(res.result.message)
        }
      }
    });
  }

  /* 加载更多数据1 */
  let addBehaviorMore = () => {
    // behaviorsData.pageInfo.pageNo = behaviorsData.pageInfo.pageNo + 1;
    // setBehaviorsData(JSON.parse(JSON.stringify(behaviorsData)));
    pageInfo.pageNo += 1;
    setPageInfo(pageInfo);
    getSaleBehaviors('more')
  }

  // 点击展开
  let openList = (times, isShow, index) => {
    getSaleBehaviorsByTimes(times, isShow, index);
  }

  /* 加载更多数据3详情 */
  let addBehaviorTimeMore = (times, isShow, index) => {
    // pageTimeInfo.pageNo += 1;
    // setPageTimeInfo(pageTimeInfo);
    // getSaleBehaviorsByTimes(times, isShow, index, 'more')
  }

  /* 加载更多数据4详情 */
  let addPointTimeMore = () => {
    // pagePointTimeInfo.pageNo += 1;
    // setPageTimeInfo(pagePointTimeInfo);
    // getPointsBehaviorsByBehaviorTime(times, isShow, index, 'more')
  }
  let [arr, setArr] = useState([]);
  //2销售行为记录-时间
  const getSaleBehaviorsByTimes = (times, isShow, index, type) => {
    dispatch({
      type: 'salesManageModel/getSaleBehaviorsByTimes',
      payload: {
        method: 'get',
        params: {
          pageNo: 1,
          pageSize: 100,
          userId: relationUserId,//销售id
          behaviorTimes: times
        }
      },
      callback: (res) => {
        // let data = JSON.parse(JSON.stringify(behaviors));
        // data[index].list = res.body;
        // data[index].isShow = isShow;
        // let dataListDal = data[index].list.concat(res.body);

        if (res.result.code === '0') {
          let data = JSON.parse(JSON.stringify(behaviors))
          data[index].list = res.body;
          data[index].isShow = isShow;

          dispatch({
            type: 'salesManageModel/setSaleBehaviors',
            payload: {
              behaviors: data,
              behaviorTotals: behaviorTotals
            }
          })

          // if (type === 'more') {
          //   let data = JSON.parse(JSON.stringify(behaviors))
          //   data[index].list = res.body;
          //   data[index].isShow = isShow;
          //   dispatch({
          //     type: 'salesManageModel/setSaleBehaviors',
          //     payload: {
          //       behaviors: data,
          //       behaviorTotals: behaviorTotals
          //     }
          //   })

          //   if (res.body.length > 0) {
          //     let dataListDal = data[index].list.concat(res.body);

          //     console.log(data, 'data')
          //     console.log(dataListDal, 'dataListDal')
          //     dispatch({
          //       type: 'salesManageModel/setSaleBehaviors',
          //       payload: {
          //         behaviors: data,
          //         behaviorTotals: behaviorTotals
          //       }
          //     })
          //     dispatch({
          //       type: 'salesManageModel/setSaleBehaviorsByTimes',
          //       payload: data[index].list
          //     })
          //   } else {
          //     setShowBehaviorTimeMore(false)
          //   }
          // } else {
          //   dispatch({
          //     type: 'salesManageModel/setSaleBehaviors',
          //     payload: {
          //       behaviors: data,
          //       behaviorTotals: behaviorTotals
          //     }
          //   })
          //   dispatch({
          //     type: 'salesManageModel/setSaleBehaviorsByTimes',
          //     payload: data[index].list
          //   })
          // }
          // res.body.length == 2 ? setShowBehaviorTimeMore(true) : setShowBehaviorTimeMore(false)//

        } else {
          message.error(res.result.message)
        }
      }
    });
  }

  // 3销售积分统计(头)
  const getPointsStatistics = () => {
    dispatch({
      type: 'salesManageModel/getPointsStatistics',
      payload: {
        method: 'get',
        params: {
          userId: relationUserId,//销售id
          userType: 3
        }
      }
    });
  }

  /* 加载更多数据2 */
  let addPointMore = () => {
    pagePointInfo.pageNo += 1;
    setPagePointInfo(pagePointInfo);
    getPointsBehaviors('more')
  }

  //4销售积分明细统计
  const getPointsBehaviors = (type) => {
    dispatch({
      type: 'salesManageModel/getPointsBehaviors',
      payload: {
        method: 'get',
        params: {
          pageNo: 1,
          pageSize: 10,
          userId: relationUserId,//销售id
          userType: 3
        }
      },
      callback: (res) => {
        let dataList = behaviorPointArr.concat(res.body);
        if (res.result.code === '0') {
          res.body.forEach(item => {
            item.isShow = false;
          })
          if (type === 'more') {
            if (res.body.length > 0) {
              let dataList = behaviorPointArr.concat(res.body);
              dispatch({
                type: 'salesManageModel/setPointsBehaviors',
                payload: dataList
              })
            } else {
              setShowPointMore(false)
            }
          } else {
            dispatch({
              type: 'salesManageModel/setPointsBehaviors',
              payload: res.body
            })
          }
          res.body.length == 10 ? setShowPointMore(true) : setShowPointMore(false)
          // setBehaviorTotals(res.body.behaviorTotals)
        } else {
          message.error(res.result.message)
        }
      }
    });
  }

  // 积分点击展开
  const openPointsList = (times, isShow, index) => {
    getPointsBehaviorsByBehaviorTime(times, isShow, index);
  }

  //5销售积分明细统计-时间
  const getPointsBehaviorsByBehaviorTime = (times, isShow, index) => {
    dispatch({
      type: 'salesManageModel/getPointsBehaviorsByBehaviorTime',
      payload: {
        method: 'get',
        params: {
          pageNo: 1,
          pageSize: 100,
          userId: relationUserId,//销售id
          userType: 3,
          behaviorTimes: times
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let data = JSON.parse(JSON.stringify(behaviorPointArr));
          data[index].list = res.body;
          data[index].isShow = isShow;
          // console.log(data, 'data')

          dispatch({
            type: 'salesManageModel/setPointsBehaviors',
            payload: data
          })
        } else {
          message.error(res.result.message)
        }
      }
    });
  }

  // tab切换
  let [tab1, settab1] = useState('1');
  let onChange1 = (e) => {
    settab1(e.target.value)
  }

  return (
    <>
      <div className={style.behaviorInfoPage}>
        <div className={style.chooseTop}>
          <div>
            <Radio.Group onChange={onChange1} defaultValue="1">
              <Radio.Button style={{ margin: '10px' }} value="1">行为记录</Radio.Button>
              <Radio.Button style={{ margin: '10px' }} value="2">积分明细</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div className={style.behaviorBottom}>
          {
            tab1 == '1' ?
              <div className={style.chart_content}>
                <div className={style.chart_title}>总活跃度 <span style={{ fontSize: '20px' }}>{behaviorTotals}</span> 次</div>
                {
                  behaviors && behaviors.map((item, index) => {
                    return <div className={style.steps_content}>
                      <div className={style.step_part}>
                        <div className={style.left_part}>{item.days}</div>
                        <div className={style.middle_line}>
                        </div>
                        <div className={style.dot}></div>

                        <div className={style.right_part}>
                          <div>
                            <span className={style.part_title}>活跃度{item.count}次</span>
                            {!item.isShow ? <DownOutlined onClick={() => { openList(item.days, !item.isShow, index) }} /> : <UpOutlined onClick={() => { openList(item.days, !item.isShow, index) }} />}
                          </div>

                          {/* 详情 */}
                          <ul className={item.isShow ? style.show_block : style.hiddle_block}>
                            {
                              item.list ?
                                item.list.map((listItem) => {
                                  return <li>
                                    {listItem.times} {listItem.behaviorName}
                                    <span style={{ float: 'right', marginLeft: '20px' }}>x{listItem.count}</span>
                                  </li>
                                })
                                :
                                null
                            }
                            {showBehaviorTimeMore ? <div className={style.add_more} onClick={() => { addBehaviorTimeMore(item.days, item.isShow, index) }}>加载更多...</div> : null}
                          </ul>

                        </div>

                      </div>
                    </div>
                  })
                }
                {showBehaviorMore ? <div className={style.add_more} onClick={() => { addBehaviorMore() }}> 加载更多...</div> : null}
              </div>
              :
              <div className={style.chart_content}>
                <div className={style.chart_title}>剩余积分 <span style={{ fontSize: '20px' }}>{pointsObj.availablePoints}</span> 次</div>
                <div className={style.chart_title}>累计收入积分 <span style={{ fontSize: '20px' }}>{pointsObj.totalPoints}</span> 次</div>
                <div className={style.chart_title}>累计支出积分 <span style={{ fontSize: '20px' }}>{pointsObj.usedPoints}</span> 次</div>

                {
                  behaviorPointArr && behaviorPointArr.map((item, index) => {
                    return <div className={style.steps_content}>
                      <div className={style.step_part}>
                        <div className={style.left_part}>{item.days}</div>
                        <div className={style.middle_line}>
                        </div>
                        <div className={style.dot}></div>

                        <div className={style.right_part}>
                          <div>
                            <span className={style.part_title}>获取积分{item.addPoints}分</span>
                            <span className={style.part_title}>支出积分{item.subPoints}分</span>

                            {!item.isShow ? <DownOutlined onClick={() => { openPointsList(item.days, !item.isShow, index) }} /> : <UpOutlined onClick={() => { openPointsList(item.days, !item.isShow, index) }} />}
                          </div>

                          {/* 详情 */}
                          <ul className={item.isShow ? style.show_block : style.hiddle_block}>
                            {
                              item.list ?
                                item.list.map((listItem) => {
                                  return <li>{listItem.times} {listItem.behaviorName}<span style={{ float: 'right', marginLeft: '20px' }}>x{listItem.changePoints}</span></li>
                                })
                                :
                                null
                            }
                            {showPointTimeMore ? <div className={style.add_more} onClick={() => { addPointTimeMore() }}>加载更多...</div> : null}

                          </ul>
                        </div>

                      </div>
                    </div>
                  })
                }
                {showPointMore ? <div className={style.add_more} onClick={() => { addPointMore() }}> 加载更多...</div> : null}
              </div>
          }
        </div>


      </div>
    </>
  )
}

export default connect(({ salesManageModel }) => ({
  behaviorTotals: salesManageModel.behaviorTotals,
  behaviors: salesManageModel.behaviors,
  behaviorsTimesArr: salesManageModel.behaviorsTimesArr,
  pointsObj: salesManageModel.pointsObj,
  behaviorPointArr: salesManageModel.behaviorPointArr,
  behaviorsPointTimeArr: salesManageModel.behaviorsPointTimeArr,
}))(behaviorInfo)