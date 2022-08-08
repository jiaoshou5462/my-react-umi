import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Upload, Form, Input, Table, Select, Row, Space, Button, Col, DatePicker, Modal, Pagination, message } from "antd";
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;
import style from "./style.less";
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import {folderCode} from '@/services/sales';
import ModalBox from '../components/batchModal';
import 'moment/locale/zh-cn'
moment.locale('zh-cn')


const BatchOperation = (props) => {
  let { dispatch, location } = props;
  let [batchInfo, setBatchInfo] = useState(location.state && location.state.batchInfo || ''); // 上一个页面传递过来的batchInfoo数据 batchInfo.batchType  1 撤销入账  2 入账  3 撤回 4 确认
  let [fileList,setFileList] = useState([]);
  let [pageNum, setPageNum] = useState(1);
  let [pageSize, setPageSize] = useState(10);
  let [operateBillImportInfo, setOperateBillImportInfo] = useState({});
  let [tableInfo, setTableInfo] = useState({});

  let [operatingModal, setOperatingModal] = useState(''); // 弹框数据
  // 弹框回调
  const operatingCallModal = (flag) => {
    setOperatingModal('')
    console.log(flag,'确认入账的flag')
    if(flag) {
      history.goBack()
    }
  }

  /*点击下一页上一页(参数是改变后的页码及每页条数)*/
  let onNextChange = (page, pageSize) => {
    operateBillPageBatchImportOrder('', page, pageSize);
    setPageNum(page);
    setPageSize(pageSize);
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    operateBillPageBatchImportOrder('', page, pageSize);
    setPageNum(page);
    setPageSize(pageSize);
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNum} / ${totalPage}  页`
  }

  let Column = [
    { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo', align: 'center'},
    { title: '匹配结果', dataIndex: 'passFlagName', key: 'passFlagName', align: 'center'},
    { title: '不匹配原因', dataIndex: 'remark', key: 'remark', align: 'center'},
  ]

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
          if(batchInfo.batchType==1 || batchInfo.batchType==2) return operateBillImportOrder(e.file.response.body[0], batchInfo.batchType);
          if(batchInfo.batchType==3) return balanceImportCreditImport(e.file.response.body[0]);
          if(batchInfo.batchType==4) return balanceImportRevokeImport(e.file.response.body[0]);
        }
      } else if (e.file.status === "error"){
        message.destroy()
        message.error(`${e.file.name} 上传失败!`)
      }
    }
  }
  
  // 导入订单进行批量确认、撤回操作
  let operateBillImportOrder = (fileId, operStatus) => {
    dispatch({
      type: 'billSettlementReconciliationModel/operateBillImportOrder',
      payload: {
        method: 'postJSON',
        params: {
          billType: batchInfo.billType==7 ? 2 : 1,
          fileId,
          operStatus
        },
      },
      callback: res => {
        if(res.result.code == 0 ){
          setPageNum(1);
          operateBillPageBatchImportOrder(res.body.batchId, 1);
          setOperateBillImportInfo(res.body);
        }else {
          return message.error(res.result.message)
        }
      }
    });
  }

  // 导入订单进行入账操作
  let balanceImportCreditImport = (fileId) => {
    dispatch({
      type: 'billSettlementReconciliationModel/balanceImportCreditImport',
      payload: {
        method: 'postJSON',
        params: {
          billType: batchInfo.billType==7 ? 2 : 1,
          fileId,
          channelId:JSON.parse(localStorage.getItem('tokenObj')).channelId,
          platformType:2,
        },
      },
      callback: res => {
        if(res.result.code == 0 ){
          setPageNum(1);
          operateBillPageBatchImportOrder(res.body.batchId, 1);
          setOperateBillImportInfo(res.body);
        }else {
          return message.error(res.result.message)
        }
      }
    });
  }

  // 分页查询导入的订单
  let operateBillPageBatchImportOrder = (batchId, page, size) => {
    dispatch({
      type: 'billSettlementReconciliationModel/operateBillPageBatchImportOrder',
      payload: {
        method: 'postJSON',
        params: {
          batchId: batchId || operateBillImportInfo.batchId,
          pageNum: page || pageNum,
          pageSize: size || pageSize
        },
      },
      callback: res => {
        if(res.result.code == 0 ){
          setTableInfo(res.body)
        }else {
          return message.error(res.result.message)
        }
      }
    });
  }
  // 批量确认操作
  let handleBatch = (type) => {
    if(type==1 || type==2) return operateBillConfirmImportOrder(operateBillImportInfo.batchId, type)
    if(type==3) return setShowModal(operateBillImportInfo.batchId)   
    if(type==4) return balanceImportRevokeConfirm(operateBillImportInfo.batchId);
  }
  //生成账单
  let setShowModal = (batchId) =>{
    if(batchId){
      setOperatingModal({ modalName: 'entry', type: batchInfo.billType, batchId: operateBillImportInfo.batchId, channelId: operateBillImportInfo.channelId, modalType: 1 })
    }else{
      message.error("请选择文件")
    }
  }

  // 确认导入-订单进行确认、撤回操作 
  let operateBillConfirmImportOrder = (batchId, operStatus) => {
    if(batchId){
      dispatch({
        type: 'billSettlementReconciliationModel/operateBillConfirmImportOrder',
        payload: {
          method: 'postJSON',
          params: {
            batchId,
            billType: batchInfo.billType ==7 ? 2 : 1,
            operStatus
          },
        },
        callback: res => {
          if(res.result.code == 0 ){
            message.success(`${res.result.message},两秒后返回列表页面`);
            setTimeout(()=> {
              history.goBack()
            }, 1000)
          }else {
            return message.error(res.result.message);
          }
        }
      });
    }else{
      message.error("请选择文件")
    }
    
  }

  // 批量撤销入账导入
  let balanceImportRevokeImport = (fileId) => {
    dispatch({
      type: 'billSettlementReconciliationModel/balanceImportRevokeImport',
      payload: {
        method: 'postJSON',
        params: {
          billType: batchInfo.billType==7 ? 2 : 1,
          fileId,
          channelId:JSON.parse(localStorage.getItem('tokenObj')).channelId,
          platformType:2,
        },
      },
      callback: res => {
        if(res.result.code == 0 ){
          setPageNum(1);
          operateBillPageBatchImportOrder(res.body.batchId, 1);
          setOperateBillImportInfo(res.body);
        }else {
          return message.error(res.result.message)
        }
      }
    });
  }

  // 批量撤销入账确认 
  let balanceImportRevokeConfirm = (batchId) => {
    if(batchId){
      dispatch({
        type: 'billSettlementReconciliationModel/balanceImportRevokeConfirm',
        payload: {
          method: 'postJSON',
          params: {
            batchId,
            billType: batchInfo.billType ==7 ? 2 : 1,
            channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
            platformType: 2
          },
        },
        callback: res => {
          if(res.result.code == 0 ){
            message.success(`${res.result.message},两秒后返回列表页面`);
            setTimeout(()=> {
              history.goBack()
            }, 1000)
          }else {
            return message.error(res.result.message);
          }
        }
      });
    }else{
      message.error("请选择文件")
    }
    
  }
  

  return (
    <div className={style.block__cont}>
      <div className={style.block__header}>
        <div>{ `批量导入${batchInfo.batchName}` }</div>
        <Button className={style.btn_radius} htmlType="button" onClick={() => { history.goBack() }}>返回</Button>
      </div>
      <Row className={style.batch_row}>
        <div className={style.batch_row_div}>
          <Form.Item label="导入文件" name="uploadFile" className={style.form_item}>
            <Upload {...uploadConfig}  fileList={fileList}>
              <Button icon={<UploadOutlined />} className={style.click_blue}>选择文件</Button>
            </Upload>
          </Form.Item>
          {
            batchInfo.batchType==4?
            <a href='https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/file-template/carowner-admin/%E6%B8%A0%E9%81%93%E8%B4%A6%E5%8D%95_%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'  download='批量撤销入账模版.xlsx' >下载模板</a>:
            batchInfo.batchType==3? 
            <a href='https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/file-template/carowner-admin/%E6%B8%A0%E9%81%93%E8%B4%A6%E5%8D%95_%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'  download='批量入账模版.xlsx' >下载模板</a>:
            batchInfo.batchType==2? 
            <a href='https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/file-template/carowner-admin/%E6%B8%A0%E9%81%93%E8%B4%A6%E5%8D%95_%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'  download='批量撤回模版.xlsx' >下载模板</a>:
            batchInfo.batchType==1? 
            <a href='https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/file-template/carowner-admin/%E6%B8%A0%E9%81%93%E8%B4%A6%E5%8D%95_%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'  download='批量确认模版.xlsx' >下载模板</a>:''
          }
        </div>
      </Row>
      {
        batchInfo.batchType==4 ? 
        <Row className={style.entry_row}>
          <ExclamationCircleOutlined className={style.entry_icon} /> <span>从哪个账单撤销入账，由文件中第一个订单号对应的账单决定</span>
        </Row> : ''
      }
      <div className={style.block__header}>
        <div><span className={style.span_title}>{`您已导入${operateBillImportInfo.totalCount || 0 }个订单，已匹配${operateBillImportInfo.successCount || 0}个订单，您可将已匹配的订单批量${batchInfo.batchName}`}</span></div>
        <Button className={style.btn_radius} htmlType="button" type="primary" onClick={()=> {handleBatch(batchInfo.batchType)}}>{`批量${batchInfo.batchName}`}</Button>
      </div>
      <div className={style.batch_table_box}> 
        <Table locale={{emptyText: '暂无数据'}} columns={Column} dataSource={tableInfo.list} pagination={false} />
        <Pagination
          className={style.pagination}
          current={pageNum} //选中第一页
          pageSize={pageSize} //默认每页展示10条数据
          total={tableInfo.total} //总数
          onChange={onNextChange} //切换 页码时触发事件
          pageSizeOptions={['10', '20', '50', '100']}
          onShowSizeChange={onSizeChange}
          showTotal={onPageTotal}
        />
      </div>
      {operatingModal ? <ModalBox operatingModal={operatingModal} operatingToFatherValue={(flag) => operatingCallModal(flag)} /> : ''}
    </div>
  )
}


export default connect(({  }) => ({

}))(BatchOperation)