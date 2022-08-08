import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Tag, Row, Col, Form, Space, Radio, DatePicker, Modal, Input, Table, Select, Button, Pagination, ConfigProvider, message, Badge, Alert } from "antd"
import style from "../style.less";
import moment from 'moment';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { QueryFilter, ProFormText,  ProFormSelect } from '@ant-design/pro-form';
import { fmoney } from '@/utils/date';
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";

const { Column } = Table;
const { Option } = Select;
const { RangePicker } = DatePicker;


const touchRecordPage = (props) => {
  let { dispatch, popupPageList } = props;
  let [form] = Form.useForm();

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [payload, setPayload] = useState({});
  const [popupRecordData,setPopupRecordData] = useState({});
  const [flag,setFlag] = useState(false);//进页面请求sql

  useEffect(() => {
    getPopupPageConfig()
  }, [])

  useEffect(() => {
    if(flag){
      getPopupPageConfig()
      getListPopupRecord()
    }
  }, [current, pageSize, payload])

  //列表
  let getListPopupRecord = () => {
    let newPayload = JSON.parse(JSON.stringify(payload));
    //触达时间
    if (newPayload.touchTime) {
      newPayload.touchTimeStart = moment(newPayload.touchTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss');
      newPayload.touchTimeEnd = moment(newPayload.touchTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    dispatch({
      type: 'touchRecordManage/getListPopupRecord',
      payload: {
        method: 'postJSON',
        params: {
          pageNum: current,
          pageSize: pageSize,
          query: newPayload
        }
      },callback: res => {
        if (res.result.code == '0') {
          setPopupRecordData(res.body)
        } else {
          message.error(res.result.message)
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


  // 表头
  const columns = [
    {
      title: '触达ID', dataIndex: 'id', key: 'id',
      render: (text, all) => <a>{text}</a>
    },
    { title: '用户手机号', dataIndex: 'phone', key: 'phone' },
    { title: '弹窗名称', dataIndex: 'popupName', key: 'popupName' },
    { title: '弹窗页面', dataIndex: 'popupPageName', key: 'popupPageName' },
    { title: '内容名称', dataIndex: 'popupContentName', key: 'popupContentName' },
    { title: '触达时间', dataIndex: 'touchTime', key: 'touchTime',
    render: (text, all) => {
      return <><ListTableTime>{text}</ListTableTime></>
    } },
    {
      title: '是否点击', key: 'isClickStr', dataIndex: 'isClickStr',
      // render: (text, all) => operation(text, all),
    }
  ];
  //表单查询
  const searchBtn = (val) => {
    if(JSON.stringify(val) == '{}'){
      return message.warn('请至少输入一项进行查询且日期不能低于31天！')
    }
    setFlag(true)
    setCurrent(1);
    setPayload(JSON.parse(JSON.stringify(val)))
  }

  //表单重置
  const resetBtnEvent = () => {
    setFlag(false)
    setPopupRecordData({})
    form.resetFields();
    setPayload({})
  }
  //分页切换
  const handleTableChange = (current,pageSize) => {
    setCurrent(current)
    setPageSize(pageSize)
  }
  const [expand, setExpand] = useState(false);

  /*校验日期 */
  let sendingTimeOnChange = (e) => {
    if (e != null) {
      if (!(Math.abs(moment(e[0]).diff(moment(e[1]), 'day')) < 31)) {
        form.setFieldsValue({
          touchTime:null
        })
        return message.warn("日期请选择31天之内！")
      }
    }
  }
  return (
    <>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtn} onReset={resetBtnEvent}>
          <ProFormText label="用户手机号：" name="phone" className={style.form__item} labelCol={{ flex: '0 0 120px' }} />
          <ProFormText label="弹窗名称：" name="popupName" className={style.form__item} labelCol={{ flex: '0 0 120px' }} />
          <ProFormSelect label="弹窗页面：" name="popupPageId" className={style.form__item} labelCol={{ flex: '0 0 120px' }}
            showSearch
            options={popupPageList && popupPageList.map((v) => {
              return { value: v.id, label: v.pageName }
            })} />
          <ProFormText label="内容名称：" name="popupContentName" className={style.form__item} labelCol={{ flex: '0 0 120px' }} />
          <Form.Item name="touchTime" label="触达时间" labelCol={{ flex: '0 0 120px' }}>
            <RangePicker
                  allowClear
                  onChange={sendingTimeOnChange}
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
          </Form.Item>

        </QueryFilter>
      </div>
      <div className={style.list_box}>
        <ListTitle titleName="结果列表"></ListTitle>
        <ListTable showPagination current={current} pageSize={pageSize} total={popupRecordData && popupRecordData.total}
        onChange={handleTableChange} 
        >
          <Table
            columns={columns}
            dataSource={popupRecordData && popupRecordData.list}
            pagination={false}
          />
        </ListTable>
      </div>
    </>
  )
}

export default connect(({ touchRecordManage, directionalPopupManage }) => ({
  popupRecordData: touchRecordManage.popupRecordData,//列表数据
  popupPageList: directionalPopupManage.popupPageList,//列表数据
}))(touchRecordPage)