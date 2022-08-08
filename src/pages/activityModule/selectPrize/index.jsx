import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {
  Row,
  Col,
  Menu,
  Radio,
  Modal,
  Table,
  Input,
  Button,
  Switch,
  Select,
  Divider,
  Tooltip,
  Pagination,
  InputNumber,
  ConfigProvider
} from "antd"
import style from './style.less'
import PackageDetailModal from './packageDetailModal.jsx'
import moment from 'moment'
import 'moment/locale/zh-cn'
import zh_CN from "antd/lib/locale-provider/zh_CN";
import { InfoCircleOutlined, FormOutlined } from "@ant-design/icons";

moment.locale('zh-cn')

const selectPrizePage = (props) => {
  let { dispatch, onOk, pageTotal, cardList, activityType, channelAuthority, couponCardbagList, couponCardbagTotal, cardbagIdList, takePackageDetail, goodsType, editGood } = props
  let [activityData, setActivityData] = useState(JSON.parse(localStorage.getItem('activityInfo')))  //活动信息
  let [list, setList] = useState([])  //卡券列表数据
  let [timeVisible, setTimeVisible] = useState(false)  //卡券有效期模态框状态
  let [menuItemArr, setMenuItemArr] = useState([])  //侧边栏数据
  let [openKeys, setOpenKeys] = useState(['1'])  //侧边栏选中key
  let [menuItemKey, setMenuItemKey] = useState('1') //侧边栏选中key
  let [inputValue, setInputValue] = useState('') //侧边栏选中key
  let [couponSkuName, setCouponSkuName] = useState('') //卡券搜索
  let [amount, setAmount] = useState(0) //金额
  let [prizeData, setPrizeData] = useState({}) //奖品
  let [cardPrizeList, setCardPrizeList] = useState([]) //选中的卡券数据
  let [cardKeyList, setCardKeyList] = useState([]) //选中的卡券数据的key
  let [cardTimeRecord, setCardTimeRecord] = useState({}) // 卡券 编辑有效期时，当前这条数据详请。
  let [pointsType, setPointsType] = useState(0) //  海贝积分领取方式，默认是0。
  let [pointsLink, setPointsLink] = useState('') //  海贝积分领取链接。
  let [pageSize, setPageSize] = useState(10),
    [pageNum, setPage] = useState(1),
    [payload, setPayload] = useState({
      pageNum,
      pageSize,
      couponSkuName,
      channelNo: activityData.channelId
    });
  let [extPrize, setExtPrize] = useState({//  外部奖励
    name: "",
    link: "",
    num: 1
  })
  let [couponPackageName, setCardPageName] = useState('') //卡包名称搜索
  let [couponPackageNo, setCardPageID] = useState('') //卡包ID搜索
  let [cardPagePrizeList, setCardPagePrizeList] = useState([]) //选中的卡包数据
  let [cardPageKeyList, setCardPageKeyList] = useState([]) //选中的卡包数据的key
  let [list1, setList1] = useState([])  //卡包列表数据
  let [pageSize1, setPageSize1] = useState(10),
    [pageNum1, setPage1] = useState(1),
    [payload1, setPayload1] = useState({
      pageNum1,
      pageSize1,
      couponPackageName,
      couponPackageNo,
      channelNo: activityData.channelId
    });
  /*卡包名称搜索input*/
  let onSetCardPageName = (e) => {
    let value = e.target.value
    setCardPageName(value)
  }
  /*卡包ID搜索search*/
  let onSetCardPageID = (e) => {
    setCardPageID(e)
  }
    /*卡包搜索*/
    let onSearch1 = () => {
        let data = {
          pageSize,
          pageNum: 1,
          couponPackageName,
          couponPackageNo,
          channelNo: activityData.channelId
        }
        setPage1(1);
        setPayload1(data);

    }
    /*卡包重置*/
    let onReset1 = () => {
      let data = {
        pageSize: 10,
        pageNum: 1,
        couponPackageName: '',
        couponPackageNo: '',
        channelNo: activityData.channelId
      }
      setPage1(1);
      setCardPageName('');
      setCardPageID('');
      setPayload1(data)
    }
      /*卡包点击下一页上一页*/
  let onNextChange1 = (page1, pageSize1) => {
    payload1.pageNum1 = page1
    setPayload1(payload1)
    setPage1(page1)
    setPageSize1(pageSize1)
  }
  /*卡包改变每页条数*/
  let onSizeChange1 = (page1, pageSize1) => {
    payload1.pageNum1 = page1
    payload1.pageSize1 = pageSize1
    setPage1(page1)
    setPageSize1(pageSize1)
    setPayload1(payload1)
    onPageTotal1()
  }
  /*卡包显示总条数和页数*/
  let onPageTotal1 = (total1, range1) => {
    let totalPage = Math.ceil(total1 / pageSize1)
    return `共${total1}条记录 第 ${pageNum1} / ${totalPage}  页`
  }
   //优惠购卡包列表单选
   const rowSelection2={
    onChange: (key, value) => {
      setCardPageKeyList(key)
      setCardPagePrizeList(value || [])
    },
    type: 'radio',
    hideSelectAll: true,
    selectedRowKeys: cardPageKeyList,
  }
  const columns1 = [
    {
      title: "卡包编号",
      dataIndex: 'couponPackageNo',
      key: 'couponPackageNo',
    },
    {
      title: '卡包内部名称',
      dataIndex: 'couponPackageName',
      key: 'couponPackageName',
    },
    {
      width: 120,
      title: '面值（元）',
      dataIndex: 'faceValue',
      key: 'faceValue',
    },
    {
      width: 140,
      title: '卡券数量（张）',
      dataIndex: 'totalCouponNum',
      key: 'totalCouponNum',
      render: (totalCouponNum, record) => {
        return <a onClick={() => { showDetail(totalCouponNum, record) }}>{totalCouponNum}</a>
      }
    },
    {
      title: '卡包数量',
      dataIndex: 'couponPackageNum',
      key: 'couponPackageNum',
      render: (couponPackageNum, record) => renderNum(couponPackageNum, record, 2)
    },
    // {
    //   title: '可否转增',
    //   dataIndex: 'shareFlag',
    //   key: 'shareFlag',
    //   render: (shareFlag, record) => renderGiving(shareFlag, record, 2)
    // }
  ]

   /*卡包列表change事件*/
   let onCardPageListChange = (value, record, flag) => {
    let temp = JSON.parse(JSON.stringify(list1))
    let tempList = JSON.parse(JSON.stringify(cardPagePrizeList))
    temp.map((item, key) => {
      if (item.key === record.key) {
        if (flag === 1) {
          item.couponPackageNum = value
        }
        if (flag === 2) {
          item.shareFlag = value
        }
      }
    })
    tempList.map((item, key) => {
      if (item.key === record.key) {
        if (flag === 1) {
          item.couponPackageNum = value
        }
        if (flag === 2) {
          item.shareFlag = value
        }
      }
    })
    setList1(temp)
    setCardPagePrizeList(tempList)
  }
  let [showPackageDetail,setShowPackageDetail] = useState(false);//是否显示卡包明细modal
  let [packageDetailData,setPackageDetailData] = useState({
    total:"",
    couponPackageNo:"",
    quotationItemId:""
  });//选择展示卡包明细请求数据
  let getPackageDetailList = (value) => {
    takePackageDetail(value)
  }
  //卡包明细展示
  let showDetail = (totalCouponNum, record) => {
    setPackageDetailData({
        total:totalCouponNum,
        couponPackageNo:record.couponPackageNo,
        quotationItemId: record.quotationItemId
      });
    setShowPackageDetail(true);
  }
  /*获取奖品 卡包列表*/
  let getCouponPackageList = () => {
    dispatch({
      type: 'activitySelectPrize/channelCouponPackage',
      payload: {
        method: 'postJSON',
        params: payload1,
      }
    })
  }
  //卡包ID下拉
  let selsctQueryPackage = () => {
    dispatch({
      type: 'activitySelectPrize/selsctQueryPackage',
      payload: {
        method: 'postJSON',
        params: {}
      }
    })
  }
   /*回调*/
   useEffect(() => {
    getCouponPackageList()
    selsctQueryPackage()
    setCardPageKeyList([])
    setCardPagePrizeList([])
  }, [pageNum1, pageSize1, payload1])
  useEffect(() => {
    onPrizeChange(cardPagePrizeList);
  }, [cardPagePrizeList])

  useEffect(() => {
    setCardKeyList([])
    setCardPrizeList([])
    setCardPageKeyList([])
    setCardPagePrizeList([])
    setCardTimeRecord({})
  }, [])
  useEffect(() => {
    if (Object.keys(activityData).length > 0) {
      getChannelAuthority()
    }
  }, [activityData])
  useEffect(() => {
    let temp = cardList || []
    temp.map(item => {
      let effectiveDate = item.defaultEffectiveDays;
      if(item.serviceType == 1){
        if(item.useValidDays && item.useValidDays >= 0){
          effectiveDate = item.useValidDays;
        }else{
          effectiveDate = item.maxEffectiveDays;
        }
      }
      item.effectiveDate = effectiveDate
    })
    setList(temp)
  }, [cardList])
  useEffect(() => {
    let temp = couponCardbagList || [];
    setList1(temp)
  }, [couponCardbagList])
  useEffect(() => {
    let menuItemArr = [{
      title: '卡券',
      type: '1'
    }, {
      title: '积分',
      type: '6'
    },
    // {
    //   title: '现金',
    //   type: '3'
    // }, 
    {
      title: '实物',
      type: '4'
    }, {
      title: '海贝积分',
      type: '2'
    }, {
      title: '外部奖品',
      type: '8'
    }, {
      title: '不中奖',
      type: '5'
    }]
    {/*activityType: 1为大转盘，2为秒杀, 9为任务奖品选择卡券*/ }
    if (activityType === '2') {
      /*秒杀 隐藏其他*/
      menuItemArr.splice(6, 1)
    }
    if(activityType === '4' || activityType === '9'){
      /*优惠购 隐藏其他 只有卡券*/
      menuItemArr.splice(1,6);
      if(activityType === '4') {
        menuItemArr.push({
          title: '卡包',
          type: '9'
        })
        if(goodsType == 1){
          menuItemArr.splice(1,1);
        }else{
          menuItemArr.splice(0,1);
          setOpenKeys(['9']);
          setMenuItemKey('9');
        }
      }
    }
    if(!channelAuthority){
      /*非太保用户  隐藏海贝积分*/
      menuItemArr.splice(4, 1)
    }
    setMenuItemArr(menuItemArr)
  }, [activityType, channelAuthority])
  /*回调*/
  useEffect(() => {
    getCouponList()
    setCardKeyList([])
    setCardPrizeList([])
  }, [pageNum, pageSize, payload])

  /*获取奖品 卡券列表*/
  let getCouponList = () => {
    dispatch({
      type: 'activitySelectPrize/getCouponList',
      payload: {
        method: 'postJSON',
        params: payload,
      }
    })
  }
  /*获取当前活动的 渠道权限*/
  let getChannelAuthority = () => {
    dispatch({
      type: 'activitySelectPrize/getChannelAuthority',
      payload: {
        method: 'postJSON',
        params: { activityId: activityData.objectId },
      }
    })
  }
  useEffect(() => {
    if (Object.keys(prizeData).length !== 0) {
      onOk({ prizeData })
    }
  }, [prizeData])
  useEffect(() => {
    onPrizeChange(cardPrizeList)
  }, [cardPrizeList])
  useEffect(() => {
    onPrizeChange()
  }, [amount, inputValue, menuItemKey, pointsType, pointsLink, extPrize])
  const columns = [
    {
      title: () => {
        return <div>
          卡券编号
          <Tooltip title="单套奖品所包含对应卡券的数量">
            <InfoCircleOutlined className={style.wrap2_ico} />
          </Tooltip>
        </div>
      },
      dataIndex: 'couponSkuNo',
    }, {
      title: '卡券内部名称',
      dataIndex: 'couponSkuName',
    }, {
      title: '单价（元）',
      dataIndex: 'quotaPrice',
    }, {
      width: 100,
      title: '使用门槛', dataIndex: 'isUseThreshold', key: 'isUseThreshold',
      render: (isUseThreshold, record) => {
        return <>
          {
            isUseThreshold == 1 ? <span>满{record.useThresholdAmount}元可用</span> : <span>无门槛</span>
          }
        </>
      }
    }, {
      title: () => {
        return <div>
          数量（张）
          <Tooltip title="单套奖品所包含对应卡券的数量">
            <InfoCircleOutlined className={style.wrap2_ico} />
          </Tooltip>
        </div>
      },
      dataIndex: 'couponNum',
      render: (couponNum, record) => renderNum(couponNum, record, 1)
    }, {
      title: '有效期',
      dataIndex: 'effectiveDate',
      render: (effectiveDate, record) => renderTime(effectiveDate, record)
    }, {
      title: '可否转增',
      dataIndex: 'shareFlag',
      render: (shareFlag, record) => renderGiving(shareFlag, record, 1)
    }
  ]
  /*数量组件*/
  let renderNum = (couponNum, record,cardType) => {
    return <div>
      <InputNumber
        min={0}
        value={cardType == 1 ? couponNum : "1"  }
        parser={limitNumber}
        formatter={limitNumber}
        disabled = {cardType != 1}
        className={style.prizeSet_list_numInput}
        onChange={(value) => { cardType == 1 ? onCardListChange(value, record, 1) : onCardPageListChange(value, record, 1) }}
      />
    </div>
  }
  /*卡券列表change事件*/
  let onCardListChange = (value, record, flag) => {
    let temp = JSON.parse(JSON.stringify(list))
    let tempList = JSON.parse(JSON.stringify(cardPrizeList))
    let tempTimeRecord = JSON.parse(JSON.stringify(cardTimeRecord))
    temp.map((item, key) => {
      if (item.key === record.key) {
        if (flag === 1) {
          item.couponNum = value
        }
        if (flag === 2) {
          tempTimeRecord.effectiveDate = value
          setCardTimeRecord(tempTimeRecord)
        }
        if (flag === 3) {
          item.shareFlag = value
        }
      }
    })
    tempList.map((item, key) => {
      if (item.key === record.key) {
        if (flag === 1) {
          item.couponNum = value
        }
        if (flag === 2) {
          tempTimeRecord.effectiveDate = value
          setCardTimeRecord(tempTimeRecord)
        }
        if (flag === 3) {
          item.shareFlag = value
        }
      }
    })
    setList(temp)
    setCardPrizeList(tempList)
  }
  /*有效期组件*/
  let renderTime = (effectiveDate, record) => {
    let onClickTime = () => {
      setCardTimeRecord(record)
      setTimeVisible(true)
    }
    return <div>
      领取后{effectiveDate}天
      <FormOutlined onClick={(onClickTime)} />
    </div>
  }
  /*有效期弹窗确认方法*/
  let onTimeOk = () => {
    if (cardPrizeList.length <= 0) {
      promptBox('请先选择卡券！')
      return
    }
    if(cardTimeRecord.serviceType == 1 && cardTimeRecord.useValidDays && cardTimeRecord.useValidDays >= 0){
      if (cardTimeRecord.effectiveDate > cardTimeRecord.useValidDays) {
        promptBox('有效期不能大于最大有效期！')
        return
      }
    }else{
      if (cardTimeRecord.effectiveDate > cardTimeRecord.maxEffectiveDays) {
        promptBox('有效期不能大于最大有效期！')
        return
      }
    }
    if (cardTimeRecord.effectiveDate <= 0) {
      promptBox('有效期需大于0！')
      return
    }
    let temp = JSON.parse(JSON.stringify(list))
    let tempList = JSON.parse(JSON.stringify(cardPrizeList))
    tempList.map(item => {
      if (item.key === cardTimeRecord.key) {
        item.effectiveDate = cardTimeRecord.effectiveDate
      }
    })
    temp.map(item => {
      if (item.key === cardTimeRecord.key) {
        item.effectiveDate = cardTimeRecord.effectiveDate
      }
    })
    setList(temp)
    setCardPrizeList(tempList)
    setCardTimeRecord({})
    setTimeVisible(false)
  }
  /*转增组件*/
  let renderGiving = (shareFlag, record, cardType) => {
    let onChange = (e) => {
      if(cardType == 1){
        onCardListChange(e ? 2 : 1, record, 3)
      }else if(cardType == 2){
        onCardPageListChange(e ? 2 : 1, record, 2)
      }

    }
    return <Switch
      checked={shareFlag === 2}
      checkedChildren="开"
      unCheckedChildren="关"
      onChange={onChange}
    />
  }
  /*卡券列表 选中 配置*/
  const rowSelection = {
    onChange: (key, value) => {
      setCardKeyList(key)
      setCardPrizeList(value || [])
    },
    type: 'checkbox',
    hideSelectAll: true,
    selectedRowKeys: cardKeyList
  }
  //优惠购卡券列表单选
  const rowSelection1={
    onChange: (key, value) => {
      setCardKeyList(key)
      setCardPrizeList(value || [])
    },
    type: 'radio',
    hideSelectAll: true,
    selectedRowKeys: cardKeyList
  }
  /*侧边栏选中事件*/
  let onOpenChange = (e) => {
    if (e.key === '1') {
      setList(cardList)
      setList1([])
      setCardPageKeyList([])
      setCardPagePrizeList([])
    }else if (e.key === '9') {
      setList1(couponCardbagList)
      setList([])
      setCardKeyList([])
      setCardPrizeList([])
    }else {
      setList([])
      setCardKeyList([])
      setCardPrizeList([])
      setList1([])
      setCardPageKeyList([])
      setCardPagePrizeList([])
    }
    setAmount(0)
    setMenuItemKey(e.key)
    setPrizeData({})
    setOpenKeys(e.keyPath)
    setInputValue('')
    setPointsLink('')
    setPointsType(0)
  }
  /*卡券搜索input*/
  let onSetNameChange = (e) => {
    let value = e.target.value
    setCouponSkuName(value)
  }
  /*input Change 事件*/
  let onInputChange = (e) => {
    let value = e.target.value
    setInputValue(value)
  }
  /*input Change 事件*/
  let onAmountChange = (e) => {
    let value = e.target.value
    setAmount(value)
  }

  /*创建奖品信息*/
  let onPrizeChange = (e) => {
    let tempObj = {
      num: 0, //卡券数量
      type: '1', //类型：1卡券,2积分,3现金,4实物,5谢谢参与
      remark: '', //谢谢参与
      prizeId: '', //奖品卡券id
      prizeImg: '', //奖品图片
      prizeName: '', //奖品名称
      totalPrice: 0, //总价（元）
      prizeAmount: 0, //奖品金额或数量
      estimatedNum: 0, //预计数量
      activityStockNum: 0 //活动库存
    }
    let tempData = {}
    if (menuItemKey === '1') {
      let cardPrizeList = []
      if (e && e.length > 0) {
        e.map(item => {
          let tempData = {}
          tempData = { ...item }
          tempData.endPeriod = ''
          tempData.startPeriod = ''
          tempData.couponNo = item.couponSkuNo
          tempData.couponName = item.couponSkuName
          tempData.prizeAmount = item.quotaPrice.toString()
          cardPrizeList.push(tempData)
        })
      }
      tempData = {
        cardPrizeList,
        type: menuItemKey,
        prizeName: ''
      }
    }
    if (menuItemKey === '9') {
      let cardPagePrizeList = []
      if (e && e.length > 0) {
        e.map(item => {
          let tempData = {}
          tempData = { ...item }
          tempData.endPeriod = ''
          tempData.startPeriod = ''
          tempData.couponNo = item.couponPackageNo
          tempData.couponName = item.couponPackageName
          tempData.couponNum = 1
          tempData.prizeAmount = item.faceValue.toString()
          cardPagePrizeList.push(tempData)
        })
      }
      tempData = {
        cardPrizeList : cardPagePrizeList,
        type: menuItemKey,
        prizeName: '',
      }
    }
    if (menuItemKey === '2') {
      let temp = { ...tempObj }
      temp.type = menuItemKey
      temp.pointsLink = pointsLink
      temp.pointsType = pointsType
      temp.prizeAmount = inputValue
      temp.prizeName = inputValue + '海贝积分'
      tempData = temp
    }
    if (menuItemKey === '3' || menuItemKey === '4') {
      let temp = { ...tempObj }
      temp.prizeName = inputValue
      temp.prizeAmount = amount
      temp.type = menuItemKey
      tempData = temp
    }
    if (menuItemKey === '5') {
      let temp = { ...tempObj }
      temp.type = menuItemKey
      temp.remark = inputValue
      temp.prizeName = inputValue
      tempData = temp
    }
    if (menuItemKey === '6') {
      let temp = { ...tempObj }
      temp.type = menuItemKey
      tempData = temp
    }
    if (menuItemKey === '8') {
      let temp = { ...tempObj }
      temp.type = menuItemKey;
      temp.prizeName = extPrize.name;
      temp.pointsLink = extPrize.link;
      temp.prizeAmount = extPrize.num;
      tempData = temp
    }
    setPrizeData(tempData)
  }

  /*搜索*/
  let onSearch = () => {
    if (couponSkuName !== '') {
      let data = {
        pageSize,
        pageNum: 1,
        couponSkuName,
        channelNo: activityData.channelId
      }
      setPage(1)
      setPayload(data)
    } else {
      promptBox('请输入查询内容')
    }
  }
  /*重置*/
  let onReset = () => {
    let data = {
      pageSize: 10,
      pageNum: 1,
      couponSkuName: '',
      channelNo: activityData.channelId
    }
    setPage(1)
    setCouponSkuName('')
    setPayload(data)
  }
  /*提示框*/
  let promptBox = (content) => {
    Modal.info({ content })
  }
  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) => {
    payload.pageNum = page
    setPayload(payload)
    setPage(page)
    setPageSize(pageSize)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    payload.pageNum = page
    payload.pageSize = pageSize
    setPage(page)
    setPageSize(pageSize)
    setPayload(payload)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNum} / ${totalPage}  页`
  }
  /*限制数字输入框只能输入整数*/
  let limitNumber = (value) => {
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(/^(0+)|[^\d]/g, '') : ''
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(/^(0+)|[^\d]/g, '') : ''
    } else {
      return ''
    }
  }
  /*海贝积分领取方式 单选change事件*/
  let onPointsTypeChange = (e) => {
    let value = e.target.value
    if (value === 0) {
      setPointsLink('')
    }
    setPointsType(value)
  }
  // 外部奖品
  let onextPrizeChange = (name, e) => {
    let toextPrize = extPrize;
    if (name == 'num') {
      toextPrize[name] = e;
    } else {
      toextPrize[name] = e.target.value;
    }

    setExtPrize({ ...toextPrize });
  }
  useEffect(()=>{
    if(editGood){
      setMenuItemKey(String(editGood.type));
      setOpenKeys([String(editGood.type)]);
      let keyItems = null;//选中数据KEY值
      let selectKey = [];//选中数据KEY值数组（table设置回显需要key数组）
      let echoDataList = [];//回显列表数据
      let toList = [];//复制卡包/卡券数据
      if(editGood.type == 9 && couponCardbagList.length > 0){
        toList = JSON.parse(JSON.stringify(couponCardbagList));
        toList.map((item,index)=>{
          if(item.couponPackageNo == editGood.cardPackage.couponPackageNo){
            keyItems = index;
          }
        });
        selectKey.push(keyItems+1)
        setCardPageKeyList(selectKey);
        echoDataList.push(toList[keyItems]);
        setCardPagePrizeList(echoDataList);
      }else if(editGood.type == 1 && cardList.length > 0){
        toList = JSON.parse(JSON.stringify(cardList));
        toList.map((item,index)=>{
          if(item.couponSkuNo == editGood.couponPrizeList[0].couponNo){
            keyItems = index;
          }
        });
        selectKey.push(keyItems+1)
        setCardKeyList(selectKey);
        toList[keyItems].couponNum = editGood.couponPrizeList[0].couponNum
        echoDataList.push(toList[keyItems]);
        setCardPrizeList(echoDataList);
        setList(toList)
      }
    }
  },[editGood,cardList,couponCardbagList])
  return (
    <div>
      {/* 卡包明细modal */}
      {
        showPackageDetail ?
          <PackageDetailModal showPackageDetail={showPackageDetail}
            closePackageDetailModal={() => { setShowPackageDetail(false) }} packageDetailData={packageDetailData} packageDetailList={getPackageDetailList}/>
          : ''
      }
      <Row justify style={{ width: '100%' }}>
        <Menu mode="inline" selectedKeys={openKeys} onClick={onOpenChange} style={{ width: 256 }}>
          {
            menuItemArr.map((item, key) => {
              return <Menu.Item key={item.type}>{item.title}</Menu.Item>
            })
          }
        </Menu>
        {
          menuItemKey === '1' ? <Row className={style.prizeSet_right}>
            <Row justify style={{ width: '100%' }}>
              <Col span={10}>
                <Input
                  value={couponSkuName}
                  placeholder={'请输入卡券内部名称'}
                  onChange={onSetNameChange}
                />
              </Col>
              <Col span={14}>
                <Button className={style.btn_radius} type="primary" onClick={onSearch}>查询</Button>
                <Button className={style.btn_radius} onClick={onReset}>重置</Button>
              </Col>
            </Row>
            {
              cardPrizeList.length > 0 ? <div style={{ marginTop: '10px' }}>
                该奖品包含： {
                  cardPrizeList.map((item, key) => {
                    return <span key={key}> {item.couponSkuName} x {item.couponNum || 0}张; </span>
                  })
                }
              </div> : null
            }

            <Divider />
            <Col span={24}>
              <Table
                locale={{ emptyText: '暂无数据' }}
                rowSelection={activityType === '4' ?{...rowSelection1} :{...rowSelection}}
                columns={columns}
                dataSource={list}
                pagination={false}
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
                  current={pageNum}
                  defaultPageSize={pageSize}
                  total={pageTotal}
                  onChange={onNextChange}
                  pageSizeOptions={['10', '20', '30', '60']}
                  onShowSizeChange={onSizeChange}
                  showTotal={onPageTotal}
                />
              </ConfigProvider>
            </Col>
          </Row> : null
        }
        {
          menuItemKey === '9' ? <Row className={style.prizeSet_right}>
            <Row justify style={{ width: '100%' }}>
              <Col span={9} className={style.seachInput}>
                <span>卡包名称：</span>
                <Input style={{ width: 200 }}
                  value={couponPackageName}
                  placeholder={'请输入'}
                  onChange={onSetCardPageName}
                />
              </Col>
              <Col span={9} className={style.seachInput}>
                <span>卡包编号：</span>
                <Select style={{ width: 200 }}
                  placeholder="请选择"
                  notFoundContent='暂无数据'
                  showSearch
                  optionFilterProp="children"
                  onChange={onSetCardPageID}
                  value={couponPackageNo}
                >
                 {
                  cardbagIdList && cardbagIdList.map((v) => <Option key={v.couponPackageNo} value={v.couponPackageNo}>{v.couponPackageNo}</Option>)
                }
              </Select>
              </Col>
              <Col span={6}>
                <Button className={style.btn_radius} type="primary" onClick={onSearch1}>查询</Button>
                <Button className={style.btn_radius} onClick={onReset1}>重置</Button>
              </Col>
            </Row>
            {
              cardPagePrizeList.length > 0 ? <div style={{ marginTop: '10px' }}>
                该奖品包含： {
                  cardPagePrizeList.map((item, key) => {
                    return <span key={key}> {item.couponPackageName} x {item.couponPackageNum || 1}个; </span>
                  })
                }
              </div> : null
            }

            <Divider />
            <Col span={24}>
              <Table
                locale={{ emptyText: '暂无数据' }}
                rowSelection={{...rowSelection2}}
                columns={columns1}
                dataSource={list1}
                pagination={false}
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
                  current={pageNum1}
                  defaultPageSize={pageSize1}
                  total={couponCardbagTotal}
                  onChange={onNextChange1}
                  pageSizeOptions={['10', '20', '30', '60']}
                  onShowSizeChange={onSizeChange1}
                  showTotal={onPageTotal1}
                />
              </ConfigProvider>
            </Col>
          </Row> : null
        }
        {
          menuItemKey === '2' ? <div className={style.prizeSet_right}>
            <div className={style.prizeSet_right_item}>
              <div>海贝积分</div>
              <Input
                value={inputValue}
                placeholder={'请输入'}
                onChange={onInputChange}
              />
            </div>
            <div className={style.prizeSet_right_item_text}>海贝积分与现金比例 200:1</div>
            <div className={style.prizeSet_right_item}>
              <div>领取方式</div>
              <Radio.Group style={{ width: '210px', marginTop: '6px' }} onChange={onPointsTypeChange} value={pointsType}>
                <Radio value={0}>接口调用</Radio>
                <Radio value={1}>领取链接</Radio>
              </Radio.Group>
            </div>
            {
              pointsType === 1 ? <Input
                value={pointsLink}
                placeholder={'请输入领取链接'}
                style={{ width: '260px', marginLeft: '100px' }}
                onChange={(e) => { setPointsLink(e.target.value) }}
              /> : null
            }
          </div> : null
        }
        {
          menuItemKey === '3' ? <div className={style.prizeSet_right}>
            <div className={style.prizeSet_right_item}>
              <div>奖品名称</div>
              <Input
                value={inputValue}
                placeholder={'请输入'}
                onChange={onInputChange}
              />
            </div>
            <div className={style.prizeSet_right_item}>
              <div>现金红包金额</div>
              <Input
                value={amount}
                placeholder={'请输入'}
                onChange={onAmountChange}
              />
              <span style={{ marginLeft: '10px' }}>元</span>
            </div>
          </div> : null
        }
        {
          menuItemKey === '4' ? <div className={style.prizeSet_right}>
            <div className={style.prizeSet_right_item}>
              <div>实物名称</div>
              <Input
                value={inputValue}
                placeholder={'请输入'}
                onChange={onInputChange}
              />
            </div>
            <div className={style.prizeSet_right_item}>
              <div>单价</div>
              <Input
                value={amount}
                placeholder={'请输入'}
                onChange={onAmountChange}
              />
              <span style={{ marginLeft: '10px' }}>元</span>
            </div>
          </div> : null
        }
        {
          menuItemKey === '5' ? <div className={style.prizeSet_right}>
            <div className={style.prizeSet_right_item}>
              <div>谢谢参与</div>
              <Input
                value={inputValue}
                placeholder={'请输入谢谢参与提示文案'}
                onChange={onInputChange}
              />
            </div>
            <div className={style.prizeSet_right_item_text}>若用户抽中此项为未中奖！</div>
          </div> : null
        }
        {
          menuItemKey === '8' ? <div className={style.prizeSet_right}>
            <div className={style.extprize_box}>
              <p className={style.extprize_box_pn}><strong>奖品名称：</strong>
                <Input
                  value={extPrize.name}
                  placeholder={'请输入'}
                  onChange={(e) => { onextPrizeChange('name', e) }}
                  maxLength={30}
                  className={style.extprize_box_input}
                /></p>
              <p className={style.extprize_box_pn}><strong>单价：</strong>
                <InputNumber min={1} value={extPrize.num} onChange={(e) => { onextPrizeChange('num', e) }} className={style.extprize_box_input} />
                <em className={style.extprize_box_msg}>元</em>
              </p>
              <p className={style.extprize_box_pn}><strong>奖品链接：</strong>
                <Input
                  value={extPrize.link}
                  placeholder={'请输入领取链接'}
                  onChange={(e) => { onextPrizeChange('link', e) }}
                  maxLength={100}
                  className={style.extprize_box_input2}
                /></p>
            </div>
          </div> : null
        }
        {
          menuItemKey === '6' ? <div className={style.prizeSet_right}>
            <div className={style.prizeSet_right_center}>
              即将开放
            </div>
          </div> : null
        }
      </Row>
      {/*卡券有效期模态框*/}
      <Modal
        onOk={onTimeOk}
        closable={false}
        maskClosable={false}
        visible={timeVisible}
        onCancel={() => {
          setTimeVisible(false)
          setCardTimeRecord({})
        }}
      >
        <div>
          领取后
          <span style={{ margin: '0 6px' }}>
            <InputNumber
              min={0}
              parser={limitNumber}
              formatter={limitNumber}
              value={cardTimeRecord.effectiveDate}
              className={style.prizeSet_list_numInput}
              onChange={(value) => { onCardListChange(value, cardTimeRecord, 2) }}
            />
          </span>
          天有效
        </div>
        <div className={style.prizeSet_time_msg}>最多不超过{cardTimeRecord.serviceType ==2 ?cardTimeRecord.maxEffectiveDays : (cardTimeRecord.useValidDays && cardTimeRecord.useValidDays >= 0 ? cardTimeRecord.useValidDays : cardTimeRecord.maxEffectiveDays)}天</div>
      </Modal>
    </div>
  )
};
export default connect(({ activitySelectPrize }) => ({
  cardList: activitySelectPrize.cardList,
  pageTotal: activitySelectPrize.pageTotal,
  channelAuthority: activitySelectPrize.channelAuthority,
  couponCardbagList: activitySelectPrize.couponCardbagList,
  couponCardbagTotal: activitySelectPrize.couponCardbagTotal,
  cardbagIdList: activitySelectPrize.cardbagIdList,
}))(selectPrizePage)
