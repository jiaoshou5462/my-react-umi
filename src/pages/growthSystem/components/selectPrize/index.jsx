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
  Divider,
  Tooltip,
  Pagination,
  InputNumber,
  ConfigProvider
} from "antd"
import style from './style.less'
import moment from 'moment'
import 'moment/locale/zh-cn'
import zh_CN from "antd/lib/locale-provider/zh_CN";
import { InfoCircleOutlined, FormOutlined } from "@ant-design/icons";
moment.locale('zh-cn')

const selectPrizePage = (props) => {
  let { dispatch, onOk, pageTotal, cardList, activityType, channelAuthority } = props
  let [activityData, setActivityData] = useState(JSON.parse(localStorage.getItem('tokenObj')))  //活动信息
  let [list, setList] = useState([])  //侧边栏数据
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
    })
  useEffect(() => {
    setCardKeyList([])
    setCardPrizeList([])
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
      item.effectiveDate = item.defaultEffectiveDays
    })
    setList(temp)
  }, [cardList])
  useEffect(() => {
    let menuItemArr = [{
      title: '卡券',
      type: '1'
    }, {
      title: '积分',
      type: '6'
    }, {
      title: '成长值',
      type: '7'
    }, {
      title: '现金',
      type: '3'
    }, {
      title: '实物',
      type: '4'
    }, {
      title: '海贝积分',
      type: '2'
    }
      // , {
      //   title: '不中奖',
      //   type: '5'
      // }
    ]
    {/*activityType: 1 任务*/ }
    if (activityType === '1') {
      /*秒杀 隐藏其他*/
      menuItemArr.splice(0, 1);
      menuItemArr.splice(2, 2);
      setOpenKeys([...["6"]]);
      setMenuItemKey("6");
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
      type: 'selectPrize/getCouponList',
      payload: {
        method: 'postJSON',
        params: payload,
      }
    })
  }
  /*获取当前活动的 渠道权限*/
  let getChannelAuthority = () => {
    dispatch({
      type: 'selectPrize/getChannelAuthority',
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
  }, [amount, inputValue, menuItemKey, pointsType, pointsLink])
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
      title: () => {
        return <div>
          数量（张）
          <Tooltip title="单套奖品所包含对应卡券的数量">
            <InfoCircleOutlined className={style.wrap2_ico} />
          </Tooltip>
        </div>
      },
      dataIndex: 'couponNum',
      render: (couponNum, record) => renderNum(couponNum, record)
    }, {
      title: '有效期',
      dataIndex: 'effectiveDate',
      render: (effectiveDate, record) => renderTime(effectiveDate, record)
    }, {
      title: '可否转增',
      dataIndex: 'shareFlag',
      render: (shareFlag, record) => renderGiving(shareFlag, record)
    }
  ]
  /*数量组件*/
  let renderNum = (couponNum, record) => {
    return <div>
      <InputNumber
        min={0}
        value={couponNum}
        parser={limitNumber}
        formatter={limitNumber}
        className={style.prizeSet_list_numInput}
        onChange={(value) => { onCardListChange(value, record, 1) }}
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
    if (cardTimeRecord.effectiveDate > cardTimeRecord.maxEffectiveDays) {
      promptBox('有效期不能大于最大有效期！')
      return
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
  let renderGiving = (shareFlag, record) => {
    let onChange = (e) => {
      onCardListChange(e ? 2 : 1, record, 3)
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
  /*侧边栏选中事件*/
  let onOpenChange = (e) => {
    if (e.key === '1') {
      setList(cardList)
    } else {
      setList([])
      setCardKeyList([])
      setCardPrizeList([])
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
      temp.type = menuItemKey;
      temp.prizeName = takeInfo.integral;
      tempData = temp;
    }
    if (menuItemKey === '7') {
      let temp = { ...tempObj }
      temp.type = menuItemKey;
      temp.prizeName = takeInfo.growth;
      tempData = temp;
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
  //积分&成长值
  let [takeInfo, setTakeInfo] = useState({
    integral: null,
    growth: null
  });
  let changeTake = (name, e) => {
    let toTakeInfo = takeInfo;
    toTakeInfo[name] = e;
    setTakeInfo({ ...toTakeInfo });
    onPrizeChange()
  }
  return (
    <div>
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
                rowSelection={{ ...rowSelection }}
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
          menuItemKey === '6' ? <div className={style.prizeSet_right}>
            <div className={style.prizeSet_wrap_centent}>
              <strong>奖励：</strong><InputNumber min={1} className={style.prizeSet_wrap_cn} value={takeInfo.integral} onChange={(e) => { changeTake('integral', e) }} /> <i>积分</i>
            </div>
          </div> : null
        }
        {
          menuItemKey === '7' ? <div className={style.prizeSet_right}>
            <div className={style.prizeSet_wrap_centent}>
              <strong>奖励：</strong><InputNumber min={1} className={style.prizeSet_wrap_cn} value={takeInfo.growth} onChange={(e) => { changeTake('growth', e) }} /> <i>成长值</i>
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
        <div className={style.prizeSet_time_msg}>最多不超过{cardTimeRecord.maxEffectiveDays}天</div>
      </Modal>
    </div>
  )
};
export default connect(({ selectPrize }) => ({
  cardList: selectPrize.cardList,
  pageTotal: selectPrize.pageTotal,
  channelAuthority: selectPrize.channelAuthority,
}))(selectPrizePage)
