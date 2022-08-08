import React,{useEffect, useState} from 'react';
import { connect } from 'umi';
import style from './style.less';
import { Form, Input, Table, Select, Row, message, Space, Button, Col, Tabs, Radio} from "antd";
const { TabPane } = Tabs;
const { Column } = Table;
import ModalBox from '../wechatModal/index'


const  WexhartTemplat = (props) => {
  const { dispatch, TemplateWechart, channelList} = props;
  let [form] = Form.useForm();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterData, setFilterData] = useState({});
  const [callList, setCallList] = useState(false);
  //Modal数据
  const [modalInfo, setMdalInfo] = useState('');

  //modal回调
  const callModal = (flag) => {
    setMdalInfo('')
    if(flag) {
      setCallList(!callList)
    }
  }
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
    dispatch({
      type: 'TemplateManage/queryTemplateWechart',
      payload: {
        method: 'postJSON',
        params: {
          pageNo: current,
          pageSize: pageSize,
          ...filterData
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
  // 同步接口
  const synchronization = () => {
    dispatch({
      type: 'TemplateManage/syncTemplateFromRemoteService',
      payload: {
        method: 'postJSON',
      },
      callback: res => {
        if(res.result.code==0) {
          message.success({ style: { marginTop: '10vh', }, content: res.result.message });
          setCallList(!callList);
          return false;
        }else{
          return message.error({ style: { marginTop: '10vh', }, content: res.result.message });
        }
      }
    });
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
              <Form.Item  label="模板标题" name="title"  labelCol={{flex:'0 0 120px'}}>
                <Input placeholder="请输入" ></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row className={style.btns} justify="end">
            <Space size={22}>
              <Button onClick={() => {synchronization()}} htmlType="button">同步</Button>
              <Button onClick={() => {resetForm()}} htmlType="button">重置</Button>
              <Button htmlType="submit" type="primary">查询</Button>
            </Space>
          </Row>
        </Form>
      </div>
        <div className={style.tableData}>
          <Table onChange={handleTableChange} pagination={{
              current: current,
              pageSize: pageSize,
              total: TemplateWechart.total
            }} dataSource={TemplateWechart.list} scroll={{x:1200}}>
            <Column title="渠道" dataIndex="channelName" align='center' key="channelName" />
            <Column title="公众号" dataIndex="appName" align='center' key="appName" />
            <Column title="模板ID" dataIndex="templateId" align='center' key="templateId" />
            <Column title="标题" dataIndex="title" align='center' key="title" /> 
            <Column width={280} title="操作" key="id" align='center' fixed='right' render={(text, record) => (
              <a onClick={() => {setMdalInfo({modalName: 'mass', ...record})}}>群发</a>
            )} />
          </Table>
      </div>
      {modalInfo?<ModalBox modalInfo={modalInfo} toFatherValue={(flag)=>callModal(flag)} />:''}
    </>
  )
}
export default connect(({ TemplateManage }) => ({
  channelList: TemplateManage.channelList,
  TemplateWechart: TemplateManage.TemplateWechart
}))(WexhartTemplat);