import React,{useEffect, useState} from 'react';
import { connect } from 'umi';
import style from './style.less';
import { Form, Input, Table, Select, Row, Space, Button, Col, Tabs, Radio, DatePicker} from "antd";
const { RangePicker } = DatePicker
const { TabPane } = Tabs;
const { Column } = Table;
import {formatDate} from '@/utils/date'

const  bePaidTemplate = (props) => {
  const { dispatch, BePaidTemplateList, channelList} = props;
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
      query.startDate = formatDate(query.date[0])
      query.endDate = formatDate(query.date[1])
    }
    delete query.date
    dispatch({
      type: 'TemplateManage/queryBePaidTemplateList',
      payload: {
        method: 'post',
        params: {
          pageNo: current,
          pageSize: pageSize,
          startDate: query.startDate || '',
          endDate: query.endDate || '',
          customerName: query.customerName || '',
          identityNo: query.identityNo || '',
          openID: query.openID || '',
          phone: query.phone || '',
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
              <Form.Item  label="OpenID" name="openID"  labelCol={{flex:'0 0 120px'}}>
                <Input placeholder="请输入" ></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item  label="姓名" name="customerName"  labelCol={{flex:'0 0 120px'}}>
                <Input placeholder="请输入" ></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="选择日期" name="date" labelCol={{flex:'0 0 120px'}}>
                <RangePicker style={{ width: '100%' }} onClick={(e)=> {console.log(e)}} format="YYYY-MM-DD" placeholder={['开始时间', '结束时间']}/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item  label="手机号" name="phone"  labelCol={{flex:'0 0 120px'}}>
                <Input placeholder="请输入" ></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item  label="身份证" name="identityNo"  labelCol={{flex:'0 0 120px'}}>
                <Input placeholder="请输入" ></Input>
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
            total: BePaidTemplateList.total
          }} dataSource={BePaidTemplateList.list} scroll={{x:1200}}>
          <Column title="序号" dataIndex="objectId" align='center' key="objectId" />
          <Column title="渠道" dataIndex="channelName" align='center' key="channelName" />
          <Column title="OpenID" dataIndex="openID" align='center' key="openID" render={(text, record) => (
            <span>{record.openID || '-'}</span>
          )}/>
          <Column title="姓名" dataIndex="customerName" align='center' key="customerName" /> 
          <Column title="手机号" dataIndex="customerPhone" align='center' key="customerPhone" />
          <Column title="身份证" dataIndex="identityNo" align='center' key="identityNo" />
          <Column title="创建时间" dataIndex="createTime" align='center' key="createTime" />
          <Column title="送达结果" dataIndex="readStatus" align='center' key="readStatus" render={(text, record) => (
            <span>{record.readStatus ? '已读' : '未读'}</span>
          )}/>
        </Table>
      </div>
    </>
  )
}
export default connect(({ TemplateManage }) => ({
  channelList: TemplateManage.channelList,
  BePaidTemplateList: TemplateManage.BePaidTemplateList
}))(bePaidTemplate);