import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {
  Row,
  Col,
  Space,
  Table,
  Button,
  Select,
  DatePicker,
  message, Tag, Input, Form, Modal,
  Divider,
  Pagination
} from "antd"
import style from "./style.less"
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const { RangePicker } = DatePicker
const { Option, OptGroup } = Select;
const { TextArea } = Input;

//详情
const grantDetail = (props) => {
  let { dispatch } = props;
  let [form] = Form.useForm();
  let thisDetail = JSON.parse(localStorage.getItem('grant_list_item'));
  let [countDetail, setCountDetail] = useState(thisDetail); //基本信息
  console.log(countDetail, 'countDetail')

  // let [payload, setPayload] = useState({
  //   pageNum: 1,
  //   pageSize: 10,
  //   query: {
  //     channelId: countDetail.channelId,//客户名称
  //     billType: countDetail.billType,//业务类型 1：据实服务 2：预采投放 3：数字SaaS 4:增值服务
  //     billId: history.location.query.billId,//账单序号

  //     orderNo: '',//订单编号
  //     serviceTypeId: null,//服务类型
  //     serviceId: null,//服务项目
  //     plateNo: '',//车牌号
  //     orderCreateTimeStart: '',//	订单创建时间起始
  //     orderCreateTimeEnd: '',//订单创建时间终止
  //     orderStatus: null,//服务状态==================(1.据实服务)
  //     cardId: null,//	卡券编号
  //     couponSkuName: '',//卡券标题
  //     discountsType: null,//卡券种类1、优惠券 2、抵用券 3、打折券
  //     couponCategoryType: null,//卡券品类1、洗车券2、送花券 3、停车券 4、保养券、5钣喷券
  //     balanceNode: null,//结算节点:0发放,1领取,2使用
  //     balanceNodeBeginTime: '',//结算开始时间
  //     balanceNodeEndTime: '',//结算结束时间===============（2.预采）

  //     serviceName: '',//服务名称
  //     // uploadImageFlag: 0//是否上传照片:0否1是
  //   }
  // });

  let [payload, setPayload] = useState({
    grantBatchId: countDetail.grantBatchId
  })

  useEffect(() => {
    // detailGrant()
  }, [payload])





  let columns = [
    {
      title: '卡券名称',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: '卡券品类',
      dataIndex: 'serviceTypeName',
      key: 'serviceTypeName',
    },
    {
      title: '面值',
      dataIndex: 'serviceName',
      key: 'serviceName',
    },
    {
      title: '单份数量',
      dataIndex: 'plateNo',
      key: 'plateNo',
    },
    {
      title: '有效期',
      dataIndex: 'orderCreateTime',
      key: 'orderCreateTime',
      // render: (text, all) => orderCreateTime(text, all)
    },
    {
      title: '可否转增',
      dataIndex: 'serviceDistance',
      key: 'serviceDistance',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      render: (text, all) => option(text, all)
    }
  ]
  let option = (text, all) => {
    return <div ><span className={style.click_blue}>样式预览</span></div>
  }







  /*点击下一页上一页(参数是改变后的页码及每页条数)*/
  let onNextChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = page
    this_payload.pageSize = pageSize
    setPayload(this_payload)

  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = page
    this_payload.pageSize = pageSize
    setPayload(this_payload)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / payload.pageSize)
    return `共${total}条记录 第 ${payload.pageNum} / ${totalPage}  页`
  }

  return (
    <>
      <div className={style.block__cont}>
        <div className={style.block__header}>
          投放详情
        </div>
        <div className={style.form__cont}>
          {/* 1 */}
          <h3>基础信息</h3>
          <div className={style.form__cont}>
            <Row justify="space-around" align="center">
              <Col className={style.form__item} span={8}>
                <div>渠道：<span>{countDetail.channelName}</span></div>
              </Col>
              <Col className={style.form__item} span={8}>
                <div>
                  投放名称：
                  <span>{countDetail.grantName}</span>
                </div>
              </Col>
              <Col className={style.form__item} span={8}>
                <div>
                  投放人群：
                  <span>{countDetail.grantGroup}</span>
                </div>
              </Col>
            </Row>
            <Row justify="space-around" align="center">
              <Col className={style.form__item} span={8}>
                <div>
                  投放时间：
                  <span>{countDetail.grantDate}</span>
                </div>
              </Col>
              <Col className={style.form__item} span={8}>

              </Col>
              <Col className={style.form__item} span={8}>
              </Col>
            </Row>
          </div>
        </div>
        {/* 分割线 */}
        <div style={{ width: '96%', textAlign: 'center' }}>
          <Divider style={{ margin: '0 20px' }} />
        </div>
        {/* 2 */}
        <div className={style.form__cont}>
          <h3>投放内容</h3>
          <div style={{ padding: '20px' }}>
            发放方式：<span>全部发放</span>
          </div>
          <Table columns={columns} dataSource={countDetail.grantBatchDetailVOList} pagination={false}></Table>
          <Pagination
            className={style.pagination}
          // current={payload.pageNum} //选中第一页
          // pageSize={payload.pageSize} //默认每页展示10条数据
          // total={total} //总数
          // onChange={onNextChange} //切换 页码时触发事件
          // pageSizeOptions={['10', '20', '30', '60']}
          // onShowSizeChange={onSizeChange}
          // showTotal={onPageTotal}
          />
        </div>
        {/* 3 */}
        <div style={{ width: '96%', textAlign: 'center', marginTop: '30px' }}><Divider style={{ margin: '0 20px' }} /></div>
        <div className={style.form__cont}>
          <h3>投放结果</h3>
          <div className={style.form__cont}>
            <Row justify="space-around" align="center">
              <Col className={style.form__item} span={8}>
                <div>
                  投放人数：
                  <span>7023人</span>
                  <span className={style.click_blue} style={{ marginLeft: '20px' }}>导出名单</span>
                </div>
              </Col>
              <Col className={style.form__item} span={8}>

              </Col>
              <Col className={style.form__item} span={8}>
              </Col>
            </Row>
            <Row justify="space-around" align="center">
              <Col className={style.form__item} span={8}>
                <div>
                  投放成功：
                  <span>7023人</span>
                  <span className={style.click_blue} style={{ marginLeft: '20px' }}>撤回投放</span>
                </div>
              </Col>
              <Col className={style.form__item} span={8}>
                <div>
                  投放失败：
                  <span>454人</span>
                  <span className={style.click_blue} style={{ marginLeft: '20px' }}>重新投放</span>
                </div>
              </Col>
              <Col className={style.form__item} span={8}>
              </Col>
            </Row>
            <Row justify="space-around" align="center">
              <Space size={22}>
                <Button htmlType="button" onClick={() => { history.goBack(); }}>取消</Button>
                <Button htmlType="submit" type="primary">保存</Button>
              </Space>
            </Row>
          </div>
        </div>
      </div>
    </>
  )
};
export default connect(({ cardgrantManageModel }) => ({
  grantDetailList: cardgrantManageModel.grantDetailList,
  // total: cardgrantManageModel.total,
}))(grantDetail)
