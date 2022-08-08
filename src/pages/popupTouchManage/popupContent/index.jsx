import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Tag, Row, Col, Form, Space, Radio, DatePicker, Divider, Popconfirm, Modal, Input, Table, Select, Button, Pagination, ConfigProvider, message, Badge, Menu, Descriptions, Alert } from "antd"
import style from "../style.less";
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { QueryFilter} from '@ant-design/pro-form';
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";
import { fmoney } from '@/utils/date'
import DetailModal from './detailModal';


const { Column } = Table;
const { Option } = Select;
const { RangePicker } = DatePicker;


const popupContentPage = (props) => {
  let { dispatch, isRadioTabs, channelList, categoryList, moneyQuato, popupContentData, selsctMarketingItems, } = props;

  let [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);//操作弹框(启用，停用，删除)
  let [type, setType] = useState('');//操作类型(启用，停用，删除)
  let [currentData, setCurrentData] = useState({});//当前点击的数据
  // 子列表弹框
  const [sonListVisible, setSonListVisible] = useState(false);
  const [contentId, setContentId] = useState(null);
  let [currentInfo, setCurrentInfo] = useState({});//点击的当前数据

  const [callList, setCallList] = useState(false);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [payload, setPayload] = useState({});

  //modal回调
  const callModal = (flag) => {
    setCurrentData({})
    if (flag) {
      setCallList(!callList)
    }
  }


  useEffect(() => {
    getListPopupContent()
  }, [current, pageSize, payload, callList])

  //列表
  let getListPopupContent = () => {
    let newPayload = JSON.parse(JSON.stringify(payload));
    dispatch({
      type: 'popupContentManage/getListPopupContent',
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

  // 新建弹窗内容
  let newPopupContent = () => {
    history.push({
      pathname: '/popupTouchManage/popupContent/addEditContent',
      query: {
        type: 'add'
      }
    })
  }

  // 点击详情
  let sonList = (text, all) => {
    setSonListVisible(true);
    setContentId(text)
    setCurrentInfo(all);
  }
  // 操作
  const operation = (text, all) => {
    return <>
      {
        all.contentStatus == 1 ?
          <Space size="middle">
            <a onClick={() => { handelEnableOrDeactivateOrDelete(text, all, 'enable') }}>启用</a>
            <a onClick={() => { editPopupContent(text, all) }}>编辑</a>
            <a onClick={() => { handelEnableOrDeactivateOrDelete(text, all, 'delete') }}>删除</a>
          </Space>
          :
          all.contentStatus == 2 ?
            <Space size="middle">
              <a onClick={() => { handelEnableOrDeactivateOrDelete(text, all, 'deactivate') }}>停用</a>
              <a onClick={() => { editPopupContent(text, all) }}>编辑</a>
            </Space>
            : ''
      }

    </>
  }
  //7编辑
  let editPopupContent = (text, all) => {
    history.push({
      pathname: '/popupTouchManage/popupContent/addEditContent',
      query: {
        id: all.id,
        type: 'edit'
      }
    })
  }
  // 点击启用或停用或删除
  let handelEnableOrDeactivateOrDelete = (text, all, type) => {
    setIsModalVisible(true)
    setType(type)
    setCurrentData(all)
  }
  const enableOrDeactivateOrDeleteFunc = () => {
    dispatch({
      type: 'popupContentManage/getUpdatePopupContent',
      payload: {
        method: 'post',
        params: {
          objectId: currentData.id,
          status: type == 'enable' ? 1 : type == 'deactivate' ? 2 : type == 'delete' ? 3 : null,//状态 1:启用 2:停用 3:删除
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {
          if (type == 'enable') {
            message.success('启用成功')
          } else if (type == 'deactivate') {
            message.success('停用成功')
          } else if (type == 'delete') {
            message.success('删除成功')
          }
          setIsModalVisible(false)
          getListPopupContent()
        } else {
          message.error(res.result.message)
        }
      }
    });
  }
  // 确认操作
  const handleOk = () => {
    enableOrDeactivateOrDeleteFunc()
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
      {/* <div className={style.popupTouchPage}>
        <div className={style.tips}>
          <img src={require('@/assets/tipIcon.png')} style={{ width: '18px', height: '18px', margin: '0 10px' }} />
          <span>弹窗内容是对所有弹窗内容的管理，支持多种弹窗样式配置，可被定向弹窗、营销策略等应用。您可以在本页面进行筛选、新建和管理内容等操作；</span>
        </div>
      </div> */}
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtn} onReset={resetBtnEvent}>
          <Form.Item label="内容名称：" name="contentName" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="内容类型：" name="contentType" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="请选择">
              <Option value="1">图片</Option>
              {/* <Option value="2">图片+按钮</Option>
              <Option value="3">图片+文字+按钮</Option>
              <Option value="4">文字+按钮</Option> */}
            </Select>
          </Form.Item>
          <Form.Item label="内容状态：" name="contentStatus" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="请选择">
              <Option value="1">未启用</Option>
              <Option value="2">已启用</Option>
            </Select>
          </Form.Item>
        </QueryFilter>
      </div>
      <div className={style.list_box}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
            <Button type='primary' onClick={newPopupContent}>新建</Button>
          </Space>
        </ListTitle>
        {/*  */}
        <ListTable showPagination current={current} pageSize={pageSize} total={popupContentData && popupContentData.total}
          onChange={handleTableChange}>
          <Table dataSource={popupContentData && popupContentData.list} scroll={{x:1200}} pagination={false}>
            <Column title="弹窗内容ID" dataIndex="id" key="id" 
            render={ (text, all) => (
              <a onClick={() => { sonList(text, all) }}>{text}</a>
            )}/>
            <Column title="内容名称" dataIndex="contentName" key="contentName" />
            <Column title="内容类型" dataIndex="contentType" key="contentType" 
            render={ (text, all) => (
              <TypeTags type={
                text == 1 ? 'red' :
                  text == 2 ? 'yellow' :
                    text == 3 ? 'green' :
                      text == 4 ? 'orange' : '#142ff1'}
              >{all.contentTypeStr}</TypeTags>
            )}/>
            <Column title="内容状态" dataIndex="contentStatus" key="contentStatus" 
            render={ (text, all) => (
              <span>
                <StateBadge status={
                  text == 1 ? 'error' :
                    text == 2 ? 'success' :
                      text == 3 ? 'warning' :
                        text == 4 ? 'processing' : 'default'}
                >{all.contentStatusStr}</StateBadge>
              </span>
            )}/>
            <Column title="更新时间" dataIndex="updateTime" key="updateTime" width={200}
            render={(text, all)=>(
              <ListTableTime>{text}</ListTableTime>
            )}/>
            <Column title="操作人" dataIndex="updateUser" key="updateUser"/>
            {/* <Column title="操作" dataIndex="operation" key="operation" 
              render={ (text, all) => operation(text, all)}/> */}
            <Column title="操作"  key="operation" fixed="right" width={230}
            render={(text, all)=>(<>
              <ListTableBtns showNum={3}>
              {all.contentStatus == 1 ? <>
                <LtbItem onClick={() => { handelEnableOrDeactivateOrDelete(text, all, 'enable') }}>启用</LtbItem>
                <LtbItem onClick={() => { editPopupContent(text, all) }}>编辑</LtbItem>
                <LtbItem onClick={() => { handelEnableOrDeactivateOrDelete(text, all, 'delete') }}>删除</LtbItem></>:''}
              {all.contentStatus == 2 ? <>
                <LtbItem onClick={() => { handelEnableOrDeactivateOrDelete(text, all, 'deactivate') }}>停用</LtbItem>
                <LtbItem onClick={() => { editPopupContent(text, all) }}>编辑</LtbItem></>
              : ''}
              </ListTableBtns> 
              </>
            )}/>
          </Table>
        </ListTable>
      </div>
      {/* 详情弹框 */}
      {
        sonListVisible ?
          <DetailModal sonListVisible={sonListVisible}
            currentInfo={currentInfo}
            closeModal={() => { setSonListVisible(false) }}
          />
          : ''
      }

      {/* 操作弹框 */}
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

export default connect(({ popupContentManage }) => ({
  popupContentData: popupContentManage.popupContentData,
}))(popupContentPage)