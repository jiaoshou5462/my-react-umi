import React, { useState, useEffect, useRef, useContext } from 'react';
import { connect, history } from 'umi';
import {
  Row, Col, Form, Space, Radio, Input, Table, Select, Divider, Button, DatePicker,
  Pagination, Modal, message,
} from "antd"
import moment from 'moment'
import style from './modalStyle.less';
import { useThresholdRender } from '@/pages/cardgrantManage/grantList/common.js'

const { TextArea } = Input;
const { Option, OptGroup } = Select;

// 添加卡包弹框
const addCardbagModal = (props) => {
  let { dispatch, isCardbagModalVisible, closeCardbagModal, subCardbagList, couponCardbagList, couponCardbagTotal, cardbagIdList, cardbagByCouponNumList } = props;
  let [form] = Form.useForm();

  let [list, setCardList] = useState([]);//复制的卡券列表.
  let [listArr, setListArr] = useState([]);//
  let [radioObj, setRadioObj] = useState({})//选中的卡券对象

  let [payload, setPayload] = useState({
    couponPackageName: "",//基础卡券名称
    couponPackageNo: "",//	基础卡券编号
    pageNum: 1,
    pageSize: 10,
  })

  useEffect(() => {
    selsctQueryPackage()
  }, [])

  useEffect(() => {
    channelCouponPackage()
  }, [payload])

  //卡包ID下拉
  let selsctQueryPackage = () => {
    dispatch({
      type: 'cardgrantManageModel/selsctQueryPackage',
      payload: {
        method: 'postJSON',
        params: {}
      }
    })
  }

  //基础卡包列表
  let channelCouponPackage = () => {
    dispatch({
      type: 'cardgrantManageModel/channelCouponPackage',
      payload: {
        method: 'postJSON',
        params: payload
      }
    })
  }

  // 搜索
  let onFinish = (values) => {
    let data = {
      couponPackageName: values.couponPackageName,//卡包名称
      couponPackageNo: values.couponPackageNo,//卡包ID
      pageNum: 1,
      pageSize: 10,
    }
    setPayload(data);
  }

  // 点击列表单选项
  const clickRadio = (text, all) => {
    for (let i = 0; i < list.length; i++) {
      list[i].hashCode == all.hashCode ? list[i].flag = true : list[i].flag = false;
    }
    setCardList(JSON.parse(JSON.stringify(list)))//要深拷贝，数组不渲染视图

    radioObj.couponPackageNo = all.couponPackageNo//卡包编号
    radioObj.couponPackageName = all.couponPackageName//卡包名称
    radioObj.faceValue = all.faceValue//面值
    // radioObj.quotaPrice = all.quotaPrice//
    radioObj.totalCouponNum = all.totalCouponNum//卡券数量（张）
    radioObj.quotationItemId = all.quotationItemId	// 报价单明细id
    radioObj.quotationNo = all.quotationNo	// 关联报价单编号
    radioObj.receiveValidDays = all.receiveValidDays // 领取有效天数
    radioObj.isUseThreshold = all.isUseThreshold// 卡包使用门槛
    radioObj.useThresholdAmount = all.useThresholdAmount// 卡包使用门槛
    setRadioObj(radioObj);
  }

  useEffect(() => {
    setCardList(couponCardbagList)
  }, [couponCardbagList])

  let columns = [
    {
      title: '', dataIndex: 'couponPackageNo',
      render: (text, data) => {
        return <Radio onClick={() => { clickRadio(text, data) }} checked={data.flag}></Radio>
      },
    },
    { title: '卡包编号', dataIndex: 'couponPackageNo', key: 'couponPackageNo' },
    { title: '卡包名称', dataIndex: 'couponPackageName', key: 'couponPackageName' },
    { width: 120, title: '面值（元）', dataIndex: 'faceValue', key: 'faceValue' },
    { title: '领取有效天数', dataIndex: 'receiveValidDays', key: 'receiveValidDays', render: (receiveValidDays, record) => receiveValidDays ? <span>{receiveValidDays}</span> : <span>不限制</span>},
    {
      width: '20%', title: '卡券数量（张）', dataIndex: 'totalCouponNum', key: 'totalCouponNum',
      render: (text, all) => {
        return <a onClick={() => { showDetail(text, all) }}>{text}</a>
      }
    }
  ]

  // 点击数量展示明细
  let showDetail = (text, all) => {
    // 卡包明细
    dispatch({
      type: 'cardgrantManageModel/detailCardByCouponNum',
      payload: {
        method: 'get',
        params: {},
        packageNo: all.couponPackageNo,//卡包编号
        quotationItemId: all.quotationItemId
      }
    })
  }

  let detailCardByCouponNum = () => {
    dispatch({
      type: 'cardgrantManageModel/detailCardByCouponNum',
      payload: {
        method: 'get',
        params: {},
        packageNo: couponPackageNo//卡包编号
      }
    })
  }

  // 卡包详情
  const cardbagcolumns = [
    { title: '基础卡券号', dataIndex: 'couponSkuNo', key: 'couponSkuNo' },
    { title: '卡券名称', dataIndex: 'couponSkuName', key: 'couponSkuName' },
    { title: '卡券品类', dataIndex: 'couponCategoryName', key: 'couponCategoryName' },
    {
      title: '卡券种类', dataIndex: 'discountsType', key: 'discountsType',
      render: (text, all) => {
        return <>
          {
            text == 1 ? <span>优惠券</span> :
              text == 2 ? <span>优惠券</span> :
                text == 3 ? <span>打折券</span> :
                  text == 4 ? <span>兑换券</span> : ''
          }
        </>
      }
    },
    {
      title: '供应商', dataIndex: 'serviceType', key: 'serviceType',
      render: (text, all) => {
        return <>
          {
            text == 1 ? <span>壹路通</span> :
              text == 2 ? <span>第三方</span> : ''
          }
        </>
      }
    },
    {
      title: '面值类型', dataIndex: 'valueType', key: 'valueType',
      render: (text, all) => {
        return <>
          {
            text == 1 ? <span>固定面值</span> :
              text == 2 ? <span>自定义面值</span> : ''
          }
        </>
      }
    },
    { title: '面值/折扣', dataIndex: 'faceValue', key: 'faceValue' },
    { title: '使用门槛', dataIndex: 'isUseThreshold', key: 'isUseThreshold', render: (isUseThreshold, record) => useThresholdRender(isUseThreshold, record) },
    { title: '数量', dataIndex: 'couponNum', key: 'couponNum' },
    { title: '使用有效天数', dataIndex: 'useValidDays', key: 'useValidDays', render: (useValidDays, record) => useValidDays ? <span>{ useValidDays }</span> : <span>不限制</span> },
  ]



  // 添加
  let handleCouponOk = () => {
    if (Object.keys(radioObj).length) {//为0时是{}

      closeCardbagModal()
      // listArr.push(radioObj)
      // setListArr(listArr)
      // subCardbagList(listArr)//符合条件添加时，将选中的数据{}传入父组件
      subCardbagList(radioObj)//符合条件添加时，将选中的数据{}传入父组件
      message.success({
        content: '卡包添加成功！',
      })

    } else {
      message.warning({
        content: '请选择卡包！',
      })
    }
  }

  /*点击下一页上一页(参数是改变后的页码及每页条数)*/
  let onNextChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = page
    this_payload.pageSize = pageSize
    setPayload(this_payload)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = page
    this_payload.pageSize = pageSize
    setPayload(this_payload)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / payload.pageSize)
    return `共${total}条记录 第 ${payload.pageNum} / ${totalPage}  页`
  }

  return (
    <>
      <Modal width={1000} title='添加卡包' visible={isCardbagModalVisible} okText='添加' onOk={handleCouponOk} onCancel={() => { closeCardbagModal() }}>
        <h3>1.选择卡包</h3>
        <Form className={style.form__cont} form={form} onFinish={onFinish}>
          <Row justify="space-around" align="center" style={{ marginLeft: '-30px' }}>
            <Form.Item name="couponPackageName" label="卡包名称：" className={style.form__item} labelCol={{ span: 8 }}>
              <Input placeholder='请输入'></Input>
            </Form.Item>
            <Form.Item label="卡包ID：" name="couponPackageNo" className={style.form__item} labelCol={{ span: 8 }}>
              <Select placeholder="不限" allowClear>
                {
                  cardbagIdList && cardbagIdList.map((v) => <Option key={v.couponPackageNo} value={v.couponPackageNo}>{v.couponPackageName}</Option>)
                }
              </Select>
            </Form.Item>
            <Form.Item className={style.form__item} labelCol={{ span: 8 }}>
              <Button htmlType="submit" type="primary" style={{ marginLeft: '66px' }}>搜索</Button>
            </Form.Item>
          </Row>

          <Table
            bordered
            columns={columns}
            dataSource={list}
            pagination={false}
          />
          <Pagination
            className={style.pagination}
            current={payload.pageNum} //选中第一页
            pageSize={payload.pageSize} //默认每页展示10条数据
            total={couponCardbagTotal} //总数
            onChange={onNextChange} //切换 页码时触发事件
            pageSizeOptions={['10', '20', '30', '60']}
            onShowSizeChange={onSizeChange}
            showTotal={onPageTotal}
          />
        </Form>
        <h3 style={{ margin: '30px 0 20px' }}>卡包明细</h3>
        <Table
          columns={cardbagcolumns}
          dataSource={cardbagByCouponNumList}
        >
        </Table>

      </Modal>
    </>
  )

}


export default connect(({ cardgrantManageModel }) => ({
  cardbagIdList: cardgrantManageModel.cardbagIdList,
  couponCardbagList: cardgrantManageModel.couponCardbagList,
  couponCardbagTotal: cardgrantManageModel.couponCardbagTotal,
  cardbagByCouponNumList: cardgrantManageModel.cardbagByCouponNumList
}))(addCardbagModal)