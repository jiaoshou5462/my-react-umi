
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import style from './style.less';
import {
  Form, Input, Table, Row, Col, Space, Button, DatePicker, Modal,
  Select, Badge, Tooltip, message, ConfigProvider, Pagination, Image
} from "antd";
import { QuestionCircleOutlined, } from '@ant-design/icons'
import { QueryFilter, ProFormText, ProFormDatePicker, ProFormDateRangePicker, ProFormSelect } from '@ant-design/pro-form';
import {
  ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,
} from "@/components/commonComp/index";
const { Column } = Table;
const { RangePicker } = DatePicker;
import { formatDate, formatTime } from '@/utils/date'
import moment from 'moment'
import 'moment/locale/zh-cn'
import zh_CN from "antd/lib/locale-provider/zh_CN";
const { TextArea } = Input;


const feedbackPage = (props) => {
  const { dispatch, channelList, feedBackList, total, taskType } = props;
  let [form] = Form.useForm();

  let [pageNo, setPage] = useState(1)
  let [pageSize, setPageSize] = useState(10)
  const [filterData, setFilterData] = useState({})
  let [payload, setPayload] = useState({
    pageInfo: {
      pageNo,
      pageSize,
    }
  })
  //回复弹窗
  let [isModalFeed, setIsModalFeed] = useState(false);
  let [feedInfor, setFeedInfor] = useState({});
  let [feedCentent, setFeedCentent] = useState(null);
  let [isSubmitModal, setIsSubmitModal] = useState(false);  //提交弹框
  let [isDetail, setIsDetail] = useState(0);


  useEffect(() => {
    getQueryOpinionFeedBack();
  }, [pageNo, pageSize, payload])

  //表单提交
  const submitData = (val) => {
    setFilterData(JSON.parse(JSON.stringify(val)))
    let data = {
      pageInfo: {
        pageNo: 1,
        pageSize,
      }
    }
    setPage(1)
    setPayload(data)
  }

  //表单重置
  const resetForm = () => {
    form.resetFields();
    setFilterData({})
    let data = {
      pageInfo: {
        pageNo: 1,
        pageSize,
      }
    }
    setPage(1)
    setPayload(data)
  }

  //列表接口
  let getQueryOpinionFeedBack = () => {
    let query = JSON.parse(JSON.stringify(filterData))
    if (query.time) {
      query.startTime = formatDate(query.time[0]);
      query.endTime = formatDate(query.time[1]);
    }
    delete query.time;
    dispatch({
      type: 'customerFeedbackManage/getQueryOpinionFeedBack',
      payload: {
        method: 'postJSON',
        params: {
          pageInfo: payload.pageInfo,
          ...query
        }
      },
    });
  }

  // 点击详情
  let lookDetail = (text, record) => {
    // history.push({
    //   pathname: '/customerManage/feedbackList/detail',
    //   query: {
    //     objectId: record.objectId,
    //     readOnly: true
    //   }
    // })
  }
  // 点击回复
  let handleReply = (text, record) => {
    setFeedCentent(null);
    setFeedInfor({ ...record });
    setIsModalFeed(true);
    // history.push({
    //   pathname: '/customerManage/feedbackList/detail',
    //   query: {
    //     objectId: record.objectId,
    //     readOnly: false
    //   }
    // })
  }

  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) => {
    payload.pageInfo.pageNo = page
    setPayload(payload)
    setPage(page)
    setPageSize(pageSize)
  }

  const pageChange = (page, pageSize) => {
    payload.pageInfo.pageNo = page
    payload.pageInfo.pageSize = pageSize
    setPayload({ ...payload })
    setPage(page)
    setPageSize(pageSize)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    payload.pageInfo.pageNo = page
    payload.pageInfo.pageSize = pageSize
    setPage(page)
    setPageSize(pageSize)
    setPayload(payload)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNo} / ${totalPage}  页`
  };

  // 确认提交
  let summitOk = () => {
    dispatch({
      type: 'customerFeedbackManage/getAddOpinionFeedBackReply',
      payload: {
        method: 'postJSON',
        params: {
          objectId: feedInfor.objectId,
          replyContent: feedCentent
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {
          message.success('提交成功');
          setIsSubmitModal(false);
          setIsModalFeed(false);
          getQueryOpinionFeedBack();
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  // 回复弹窗
  let handleOk = () => {
    if (feedCentent) {
      setIsSubmitModal(true);
    } else {
      message.error("请输入回复内容")
    }
  }

  return (
    <>
      <div className={style.feedbackPage}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={submitData} onReset={resetForm}>
          <ProFormSelect name="status" label="状态：" labelCol={{ flex: '0 0 120px' }}
            options={[
              { value: 1, label: '待处理' },
              { value: 2, label: '已处理' },
            ]}
          />
          <ProFormText name="contatPhone" label="手机号：" labelCol={{ flex: '0 0 120px' }} />
          <ProFormDateRangePicker format="YYYY-MM-DD" name="time" label="创建日期：" labelCol={{ flex: '0 0 120px' }} />
          <ProFormText name="name" label="姓名：" labelCol={{ flex: '0 0 120px' }} />
          <ProFormText name="idNo" label="身份证：" labelCol={{ flex: '0 0 120px' }} />
        </QueryFilter>
      </div>
      <div className={style.feedbackPage}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
            {/* <Button onClick={handleAdd} type="primary">新增</Button> */}
          </Space>
        </ListTitle>
        <div>
          <ListTable showPagination current={pageNo} pageSize={pageSize} total={total}
            onChange={pageChange}
          >
            <Table dataSource={feedBackList} scroll={{ x: 1500 }} pagination={false}>
              <Column title="留言ID" dataIndex="objectId" key="objectId" width="100px"
                render={(text, record) => <a onClick={() => { handleReply(text, record); setIsDetail(1); }}>{text}</a>}
              />
              <Column title="姓名" dataIndex="name" key="name" width="120px" />
              <Column title="身份证" dataIndex="idNo" key="idNo" width="220px" />
              <Column title="留言内容" dataIndex="feedbackContent" key="feedbackContent" width="250px"
                render={(text, record) => {
                  return <Tooltip placement="top" title={text}>
                    <div className={style.feedbackContent}>
                      <TextEllipsis>{text}</TextEllipsis>
                    </div>
                  </Tooltip>
                }}
              />
              <Column title="图片" dataIndex="imageUrl" key="imageUrl" width="120px"
                render={(text, record) => {
                  if (record.imageUrl && record.imageUrl.length > 0) {
                    return <div className={style.wrap_images}><span className={style.bure}>查看图片</span>
                      <div className={style.wrap_images_show}>
                        <Image.PreviewGroup>
                          {
                            record.imageUrl.map((item) => <Image src={item} />)
                          }
                        </Image.PreviewGroup>
                      </div>
                    </div>
                  } else {
                    return <span>-</span>
                  }
                }}
              />
              {/* <Column title="是否需要回电" dataIndex="needCallback" key="needCallback" width="120px"
              render={(text, record) => <span>{record.needCallbackStr}</span>}
            /> */}
              <Column title="回电号码" dataIndex="phone" key="phone" width="180px" render={(text, record) => (
                <span>
                  {record.phone ? record.phone : '-'}
                </span>
              )} />
              <Column title="状态" dataIndex="status" key="status" width="100px"
                render={(text, record) => (
                  <span>
                    {text == 1 ? <StateBadge type="red">{record.statusStr}</StateBadge> : ''}
                    {text == 2 ? <StateBadge status="success">{record.statusStr}</StateBadge> : ''}
                    {text != 1 && text != 2 ? <StateBadge color="#142ff1">{record.statusStr}</StateBadge> : ''}

                  </span>
                )}
              />
              <Column title="创建时间" dataIndex="createTime" key="createTime" width="180px" render={(text, record) => (
                <ListTableTime>{text}</ListTableTime>
              )} />
              <Column title="跟进人" dataIndex="createUser" key="createUser" width="100px" render={(text, record) => (
                <span>
                  {text ? text : '-'}
                </span>
              )} />
              {/* <Column title="跟进时间" dataIndex="followTime" key="followTime" width="120px"
              render={(text, record) => <span>{record.status == 2 ? text : ''}</span>}
            /> */}
              <Column title="回复内容" dataIndex="replyContent" key="replyContent" width="250px"
                render={(text, record) => {
                  return <>{record.status == 1 ? <a onClick={() => { handleReply(text, record); setIsDetail(2); }}>回复</a> :
                    <Tooltip placement="top" title={text}>
                      <div className={style.feedbackContent}>
                        {/* <span>{text?text:'-'}</span> */}
                        <TextEllipsis>{text}</TextEllipsis>
                      </div>
                    </Tooltip>}</>
                }}
              />
            </Table>
          </ListTable>
          {/* <ConfigProvider locale={zh_CN}>
            <Pagination
              className={style.pagination}
              showQuickJumper
              showTitle={false}
              current={pageNo}
              defaultPageSize={pageSize}
              total={total}
              onChange={onNextChange}
              pageSizeOptions={['10', '20', '30', '60']}
              onShowSizeChange={onSizeChange}
              showTotal={onPageTotal}
            />
          </ConfigProvider> */}
        </div>
      </div>
      {/* 回复详情弹窗 */}
      <Modal title="留言详情" visible={isModalFeed} onOk={() => { handleOk(); }} onCancel={() => { setIsModalFeed(false) }} width={1130} footer={feedInfor.status == 1 && isDetail === 2 ? [
        <Button key="back" onClick={() => { setIsModalFeed(false) }}>关闭</Button>,
        <Button key="submit" type="primary" onClick={() => { handleOk(); }}>保存</Button>
      ] : feedInfor.status == 1 && isDetail === 1 ? [
        <Button key="back" onClick={() => { setIsModalFeed(false) }}>关闭</Button>,
        <Button key="submit" type="primary" onClick={() => { setIsDetail(2); }}>回复</Button>
      ] : [
        <Button key="back" onClick={() => { setIsModalFeed(false) }}>关闭</Button>,
      ]}>
        <div className={style.wrap_layer}>
          <div className={style.wrap_layer_box}>
            <div className={style.wrap_layer_box_n}>
              <h3>姓名</h3>
              <p>{feedInfor.name ? feedInfor.name : '-'}</p>
            </div>
            <div className={style.wrap_layer_box_n}>
              <h3>身份证号</h3>
              <p>{feedInfor.idNo ? feedInfor.idNo : '-'}</p>
            </div>
            <div className={style.wrap_layer_box_n}>
              <h3>手机号</h3>
              <p>{feedInfor.mobilePhoneReal ? feedInfor.mobilePhoneReal : '-'}</p>
            </div>
          </div>
          <div className={style.wrap_layer_box}>
            <div className={style.wrap_layer_box_n}>
              <h3>回电手机号</h3>
              <p>{feedInfor.phone ? feedInfor.phone : '-'}</p>
            </div>
            <div className={style.wrap_layer_box_n}>
              <h3>创建时间</h3>
              <p>{feedInfor.createTime ? feedInfor.createTime : '-'}</p>
            </div>
          </div>
          <div className={style.wrap_layer_box}>
            <h3>内容</h3>
            <p>{feedInfor.feedbackContent ? feedInfor.feedbackContent : '-'}</p>
          </div>
          <div className={style.wrap_layer_box}>
            <h3>图片</h3>
            <div className={style.wrap_layer_image}>
              <Image.PreviewGroup>
                {
                  feedInfor.imageUrl && feedInfor.imageUrl.map((item) => <Image src={item} style={{ width: '120px', height: '120px' }} />)
                }
              </Image.PreviewGroup>
            </div>
          </div>
          <div className={style.wrap_layer_pn}>
            <h2>回复内容</h2>
            {
              feedInfor.status == 1 && isDetail === 2 ?
                <TextArea showCount value={feedCentent} maxLength={1000} placeholder="请输入回复内容" onChange={(e) => {
                  setFeedCentent(e.target.value);
                }} />
                : feedInfor.status == 1 && isDetail === 1 ?
                  <div className={style.wrap_layer_pn_box1}>
                    <p>暂未回复</p>
                  </div> :
                  <div className={style.wrap_layer_pn_box}>
                    <p>{feedInfor.replyContent ? feedInfor.replyContent : '-'}</p>
                    <h5>回复时间</h5>
                    <h6>{feedInfor.followTime ? feedInfor.followTime : '-'}</h6>
                  </div>
            }
          </div>
        </div>
      </Modal>

      <Modal title='提交' visible={isSubmitModal} onOk={summitOk} onCancel={() => { setIsSubmitModal(false) }}>
        <div style={{ textAlign: 'center' }}>
          <h3>请确认是否提交？</h3>
          <p>注：提交成功后回复内容将呈现给用户</p>
        </div>
      </Modal>
    </>
  )
}
export default connect(({ customerFeedbackManage }) => ({
  feedBackList: customerFeedbackManage.feedBackList,
  total: customerFeedbackManage.total,
  // channelList: customerFeedbackManage.channelList,
  // taskType: customerFeedbackManage.taskType
}))(feedbackPage);
