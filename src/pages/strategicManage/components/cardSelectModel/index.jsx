import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import { menu , Dropdown , Space , Form, Badge , Input, Modal, Table, Select, Button, message,ConfigProvider,Pagination} from "antd"
import style from "./style.less"
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { DownOutlined  } from '@ant-design/icons';
const cardSelectModel = (props) => {
  let { dispatch,cardSelectVisible,hideCardSelectModel,cardSelectOpenIndex,echoFirstStepData,openCardShowData,taskId } = props
  const [form] = Form.useForm();
  let [visible, setVisible] = useState(false),
      [cardList, setCardList] = useState([]),
      [paegConfig,setPageConfig] = useState({}),
      [selectCardData,setSelectCardData] = useState({
        cardBatch:'',
        selectedRows:[]
      }),
      [projectName,setProjectName] = useState(''),
      [pageInfo,setPageInfo] = useState({
        pageNum:1,
        pageSize:10,
        query:{cardPackageFlag:4, wanderTaskId: 0,objectId:'',grantName:''}
      })
  let [expandedRowKeys, setExpandedRowKeys ] = useState([])
  let [cardDetailList, setCardDetailList] = useState([])
  let [selectedRowKeys,setSelectedRowKeys] = useState([])
  let [selectedRows,setSelectedRows] = useState([])
 /*== 弹窗打开与关闭 ==*/
  useEffect(() => {
    if (cardSelectVisible) {
      pageInfo.query.objectId = echoFirstStepData.projectId_name?Number(echoFirstStepData.projectId_name.split('_')[0]):null
      setProjectName(echoFirstStepData.projectId_name?echoFirstStepData.projectId_name.split('_')[1]:null)
      setVisible(cardSelectVisible);
      pageInfo.query.wanderTaskId = taskId?taskId:0
      // 存在已选择的卡券回显
      if(openCardShowData.cardBatch){
        setExpandedRowKeys([openCardShowData.cardBatch])
        let couponNoArr = []
        openCardShowData.wanderStrategyCouponVOList.forEach(item=>{
          couponNoArr.push(item.couponNo)
        })
        setSelectedRowKeys(couponNoArr) 
        setSelectedRows(openCardShowData.wanderStrategyCouponVOList)
        setSelectCardData({
          cardBatch:openCardShowData.cardBatch,
          selectedRows:openCardShowData.wanderStrategyCouponVOList
        })
      }
    }else{
      setSelectedRowKeys([]) // 置空内置表格选择卡券
      setSelectedRows([])
      setExpandedRowKeys([])
    }
  }, [cardSelectVisible])
  // 编辑打开弹窗回显,重现选择下拉时不调用
  useEffect(()=>{
    if(expandedRowKeys.length>0){
      let cardDetail = {
        grantBatchId:selectCardData.cardBatch,
        cardPackageFlag:4,
        type:1
      }
      listGrantBatchDetail(cardDetail)
    }
  },[expandedRowKeys])
  /* 弹窗取消关闭 */
  let handleCancel = () => {
    setVisible(false)
    hideCardSelectModel()
  }
  /* 弹窗确认 */
  let handleOk = () => {
    if(selectCardData.selectedRows.length>0){
      setVisible(false)
      selectCardData.cardBatch = expandedRowKeys[0]?expandedRowKeys[0]:openCardShowData.cardBatch
      hideCardSelectModel(selectCardData,cardSelectOpenIndex)
    }else{
      message.warn('至少选择一个卡券')
    }
  }
  /* 去创建卡券 */
  let toCreateCard = () => {
    history.push({
      pathname: '/cardgrantManage/grantList/newDistribution',
    })
  }
 
/*== 列表数据获取 ==*/ 
  useEffect(()=>{
    if(cardSelectVisible){
      listGrantBatch()
    }
   },[pageInfo,cardSelectVisible])
/* 搜索 */
  let grantNameChange = (e) => {
    pageInfo.query.grantName = e.target.value
  }
/* 外层table表头数据 */
  const columns = [
    { title: '发放批次', dataIndex: 'cardBatch',key:'cardBatch', align: 'center'},
    { title: '批次名称', dataIndex: 'grantName',key:'grantName', align: 'center' },
    { title: '领取方式', dataIndex: 'cardPackageFlagName',key:'cardPackageFlagName',align: 'center' },
    { title: '卡券数量', dataIndex: 'couponNum', align: 'couponNum' },
  ];
/* 外层table数据 */
  let listGrantBatch = () => {
    dispatch({
      type: 'createStrategic/listWanderGrantBatch',//列表
      payload: {
        method: 'postJSON',
        params: pageInfo
      },
      callback:(res)=>{
        if(res.result.code==='0'){
          res.body.wanderGrantBatchListParamsList.forEach(item => {
            item.key = item.cardBatch
          });
          setCardList(res.body.wanderGrantBatchListParamsList)
          setPageConfig({
            pageNum: res.body.pageNum,
            pageSize: res.body.pageSize,
            totalCount: res.body.totalCount,
            totalPage: res.body.totalPage
          })
        }else{
          message.error(res.result.message)
        }
      }
    })
  }
  /* 获取内层数据 */
  let listGrantBatchDetail = (cardDetail) => {
    setCardDetailList([])
    dispatch({
      type: 'createStrategic/listWanderGrantBatchDetail',//列表
      payload: {
        method: 'postJSON',
        params: cardDetail
      },
      callback:(res)=>{
        if(res.result.code==='0'){
          res.body.forEach(item => {
            item.key = item.couponNo
          });
          setCardDetailList(res.body)
        }else{
          message.error(res.result.message)
        }
      }
    })
  }
  let onExpandChange = (expanded, record)=>{
    if(expanded){
      let cardDetail = {
        grantBatchId:record.cardBatch,
        cardPackageFlag:record.cardPackageFlag,
        type:1
      }
      setSelectCardData({
        cardBatch:record.cardBatch,
        selectedRows:[]
      })
      listGrantBatchDetail(cardDetail)
    }
  }

  /* 内层数据展开table */
  const expandedRowRender = () => {
    const columns = [
      { title: '卡券编号', dataIndex: 'couponNo', key: 'couponNo',align:'center' },
      { title: '卡券名称', dataIndex: 'skuCardName', key: 'skuCardName',align:'center'  },
      { title: '卡券品类', dataIndex: 'skuCardCategoryName', key: 'skuCardCategoryName',align:'center'  },
      { title: '面值', dataIndex: 'faceValue', key: 'faceValue',align:'center'  },
      { title: '默认有效期', dataIndex: 'effectiveDays', key: 'effectiveDays',align:'center',render:(text,all)=>{
        return <span>{text} 天</span>
      }},
      { title: '可否转增', dataIndex: 'isGive', key: 'isGive',align:'center', 
         render:(text, all) => text == 1 ? '否' : '是'}]

    return <Table columns={columns}  dataSource={cardDetailList} pagination={false} 
     rowSelection={{
      type: 'checkbox',
      ...rowSelection,
    }}/>;
  };

  /* 外层table单选展开对应的行 */
  let onExpandedRowsChange = (expandedRows)=> {
    let data = []
    if(expandedRows){
      data[0] = expandedRows[expandedRows.length-1]
    }
    if(data[0]){
      setSelectedRowKeys([]) // 置空内置表格选择卡券
      setSelectedRows([])
    }
    setExpandedRowKeys(data)
  }
  /* 内层table多选 */
 
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
      setSelectedRows(selectedRows)
      setSelectCardData({
        cardBatch:selectCardData.cardBatch,
        selectedRows:selectedRows
      })
    }
  };
   /* 外层列表分页切换 */
   const handleTableChange = (page,pageSize) => {
    pageInfo.pageNum = page
    pageInfo.pageSize = pageSize
    setPageInfo({...pageInfo})
  }
  /* 外层列表条数切换 */
  const onSizeChange = (page,pageSize) => {
    pageInfo.pageNum = page
    pageInfo.pageSize = pageSize
    setPageInfo({...pageInfo})
    onPageTotal()
  }
  /* 外层显示条数 */
  const onPageTotal = (total, range) => {
    return `共${paegConfig.totalCount?paegConfig.totalCount:0}条记录 第 ${paegConfig.pageNum?paegConfig.pageNum:1} / ${paegConfig.totalPage?paegConfig.totalPage:1}  页`
  }
  return (
    <>
      <Modal
        width={1100}
        title="选择卡券批次"
        maskClosable={false}
        visible={visible}
        onOk={handleOk} 
        onCancel={handleCancel}>
          <div className={style.search_content}>
            <span>营销项目：{projectName}</span>
            <span className={style.search_card}>批次名称：</span>
            <Input onChange={grantNameChange} allowClear placeholder="请输入投放批次名称"/>
            <Button type="primary" className={style.search_btn} onClick={listGrantBatch}>搜索</Button>
            <Button onClick={toCreateCard}>去创建投放批次</Button>
          </div>
          <Table
            className="components-table-demo-nested"
            columns={columns}
            expandable={{ expandedRowRender }}  // 引入展开table数据
            onExpandedRowsChange = {onExpandedRowsChange}  
            expandedRowKeys={expandedRowKeys}  //对应展开行的key
            onExpand={onExpandChange}  // 获取展开数据卡券
            dataSource={cardList}
            pagination={false}
            // defaultExpandedRowKeys={expandedRowKeys}
          />
          <ConfigProvider locale={zh_CN}>
            <Pagination
              className={style.pagination}
              showQuickJumper
              showTitle={false}
              current={paegConfig.pageNum}
              defaultPageSize={paegConfig.pageSize}
              total={paegConfig.totalCount}
              onChange={handleTableChange}
              showSizeChanger 
              pageSizeOptions={['10', '20', '30', '60']}
              onShowSizeChange={onSizeChange}
              showTotal={onPageTotal}
            />
          </ConfigProvider>
      </Modal>
    </>
  )
};
export default connect(({createStrategic }) => ({
  echoFirstStepData:createStrategic.echoFirstStepData
}))(cardSelectModel)
