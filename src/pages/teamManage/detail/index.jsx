import React,{useEffect, useState} from "react"
import { connect, history } from 'umi'
import {
  Row,
  Col,
  Tag,
  Tabs,
  Form,
  Table,
  Input,
  Space,
  Select,
  Button,
  Tooltip,
  Pagination,
  DatePicker,
  ConfigProvider,
} from "antd"
import {
  QuestionCircleOutlined
} from "@ant-design/icons"
import style from "./style.less"
import moment from 'moment'
import 'moment/locale/zh-cn'
import locale from "antd/lib/date-picker/locale/zh_CN";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {QueryFilter} from "@ant-design/pro-form";
const { TabPane } = Tabs
moment.locale('zh-cn')
let statusArr = [{
  id: 1,
  title: '已激活'
},{
  id: 2,
  title: '未激活'
},{
  id: 3,
  title: '已冻结'
}]
let bindWorkArr = [{
  id: 1,
  title: '是',
}, {
  id: 2,
  title: '否',
}]
const { Option } = Select
const { RangePicker } = DatePicker
const teamManageDetailPage =(props)=>{
  let {dispatch, location, taskDetail, teamDetail, tagCountList, customerList, customerTotal, saleList, saleTotal} = props
  let [form] = Form.useForm()
  let [teamId, setTeamId] = useState(location.state && location.state.teamId || '')
  let [tabKey, setTabKey] = useState( sessionStorage.getItem('team_tab_key') || '1')
  let [customerTagIds, setCustomerTagIds] = useState('')
  let [tagIdStatus, setTagIdStatus] = useState(false)
  let [tagList, setTagList] = useState([])
  let [pageSize, setPageSize] = useState(10)
  let [pageNo, setPage] = useState(1)
  let [payload, setPayload] = useState({
    pageNo,
    pageSize,
  })
  useEffect(() => {
    if(teamId){
      getDetail()
      getTagList()
    }
  },[teamId])
  useEffect(() => {
    setTagList(tagCountList)
  },[tagCountList])
  useEffect(() => {
    if(tagIdStatus){
      onSearch(form.getFieldsValue())
      setTagIdStatus(false)
    }
  },[tagIdStatus])
  /*回调*/
  useEffect(()=>{
    if(teamId){
      if(tabKey === '1'){
        getTeamSaleList()
      }else {
        getCustomerList()
      }
    }
  },[pageNo, pageSize, payload, teamId])
  /*获取详请*/
  let getDetail = () => {
    dispatch({
      type: 'teamManageDetail/getDetail',
      payload: {
        method: 'getUrlParams',
        params: teamId
      },
    })
  }
  /*团员列表*/
  let getTeamSaleList = () => {
    payload.teamId = teamId
    dispatch({
      type: 'teamManageDetail/getTeamSaleList',
      payload: {
        method: 'postJSON',
        params: payload
      },
    })
  }
  /*客户列表*/
  let getCustomerList = () => {
    payload.teamId = teamId
    dispatch({
      type: 'teamManageDetail/getCustomerList',
      payload: {
        method: 'get',
        params: payload
      },
    })
  }
  /*获取标签*/
  let getTagList = () => {
    dispatch({
      type: 'teamManageDetail/getCrmCustomerTagCountList',
      payload: {
        method: 'get',
        params: {}
      }
    })
  }
  /*团员列表*/
  let tempColumns = () => {
    return (
        [{
          title: '销售名称',
          dataIndex: 'userNmae',
          width: 120,
          fixed: 'left',
          render: (userNmae, record) => onSalesDetail(userNmae, record)
        }, {
          title: '销售账号',
          width: 150,
          dataIndex: 'saleUserId',
        }, {
          title: '是否是团队长',
          width: 120,
          dataIndex: 'isLeaders',
          render: (isLeaders) => {
            return <span>{isLeaders === 0 ? '否' : '是'}</span>
          }
        }, {
          title: '是否绑定企微',
          dataIndex: 'isBindWork',
          width: 120,
          render: (isBindWork) =>{
            return <span>{isBindWork === 1 ? '是' : '否'}</span>
          }
        }, {
          title: '更新账号时间',
          width: 170,
          dataIndex: 'saleUpdateTime',
        },  {
          title: '账号状态',
          width: 100,
          dataIndex: 'statusName',
        }, {
          title: '积分余额',
          width: 100,
          dataIndex: 'availablePoints',
        },{
          title: '卡券数量',
          width: 100,
          dataIndex: 'cardCount',
        }, {
          title: '客户数量',
          width: 100,
          dataIndex: 'customers',
        }, {
          title: '活动数量',
          width: 100,
          dataIndex: 'activitiesSize',
        }]
    )
  }
  /*客户列表*/
  let customerColumns = () => {
    return (
        [{
          title: '客户姓名',
          dataIndex: 'customerName',
          width: 150,
          align: 'center',
          fixed: 'left',
          render: (customerName, record) => onCustomerDetail(customerName, record)
        }, {
          title: '客户标签',
          width: 220,
          align: 'center',
          dataIndex: 'tagList',
          render: (tagList) => {
            if(tagList && tagList.length > 0){
              return  <div className={style.list_tag_box}>
                 {
                   tagList.map(item => {
                     let temp = item.tagStyle.split(';')
                     let tempData = {};
                     temp.map(item => {
                       tempData[item.split(':')[0]] = item.split(':')[1]
                     })
                     tempData.marginBottom = '6px'
                     return  <Tag style={tempData}>{item.tagAlias}</Tag>
                   })
                 }
              </div>
            }else {
              return null
            }
          }
        }, {
          title: '联系方式',
          width: 120,
          align: 'center',
          dataIndex: 'customerPhone',
        }, {
          title: '所属销售',
          width: 120,
          align: 'center',
          dataIndex: 'username',
        },  {
          title: '销售账号',
          width: 120,
          align: 'center',
          dataIndex: 'telephone',
        }, {
          title: '联系地址',
          width: 200,
          align: 'center',
          dataIndex: 'address',
        },{
          title: '生日',
          width: 120,
          align: 'center',
          dataIndex: 'birthday',
        }, {
          title: '身份证号',
          width: 170,
          align: 'center',
          dataIndex: 'identityNo',
        }, {
          title: '车牌号',
          width: 170,
          align: 'center',
          dataIndex: 'plateNos',
        }, {
          title: '创建时间',
          width: 170,
          align: 'center',
          dataIndex: 'createTime',
        }, {
          title: '最近一次活跃时间',
          width: 170,
          align: 'center',
          dataIndex: 'behaviorTime',
        }]
    )
  }
  // 销售详情
  let onSalesDetail = (userNmae, record) => {
    let goToDetail = () => {
      sessionStorage.setItem('team_tab_key', '1')
      history.push({
        pathname: '/teamManage/list/salesDetail',
        query: {
          availablePoints: record.availablePoints,
          cardCount: record.cardCount || 0,
          channelId: record.channelId,
          objectId: record.relationUserId,
          pageType: 'team'
        }
      })
    }
    return <span className={style.click_blue} onClick={goToDetail}>{userNmae}</span>
  }
  // 销售详情
  let onCustomerDetail = (customerName, record) => {
    let goToDetail = () => {
      sessionStorage.setItem('team_tab_key', '2')
      history.push({
        pathname: '/teamManage/list/smallDetail',
        query: {
          customerId: record.customerId,
          saleInfo: {},
          isReadOnly: 'readOnly'
        }
      })
    }
    return <span className={style.click_blue} onClick={goToDetail}>{customerName}</span>
  }
  /*tab Change*/
  let onTabChange = (e) => {
    setTabKey(e)
    sessionStorage.removeItem('team_tab_key')
    onReset()
  }
  /*搜索*/
  let onSearch = (e) => {
    //创建时间
    if(e.createTime){
      e.createTimeEnd = moment(e.createTime[1]).endOf('day').format('YYYY-MM-DD')
      e.createTimeStart = moment(e.createTime[0]).endOf('day').format('YYYY-MM-DD')
      delete e.createTime
    }
    let data = {
      ...e,
      teamId,
      pageSize,
      pageNo: 1,
    }
    if(tabKey === '1'){
      data.customerTagIds = customerTagIds
    }else {
      data.tagIds = customerTagIds
    }
    setPage(1)
    setPayload(data)
  }
  /*重置*/
  let onReset = () => {
    form.resetFields()
    let data = {
      teamId,
      pageSize,
      pageNo: 1,
    }
    tagList.map(item => {
      item.status = false
    })
    setPage(1)
    setPayload(data)
    setTagList(tagList)
    setCustomerTagIds('')
  }
  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) =>{
    payload.pageNo = page
    setPayload(payload)
    setPage(page)
    setPageSize(pageSize)
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) =>{
    let totalPage  = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNo} / ${totalPage}  页`
  }
  /*check标签*/
  let onCheckTag = (key) => {
    let temp = JSON.parse(JSON.stringify(tagList))
    if(temp[key].status){
      temp[key].status = false
    }else {
      temp[key].status = true
    }
    let tempId = []
    temp.map(item => {
      if (item.status) {
        tempId.push(item.tagId)
      }
    })
    if(tempId.length > 0){
      setCustomerTagIds(tempId.toString())
    }else {
      setCustomerTagIds('')
    }
    setTagList(temp)
    setTagIdStatus(true)
  }
  /*tab 内容组件*/
  let renderList = () => {
    return <>
      <Form className={style.form__cont} form={form} onFinish={onSearch}>
        {
          tabKey === '1' ? <Row>
            <Col span={8}>
              <Form.Item label="销售姓名" name="username" labelCol={{flex: '0 0 120px'}}>
                <Input placeholder="请输入" allowClear/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="销售账号" name="salePhone" labelCol={{flex: '0 0 120px'}}>
                <Input placeholder="请输入" allowClear/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="更新账号日期" name="createTime" labelCol={{flex: '0 0 120px'}}>
                <RangePicker
                    allowClear
                    locale={locale}
                    style={{width: '100%'}}
                    placeholder={['开始时间', '结束时间']}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="账号状态：" name="saleStatuss" labelCol={{flex: '0 0 120px'}}>
                <Select placeholder="请选择" >
                  {
                    statusArr.map((item, key) => {
                      return <Option key={key} value={item.id}>{item.title}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="是否绑定企微" name="isBindWork" labelCol={{ flex: '0 0 120px' }}>
                <Select placeholder="不限" allowClear>
                  {
                    bindWorkArr.map(item => {
                      return <Option value={item.id} key={item.id}>{item.title}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row> : <Row>
            <Col span={8}>
              <Form.Item label="客户姓名" name="customerName" labelCol={{flex: '0 0 120px'}}>
                <Input placeholder="请输入" allowClear/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="联系方式" name="customerPhone" labelCol={{flex: '0 0 120px'}}>
                <Input placeholder="请输入" allowClear/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="车牌号" name="plateNo" labelCol={{flex: '0 0 120px'}}>
                <Input placeholder="请输入" allowClear/>
              </Form.Item>
            </Col>
          </Row>
        }
        <Row justify="end">
          <Space size={22}>
            <Button htmlType="button" onClick={onReset}>重置</Button>
            <Button htmlType="submit" type="primary">查询</Button>
          </Space>
        </Row>
      </Form>
      <Row className={style.detail_tag_box}>
        <div className={style.detail_tag_line}/>
        <Col span={2} className={style.detail_tag_header}>客户标签：</Col>
        <Col span={22}>
          <div className={style.list_box_flex}>
            {
              tagList.length > 0 ? tagList.map(item => {
                return <div className={`${item.status ? style.tag_box_action : style.tag_box}`} onClick={() => {onCheckTag(item.key)}}>{item.tagAlias}</div>
              }) : '暂无标签'
            }
          </div>
        </Col>
        <div className={style.detail_tag_line}/>
      </Row>
      <div className={style.block__header}>
        {
          tabKey === '1' ? '团员列表' : '客户列表'
        }
      </div>
      <div className={style.form__cont}>
        <Table
            locale={{emptyText: '暂无数据'}}
            columns={tabKey === '1' ? tempColumns() : customerColumns()}
            dataSource={tabKey === '1' ? saleList : customerList}
            pagination={false}
            scroll={{
              x: 800
            }}
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
              current={pageNo}
              defaultPageSize={pageSize}
              total={tabKey === '1' ? saleTotal : customerTotal}
              onChange={onNextChange}
              pageSizeOptions={['10', '20', '30', '60']}
              showTotal={onPageTotal}
          />
        </ConfigProvider>
      </div>
    </>
  }

  return(
    <div>
      <div className={style.block__cont} style={{paddingBottom: '30px'}}>
        <div className={style.block__header}>团队管理</div>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>团队名称：</div>
            <div>{teamDetail.teamName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>团队长名称：</div>
            <div>{teamDetail.userName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>团队长账号：</div>
            <div>{teamDetail.userAccount}</div>
          </Col>
        </Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>所属渠道：</div>
            <div>{teamDetail.channelName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>所属门店：</div>
            <div>{teamDetail.branchName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>创建时间：</div>
            <div>{teamDetail.createTime}</div>
          </Col>
        </Row>
      </div>

      <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
        <Row className={style.block__header}>
          <Col>掌客信息</Col>
          <Col className={style.block__header_text}>
            （团队人数：{teamDetail.teamUsers}人， 客户数量：{teamDetail.teamCustomers}人，等级：LV1）
          </Col>
        </Row>
        <Row>
          <Col span={5} offset={1} className={style.detail_item}>
            <div>
              未激活团员
              <Tooltip title="未激活团员，即从未登录过“掌客通-小程序”的团员">
                <QuestionCircleOutlined className={style.wrap2_ico}/>
              </Tooltip>：
            </div>
            <div>{teamDetail.unActivited} 人</div>
          </Col>
          <Col span={5} offset={1} className={style.detail_item}>
            <div>
              已激活团员
              <Tooltip title="已激活团员，即登录过“掌客通-小程序”的团员">
                <QuestionCircleOutlined className={style.wrap2_ico}/>
              </Tooltip>：
            </div>
            <div>{teamDetail.activited} 人</div>
          </Col>
          <Col span={5} offset={1} className={style.detail_item}>
            <div>
              已冻结团员
              <Tooltip title="已冻结团员，即因为某些原因需冻结团员账号，禁止该团员再次登录“掌客通-小程序”">
                <QuestionCircleOutlined className={style.wrap2_ico}/>
              </Tooltip>：
            </div>
            <div>{teamDetail.freezed} 人</div>
          </Col>
          <Col span={5} offset={1} className={style.detail_item}>
            <div>
              活跃客户
              <Tooltip title="团队活跃客户，即最近一次活跃时间，距离今天不超过三个月的客户">
                <QuestionCircleOutlined className={style.wrap2_ico}/>
              </Tooltip>：
            </div>
            <div>{teamDetail.activityCustomers} 人</div>
          </Col>
          <Col span={5} offset={1} className={style.detail_item}>
            <div>
              流失客户
              <Tooltip title="团队流失客户，即最近一次活跃时间，距离今天已超过三个月的客户">
                <QuestionCircleOutlined className={style.wrap2_ico}/>
              </Tooltip>：
            </div>
            <div>{teamDetail.lossCustomers} 人</div>
          </Col>
          <Col span={5} offset={1} className={style.detail_item}>
            <div>
              享权客户
              <Tooltip title="团队享权客户，即使用过车主服务且服务完成的客户，同一个客户只统计一次">
                <QuestionCircleOutlined className={style.wrap2_ico}/>
              </Tooltip>：
            </div>
            <div>{teamDetail.enjoyCustomers} 人</div>
          </Col>
          {/*<Col span={5} offset={1} className={style.detail_item}>*/}
          {/*  <div>进行中任务数量：</div>*/}
          {/*  <div>0</div>*/}
          {/*</Col>*/}
          {/*<Col span={5} offset={1} className={style.detail_item}>*/}
          {/*  <div>已结束任务数量：</div>*/}
          {/*  <div>0</div>*/}
          {/*</Col>*/}
          {/*<Col span={5} offset={1} className={style.detail_item}>*/}
          {/*  <div>*/}
          {/*    平均任务完成率*/}
          {/*    <Tooltip title="平均任务完成率 = 已结束的任务完成度累计之和 / 已结束的任务数量">*/}
          {/*      <QuestionCircleOutlined className={style.wrap2_ico}/>*/}
          {/*    </Tooltip>：*/}
          {/*  </div>*/}
          {/*  <div>0</div>*/}
          {/*</Col>*/}
        </Row>
        <Row  align="center">
          <Col span={5} offset={1}>
            <div className={style.statistics_box}>
              <div className={style.statistics_title}>扫码跳转</div>
              <div className={style.statistics_number}>{taskDetail.customerSweepCodeTotals || 0}人</div>
            </div>
            <div className={style.statistics_triangle}/>
            <div className={style.statistics_box}>
              <div className={style.statistics_title}>扫码获客</div>
              <div className={style.statistics_number}>{taskDetail.customerBySweepCodeTotals || 0}人</div>
            </div>
            <div className={style.statistics_heading}>转化率：{taskDetail.sweepCodeDegree || 0}%</div>
          </Col>
          <Col span={5} offset={1}>
            <div className={style.statistics_box}>
              <div className={style.statistics_title}>内容转发</div>
              <div className={style.statistics_number}>{taskDetail.newForwords || 0}次</div>
            </div>
            <div className={style.statistics_triangle}/>
            <div className={style.statistics_box}>
              <div className={style.statistics_title}>内容点击</div>
              <div className={style.statistics_number}>{taskDetail.newClicks || 0}次</div>
            </div>
            <div className={style.statistics_heading}>触达率：{taskDetail.newsDegree || 0}%</div>
          </Col>
          <Col span={5} offset={1}>
            <div className={style.statistics_box}>
              <div className={style.statistics_title}>产品转发</div>
              <div className={style.statistics_number}>{taskDetail.productForwords || 0}次</div>
            </div>
            <div className={style.statistics_triangle}/>
            <div className={style.statistics_box}>
              <div className={style.statistics_title}>产品点击</div>
              <div className={style.statistics_number}>{taskDetail.productClicks || 0}次</div>
            </div>
            <div className={style.statistics_heading}>触达率：{taskDetail.productsDegree || 0}%</div>
          </Col>
          <Col span={5} offset={1}>
            <div className={style.statistics_box}>
              <div className={style.statistics_title}>卡券赠送</div>
              <div className={style.statistics_number}>{taskDetail.sendCards || 0}张</div>
            </div>
            <div className={style.statistics_triangle}/>
            <div className={style.statistics_box}>
              <div className={style.statistics_title}>卡券使用</div>
              <div className={style.statistics_number}>{taskDetail.useCards || 0}张</div>
            </div>
            <div className={style.statistics_heading}>促活率：{taskDetail.cardsDegree || 0}%</div>
          </Col>
        </Row>
      </div>

      <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
        <Tabs type="card" size='large' activeKey={tabKey} onChange={onTabChange}>
          <TabPane tab="团员信息" key="1">
            {renderList()}
          </TabPane>
          <TabPane tab="客户信息" key="2">
            {renderList()}
          </TabPane>
        </Tabs>
      </div>

      <div className={style.block__cont} style={{padding: '30px 50px',marginTop: '20px'}}>
        <Row justify="space-around" align="left">
          <Space size={22}>
            <Button htmlType="button" onClick={()=>{history.goBack()}}>返回</Button>
          </Space>
        </Row>
      </div>
    </div>
  )
};
export default connect(({teamManageDetail})=>({
  saleList: teamManageDetail.saleList,
  saleTotal: teamManageDetail.saleTotal,
  taskDetail: teamManageDetail.taskDetail,
  teamDetail: teamManageDetail.teamDetail,
  tagCountList: teamManageDetail.tagCountList,
  customerList: teamManageDetail.customerList,
  customerTotal: teamManageDetail.customerTotal,
}))(teamManageDetailPage)


