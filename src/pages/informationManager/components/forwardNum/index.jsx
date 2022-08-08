import React,{useEffect, useState} from "react"
import { connect, history } from 'umi'
import { Row, Col,Form, Modal,  Select, Input, DatePicker, Button, Table, ConfigProvider, Space, Pagination , Tooltip } from "antd"
import style from "./style.less"
import moment from 'moment';
import 'moment/locale/zh-cn';
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import {formatDate} from '@/utils/date'
const { RangePicker } = DatePicker;
moment.locale('zh-cn');
const { confirm } = Modal
const forwardInfomation =(props)=>{
  let {dispatch,  modalInfo ,toFatherValue  } = props,
  [form] = Form.useForm()
  const [list,setList] = useState([])
  const [pageInfo, setPageInfo] = useState({})//分页器
  const [teamSelectList, setTeamSelectList] = useState({})//团队下拉框
  const [payload, setPayload] = useState({
    newsId:modalInfo.data.objectId,
    endTime:null,
    pageNum:1,
    pageSize:10,
    startTime:null,
    teamId:null
  }) //搜索条件
  
  useEffect(() => {
    queryForwardDetail();
  },[payload])

  useEffect(() => {
    teamList();
  },[])

  //查询团队
  let teamList = ()=>{
    dispatch({
      type: 'informationManager/getTeamInfoByUniway',
        payload: {
          method:'postJSON'
        },
        callback: res => {
          if(res.result.code == '0'){
            setTeamSelectList(res.body.data)
          }
        }
      }) 
  }

  let exportForwardInfo = ()=>{
    dispatch({
      type: 'informationManager/exportForwardInfo',
        payload: {
          method:'postJsonExcel',
          params: payload
        },
        callback: res => {
          console.log(res)
          const url = window.URL.createObjectURL(new Blob([res], { type: "application/vnd.ms-excel" }))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '导出名单.xlsx')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }) 
  }

  //导出
  let queryForwardDetail = ()=>{
    dispatch({
      type: 'informationManager/queryForwardDetail',
        payload: {
          method:'postJSON',
          params: payload
        },
        callback: res => {
          if(res.result.code == '0'){
            setList(res.body.data)
            setPageInfo(res.body.pageInfo)
          }
        }
      }) 
  }

  //添加提交
  let submitEvent = (value) => {
    let initPayload = JSON.parse(JSON.stringify(value));
    initPayload.newsId=modalInfo.data.objectId
    if(value.startTime) {
      initPayload.startTime = formatDate(value.startTime[0])
      initPayload.endTime = formatDate(value.startTime[1])
    }
    setPayload(initPayload)
    console.log(initPayload)
  }
  //导出
  let importOut = () =>{
    exportForwardInfo();
  }



  //列表字段
  let renderColumns = () => {
    return (
      [{
        title: '客户',
        dataIndex: 'channelName',
        width: 90,
        align: 'center'
      }, {
        title: '门店',
        dataIndex: 'branchName',
        width: 90,
        align: 'center'
      },
       {
        title: '团队',
        dataIndex: 'teamName',
        width: 90,
        align: 'center'
      },
      {
        title: '销售名称',
        dataIndex: 'userName',
        width: 90,
        align: 'center',
      }, {
        title: '销售账号',
        dataIndex: 'userId',
        width: 90,
        align: 'center'
      }, {
        title: '转发数量',
        dataIndex: 'forwardNum',
        width: 50,
        align: 'center',
      }, {
        title: '转发点击数量',
        dataIndex: 'forwardClickNum',
        width: 70,
        align: 'center'
      }]
    )
  }
  //显示总条数和页数
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageInfo.pageSize)
    return `共${total}条记录 第 ${pageInfo.pageNo} / ${totalPage}  页`
  }
  //改变每页条数
  let onSizeChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    console.log(this_payload,"this_payload")
    this_payload.pageNum = this_payload.pageNo
    this_payload.pageSize = pageSize
    setPayload(this_payload)
    onPageTotal()
  }
  //点击下一页上一页*
  let onNextChange = (pageNum, pageSize) => {
    setPayload({pageNum:pageNum,pageSize:pageSize})
  }
  return(
    <>
      <Modal width={1200} title={'资讯转发详情'} visible={modalInfo.modalName=='forward'}
        footer={null} onCancel={()=>{toFatherValue(false)}}
        >
          <Form form={form} onFinish={submitEvent} className={style.form}>
            <Row >
              <Col span={8}>
                <Form.Item label="团队" name="teamId" labelCol={{flex:'0 0 120px'}}>
                  <Select
                    showSearch
                    notFoundContent='暂无数据'
                    placeholder="请输入"
                    optionFilterProp="children"
                    >
                      {
                        teamSelectList && teamSelectList.length ?
                        teamSelectList.map((item, key) => {
                            return <Option key={key} value={item.objectId}>{item.teamName}</Option>
                          }): ''
                      }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="销售账号" name="userId" labelCol={{flex:'0 0 120px'}}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="生效时间" name="startTime" labelCol={{flex:'0 0 120px'}}>
                    <RangePicker style={{ width: '100%' }} onClick={(e)=> {console.log(e)}} format="YYYY-MM-DD"/>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end" >
              <Space size={22}>
                <Button htmlType="submit" type="primary">查询</Button>
                <Button htmlType="button" onClick={importOut}>导出</Button>
              </Space>
            </Row>
          </Form>
          <div className={style.tableData}>
          <Table
            scroll={{x:1200}}
            locale={{ emptyText: '暂无数据' }}
            columns={renderColumns()}
            dataSource={list}
            pagination={false}
            loading={{
              spinning: false,
              delay: 500
            }}
          />
          <ConfigProvider locale={zh_CN}>
            <Pagination
              className={style.pagination}
              showTitle={false}
              current={pageInfo.pageNum}
              defaultPageSize={pageInfo.pageSize}
              total={pageInfo.totalCount}
              onChange={onNextChange}
              showSizeChanger 
              pageSizeOptions={['10', '20', '30', '60']}
              onShowSizeChange={onSizeChange}
              showTotal={onPageTotal}
            />
          </ConfigProvider>
        </div>
      </Modal>
      
    </>
  )
};
export default connect(({informationManager})=>({

}))(forwardInfomation)


