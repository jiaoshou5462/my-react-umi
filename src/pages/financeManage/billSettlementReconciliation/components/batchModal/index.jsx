
import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Tag, Row, Col, Form, Space, Input, Table, Select, Button, Pagination, Cascader, message, Modal, Radio } from "antd"
const { TextArea } = Input;
const { Column } = Table;
import style from "./style.less";
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const batchModal = (props) => {
  let { dispatch, operatingModal, operatingToFatherValue } = props;
  let [form] = Form.useForm();
  let [pageNum, setPageNum] = useState(1);
  let [pageSize, setPageSize] = useState(10);
  let [entryList, setEntryList] = useState({});
  let [entryKeyList, setEntryKeyList] = useState([]);
  let [entryCheckList, setEntryCheckList] = useState([])
  let [callList, setCallList] = useState(false);
  let [isModalVisible, setIsModalVisible] = useState(false);// 二次入账弹框
  let [orgIdList ,setOrgIdList] = useState([]); // 分支机构
  let [batchInfo, setBatchInfo] = useState({// 批量页面入账数据
    saveType: 2,
    batchId: operatingModal.batchId,
    billType: operatingModal.type==7 ? 2 : 1,
    channelId: operatingModal.channelId,
    platformType: 2,
    orgId: null,
    orgName: '',
  })
  let [batchCheckInfo, setBatchCheckInfo] = useState({// 批量入账勾选
    channelId: operatingModal.channelId,
    platformType: 2,
    saveType: 2,
    type: operatingModal.type==7 ? 2 : 1, 
    userId: JSON.parse(localStorage.getItem('tokenObj')).userId,
    orgId: null,
    orgName: '',
  })
  let [choiceInfo, setChoiceInfo] = useState({// 全选入账数据
    batchId: operatingModal.batchId, //父级组件传递过来的批次id
    channelId: operatingModal.channelId,
    total: operatingModal.total,
    saveType: 2,
    platformType: 2,
    billType: operatingModal.type==7 ? 2 : 1,
    orgId: null,
    orgName: '',
  })

  useEffect(() => {
    console.log(operatingModal, 46)
    if (operatingModal.modalName == 'entry') {
      if (batchInfo.saveType == 2) {
        queryChannelBillName();
        queryOrgId(); 
      } else {
        queryAvailableBillList(); 
      }
    }
  }, [callList])
  // 查询账单name
  let queryChannelBillName = () => {
    dispatch({
      type: 'billSettlementReconciliationModel/queryChannelBillName',
      payload: {
        method: 'postJSON',
        params: {
          billType: operatingModal.type==7 ? 2 : 1 ,
          channelId: operatingModal.channelId,
        },
      },
      callback: res => {
        form.setFieldsValue({
          billName: res.body.billName
        })
      }
    });
  }

  // 确认入账已有账单
  let queryAvailableBillList = () => {
    dispatch({
      type: 'billSettlementReconciliationModel/queryAvailableBillList',
      payload: {
        method: 'postJSON',
        params: {
          billType: operatingModal.type==7 ? 2 : 1,
          channelId: operatingModal.channelId,
          pageNum,
          pageSize
        },
      },
      callback: res => {
        setEntryList(res.body)
      }
    });
  }

  let orgNameInfo = null; // 用来存储查询到得所属分支机构name属性
  // 遍历获取所属分支机构
  let queryOrgName = (treeList, id) => {
    treeList.forEach(item => {
      if(item.id == id) {
        orgNameInfo = item;
      }else{
        if(item.childOrganizations.length>0 && item.childOrganizations[0].id){
          queryOrgName(item.childOrganizations, id);
        }
      } 
    })
    return orgNameInfo
  }

  // 入账onOk
  let entry = () => {
    let formValue = JSON.parse(JSON.stringify(form.getFieldValue()));
    if(operatingModal.modalType==1) { // 批量导入时
      let entryOk = JSON.parse(JSON.stringify(batchInfo));
      if(batchInfo.saveType==2) { 
        entryOk.billName = formValue.billName;
        entryOk.remark = formValue.remark || '';
        if(formValue.orgId && formValue.orgId.length>0){
          formValue.orgId=formValue.orgId[formValue.orgId.length-1]; 
          let orgNameInfo = queryOrgName(orgIdList, formValue.orgId);
          entryOk.orgName = orgNameInfo.name;
          entryOk.orgId = orgNameInfo.id;
        }else {
          delete entryOk.orgId;
          delete entryOk.orgName;
        }
        delete entryOk.billId;
        setBatchInfo(entryOk);
        return setIsModalVisible(true);
      }else {
        if(entryCheckList && entryCheckList.length> 0) {
          entryOk.billId = entryCheckList[0].billId;
          delete entryOk.remark;
          delete entryOk.billName;
          setBatchInfo(entryOk);
          return setIsModalVisible(true);
        }else {
          return message.warning('请选择账单！')
        }
      }
    }
    if(operatingModal.modalType==2) { // 单选时操作
      let batchCheckObj = JSON.parse(JSON.stringify(batchCheckInfo));
      batchCheckObj.objectIdList = operatingModal.objectIdList;
      if(batchCheckObj.saveType==2) {
        batchCheckObj.billName = formValue.billName;
        batchCheckObj.remark = formValue.remark || '';
        if(formValue.orgId && formValue.orgId.length>0){
          formValue.orgId=formValue.orgId[formValue.orgId.length-1]; 
          let orgNameInfo = queryOrgName(orgIdList, formValue.orgId);
          batchCheckObj.orgName = orgNameInfo.name;
          batchCheckObj.orgId = orgNameInfo.id;
        }else {
          delete batchCheckObj.orgId;
          delete batchCheckObj.orgName;
        }
        delete batchCheckObj.billId;
        setBatchCheckInfo(batchCheckObj);
        return setIsModalVisible(true)
      }else {
        if(entryCheckList && entryCheckList.length > 0) {
          batchCheckObj.billId = entryCheckList[0].billId;
          delete batchCheckObj.remark;
          delete batchCheckObj.billName;
          console.log(batchCheckObj)
          setBatchCheckInfo(batchCheckObj);
          return setIsModalVisible(true);
        }else {
          return message.warning('请选择账单！')
        }
      }
    }
    if(operatingModal.modalType==3) { // 全选时执行的操作
      let choiceObj = JSON.parse(JSON.stringify(choiceInfo));
      if(choiceObj.saveType==2) {
        if(formValue.orgId && formValue.orgId.length>0){
          formValue.orgId=formValue.orgId[formValue.orgId.length-1]; 
          let orgNameInfo = queryOrgName(orgIdList, formValue.orgId);
          choiceObj.orgName = orgNameInfo.name;
          choiceObj.orgId = orgNameInfo.id;
        }else {
          delete choiceObj.orgName;
          delete choiceObj.orgId;
        }
        choiceObj.billName = formValue.billName;
        choiceObj.remark = formValue.remark || '';
        delete choiceObj.billId;
        setChoiceInfo(choiceObj);
        return setIsModalVisible(true)
      }else {
        if(entryCheckList && entryCheckList.length > 0) {
          choiceObj.billId = entryCheckList[0].billId;
          delete choiceObj.remark;
          delete choiceObj.billName;
          setChoiceInfo(choiceObj);
          return setIsModalVisible(true);
        }else {
          return message.warning('请选择账单！')
        }
      }
    }
  }

  // 二次入账ok 
  let handleOk = () => {
    if(operatingModal.modalType==1) return balanceImportCreditConfirm(batchInfo);
    if(operatingModal.modalType==2) return batchOperateCredit(batchCheckInfo);
    if(operatingModal.modalType==3) return allBatchOperateCredit(choiceInfo);
  }

  // 已有账单列表
  let columns = [
    { title: '账单月份', dataIndex: 'balancePeriod', key: 'balancePeriod' },
    { title: '账单ID', dataIndex: 'billId', key: 'billId', },
    { title: '业务类型', dataIndex: 'billTypeName', key: 'billTypeName' },
    { title: '客户名称', dataIndex: 'channelName', key: 'channelName' },
    { title: '入账笔数', dataIndex: 'confirmedCount', key: 'confirmedCount' },
    { title: '入账金额（元）', dataIndex: 'confirmedAmount', key: 'confirmedAmount' },
    { title: '账单状态', dataIndex: 'billStatusName', key: 'billStatusName' }
  ];
  // 入账方式change
  let entryChange = (e) => {
    let entryInfo = JSON.parse(JSON.stringify(batchInfo));
    let batchCheckObj = JSON.parse(JSON.stringify(batchCheckInfo));
    let choiceObj = JSON.parse(JSON.stringify(choiceInfo));
    entryInfo.saveType = e;
    batchCheckObj.saveType = e;
    choiceObj.saveType = e;
    setBatchInfo(entryInfo);
    setBatchCheckInfo(batchCheckObj);
    setChoiceInfo(choiceObj);
    setCallList(!callList);
  }
  /*点击下一页上一页(参数是改变后的页码及每页条数)*/
  let onNextChange = (page, pageSize) => {
    setPageNum(page);
    setPageSize(pageSize);
    setCallList(!callList)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    setPageNum(page);
    setPageSize(pageSize);
    setCallList(!callList)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNum} / ${totalPage}  页`
  }
  /*已有账单 选中 配置*/
  const rowSelection = {
    onChange: (key, value) => {
      setEntryKeyList(key)
      setEntryCheckList(value || []);
    },
    type: 'radio',
    hideSelectAll: true,
    selectedRowKeys: entryKeyList
  }
  // 批量入账确认
  let balanceImportCreditConfirm = (params) => {
    dispatch({
      type: 'billSettlementReconciliationModel/balanceImportCreditConfirm',
      payload: {
        method: 'postJSON',
        params,
      },
      callback: res => {
        if(res.result.code ==0 ) {
          message.success(`${res.result.message},两秒后返回列表页面!`)
          setTimeout(()=> {
            operatingToFatherValue(true)
          },1000)
        }else {
          message.error(res.result.message)
        }
      }
    });
  }

  // 批量确认入账操作(勾选框)
  let batchOperateCredit = (params) => {
    dispatch({
      type: 'billSettlementReconciliationModel/batchOperateCredit',
      payload: {
        method: 'postJSON',
        params,
      },
      callback: res => {
        if(res.result.code==0) {
          message.success(res.result.message);
          return operatingToFatherValue(true);
        }else {
          message.error(res.result.message)
        }
      }
    });
  }

  // 全选批量二次入账  
  let allBatchOperateCredit = (params) => {
    dispatch({
      type: 'billSettlementReconciliationModel/allBatchOperateCredit',
      payload: {
        method: 'postJSON',
        params: { 
          ...params
        }
      },
      callback: res => {
        if(res.result.code==0) {
          message.success(res.result.message);
          return operatingToFatherValue(true);
        }else {
          message.warning(res.result.message)
        }
      }
    });
  }

  // 分支机构
  let queryOrgId = () => {
    dispatch({
      type: 'billSettlementReconciliationModel/queryOrgId',// 命名空间名/effect内的函数名
      payload: {
        method: 'postJSON',
        params: {
          channelId: operatingModal.channelId,
          platformType: 'channel',
          userId: JSON.parse(localStorage.getItem('tokenObj')).userId,
        }
      },
      callback: res => {
        if(res.result.code==0) {
          if(res.body.channelOrganizations && res.body.channelOrganizations.length>0) {
            let tree = eachTreeList(res.body.channelOrganizations);
            setOrgIdList([...tree]);
          }
        }else {
          message.error(res.result.message);
        }
      }
    });
  }
  // 构建树
  const eachTreeList = (treeList) => {
    let _treeList = [];
    for (let item of treeList) {
      let obj = {
        ...item,
        value:item.id,
        label:item.name,
      };
      if (item.childOrganizations.length > 0 && item.childOrganizations[0].id) {
        obj.children = eachTreeList(item.childOrganizations);
      }
      _treeList.push(obj);
    }
    return _treeList;
  }

  return (
    <>
      {/* 入账 */}
      <Modal title="生成账单" width={1200} visible={operatingModal.modalName == 'entry'} footer={null} onCancel={() => { operatingToFatherValue(false) }} >
        <Form form={form} onFinish={entry}>
          <div style={{ overflow: 'hidden' }}>
            <Row>
              <Col span={24}>
                <Form.Item label="入账方式" labelCol={{ flex: '0 0 120px' }}>
                  <Radio.Group defaultValue={batchInfo.saveType} onChange={(e) => { entryChange(e.target.value) }} value={batchInfo.saveType}>
                    <Radio value={2}>新增账单</Radio>
                    <Radio value={1}>加入已有账单</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              {
                batchInfo.saveType == 2 ?
                  <>
                    {
                      orgIdList.length> 0? 
                      <Col span={24}>
                        <Form.Item name='orgId' label="所属分支机构" labelCol={{ flex: '0 0 120px' }}>
                          <Cascader
                            options={orgIdList}
                            placeholder="请选择分支机构"
                            showSearch
                            onSearch={value => console.log(value)}
                            changeOnSelect
                          />
                        </Form.Item>
                      </Col>: null
                    }
                    <Col span={24}>
                      <Form.Item name='billName' label="账单名称" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true, message: "请输入账单名称" }]}>
                        <Input placeholder='请输入账单名称' />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name='remark' label="账单说明" labelCol={{ flex: '0 0 120px' }}>
                        <TextArea showCount rows={4} placeholder="请输入账单说明" />
                      </Form.Item>
                    </Col>
                  </>
                  :
                  <>
                    <Col span={24}>
                      <Table
                        locale={{ emptyText: '暂无数据' }}
                        rowSelection={{ ...rowSelection }}
                        rowKey={(record, index) => index}
                        pagination={false}
                        columns={columns}
                        dataSource={entryList.list}
                      />
                    </Col>
                    <Col span={24}>
                      <Pagination
                        className={style.pagination}
                        current={pageNum} //选中第一页
                        pageSize={pageSize} //默认每页展示10条数据
                        total={entryList.total} //总数
                        onChange={onNextChange} //切换 页码时触发事件
                        pageSizeOptions={['10', '20', '50', '100']}
                        onShowSizeChange={onSizeChange}
                        showTotal={onPageTotal}
                      />
                    </Col>
                  </>
              }
            </Row>
            <Row justify="end" align="end">
              <Space size={20}>
                <Button onClick={() => { operatingToFatherValue(false) }}>取消</Button>
                <Button type="primary" htmlType="submit">确认</Button>
              </Space>
            </Row>
          </div>
        </Form>
      </Modal>
      {/* 二次生成账单弹框 */}
      <Modal title="生成账单" visible={isModalVisible} onOk={handleOk} onCancel={() => { setIsModalVisible(false) }}>
        <p>确认生成账单？</p>
      </Modal>
    </>
  )
}

export default connect(({ }) => ({
}))(batchModal)







