import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Space, Radio, Input,InputNumber, Select, Button, Tooltip, DatePicker, message, Upload, Alert, Table, Spin  } from 'antd';
const { Column } = Table;
import { connect ,history} from 'umi';
import 'moment/locale/zh-cn'
import style from './style.less';
import {folderCode} from '@/services/sales';
import SaleModal from '../saleModal'


const distribution = (props) => {
  let { dispatch } = props
  let [form] = Form.useForm()
  let [channelId, setChannelId] = useState(localStorage.getItem('tokenObj') && JSON.parse(localStorage.getItem('tokenObj')).channelId || '')

  const [fileList,setFileList] = useState([]); // 文件
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [callList, setCallList] = useState(false)
  const [isAleatShow, setIsAleatShow] = useState(false)
  const [alertList, setAlertList] = useState([])
  const [isEdit, setIsEdit] = useState(false); // 标记当前页面是否修改

  const [taskStatus, setTaskStatus] = useState(localStorage.getItem('taskStatus'));//任务状态   用于区分页面是否禁用

  const [taskKpiList, setTaskKpiList] = useState([]); // 指标数组
  const [taskKpiVOList, setTaskKpiVOList] = useState([]); //传给后天的数组
  const [taskSaleList, setTaskSaleList] = useState([]); // 列表
  const [pageInfoVO, setPageInfoVO] = useState({})
  const [isShowBtn, setIsShowBtn] = useState(false); // 导出文件按钮显示与隐藏
  const [fileCode, setFileCode] = useState(null); // 文件code
  const [isShowBtnDisadled, setIsShowBtnDisadled] = useState(false); // 导出文件置灰与否
  const [loading, setLoading] = useState(null);

  let [taskId, setTaskId] = useState(history.location.query.taskId) //任务id
  let [assignSaleType, setAssignSaleType] = useState(1) //选择导入员工的类型
  let [saleIdList, setSaleIdList] = useState([]) //弹窗选中的销售
  let [saleVisible, setSaleVisible] = useState(false) //弹窗状态
  let [saleModalFlag, setSaleModalFlag] = useState(false) //选择销售弹窗类型 true删除 false添加
  let [pageStatus, setPageStatus] = useState(false) //非列表数据只赋值一次

  useEffect(() => {
    setPageStatus(false)
  }, [])

  useEffect(() => {
    querySaleKpiLIst();
  }, [callList])

  // 分页
  const handleTableChange = (val) => {
    setCurrent(val.current)
    setPageSize(val.pageSize)
    setCallList(!callList)
  }
  // 下一步
  let onSubmit = () => {
    if(taskKpiList && taskKpiList.length>0) {
      let isContinue = 1;
      for(let item of taskKpiList){
        if(!item.kpi || item.kpi==null){
          isContinue = 2
          return message.error(`请输入${item.taskTypeStr}指标`)
        }
      }
      if(isContinue==1) {
        let temp = {
          taskId,
          assignSaleType,
          taskKpiVOList: isEdit ? taskKpiVOList : returnTaskKpiList(),
        }
        dispatch({
          type:'saleDistribution/queryTaskKpiWeight',
          payload: {
            method: 'postJSON',
            params: temp
          },
          callback: res => {
            if(res.result.code === '0') {
              if(!res.body) {
                message.error(res.result.message);
              }else {
                setIsAleatShow(true)
                setAlertList(res.body.taskKpiVOList)
                if(res.body.flag) {
                  history.push(`/sale/task/saleTaskModule/finish?taskId=${taskId}`)
                }
              }
            }
          }
        })
      }
    }else {
      return message.error('任务KPI指标不能为空!')
    }
  }
  /*上传配置*/
  let uploadConfig = {
    name:"files",
    maxCount: 1,
    action: folderCode,
    accept: ".xls,.xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",   //上传文件类型--这个是excel类型
    showUploadList: true,
    headers: {
      "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken
    },
    onChange(e){ //上传完成之后
      setFileList(e.fileList)
      if (e.file.status === "done"){
        message.destroy();
        message.success(`${e.file.name} 上传成功!`)
        if(e.file.response.result.code === '0'){
          importTask(e.file.response.body[0])
        }
      } else if (e.file.status === "error"){
        message.destroy()
        message.error(`${e.file.name} 上传失败!`)
      }
    }
  }
  // 导入销售账号
  let importTask = (fileCode) =>{
    dispatch({
      type:'saleDistribution/saleImportExcel',
      payload: {
        method: 'postJSON',
        params: {
          fileCode,
          taskId,
        }
      },
      callback: res => {
        downloadSaleExcel();
      }
    })
  }
  // 导出员工错误文件
  let downloadSaleExcel = () => {
    let t1;
    let data = {
      taskId,
    }
    dispatch({
      type: 'saleDistribution/downloadTaskExcel',
      payload: {
        method: 'postJSON',
        params: data,
        loading: false
      },
      callback: (res) => {
        if(res.result.code=='1001'){
          setLoading(true)
          t1 = window.setTimeout(downloadSaleExcel,3000);
        }else{
          setLoading(false)
          window.clearTimeout(t1);
          querySaleKpiLIst();
          if(res.body.excel == 1){
            setIsShowBtn(true)
            message.success(res.body.msg);
            setIsShowBtnDisadled(true)
          } else if(res.body.excel == 2) {
            return message.error('导入员工条数不能超过1万条!')
          } else {
            setIsShowBtn(true)
            message.success(res.body.msg);
            setIsShowBtnDisadled(false)
            setFileCode(res.body.excel)
          }
          // downloadErrorExcel(res.body.excel)
        }
      }
    })
  }
  // downloadErrorExcel
  let downloadErrorExcel = (fileCode) => {
    let data = {
      fileCode,
    }
    dispatch({
      type: 'saleDistribution/onDownloadFile',
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
        link.setAttribute('download', decodeURIComponent('导出员工错误文件列表.xlsx'));
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    })
  }
  // 查询销售列表
  let querySaleKpiLIst = (page) => {
    dispatch({
      type:'saleDistribution/getTaskSaleKpiList',
      payload: {
        method: 'postJSON',
        params: {
          taskId,
          channelId,
          delete: false,
          pageInfo:{
            pageSize,
            pageNo: !page ? current : page
          }
        }
      },
      callback: res => {
        let tempData = res.body || {}
        let temp = tempData.taskSaleList || []
        if(temp.length > 0) {
          temp.map((item, key) => {
            item.key = key
          })
        }
        setTaskSaleList(temp)
        setPageInfoVO(tempData.pageInfoVO || {})
        if(!pageStatus){
          setPageStatus(true)
          setTaskKpiList(tempData.taskKpiInfo)
          setAssignSaleType(tempData.assignSaleType || 1)
        }
      }
    })
  }
  // kpi指标change事件
  let handleKpi = (val, item, index) => {
    let newList = taskKpiList.map((mItem, mIndex) => {
      if(index==mIndex) {
        setIsEdit(true)
        mItem.kpi = val
        return { kpi : Number(val), type: mItem.taskType}
      }else{
        return { kpi: mItem.kpi, type: mItem.taskType}
      }
    })
    setTaskKpiVOList(newList)
  }
  // 页面没修改时传递的数据返回数据
  let returnTaskKpiList = () => {
    let newList = taskKpiList.map(mItem => {
      return { kpi: mItem.kpi, type: mItem.taskType}
    })
    return newList
  }
  /*批量添加销售*/
  let onAddSale = () => {
    setSaleModalFlag(false)
    setSaleVisible(true)
  }
  /*批量删除销售*/
  let onBatchDel = () => {
    setSaleModalFlag(true)
    setSaleVisible(true)
  }
  // 表格删除
  let deleteTask = (id) => {
    dispatch({
      type:'saleDistribution/deleteTaskId',
      payload: {
        method: 'postJSON',
        params: {
          id: [id],
        },
      },
      callback: res => {
        if(res.result.code === '0') {
          querySaleKpiLIst()
        }
      }
    })
  }

  /*选择导入员工类型*/
  let onSaleTypeChange = (e) => {
    let value = e.target.value
    setAssignSaleType(value)
  }
  let onSaleModalCallback = (e) => {
    if(e === 1){
      setCurrent(1)
      querySaleKpiLIst(1)
    }
    setSaleVisible(false)
    setSaleModalFlag(false)
  }
  /*上一步*/
  let goBack = () => {
    let taskDetail = localStorage.getItem('taskDetail')
    let temp = taskStatus || '3'
    localStorage.setItem('taskStatus', temp === '3' ? '3' : temp) // 任务状态, 3 为待发布，可编辑
    localStorage.setItem('taskDetail', taskDetail === '2' || taskDetail === '1' ? '2' : taskDetail)
    history.push(`/sale/task/saleTaskModule/taskreward?taskId=${history.location.query.taskId}`)
  }
  return (
    <>
      <Form form={form} onFinish={onSubmit} wrapperCol={{ span: 12 }}>
        <div className={style.distribution}>
          <Row style={{marginBottom: '20px'}}>
            <Col>选择员工：</Col>
            <Col>
              <Radio.Group disabled={taskStatus == 1 || taskStatus == 2} onChange={onSaleTypeChange} value={assignSaleType}>
                <Radio value={1}>全部员工</Radio>
                <Radio value={2}>部分员工</Radio>
                <Radio value={3}>批量导入员工</Radio>
              </Radio.Group>
            </Col>
          </Row>
          <Row>
            {
              assignSaleType === 2 ? <Col span={24} className={style.task_col} style={{display:'flex'}}>
                <Button type='primary' onClick={onAddSale}>选择员工</Button>
              </Col> : null
            }
            {
              assignSaleType === 3 ? <Col span={24} className={style.task_col} style={{display:'flex'}}>
                <Upload  {...uploadConfig}  fileList={fileList}>
                  <Button type='primary'>批量导入员工</Button>
                </Upload>
                {
                  isShowBtn ?
                      <Button danger disabled={isShowBtnDisadled} onClick={()=> {downloadErrorExcel(fileCode)}} style={{marginLeft:"10px"}}>导出员工错误文件</Button> : ''
                }
                <a className={style.download_template} href="https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/file-template/carowner-admin/%E9%94%80%E5%94%AE%E4%BB%BB%E5%8A%A1%E4%B8%8B%E8%BD%BD%E6%A8%A1%E6%9D%BF.xlsx" download='销售任务模版.xlsx'>下载导入模板</a>
              </Col> : null
            }
            <Col span={24} className={style.task_col}>
              <Row>
                {
                  taskKpiList && taskKpiList.length ?
                  <Col flex="0 0 120px"><span className={style.span_kpi}>平均每人分配KPI</span></Col>: ''
                }
                {
                  taskKpiList && taskKpiList.length ?
                  taskKpiList.map((item, index) => {
                    return (<Col flex="0 0 30%" offset={`${index == taskKpiList.length-1?2:0}`}>
                      <Form.Item label={`${item.taskTypeStr}`} labelCol={{flex:'0 0 140px'}} wrapperCol={{maxWidth: '100%'}}>
                        <InputNumber
                            precision={0}
                            value={item.kpi || ''}
                            style={{width: '100%'}}
                            disabled={taskStatus==1 || taskStatus==2}
                            placeholder={`请输入${item.taskTypeStr}指标`}
                            onChange={(e)=> {handleKpi(e, item, index)}}
                        />
                      </Form.Item>
                      <span className={style.input_unit}>{(item.taskType==5 || item.taskType==7) ? '次' :  '人'}</span>
                    </Col>)
                  }) : null
                }
              </Row>
            </Col>
            {
              isAleatShow ?
              <Col span={24}>
                {
                  // （1扫码跳转，2扫码获客，3卡券领取，4卡券使用，5文章转发，6文章点击，7产品转发，8产品点击）
                  alertList && alertList.length ?
                    <div className={style.alert_txt}>
                    {
                      alertList.map((item) => {
                        return <>已添加{item.peopleNum}员工，预估kpi约为：
                        {item.typeStr}约{item.num}{(item.type==5 || item.type==7) ? '次' :  '人'}，
                        <span style={item.color ? {color:'#03BF16'} : {color:'#D9001B'}}>{item.msg}</span>；</>
                      })
                    }
                    </div> : null
                }
              </Col> : ''
            }
          </Row>
          {
            assignSaleType !== 1 ?  <>
              <div className={style.table_title_box}>
                <Button type='primary' onClick={onBatchDel}>批量移除</Button>
              </div>
              <Table
                  scroll={{x:1000}}
                  dataSource={taskSaleList}
                  onChange={handleTableChange}
                  pagination={{
                    current: current,
                    pageSize: pageSize,
                    total: pageInfoVO.totalCount || 0
                  }}
              >
                <Column title="客户" dataIndex="channelName" />
                <Column title="门店" dataIndex="branchName" />
                <Column title="团队" dataIndex="teamName" />
                <Column title="销售名称" dataIndex="saleName" />
                <Column title="销售账号" dataIndex="saleId" />
                <Column title="是否绑定企微" dataIndex="isBindWork" render={(isBindWork) => {
                  return <span>{isBindWork === 1 ? '是' : '否'}</span>
                }} />
                <Column title="操作" dataIndex="id" render={(text, record) => (
                    <a onClick={()=> {deleteTask(record.id)}}>移除</a>
                )} />
              </Table>
            </> : null
          }
          <Row>
            <Col span={24} className={style.btn_box}>
              <Space size={24}>
                <Button  htmlType="button" onClick={()=> {history.push(`/sale/task`)}}>返回列表</Button>
                <Button  htmlType="button" onClick={goBack}>上一步</Button>
                <Button htmlType="submit" type="primary">下一步</Button>
              </Space>
            </Col>
          </Row>
        </div>
      </Form>
      {
        loading ? <Spin size="large" tip="请稍等..." className={style.spin}/> : ''
      }
      {
        saleVisible ?
            <SaleModal
                taskId={taskId}
                channelId={channelId}
                saleVisible={saleVisible}
                saleModalFlag={saleModalFlag}
                onSaleModalCallback={onSaleModalCallback}
            />
            : null
      }
    </>
  )
}
export default connect(({ saleDistribution }) => ({
}))(distribution);
