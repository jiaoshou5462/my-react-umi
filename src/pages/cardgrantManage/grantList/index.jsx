import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Tag, Row, Col, Form, Space, Radio, DatePicker, Divider, Popconfirm, Modal, Input, Table, Select, Button, Pagination, ConfigProvider, message, Badge, Menu, Descriptions, Alert } from "antd"
import style from "./style.less";
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { fmoney } from '@/utils/date'
import CompAuthControl from '@/components/Authorized/CompAuthControl'
import DetailModal from './modal/detailModal';
import EffectModal from './modal/effectModal';
import RecordModal from './modal/recordModal';
import VerifyCodeModal from './modal/verifyCodeModal';
import { QueryFilter} from '@ant-design/pro-form';
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";
const { Column } = Table;
const { Option } = Select;
const { RangePicker } = DatePicker;


const grantListPage = (props) => {
  let { dispatch, isRadioTabs, channelList, categoryList, moneyQuato, grantData, selsctMarketingItems, } = props;

  let [form] = Form.useForm();
  let [grantBatchId, setGrantBatchId] = useState('');//批次号
  let [grantName, setGrantName] = useState('')//发放名称
  let [cardPackageFlag, setCardPackageFlag] = useState(null);//0卡券，1卡包,2兑换码
  let [receiveCount, setReceiveCount] = useState(null);//领取人数
  let [currentInfo, setCurrentInfo] = useState({});//点击的当前数据

  // 子列表弹框
  const [sonListVisible, setSonListVisible] = useState(false);

  // 生效弹框
  const [isEffectModalVisible, setIsEffectModalVisible] = useState(false);
  let [effectInfo, setEffectInfo] = useState({});//点击生效当前数据
  const [callList, setCallList] = useState(false);

  // 发放记录弹框
  const [isRecordModalVisible, setIsRecordModalVisible] = useState(false);
  // 兑换码弹框
  const [isVerifyCodeModalVisible, setIsVerifyCodeModalVisible] = useState(false);
  // 撤回弹框
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);

  // 删除弹框
  const [isDelVisible, setIsDelVisible] = useState(false);
  // 失效弹框
  const [isInvalidModalVisible, setIsInvalidModalVisible] = useState(false);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [payload, setPayload] = useState({});

  //modal回调
  const callModal = (flag) => {
    setEffectInfo({})
    if (flag) {
      setCallList(!callList)
    }
  }

  let changeTabs = (e) => {
    dispatch({
      type: 'cardgrantManageModel/setRadioTabs',//tabs切换
      payload: e.target.value
    })
  }

  useEffect(() => {
    // selectChannel()
    selectcategory()
    selsctAllMarketing()
  }, [])

  useEffect(() => {
    listGrant()
    compQuato()
  }, [current, pageSize, payload, callList])
  //渠道下拉
  // let selectChannel = () => {
  //   dispatch({
  //     type: 'cardgrantManageModel/selectChannel',
  //     payload: {
  //       method: 'postJSON',
  //       params: {}
  //     }
  //   })
  // }
  //品类下拉
  let selectcategory = () => {
    dispatch({
      type: 'cardgrantManageModel/categorySelect',
      payload: {
        method: 'postJSON',
        params: {
          pageNum: 1,
          pageSize: 99999999
        }
      }
    })
  }
  // 营销活动
  let selsctAllMarketing = () => {
    dispatch({
      type: 'cardgrantManageModel/selsctAllMarketing',
      payload: {
        method: 'postJSON',
        params: {
          type: 1,
          status: 1
        }
      }
    })
  }
  // 额度
  let compQuato = () => {
    dispatch({
      type: 'cardgrantManageModel/compQuato',
      payload: {
        method: 'postJSON',
        params: {}
      }
    })
  }

  //列表
  let listGrant = () => {
    let newPayload = JSON.parse(JSON.stringify(payload));
    //发放时间
    if (newPayload.grantDate) {
      newPayload.grantStartDate = moment(newPayload.grantDate[0]).format('YYYY-MM-DD')
      newPayload.grantEndDate = moment(newPayload.grantDate[1]).format('YYYY-MM-DD')
    }
    dispatch({
      type: 'cardgrantManageModel/listGrant',
      payload: {
        method: 'postJSON',
        params: {
          pageNum: current,
          pageSize: pageSize,
          query: newPayload
        }
      }
    })
  }

  // 新增发放
  let newDistribution = () => {
    if (moneyQuato) {
      history.push({
        pathname: '/cardgrantManage/grantList/newDistribution',
        // query: {
        //   listOccupyQuoat: moneyQuato.allQuoat - moneyQuato.useQuoat - moneyQuato.occupyQuoat
        // }
      })
    } else {
      message.error({ content: '额度为空不能新增！' })
    }
  }


  // 点击详情
  const grantDetail = (text, all) => {
    return <a onClick={() => { sonList(text, all) }}>{text}</a>
  }

  // 卡券投放展开子列表
  let sonList = (text, all) => {
    setSonListVisible(true);
    setGrantBatchId(text)
    setCardPackageFlag(all.cardPackageFlag);

    setCurrentInfo(all);

  }

  //7编辑
  let editGrant = (text, all) => {
    history.push({
      pathname: '/cardgrantManage/grantList/editDistribution',
      query: {
        grantBatchId: all.grantBatchId,
        cardPackageFlag: all.cardPackageFlag
      }
    })
  }

  // 1点击生效
  let handelEffect = (text, all) => {
    setIsEffectModalVisible(true);
    setEffectInfo(all);
  }

  // 2点击发放记录
  let releaseRecord = (text, all) => {
    setCardPackageFlag(all.cardPackageFlag)
    setGrantName(all.grantName)
    setReceiveCount(all.receiveCount - all.grantNum)//领取人数-发放人数>=0不展示撤回发放
    setGrantBatchId(all.grantBatchId)//设置grantBatchId

    setIsRecordModalVisible(true);
    setCurrentInfo(all);

  }

  // 3.查看兑换码
  let lookVerifyCode = (text, all) => {
    setIsVerifyCodeModalVisible(true)
    setCurrentInfo(all);
  }

  // 4撤回
  let [withdrawMsg, setWithdrawMsg] = useState('')//撤回文案
  // 点击撤回
  const handelWithdraw = (text, all) => {
    setGrantBatchId(all.grantBatchId)
    setCardPackageFlag(all.cardPackageFlag);
    dispatch({
      type: 'cardgrantManageModel/getConfirmWithdraw',//撤回文案
      payload: {
        method: 'postJSON',
        params: {
          cardPackageFlag: all.cardPackageFlag,
          channelId: all.channelId,
          grantBatchId: all.grantBatchId,
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {
          setWithdrawMsg(res.body.msg)
          setIsWithdrawModalVisible(true);
        } else {
          message.error({ content: res.result.message })
        }
      }
    })
  }
  // 确认撤回
  const handleWithdrawOk = () => {
    dispatch({
      type: 'cardgrantManageModel/toWithdraw',//撤回发放
      payload: {
        method: 'postJSON',
        params: {
          grantBatchId: grantBatchId,
          cardPackageFlag: cardPackageFlag
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {
          setIsWithdrawModalVisible(false);
          message.success({ content: res.result.message })
          listGrant();
        } else {
          message.error({ content: res.result.message })
        }
      }
    })
  }

  // 5复制
  let copyGrant = (text, all) => {
    dispatch({
      type: 'cardgrantManageModel/getGrantCopy',//复制批次
      payload: {
        method: 'postJSON',
        params: {},
        grantBatchId: all.grantBatchId,
      },
      callback: (res) => {
        if (res.result.code == '0') {
          message.success({ content: '复制成功！' })
          listGrant();
        } else {
          message.error({ content: res.result.message })
        }
      }
    })
  }


  // 6点击删除
  let handelDel = (text, all) => {
    setIsDelVisible(true);
    setGrantBatchId(all.grantBatchId)
  }
  // 确认删除
  let delGrant = () => {
    dispatch({
      type: 'cardgrantManageModel/getGrantDelete',//删除
      payload: {
        method: 'postJSON',
        params: {},
        grantBatchId: grantBatchId
      },
      callback: (res) => {
        if (res.result.code == '0') {
          message.success({ content: '删除成功！' })
          setIsDelVisible(false);
          listGrant();
        } else {
          message.error({ content: res.result.message })
        }
      }
    })
  }

  // 7点击失效
  let handelInvalid = (text, all) => {
    setIsInvalidModalVisible(true)
    setGrantBatchId(all.grantBatchId)
  }
  // 确认失效
  const handleInvalidOk = () => {
    dispatch({
      type: 'cardgrantManageModel/getGrantInvalid',//失效
      payload: {
        method: 'postJSON',
        params: {},
        grantBatchId: grantBatchId
      },
      callback: (res) => {
        if (res.result.code == '0') {
          message.success({ content: '失效成功！' })
          setIsInvalidModalVisible(false);
          listGrant();
        } else {
          message.error({ content: res.result.message })
        }
      }
    })
  }



  // 导出失败名单
  let exportFailNameList = () => {
    // 2有值调download文件下载,无值调导出名单接口
    if (errorListExcel) {
      fileDownload(2)
    } else {
      dispatch({
        type: 'cardgrantManageModel/nameListExcel',//导出失败名单
        payload: {
          method: 'postJSON',
          params: {
            grantBatchId: grantBatchId,
            status: 3//全部名单1000，失败：3
          }
        },
        callback: (res) => {
          if (res.result.code == '0') {
            message.warning({ content: res.body })
            reRecord()
          } else {
            message.error({ content: res.result.message })
          }
        }
      })
    }
  }

  // 有值文件下载
  let fileDownload = (type) => {
    dispatch({
      type: 'cardgrantManageModel/fileDownload',//下载文件
      payload: {
        method: 'get',
        params: {},
        fileCode: type == 1 && fullListExcel ? fullListExcel : type == 2 && errorListExcel ? errorListExcel : '',
        responseType: 'blob'
      },
      callback: (res) => {
        if (res) {
          const url = window.URL.createObjectURL(new Blob([res], { type: "application/json" }))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          if (type == 1) {
            link.setAttribute('download', grantBatchId + '批次发放详情.xls')
          } else {
            link.setAttribute('download', grantBatchId + '批次发放失败详情.xls')
          }
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    })
  }

  // 空值再调发放记录
  let reRecord = () => {
    dispatch({
      type: 'cardgrantManageModel/queryGrantRecord',//发放记录
      payload: {
        method: 'postJSON',
        params: {},
        grantBatchId: grantBatchId
      },
      callback: (res) => {
        setFullListExcel(res.body.fullListExcel)
        setErrorListExcel(res.body.errorListExcel)
      }
    })
  }


  //表单查询
  const searchBtn = (val) => {
    setCurrent(1);
    setPayload(JSON.parse(JSON.stringify(val)))
  }

  //表单重置
  const resetBtnEvent = () => {
    form.resetFields();
    setPayload({})
  }
  //分页切换
  const handleTableChange = (page, pageSize) => {
    setCurrent(page)
    setPageSize(pageSize)
  }



  return (
    <>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtn} onReset={resetBtnEvent}>
          <Form.Item label="批次名称：" name="grantName" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="营销项目：" name="objectId" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="请选择" showSearch allowClear optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }>
              {selsctMarketingItems && selsctMarketingItems.map((v) => {
                return <Option value={v.objectId}>{v.marketProjectName}</Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item label="投放类型：" name="cardPackageFlag" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="请选择">
              <Option value={0}>卡券投放</Option>
              <Option value={1}>卡包投放</Option>
              <Option value={2}>兑换码投放</Option>
              <Option value={3}>N选M投放</Option>
              <Option value={4}>接口投放</Option>
            </Select>
          </Form.Item>
          <Form.Item label="卡券名称：" name="skuCardName" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="卡券品类：" name="skuCardCategory" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="请选择" allowClear>
              {categoryList && categoryList.map((v) => {
                return <Option value={v.id}>{v.categoryName}</Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item label="发放时间：" name="grantDate" labelCol={{flex: '0 0 120px'}}>
            <RangePicker placeholder={['开始时间','结束时间']} format="YYYY-MM-DD" />
          </Form.Item>
        </QueryFilter>
      </div>
      <div className={style.list_box}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
            <CompAuthControl compCode="cardgrantManage_grantList_newDistribution">
              <Button type="primary" onClick={newDistribution}>新增直投发放</Button>
            </CompAuthControl>
          </Space>
        </ListTitle>
        <ListTable showPagination current={current} pageSize={pageSize} total={grantData && grantData.totalCount}
          onChange={handleTableChange}>
          <Table dataSource={grantData && grantData.dataList} scroll={{x:1950}} pagination={false}>
            <Column title="发放批次" dataIndex="grantBatchId" key="grantBatchId" fixed='left' width={200}
            render={(text, all) => grantDetail(text, all)}
            />
            <Column title="批次名称" dataIndex="grantName" key="grantName"/>
            <Column title="营销项目" dataIndex="marketingProjectName" key="marketingProjectName"/>
            <Column title="投放类型" dataIndex="cardPackageFlagName" key="cardPackageFlagName"
              render={(text, all) => (
                <TypeTags color={
                  all.cardPackageFlag == 0 ? '#2FB6E4' :
                  all.cardPackageFlag == 1 ? '#32D1AD' :
                  all.cardPackageFlag == 2 ? '#28CB6B' :
                  all.cardPackageFlag == 3 ? '#7545A7' :'#FF4A1A' 
                }>{text}</TypeTags>
              )}/>
            <Column title="领取方式" dataIndex="cardReceiveTypeName" key="cardReceiveTypeName"/>
            <Column title="发放人群" dataIndex="grantGroupName" key="grantGroupName" render={(grantGroupName,all)=><>{grantGroupName == "--" ? "-" :grantGroupName}</>}/>
            <Column title="批次状态" dataIndex="grantBatchStatusName" key="grantBatchStatusName"
            render={(text, all) => (
              <StateBadge status={
                all.grantBatchStatus == 1 ? 'warning' :
                all.grantBatchStatus == 2 ? 'success' : 'error' }
              >{text}</StateBadge>
            )}/>
            <Column title="状态" dataIndex="statusName" key="statusName" 
            render={(text, all)=>(<>
              <StateBadge status={
                all.status == 1 ? 'error' :
                all.status == 2 ? 'warning' :
                all.status == 3 ? 'success' :
                all.status == 4 ? 'processing' : 'default'}
              >{text}</StateBadge>
            </>)}/>
            <Column title="发放时间" dataIndex="grantDate" key="grantDate"
              render={(text, all) => <ListTableTime>{text}</ListTableTime>}/>
            <Column title="操作人" dataIndex="createUser" key="createUser"/>
            <Column title="操作" fixed="right" dataIndex="operation" key="operation" width={280}
            render={(text, all)=>(<>
              <ListTableBtns showNum={3}>
                {all.grantBatchStatus == 1 ? 
                <>
                  {
                    all.status == 2 ?
                      <CompAuthControl compCode="cardgrantManage_grantList_grantRecord">
                        <LtbItem onClick={() => { releaseRecord(text, all) }}> 发放记录</LtbItem>
                      </CompAuthControl>
                      :
                      <>
                        <CompAuthControl compCode="cardgrantManage_grantList_grantEffect">
                          <LtbItem onClick={() => { handelEffect(text, all) }}>生效</LtbItem>
                        </CompAuthControl>
                        <CompAuthControl compCode="cardgrantManage_grantList_grantEdit">
                          <LtbItem onClick={() => { editGrant(text, all) }}>编辑</LtbItem>
                        </CompAuthControl>
                        <CompAuthControl compCode="cardgrantManage_grantList_grantDel">
                          <LtbItem onClick={() => { handelDel(text, all) }}>删除</LtbItem>
                        </CompAuthControl>
                      </>
                  }
                </> : null}
              {all.grantBatchStatus == 2 ?
              <>
              {
                all.status == 2 || all.status == 6 ? '' :
                  <CompAuthControl compCode="cardgrantManage_grantList_grantWithdraw">
                    <LtbItem onClick={() => { handelWithdraw(text, all) }}>撤回</LtbItem>
                  </CompAuthControl>
              }
              {
                all.cardPackageFlag == 4 ?
                  <CompAuthControl compCode="cardgrantManage_grantList_grantInvalid">
                    <LtbItem onClick={() => { handelInvalid(text, all) }}>失效</LtbItem>
                  </CompAuthControl>
                  : ''
              }
              <CompAuthControl compCode="cardgrantManage_grantList_grantRecord">
                <LtbItem onClick={() => { releaseRecord(text, all) }}>发放记录</LtbItem>
              </CompAuthControl>
              {
                all.cardPackageFlag == 2 && all.status != 2 ?
                  <>
                    <CompAuthControl compCode="cardgrantManage_grantList_grantCopy">
                      <LtbItem onClick={() => { copyGrant(text, all) }}>复制</LtbItem>
                    </CompAuthControl>
                    <CompAuthControl compCode="cardgrantManage_grantList_grantLookCode">
                      <LtbItem onClick={() => { lookVerifyCode(text, all) }}>查看兑换码</LtbItem>
                    </CompAuthControl>
                  </>
                  : ''
              }
            </>: null}
            {all.grantBatchStatus == 3 ?
              <CompAuthControl compCode="cardgrantManage_grantList_grantRecord">
                <LtbItem onClick={() => { releaseRecord(text, all) }}> 发放记录</LtbItem>
              </CompAuthControl>
              : null}
              </ListTableBtns> 
              </>
            )}/>
          </Table>
        </ListTable>
      </div>
        {/* 隐藏 */}
        {/* <Alert
              showIcon
              type="info"
              style={{ marginBottom: '30px' }}
              message={'当前周期投放额度：' + (moneyQuato ? fmoney(moneyQuato.useQuoat + moneyQuato.occupyQuoat) : 0) + '/' + (moneyQuato ? fmoney(moneyQuato.allQuoat) : 0) + '元'}
            /> */}
        {/* <Button style={{ margin: '10px' }} htmlType="button" type="primary">批次发放</Button>
            <Button style={{ margin: '10px' }} htmlType="button">规则发放</Button>  */}
      {/* 1批次查看详情弹框 */}
      {
        sonListVisible ?
          <DetailModal sonListVisible={sonListVisible}
            currentInfo={currentInfo}
            closeModal={() => { setSonListVisible(false) }}
          />
          : ''
      }

      {/* 2生效弹框 */}
      {
        isEffectModalVisible ?
          <EffectModal isEffectModalVisible={isEffectModalVisible}
            effectInfo={effectInfo}
            toFatherValue={(flag) => callModal(flag)}
            closeModal={() => { setIsEffectModalVisible(false) }}
          /> : ''
      }

      {/* 3发放记录弹框 */}
      {
        isRecordModalVisible ?
          <RecordModal isRecordModalVisible={isRecordModalVisible}
            currentInfo={currentInfo}
            toFatherValue={(flag) => callModal(flag)}
            closeModal={() => { setIsRecordModalVisible(false) }}
          />
          : ''
      }

      {/* 查看兑换码 */}
      {
        isVerifyCodeModalVisible ?
          <VerifyCodeModal isVerifyCodeModalVisible={isVerifyCodeModalVisible}
            currentInfo={currentInfo}
            closeModal={() => { setIsVerifyCodeModalVisible(false) }}
          />
          : ''
      }

      <Modal title="撤回" visible={isWithdrawModalVisible} onOk={handleWithdrawOk} onCancel={() => { setIsWithdrawModalVisible(false) }}>
        <p>{withdrawMsg}</p>
      </Modal>
      <Modal title="删除" visible={isDelVisible} onOk={delGrant} onCancel={() => { setIsDelVisible(false) }}>
        <p>确定删除该批次吗？</p>
      </Modal>
      <Modal title="失效" visible={isInvalidModalVisible} onOk={handleInvalidOk} onCancel={() => { setIsInvalidModalVisible(false) }}>
        <p>设为失效将无法使用接口发券，确定设为失效状态吗？</p>
      </Modal>
    </>
  )
}

export default connect(({ cardgrantManageModel }) => ({
  isRadioTabs: cardgrantManageModel.isRadioTabs,//tabs切换
  channelList: cardgrantManageModel.channelList,//命名空间名.变量
  categoryList: cardgrantManageModel.categoryList,//卡券品类
  moneyQuato: cardgrantManageModel.moneyQuato,//额度
  grantData: cardgrantManageModel.grantData,//投放数据
  selsctMarketingItems: cardgrantManageModel.selsctMarketingItems,//营销项目
}))(grantListPage)