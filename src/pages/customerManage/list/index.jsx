import React, { useEffect, useState } from "react"
import { Link, connect, history } from 'umi'

import { Tooltip, Tag, Form, Space, Input, Modal, Table, Select, Button, message, DatePicker } from "antd"
import style from "./styles.less"
const { Option } = Select
const { RangePicker } = DatePicker
import moment from 'moment'  // 日期处理
import { QueryFilter } from '@ant-design/pro-form';
import {
  ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,
} from "@/components/commonComp/index";

import ListEditModel from '../components/listEditModel'  //投放

const customerListPage = (props) => {
  let { dispatch, channelList, branchInfoList, teamInfoList } = props,
    [form] = Form.useForm(),
    [list, setList] = useState([]), // 列表
    [pageTotal, setPageTotal] = useState(0), // 列表
    [listEditVisble, setListEditVisble] = useState(false), //投放弹窗状态
    [payload, setPayload] = useState({
      channelId: "",  // 所属客户
      branchId: null,  // 所属机构
      teamId: null,    // 所属团队
      customerName: "",  // 用户姓名
      customerPhone: "", // 手机号
      identityNo: "",  // 身份证
      plateNo: "",   // 车牌
      userName: "",  // 所属销售
      userPhone: "", // 销售账号
      relationTime: [],
      resgisterTime: [],
      relationStartTime: "", // 注册开始时间
      relationEndTime: "", // 注册结束时间
      page: {
        pageNo: 1,
        pageSize: 10
      },
    })
  /*回调*/
  useEffect(() => {
    let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));
    getChannel(tokenObj.channelId);
    getBranchInfo(tokenObj.channelId)
    payload.channelId = tokenObj.channelId
  }, [])
  useEffect(() => {
    getList()
  }, [payload])


  /*获取列表*/
  let getList = () => {
    dispatch({
      type: 'customerList/getList',
      payload: {
        method: 'postJSON',
        params: payload
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let temp = res.body || {}
          temp.list.forEach(listItem => {
            if (listItem.tags) {
              listItem.tags.forEach(item => {
                item.tagListChange = {}
                let styleData = item.tagStyle.split(';');
                styleData.forEach((element, index) => {
                  if (index != styleData.length - 1) {
                    item.tagListChange[element.split(':')[0]] = element.split(':')[1]
                    item.tagListChange['margin-bottom'] = '10px'
                  }
                })
              })
            }
          })
          setList(temp.list || [])
          setPageTotal(temp.totalCount || 1)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  /* 导出列表 */
  let exportCrmCustomer = (record) => {
    let param = form.getFieldsValue()
    let relationTimeFlag = false;
    let resgiterTimeFlag = false;
    if (param.relationTime != undefined && param.relationTime.length > 0) {
      let days = moment(param.relationTime[1]).diff(moment(param.relationTime[0]), 'days')
      if (days < 31) {
        param.relationStartTime = moment(param.relationTime[0]).format('YYYY-MM-DD');
        param.relationEndTime = moment(param.relationTime[1]).format('YYYY-MM-DD');
        relationTimeFlag = true;
      }
    }
    if (param.resgisterTime != undefined && param.resgisterTime.length > 0) {
      let resgisterTimeDays = moment(param.resgisterTime[1]).diff(moment(param.resgisterTime[0]), 'days')
      if (resgisterTimeDays < 31) {
        param.registerStartTime = moment(param.resgisterTime[0]).format('YYYY-MM-DD');
        param.registerEndTime = moment(param.resgisterTime[1]).format('YYYY-MM-DD');
        resgiterTimeFlag = true;
      }
    }
    if (relationTimeFlag || resgiterTimeFlag) {
      dispatch({
        type: 'customerList/exportCrmCustomer',
        payload: {
          method: 'postJsonExcel',
          params: param,
        },
        callback: (res) => {
          const url = window.URL.createObjectURL(new Blob([res], { type: "application/vnd.ms-excel" }))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '客户列表.xlsx')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      })
    } else {
      return message.error('创建时间或注册时间至少一个不能为空且不能超过1个月')
    }
  }
  /* 跳转到详情页面 */
  let toListDetail = (record) => {
    history.push({
      pathname: '/customerManage/list/listDetail',
      query: {
        customerId: record.customerId, //2350715
        userName: record.userName,
        userPhone: record.userPhone,
        branchName: record.branchName,
      }
    })
  }
  /*列表表头数据*/
  let renderColumns = () => {
    return (
      [{
        title: '用户姓名',
        dataIndex: 'customerName',
        width: '100px',
        fixed: 'left',
        render: (text, record) => {
          return <text className={style.click_blue} onClick={() => { toListDetail(record) }}>{text ? text : record.nickName}</text>
        }
      }, {
        title: '用户标签',
        dataIndex: 'tags',
        width: '240px',
        render: tags => (
          <>
            <Tooltip placement="top" title={
              tags ? tags.map((tag, index) => {
                return (
                  <Tag className={style.tag} key={tag} style={tag.tagListChange}>
                    {tag.tagName}
                  </Tag>
                );
              }) : null
            }>
              {tags ? tags.map((tag, index) => {
                return (
                  index < 3 ?
                    <Tag className={style.tag} key={tag} style={tag.tagListChange}>
                      {tag.tagName}
                    </Tag>
                    : null
                );
              }) : null}
            </Tooltip>
          </>
        ),
      }, {
        title: '手机号',
        dataIndex: 'customerPhone',
        width: '120px',
      }, {
        title: '身份证号',
        dataIndex: 'identityNo',
        width: '180px',
        render: (text, record) => {
          return <>{text || '-'}</>
        }
      },
      {
        title: '微信昵称',
        dataIndex: 'nickName',
        width: '100px',
        render: (text, record) => {
          return <>{text || '-'}</>
        }
      }, {
        title: '所属机构',
        dataIndex: 'branchName',
        width: '180px',
        render: (text, record) => {
          return <>{text || '-'}</>
        }
      }, {
        title: '所属团队',
        dataIndex: 'teamName',
        width: '120px',
        render: (text, record) => {
          return <>{text || '-'}</>
        }
      }, {
        title: '所属销售',
        dataIndex: 'userName',
        width: '120px',
        render: (text, record) => {
          return <>{text || '-'}</>
        }
      }, {
        title: '注册时间',
        dataIndex: 'registerTime',
        width: '140px',
        render: (text, record) => {
          return <ListTableTime>{text}</ListTableTime>
        }
      }, {
        title: '创建时间',
        width: '140px',
        dataIndex: 'createTime',
        render: (text, record) => {
          return <ListTableTime>{text}</ListTableTime>
        }
      }]
    )
  }
  /*状态tag标签*/
  let renderStatus = (statusStr, record) => {
    let status = record.status
    let statusCor = ''
    if (status === 1) {
      statusCor = 'red'
    }
    if (status === 2) {
      statusCor = 'blue'
    }
    if (status === 3) {
      statusCor = 'orange'
    }
    if (status === 4) {
      statusCor = 'green'
    }
    if (status === 5) {
      statusCor = 'default'
    }
    return <Tag color={statusCor}>{statusStr}</Tag>
  }

  /*清空内容*/
  let resetBtnEvent = () => {
    let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));
    let _payload = JSON.parse(JSON.stringify(payload));
    let data = {
      ..._payload,
      channelId: tokenObj.channelId,  // 所属客户
      branchId: "",  // 所属机构
      teamId: "",    // 所属团队
      customerName: "",  // 用户姓名
      customerPhone: "", // 手机号
      identityNo: "",  // 身份证
      plateNo: "",   // 车牌
      userName: "",  // 所属销售
      userPhone: "", // 销售账号
      relationTime: [],
      resgisterTime: [],
      relationStartTime: "", // 注册开始时间
      relationEndTime: "", // 注册结束时间
    }
    data.page.pageNo = 1;
    dispatch({
      type: 'customerList/resetTeamInfoList',
      payload: []
    })
    form.resetFields()
    setPayload(data)
  }
  /*判断关注和注册状态参数*/
  let fixCustomerStatus = (e) => {
    let result = ""
    if (e.followStatus != null) {
      if (e.followStatus == 1) {
        result = "0,3"
        if (e.registerStatus == 3) {
          //未关注未注册
          result = "0"
        } else if (e.registerStatus == 4) {
          //未关注已注册
          result = "3"
        }
      } else {
        result = "1,2"
        if (e.registerStatus == 3) {
          //已关注未注册
          result = "1"
        } else if (e.registerStatus == 4) {
          //已关注已注册
          result = "2"
        }
      }
    } else {
      if (e.registerStatus != null) {
        if (e.registerStatus == 3) {
          result = "0,1"
        } else {
          result = "2,3"
        }
      }

    }
    return result;
  }
  /*搜索按钮*/
  let searchBtnEvent = (e) => {
    console.log(e);
    if (e.followStatus != null || e.registerStatus != null) {
      e.customerStatus = fixCustomerStatus(e)
    } else {
      e.customerStatus = null
    }
    if (e.relationTime && e.relationTime.length === 2) {
      e.relationStartTime = moment(e.relationTime[0]).format('YYYY-MM-DD');
      e.relationEndTime = moment(e.relationTime[1]).format('YYYY-MM-DD');
    } else {
      e.relationStartTime = "";
      e.relationEndTime = "";
    }
    if (e.resgisterTime && e.resgisterTime.length === 2) {
      e.registerStartTime = moment(e.resgisterTime[0]).format('YYYY-MM-DD');
      e.registerEndTime = moment(e.resgisterTime[1]).format('YYYY-MM-DD');
    } else {
      e.registerStartTime = "";
      e.registerEndTime = "";
    }
    let _payload = JSON.parse(JSON.stringify(payload));
    let obj = {
      ..._payload,
      ...e,
    }
    obj.page.pageNo = 1;
    setPayload(obj)
  }
  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) => {
    // 使用当前页数和目标页数的绝对值乘以每页数 小于等于10000
    if (page * pageSize <= 10000) {
      setPayload({
        ...payload, page: {
          pageNo: page,
          pageSize: pageSize,
        }
      })
    } else {
      return message.error('不支持深度翻页，请通过条件搜索')
    }
  }

  /* 获取所属客户*/
  let getChannel = (channelId) => {
    dispatch({
      type: 'customerList/getActivityChannelList',
      payload: {
        method: 'post',
        params: {
          channelId: channelId,
        }
      }
    })
  }
  /* 获取所属机构列表 */
  let getBranchInfo = (channelId) => {
    dispatch({
      type: 'customerList/getBranchInfo',
      payload: {
        method: 'get',
        params: {
          channelId: channelId
        }
      }
    })
  }
  /* 获取所属团队 */
  let getTeamInfo = (branchId) => {
    dispatch({
      type: 'customerList/getTeamInfo',
      payload: {
        method: 'get',
        params: {
          branchId: branchId
        }
      }
    })
  }
  /* 选择所属客户 */
  let onChannelId = (e) => {
    console.log(e)

  }
  /* 切换所属机构 */
  let onBranchId = (e) => {
    let formData = form.getFieldsValue()
    formData.teamId = ''
    form.setFieldsValue(formData)
    getTeamInfo(e)

  }
  let onTeamId = () => {

  }
  return (
    <div>
      <div className={style.filter_box}>
        {/* 为了方便迁移，这里可以直接使用Form.Item内嵌的方式 */}
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtnEvent} onReset={resetBtnEvent}>
          <Form.Item label="手机号：" name="customerPhone" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="用户姓名：" name="customerName" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="身份证号" name="identityNo" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="所属机构：" name="branchId" labelCol={{ flex: '0 0 120px' }}>
            <Select showSearch onChange={onBranchId} notFoundContent='暂无数据' placeholder="请选择"
              optionFilterProp="children"
            >
              {
                branchInfoList && branchInfoList ?
                  branchInfoList.map((item, key) => {
                    return <Option key={key} value={item.branchid}>{item.depname}</Option>
                  })
                  : ''
              }
            </Select>
          </Form.Item>
          <Form.Item label="所属团队：" name="teamId" labelCol={{ flex: '0 0 120px' }}>
            <Select showSearch onChange={onTeamId} notFoundContent='暂无数据' placeholder="请选择"
              optionFilterProp="children"
            >
              {
                teamInfoList && teamInfoList ?
                  teamInfoList.map((item, key) => {
                    return <Option key={key} value={item.objectId}>{item.teamName}</Option>
                  })
                  : ''
              }
            </Select>
          </Form.Item>
          <Form.Item label="所属销售" name="userName" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="车牌号" name="plateNo" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="注册时间" name="resgisterTime" labelCol={{ flex: '0 0 120px' }}>
            <RangePicker placeholder={['开始时间', '结束时间']} format="YYYY-MM-DD" className={style.rangePicker} />
          </Form.Item>
          <Form.Item label="创建时间" name="relationTime" labelCol={{ flex: '0 0 120px' }}>
            <RangePicker placeholder={['开始时间', '结束时间']} format="YYYY-MM-DD" className={style.rangePicker} />
          </Form.Item>

          <Form.Item label="关注状态" name="followStatus" labelCol={{ flex: '0 0 120px' }}>
            <Select showSearch notFoundContent='暂无数据' placeholder="请选择"
              optionFilterProp="children"
            >
              <Option value={null}>全部</Option>
              <Option value={1}>未关注</Option>
              <Option value={2}>已关注</Option>
            </Select>
          </Form.Item>

          <Form.Item label="注册状态" name="registerStatus" labelCol={{ flex: '0 0 120px' }}>
            <Select showSearch notFoundContent='暂无数据' placeholder="请选择"
              optionFilterProp="children"
            >
              <Option value={null}>全部</Option>
              <Option value={3}>未注册</Option>
              <Option value={4}>已注册</Option>
            </Select>
          </Form.Item>
        </QueryFilter>
      </div>
      <div className={style.list_box}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
            <Button htmlType="button" type="primary" onClick={() => { exportCrmCustomer() }}>导出</Button>
          </Space>
        </ListTitle>
        <ListTable showPagination current={payload.page.pageNo} pageSize={payload.page.pageSize} total={pageTotal}
          onChange={onNextChange}
        >
          <Table
            locale={{ emptyText: '暂无数据' }}
            columns={renderColumns()}
            dataSource={list}
            pagination={false}
            scroll={{ x: 1950 }}
            loading={{
              spinning: false,
              delay: 500
            }}
          />
        </ListTable>
      </div>
      {/*投放弹窗组件*/}
      {listEditVisble ? <ListEditModel
        putData={putData}
        listEditVisble={listEditVisble}
        onHidePutModal={onHidePutModal}
      /> : null}
    </div>
  )
};
export default connect(({ customerList }) => ({
  channelList: customerList.channelList,
  branchInfoList: customerList.branchInfoList,
  teamInfoList: customerList.teamInfoList
}))(customerListPage)
