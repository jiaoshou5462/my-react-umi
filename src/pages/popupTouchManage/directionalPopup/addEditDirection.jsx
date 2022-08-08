import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Row, Col, Form, Space, Radio, Input, Select, Button, Tooltip, DatePicker, message, Upload, InputNumber } from 'antd';
// import ContentTypeModal from './contentTypeModal'
import SetColor from '@/pages/activityModule/components/setColor';   //选择颜色组件
import { uploadIcon } from '@/services/activity.js';
import { PlusOutlined, QuestionCircleOutlined, CloseCircleOutlined, NotificationOutlined, LeftOutlined, EllipsisOutlined } from '@ant-design/icons';
import styles from './style.less';

import moment from 'moment'
import { formatDate, formatTime } from '@/utils/date'
import PeopleSelectModel from '../../strategicManage/components/peopleSelectModel';
import ContentSelectModal from './contentSelectModal';


const { TextArea, Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;


// 新增、编辑定向弹框页面
const addEditDirectionPage = (props) => {
  let { dispatch, checkedContList, isUpdate, popupPageList } = props
  let [form] = Form.useForm();
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  const [peopleSelectVisible, setPeopleSelectVisible] = useState(false);//人群弹框
  const [contVisible, setContVisible] = useState(false);//内容弹框

  let directionalId = history.location.query.id;
  let directionalPopupStatus = history.location.query.popupStatus;//弹窗状态

  useEffect(() => {
    dispatch({
      type: 'directionalPopupManage/setContData',// 重置
      payload: {
        checkedContList: [],
        isUpdate: false
      }
    })
  }, [])
  useEffect(() => {
    if (directionalId) {
      getDetailId()
    }
  }, [directionalId])

  let [editPopupContentId, setEditPopupContentId] = useState(null);
  // let [popupContentTypeStr, setPopupContentTypeStr] = useState('')
  let [popupContentName, setPopupContentName] = useState('')
  // 查看详情(编辑)
  const getDetailId = () => {
    dispatch({
      type: 'directionalPopupManage/getDetailId',//详情
      payload: {
        method: 'get',
        params: {},
        id: directionalId,
      },
      callback: (res) => {
        if (res.result.code == '0') {
          setEditPopupContentId(res.body.popupContentId);
          // setPopupContentTypeStr(res.body.popupContentTypeStr);
          setPopupContentName(res.body.popupContentName);

          seReachUserType(res.body.reachUserType);
          setGroupList(res.body.groupList);

          let totalGroupNum = 0;
          res.body.groupList.map((item) => {
            totalGroupNum = totalGroupNum + item.groupNum
          })
          setTotalGroupNum(totalGroupNum);
          console.log(totalGroupNum, 'totalGroupNum')

          let popupFrequency = res.body.popupFrequency;
          setPopupFrequencyType(popupFrequency.popupFrequencyType)
          setIntervalValue(popupFrequency.intervalValue)
          setIntervalUnit(popupFrequency.intervalUnit)

          form.setFieldsValue({
            popupName: res.body.popupName,
            groupList: res.body.groupList,
            popupPageId: res.body.popupPageId,
            popupContentId: res.body.popupContentId,
            popupContentType: res.body.popupContentType,
            ...popupFrequency,
            time: [moment(res.body.startTime), moment(res.body.endTime)],
            remark: res.body.remark,
          })
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  useEffect(() => {
    getPopupPageConfig()
  }, [])


  useEffect(() => {
    if (checkedContList.length) {
      form.setFieldsValue({
        popupContentId: checkedContList[0].id
      })
    }
  }, [checkedContList])


  //弹窗页面列表
  let getPopupPageConfig = () => {
    dispatch({
      type: 'directionalPopupManage/getPopupPageConfig',
      payload: {
        method: 'get',
        params: {}
      }
    })
  }


  // 触达用户
  const [reachUserType, seReachUserType] = useState(1);//1:全部人群 2：自定义人群
  let reachUsersChange = (e) => {
    seReachUserType(e.target.value)
  }
  // 点击选择人群
  let handelChoosePeople = () => {
    setPeopleSelectVisible(true)
  }

  //用户来源填写字段
  let [wanderStrategyCrowdVOList, setWanderStrategyCrowdVOList] = useState([])
  let [userSelectedRows, setUserSelectedRows] = useState({})// 选择用户群
  let hidePeopelSelectModel = (data) => {
    setPeopleSelectVisible(false)
    if (data) {
      // console.log(data, 'dataaa')
      setWanderStrategyCrowdVOList(data)
      let fieldsValue = form.getFieldsValue()
      let crowdStr = []
      let countNum = 0
      data.forEach(item => {
        crowdStr.push(item.crowdName)
        if (item.countNum) {
          countNum = countNum + item.countNum
        }
      })
      fieldsValue.crowdName = crowdStr.join('，')
      form.setFieldsValue({ ...fieldsValue })
      setUserSelectedRows({
        crowdStr: crowdStr.join('，'),
        crowdPeopleCount: countNum
      })


      let groupList = JSON.parse(JSON.stringify(data));
      groupList = groupList.map((item) => {
        item.groupId = item.crowdId
        item.groupName = item.crowdName
        item.groupNum = item.countNum
        return item;
      })
      setGroupList(groupList)
    }
  }


  const [totalGroupNum, setTotalGroupNum] = useState(0);
  const [groupList, setGroupList] = useState([]);

  // 选择内容
  let handelChooseCont = () => {
    setContVisible(true);

  }

  // 显示频率
  // popupFrequencyType 1、不限制，2、间隔
  const [popupFrequencyType, setPopupFrequencyType] = useState(1);
  const frequencyChange = (e) => {
    setPopupFrequencyType(e.target.value)
  }
  // intervalValue间隔值
  const [intervalValue, setIntervalValue] = useState(1);
  const intervalValChange = (e) => {
    setIntervalValue(e)
  }
  // intervalUnit间隔单位(1：分钟 ,2：小时 ,3：天)
  const [intervalUnit, setIntervalUnit] = useState(1);
  const intervalUnitChange = (e) => {
    setIntervalUnit(e)
  }

  let onSubmit = (value) => {
    if (popupFrequencyType == 2) {
      if (!intervalValue) {
        message.error('请输入间隔时间')
        return;
      }
    } else {
      setIntervalValue(null);
      setIntervalUnit(null);
    }
    dispatch({
      type: 'directionalPopupManage/getSaveOrUpdate',
      payload: {
        method: 'postJSON',
        params: {
          id: directionalId ? directionalId : null,
          groupList: groupList,
          popupContentId: checkedContList.length ? checkedContList[0].id : editPopupContentId,
          popupName: value.popupName,
          popupPageId: value.popupPageId,
          reachUserType: reachUserType,
          popupFrequency: {
            popupFrequencyType: popupFrequencyType,
            intervalUnit: intervalUnit,
            intervalValue: intervalValue
          },
          startTime: value.time[0].format('YYYY-MM-DD HH:mm:ss'),
          endTime: value.time[1].format('YYYY-MM-DD HH:mm:ss'),
          remark: value.remark
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          message.success('提交成功')
          history.push({
            pathname: '/popupTouchManage/directionalPopup'
          })
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  return (
    <>
      <h2 className={styles.wrap_h2}></h2>
      <div className={styles.block__header}>
        <h3>{directionalId ? '编辑弹窗' : '新建弹窗'}</h3>
      </div>
      <Form form={form} onFinish={onSubmit} labelCol={{ span: 10 }} wrapperCol={{ span: 8 }}>
        <Row justify="space-around" align="left" className={styles.form_box}>
          <Form.Item name="popupName" label="弹窗名称：" className={styles.form__item} rules={[{ required: true, message: "请输入弹窗名称" }]}>
            <Input placeholder="请输入" maxLength="20" />
          </Form.Item>

          <Form.Item label="触达用户：" className={styles.form__item}>
            <Radio.Group defaultValue={reachUserType} value={reachUserType} style={{ marginTop: '6px' }} onChange={reachUsersChange}>
              <Radio value={1}>全部人群</Radio>
              <Radio value={2}>自定义人群</Radio>
            </Radio.Group>
            {
              reachUserType == 2 ?
                <div>
                  {/* {userSelectedRows.crowdStr ?
                    <div div style={{ margin: '20px 0 10px' }}>
                      <p>已选择：{userSelectedRows.crowdStr}</p>
                      <p>预估人数：<InputNumber disabled value={userSelectedRows.crowdPeopleCount} />人</p>
                      <Button onClick={handelChoosePeople}><PlusOutlined />重新选择人群</Button>
                    </div>
                    :
                    <div style={{ margin: '20px 0 10px' }}>
                      <Button onClick={handelChoosePeople}><PlusOutlined />选择人群</Button>
                    </div>
                  } */}
                  {
                    directionalId ?
                      <div div style={{ margin: '20px 0 10px' }}>
                        <p>已选择：
                          {
                            groupList && groupList.map((v) => <span>{v.groupName}；</span>)
                          }
                        </p>
                        <p>预估人数：
                          <InputNumber disabled value={totalGroupNum} />人
                        </p>
                        <Button onClick={handelChoosePeople}><PlusOutlined />重新选择人群</Button>
                      </div>
                      : userSelectedRows.crowdStr ?
                        <div div style={{ margin: '20px 0 10px' }}>
                          <p>已选择：{userSelectedRows.crowdStr}；</p>
                          <p>预估人数：<InputNumber disabled value={userSelectedRows.crowdPeopleCount} /> 人</p>
                          <Button onClick={handelChoosePeople}><PlusOutlined />重新选择人群</Button>
                        </div>
                        :
                        <div style={{ margin: '20px 0 10px' }}>
                          <Button onClick={handelChoosePeople}><PlusOutlined />选择人群</Button>
                        </div>
                  }
                </div>
                : ''
            }
          </Form.Item>
          <Form.Item name="popupPageId" label="弹窗页面：" className={styles.form__item} rules={[{ required: true, message: "请选择弹窗页面" }]}>
            <Select placeholder="请选择"
              showSearch
              allowClear
              disabled={directionalPopupStatus == 4 ? true : false}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {
                popupPageList && popupPageList.map((v) => <Option key={v.id} value={v.id}>{v.pageName}</Option>)
              }
            </Select>
          </Form.Item>

          <Form.Item name="popupContentId" label="弹窗内容：" className={styles.form__item} rules={[{ required: true, message: "请选择弹窗内容" }]}>
            <Button onClick={handelChooseCont} disabled={directionalPopupStatus == 4 ? true : false}><PlusOutlined />选择内容</Button>
            <div style={{ marginTop: '20px' }}>
              {
                isUpdate ?
                  checkedContList.map((v) => <div>已选择：<span>{v.contentName}； </span></div>)
                  : popupContentName ?
                    <div>已选择：<span>{popupContentName}； </span></div>
                    : ''
              }
            </div>
          </Form.Item>

          <Form.Item className={styles.showRate} label="弹窗频率：" rules={[{ required: true, message: "请选择弹窗频率" }]}>
            <Radio.Group defaultValue={popupFrequencyType} value={popupFrequencyType} onChange={frequencyChange}>
              {/* popupFrequencyType 1、不限制，2、间隔)*/}
              <Radio value={1}>首次弹出</Radio>
              <Radio value={2}>
                <span style={{ marginRight: "20px" }}>每次弹出</span>
                {/* intervalValue间隔值 */}
                {
                  popupFrequencyType == 2 ?
                    <>触达后 <InputNumber style={{ width: '30%', marginRight: '10px' }} min={1} defaultValue={intervalValue} value={intervalValue} onChange={intervalValChange} /></>
                    : ''
                }
              </Radio>
            </Radio.Group>
            {/* intervalUnit间隔单位(1：分钟 ,2：小时 ,3：天) */}
            {
              popupFrequencyType == 2 ?
                <>
                  <Select className={styles.unitSelect} defaultValue={intervalUnit} value={intervalUnit} onChange={intervalUnitChange}>
                    <Option value={1}>分钟</Option>
                    <Option value={2}>小时</Option>
                    <Option value={3}>天</Option>
                  </Select> 可再次弹出
                </> : ''
            }
          </Form.Item>
          <Form.Item name="time" label="有效期：" className={styles.form__item} rules={[{ required: true, message: "请选择有效期" }]}>
            <RangePicker showTime className={styles.form_item_width2} />
          </Form.Item>
          <Form.Item name="remark" label="备注说明：" className={styles.form__item}>
            <TextArea placeholder="请输入" maxLength="20" />
          </Form.Item>
        </Row>
        <Row justify="end" className={styles.form_box}>
          <Space size={20}>
            <Button onClick={() => { history.goBack() }}>取消</Button>
            <Button type="primary" htmlType="submit">提交</Button>
          </Space>
        </Row>
      </Form>
      {/* 人群 */}
      {
        peopleSelectVisible ?
          <PeopleSelectModel peopleSelectVisible={peopleSelectVisible} hidePeopelSelectModel={hidePeopelSelectModel} wanderStrategyCrowdVOList={wanderStrategyCrowdVOList} /> : ''
      }
      {
        contVisible ?
          <ContentSelectModal
            contVisible={contVisible}
            popupId={editPopupContentId}
            closeModal={() => { setContVisible(false) }}
          /> : ''
      }
    </>
  )
}

export default connect(({ directionalPopupManage }) => ({
  checkedContList: directionalPopupManage.checkedContList,
  isUpdate: directionalPopupManage.isUpdate,
  popupPageList: directionalPopupManage.popupPageList,
}))(addEditDirectionPage);
