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

// 批量调整金额
let adjustmentBatch = (props) => {
  let { dispatch, importFileData, importList } = props;
  let thisDetail = JSON.parse(localStorage.getItem('finance_list_itemed'));
  // let thatDetail = JSON.parse(localStorage.getItem('finance_unReal_entrySingle'));
  // console.log(thisDetail,'thisDetail')
  let [countDetail, setCountDetail] = useState(thisDetail); //基本信息
  let [afreshGetData, setAfreshGetData] = useState(false)//导入列表页码判断

  let [form] = Form.useForm();
  let [value, setValue] = useState(1);
  let [confirmList, setConfirmList] = useState([]);


  let [pageNum, setPageNum] = useState(1),
    [pageSize, setPageSize] = useState(10),
    [payload, setPayload] = useState({
      pageNum,
      pageSize,
      query: {
        channelId: countDetail.channelId,//客户名称countDetail.channelId
        billType: countDetail.billType, //countDetail.billType业务类型 1：据实服务 2：预采投放 3：数字SaaS 4:增值服务   
        // batchId: "",
        // billId:null
        nowBatchId: ''
      }
    })

  let onFinish = () => {

  }

  // 点击确认调整
  let subBtnEvent = () => {
    if (!importFileData.totalCount) {//总数
      Modal.warning({
        content: '您未导入文件！',
      });
    } else if (importFileData.passCount == 0) {//已匹配数量
      Modal.warning({
        content: '您无匹配的订单可以调整！',
      });
    } else {
      // 确认批量调整金额
      dispatch({
        type: 'financeManageModel/confirmAdjustAmount',
        payload: {
          method: 'postJSON',
          params: {
            billId: history.location.query.billId,//	账单ID
            batchId: importFileData.batchId,//导入批次ID
          }
        },
        callback: (res) => {
          if (res.result.code == '0') {//成功
            message.success({
              content: '调整成功！',
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
  }
  // 点击上传
  let handleUpload = (files) => {
    let { file } = files;
    // uploadUrl 要上传的action
    let formData = new FormData();
    formData.append('dataFile', file);
    formData.append('billId', history.location.query.billId);
    dispatch({
      type: 'financeManageModel/batchAdjust',//上传接口
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
            batchId: payload.query.nowBatchId,//导入批次号(res.body可能为空)
            billId: history.location.query.billId//账单id
          }
        }
      }
    });
  }, [afreshGetData])


  // 匹配结果：1已匹配2未匹配
  let isPassFlag = (text) => {
    let passFlagStr = '';
    if (text == 1) {
      passFlagStr = "已匹配";
    } else if (text == 2) {
      passFlagStr = "未匹配";
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
    },
    {
      title: '调整金额',
      dataIndex: 'adjustAmount',
      key: 'adjustAmount'
    },
    {
      title: '调整原因',
      dataIndex: 'adjustReason',
      key: 'adjustReason'
    },
    {
      title: '不匹配原因',
      dataIndex: 'remark',
      key: 'remark'
    }
  ];

  /*点击下一页上一页(参数是改变后的页码及每页条数)*/
  let onNextChange = (page, pageSize) => {
    payload.pageNum = page
    setPayload(payload)
    setPageNum(page)
    setPageSize(pageSize)
    setAfreshGetData(!afreshGetData)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    payload.pageNum = page
    payload.pageSize = pageSize
    setPageNum(page)
    setPageSize(pageSize)
    setPayload(payload)
    onPageTotal()
    setAfreshGetData(!afreshGetData)
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
          <div>导入调整金额</div>
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
              <a style={{ lineHeight: '32px', color: '#1890ff', marginLeft: "20px", cursor: "pointer" }}
                href={`/img/导入调整金额.xlsx`}
                downLoad={"导入调整金额.xlsx"}
              >
                下载模板
              </a>
            </div>
          </Form.Item>
          <div>
            <Divider />
            <div style={{ display: 'flex', justifyContent: "space-between", padding: '30px' }}>
              <span>您已导入 {importFileData.totalCount} 个订单，已匹配 {importFileData.passCount} 个订单，您可将已匹配的订单批量确认入账</span>
              <Button type="primary" onClick={subBtnEvent}>确认调整</Button>
            </div>
            <Table columns={columns} dataSource={importList} pagination={false}></Table>
            <Pagination style={{ padding: '0 20px 20px' }}
              className={style.pagination}
              current={pageNum} //选中第一页
              pageSize={pageSize} //默认每页展示10条数据
              total={importFileData.totalCount} //总数
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
  importFileData: financeManageModel.importFileData,
  importList: financeManageModel.importList,

}))(adjustmentBatch)
