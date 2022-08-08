import React,{useEffect, useState} from 'react';
import { connect } from 'umi';
import style from './style.less';
import { Form, Input, Table, Select, Row, Space, Button, Col, Tabs, Radio, DatePicker} from "antd";
const { RangePicker } = DatePicker
const { TabPane } = Tabs;
const { Column } = Table;
import {formatDate} from '@/utils/date'

const  SendHistory = (props) => {
  const { dispatch, SendHistoryeList, channelList} = props;
  let [form] = Form.useForm();
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filterData, setFilterData] = useState({})
  const [callList, setCallList] = useState(false)
  // 获取所属渠道
  useEffect(() => {
    dispatch({
      type: 'TemplateManage/queryChannelList',
      payload: {
        method: 'get',
        params: {
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId
        }
      }
    });
    form.setFieldsValue({
      channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
    })
  },[])
  //列表接口
  useEffect(() => {
    let query = JSON.parse(JSON.stringify(filterData));
    console.log(query.date)
    if(query.date) {
      query.startTime = formatDate(query.date[0])
      query.endTime = formatDate(query.date[1])
    }
    delete query.date
    dispatch({
      type: 'TemplateManage/querySendHistoryeList',
      payload: {
        method: 'post',
        params: {
          pageNo: current,
          pageSize: pageSize,
          startTime: query.startTime || '',
          endTime: query.endTime || ''
        }
      },
    });
  },[callList])
  //表单提交
  const submitData = (val) => {
    setFilterData(JSON.parse(JSON.stringify(val)))
    setCurrent(1)
    setPageSize(10)
    setCallList(!callList)
  }
  //表单重置
  const resetForm = () => {
    form.resetFields();
    setFilterData({})
    setCallList(!callList)
  }
  //分页切换
  const handleTableChange = (val) => {
    setCurrent(val.current)
    setPageSize(val.pageSize)
    setCallList(!callList)
  }

  return (
    <>
      <div className={style.template_box_wechart}>
        <Form form={form} onFinish={submitData}>
          <Row>
            <Col span={8}>
              <Form.Item  label="所属渠道" name="channelId"  labelCol={{flex:'0 0 120px'}}>  
                <Select allowClear placeholder="不限" disabled={true}>
                  {
                    channelList.map(v =>  <Option value={v.id}>{v.channelName}</Option>)
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="选择日期" name="date" labelCol={{flex:'0 0 120px'}}>
                <RangePicker style={{ width: '100%' }} onClick={(e)=> {console.log(e)}} format="YYYY-MM-DD" placeholder={['开始时间', '结束时间']}/>
              </Form.Item>
            </Col>
          </Row>
          <Row className={style.btns} justify="end">
            <Space size={22}>
              <Button htmlType="submit" type="primary">查询</Button>
            </Space>
          </Row>
        </Form>
      </div>
      <div className={style.tableData}>
        <Table onChange={handleTableChange} pagination={{
            current: current,
            pageSize: pageSize,
            total: SendHistoryeList.total
          }} dataSource={SendHistoryeList.list} scroll={{x:1200}}>
          <Column title="渠道" dataIndex="channelName" align='center' key="channelName" />
          <Column title="公众号" dataIndex="wecahtAppName" align='center' key="wecahtAppName" />
          <Column title="标题" dataIndex="title" align='center' key="title" /> 
          <Column title="发送日期" dataIndex="createTime" align='center' key="createTime" />
          <Column title="发送人数" dataIndex="sendCount" align='center' key="sendCount" />
          <Column title="送达人数" dataIndex="arriveCount" align='center' key="arriveCount" />
        </Table>
      </div>
    </>
  )
}
export default connect(({ TemplateManage }) => ({
  channelList: TemplateManage.channelList,
  SendHistoryeList: TemplateManage.SendHistoryeList
}))(SendHistory);