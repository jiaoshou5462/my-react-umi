import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {
  Row,
  Tag,
  Form,
  Modal,
  Table,
  Upload,
  Select,
  Button,
  message,
  Pagination,
  ConfigProvider,
  DatePicker
} from "antd"
import style from "./style.less"
const { Option } = Select
const { RangePicker } = DatePicker
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { InfoCircleTwoTone } from '@ant-design/icons'
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
moment.locale('zh-cn')
/*状态*/
let statusArr = ['未开始','进行中','导入完成','导入失败']

const importListPage = (props) => {
  let { dispatch, channelList, fileTaskList, pageTotal } = props,
      [form] = Form.useForm(),
      [list, setList] = useState([]), // 列表
      [channelId, setChannelId] = useState(''),
      [pageNum, setPage] = useState(1),
      [pageSize, setPageSize] = useState(10),
      [fileList,setFileList] = useState([]),
      [cookieObj, setCookieObj] = useState({}), //请求令牌
      [payload, setPayload] = useState({
        pageNum,
        pageSize,
        taskType: 'crmCustomer',
      })
  /*回调*/
  useEffect(() => {
    setList(fileTaskList)
  },[fileTaskList])
  useEffect(() => {
    getChannel(history.location.query.channelId)
    let cookieObj = (()=>{
      let cookieData = {};
      document.cookie.split(";").forEach((v)=>{
        let keyVal = v.split("=");
        cookieData[keyVal[0].trim()] = keyVal[1] || "";
      });
      return cookieData;
    })()
    setCookieObj(cookieObj)
  }, [])
  useEffect(() => {
    if(Object.keys(channelList).length > 0){
      let temp = channelList.channelList || []
      if(temp.length > 0){
        setChannelId(temp[0].id)
        form.setFieldsValue({
          channelId: temp[0].id
        })
      }
    }
  },[channelList])
  /*回调*/
  useEffect(() => {
    if(channelId){
      getList()
    }
  }, [pageNum, pageSize, payload, channelId])
  /*获取渠道*/
  let getChannel = (channelId) => {
    dispatch({
      type: 'importList/getActivityChannelList',
      payload: {
        method: 'post',
        params: {
          channelId
        }
      }
    })
  }
  /*获取列表*/
  let getList = () => {
    payload.channelId = channelId
    dispatch({
      type: 'importList/getList',
      payload: {
        method: 'get',
        params: payload
      }
    })
  }
  /*；列表*/
  let renderColumns = () => {
    return (
      [{
        title: '任务批次',
        dataIndex: 'taskBatchId',
      }, {
        title: '导入文件',
        dataIndex: 'fileName',
        render: (fileName, record) => fileRender(fileName, record)
      }, {
        title: '状态',
        dataIndex: 'status',
        render: (status) => renderStatus(status)
      }, {
        title: '导入成功数',
        dataIndex: 'successNum',
      }, {
        title: '导入失败数',
        dataIndex: 'failNum',
      }, {
        title: '操作人',
        dataIndex: 'operateUser',
      }, {
        title: '开始时间',
        dataIndex: 'startTime',
        render: (startTime) => {
          return <span>{moment(startTime).format('YYYY-MM-DD HH:mm')}</span>
        }
      }, {
        title: '结束时间',
        dataIndex: 'endTime',
        render: (endTime) => {
          return <span>{endTime ? moment(endTime).format('YYYY-MM-DD HH:mm') : '——'}</span>
        }
      }, {
        title: '操作',
        dataIndex: 'status',
        render: (status, record) => Operation(status, record)
      }]
    )
  }
  /*下载导入文件*/
  let fileRender = (fileName, record) => {
    return <span className={style.click_blue}>
      <span onClick={() => {downloadActivityExcel(record.fileCode)}}>{fileName}</span>
    </span>
  }
  /*下载错误文件*/
  let Operation = (status, record) => {
    if(record.errorFileCode) {
      return <span className={style.click_blue}>
        <span onClick={() => {downloadActivityExcel(record.errorFileCode)}}>下载错误文件</span>
      </span>
    }else {
      return <span>——</span>
    }
  }
  /*状态tag标签*/
  let renderStatus = (status) => {
    let statusCor = ''
    if (status === 0) {
      statusCor = 'default'
    }
    if (status === 1) {
      statusCor = 'blue'
    }
    if (status === 2) {
      statusCor = 'green'
    }
    if (status === 3) {
      statusCor = 'red'
    }
    return <Tag color={statusCor}>{statusArr[status]}</Tag>
  }
  /*下载文件接口*/
  let downloadActivityExcel = (fileCode) => {
    let data = {
      fileCode,
    }
    dispatch({
      type: 'importList/onDownloadFile',
      payload: {
        method: 'getDownloadExcel',
        params: data,
        allData: true
      },
      callback: (res) => {
        const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/vnd.ms-excel" }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', decodeURIComponent(res.headers.filename) )
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    })
  }
  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) => {
    payload.pageNum = page
    setPayload(payload)
    setPage(page)
    setPageSize(pageSize)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    payload.pageNum = page
    payload.pageSize = pageSize
    setPage(page)
    setPageSize(pageSize)
    setPayload(payload)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNum} / ${totalPage}  页`
  }
  /*渠道change 事件*/
  let onChannelChange = (e) => {
    setChannelId(e)
  }
  /*上传配置*/
  let uploadConfig = {
    name:"files",
    maxCount: 1,
    action:"/api/file/upload?folderCode=sale_customer",
    accept: ".xls,.xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",   //上传文件类型--这个是excel类型
    showUploadList: true,
    headers: {
      "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken
    },
    beforeUpload(file) { //上传之前
      message.loading('文件上传中', 0)
    },
    onChange(e){ //上传完成之后
      setFileList(e.fileList)
      if (e.file.status === "done"){
        message.destroy();
        message.success(`${e.file.name} 上传成功!`)
        if(e.file.response.result.code === '0'){
          addFileTaskInfo({
            fileName: e.file.name,
            fileCode: e.file.response.body[0],
          })
        }
      } else if (e.file.status === "error"){
        message.destroy()
        message.error(`${e.file.name} 上传失败!`)
      }
    }
  }
  /*新增上传任务批次*/
  let addFileTaskInfo = (fileData) => {
    let data ={
      channelId,
      ...fileData,
      taskType: 'crmCustomer',
    }
    dispatch({
      type: 'importList/addFileTaskInfo',
      payload: {
        method: 'postJSON',
        params: data,
      },
      callback: (res) => {
        if(res.result.code === '0') {
          message.success('导入成功!')
          getList()
        }else {
          message.error('导入失败!')
        }
      }
    })
  }
  let onRefresh = () => {
    getList()
  } 
  return (
    <div>
      <div className={style.block__cont}>
        <div className={style.block__header}>
          <span>导入销售客户</span>
        </div>
        <Form className={style.form__cont} form={form}>
          <Row justify="space-around" align="center">
            <Form.Item label="渠道：" name="channelId"  className={style.form__item} labelCol={{ span: 8 }}>
              <Select
                  disabled
                  showSearch
                  value={channelId}
                  onChange={onChannelChange}
                  notFoundContent='暂无数据'
                  placeholder="输入渠道可筛选"
                  optionFilterProp="children"
              >
                {
                  channelList && channelList.channelList ?
                      channelList.channelList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.channelName}</Option>
                      })
                      : ''
                }
              </Select>
            </Form.Item>
            <Form.Item label="导入客户：" name="activityTime" className={style.form__item} labelCol={{ span: 8 }}>
              <Upload {...uploadConfig}  fileList={fileList} disabled={!channelId ? true : false}>
                <Button icon={<UploadOutlined />} className={style.click_blue} disabled={!channelId ? true : false}>
                  {!channelId ? '请先选择渠道' : '上传导入销售客户文件'}
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item label="导入模板：" name="activityTime" className={style.form__item} labelCol={{ span: 8 }}>
              <div  className={style.put_down}>
                <DownloadOutlined />
                <a href='https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/file-template/carowner-admin/%E9%94%80%E5%94%AE%E5%AE%A2%E6%88%B7%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88v3.xlsx'  download='导入销售客户模版.xlsx' >下载导入销售客户模板 </a>
              </div>
            </Form.Item>
          </Row>
        </Form>
      </div>
      <div className={style.block__cont__t}>
        <div className={style.block__header__f} >
          <Button className={style.btn_radius} type="primary" onClick={onRefresh}>刷新列表</Button>
        </div>
        <Table
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
            showQuickJumper
            showTitle={false}
            current={pageNum}
            defaultPageSize={pageSize}
            total={pageTotal}
            onChange={onNextChange}
            pageSizeOptions={['10', '20', '30', '60']}
            onShowSizeChange={onSizeChange}
            showTotal={onPageTotal}
          />
        </ConfigProvider>
      </div>
    </div>
  )
};
export default connect(({ importList }) => ({
  pageTotal: importList.pageTotal,
  fileTaskList: importList.fileTaskList,
  channelList: importList.channelList,
}))(importListPage)
