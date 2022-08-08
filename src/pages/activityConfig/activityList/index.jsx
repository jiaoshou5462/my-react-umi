import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {
  Row,
  Col,
  Tag,
  Form,
  Space,
  Input,
  Modal,
  Table,
  Select,
  Button,
  message,
  Pagination,
  ConfigProvider,
  DatePicker
} from "antd"
import { QueryFilter } from '@ant-design/pro-form';
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";
import style from "./style.less"
const { Column } = Table;
const { Option } = Select
const { RangePicker } = DatePicker
import CompAuthControl from '@/components/Authorized/CompAuthControl'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { ContactsOutlined, InfoCircleTwoTone } from '@ant-design/icons'
import PutModal from '../putModal'  //投放
import CopyModal from '../copyModal' //复制
moment.locale('zh-cn')
/*活动状态*/
let activityStatus = [{
  title: '全部',
  id: ''
},
// {
//   title: '待编辑',
//   id: 1
// },
{
  title: '待发布',
  id: 2
}, {
  title: '未开始',
  id: 3
}, {
  title: '进行中',
  id: 4
}, {
  title: '已结束',
  id: 5
},]
const { confirm } = Modal
const activityListPage = (props) => {
  let { dispatch, channelList } = props,
    [form] = Form.useForm(),
    [list, setList] = useState([]), // 列表
    [pageTotal, setPageTotal] = useState(1), // 列表
    [internal, setInternal] = useState(''), //复制 - 内部名称
    [external, setExternal] = useState(''), //复制 - 外部名称
    [copyTime, setCopyTime] = useState([]), //复制 - 活动时间
    [copyVisible, setCopyVisible] = useState(false), //复制弹窗状态
    [putVisible, setPutVisible] = useState(false), //投放弹窗状态
    [putData, setPutData] = useState({}), //当前投放活动信息
    [copyData, setCopyData] = useState({}), //当前投放活动信息
    [copySearch, setCopySearch] = useState({}), //当前投搜索信息
    [pageSize, setPageSize] = useState(10),
    [channelId, setChannelId] = useState(''),
    [programArr, setprogramArr] = useState([]), //所属项目
    [payload, setPayload] = useState({
      pageNo:1,
      pageSize,
      status: '',
      endTime: '',
      startTime: '',
      channelId: '',
      internalName: '',
      objectId:null,
      marketActivityType: null
    })
  /*回调*/
  useEffect(() => {
    delete window.activityStyle_clickSave;
    /*activityDetail 无操作为0， 1为详请，2为编辑*/
    localStorage.setItem('activityDetail', '0')
    localStorage.setItem('isActivityHave', '');
    let tokenObj=JSON.parse(localStorage.getItem('tokenObj'));
    getChannel(tokenObj.channelId);
    getMarketTypeList();
    let temp = JSON.parse(sessionStorage.getItem('activityListData')) || {}
    if (temp && temp.jumpUrlStatus) {
      temp.jumpUrlStatus = false
      sessionStorage.setItem('activityListData', JSON.stringify(temp))
      form.setFieldsValue({
        marketActivityType: temp.marketActivityType,
        internalName: temp.internalName,
        status: temp.status,
        objectId: temp.objectId,
      })
      if(temp.startTime && temp.endTime){
        form.setFieldsValue({
          activityTime: [moment(temp.startTime),moment(temp.endTime)],
        })
      }
      setChannelId(temp.channelId)
      setPayload(temp)
    }
    // let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));
    // if(activityInfo.marketProjectId != null){
    //   form.setFieldsValue({
    //     objectId :activityInfo.marketProjectId
    //   })
    // }
  }, [])
  /*回调*/
  useEffect(() => {
    if (payload.channelId) {
      // getList()
    }
    if (channelList && channelList.channelList && channelList.channelList.length > 0) {
      if (channelList.isChannel !== 0) {
        let id = channelList.channelList[0].id
        payload.channelId = id
        setChannelId(id)
        getListMarketProject(id)
        getList();
      } else {
        let activityTime = []
        if (payload.startTime && payload.endTime) {
          activityTime.push(moment(payload.startTime), moment(payload.endTime))
        } else {
          activityTime.push('', '')
        };
        let temp2 = { ...payload };
        var toTemp= 0 ;
        channelList.channelList.forEach((item,key) => {
          if(item.id == payload.channelId){
            toTemp = key
          }
        })
        temp2.channelId = toTemp
        setChannelId(channelList.channelList[toTemp].id)
        getListMarketProject(channelList.channelList[toTemp].id)
        form.setFieldsValue({
          ...temp2,
          activityTime
        })
      }
    }
  }, [pageSize, payload, channelList])
  /*获取渠道*/
  let getChannel = (channelId) => {
    dispatch({
      type: 'activityList/getActivityChannelList',
      payload: {
        method: 'post',
        params: {
          channelId:channelId,
        }
      }
    })
  }
  let [marketTypeList, setMarketTypeList] = useState([]);//活动类型
  /*获取活动类型*/
  let getMarketTypeList = () => {
    dispatch({
      type: 'activityList/queryMarketTypeList',
      payload: {
        method: 'get',
        params: {}
      },
      callback:(res) =>{
        if(res.result.code == '0'){
          setMarketTypeList(res.body);
        }
      }
    })
  }
  //获取所属项目
  let getListMarketProject = (channelId) => {
    dispatch({
      type: 'activityNumber/getListMarketProject',
      payload:{
        method:'postJSON',
        params:{
          channelId:channelId
        }
      },
      callback:(res)=>{
        if(res.result.code === "0"){
          setprogramArr(res.body);
        }
      }
    })
  }
  /*获取列表*/
  let getList = () => {
    dispatch({
      type: 'activityList/getList',
      payload: {
        method: 'postJSON',
        params: payload
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let temp = res.body || {};
          let list = temp.list;
          list = list.length > 0 && list.filter((item)=>{
            if(item.endTime && item.startTime && item.internalName){
              return item
            }
          })
          setList(temp.list || [])
          setPageTotal(temp.total || 1)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  /* 进入数据看板 */
  let goDataAnalysis = (record) => {
    history.push({
      pathname: '/dataAnalysis/activityDataAnalysis',
      query: {
        activityId: record.objectId
      }
    })
  } 
  let goToDetail = (record) => {
    setListData()
    /*activityDetail 无操作为0， 1为详请，2为编辑*/
    localStorage.setItem('activityDetail', '1')
    localStorage.setItem('activityInfo', JSON.stringify(record))
    localStorage.setItem('isActivityHave', '')
    history.push('/activityConfig/activityList/activityModule/info');
    localStorage.setItem('isNewActivity', false);
  }
  let goToEdit = (record) => {
    setListData();
    if (record && (record.status === 4 || record.status === 3)) {
      localStorage.setItem('isActivityHave', true)
    }
    /*activityDetail 无操作为0， 1为详请，2为编辑*/
    if(record && record.status === 1){
      localStorage.setItem('activityDetail', '0')
    }else{
      localStorage.setItem('activityDetail', '2')
    }
    
    localStorage.setItem('activityInfo', JSON.stringify(record))
    localStorage.setItem('isNewActivity', false);
    history.push('/activityConfig/activityList/activityModule/info');
  }
  let setListData = () => {
    payload.jumpUrlStatus = true
    sessionStorage.setItem('activityListData', JSON.stringify(payload))
  }
  /*下载中奖名单excel*/
  let downloadActivityExcel = (record) => {
    let data = {
      activityId: record.objectId,
      activityName: record.internalName,
      channelName: record.channelIdStr,
    }
    dispatch({
      type: 'activityList/downloadActivityExcel',
      payload: {
        method: 'postDownloadExcel',
        params: data,
      },
      callback: (res) => {
        const url = window.URL.createObjectURL(new Blob([res], { type: "application/vnd.ms-excel" }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '中奖名单.xls')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    })
  }
  /* 问卷-数据报表导出 */
  let exportAnswer = (record) => {
    dispatch({
      type: 'activityList/exportAnswer',
      payload: {
        method: 'postDownloadExcel',
        params: {
          activityId: record.objectId
        },
      },
      callback: (res) => {
        const url = window.URL.createObjectURL(new Blob([res], { type: "application/vnd.ms-excel" }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '数据报表.xls')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    })
  
  }
  /*显示投放弹窗*/
  let onShowPutModal = (record) => {
    setPutData(record)
    setPutVisible(true)
  }
  /*隐藏投放弹窗*/
  let onHidePutModal = (e) => {
    setPutVisible(e)
  }
  /*显示复制弹窗*/
  let onShowCopyModal = (record) => {
    localStorage.setItem('activityInfo', JSON.stringify(record))
    setCopySearch(form.getFieldsValue())
    setCopyData(record)
    setCopyVisible(true)
  }
  /*隐藏复制弹窗*/
  let onHideCopyModal = (e) => {
    setCopyVisible(e)
  }
  /*渲染提示框*/
  let renderModal = (record, type) => {
    let text = ''
    if (type === 3) {
      text = '发布后将在用户端可见，是否确认信息无误发布该活动？'
    }
    if (type === 4) {
      text = '是否立即开始活动？'
    }
    if (type === 5) {
      text = '是否立即结束活动'
    }
    if (type === 12) {
      text = '删除后将无法还原，是否确认删除该活动？'
    }
    confirm({
      title: '提示',
      icon: <InfoCircleTwoTone />,
      content: text,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        if (type === 3) {
          onRelease(record,2)
        }
        if (type === 4) {
          onRelease(record,4)
        }
        if (type === 5) {
          onRelease(record,3)
        }
        if (type === 12) {
          onDelete(record)
        }
      }
    })
  }
  /*发布*/
  let onRelease = (record,types) => {
    /*status状态 1待发布 2发布 3立即结束 4立即开始*/
    let data = {
      status: types,
      activityId: record.objectId,
      channelId: record.channelId,
      channelName: record.channelIdStr,
    }
    dispatch({
      type: 'activityList/updateActivityStatus',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
            var messageTxt=''
            if(types==2){
                messageTxt='发布成功！';
            }else if(types==3){
                messageTxt='立即结束成功！';
            }else if(types==4){
                messageTxt='立即开始成功！';
            }
            message.success(messageTxt)
          let data = {
            pageNo: 1,
            pageSize,
            channelId,
            status: '',
            endTime: '',
            startTime: '',
            internalName: '',
            marketActivityType: null
          }
          setPayload(data)
        } else {
          message.error('请求失败，请重新尝试！')
        }
      }
    })
  }
  /*删除*/
  let onDelete = (record) => {
    let data = {
      activityId: record.objectId,
      channelId: record.channelId,
    }
    dispatch({
      type: 'activityList/onDeleteActivity',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          message.success('删除成功！')
          let data = {
            pageNo: 1,
            pageSize,
            channelId,
            status: '',
            endTime: '',
            startTime: '',
            internalName: '',
            marketActivityType: null
          }
          setPayload(data)
        } else {
          message.error('删除失败，请重新尝试！')
        }
      }
    })
  }
  /*复制弹窗 - 暂时搁置不做*/
  let renderCopyModal = () => {
    let onOk = () => {
      if (!internal) {
        message.info('请填写活动内部名称')
        return
      }
      if (!external) {
        message.info('请填写活动展示名称')
        return
      }
      if (copyTime.length <= 0) {
        message.info('请选择活动时间')
        return
      }
    }
    //内部名称输入change事件
    let onInternalChange = (e) => {
      let value = e.target.value
      setInternal(value)
    }
    //外部名称输入change事件
    let onExternalChange = (e) => {
      let value = e.target.value
      setExternal(value)
    }
    //活动时间change事件
    let onTimeChange = (e) => {
      setCopyTime(e)
    }
    return <>
      <Modal
        onOk={onOk}
        width={600}
        title="复制活动"
        closable={false}
        maskClosable={false}
        visible={copyVisible}
        onCancel={() => { setCopyVisible(false) }}
      >
        <div className={style.copy_item}>
          <div className={style.copy_item_left}>
            <span className={style.list_red}>*</span>
            <span>活动内部名称:</span>
          </div>
          <div >
            <Input
              maxLength="20"
              placeholder='请输入'
              onChange={onInternalChange}
              className={style.copy_item_right}
            />
          </div>
        </div>
        <div className={style.copy_item}>
          <div className={style.copy_item_left}>
            <span className={style.list_red}>*</span>
            <span>活动展示名称:</span>
          </div>
          <div >
            <Input
              maxLength="20"
              placeholder='请输入'
              onChange={onExternalChange}
              className={style.copy_item_right}
            />
          </div>
        </div>
        <div className={style.form__item}><span className={style.info_wrap_i1}>该信息会展示在用户端标题处</span></div>
        <div className={style.copy_item}>
          <div className={style.copy_item_left}>
            <span className={style.list_red}>*</span>
            <span>活动时间:</span>
          </div>
          <div>
            <RangePicker
              showTime
              locale={locale}
              onChange={onTimeChange}
              format="YYYY-MM-DD HH:mm:ss"
              className={style.copy_item_right}
            />
          </div>
        </div>
      </Modal>
    </>
  }
  /*清空内容*/
  let resetBtnEvent = () => {
    let data = {
      pageNo: 1,
      pageSize,
      status: '',
      endTime: '',
      startTime: '',
      channelId: '',
      internalName: '',
      jumpUrlStatus: false,
      objectId:null,
      marketActivityType: null
    }
    form.resetFields()
    setPayload(data)
    setChannelId('')
    setList([])
    sessionStorage.setItem('activityListData', JSON.stringify(data))
  }
  /*搜索按钮*/
  let searchBtnEvent = (e) => {
    if (!channelId) {
      e.channelId = channelList.channelList[0].id;
    } else {
      e.channelId = channelId;
    }
    let endTime = ''
    let startTime = ''
    if (e.activityTime && e.activityTime.length > 0) {
      endTime = moment(e.activityTime[1]).valueOf()
      startTime = moment(e.activityTime[0]).valueOf()
    }
    let data = {
      ...e,
      endTime,
      pageSize,
      startTime,
      pageNo: 1
    }
    setPayload(data)
  }
  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) => {
    let _payload = JSON.parse(JSON.stringify(payload));
    _payload.pageNo = page
    setPayload(_payload)
    setPageSize(pageSize)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    let _payload = JSON.parse(JSON.stringify(payload));
    _payload.pageNo = page
    _payload.pageSize = pageSize
    setPageSize(pageSize)
    setPayload(_payload)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${payload.pageNo} / ${totalPage}  页`
  }
  /*新增活动*/
  let goToAdd = () => {
    setListData()
    let temp = {
      channelId
    }
    localStorage.setItem('activityInfo', JSON.stringify(temp))
    localStorage.setItem('isNewActivity', true)
    localStorage.setItem('isActivityHave', '');
    localStorage.setItem('activityStep',1);
    resetBtnEvent();
    history.push('/activityConfig/activityList/activityModule/info')
  }
  let onChannelId = (e) => {
    let channelIds = channelList.channelList[e].id;
    form.setFieldsValue({
      objectId:null
    })
    setChannelId(channelIds);
    getListMarketProject(channelIds);
  }
  let [isReissueCoupon, setIsReissueCoupon] = useState(false);//补发奖品弹窗是否展示
  let [reissueCouponData, setReissueCouponData] = useState({});//补发奖品选择数据
  //点击补发奖品按钮
  let reissueCouponChange = (all) => {
    let obj = {
      objectId: all.objectId,
      resendCount: all.resendCount,
      internalName: all.internalName,
      channelIdStr: all.channelIdStr
    }
    setReissueCouponData(obj);
    setIsReissueCoupon(true);
  }
  //确认补发奖品
  let reissueCouponOk = () => {
    console.log(reissueCouponData)
    dispatch({
      type: 'activityList/resendPrize',
      payload: {
        method: 'get',
        params: {
          activityId: reissueCouponData.objectId
        },
      },
      callback: (res) => {
        if (res.result.code === '0') {
          getList();
          message.info(res.body);
          setIsReissueCoupon(false);
        } else {
          message.error(res.result.message)
        }
      }
    })
    
  }
  //补发奖品下载附件
  let downloadReissueCoupon = () =>{
    dispatch({
      type: 'activityList/downloadResendExcel',
      payload: {
        method: 'postDownloadExcel',
        params: {
          activityId: reissueCouponData.objectId,
          activityName: reissueCouponData.internalName,
          channelName: reissueCouponData.channelIdStr,
        },
      },
      callback: (res) => {
        const url = window.URL.createObjectURL(new Blob([res], { type: "application/vnd.ms-excel" }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '奖品发放失败明细.xls')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    })
  }

  return (
    <div>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtnEvent} onReset={resetBtnEvent}>
          <Form.Item label="活动名称" name="internalName" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="活动类型" name="marketActivityType" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="请选择">
              {marketTypeList && marketTypeList.map((v) => {
                return <Option value={v.marketActivityType}>{v.marketActivityTypeStr}</Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item label="状态" name="status" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="请选择">
              {activityStatus && activityStatus.map((v) => {
                return <Option value={v.id}>{v.title}</Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item label="活动时间" name="activityTime" labelCol={{flex: '0 0 120px'}}>
            <RangePicker placeholder={['请选择','请选择']} format="YYYY-MM-DD" />
          </Form.Item>
          {/* <Form.Item label="渠道" name="channelId" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="请选择">
              {channelList && channelList.channelList && channelList.channelList.map((v) => {
                return <Option value={v.key}>{v.channelName}</Option>
              })}
            </Select>
          </Form.Item> */}
          <Form.Item label="营销项目" name="objectId" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="请选择">
              {programArr && programArr.map((v) => {
                return <Option value={v.objectId}>{v.marketProjectName}</Option>
              })}
            </Select>
          </Form.Item>
        </QueryFilter>
      </div>
      <div className={style.list_box}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
            <CompAuthControl compCode="activityConfig_list_addActivity">
              <Button type='primary' onClick={goToAdd}>新增活动</Button>
            </CompAuthControl>
          </Space>
        </ListTitle>
        <ListTable showPagination current={payload.pageNo} pageSize={pageSize} total={pageTotal}
          onChange={onSizeChange}>
          <Table dataSource={list} scroll={{x:1500}} pagination={false}>
            <Column title="活动ID" dataIndex="objectId" key="objectId" fixed='left' width={100}/>
            <Column title="活动内部名称" dataIndex="internalName" key="internalName"/>
            <Column title="营销项目" dataIndex="marketProjectStr" key="marketProjectStr"/>
            <Column title="预算" dataIndex="totalPrice" key="totalPrice" 
            render={(totalPrice) => {
              return <span>{Number(totalPrice).toLocaleString()}</span>
            }}/>
            <Column title="活动类型" dataIndex="marketType" key="marketType" 
            render={(text,all) => {
              return <span>{all.marketTypeStr == "-" && all.marketActivityTypeStr == "-" ? <>{'-'}</>:<>{all.marketTypeStr}-{all.marketActivityTypeStr}</>}</span>
            }}/>
            <Column title="活动开始时间" dataIndex="startTime" key="startTime"
              render={(text, all) => <ListTableTime>{text}</ListTableTime>}/>
            <Column title="活动结束时间" dataIndex="endTime" key="endTime"
              render={(text, all) => <ListTableTime>{text}</ListTableTime>}/>
            <Column title="状态" dataIndex="statusStr" key="statusStr"
            // render={ (text, all) => (
            //   <TypeTags type={
            //     all.status == 1 ? 'red' :
            //     all.status == 2 ? 'blue' :
            //     all.status == 3 ? 'orange' :
            //     all.status == 4 ? 'green' : 'yellow'}
            //   >{text}</TypeTags>
            // )}
            render={(text, all)=>(<>
              <StateBadge color={
                all.status == 1 ? 'red' :
                all.status == 2 ? 'blue' :
                all.status == 3 ? 'orange' :
                all.status == 4 ? 'green' : 'yellow'}
              >{text}</StateBadge>
            </>)}/>
            <Column title="操作" fixed="right" dataIndex="status" key="status" width={230}
            render={(text, all)=>(<>
              <ListTableBtns showNum={3}>
                {text === 2 ? 
                <>
                  <CompAuthControl compCode="activityConfig_list_release">
                    <LtbItem onClick={() => {renderModal(all, 3)}}>发布</LtbItem>
                  </CompAuthControl>
                </>
                : null}
                {text === 3 ? 
                  <CompAuthControl compCode="activityConfig_list_start">
                    <LtbItem onClick={()=>{renderModal(all, 4)}}>立即开始</LtbItem> 
                  </CompAuthControl>
                : null}
                {text === 4 ? 
                  <CompAuthControl compCode="activityConfig_list_end">
                    <LtbItem onClick={()=>{renderModal(all, 5)}}>立即结束</LtbItem> 
                  </CompAuthControl>
                : null}
                {text === 5 ? <LtbItem onClick={() => {goToDetail(all)}}>详请</LtbItem> : null}
                {text === 1 || text === 2 || text === 3 || text === 4 ? 
                  <CompAuthControl compCode="activityConfig_list_edit">
                    <LtbItem onClick={() => {goToEdit(all)}}>编辑</LtbItem> 
                  </CompAuthControl>
                : null}
                {process.env.REACT_APP_ENV === "prod" ? 
                  ((text !== 1 && all.objectId > 101188) ?
                    <CompAuthControl compCode="activityConfig_list_copy">
                      <LtbItem onClick={() => {onShowCopyModal(all)}}>复制</LtbItem>
                    </CompAuthControl> 
                  : null) 
                  : (text !== 1 ? 
                    <CompAuthControl compCode="activityConfig_list_copy">
                      <LtbItem onClick={() => {onShowCopyModal(all)}}>复制</LtbItem> 
                    </CompAuthControl>
                  : null)
                }
                {text === 3 || text === 4|| text === 5 ? 
                  <CompAuthControl compCode="activityConfig_list_launch">
                    <LtbItem onClick={() => {onShowPutModal(all)}}>投放</LtbItem> 
                  </CompAuthControl>
                : null}
                {(text === 4 || text === 5) && all.marketActivityType !=2 ? 
                  <CompAuthControl compCode="activityConfig_list_winningList">
                    <LtbItem onClick={() => {downloadActivityExcel(all)}}>中奖名单</LtbItem> 
                  </CompAuthControl>
                : null}
                {text === 1 || text === 2 || text === 5 ? 
                  <CompAuthControl compCode="activityConfig_list_delete">
                    <LtbItem onClick={() => { renderModal(all, 12) }}>删除</LtbItem> 
                  </CompAuthControl>
                : null}
                {text !==2  ? 
                  <CompAuthControl compCode="activityConfig_list_dataBoard">
                    <LtbItem onClick={() => { goDataAnalysis(all) }}> 数据看板</LtbItem> 
                  </CompAuthControl>
                : null}
                {(text === 4 || text === 5) && (all.marketActivityType === 8 || all.marketActivityType === 11) ? 
                  <CompAuthControl compCode="activityConfig_list_dataReport">
                    <LtbItem onClick={() => { exportAnswer(all) }}> 数据报表</LtbItem> 
                  </CompAuthControl>
                : null}
                {all.resendCount ? 
                  <CompAuthControl compCode="activityConfig_list_reissueCoupon">
                    <LtbItem onClick={() => { reissueCouponChange(all) }}> 补发奖品</LtbItem> 
                  </CompAuthControl>
                : null}
              </ListTableBtns> 
              </>
            )}/>
          </Table>
        </ListTable>
      </div>
      {/*投放弹窗组件*/}
      {putVisible?<PutModal
        putData={putData}
        putVisible={putVisible}
        onHidePutModal={onHidePutModal}
      />:null}
      {/*复制弹窗组件*/}
      <CopyModal
        copyData={copyData}
        copyVisible={copyVisible}
        onHideCopyModal={onHideCopyModal}
        onGetList={searchBtnEvent}
        copySearch={copySearch}
      />
      {/* 补发奖品 */}
      <Modal title="补发奖品" visible={isReissueCoupon} cancelText="取消" okText="确认" onCancel={()=>{setIsReissueCoupon(false)}} onOk={reissueCouponOk}>
        <p>当前活动奖品发放失败{reissueCouponData.resendCount}条，是否重新补发？</p>
        <div className={style.reissue_pop} onClick={downloadReissueCoupon}>下载附件</div>
      </Modal>
    </div>
  )
};
export default connect(({ activityList }) => ({
  list: activityList.list,
  pageTotal: activityList.pageTotal,
  channelList: activityList.channelList,
}))(activityListPage)
