import React, { useEffect, useState, } from "react"
import { connect, history } from 'umi'
import {
  Row,
  Col,
  Form,
  Radio,
  Input,
  Table,
  Modal,
  Button,
  Select,
  InputNumber,
  Tooltip,
  message
} from "antd"
import { InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import style from "./style.less"
import UserList from '../components/userList';   //用户信息
import SelectPrize from '../components/selectPrize';   //奖品
import RichText from "@/pages/basicCard/richText";  //富文本框
const { Option } = Select
let taskDetailstPage = (props) => {
  let { dispatch, classifyList, channelList, location } = props;
  let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));   //基础配置信息
  let [taskIds, setTaskIds] = useState(location.state && location.state.objectId || '');  //编辑带来的id 没有代表新建
  let [isTaskStatus, seTisTaskStatus] = useState(location.state && location.state.type == 1 ? true : false);  //是否开启
  let [infoArr, setInfoArr] = useState({   //基础表单信息
    channelId: String(tokenObj.channelId),
    taskName: '',
    taskDescribe: '',
    taskSortList: [],
    taskEvent: null,
    cyclePeriod: null,
    num: "",
    jumpLink: "",
    buttonCopy: '',
    informationType: 1,
  })
  //选中用户信息
  let [userDataConfigVOList, setUserDataConfigVOList] = useState([]);
  let changeUserDataConfigVOList = (e) => {
    setUserDataConfigVOList([...e])
  }
  //表单change事件
  let changeSele = (name, e) => {
    let toinfoArr = { ...infoArr };
    if (name == 'taskEvent') {
      toinfoArr.cyclePeriod = '';
      toinfoArr.num = '';
      toinfoArr.jumpLink = '';
      toinfoArr.buttonCopy = '';
      setUserDataConfigVOList([...[]]);
      setPrizeList([...[]]);
    }
    toinfoArr[name] = e;
    setInfoArr(toinfoArr);
  }
  let changeName = (name, e) => {
    let toinfoArr = { ...infoArr };
    toinfoArr[name] = e.target.value;
    setInfoArr(toinfoArr);
  }
  /*富文本编辑器*/
  let [taskDescribe, setTaskDescribe] = useState("");
  let onTextChange = (value) => {
    console.log(value)
    // let toinfoArr = { ...infoArr };
    // toinfoArr.taskDescribe = value;
    setTaskDescribe(value);
  }
  //用户信息
  let [isModalUser, setIsModalUser] = useState(false);
  let changeIsModalUser = (type) => {
    setIsModalUser(type)
  }
  //奖励
  let [prizeList, setPrizeList] = useState([]);
  //删除奖励
  let filterPrize = (item, i) => {
    let toPrizeList = prizeList;
    toPrizeList.splice(i, 1);
    setPrizeList([...toPrizeList]);
  }
  //删除所选奖励
  let delePrize = (item, i) => {
    if (!isTaskStatus) {
      if (item.growthId) {  //已保存奖励
        deletePrice(item, i);
      } else {
        filterPrize(item, i)
      }
    }

  }
  //添加商品
  let [prizeVisible, setPrizeVisible] = useState(false); //选择奖品模态框状态
  let [prizeData, setPrizeData] = React.useState({}) //奖品
  let addCommodityClick = (i) => {
    // setToSessionsIn(i);
    setPrizeVisible(true);
    // setCardPrizeName("")
  }
  /*提示框*/
  let promptBox = (content) => {
    Modal.info({ content, okText: '确定' })
  }
  let [cardPrizeNameVisible, setCardPrizeNameVisible] = useState(false) // 卡券奖品展示名称模态框状态
  let [cardPrizeName, setCardPrizeName] = useState(''); // 卡券奖品展示名称
  /*确定选择奖品*/
  let onConfirmPrizeSet = () => {
    if (Object.keys(prizeData).length !== 0) {
      let { type, prizeAmount, prizeName, remark } = prizeData;
      let temp = prizeList;
      /*暂时关闭该校验*/
      if (type === '1') {
        let { cardPrizeList } = prizeData;
        if (cardPrizeList && cardPrizeList.length > 0) {
          let tempCardList = []
          for (let k = 0; k < cardPrizeList.length; k++) {
            if (!cardPrizeList[k].couponNum) {
              promptBox('请输入选中卡券数量!')
              return
            }
            if (cardPrizeList[k].defaultEffectiveDays <= 0) {
              promptBox('请设置选中卡券的有效期!')
              return
            }
          }
          cardPrizeList.map(item => {
            let tempData = JSON.parse(JSON.stringify(item))
            tempCardList.push(tempData)
          })
          if (!cardPrizeName) {
            setCardPrizeNameVisible(true)
            return
          }
          temp.push({
            prizeName: cardPrizeName,
            type: type,
            couponPrizeList: cardPrizeList
          })
          setPrizeList([...temp])
        } else {
          promptBox('请选择卡券!')
          return
        }
      }
      if (type === '2') {
        if (prizeData.pointsType === 1 && !prizeData.pointsLink) {
          promptBox('请输入领取链接！')
          return
        }
        if (prizeAmount && Number(prizeAmount) > 0) {
          let points = Number(prizeAmount)
          let tempNum = points / 200
          prizeData.points = points
          prizeData.prizeAmount = Number(tempNum.toFixed(2))
        } else {
          promptBox('海贝积分需大于0')
          return
        }
      }
      if (type === '3') {
        if (prizeName !== '') {
          if (Number(prizeAmount) <= 0) {
            promptBox('请输入现金红包金额!')
            return
          }
        } else {
          promptBox('请输入奖品名称!')
          return
        }
      }
      if (type === '4') {
        if (prizeName !== '') {
          if (Number(prizeAmount) <= 0) {
            promptBox('请输入单价!')
            return
          }
        } else {
          promptBox('请输入实物名称!')
          return
        }
      }
      if (type === '6') {
        if (!prizeName) {
          message.error('请输入积分');
          return;
        }
      }
      if (type === '7') {
        if (!prizeName) {
          message.error('请输入成长值');
          return;
        }
      }
      let tempPrize = {
        weightsNum: 0,
        winningNum: 0,
        prizeAmount: Number(prizeAmount)
      }
      if (type === '5') {
        if (!remark) {
          promptBox('请输入谢谢参与文案!')
          return
        } else {
          tempPrize.remark = remark
        }
      }
      if (type !== '1') {
        let toPrizeInfo = {
          prizeName: prizeData.prizeName,
          prizeAmount: prizeData.prizeAmount,
          num: 1,
          tradeDisplayName: '',
          tradeDescribe: '',
          prizeImg: '',
          isTradeTag: 0,
          tradeTag: '',
          type: type,
          points: prizeData.points || '',
          pointsType: prizeData.pointsType || '',
          pointsLink: prizeData.pointsLink || ''
        }
        if (type == '7') {
          toPrizeInfo.prizeName = '成长值';
          toPrizeInfo.growthValue = prizeData.prizeName;
        }
        temp.push(toPrizeInfo)
        setPrizeList([...temp])
      }
      setPrizeVisible(false)
    } else {
      promptBox('请选择奖品!')
    }
  }
  /*获取选中奖品信息*/
  let getPrizeData = (props) => {
    setPrizeData(props.prizeData)
  }
  /*卡券奖品名称确定事件*/
  let onOkCardPrizeName = () => {
    if (!cardPrizeName) {
      promptBox('请输入奖品展示名称！')
    } else {
      onConfirmPrizeSet()
      setCardPrizeNameVisible(false)
    }
  }
  //跳转返回-任务管理
  let hisTask = () => {
    history.replace({
      pathname: '/platformBuild/growthSystem/taskManage'
    })
  }
  //保存确定
  let configTaskDetails = (name) => {
    if (!infoArr.taskName || !infoArr.taskEvent || !taskDescribe) {
      message.error('请完善任务信息')
      return false;
    }
    if (infoArr.taskEvent == '4' || infoArr.taskEvent == '5') {
      if (!infoArr.cyclePeriod || !infoArr.num) {
        message.error('请完善任务信息')
        return false;
      }
    }
    if (infoArr.taskEvent == '6') {
      if (!infoArr.jumpLink || !infoArr.buttonCopy) {
        message.error('请完善任务信息')
        return false;
      }
    }
    let params = infoArr;
    if (infoArr.taskSortList && infoArr.taskSortList.length > 0) {
      let toTaskSortList = classifyList.filter((x) => infoArr.taskSortList.some((item) => x.id == item));
      params.taskSortList = toTaskSortList;
    } else {
      params.taskSortList = classifyList[0];
    }
    params.userDataConfigVOList = userDataConfigVOList;
    params.prizeVoList = prizeList;
    params.id = taskIds;
    params.taskDescribe = taskDescribe;
    dispatch({
      type: 'taskDetailst/saveTask',
      payload: {
        method: 'postJSON',
        params: params
      }, callback: (res) => {
        if (res.code === '0000') {
          message.info('保存成功');
          if (name == 'back') {   //确定-返回列表
            hisTask();
          } else {    //保存-下一条
            let toInfoArr = {
              channelId: String(tokenObj.channelId),
              taskName: '',
              taskDescribe: '',
              taskSortList: [],
              taskEvent: null,
              cyclePeriod: null,
              num: "",
              jumpLink: "",
              buttonCopy: '',
              informationType: 1
            }
            if (classifyList && classifyList.length > 0 && classifyList[0].id) {
              toInfoArr.taskSortList = [String(classifyList[0].id)];
            }
            setInfoArr({ ...toInfoArr });
            setUserDataConfigVOList([...[]]);
            setPrizeList([...[]]);
            setTaskIds('');
          }
        } else {
          message.error(res.message)
        }
      }
    })
  }
  //删除奖励
  let deletePrice = (name, ins) => {
    let params = {
      growthId: name.growthId,
      id: name.id
    }
    dispatch({
      type: 'taskDetailst/deletePrice',
      payload: {
        method: 'postJSON',
        params: params
      }, callback: (res) => {
        if (res.code === '0000') {
          filterPrize(name, ins)
        } else {
          message.error(res.message)
        }
      }
    })
  }
  useEffect(() => {
    queryTaskClassification();
    getChannel();
    //编辑回显
    if (taskIds) {
      getQueryTask();
    }
  }, [])
  useEffect(() => {
    if (classifyList && classifyList.length > 0 && classifyList[0].id) {
      let toinfoArr = infoArr;
      toinfoArr.taskSortList = [String(classifyList[0].id)];
      setInfoArr({ ...toinfoArr })
    }
  }, [classifyList])
  // 查询任务分类
  const queryTaskClassification = () => {
    let data = {
      channelId: tokenObj.channelId,
      type: 2,
    }
    dispatch({
      type: 'taskDetailst/queryTaskClassification',
      payload: {
        method: 'get',
        params: data
      },
    });
  }
  /*获取渠道客户*/
  let getChannel = () => {
    dispatch({
      type: 'taskDetailst/getAllChannel',
      payload: {
        method: 'get',
        params: {},
      },
    })
  }
  //任务回显
  let getQueryTask = () => {
    dispatch({
      type: 'taskDetailst/queryTask',
      payload: {
        method: 'get',
        params: {
          id: taskIds
        },
      }, callback: (res) => {
        if (res.code === '0000') {
          let toItems = res.items;
          let toTaskSortList = [];
          if (toItems.taskSortList && toItems.taskSortList.length > 0) {
            toItems.taskSortList.forEach(e => {
              toTaskSortList.push(String(e.id));
            });
          }
          let toInfoArr = {
            channelId: String(tokenObj.channelId),
            taskName: toItems.taskName || '',
            taskDescribe: toItems.taskDescribe || '',
            taskSortList: toTaskSortList,
            taskEvent: toItems.taskEvent ? String(toItems.taskEvent) : null,
            cyclePeriod: toItems.cyclePeriod ? String(toItems.cyclePeriod) : null,
            num: toItems.num || null,
            jumpLink: toItems.jumpLink || '',
            buttonCopy: toItems.buttonCopy || '',
            informationType: 1
          }
          setTaskDescribe(toItems.taskDescribe || '');
          let toPrizeVoList = toItems.prizeVoList ? toItems.prizeVoList : [];
          let toUserDataConfigVOList = toItems.userDataConfigVOList ? toItems.userDataConfigVOList : [];
          setInfoArr({ ...toInfoArr });
          setUserDataConfigVOList([...toUserDataConfigVOList]);
          setPrizeList([...toPrizeVoList]);
        } else {
          message.error(res.message)
        }
      }
    })
  }
  return (
    <>
      {/* 用户信息列表 */}
      {isModalUser ? <UserList isModalUser={isModalUser} changeIsModalUser={changeIsModalUser} userDataConfigVOList={userDataConfigVOList} changeUserDataConfigVOList={changeUserDataConfigVOList}></UserList> : null}
      {/*选择商品*/}
      {
        prizeVisible ? <Modal
          width={1200}
          okText="确定"
          title="选择商品"
          cancelText="取消"
          closable={false}
          maskClosable={false}
          visible={prizeVisible}
          onOk={onConfirmPrizeSet}
          // afterClose={getBudget}
          onCancel={() => { setPrizeVisible(false) }}
        >
          <SelectPrize onOk={getPrizeData} activityType="1" />
          <Modal
            onOk={onOkCardPrizeName}
            closable={false}
            maskClosable={false}
            visible={cardPrizeNameVisible}
            onCancel={() => {
              setCardPrizeNameVisible(false)
              setCardPrizeName('')
            }}
          >
            <div>
              <span>
                奖品展示名称
                <Tooltip title="在活动中展示的名称">
                  <InfoCircleOutlined className={style.wrap2_ico} />
                </Tooltip>：
              </span>
              <Input
                value={cardPrizeName}
                style={{ width: '150px' }}
                onChange={(e) => { setCardPrizeName(e.target.value) }}
              />
            </div>
          </Modal>
        </Modal> : null
      }

      <div className={style.main_head}>{taskIds ? '编辑任务' : '新建任务'}</div>
      <div className={`${style.main_body} ${style.block__cont}`}>
        <h3>{taskIds ? '编辑任务' : '新建任务'}</h3>
        <div className={style.main_wrap}>
          <div className={style.wrap_by}>
            <div className={style.wrap_box1}>
              <strong>客户：</strong>
              <Select placeholder="请选择" showSearch
                notFoundContent='暂无数据'
                placeholder="输入渠道可筛选"
                optionFilterProp="children"
                value={infoArr.channelId}
                className={style.wrap_box1_pn}
                onChange={(e) => { changeSele('channelId', e) }}
                disabled={tokenObj.channelId ? true : false}
              >
                {
                  channelList && channelList.length > 0 ?
                    channelList.map((item, key) => {
                      return <Option key={key} value={String(item.id)}>{item.channelName}</Option>
                    })
                    : ''
                }
              </Select>
            </div>
            <div className={style.wrap_box1}>
              <strong>名称：</strong>
              <Input className={style.wrap_box1_pn} placeholder="请输入" value={infoArr.taskName} maxLength="20" onChange={(e) => { changeName('taskName', e) }} />
            </div>

            <div className={style.wrap_box1}>
              <strong>任务分类：</strong>
              <Select mode="multiple" className={style.wrap_box1_pn} placeholder="请选择" value={infoArr.taskSortList} onChange={(e) => { changeSele('taskSortList', e) }}>
                {classifyList.map((item, i) => {
                  return <Option key={item.id}>{item.taskClassification}</Option>
                })
                }
              </Select>
            </div>
            <div className={style.wrap_box1}>
              <strong>任务事件：</strong>
              <Select className={style.wrap_box1_pn} placeholder="请选择" disabled={taskIds ? true : false} value={infoArr.taskEvent} onChange={(e) => { changeSele('taskEvent', e) }}>
                <Option key='1'>会员注册</Option>
                <Option key='2'>完善信息</Option>
                {/* <Option key='3'>每日签到</Option> */}
                <Option key='4'>邀请好友注册</Option>
                <Option key='5'>使用权益</Option>
                <Option key='6'>外链接任务</Option>
              </Select>
            </div>
            <div className={style.wrap_box_ely}>
              {
                infoArr.taskEvent == '1' ?
                  <div className={`${style.wrap_box2} ${style.wrap_box2_1}`}>
                    <h4>会员注册</h4>
                    <p>完成注册后，获得：<span onClick={addCommodityClick}>选择奖励</span></p>
                    <div className={`${style.wrap_box_list} ${prizeList && prizeList.length > 0 ? style.wrap_box_list2 : null}`}>
                      <ul>
                        {prizeList.map((item, i) => {
                          return <li><span>奖励{i + 1}</span><span>{item.type == 7 ? item.growthValue : item.prizeName}</span><span>{item.type == 1 ? '卡券' : item.type == 2 ? '海贝积分' : item.type == 3 ? '现金' : item.type == 4 ? '实物' : item.type == 5 ? '不中奖' : item.type == 6 ? '积分' : item.type == 7 ? '成长值' : ''}</span><em><DeleteOutlined onClick={(e) => {
                            delePrize(item, i)
                          }}></DeleteOutlined></em></li>
                        })
                        }
                      </ul>
                    </div>
                  </div>
                  : infoArr.taskEvent == '2' ?
                    <div className={`${style.wrap_box2} ${style.wrap_box2_2}`}>
                      <h4>完善信息</h4>
                      <p>完善信息后，获得：<span onClick={addCommodityClick}>选择奖励</span></p>
                      <div className={`${style.wrap_box_list} ${prizeList && prizeList.length > 0 ? style.wrap_box_list2 : null}`}>
                        <ul>
                          {prizeList.map((item, i) => {
                            return <li><span>奖励{i + 1}</span><span>{item.type == 7 ? item.growthValue : item.prizeName}</span><span>{item.type == 1 ? '卡券' : item.type == 2 ? '海贝积分' : item.type == 3 ? '现金' : item.type == 4 ? '实物' : item.type == 5 ? '不中奖' : item.type == 6 ? '积分' : item.type == 7 ? '成长值' : ''}</span><em><DeleteOutlined onClick={(e) => {
                              delePrize(item, i)
                            }}></DeleteOutlined></em></li>
                          })
                          }
                        </ul>
                      </div>
                      <p><span onClick={setIsModalUser}>用户信息维护项</span></p>
                    </div>
                    : infoArr.taskEvent == '3' ?
                      <div className={`${style.wrap_box2} ${style.wrap_box2_3}`}>
                        <h4>日期签到</h4>
                        <p>每日签到后，获得：<span onClick={addCommodityClick}>选择奖励</span></p>
                        <div className={`${style.wrap_box_list} ${prizeList && prizeList.length > 0 ? style.wrap_box_list2 : null}`}>
                          <ul>
                            {prizeList.map((item, i) => {
                              return <li><span>奖励{i + 1}</span><span>{item.type == 7 ? item.growthValue : item.prizeName}</span><span>{item.type == 1 ? '卡券' : item.type == 2 ? '海贝积分' : item.type == 3 ? '现金' : item.type == 4 ? '实物' : item.type == 5 ? '不中奖' : item.type == 6 ? '积分' : item.type == 7 ? '成长值' : ''}</span><em><DeleteOutlined onClick={(e) => {
                                delePrize(item, i)
                              }}></DeleteOutlined></em></li>
                            })
                            }
                          </ul>
                        </div>
                      </div>

                      : infoArr.taskEvent == '4' ?
                        <div className={`${style.wrap_box2} ${style.wrap_box2_4}`}>
                          <h4>邀请好友注册</h4>
                          <p>邀请好友注册，获得：<span onClick={addCommodityClick}>选择奖励</span></p>
                          <div className={`${style.wrap_box_list} ${prizeList && prizeList.length > 0 ? style.wrap_box_list2 : null}`}>
                            <ul>
                              {prizeList.map((item, i) => {
                                return <li><span>奖励{i + 1}</span><span>{item.type == 7 ? item.growthValue : item.prizeName}</span><span>{item.type == 1 ? '卡券' : item.type == 2 ? '海贝积分' : item.type == 3 ? '现金' : item.type == 4 ? '实物' : item.type == 5 ? '不中奖' : item.type == 6 ? '积分' : item.type == 7 ? '成长值' : ''}</span><em><DeleteOutlined onClick={(e) => {
                                  delePrize(item, i)
                                }}></DeleteOutlined></em></li>
                              })
                              }
                            </ul>
                          </div>
                          <div className={style.wrap_box2_4n1}>
                            <em>循环周期：</em>
                            <Select className={style.wrap_box2_4n1_el} placeholder="请选择" value={infoArr.cyclePeriod} onChange={(e) => { changeSele('cyclePeriod', e) }}>
                              <Option key='1'>每天</Option>
                              <Option key='2'>每周</Option>
                              <Option key='3'>每月</Option>
                              <Option key='4'>每年</Option>
                            </Select>
                            <em>获得</em>
                            <InputNumber min={1} className={style.wrap_box2_4n1_num} value={infoArr.num} onChange={(e) => { changeSele('num', e) }} />
                            <em>次</em>
                          </div>
                        </div>

                        : infoArr.taskEvent == '5' ?
                          <div className={`${style.wrap_box2} ${style.wrap_box2_5}`}>
                            <h4>使用卡券权益</h4>
                            <p>​每使用1次卡券权益，获得：<span onClick={addCommodityClick}>选择奖励</span></p>
                            <div className={style.wrap_box2_4n1}>
                              <em>循环周期：</em>
                              <Select className={style.wrap_box2_4n1_el} placeholder="请选择" value={infoArr.cyclePeriod} onChange={(e) => { changeSele('cyclePeriod', e) }}>
                                <Option key='1'>每天</Option>
                                <Option key='2'>每周</Option>
                                <Option key='3'>每月</Option>
                                <Option key='4'>每年</Option>
                              </Select>
                              <em>获得</em>
                              <InputNumber min={1} className={style.wrap_box2_4n1_num} value={infoArr.num} onChange={(e) => { changeSele('num', e) }} />
                              <em>次</em>
                            </div>
                            <div className={`${style.wrap_box_list} ${prizeList && prizeList.length > 0 ? style.wrap_box_list2 : null}`}>
                              <ul>
                                {prizeList.map((item, i) => {
                                  return <li><span>奖励{i + 1}</span><span>{item.type == 7 ? item.growthValue : item.prizeName}</span><span>{item.type == 1 ? '卡券' : item.type == 2 ? '海贝积分' : item.type == 3 ? '现金' : item.type == 4 ? '实物' : item.type == 5 ? '不中奖' : item.type == 6 ? '积分' : item.type == 7 ? '成长值' : ''}</span><em><DeleteOutlined onClick={(e) => {
                                    delePrize(item, i)
                                  }}></DeleteOutlined></em></li>
                                })
                                }
                              </ul>
                            </div>
                          </div>

                          : infoArr.taskEvent == '6' ?
                            <div className={`${style.wrap_box2} ${style.wrap_box2_6}`}>
                              <h4>外链任务</h4>
                              <div className={style.wrap_box2_6n}>
                                <strong>按钮文案：</strong>
                                <Input className={style.wrap_box2_6n1} placeholder="请输入" value={infoArr.buttonCopy} onChange={(e) => { changeName('buttonCopy', e) }} />
                              </div>
                              <div className={style.wrap_box2_6n}>
                                <strong>跳转链接：</strong>
                                <Input className={style.wrap_box2_6n1} placeholder="请输入" value={infoArr.jumpLink} onChange={(e) => { changeName('jumpLink', e) }} />
                              </div>
                              <p><span onClick={addCommodityClick}>选择奖励</span></p>
                              <div className={`${style.wrap_box_list} ${prizeList && prizeList.length > 0 ? style.wrap_box_list2 : null}`}>
                                <ul>
                                  {prizeList.map((item, i) => {
                                    return <li><span>奖励{i + 1}</span><span>{item.type == 7 ? item.growthValue : item.prizeName}</span><span>{item.type == 1 ? '卡券' : item.type == 2 ? '海贝积分' : item.type == 3 ? '现金' : item.type == 4 ? '实物' : item.type == 5 ? '不中奖' : item.type == 6 ? '积分' : item.type == 7 ? '成长值' : ''}</span><em><DeleteOutlined onClick={(e) => {
                                      delePrize(item, i)
                                    }}></DeleteOutlined></em></li>
                                  })
                                  }
                                </ul>
                              </div>
                            </div>

                            : null
              }


            </div>
            <div className={style.wrap_box1}>
              <strong>任务规则：</strong>
              <div className={style.wrap_describe}><RichText onTextChange={(e) => { onTextChange(e) }} couponUsageExplain={infoArr.taskDescribe} /></div>
            </div>

          </div>
          <div className={style.wrap_bom}>
            <Button onClick={hisTask}>取 消</Button>
            <Button type="primary" onClick={() => { configTaskDetails("back") }} disabled={isTaskStatus}>确 定</Button>
            <Button type="primary" onClick={() => { configTaskDetails("next") }} disabled={isTaskStatus}>保存并添加下一条</Button>
          </div>
        </div>
      </div>
    </>
  )
};
export default connect(({ taskDetailst }) => ({
  classifyList: taskDetailst.classifyList,
  channelList: taskDetailst.channelList
}))(taskDetailstPage)
