import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Table, Select, Row, Col, Space, Button, DatePicker, Badge, Pagination, Tag, Modal, message } from "antd";
import style from "./style.less";
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Column } = Table;

// 重要讯息
const importantMsg = (props) => {
  let { dispatch, messageList, messageTotal, messageSelect, } = props;
  let [form] = Form.useForm();
  let [sendTimeform] = Form.useForm();

  const [isModalVisible, setIsModalVisible] = useState(false);//操作弹框(删除撤回，取消)
  const [isModifyTimeModal, setIsModifyTimeModal] = useState(false);//修改时间弹框

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [payload, setPayload] = useState({});

  useEffect(() => {
    messageManagerList()
  }, [current, pageSize, payload])

  useEffect(() => {
    messageTypeSelect()
  }, [])

  //
  const messageManagerList = () => {
    let newPayload = JSON.parse(JSON.stringify(payload));
    //发送时间
    if (newPayload.sendTime) {
      newPayload.sendTimeStart = moment(newPayload.sendTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss');
      newPayload.sendTimeEnd = moment(newPayload.sendTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    dispatch({
      type: 'messageModel/messageManagerList',
      payload: {
        method: 'postJSON',
        params: {
          pageNum: current,
          pageSize: pageSize,
          query: newPayload
        }
      }
    });
  }

  //消息分类下拉框
  const messageTypeSelect = () => {
    dispatch({
      type: 'messageModel/messageTypeSelect',
      payload: {
        method: 'get',
        params: {}
      }
    });
  }
  // 发消息入口
  const sendInfo = (text, all) => {
    history.push({
      pathname: '/message/messageManagementList/sendMessage',
      query: {
        opType: 'add'
      }
    })
  }
  // 详情
  const handelDetail = (text, all) => {
    history.push({
      pathname: '/message/messageManagementList/sendMessage',
      query: {
        messageId: all.id,
        opType: 'detail'
      }
    })
  }

  // 修改
  const modifyMessage = (text, all) => {
    history.push({
      pathname: '/message/messageManagementList/sendMessage',
      query: {
        messageId: all.id,
        opType: 'edit'
      }
    })
  }

  let [modifySendTime, setModifySendTime] = useState('');//修改时间

  // 修改时间
  const modifyTime = (text, all) => {
    setIsModifyTimeModal(true);
    setCurrentData(all)
    let sendTime = moment(all.sendTime);
    sendTimeform.setFieldsValue({ sendTime: sendTime })
  }
  // 选择定时发送
  const modifySendChange = (e) => {
    setModifySendTime(moment(e).format('YYYY-MM-DD HH:mm'));
  }
  const handleModifyTimeOk = () => {
    dispatch({
      type: 'messageModel/updateJobTime',
      payload: {
        method: 'postJSON',
        params: {
          id: currentData.id,//消息主键，新增时不传，修改时必传
          jobTime: modifySendTime
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {
          message.success(res.result.message)
          setIsModifyTimeModal(false)
          messageManagerList()
        } else {
          message.error(res.result.message)
        }
      }
    });
  }

  let [type, setType] = useState('');//操作类型(删除，撤回，取消)
  let [currentData, setCurrentData] = useState({});//当前点击的数据
  // 删除
  const deleteInfo = (text, all, type) => {
    setIsModalVisible(true)
    setType(type)
    setCurrentData(all)
  }
  const deleteFunc = () => {
    dispatch({
      type: 'messageModel/deleteMessage',
      payload: {
        method: 'delete',
        params: {},
        messageId: currentData.id
      },
      callback: (res) => {
        if (res.result.code == '0') {
          message.success('删除成功')
          setIsModalVisible(false)
          messageManagerList()
        } else {
          message.error(res.result.message)
        }
      }
    });
  }
  // 撤回
  const withdrawInfo = (text, all, type) => {
    setIsModalVisible(true)
    setType(type)
    setCurrentData(all)
  }
  const withdrawFunc = () => {
    dispatch({
      type: 'messageModel/recallMessage',
      payload: {
        method: 'get',
        params: {},
        messageId: currentData.id
      },
      callback: (res) => {
        if (res.result.code == '0') {
          message.success('撤回成功')
          setIsModalVisible(false)
          messageManagerList()
        } else {
          message.error(res.result.message)
        }
      }
    });
  }
  // 取消
  const cancelInfo = (text, all, type) => {
    setIsModalVisible(true)
    setType(type)
    setCurrentData(all)
  }
  const cancelFunc = () => {
    dispatch({
      type: 'messageModel/cancelTimingSend',
      payload: {
        method: 'postJSON',
        params: {
          id: currentData.id
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {
          message.success('取消成功')
          setIsModalVisible(false)
          messageManagerList()
        } else {
          message.error(res.result.message)
        }
      }
    });
  }

  // 确认操作
  const handleOk = () => {
    if (type == 'del') {
      deleteFunc()
    } else if (type == 'withdraw') {
      withdrawFunc()
    } else if (type == 'cancel') {
      cancelFunc()
    }
  }


  //表单提交
  const searchBtn = (val) => {
    setCurrent(1);
    setPayload(JSON.parse(JSON.stringify(val)))
  }

  //表单重置
  const resetBtnEvent = () => {
    form.resetFields();
    setPayload({})
  }

  //分页切换
  const handleTableChange = (val) => {
    setCurrent(val.current)
    setPageSize(val.pageSize)
  }
  return (
    <>
      <div className={style.grantPage}>
        <Form className={style.form} form={form} onFinish={searchBtn}>
          <Row>
            <Col span={8}>
              <Form.Item label="消息标题：" name="title" className={style.form__item} labelCol={{ flex: '0 0 120px' }}>
                <Input placeholder="请输入"></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="消息分类：" name="type" className={style.form__item} labelCol={{ flex: '0 0 120px' }}>
                <Select
                  allowClear showSearch placeholder="不限"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {
                    messageSelect && messageSelect.map((v) => <Option key={v.type} value={v.type}>{v.desc}</Option>)
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="发送时间：" name="sendTime" className={style.form__item} labelCol={{ flex: '0 0 120px' }}>
                <RangePicker style={{ width: '100%' }} placeholder={['开始时间', '结束时间']} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Space size={22}>
              <Button htmlType="button" onClick={resetBtnEvent}>重置</Button>
              <Button htmlType="submit" type="primary">查询</Button>
            </Space>
          </Row>
        </Form>
      </div>
      <div className={style.grantPage}>
        <div className={style.tableData_title}>
          查询列表
          <div className={style.tableData_btn1}>
            <Button htmlType="button" type="primary" onClick={sendInfo}>发消息</Button>
          </div>
        </div>
        <div className={style.tableData}>
          <Table
            dataSource={messageList}
            onChange={handleTableChange}
            pagination={{
              current: current,
              pageSize: pageSize,
              total: messageTotal,
              showTotal: (total) => {
                let totalPage = Math.ceil(total / pageSize);
                return `共${total}条记录 第 ${current} / ${totalPage}  页`
              }
            }}
          >
            <Column title="消息标题" dataIndex="title" key="title" align='center'
              render={(text, all) => <a onClick={() => { handelDetail(text, all) }}>{text}</a>}
            />
            <Column title="消息分类" dataIndex="typeName" key="typeName" align='center'
              render={(text, all) => {
                return <Tag color={all.type == 1 ? 'blue' : all.type == 2 ? 'orange' : 'purple'} >
                  {text}
                </Tag>
              }}
            />
            <Column title="发送人" dataIndex="sendName" key="sendName" align='center' />
            <Column title="发送时间" dataIndex="sendTime" key="sendTime" align='center' />
            <Column title="发送状态" dataIndex="sendStatusStr" key="sendStatusStr" align='center'
              render={(text, all) => {
                return <span>
                  {/* 发送状态 0.草稿1.已发送2.已撤回3定时发送 */}
                  <Badge status={
                    all.sendStatus == 0 ? 'default' :
                      all.sendStatus == 1 ? 'success' :
                        all.sendStatus == 2 ? 'error' : 'warning'}
                  />
                  {text}
                </span>
              }}
            />
            <Column title="操作" dataIndex="option" key="option" align='center'
              render={(text, all) => {
                return <>
                  {
                    all.sendStatus == 0 || all.sendStatus == 2 ?
                      <Space size="middle">
                        <a onClick={() => { modifyMessage(text, all) }}>修改</a>
                        <a onClick={() => { deleteInfo(text, all, 'del') }}>删除</a>
                      </Space>
                      : all.sendStatus == 1 ?
                        <Space size="middle">
                          <a onClick={() => { withdrawInfo(text, all, 'withdraw') }}>撤回消息</a>
                        </Space>
                        : all.sendStatus == 3 ?
                          <Space size="middle">
                            <a onClick={() => { modifyTime(text, all) }}>修改时间</a>
                            <a onClick={() => { cancelInfo(text, all, 'cancel') }}>取消</a>
                          </Space> : ''
                  }
                </>
              }}
            />
          </Table>
        </div>
      </div>
      {/* 操作弹框 */}
      <Modal
        title={
          type == 'del' ? '删除' :
            type == 'withdraw' ? '撤回消息' :
              type == 'cancel' ? '取消' : ''
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => { setIsModalVisible(false) }}>
        {
          type == 'del' ? <p>确认删除此消息？</p> :
            type == 'withdraw' ? <p>确认撤回此消息？</p> :
              type == 'cancel' ? <p>确认取消定时发送？</p> : ''
        }
      </Modal>
      {/* 定时发送弹框 */}
      <Modal title='定时发送' width='40%' visible={isModifyTimeModal} onOk={handleModifyTimeOk} onCancel={() => { setIsModifyTimeModal(false) }}>
        <p style={{ color: '#999' }}>请选择定时发送的时间：</p>
        <Form style={{ marginLeft: '-50px' }} form={sendTimeform}>
          <Form.Item label="发送时间：" name="sendTime" className={style.form__item} labelCol={{ flex: '0 0 120px' }}>
            <DatePicker allowClear={false} onChange={modifySendChange} showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          {
            modifySendTime ?
              <div style={{ padding: '0  0 0 50px' }}>该消息将于 {modifySendTime} 发送</div>
              :
              <div style={{ padding: '0  0 0 50px' }}>该消息将于 {currentData.sendTime} 发送</div>
          }
        </Form>
      </Modal>
    </>
  )
}

export default connect(({ messageModel }) => ({
  messageList: messageModel.messageList,
  messageTotal: messageModel.messageTotal,
  messageSelect: messageModel.messageSelect,
}))(importantMsg)