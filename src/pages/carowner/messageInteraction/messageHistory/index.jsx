import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Table, Select, Row, Col, Space, Button, DatePicker, Switch, Modal, message, ConfigProvider, Pagination } from "antd";
const { RangePicker } = DatePicker
import style from "./style.less";
import moment from 'moment';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import DetailsModal from './detail';
import { QueryFilter } from '@ant-design/pro-form';

import {
  ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,
} from "@/components/commonComp/index";
import { set } from 'lodash';
const { Column } = Table;
let triggerType = [{
  id: 1,
  title: "场景推送"
}, {
  id: 2,
  title: "人工推送"
}] 

// 消息列表
const messageHistory = (props) => {
  let { dispatch, location } = props,
    [form] = Form.useForm(),
    [pageSize, setPageSize] = useState(10),
    [pageNum, setPageNum] = useState(1),
    [templateNoJump, setTemplateNoJump] = useState(''),
    [statusParam, setStatusParam] = useState(location.state && location.state.templateId ? location.state.templateId : ''),
    [detailsVisible, setDetailsVisible] = useState(false), //模板详情弹窗
    [flag, setFlag] = useState(false), //判断是否执行方法
    [list, setList] = useState([]), //列表数据
    [pageTotal, setPageTotal] = useState(0), //总条数
    [payload, setPayload] = useState({
      pageNum,
      pageSize,
      taskId: statusParam.objectId != null ? statusParam.objectId : ''
    })


  /*回调*/
  useEffect(() => {
    getList()
  }, [pageNum, pageSize, payload])


  /*获取列表*/
  let getList = () => {
    dispatch({
      type: 'messageHistory/getList',
      payload: {
        method: 'postJSON',
        params: payload
      },
      callback: res => {
        if (res.result.code == '0') {
          setList(res.body.list)
          setPageTotal(res.body.total)

        } else {
          message.error(res.result.message)
        }
      }
    })
  }


  let renderColumns = () => {
    return (
      [{
        title: '消息ID',
        dataIndex: 'messageId',
        align: 'left',
        fixed: 'left',
        width: 120,
        render: (messageId) => {
          return <span className={style.click_blue} onClick={() => { goToDetail(messageId) }}>
            {messageId}
          </span>
        }
      }, {
        title: '公众号',
        align: 'left',
        dataIndex: 'wechatAppName',
        width: 120,
        render: (name) => {
          return <span>{name ? name : '-'}</span>
        },
      }, {
        title: '消息模板',
        align: 'left',
        dataIndex: 'sceneTemplateName',
        width: 120,
        render: (name) => {
          return <span>{name ? name : '-'}</span>
        },
      }, {
        title: '触发类型',
        align: 'left',
        dataIndex: 'triggerTypeStr',
        width: 120,
        render: (text,renders) => {
          let toName=renders.triggerType===1?<TypeTags>{text}</TypeTags>:<TypeTags type="green">{text}</TypeTags>
          return  toName;
        }
      }, {
        title: '姓名',
        align: 'left',
        dataIndex: 'customerName',
        width: 120,
        render: (name) => {
          return <span>{name ? name : '-'}</span>
        },
       
      }, {
        title: 'openid',
        align: 'left',
        dataIndex: 'openId',
        width: 200,
        render: (name) => {
          return <span>{name ? name : '-'}</span>
        },
      }, {
        title: '手机号',
        align: 'left',
        dataIndex: 'customerPhone',
        width: 120,
        render: (name) => {
          return <span>{name&&name!='--' ? name : '-'}</span>
        },
      }, {
        title: '身份证',
        align: 'left',
        dataIndex: 'identityNo',
        width: 120,
        render: (name) => {
          return <span>{name ? name : '-'}</span>
        },
      }, {
        title: '发送时间',
        align: 'left',
        dataIndex: 'sendTime',
        width: 120,
        render: (text) => {
          return  <ListTableTime>{text}</ListTableTime> 
        }
      }, {
        title: '送达结果',
        align: 'left',
        fixed: 'right',
        dataIndex: 'messageStatusStr',
        width: 100,
        render: (name) => {
          return <span>{name&&name!='--' ? name : '-'}</span>
        },
      }]
    )
  }

  /*跳转详情*/
  let goToDetail = (sceneTemplateId) => {
    setTemplateNoJump(sceneTemplateId)
  }
  //详情弹窗回调
  useEffect(() => {
    if (templateNoJump) {
      setDetailsVisible(true)
    } else {
      setDetailsVisible(false)
    }
  }, [templateNoJump])
  /*清空内容*/
  let resetBtnEvent = () => {
    form.resetFields()
    setFlag(false)
    setList([])
    setPageNum(1)
    setStatusParam({})
    setPayload({...{
      pageNum,
      pageSize,
      taskId: statusParam.objectId != null ? statusParam.objectId : ''
    }})
  }
  /*校验日期 */
  let sendingTimeOnChange = (e) => {
    if (e != null) {
      if (!(Math.abs(moment(e[0]).diff(moment(e[1]), 'day')) < 31)) {
        form.setFieldsValue({
          sendingTime: []
        })
        return message.warn("日期请选择31天之内！")
      }
    }
  }
  /*搜索按钮*/
  let searchBtnEvent = (e) => {
    setFlag(true)
    if (e.sendingTime || e.customerIdentity) {
      let sendingEndTime = e.sendingTime ? moment(e.sendingTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : null
      let sendingStartTime = e.sendingTime ? moment(e.sendingTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : null
      let data = {
        ...e,
        sendingEndTime,
        sendingStartTime,
        pageSize,
        pageNum: 1,
        taskId: statusParam.objectId != null ? statusParam.objectId : ''
      }
      setPageNum(1)
      setPayload(data)
    } else {
      return message.warn('"手机号/身份证"和"发送时间"至少选择一个且时间不能超过31天！')
    }

  }
  const pageChange=(page,pageSize)=>{
    setPageNum(page)
    setPageSize(pageSize);
    payload.pageNum = page;
    payload.pageSize = pageSize;
    setPayload(payload)
  }

  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) => {
    payload.pageNum = page
    setPayload(payload)
    setPageNum(page)
    setPageSize(pageSize)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    payload.pageNum = page
    payload.pageSize = pageSize
    setPageNum(page)
    setPageSize(pageSize)
    setPayload(payload)
  }

  /*设置弹窗回调*/
  let onCallbackSetSales = (e) => {
    setTemplateNoJump('')
    if (e) {
      getList()
    }
  }
  return (
    <div>
      <div className={style.block__cont}>
        <QueryFilter className={style.form__cont} form={form} defaultCollapsed onFinish={searchBtnEvent} onReset={resetBtnEvent}>
          {/* <Form.Item label='公众号:' name="wechatAppSettingId" labelCol={{ flex: '0 0 120px' }}>
                <Select placeholder="不限" allowClear>
                  {
                    statusArr.map((item, key) => {
                      return <Option key={key} value={item.id}>{item.title}</Option>
                    })
                  }
                </Select>
              </Form.Item> */}
          <Form.Item label='消息模板' name="sceneTemplateName" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="发送时间:" name="sendingTime" labelCol={{ flex: '0 0 120px' }}>
            <RangePicker
              allowClear
              onChange={sendingTimeOnChange}
              locale={locale}
              style={{ width: '100%' }}
              placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>
          <Form.Item label='推送机制:' name="triggerType" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限" allowClear>
              {
                triggerType.map((item, key) => {
                  return <Option key={key} value={item.id}>{item.title}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label='手机号/身份证:' name="customerIdentity" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" allowClear />
          </Form.Item>

        </QueryFilter>

      </div>
      <div className={style.block__cont__t}>
        <ListTitle titleName="消息列表">
          <Space size={8}>

          </Space>
        </ListTitle>

        <div>
          <ListTable showPagination current={pageNum} pageSize={pageSize} total={pageTotal}
            onChange={pageChange}
          >
            <Table dataSource={list} columns={renderColumns()} scroll={{ x: 1000 }} pagination={false}>
            </Table>
          </ListTable>
          {/* <ConfigProvider locale={zh_CN}>
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
            />
          </ConfigProvider> */}
        </div>
      </div>
      <DetailsModal //详情弹窗
        templateNo={templateNoJump}
        detailsVisible={detailsVisible}
        onCallbackSetSales={(flag) => onCallbackSetSales(flag)}
      />
    </div>
  )
};

export default connect(({ messageHistory }) => ({
}))(messageHistory)