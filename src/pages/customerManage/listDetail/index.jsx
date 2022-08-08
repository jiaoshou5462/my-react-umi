import React, { useEffect, useState } from "react";
import { Link, connect, history } from 'umi';
import { Image, Row, Col, Tag, Tabs, Select, message, DatePicker, Switch } from "antd"
import style from "./style.less";
const { Option } = Select;
const { RangePicker } = DatePicker
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';  // 日期处理
import 'moment/locale/zh-cn';

import CarInfomation from '../components/carInfomation';  // 车辆信息组件
import BehaviorRecord from '../components/behaviorRecord'; // 行为记录组件、】
import CardDetail from '../components/cardDetail';  // 卡券明细
import InsuranceDetail from '../components/insuranceDetail';  // 保险明细
import SocialCircle from '../components/socialCircle';  // 社交圈
import UnbundingOpenidModel from '../components/unbundingOpenidModel';
import ModifyPhoneNumberModel from '../components/modifyPhoneNumberModel';
import ModifyIdCarModel from '../components/modifyIdCarModel';
import EditAddressModel from '../components/editAddressModel';
import ModalBox from '../components/modal';// 修改记录

moment.locale('zh-cn')
const { TabPane } = Tabs;

const customerListPage = (props) => {
  let { dispatch } = props
  let customerId = history.location.query.customerId
  let isReadOnly = history.location.query.isReadOnly;//是否只读
  let saleInfo = history.location.query.saleInfo;//销售管理的saleInfo

  //Modal数据
  const [modalInfo, setMdalInfo] = useState('')

  let [unbundingOpenidVisble, setUnbundingOpenidVisble] = useState(false), // 解绑openid
    [modifyPhoneNumberVisble, setModifyPhoneNumberVisble] = useState(false), // 修改手机号 
    [modifyIdCarVisible, setModifyIdCarVisible] = useState(false),
    [editAddressVisible, setEditAddressVisible] = useState(false),
    [userData, setUserData] = useState({}),
    [open, setOpen] = useState(false),
    [isShowOpen, setIsShowOpen] = useState(false),
    [userName, setUsername] = useState(''),
    [userPhone, setUserPhone] = useState(''),
    [branchIdName, setBranchIdName] = useState(''),
    [orgCode, setOrgCode] = useState('')


  useEffect(() => {
    getSwittch()
    setUsername(history.location.query.userName);
    setUserPhone(history.location.query.userPhone);
    setBranchIdName(history.location.query.branchName);
  }, [])
  /* 获取用户详情 */
  let getSwittch = () => {
    let data = {
      customerId: customerId
    }
    dispatch({
      type: 'customerListDetail/getSwittch',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let detailInfo = res.body.detailInfo
          if (detailInfo.sex == 0) {
            detailInfo.sex = '未知'
          } else if (detailInfo.sex == 1) {
            detailInfo.sex = '男'
          } else if (detailInfo.sex == 2) {
            detailInfo.sex = '女'
          }
          if (detailInfo.levelInfo) {
            if (!detailInfo.levelInfo.channelResource && !detailInfo.levelInfo.resourceSaleTelephone) {
              detailInfo.resourceType = '自然注册'
            } else if (detailInfo.levelInfo.channelResource && detailInfo.levelInfo.resourceSaleTelephone) {
              detailInfo.resourceType = '好友推荐/' + detailInfo.levelInfo.resourceSaleTelephone
            } else if (detailInfo.levelInfo.channelResource && !detailInfo.levelInfo.resourceSaleTelephone) {
              detailInfo.resourceType = detailInfo.levelInfo.channelResource
            }
          }
          if (detailInfo.tagList) {
            detailInfo.tagList.forEach(item => {
              item.tagListChange = {}
              let styleData = item.tagStyle.split(';');
              styleData.forEach((element, index) => {
                if (index != styleData.length - 1) {
                  item.tagListChange[element.split(':')[0]] = element.split(':')[1]
                }
              })
            })
          }
          setUserData(detailInfo);
          setOrgCode(res.body.orgCode);
          setIsShowOpen(res.body.open ? true : false)
          setOpen(res.body.open == 1 ? true : false);
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  /* 刷新 */
  let toRefresh = () => {
    dispatch({
      type: 'customerListDetail/toRefresh',
      payload: {
        method: 'postJSON',
        params: {
          openId: userData.openId
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          setOrgCode(res.body.orgcode)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  let onSwitchChange = (e) => {
    setOpen(!open);
    dispatch({
      type: 'customerListDetail/openAndClosse',
      payload: {
        method: 'postJSON',
        params: {
          openId: userData.openId,
          customerId: customerId,
          switchValue: e ? 1 : 2
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {

        } else {
          message.error(res.result.message)
        }
      }
    })

  }
  /* 关闭解绑弹窗 */
  let hideUnbundingOpenModel = () => {
    setUnbundingOpenidVisble(false)
  }
  /* 开启解绑弹窗 */
  let unbundingOpenidEdit = () => {
    setUnbundingOpenidVisble(true)
  }
  /* 开启手机号修改弹窗 */
  let modifyPhoneEdit = () => {
    setModifyPhoneNumberVisble(true)
  }
  /* 隐藏手机号修改弹窗 */
  let hideModifyPhoneEdit = () => {
    setModifyPhoneNumberVisble(false)
  }
  /* 开启身份证修改弹窗 */
  let modifyIdCar = () => {
    setModifyIdCarVisible(true)
  }
  /* 关闭身份证修改弹窗 */
  let hideModifyIdCar = () => {
    setModifyIdCarVisible(false)
  }
  /* 注册证件类型翻译 */ 
  let translateIdentityType = (type) => {
    if(type==1) return '身份证'
    if(type==2) return '护照'
    if(type==3) return '港澳台居民居住证'
    if(type==4) return '外国人永久居留证'
    if(type==5) return '军官证'
    if(type==6) return '台湾居民来往大陆通行证'
    if(type==7) return '港澳居民来往内地通行证'
  }
  //modal回调
  const callModal = (flag) => {
    setMdalInfo('')
  }
  let callback = () => {

  }
  return (
    <div>
      <div className={style.block__cont}>
        <div className={style.block__header}>
          <span>用户详情</span>
        </div>
        <div className={style.sub_content}>
          <div className={style.sub_part_content}>
            {/* <img
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            /> */}
            <div className={style.sub_part}>
              <div className={style.sub_title}>基础信息</div>
              <Row gutter={20} className={style.part_row}>
                <Col span={6}>用户姓名：{userData.customerName} </Col>
                <Col span={6}>客户渠道：{userData.channelName}</Col>
                <Col span={6}>微信昵称：{userData.nickName}</Col>
                <Col span={6}>
                  <div className={style.lable_name_l}>微信openid：</div>
                  <div className={style.lable_name_r}> {userData.openId}{userData.allowModify && isReadOnly != 'readOnly' ? <span onClick={unbundingOpenidEdit} className={style.textColor}>解绑</span> : null}</div>
                </Col>
              </Row>
              <Row gutter={20} className={style.part_row}>
                <Col span={6}>
                  <div className={style.lable_name_l}>unionid：</div>
                  <div className={style.lable_name_r}> {userData.unionId}</div>
                </Col>
                <Col span={6}>注册来源：{userData.resourceType}</Col>
                <Col span={6}>手机号：{userData.phone} {userData.allowModify && isReadOnly != 'readOnly' ? <span onClick={modifyPhoneEdit} className={style.textColor}>修改</span> : null} <span onClick={()=> {setMdalInfo({modalName: 'editrecord', objectId:userData.wechatId, type: 'showPhone' })}} className={style.textColor}>修改记录</span></Col>
                <Col span={6}>
                  <div className={style.lable_name_l}>证件号码：</div>
                  <div className={style.lable_name_r}>{userData.idCard}({translateIdentityType(userData.identityType)}) {userData.allowModify && isReadOnly != 'readOnly' ? <span onClick={modifyIdCar} className={style.textColor}>修改</span> : null}<span onClick={()=> {setMdalInfo({modalName: 'editrecord', objectId:userData.wechatId, type: 'showIdentityNo'})}} className={style.textColor}>修改记录</span></div>
                </Col>
              </Row>
              <Row gutter={20} className={style.part_row}>
                <Col span={6}>性别：{userData.sex}</Col>
                <Col span={6}>生日：{userData.birthday}</Col>
                {isReadOnly == 'readOnly' ? <Col span={6}>所属门店：{saleInfo && saleInfo.depname} </Col> : <Col span={6}>所属门店：{branchIdName} </Col>}
                {isReadOnly == 'readOnly' ? <Col span={6}>所属销售：{saleInfo && saleInfo.username} </Col> : <Col span={6}>所属销售：{userName} </Col>}

              </Row>
              <Row gutter={20} className={style.part_row}>
                {isReadOnly == 'readOnly' ? <Col span={6}>销售账号：{saleInfo && saleInfo.userid} </Col> : <Col span={6}>销售账号：{userPhone} </Col>}
                <Col span={6}>联系地址：{userData.wechatAddr} </Col>
              </Row>
              <div className={style.part_title_line}></div>
              <Row gutter={20} className={style.part_row}>
                <Col span={6}>
                  <div className={style.lable_name_l}>关注公众号时间：</div>
                  <div className={style.lable_name_time}>{userData.followTime}</div>
                </Col>
                <Col span={6}>
                  <div className={style.lable_name_l}>注册车主平台时间：</div>
                  <div className={style.lable_name_time}>{userData.registerTime}</div>
                </Col>
                <Col span={6}>
                  <div className={style.lable_name_l}>取关公众号时间：</div>
                  <div className={style.lable_name_time}>{userData.unfollowTime}</div>
                </Col>
                {isShowOpen ?
                  <Col span={6}>接收会员日活动通知：<Switch
                    checked={open}
                    checkedChildren="开"
                    unCheckedChildren="关"
                    onChange={onSwitchChange}
                  />
                  </Col> : null}
              </Row>
              {orgCode ? <Row gutter={20} className={style.part_row}>
                <Col span={6}>优享会归属： {orgCode} {isReadOnly == 'readOnly' ? '' : <span onClick={toRefresh} className={style.textColor}>刷新</span>}</Col>
              </Row> : null}
            </div>
          </div>
        </div>
        <div className={style.part_line_content}></div>
        <div className={style.sub_content}>
          <div className={style.sub_tag_title}>标签信息</div>
          <div className={style.sub_part_common}>
            {userData.tagList ? userData.tagList.map((item) => {
              return <Tag style={item.tagListChange}>{item.tagName}</Tag>
            }) : null}
          </div>
        </div>
      </div>
      <div className={style.block__cont}>
        <div className={style.sub_content}>
          <Tabs defaultActiveKey="1" onChange={callback} className={style.tabs_content}>
            <TabPane tab="车辆信息" key="1">
              <CarInfomation />
            </TabPane>
            {/* <TabPane tab="行为记录" key="2">
              <BehaviorRecord />
            </TabPane> */}
            <TabPane tab="卡券明细" key="3">
              <CardDetail />
            </TabPane>
            <TabPane tab="保险明细" key="4">
              <InsuranceDetail />
            </TabPane>
            <TabPane tab="社交圈" key="5">
              <SocialCircle />
            </TabPane>
          </Tabs>
        </div>
      </div>
      <UnbundingOpenidModel unbundingOpenidVisble={unbundingOpenidVisble} wechatId={userData.wechatId} openId={userData.openId} getSwittch={getSwittch} hideUnbundingOpenModel={hideUnbundingOpenModel} />
      <ModifyPhoneNumberModel modifyPhoneNumberVisble={modifyPhoneNumberVisble} wechatId={userData.wechatId} hideModifyPhoneEdit={hideModifyPhoneEdit} getSwittch={getSwittch} />
      <ModifyIdCarModel modifyIdCarVisible={modifyIdCarVisible} wechatId={userData.wechatId} getSwittch={getSwittch} hideModifyIdCar={hideModifyIdCar} />
      <EditAddressModel editAddressVisible={editAddressVisible} />
      {modalInfo?<ModalBox modalInfo={modalInfo} toFatherValue={(flag)=>callModal(flag)} />:''}
    </div>
  )
};
export default connect(({ customerListDetail }) => ({
}))(customerListPage)
