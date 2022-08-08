import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Tag, Row, Col, Form, Space, Radio, DatePicker, Modal, Input, Table, Select, Button, Pagination, ConfigProvider, message, Badge, Alert } from "antd"
import { QueryFilter} from '@ant-design/pro-form';
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";
import style from "../style.less";
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { fmoney } from '@/utils/date'
import DirectionalDetail from './directionalDetail';

const { Column } = Table;
const { Option } = Select;
const { RangePicker } = DatePicker;


const directionalPopupPage = (props) => {
  let { dispatch, popupDirectData, popupPageList } = props;
  let [form] = Form.useForm();

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [payload, setPayload] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);//操作弹框(启用，停用,删除)
  let [currentData, setCurrentData] = useState({});//当前点击的数据(操作)

  // 详情弹框
  const [detailVisible, setDetailVisible] = useState(false);
  let [currentInfo, setCurrentInfo] = useState({});//点击的当前数据（id详情）

  const [beforeStartupVisible, setBeforeStartupVisible] = useState(false);//启动之前弹窗

  useEffect(() => {
    getPopupPageConfig()
    getQueryPopupDirectPage()
  }, [current, pageSize, payload])

  //列表
  let getQueryPopupDirectPage = () => {
    let newPayload = JSON.parse(JSON.stringify(payload));
    dispatch({
      type: 'directionalPopupManage/getQueryPopupDirectPage',
      payload: {
        method: 'postJSON',
        params: {
          pageNum: current,
          pageSize: pageSize,
          query: newPayload
        }
      }
    })
  }
  //弹窗页面列表
  let getPopupPageConfig = () => {
    dispatch({
      type: 'directionalPopupManage/getPopupPageConfig',
      payload: {
        method: 'get',
        params: {}
      }
    })
  }

  // 新建定向弹窗
  let newDirectionalPopup = () => {
    history.push({
      pathname: '/popupTouchManage/directionalPopup/addEditDirection'
    })
  }



  // 详情
  let directionDetail = (text, all) => {
    setDetailVisible(true);
    setCurrentInfo(all);
  }
  //7编辑
  let editDirection = (text, all) => {
    history.push({
      pathname: '/popupTouchManage/directionalPopup/addEditDirection',
      query: {
        id: all.id,
        popupStatus: all.popupStatus,
        type:'edit'
      }
    })
  }
  let [type, setType] = useState('');//操作类型(启用，停用)
  let [beforeMsg, setBeforeMsg] = useState('');//启动之前提示

  // 1点击启用
  let handelEnable = (text, all, type) => {
    dispatch({
      type: 'directionalPopupManage/getValidateAfterEnable',// 启用前验证
      payload: {
        method: 'get',
        params: {},
        id: all.id
      },
      callback: (res) => {
        if (res.result.code == '0') {
          setIsModalVisible(true)
          setType(type)
          setCurrentData(all)
        } else if (res.result.code == '1008') {
          setBeforeStartupVisible(true)
          setType(type)
          setCurrentData(all)
          setBeforeMsg(res.result.message)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 2点击停用
  let handelDeactivate = (text, all, type) => {
    setIsModalVisible(true)
    setType(type)
    setCurrentData(all)
  }

  // 启用-停用
  let getUpdateStatus = () => {
    dispatch({
      type: 'directionalPopupManage/getUpdateStatus',
      payload: {
        method: 'postJSON',
        params: {
          id: currentData.id,
          updateStatus: type == 'enable' ? 2 : type == 'deactivate' ? 4 : ''
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {
          if (type == 'enable') {
            message.success('启用成功')
          } else if (type == 'deactivate') {
            message.success('停用成功')
          }
          setIsModalVisible(false)
          setBeforeStartupVisible(false)
          getQueryPopupDirectPage()
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 启用-停用确认操作
  const handleOk = () => {
    if (type == 'delete') {
      getDeleteId()
    } else {
      getUpdateStatus()
    }
  }

  // 3点击删除
  let handelDelete = (text, all, type) => {
    setIsModalVisible(true)
    setType(type)
    setCurrentData(all)
  }
  const getDeleteId = () => {
    dispatch({
      type: 'directionalPopupManage/getDeleteId',
      payload: {
        method: 'delete',
        params: {},
        id: currentData.id,
      },
      callback: (res) => {
        if (res.result.code == '0') {
          message.success('删除成功')
          setIsModalVisible(false)
          getQueryPopupDirectPage()
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  //表单查询
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
  const handleTableChange = (page,pageSize) => {
    setCurrent(page)
    setPageSize(pageSize)
  }
  return (
    <>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtn} onReset={resetBtnEvent}>
          <Form.Item label="弹窗名称：" name="popupName" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="弹窗页面：" name="popupPageId" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="请选择">
              {popupPageList && popupPageList.map((v) => {
                return <Option value={v.id}>{v.pageName}</Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item label="内容名称：" name="popupContentName" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="内容类型：" name="popupContentType" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="请选择">
              <Option value="1">图片</Option>
            </Select>
          </Form.Item>
          <Form.Item label="弹窗状态：" name="popupStatus" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="请选择">
              <Option value="1">未启用</Option>
              <Option value="2">已启用</Option>
              <Option value="4">已停用</Option>
            </Select>
          </Form.Item>
        </QueryFilter>
      </div>
      <div className={style.list_box}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
            <Button type='primary' onClick={newDirectionalPopup}>新建</Button>
          </Space>
        </ListTitle>
        {/*  */}
        <ListTable showPagination current={current} pageSize={pageSize} total={popupDirectData && popupDirectData.total}
          onChange={handleTableChange}>
          <Table dataSource={popupDirectData && popupDirectData.list} scroll={{x:1400}} pagination={false}>
            <Column title="弹窗ID" dataIndex="id" key="id" width={100}
            render={ (text, all) => (
              <a onClick={() => { directionDetail(text, all) }}>{text}</a>
            )}/>
            <Column title="弹窗名称" dataIndex="popupName" key="popupName" width={190}/>
            <Column title="弹窗页面" dataIndex="popupPageName" key="popupPageName"width={190}/>
            <Column title="内容名称" dataIndex="popupContentName" key="popupContentName" width={250}/>
            <Column title="内容类型" dataIndex="popupContentType" key="popupContentType" width={150}
            render={ (text, all) => (
              <TypeTags type={
                text == 1 ? 'red' :
                  text == 2 ? 'yellow' :
                    text == 3 ? 'green' :
                      text == 4 ? 'orange' : '#142ff1'}
              >{all.popupContentTypeStr}</TypeTags>
            )}/>
            <Column title="弹窗状态" dataIndex="popupStatus" key="popupStatus" width={100} 
            render={ (text, all) => (
              <span>
                <StateBadge status={
                  text == 1 ? 'error' :
                    text == 2 ? 'success' :
                      text == 4 ? 'warning' : 'default'}
                >
                {all.popupStatusStr}</StateBadge>
              </span>
            )}
            />
            <Column title="弹框开始时间" dataIndex="startTime" key="startTime" width={200}
              render={(text, all) => <ListTableTime>{text}</ListTableTime>}/>
            <Column title="弹框结束时间" dataIndex="endTime" key="endTime" width={200} 
              render={(text, all) => <ListTableTime>{text}</ListTableTime>}/>
            <Column title="操作" fixed="right" key="operation" width={230}
            render={(text, all)=>(<>
              <ListTableBtns showNum={3}>
              {all.popupStatus == 1 || all.popupStatus == 4 ? <>
                <LtbItem onClick={() => { handelEnable(text, all, 'enable') }}>启用</LtbItem>
                <LtbItem onClick={() => { editDirection(text, all) }}>编辑</LtbItem>
                <LtbItem onClick={() => { handelDelete(text, all, 'delete') }}>删除</LtbItem></> : ''}
              {all.popupStatus == 2 ? 
                <LtbItem onClick={() => { handelDeactivate(text, all, 'deactivate') }}>停用</LtbItem>
              : ''}
              </ListTableBtns> 
              </>
            )}/>
          </Table>
        </ListTable>
      </div>
      {/* 详情弹框 */}
      {
        detailVisible ?
          <DirectionalDetail detailVisible={detailVisible}
            currentInfo={currentInfo}
            closeModal={() => { setDetailVisible(false) }}
          />
          : ''
      }
      {
        beforeStartupVisible ?
          <Modal
            title='启动之前'
            visible={beforeStartupVisible}
            onOk={handleOk}
            onCancel={() => { setBeforeStartupVisible(false) }}>
            <p>{beforeMsg}</p>
          </Modal> : ""
      }

      {/* 启用，停用弹框 */}
      <Modal
        title={
          type == 'enable' ? '启用' :
            type == 'deactivate' ? '停用' :
              type == 'delete' ? '删除' : ''
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => { setIsModalVisible(false) }}>
        {
          type == 'enable' ? <p>请确认是否启用当前内容？</p> :
            type == 'deactivate' ? <p>请确认是否停用当前内容？</p> :
              type == 'delete' ? <p>请确认是否删除当前内容？</p> : ''
        }
      </Modal>
    </>
  )
}

export default connect(({ directionalPopupManage }) => ({
  popupDirectData: directionalPopupManage.popupDirectData,//列表数据
  popupPageList: directionalPopupManage.popupPageList,//列表数据
}))(directionalPopupPage)