import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Tag, Row, Col, Form, Descriptions, Input, Table, Select, Button, Modal, message } from "antd"
import { useThresholdRender } from '@/pages/cardgrantManage/grantList/common.js'
import style from "./style.less";
const { Column } = Table;

const cardModal = (props) => {
  let { dispatch, modalInfo, toFatherValue } = props;
  let [grantBatchPutCount, setGrantBatchPutCount] = useState({}); // 卡券卡包详情数据
  let [cardByPackageNoNotGroupByCouponList, setCardByPackageNoNotGroupByCouponList] = useState([]); // 卡包明细详情列表数据

  useEffect(()=> {
    queryGrantBatchPutCount();
    if(modalInfo.couponPackageFlag==1) return queryCardByPackageNoNotGroupByCouponNum();
  }, [])

  // 查询卡券卡包详情
  let queryGrantBatchPutCount = () => {
    dispatch({
      type: 'cardManagement/queryGrantBatchPutCount',
      payload: {
        method: 'postJSON',
        params: {
          couponSkuNo: modalInfo.couponSkuNo,// 基础卡券号
          couponPackageFlag: modalInfo.couponPackageFlag,// 卡包标识:0卡券1卡包
          quotationItemId: modalInfo.quotationItemId,// 报价单明细Id
          serviceType: modalInfo.serviceType, // 服务类型
        }
      },
      callback: res => {
        if( res.result.code == 0 ){
          setGrantBatchPutCount(res.body);
        }else {
          setGrantBatchPutCount({});
        }
      }
    });
  }
  // 查询卡包列表
  let queryCardByPackageNoNotGroupByCouponNum = () => {
    dispatch({
      type: 'cardManagement/queryCardByPackageNoNotGroupByCouponNum',
      payload: {
        method: 'get',
        packageNo: modalInfo.couponSkuNo,//卡包编号
        quotationItemId: modalInfo.quotationItemId
      },
      callback: res => {
        setCardByPackageNoNotGroupByCouponList(res.body);
      }
    })
  }

  // 已报价卡包详情columns
  let realColumns = [
    { title: '卡券编号', dataIndex: 'couponSkuNo', key: 'couponSkuNo', align: 'center'},
    { title: '卡券名称', dataIndex: 'couponSkuName', key: 'couponSkuName', align: 'center'},
    { title: '卡券品类', dataIndex: 'couponCategoryName', key: 'couponCategoryName', align: 'center'},
    { title: '卡券种类', dataIndex: 'discountsType', key: 'discountsType', align: 'center', render: (discountsType, record) => {
      return <span>{discountsType == 1 || discountsType == 2 ? '优惠券' : discountsType == 3 ? '打折券' : discountsType == 4 ? '兑换券' : ''}</span>
    }},
    { title: '卡券来源', dataIndex: 'discountsType', key: 'discountsType', align: 'center',render: (discountsType, record) => {
      return <span>{discountsType == 1 || discountsType == 2 ? '优惠券' : discountsType == 3 ? '打折券' : discountsType == 4 ? '兑换券' : ''}</span>
    }},
    { title: '供应商名称', dataIndex: 'serviceType', key: 'serviceType', align: 'center', render: (serviceType, record) => <span>{serviceType==1 ? '壹路通' : '第三方'}</span> },
    { title: '面值类型', dataIndex: 'valueType', key: 'valueType', align: 'center', render: (valueType, record) => {
      return <span>{valueType==1? '固定面值' : valueType==2 ? '自定义面值' : ''}</span>
    } },
    { title: '使用门槛', dataIndex: 'isUseThreshold', key: 'isUseThreshold', align: 'center', render: (isUseThreshold, record) => useThresholdRender(isUseThreshold, record)  },
    { title: '面值/折扣', dataIndex: 'faceValue', key: 'faceValue', align: 'center' },
    { title: '使用有效天数', dataIndex: 'useValidDays', key: 'useValidDays', render: (useValidDays, record) => useValidDays ? <span>{ useValidDays }</span> : <span>不限制</span> },
  ];

  return (
    <>
      {/* 卡券详情  &&  卡包详情 */}
      {
        Object.keys(grantBatchPutCount).length  != 0 ? 
          <Modal width={modalInfo.couponPackageFlag==0 ? '50%': '80%'} footer={[ <Button type="primary" onClick={()=> {toFatherValue(false)}}>关闭</Button> ]}
          title={modalInfo.couponPackageFlag==0 ? '卡券详情' : '卡包详情'} visible={modalInfo.couponPackageFlag==0 || modalInfo.couponPackageFlag==1}
          onCancel={()=> {toFatherValue(false)}}>
            {
              modalInfo.couponPackageFlag==0?
              <div>
                <Descriptions title="卡券信息" style={{marginBottom: '30px'}}>
                  <Descriptions.Item label="卡券编号">{modalInfo.couponSkuNo}</Descriptions.Item>
                  <Descriptions.Item label="卡券名称">{modalInfo.couponSkuName}</Descriptions.Item>
                  <Descriptions.Item label="卡券品类">{modalInfo.couponCategoryName}</Descriptions.Item>
                  <Descriptions.Item label="卡券面值">{modalInfo.faceValue}</Descriptions.Item>
                  <Descriptions.Item label="供应商">{modalInfo.serviceType==1 ? '壹路通' : '第三方'}</Descriptions.Item>
                  <Descriptions.Item label="生效开始时间限制">{modalInfo.useValidType==1 ? '从实际发放日开始' : modalInfo.useValidType==2 ? '从实际领取率开始' : modalInfo.useValidType==3 ? '投放时配置' : '不限制'}</Descriptions.Item>
                  <Descriptions.Item label="领取有效天数">{modalInfo.receiveValidDays ? modalInfo.receiveValidDays : '不限制'}</Descriptions.Item>
                  <Descriptions.Item label="使用有效天数">{
                    modalInfo.useValidDays ? 
                      modalInfo.useValidType==1 ? `${modalInfo.useValidDays}天(发放后立即生效)` : 
                      modalInfo.useValidType==2 ? `${modalInfo.useValidDays}天(领取后立即生效)` : 
                      modalInfo.useValidType==3 ? `${modalInfo.useValidDays}天` : `${modalInfo.useValidDays}天`
                    :  '不限制' 
                  }</Descriptions.Item>
                </Descriptions>
                <Descriptions title="投放统计" style={{marginBottom: '30px'}}>
                  <Descriptions.Item label="累计投放张数">{grantBatchPutCount.totalPutCount}</Descriptions.Item>
                  <Descriptions.Item label="本月投放张数">{grantBatchPutCount.monthPutCount}</Descriptions.Item>
                  <Descriptions.Item label="本月投放人数">{grantBatchPutCount.monthPutPeopleCount}</Descriptions.Item>
                  <Descriptions.Item label="累计领取张数">{grantBatchPutCount.totalReceiveCount}</Descriptions.Item>
                  <Descriptions.Item label="本月领取张数">{grantBatchPutCount.monthReceiveCount}</Descriptions.Item>
                  <Descriptions.Item label="本月领取人数">{grantBatchPutCount.monthReceivePeopleCount}</Descriptions.Item>
                </Descriptions>
              </div>
              :
              Object.keys(cardByPackageNoNotGroupByCouponList).length  != 0 ?             
              <div>
                <Descriptions style={{marginBottom: '30px'}}>
                  <Descriptions.Item label="累计投放数量">{grantBatchPutCount.totalPutCount}</Descriptions.Item>
                  <Descriptions.Item label="本月投放数量">{grantBatchPutCount.monthPutCount}</Descriptions.Item>
                  <Descriptions.Item label="本月投放人数">{grantBatchPutCount.monthPutPeopleCount}</Descriptions.Item>
                  <Descriptions.Item label="累计领取数量">{grantBatchPutCount.totalReceiveCount}</Descriptions.Item>
                  <Descriptions.Item label="本月领取数量">{grantBatchPutCount.monthReceiveCount}</Descriptions.Item>
                  <Descriptions.Item label="本月领取人数">{grantBatchPutCount.monthReceivePeopleCount}</Descriptions.Item>
                </Descriptions>
                <Table columns={realColumns} dataSource={cardByPackageNoNotGroupByCouponList} pagination={false}></Table>
              </div> : null
            }
          </Modal> : null
      }
    </>
  )
}


export default connect(({  }) => ({

}))(cardModal)







