import React, { useState, useEffect, useRef, useContext } from 'react';
import { connect, history } from 'umi';
import {
  Tag, Row, Col, Form, Space, Badge, Input, Table, Select, Divider, Button, DatePicker,
  Descriptions, Modal, message, InputNumber
} from "antd"
import moment from 'moment';
import style from './modalStyle.less';

const { TextArea } = Input;
const { Column } = Table;
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;

//内容弹框
const contentSelectModal = (props) => {
  let { dispatch, contVisible, closeModal, checkedContList, popupId, popupContentData, popupContentDataList, } = props;
  let [form] = Form.useForm();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [payload, setPayload] = useState({});
  const [variation, setVariation] = useState(false)//是否改变
  const [checkList, setCheckList] = useState([]);
  const [checkKey, setCheckKey] = useState([]);

  useEffect(() => {
    getListPopupContent();
    // console.log(checkedContList, 'checkedContList')
    if (checkedContList && checkedContList.length) {
      setCheckKey([checkedContList[0].id])
      setCheckList(checkedContList)
    } else {
      setCheckKey([popupId])
    }
  }, [variation])



  let getListPopupContent = () => {
    let newPayload = JSON.parse(JSON.stringify(payload));
    dispatch({
      type: 'popupContentManage/getListPopupContent',
      payload: {
        method: 'postJSON',
        params: {
          pageNum: current,
          pageSize: pageSize,
          query: {
            ...newPayload,
            contentStatus: 2//1未启用、2已启用
          }
        }
      }
    })
  }
  //表单查询
  let searchBtn = (val) => {
    setCurrent(1);
    setPayload(JSON.parse(JSON.stringify(val)))
    setVariation(!variation)
  }
  //表单重置
  let resetBtnEvent = () => {
    form.resetFields();
    setPayload({})
    setVariation(!variation)
    // setCheckList([])
    // setCheckKey([])
  }
  //分页切换
  const handleTableChange = (val) => {
    setCurrent(val.current)
    setPageSize(val.pageSize)
    setVariation(!variation)
  }
  // 单选配置
  const rowSelection = {
    onChange: (key, value) => {
      console.log(key, value)
      setCheckKey(key)
      setCheckList(value)
    },
    type: 'radio',
    selectedRowKeys: checkKey,
    getCheckboxProps: (record) => ({}),
  }

  // 点击确认
  const handleContentOk = () => {
    closeModal()
    sendContModalData()
  }
  let sendContModalData = () => {
    // 将选中数据传给新增页
    dispatch({
      type: 'directionalPopupManage/setContData',
      payload: {
        checkedContList: checkList,
        isUpdate: true//编辑进入时判断使用原本的还是选择过后的
      }
    })
  }
  return (
    <>
      <Modal
        title="弹窗内容选择"
        width={'90%'}
        centered
        visible={contVisible}
        onOk={handleContentOk}
        onCancel={() => { closeModal() }}
      >
        <Form className={style.form} form={form} onFinish={searchBtn}>
          <Row>
            <Col span={12}>
              <Form.Item label="弹窗内容ID：" name="id" className={style.form__item} labelCol={{ flex: '0 0 120px' }}>
                <Input placeholder="请输入"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="内容名称：" name="contentName" className={style.form__item} labelCol={{ flex: '0 0 120px' }}>
                <Input placeholder="请输入"></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="内容类型：" name="contentType" className={style.form__item} labelCol={{ flex: '0 0 120px' }}>
                <Select placeholder="请选择">
                  <Option value={1}>图片</Option>
                  <Option value={2}>图片+按钮</Option>
                  <Option value={3}>图片+文字+按钮</Option>
                  <Option value={4}>文字+按钮</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12} style={{ textAlign: 'center' }}>
              <Space size={22}>
                <Button htmlType="button" onClick={resetBtnEvent}>重置</Button>
                <Button htmlType="submit" type="primary">查询</Button>
              </Space>
            </Col>
          </Row>
        </Form>
        <Table
          rowSelection={{ ...rowSelection }}
          dataSource={popupContentDataList}
          onChange={handleTableChange}
          pagination={{
            current: current,
            pageSize: pageSize,
            total: popupContentData && popupContentData.total,
            showTotal: (total) => {
              let totalPage = Math.ceil(total / pageSize);
              return `共${total}条记录 第 ${current} / ${totalPage}  页`
            }
          }}
        >
          <Column title="弹窗内容ID" dataIndex="id" key="id"
            render={(text, all) => <a>{text}</a>}
          />
          <Column title="内容名称" dataIndex="contentName" key="contentName" />
          <Column title="内容类型" dataIndex="contentType" key="contentType"
            render={(text, all) => {
              return <Tag color={
                text == 1 ? 'error' :
                  text == 2 ? 'warning' :
                    text == 3 ? 'success' :
                      text == 4 ? 'processing' : 'default'}
              >{all.contentTypeStr}</Tag>
            }}//内容类型(1:图片 2：图片+按钮 3：图片+文字+按钮 4：文字+按钮)
          />
          <Column title="更新时间" dataIndex="updateTime" key="updateTime" />
        </Table>
      </Modal>
    </>
  )
}

export default connect(({ directionalPopupManage, popupContentManage }) => ({
  popupContentData: popupContentManage.popupContentData,
  popupContentDataList: popupContentManage.popupContentDataList,
  checkedContList: directionalPopupManage.checkedContList,
  isUpdate: directionalPopupManage.isUpdate
}))(contentSelectModal)