import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import {
  Row,
  Col,
  Form,
  Input,
  Modal,
  message,
  Transfer,
  Tooltip,
  Button,
  Space,
  Select,
  Cascader
} from "antd"
import style from "./style.less";
const { TextArea } = Input;
const { Option, OptGroup } = Select;

const modal = (props) => {
  let { dispatch, modalInfo, toFatherValue, institutionList } = props;

  //新增/修改账号
  let dataInfo = { userId: '', password: '', phone: '', userName: '', remark: '' }
  if (modalInfo.modalName == 'putAccount') {
    for (let key in modalInfo) {
      dataInfo[key] = modalInfo[key]
    }
    dataInfo.password = '******'
  }
  const [addAccountId, setAddAccountId] = useState(dataInfo.userId)
  const [addAccountPassword, setAddAccountPassword] = useState(dataInfo.password)
  const [addAccountPhone, setAddAccountPhone] = useState(dataInfo.phone)
  const [addAccountName, setAddAccountName] = useState(dataInfo.userName)
  const [addAccountDes, setAddAccountDes] = useState(dataInfo.remark)

  //分配账号
  const [mockData, setMockData] = useState([])
  const [targetKeys, setTargetKeys] = useState([]);
  //所选子机构
  const [instOrgList, setInstOrgList] = useState([]);

  //新增账号
  const addAccount = () => {
    let userRegex = new RegExp('[a-zA-Z0-9\-]{6}$');;//账号至少6个字符，只能为字母、数字和“-”
    if (!addAccountId) return message.error({ content: '请输入账号ID' });
    if (!userRegex.test(addAccountId)) return message.error({content: `账号至少6个字符，只能为字母、数字和“-”` });
    if (!addAccountPassword) return message.error({ content: '请输入账号密码' });
    if (!addAccountPhone) return message.error({ content: '请输入手机号码' });
    if (!/^1\d{10}$/.test(addAccountPhone)) return message.error({ content: '手机号格式不正确' });
    if (!addAccountName) return message.error({ content: '请输入用户姓名' });
    let orgId=null;
    let toOrgList="";
    if(instOrgList && instOrgList.length>0){
      orgId=instOrgList[instOrgList.length-1];
      toOrgList=instOrgList.join(',');
    }
    dispatch({
      type: 'accountManage/addUserData',
      payload: {
        method: 'postJSON',
        params: {
          userId: addAccountId,
          passWord: addAccountPassword,
          phoneNo: addAccountPhone,
          userName: addAccountName,
          userMessage: addAccountDes,
          orgId:orgId,
          orgList:toOrgList
        },
      },
      callback: (res) => {
        if (res.result.code != 0) return message.error({ content: res.result.message });
        toFatherValue(res.body)
      }
    })
  }
  //修改账号
  const putAccount = () => {
    if (!addAccountPhone) return message.error({ content: '请输入手机号码' });
    if (!/^1\d{10}$/.test(addAccountPhone)) return message.error({ content: '手机号格式不正确' });
    if (!addAccountName) return message.error({ content: '请输入用户姓名' });
    let orgId=null;
    let toOrgList="";
    if(instOrgList && instOrgList.length>0){
      orgId=instOrgList[instOrgList.length-1];
      toOrgList=instOrgList.join(',');
    }
    dispatch({
      type: 'accountManage/updateUserData',
      payload: {
        method: 'postJSON',
        params: {
          userId: modalInfo.id,
          phoneNo: addAccountPhone,
          userName: addAccountName,
          userMessage: addAccountDes,
          orgId:orgId,
          orgList:toOrgList
        },
      },
      callback: (res) => {
        toFatherValue(true)
      }
    })
  }
  //角色停用/启用
  const banAccount = () => {
    dispatch({
      type: 'accountManage/banUserData',
      payload: {
        method: 'postJSON',
        params: {
          userId: modalInfo.id,
          userStatus: modalInfo.userStatus
        },
      },
      callback: (res) => {
        toFatherValue(true)
      }
    })
  }

  //分配账号-搜索框查询
  const filterOption = (inputValue, option) => option.roleName.indexOf(inputValue) > -1;
  //分配账号-change事件
  const handleChange = targetKeys => {
    setTargetKeys(JSON.parse(JSON.stringify(targetKeys)))
  };
  //分配账号-提交
  const roleAccount = () => {
    let roleIds = []
    for (let i = 0; i < mockData.length; i++) {
      if (targetKeys.indexOf(mockData[i].key) == -1) roleIds.push(mockData[i].key)
    }
    dispatch({
      type: 'accountManage/updateUserRoleData',
      payload: {
        method: 'postJSON',
        params: {
          userId: modalInfo.id,
          roleIds: roleIds
        }
      },
      callback: (res) => {
        toFatherValue(true)
      }
    })
  }
  //分配账号-查询
  useEffect(() => {
    if (modalInfo.modalName != 'roleAccount') return
    let queryUserRoleData = new Promise((resolve, resolved) => {
      dispatch({
        type: 'accountManage/queryUserRoleData',
        payload: {
          method: 'get',
          params: {
            pageNm: 1,
            pageSize: 500,
            userId: modalInfo.id
          }
        },
        callback: (res) => resolve(res)
      })
    })
    let queryRoleInfoData = new Promise((resolve, resolved) => {
      dispatch({
        type: 'accountManage/queryRoleInfoData',
        payload: {
          method: 'get',
          params: {
            pageNm: 1,
            pageSize: 500,
            userId: modalInfo.id
          },
        },
        callback: (res) => resolve(res)
      })
    })
    Promise.all([queryUserRoleData, queryRoleInfoData]).then(res => {
      let mockData = [...res[0].list, ...res[1].list]
      let targetKeys = []
      for (let i = 0; i < mockData.length; i++) {
        mockData[i].key = mockData[i].roleId
      }
      for (let i = 0; i < res[1].list.length; i++) {
        targetKeys.push(res[1].list[i].roleId)
      }
      setMockData(mockData)
      setTargetKeys(targetKeys)
    })
  }, [])

  const resetPwd = () => {
    Modal.confirm({
      title: '确认重置该账号密码？',
      onOk() {
        dispatch({
          type: 'accountManage/passwordReset',
          payload: {
            method: 'postJSON',
            params: {
              userId: modalInfo.userId
            },
          },
          callback: ((res) => {
            console.log(res);
            if (res && res.result.code == '0') {
              Modal.info({
                content: (
                  <div>
                    <div>账号密码已重置为{res.body}</div>
                    <div>请用户重新登录后修改初始密码</div>
                  </div>
                )
              })
            }
          })
        })
      },
    })
  }

  //子机构选择
  let onChangesOrg=(e)=>{
    setInstOrgList([...e])
  }
  useEffect(() => {
     if(modalInfo.orgList){
       let toorgList=modalInfo.orgList.split(',');
       toorgList=toorgList.map((e)=>{ return parseInt(e)})
       console.log(toorgList)
      setInstOrgList([...toorgList]);
     }
  }, [modalInfo])
  return (
    <>
      {/* 新增账号 */}
      <Modal width={880} title={modalInfo.modalName == 'addAccount' ? '新增账号' : '修改账号'}
        visible={modalInfo.modalName == 'addAccount' || modalInfo.modalName == 'putAccount'}
        footer={null}
        onCancel={() => toFatherValue(false)}
        okText={modalInfo.modalName == 'addAccount' ? "下一步" : "保存"}
      >
        <div className={style.modal_box}>
          <div style={{ overflow: 'hidden' }}>
            <Row>
              <Col span={12} style={{ paddingRight: '10px' }}>
                <Form.Item label="&nbsp;&nbsp;&nbsp;&nbsp;账号ID：" labelCol={{ flex: '0 0 80px' }}>
                  <Input onChange={(e) => { setAddAccountId(e.target.value) }} placeholder="请输入" disabled={modalInfo.modalName == 'putAccount'} value={addAccountId} ></Input>
                </Form.Item>
              </Col>
              <Col span={12} style={{ paddingLeft: '10px' }}>
                <Form.Item label="账号密码：" labelCol={{ flex: '0 0 80px' }}>
                  <Input autocomplete="new-password" type="password" onChange={(e) => { setAddAccountPassword(e.target.value) }} placeholder="请输入" disabled={modalInfo.modalName == 'putAccount'} value={addAccountPassword} ></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12} style={{ paddingRight: '10px' }}>
                <Form.Item label="手机号码：" labelCol={{ flex: '0 0 80px' }}>
                  <Input onChange={(e) => { setAddAccountPhone(e.target.value) }} placeholder="请输入" value={addAccountPhone} ></Input>
                </Form.Item>
              </Col>
              <Col span={12} style={{ paddingLeft: '10px' }}>
                <Form.Item label="用户姓名：" labelCol={{ flex: '0 0 80px' }}>
                  <Input onChange={(e) => { setAddAccountName(e.target.value) }} placeholder="请输入" value={addAccountName} ></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12} style={{ paddingRight: '10px' }}>
                <Form.Item label="所属子机构:" labelCol={{ flex: '0 0 80px' }}>
                  <Cascader
                    value={instOrgList}
                    options={institutionList}
                    onChange={(res) => { onChangesOrg(res) }}
                    placeholder="请选择子机构"
                    showSearch
                    onSearch={value => console.log(value)}
                    changeOnSelect
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Form.Item label="描述信息：" labelCol={{ flex: '0 0 80px' }}>
            <TextArea onChange={(e) => { setAddAccountDes(e.target.value) }} value={addAccountDes} showCount maxLength={100} placeholder="请输入" />
          </Form.Item>
          <div className={style.btnBox}>
            <Row justify="space-between">
              <div>{modalInfo.modalName == 'putAccount' ? <Button type="primary" onClick={resetPwd}>重置密码</Button> : ''}</div>
              <Space size={10}>
                <Button onClick={() => { toFatherValue(false) }}>取消</Button>
                <Button type="primary" onClick={() => { modalInfo.modalName == 'addAccount' ? addAccount() : putAccount() }}>保存</Button>
              </Space>
            </Row>
          </div>
        </div>
      </Modal>

      {/* 账号停用/启用 */}
      <Modal title="提示" visible={modalInfo.modalName == 'banAccount'} onOk={() => { banAccount() }} onCancel={() => { toFatherValue(false) }}>
        <p>确认{modalInfo.userStatus == 1 ? '启用' : '停用'}当前账号？</p>
      </Modal>

      {/* 分配账号 */}
      <Modal title="分配账号" width={1000} visible={modalInfo.modalName == 'roleAccount'} onOk={() => { roleAccount() }} okText="保存" onCancel={() => { toFatherValue(false) }}>
        <div className={style.info_title}>基本信息</div>
        <div className={style.info_data}>
          <Form.Item className={style.form_item} label="账号 ID：" >{modalInfo.userId}</Form.Item>
          <Form.Item className={style.form_item} label="账号名称：" >{modalInfo.userName}</Form.Item>
          <Form.Item className={style.form_item} label="手机号：" >{modalInfo.phone}</Form.Item>
          <Form.Item className={style.form_item} label="状态：" >{modalInfo.isEnable == 1 ? '已启用' : '已停用'}</Form.Item>
          <Form.Item className={style.form_item} label="描述：" >{modalInfo.remark}</Form.Item>
        </div>
        <div className={style.border_line}></div>
        <div className={style.info_title}>配置权限</div>
        <Transfer
          listStyle={{
            width: 450,
            height: 460
          }}
          className={style.Transfer}
          dataSource={mockData}
          showSearch
          filterOption={filterOption}
          targetKeys={targetKeys}
          onChange={handleChange}
          titles={['已分配角色', '未分配角色']}
          operations={['加入右侧', '加入左侧']}
          pagination={{
            current: 1,
            pageSize: 10,
          }}
          render={item => (
            <div>
              <span style={{ float: 'left', width: '200px' }}>{item.roleName}</span>
              <span style={item.roleStatus == 1 ? { float: 'left', color: '#52C41A' } : { float: 'left', color: '#B40404' }}>{item.roleStatus == 1 ? '已启用' : '已停用'}</span>
              <Tooltip placement="rightTop" title={item.menuNames.length ? item.menuNames.join('、') : '无'}>
                <a style={{ float: 'left', marginLeft: '30px' }}>查看权限</a>
              </Tooltip>
            </div>
          )}
        />
      </Modal>

    </>
  )
}


export default connect(({ accountManage }) => ({
}))(modal)







