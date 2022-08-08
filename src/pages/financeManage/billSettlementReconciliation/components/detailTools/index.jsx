
import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Form, Row, Col, Input, Table, Select, Button, Pagination, message, Modal, Checkbox, Cascader, Image, Radio, Space } from "antd";
import { uploadIcon } from '@/services/activity.js';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import style from "./style.less";
const { TextArea } = Input;
let headers = { "accessToken": localStorage.getItem('token') };
const tokenObj = localStorage.getItem('tokenObj') ? JSON.parse(localStorage.getItem('tokenObj')) : {};
const detailToolsPage = (props) => {
  let { dispatch, factBalanceDetail, queryFactBalanceDetail } = props;
  let uType = history.location.query.utype;
  let [form] = Form.useForm();
  let [formEntry] = Form.useForm();
  let [isChecked, setIsChecked] = useState(false);// 设置初始值是否选中
  let [orgIdList ,setOrgIdList] = useState([]); // 分支机构
  //操作记录
  let [isModalOperate, setIsModalOperate] = useState(false);
  let [operateList, setOperateList] = useState([]);
  let operateColumns = [
    { title: '操作人', dataIndex: 'createUserName', key: 'createUserName', width: '150px' },
    { title: '操作时间', dataIndex: 'createTimeStr', key: 'createTimeStr', width: '200px' },
    { title: '操作', dataIndex: 'operContent', key: 'operContent', width: '160px' },
    { title: '备注', dataIndex: 'remark', key: 'remark' }
  ];
  let operRecord = () => {
    queryRecordList();
    setIsModalOperate(true);
  }


  //状态请求明细
  let operatingInfo = {
    billId: '', // billId  账单ID(saveType = 1时 不能为空)
    billName: '', // billName  账单名称 当saveType = 2时 此字段必填
    channelId: factBalanceDetail.channelId, // channelId  渠道id(operateStatus = 5 或者=6 时不能为空)		
    noBalanceReason: '', // noBalanceReason  不结算原因(当不结算时 此字段必填)
    objectId: factBalanceDetail.objectId, // objectId  结算明细ID
    objectionReason: '',   //异议原因
    operateStatus: null, // operateStatus   操作状态：1确认，2撤回，3不结算，4重新结算，5入账，6撤销入账,7异议,8撤销异议
    platformType: 2, // platformType   平台类型: 1：壹路通,2:智客通，3:服务商
    remark: '', // remark    入账说明,入账方式saveType=2时必填
    saveType: null, // saveType   入账方式 1：已有账单入账 2：新增账单入账(operateStatus = 5时不能为空)
    serviceId: factBalanceDetail.serviceId, // serviceId   服务项目id
    type: factBalanceDetail.type, // type   账单类型 1：据实服务(场景服务) 2：预采投放(营销投放) 3：数字SaaS 4:增值服务
    userId: tokenObj.userName, // userId   操作人账号(取当前登录人) 
    sortNo: factBalanceDetail.sortNo || '',
    orgId: null,
    orgName: '',
  }

  //撤销入账
  let onToolsPrize = (type, txt, btn) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      width: 320,
      content: txt,
      okText: btn,
      cancelText: '取消',
      onOk () {
        if (type == 2) {    //撤销入账
          let toOperatingInfo = operatingInfo;
          toOperatingInfo.operateStatus = 6;
          updateOperateStatus(toOperatingInfo);
        }
      },
    })
  };

  //异议
  let [isModalNotAccount, setIsModalNotAccount] = useState(false);
  let [notAccountTxt, setNotAccountTxt] = useState('');
  let notAccountConfig = () => {
    if (!notAccountTxt) {
      message.error('请填写提出异议并退回的原因!');
    } else {
      let toOperatingInfo = operatingInfo;
      toOperatingInfo.operateStatus = 7;
      toOperatingInfo.objectionReason = notAccountTxt;
      updateOperateStatus(toOperatingInfo);
    }
  }
  let changeNotAccount = (e) => {
    setNotAccountTxt(e.target.value)
  }

  //撤销确认
  let withdraw = () => {
    let toOperatingInfo = operatingInfo;
    toOperatingInfo.operateStatus = 2;
    updateOperateStatus(toOperatingInfo);
  }
  //撤销异议
  let withdrdissent = () => {
    let toOperatingInfo = operatingInfo;
    toOperatingInfo.operateStatus = 8;
    updateOperateStatus(toOperatingInfo);
  }

  //确认
  let modelConfirm = () => {
    let toOperatingInfo = operatingInfo;
    toOperatingInfo.operateStatus = 1;
    updateOperateStatus(toOperatingInfo);
  }


  //入账
  let [isModalEntry, setIsModalEntry] = useState(false);
  let [entryKeyList, setEntryKeyList] = useState([]);
  let [entryCheckList, setEntryCheckList] = useState([])
  let [entryList, setEntryList] = useState({});
  let [saveType, setSaveType] = useState(2);
  let [callList, setCallList] = useState(false);
  let [pageNum, setPageNum] = useState(1);
  let [pageSize, setPageSize] = useState(10);
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
  //入账按钮
  let modelEntry = () => {
    queryAvailableBillList();
    queryChannelBillName();
    queryOrgId();
    setIsModalEntry(true);
    setSaveType(2);
    setEntryKeyList([...[]]);
    setEntryCheckList([...[]]);
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
  };
  //入账方式
  let entryChange = (e) => {
    setSaveType(e);
    setCallList(!callList)
  }
  /*点击下一页上一页(参数是改变后的页码及每页条数)*/
  let onNextChange2 = (page, pageSize) => {
    setPageNum(page);
    setPageSize(pageSize);
    setCallList(!callList)
  }
  /*改变每页条数*/
  let onSizeChange2 = (page, pageSize) => {
    setPageNum(page);
    setPageSize(pageSize);
    setCallList(!callList)
    onPageTotal2()
  }
  /*显示总条数和页数*/
  let onPageTotal2 = (total, range) => {
    let totalPage = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNum} / ${totalPage}  页`
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

  // 入账确认
  let entry = (vaule) => {
    let toOperatingInfo = { ...operatingInfo };
    toOperatingInfo.operateStatus = 5;
    let toFormEntry = JSON.parse(JSON.stringify(formEntry.getFieldsValue()));
    toOperatingInfo.saveType = vaule.saveType;
    if (vaule.saveType == 2) {
      if(toFormEntry.orgId && toFormEntry.orgId.length>0){
        toFormEntry.orgId=toFormEntry.orgId[toFormEntry.orgId.length-1]; 
        let orgNameInfo = queryOrgName(orgIdList, toFormEntry.orgId);
        toOperatingInfo.orgName = orgNameInfo.name;
        toOperatingInfo.orgId = orgNameInfo.id;
      }else {
        delete toOperatingInfo.orgId;
        delete toOperatingInfo.orgName;
      }
      toOperatingInfo.billName = vaule.billName;
      toOperatingInfo.remark = vaule.remark;
      updateOperateStatus(toOperatingInfo);
    } else {
      if (entryCheckList && entryCheckList.length > 0) {
        toOperatingInfo.billId = entryCheckList[0].billId;
        updateOperateStatus(toOperatingInfo);
      } else {
        message.warning('请选择账单！')
      }
    }
  }

  useEffect(() => {
    form.setFieldsValue({
      afterAdjustAmount: null,
      remark: ""
    });
    formEntry.setFieldsValue({
      saveType: 2,
      billName: "",
      remark: ""
    });
    localStorage.setItem("isBillFlag", 0);
  }, [])

  //操作记录
  let queryRecordList = () => {
    dispatch({
      type: 'billSettlementReconciliationModel/queryRecordList',
      payload: {
        method: 'postJSON',
        params: {
          pageNum: 1,
          pageSize: 1000,
          type: factBalanceDetail.type,
          balanceDetailId: factBalanceDetail.objectId,
          platformType:2
        }
      },
      callback: (res) => {
        if (res.result.code == 0) {
          if (res.body && res.body.length > 0) {
            setOperateList([...res.body]);
          }
        } else {
          message.error(res.result.message);
        }
      }
    }
    );
  }


  // 确认入账已有账单
  let queryAvailableBillList = () => {
    dispatch({
      type: 'billSettlementReconciliationModel/queryAvailableBillList',
      payload: {
        method: 'postJSON',
        params: {
          billType: factBalanceDetail.type,
          channelId: factBalanceDetail.channelId,
          pageNum,
          pageSize
        },
      },
      callback: res => {
        if (res.result.code == 0) {
          setEntryList(res.body)
        } else {
          message.error(res.result.message);
        }
      }
    });
  }

  // 查询账单name
  let queryChannelBillName = () => {
    dispatch({
      type: 'billSettlementReconciliationModel/queryChannelBillName',
      payload: {
        method: 'postJSON',
        params: {
          billType: factBalanceDetail.type,
          channelId: factBalanceDetail.channelId,
        },
      },
      callback: res => {
        if (res.result.code == 0) {
          formEntry.setFieldsValue({
            billName: res.body.billName,
            saveType: 2
          })
        } else {
          message.error(res.result.message);
        }
      }
    });
  }

  //更改订单状态
  let updateOperateStatus = (params) => {
    dispatch({
      type: 'billSettlementReconciliationModel/updateOperateStatus',
      payload: {
        method: 'postJSON',
        params: params
      },
      callback: (res) => {
        if (res.result.code == 0) {
          if (res.result.message) {
            message.success(res.result.message);
          } else {
            message.success('状态修改成功！');
          }
          if (res.body.isConfirm && res.body.isConfirm == 1) {   //全部确认返回列表
            Modal.success({
              content: '订单已全部确认 ，返回列表页',
              onOk () {
                localStorage.setItem("isBillFlag", 1);
                history.goBack();
              }
            });
          }else {
            if(isChecked) {// 确认走的路线
              let toObjectId = res.body.objectId ? res.body.objectId : '';
              setIsModalNotAccount(false);
              queryFactBalanceDetail(toObjectId);
              setIsModalEntry(false);
            }else {
              setIsModalNotAccount(false);
              queryFactBalanceDetail();
              setIsModalEntry(false);
            }
          }
        } else {
          message.error(res.result.message);
        }
      }
    }
    );
  }
  // checked监听事件
  let CheckboxOnChange = (e) => {
    setIsChecked(e.target.checked)
  }
  // 分支机构
  let queryOrgId = () => {
    dispatch({
      type: 'billSettlementReconciliationModel/queryOrgId',// 命名空间名/effect内的函数名
      payload: {
        method: 'postJSON',
        params: {
          channelId: factBalanceDetail.channelId,
          platformType: 'channel',
          userId: tokenObj.userId,
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
      <div className={style.block__cont}>
        <div className={style.wrap_btn_lf}>
          {
            factBalanceDetail.billFlag == 2 && uType == 2 ?
            <Checkbox onChange={CheckboxOnChange} checked={isChecked}>自动查找下一笔待确认订单</Checkbox> : null
          }
        </div>
        <div className={style.wrap_btn_cn}>
          <Button onClick={() => { operRecord() }}>操作记录</Button>
          {factBalanceDetail.billFlag == 2 && uType == 2 ? <Button onClick={() => { setIsModalNotAccount(true); setNotAccountTxt(""); }}>异议</Button> : null}
          {factBalanceDetail.billFlag == 3 && uType == 2 ? <Button onClick={() => { withdrdissent(); }}>撤销异议</Button> : null}
          {factBalanceDetail.billFlag == 1 && uType == 2 ? <Button onClick={() => { onToolsPrize(2, '确认将此订单撤销入账？', '撤销入账') }}>撤销入账</Button> : null}
          {factBalanceDetail.billFlag == 4 && uType == 2 ? <Button onClick={() => { withdraw(); }}>撤销确认</Button> : null}
          {factBalanceDetail.billFlag == 4 && uType == 2 ? <Button onClick={() => { modelEntry() }}>生成账单</Button> : null}
          {factBalanceDetail.billFlag == 2 && uType == 2 ? <Button type="primary" onClick={() => { modelConfirm(); }}>确认</Button> : null}
        </div>
        <div className={style.wrap_btn_rg}>
          <Button onClick={() => { history.goBack() }}>返回</Button>
        </div>
      </div>

      <Modal title="操作记录" width={1000} visible={isModalOperate} onCancel={() => { setIsModalOperate(false) }} footer={null}>
        <Table columns={operateColumns} dataSource={operateList} pagination={false} scroll={{ y: 500 }}></Table>
      </Modal>


      <Modal title="异议" width={500} cancelText="取消" okText="异议" visible={isModalNotAccount} onOk={notAccountConfig} onCancel={() => { setIsModalNotAccount(false) }}>
        <p className={style.layer_n1}>提出异议并退回的原因</p>
        <TextArea rows={3} value={notAccountTxt} onChange={changeNotAccount} maxLength={200} />
      </Modal>


      {/* 入账 */}
      <Modal title="生成账单" width={1200} visible={isModalEntry} footer={null} onCancel={() => { setIsModalEntry(false) }} >
        <Form form={formEntry} onFinish={entry}>
          <div style={{ overflow: 'hidden' }}>
            <Row>
              <Col span={24}>
                <Form.Item label="生成方式" name='saveType' labelCol={{ flex: '0 0 120px' }}>
                  <Radio.Group defaultValue={2} onChange={(e) => { entryChange(e.target.value) }}>
                    <Radio value={2}>新增账单</Radio>
                    <Radio value={1}>加入已有账单</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              {
                saveType == 2 ?
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
                        onChange={onNextChange2} //切换 页码时触发事件
                        pageSizeOptions={['10', '20', '50', '100']}
                        onShowSizeChange={onSizeChange2}
                        showTotal={onPageTotal2}
                      />
                    </Col>
                  </>
              }
            </Row>
            <Row justify="end" align="end">
              <Space size={20}>
                <Button onClick={() => { setIsModalEntry(false) }}>取消</Button>
                <Button type="primary" htmlType="submit">确认</Button>
              </Space>
            </Row>
          </div>
        </Form>
      </Modal>


    </>
  )
}


export default connect(({ billSettlementReconciliationModel }) => ({// 1.命名空间名

}))(detailToolsPage)//最上面定义的函数名
