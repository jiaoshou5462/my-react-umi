import React, { useState, useEffect } from "react";
import { connect, history } from 'umi'
import {
  Form,
  Input,
  Table,
  Select,
  Upload,
  Tag,
  Row,
  Space,
  Button,
  Radio,
  Divider,
  DatePicker,
  Modal,
  message,
  Pagination
} from "antd";
import style from "./style.less";
import { UploadOutlined } from '@ant-design/icons';
const { Option } = Select;
const { TextArea } = Input;
const { Column, ColumnGroup } = Table;

// 批量撤销入账
let revokeBatch = (props) => {
  let { dispatch, importFileData, importList, total } = props;
  let thisDetail = JSON.parse(localStorage.getItem('finance_list_itemed'));
  // let thatDetail = JSON.parse(localStorage.getItem('finance_unReal_entrySingle'));
  // console.log(thisDetail,'thisDetail')
  let [countDetail, setCountDetail] = useState(thisDetail); //基本信息
  let [form] = Form.useForm();

  let [afreshGetData, setAfreshGetData] = useState(false)//导入列表页码判断

  // let [nowBatchId, setletNowBatchId] = useState('');
  let [pageNum, setPageNum] = useState(1),
    [pageSize, setPageSize] = useState(10),
    [payload, setPayload] = useState({
      pageNum,
      pageSize,
      query: {
        channelId: countDetail.channelId,//客户名称countDetail.channelId
        billType: countDetail.billType, //countDetail.billType业务类型 1：据实服务 2：预采投放 3：数字SaaS 4:增值服务
        nowBatchId: ''
      }
    })

  useEffect(() => {
  }, [])

  let onFinish = () => {

  }


  // 点击确认撤销
  let subBtnEvent = () => {
    // console.log(countDetail.billType, 'countDetail.billType')
    if (!importFileData.totalCount) {
      Modal.warning({
        content: '您未导入文件！',
      });
    } else if (!importFileData.passCount) {
      if (countDetail.billType == 1) {
        Modal.warning({
          content: '您无匹配的订单可以撤销！',
        });
      } else if (countDetail.billType == 2) {
        Modal.warning({
          content: '您无匹配的卡券可以撤销！',
        });
      }
    } else {
      batchRevocation()
    }

  }
  // 确认批量撤销
  let batchRevocation = () => {
    dispatch({
      type: 'financeManageModel/confirmRevoke',
      payload: {
        method: 'postJSON',
        params: {
          billId: history.location.query.billId,//账单ID
          batchId: importFileData.batchId,//导入批次ID
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {//成功
          message.success({
            content: '撤销成功！',
          })
          if (countDetail.billType == 1) {
            history.push({
              pathname: '/financeManage/billList/detailRealed',
              query: {
                billId: history.location.query.billId,
                recordDetail: 'operation'
              }
            })//确认调整后，回到处理账单页
          } else {
            history.push({
              pathname: '/financeManage/billList/detailChargeed',
              query: {
                billId: history.location.query.billId,
                recordDetail: 'operation'
              }
            })//确认调整后，回到处理账单页
          }

        } else {//失败
          message.warning({
            content: res.result.message,
          });
        }
      }
    })
  }

  // 点击上传
  let handleUpload = (files) => {
    let { file } = files;
    // uploadUrl 要上传的action
    let formData = new FormData();
    formData.append('dataFile', file);
    formData.append('billId', history.location.query.billId);
    dispatch({
      type: 'financeManageModel/batchRevokeFile',//上传接口
      payload: {
        method: 'upload',
        params: formData
      },
      callback: (res) => {
        payload.query.nowBatchId = res.body.batchId
        setAfreshGetData(!afreshGetData)
      }
    });
  }

  useEffect(() => {
    dispatch({
      type: 'financeManageModel/importResultList',//下面列表接口
      payload: {
        method: 'postJSON',
        params: {
          pageNum,
          pageSize,
          query: {
            batchId: payload.query.nowBatchId,//,//导入批次号(res.body可能为空)
            billId: history.location.query.billId//账单id
          }
        }
      }
    });
  }, [afreshGetData])

  let isPassFlag = (text) => {
    let passFlagStr = '';
    if (text == 2) {
      passFlagStr = "未匹配";
    } else if (text == 1) {
      passFlagStr = "已匹配";
    }
    return <div>{passFlagStr}</div>
  }


  const columns = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: '匹配结果',
      dataIndex: 'passFlag',
      key: 'passFlag',
      render: (text, all) => isPassFlag(text)
    }
  ];

  /*点击下一页上一页(参数是改变后的页码及每页条数)*/
  let onNextChange = (page, pageSize) => {

    payload.pageNum = page
    setPageNum(page)
    setPageSize(pageSize)
    setPayload(payload)
    setAfreshGetData(!afreshGetData)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    payload.pageNum = page
    payload.pageSize = pageSize
    setPageNum(page)
    setPageSize(pageSize)
    setPayload(payload)
    setAfreshGetData(!afreshGetData)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNum} / ${totalPage}  页`
  }



  return (
    <>
      <div className={style.block__cont}>
        <div className={style.block__header}>
          <div>撤销入账（批量）</div>
          <div>
            <Button className={style.btn_radius} htmlType="button" onClick={() => { history.goBack() }}>返回</Button>
          </div>
        </div>
        <Form className={style.form__cont} form={form} onFinish={onFinish}>
          <Form.Item label="导入文件：" name="contractName" rules={[{ required: true, message: '此项不能为空' }]} className={style.form_item} labelCol={{ span: 8 }}>
            <div style={{ display: 'flex' }}>
              <Upload customRequest={handleUpload} showUploadList={false}>
                <Button icon={<UploadOutlined />}>选择文件</Button>
              </Upload>
              <a
                style={{ lineHeight: '32px', color: '#1890ff', marginLeft: "20px", cursor: "pointer" }}
                href={countDetail.billType == 1 ? `/img/导入撤销订单明细.xlsx` : `/img/导入撤销卡券明细.xlsx`}
                downLoad={countDetail.billType == 1 ? "导入撤销订单明细.xlsx" : "导入撤销卡券明细.xlsx"}
              >下载模板</a>

            </div>
          </Form.Item>


          <div>
            <Divider />
            <div style={{ display: 'flex', justifyContent: "space-between", padding: '30px' }}>
              <span>您已导入{importFileData.totalCount} 个订单，已匹配 {importFileData.passCount} 个订单，您可将已匹配的订单批量确认撤销</span>
              <Button type="primary" onClick={subBtnEvent}>确认撤销</Button>
            </div>
            {/*  rowSelection={{...rowSelection}} rowKey={'orderNo'}importList*/}
            <Table columns={columns} dataSource={importList} pagination={false}></Table>
            <Pagination style={{ padding: '0 20px 20px' }}
              className={style.pagination}
              current={pageNum} //选中第一页
              pageSize={pageSize} //默认每页展示10条数据
              // total={importFileData.totalCount} //总数
              total={total} //总数
              onChange={onNextChange} //切换 页码时触发事件
              pageSizeOptions={['10', '20', '30', '60']}
              onShowSizeChange={onSizeChange}
              showTotal={onPageTotal} />
          </div>

        </Form>

      </div>
    </>
  )
};
export default connect(({ financeManageModel }) => ({
  importList: financeManageModel.importList,
  importFileData: financeManageModel.importFileData,
  total: financeManageModel.total
}))(revokeBatch)
