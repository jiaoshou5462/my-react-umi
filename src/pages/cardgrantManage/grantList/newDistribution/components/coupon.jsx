import React, { useState, useEffect, useRef, useContext } from 'react';
import { connect, history } from 'umi';
import {
  Row, Col, Form, Space, Radio, Input, Table, Select, Divider, Button, DatePicker,
  InputNumber, Modal, message, Tooltip
} from "antd"
import AddCouponsModal from '../modal/addCouponsModal';
import style from "./style.less";
import { QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useThresholdRender } from '@/pages/cardgrantManage/grantList/common.js'

const { RangePicker } = DatePicker;
const { Column } = Table;

let compData = {};
let allObj = {}//数量,总额对象
// 添加卡包弹框
const coupon = (props) => {
  let { dispatch, editInfo, detailList, isCardRadioTabs } = props;
  let [form] = Form.useForm();
  console.log(detailList, 'detailList20')
  // 登录成功返回的数据
  const currentUser = localStorage.getItem('tokenObj') ? JSON.parse(localStorage.getItem('tokenObj')) : {};
  // 卡券
  let [isModalVisible, setIsModalVisible] = useState(false);//添加卡券弹框
  let [VOList, setVOList] = useState([]);//选中的卡券列表

  let [allCont, setAllCont] = useState(0);//数量
  let [allMoney, setAllMoney] = useState(0);//总额

  // =====编辑进入时=======
  let [newDetailList, setNewDetailList] = useState(detailList);//编辑卡券数据
  useEffect(() => {//编辑进入时
    if (detailList && detailList.length) {
      let _detailList = JSON.parse(JSON.stringify(detailList))//数据
      setNewDetailList(_detailList);

      compute(detailList);//进入编辑时计算

      compData.detailList = _detailList;
      sendData(compData);
    }
  }, [detailList])

  //计算数量,总额
  let compute = (nowShowList) => {
    console.log(nowShowList, 'nowShowList123')
    let num = 0;
    let alls = nowShowList.reduce((allMoney, item) => {
      if (item.serviceType == 1) {
        num = num + item.faceValue * item.singleNum;
        return num;
      }
    }, 0)//初始为0
    num = num.toFixed(2);
    setAllMoney(num);

    let allsingleNum = 0;
    let allNums = nowShowList.reduce((allCont, item) => {
      allsingleNum = allsingleNum + item.singleNum;
      return allsingleNum;
    }, 0)//初始为0
    setAllCont(allsingleNum);

    allObj.allCont = allsingleNum;
    allObj.allMoney = num;
    sendContAndMoney(allObj)
  }

  //发送数量，总额给父组件
  let sendContAndMoney = (data) => {
    dispatch({
      type: 'cardgrantManageModel/setAllObj',
      payload: data
    })
  }
  let [isHandelDel, setIsHandelDel] = useState(false);//是否点击过移除
  // 1选中的卡券数组
  const subList = (obj) => {
    console.log(obj, 'obj')

    let _list = JSON.parse(JSON.stringify(VOList));
    _list.push(obj);
    setVOList(_list);

    if (newDetailList == undefined) {//新增
      compData.detailList = _list;
      compute(_list);//计算
    } else {//编辑
      if (isHandelDel) {
        setNewDetailList(_list);
        compData.detailList = _list;
        compute(_list);//计算
      } else {
        let longDetailList = _list.concat(detailList);//编辑进入添加卡券时的加长数组
        setNewDetailList(longDetailList);
        compData.detailList = longDetailList;
        compute(longDetailList);//计算
      }
    }

    sendData(compData);
  }

  //发送数据给父组件
  let sendData = (data) => {
    dispatch({
      type: 'cardgrantManageModel/setCompData',
      payload: data
    })
  }



  // 有效期形势
  let validityText = (text, all) => {
    return <>
      {
        newDetailList == undefined ?
          all.useValidType == 1 ?
            <span>{all.effectiveDays ? (all.effectiveDays || 0) : (all.useValidDays || 0)}天(发放后立即生效)</span>
          :
          all.useValidType == 2 ?
            <span>{all.effectiveDays  ? (all.effectiveDays || 0) : (all.useValidDays || 0)}天（领取后立即生效）</span>
          :
          all.effectDateType == 1 ?
            <span>{all.effectStartDate }~{all.effectEndDate}</span>
          : 
            <span>{all.effectiveDays}天</span>
        :
          all.effectStartDate && all.effectEndDate ? 
            <span>{all.effectStartDate }~{all.effectEndDate}</span>
          :
          all.useValidType == 1 ?
            <span>{all.effectiveDays ? (all.effectiveDays || 0) : (all.useValidDays || 0)}天(发放后立即生效)</span>
          :
          all.useValidType == 2 ?
            <span>{all.effectiveDays  ? (all.effectiveDays || 0) : (all.useValidDays || 0)}天（领取后立即生效）</span>
          :
            <span>{all.effectiveDays}天</span>
      }
    </>
  }

  // 领取有效期
  let receiveRender = ( text, record) => {
    return <span>{ isCardRadioTabs==4 || isCardRadioTabs==3 || isCardRadioTabs==2? `${record.receiveLimitDays}天` : `${record.effectiveStartDate}~${record.effectiveEndDate}`}</span>
  }


  let option = (text, all, index) => {
    // 移除
    let handelRemove = () => {
      if (detailList == undefined) {//新增
        let newVOList = JSON.parse(JSON.stringify(VOList))//数据
        for (let i = 0; i < newVOList.length; i++) {
          if (index == i) {
            newVOList.splice(i, 1);//删除的这一个,arr是需要的
            setVOList(newVOList);
            compute(newVOList);//计算

            compData.detailList = newVOList;
            sendData(compData);
          }
        }
      } else {//编辑进入
        // =====编辑进入时=======
        setIsHandelDel(true);//点过移除时变true
        let _newDetailList = JSON.parse(JSON.stringify(newDetailList))//数据
        for (let i = 0; i < _newDetailList.length; i++) {
          if (index == i) {
            _newDetailList.splice(i, 1);//删除的这一个,arr是需要的
            setNewDetailList(_newDetailList);//用于渲染
            compute(_newDetailList);//计算
            setVOList(_newDetailList)//用于更新添加后当前最新数据

            compData.detailList = _newDetailList;//编辑
            sendData(compData);
          }
        }

        // =====编辑进入时=======
      }
    }
    return <a onClick={handelRemove}>移除</a>
  }

  // 添加卡券
  let addCoupons = () => {
    if (detailList == undefined) {//新增
      if (VOList.length < 20) {
        setIsModalVisible(true)
      } else {
        message.warning('卡券最多只能添加20条！')
      }

    } else {//编辑
      if (newDetailList.length < 20) {
        setIsModalVisible(true)
      } else {
        message.warning('卡券最多只能添加20条！')
      }
    }
  }

  return (
    <>
      <div className={style.listTitle}>
        <h3 style={{ margin: '30px' }}>发放内容</h3>
        <div className={style.btns}>
          <Button style={{ margin: '10px' }} htmlType="button" type="primary" onClick={addCoupons}>添加卡券</Button>
        </div>
      </div>

      <Table
        dataSource={newDetailList == undefined ? VOList : newDetailList}
        pagination={false}>
        <Column title="卡券编号" dataIndex="skuCardNo" key="skuCardNo" />
        <Column title="卡券名称" dataIndex="skuCardName" key="skuCardName" />
        <Column title="卡券品类" dataIndex="skuCardCategoryName" key="skuCardCategoryName" />
        <Column title="面值" dataIndex="faceValue" key="faceValue" />
        <Column width={140} title="使用门槛" dataIndex="isUseThreshold" key="isUseThreshold" 
          render={(isUseThreshold, record) => useThresholdRender(isUseThreshold, record)}
        />
        {
          isCardRadioTabs == 4 ? '' :
            <Column title="单批数量" dataIndex="singleNum" key="singleNum" />
        }
        <Column title={ <div>领取有效期&nbsp;
          <Tooltip placement='top' title='每个券领取有效期存在不一致情况，超出有效期的券将自动失效无法领取'><QuestionCircleOutlined /></Tooltip>
        </div>} 
        dataIndex="faceValue" key="faceValue"
        render={(text, record) => receiveRender(text, record)} />
        <Column
          title={<div>使用有效期&nbsp;
            <Tooltip placement='top' title='若导入特殊名单模板中含有效期，最终以名单中为准！'>
              <QuestionCircleOutlined />
            </Tooltip>
          </div>}
          dataIndex="validity" key="validity"
          render={(text, all) => validityText(text, all)}
        />
        <Column title="供应商" dataIndex="serviceType" key="serviceType"
          render={(text, all) => {
            return <span>{text == 1 ? '壹路通' : text == 2 ? '第三方' : ''}</span>
          }}
        />
        <Column title="可否转赠" dataIndex="isGive" key="isGive"
          render={(text, all) => {
            return <span>{text == 1 ? '否' : text == 2 ? '是' : ''}</span>
          }}
        />
        <Column title="操作" dataIndex="option" key="option"
          render={(text, all, index) => option(text, all, index)}
        />
      </Table>

      {
        isCardRadioTabs == 0 ?
          <div style={{ marginTop: '20px' }}>注：单个批次发放总卡券数不得超过10万张，计算方式为名单中「发放次数」的总和 * 发放内容中所有卡券「单批数量」的总和</div>
          :
          isCardRadioTabs == 2 ?
            <div style={{ marginTop: '20px' }}>注：单个批次发放总卡券数不得超过10万张，计算方式为名单中「兑换码数量」 * 发放内容中所有卡券「单批数量」的总和</div>
            : ''
      }
      {/* 添加卡券列表 */}
      {
        isModalVisible ?
          <AddCouponsModal isModalVisible={isModalVisible} editCardPackageFlag={editInfo && editInfo.cardPackageFlag}
            closeModal={() => { setIsModalVisible(false) }} subList={subList} />
          : ''
      }
    </>
  )
}

export default connect(({ cardgrantManageModel }) => ({
  isCardRadioTabs: cardgrantManageModel.isCardRadioTabs,//

}))(coupon)