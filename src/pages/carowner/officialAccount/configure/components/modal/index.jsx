import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Table, Modal, Tree, message, Checkbox, Transfer, Tooltip, Space, Button, DatePicker, Row, Col, Select, Radio} from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import style from "./style.less";
const { Column } = Table;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const modal = (props) => {
  let { dispatch, modalInfo, toFatherValue, channelList } = props;
  // console.log(modalInfo)
  let [form] = Form.useForm();
  // 新增/查看
  const [channelId, setChannelId] =  useState(''); // 所属渠道
  const [wechatAppName, setWechatAppName] = useState('');// 公众号名称
  const [wechatId, setWechatId] = useState('');// 公众号账号
  const [wechatAppId, setWechatAppId] = useState('');// 公众号应用id
  const [wechatAppSecret, setWechatAppSecret] = useState('');// 公众号加密密钥 
  const [serverStatus, setServerStatus] = useState('');// 高级接口 
  const [status, setStatus] = useState('');// 状态
  const [token, setToken] = useState('');// 微信令牌
  const [serverUrl, setServerUrl] = useState('');// 服务器接口地址  
  const [encodingAESKey, setEncodingAESKey] = useState('');// 消息加密密钥
  const [replyContent, setReplyContent] = useState('');// 关注回复内容
  const [menuType, setMenuType] = useState([]);// 菜单类型
  const [menuEventType, setmenuEventType] = useState([]);// 功能类型
  const [isMenuType, setIsMenuType] = useState('');// 用于菜单类型的判断
  const [isMenuEventType, setIsMenuEventType] = useState(''); // 用于功能类型的判断
  // 同步菜单确认事件
  const synchroConfigure = () => {
    dispatch({
      type: 'configureManage/WechatMenuToWechat',
      payload: {
        method: 'get',
        wechatAppId: modalInfo.wechatAppId,
      },
      callback: (res) => {
        console.log(res)
        if (res.result.code != 0){
          return message.error({ style: { marginTop: '10vh', }, content: res.result.message });
        }else{
          message.success({ style: { marginTop: '10vh', }, content: '同步成功' });
          toFatherValue(true)
        }
      }
    })
  };
  // 新增/查看
  if(modalInfo.modalName=='addConfigure' || modalInfo.modalName=='editConfigure') {
    // 获取所属渠道
    useEffect(() => {
      queryChanneList();
      if(modalInfo.modalName=='editConfigure') {
        queryWechatAppSettingDetail()
      }
      if(modalInfo.modalName=='addConfigure') {
        setChannelId(JSON.parse(localStorage.getItem('tokenObj')).channelId);
        setWechatAppName('');
        setWechatId('');
        setWechatAppId('');
        setWechatAppSecret('');
        setServerStatus('0'); 
        setStatus('2');
        setToken('');
        setServerUrl('');  
        setEncodingAESKey('');
        setReplyContent('')
      }
    },[])
  }
  // 新增/查看   公众号配置(公众号详情点击公众号名称与查看时调用)
  const queryWechatAppSettingDetail = () => {
    dispatch({
      type: 'configureManage/queryWechatAppSettingDetail',
      payload: {
        method: 'get',
        objectId: modalInfo.objectId
      },
      callback: (res) => {
        if(res.result.code==0) {
          setChannelId(res.body.wechatAppChannelId);
          setWechatAppName(res.body.wechatAppName);
          setWechatId(res.body.wechatId);
          setWechatAppId(res.body.wechatAppId);
          setWechatAppSecret(res.body.wechatAppSecret);
          setServerStatus(res.body.serverStatus); 
          setStatus(res.body.status);
          setToken(res.body.token);
          setServerUrl(res.body.serverUrl);  
          setEncodingAESKey(res.body.encodingAESKey);
          setReplyContent(res.body.replyContent)
        }
      }
    });
  }
  // 新增/查看  获取所属渠道
  const queryChanneList = () => {
    dispatch({
      type: 'configureManage/queryChannelList',
      payload: {
        method: 'get',
        params: {
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId
        }
      }
    });
  }
  // 新增确认事件
  const addConfigure = () => {
    saveWechat()
  };
  // 编辑确认事件
  const editConfigure = () => {
    saveWechat();
  };
  // 新增/ 查看
  const saveWechat = () => {
    if (!wechatAppName) return message.error({ style: { marginTop: '10vh', }, content: '请输入公众号名称!' }); 
    if (!wechatId) return message.error({ style: { marginTop: '10vh', }, content: '请输入公众号账号!' }); 
    if (!wechatAppId) return message.error({ style: { marginTop: '10vh', }, content: '请输入公众号应用id!' }); 
    if (!wechatAppSecret) return message.error({ style: { marginTop: '10vh', }, content: '请输入公众号加密密钥!' }); 
    let data = {
      wechatAppName:wechatAppName,
      wechatId:wechatId,
      wechatAppId:wechatAppId,
      wechatAppSecret:wechatAppSecret,
      serverStatus:serverStatus,
      status:status,
      token:token,
      serverUrl:serverUrl,
      encodingAESKey:encodingAESKey,
      replyContent:replyContent,
    }
    if(modalInfo.modalName=='addConfigure') {
      delete data.objectId
    }else{ 
      data.objectId = modalInfo.objectId
    }
    dispatch({
      type: 'configureManage/saveWechatAppSetting',
      payload: {
        method: 'postJSON',
        params: data 
      },
      callback: (res) => {
        console.log(res)
        if (res.result.code != 0) return message.error({ style: { marginTop: '10vh', }, content: res.result.message });
        toFatherValue(true)
      }
    })
  }
  // 失效确认事件
  const invalidConfigure = () => {
    dispatch({
      type: 'configureManage/wechatAppSettingDel',
      payload: {
        method: 'get',
        params: {
          ids: modalInfo.wechatList.toString()
        },
      },
      callback: (res) => {
        console.log(res)
        if (res.result.code != 0) return message.error({ style: { marginTop: '10vh', }, content: res.result.message });
        toFatherValue(true)
      }
    })
  };
  // 删除菜单
  const deleteMenu = () => {
    dispatch({
      type: 'configureManage/deleteWechatAppMenuSetting',
      payload: {
        method: 'delete',
        objectId: modalInfo.objectId
      },
      callback: (res) => {
        console.log(res)
        if (res.result.code != 0) return message.error({ style: { marginTop: '10vh', }, content: res.result.message });
        toFatherValue(true)
      }
    })
  }
  /******************************************华丽的分割线*****************************************************/ 
  if(modalInfo.modalName=='addMenu' || modalInfo.modalName=='editMenu') {
    useEffect(()=> {
      querySelectDictionary(2042, modalInfo.type);
      querySelectDictionary(2043, modalInfo.type);
      if(modalInfo.modalName=='editMenu') {
        queryWechatAppMenuSetting();
      }
    },[])
  }
  // 公众号配置(查询菜单类型查询功能类型)
  const querySelectDictionary = (dictionaryId, type) => {
    dispatch({
      type: 'configureManage/querySelectDictionary',
      payload: {
        method: 'get',
        dictionaryId,//菜单类型：2042；功能类型：2043
      },
      callback: (res) => {
        if(res.result.code==0) {
          if(dictionaryId==2042) {
            if(type=='add2' || type=='edit2') {
              res.body.forEach((item,index,arr) => {
                if(item.name=='打开二级') {
                  arr.splice(index, 1)
                }
              })
            }
            setMenuType(res.body)
          }
          if(dictionaryId==2043) {
            setmenuEventType(res.body)
          }
        }
      }
    });
  }
  // 主菜单/子菜单详情查询
  const queryWechatAppMenuSetting = () => {
    dispatch({
      type: 'configureManage/queryWechatAppMenuSetting',
      payload: {
        method: 'get',
        objectId: modalInfo.objectId,
      },
      callback: (res) => {
        if(res.result.code==0) {
          setIsMenuType(res.body.menuType);
          setIsMenuEventType(res.body.menuEventType);
          form.setFieldsValue({
            menuName: res.body.menuName,
            menuType: Number(res.body.menuType),
            menuUrl: res.body.menuUrl,
            needOpenId: res.body.needOpenId,
            needRegist: res.body.needRegist,
            needInnerPara: res.body.needInnerPara,
            menuMiniprogramAppId: res.body.menuMiniprogramAppId,
            menuMiniprogramPagepath: res.body.menuMiniprogramPagepath,
            menuEventType: res.body.menuEventType=='' ? '' : Number(res.body.menuEventType),
            // menuKey: res.body.menuKey,
            menuEventMessageContent: res.body.menuEventMessageContent,
            menuEventMediaId: res.body.menuEventMediaId,
            menuOrder: res.body.menuOrder,
          })
        }
      }
    });
  }
  // 菜单类型的监听
  const handleMenuType = (val) => {
    setIsMenuType(val)
  }
  // 功能类型的监听
  const handlemenuEventType = (val) => {
    setIsMenuEventType(val)
  }
  // 新增与编辑主菜单与子菜单  (表单提交)
  let addMenuOrEditMenuSubmit = (val) => {
    val.parentId = modalInfo.type=='add1' || modalInfo.type=='edit1' ? 0 : history.location.query.objectId; // 一级菜单传0  二级传objectId
    val.wechatAppId = modalInfo.modalName=='addMenu' ? history.location.query.wechatAppId : modalInfo.wechatAppId; // 必传参数  新增时从路由取   修改时从modalinfo中取
    val.objectId = modalInfo.type=='add1' || modalInfo.type=='add2' ? '' : modalInfo.objectId;// 修改时必传
    if(val.menuType==2) {
      if(val.needRegist==1 && !val.needOpenId) return message.error({ style: { marginTop: '10vh', }, content: '请选择参数带openId!' });
    }
    console.log(val, 'val')
    dispatch({
      type: 'configureManage/saveWechatAppMenuSetting',
      payload: {
        method: 'postJSON',
        params: val
      },
      callback: (res) => {
        if(res.result.code==0) {
          toFatherValue(true)
        }else{
          return message.error({ style: { marginTop: '10vh', }, content: res.result.message });
        }
      }
    });
  }
  return (
    <>
      {/* 同步菜单 */}
      <Modal title="信息" visible={modalInfo.modalName=='synchroConfigure'} onOk={() => {synchroConfigure()}} onCancel={() => {toFatherValue(false)}}>
        <p>确认要同步菜单吗？</p>
      </Modal>
      {/* 新增与查看 */}
      <Modal  width={1000} title={modalInfo.modalName=='addConfigure'? '新增': '编辑'} visible={modalInfo.modalName=='addConfigure' || modalInfo.modalName=='editConfigure'} maskClosable={false}
        onOk={()=>{modalInfo.modalName=='addConfigure'? addConfigure(): editConfigure()}} onCancel={() => {toFatherValue(false)}} >
        <Row>
          <Col span={12}>
            <Form.Item label="所属渠道" labelCol={{flex:'0 0 120px'}}>
              <Select allowClear placeholder="请选择" value={channelId} disabled={modalInfo.modalName=='addConfigure' || modalInfo.modalName=='editConfigure'}>
                {
                  channelList.map(v =>  <Option value={v.id}>{v.channelName}</Option>)
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="公众号名称" labelCol={{flex:'0 0 120px'}}>
              <Input placeholder="请输入" value={wechatAppName} onChange={(e)=> {setWechatAppName(e.target.value)}}></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item  label="公众号账号" labelCol={{flex:'0 0 120px'}} >
              <Input placeholder="请输入" value={wechatId} onChange={(e)=> {setWechatId(e.target.value)}}></Input> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="公众号应用id" labelCol={{flex:'0 0 120px'}}>
              <Input placeholder="请输入" value={wechatAppId} onChange={(e)=> {setWechatAppId(e.target.value)}}></Input> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="公众号加密密钥" labelCol={{flex:'0 0 120px'}}>
              <Input placeholder="请输入" value={wechatAppSecret} onChange={(e)=> {setWechatAppSecret(e.target.value)}}></Input> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="高级接口" labelCol={{flex:'0 0 120px'}}>  
              <Select allowClear placeholder="请选择" value={String(serverStatus)} onChange={(e)=> {setServerStatus(e)}}>
                <Option value='0'>未开启</Option>
                <Option value='1'>开启</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="状态" labelCol={{flex:'0 0 120px'}}>
              <Select allowClear placeholder="请选择" value={String(status)} onChange={(e)=> {setStatus(e)}}>
                <Option value='1'>无效</Option>
                <Option value="2">有效</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="微信令牌" labelCol={{flex:'0 0 120px'}}>
              <Input placeholder="请输入" value={token} onChange={(e)=> {setToken(e.target.value)}}></Input> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="服务器接口地址" labelCol={{flex:'0 0 120px'}}>
              <Input placeholder="请输入" value={serverUrl} onChange={(e) => {setServerUrl(e.target.value)}}></Input> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="消息加密密钥" labelCol={{flex:'0 0 120px'}}>
              <Input placeholder="请输入" value={encodingAESKey} onChange={(e)=> {setEncodingAESKey(e.target.value)}}></Input> 
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="关注回复内容" labelCol={{flex:'0 0 120px'}}>
              <TextArea  showCount maxLength={500} placeholder="请输入" value={replyContent} onChange={(e) => {setReplyContent(e.target.value)}}/>
            </Form.Item>
          </Col>
        </Row>
      </Modal>
      {/* 失效提示框 */}
      <Modal title="提示" visible={modalInfo.modalName=='invalidConfigure'} onOk={()=> {invalidConfigure()}} onCancel={() => {toFatherValue(false)}}>
        <p><QuestionCircleOutlined /><span style={{marginLeft:'10px'}}>请谨慎！设为无效，则前端公众号菜单信息将清空，是否继续？</span></p>
      </Modal>
      {/* 设置菜单主菜单的删除 */}
      <Modal title="提示" visible={modalInfo.modalName=='deleteParentMenu'} onOk={()=> {deleteMenu()}} onCancel={() => {toFatherValue(false)}}>
        <p>删除主菜单后，主菜单包含的子菜单会同时同步删除，请确认是否删除</p>
      </Modal>
      {/* 设置菜单子菜单的删除 */}
      <Modal title="提示" visible={modalInfo.modalName=='deleteChildMenu'} onOk={() => {deleteMenu()}} onCancel={() => {toFatherValue(false)}}>
        <p>请确认是否删除子页面</p>
      </Modal>
      {/* 新增与编辑主菜单与子菜单 */}
      <Modal width={880} footer={null} title={modalInfo.modalName=='addMenu' ? '新增菜单': '编辑菜单'} visible={modalInfo.modalName=='addMenu' || modalInfo.modalName=='editMenu'} onCancel={() => {toFatherValue(false)}}>
        <Form form={form} onFinish={addMenuOrEditMenuSubmit}>
          <Row>
            <Col span={24}>
              <Form.Item label="菜单名称" name="menuName" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                <Input placeholder="请输入" ></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="菜单类型" name="menuType" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                <Select allowClear placeholder="请选择" onChange={(e) => {handleMenuType(e)}}>
                  {
                    menuType.map(v =>  <Option value={v.value}>{v.name}</Option>)
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {
            isMenuType==2? 
            <Row>
              <Col span={24}>
                <Form.Item label="链接地址" name="menuUrl" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                  <Input placeholder="请输入" ></Input>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label='参数openid' name='needOpenId' labelCol={{flex:'0 0 120px'}}>
                  <Radio.Group>
                    <Radio value={1}>带参数</Radio>
                    <Radio value={0}>不带参数</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label='是否注册' name='needRegist' labelCol={{flex:'0 0 120px'}}>
                  <Radio.Group>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label='是否需要内部参数' name='needInnerPara' labelCol={{flex:'0 0 120px'}}>
                  <Radio.Group>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            : null
          }
          {
            isMenuType ==3 ? 
            <Row>
              <Col span={24}>
                <Form.Item label="小程序appId" name="menuMiniprogramAppId" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                  <Input placeholder="请输入" ></Input>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="小程序页面路径" name="menuMiniprogramPagepath" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                  <Input placeholder="请输入" ></Input>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="备用地址" name="menuUrl" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                  <Input placeholder="请输入" ></Input>
                </Form.Item>
              </Col>
            </Row>
            : null
          }
          {
            isMenuType==1? 
            <Row>
              <Col span={24}>
                <Form.Item label="功能类型" name="menuEventType" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                  <Select allowClear placeholder="请选择" onChange={(e) => {handlemenuEventType(e)}}>
                    {
                      menuEventType.map(v =>  <Option value={v.value}>{v.name}</Option>)
                    }
                  </Select>
                </Form.Item>
              </Col>
              {/* <Col span={24}>
                <Form.Item label="菜单key" name="menuKey" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                  <Input placeholder="请输入" ></Input>
                </Form.Item>
              </Col> */}
              {
                isMenuEventType==1? 
                <Col span={24}>
                  <Form.Item label="文本内容" name="menuEventMessageContent"  labelCol={{flex:'0 0 120px'}}>
                    <TextArea showCount maxLength={100} placeholder="请输入" />
                  </Form.Item>
                </Col>
                : null
              }
              {
                isMenuEventType==2 || isMenuEventType==5 ? 
                <Col span={24}>
                  <Form.Item label="消息id" name="menuEventMediaId" labelCol={{flex:'0 0 120px'}}>
                    <Input placeholder="请输入" ></Input>
                  </Form.Item>
                </Col> : null
              }
            </Row>
            : null
          }
          <Row>
            <Col span={24}>
              <Form.Item label="排序" name="menuOrder" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                <Input placeholder="请输入" ></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Space size={22}>
              <Button  htmlType="button" onClick={() => {toFatherValue(false)}}>取消</Button>
              <Button  htmlType="submit" type="primary">保存</Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default connect(({ configureManage }) => ({
  channelList: configureManage.channelList,
}))(modal)