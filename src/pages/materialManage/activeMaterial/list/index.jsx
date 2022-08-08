import React, { useEffect, useState } from "react"
import { Link, connect, history } from 'umi'

import { CaretDownOutlined } from '@ant-design/icons';
import {Popover,Modal, Space, Table, Button, message, Pagination, ConfigProvider, Checkbox ,Radio} from "antd"
import style from "./style.less"
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'  // 日期处理
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const activeMaterialList = (props) => {
  let { dispatch } = props,
    [list, setList] = useState([]), // 列表
    [pageTotal, setPageTotal] = useState(0), // 列表
    [pageSize, setPageSize] = useState(10),
    [pageNo, setPage] = useState(1),
    [payload, setPayload] = useState({
      categoryIds:[],
      channelId:'',
      marketActivityTypes:[],
      marketType:1,
      pageNo:1,
      pageSize:10,
      status:[]
    })
  
  useEffect(() => {
    getList()
  }, [pageNo, pageSize,payload])
  useEffect(() => {
    materialCategoryList()
  },[])

 
  /*列表表头数据*/
  let renderColumns = () => {
    return (
      [{
        title: '主题名称',
        dataIndex: 'themeName',  
        width: '100px', 
        align: 'center'
      }, 
       {
        title: '活动类型',
        dataIndex: 'marketActivityTypeStr',
        width: '100px', 
        align: 'center',
      },
      {
        title: '分类名称',
        dataIndex: 'categoryName',
        width: '120px',      
        align: 'center',  
      }, {
        title: '主题展示图',
        dataIndex: 'themeShowImg',
        width: '180px',
        align: 'center',
        render: (text, record) => {
          return <div>
            <img style={{width:'100px',height:'100px'}} src={text}/>
          </div> 
        }
      }, {
        title: '应用量',
        dataIndex: 'applyAmount',
        width: '120px', 
        align: 'center',
      }, {
        title: '创建时间',
        dataIndex: 'createTimeStr',
        width: '180px',
        align: 'center',
      },{
        title: '最后修改时间',
        dataIndex: 'updateTimeStr',
        width: '180px',
        align: 'center',
      },{
        title: '素材状态',
        dataIndex: 'status',
        width: '180px',
        align: 'center',
        render: (text, record) => {
          return <div>
            {text==1?<span className={style.status_1}>待上架</span>:null}
            {text==2?<span className={style.status_2}>展示中</span>:null}
            {text==3?<span className={style.status_3}>已下架</span>:null}
          </div> 
        }
      },,{
        title: '操作',
        width: '160px',
        align: 'center',
        fixed: 'right',
        render: (text, record) => {
          return <div>
            {record.status==1||record.status==3?<div>
              <span className={style.soso_box1_isopen} onClick={()=>{toListDetail('edit',record)}}>编辑</span>
              <span className={style.soso_box1_isopen} onClick={()=>{updateMaterialStatus(record,2)}}>上架</span>
              <span className={style.soso_box1_isopen} onClick={()=>{deleteMatrialList(record)}}>删除</span>
            </div>:<span className={style.soso_box1_isopen} onClick={()=>{updateMaterialStatus(record,3)}}>下架</span>}
          </div> 
        }}
      ]
    )
  }
  //活动数据
  let activtiyTypeArr = {
    1:{
      children:[{
        name:"大转盘",
        marketActivityType:1
      },{
        name:"直抽",
        marketActivityType:3
      },{
        name:"砸金蛋",
        marketActivityType:6
      },{
        name:"盲盒娃娃机",
        marketActivityType:5
      }]
    },
    2:{
      children:[{
        name:"秒杀专场",
        marketActivityType:2
      },{
        name:"优惠购",
        marketActivityType:4
      }]
    },
    3:{
      children:[{
        name:"趣味点点乐",
        marketActivityType:7
      }],
    },
    4:{
      children:[{
        name:"答题有奖",
        marketActivityType:8
      }]
    }
  }
 
  // 状态数据
  let statusList = [{
    label:'待上架',
    value:1,
  },{
    label:'已上架',
    value:2,
  },{
    label:'已下架',
    value:3,
  }]
  // 活动类型对应的styleCode数据
  let styleCode = {
    1:'turntablePage_material'
  }


   /*获取列表*/
   let getList = () => {
    dispatch({
      type: 'activeMaterialList/materialList',
      payload: {
        method: 'postJSON',
        params: payload
      },
      callback: (res) => {
        if (res.code === '0000') {
          setList(res.items.list)
          setPageTotal(res.items.total)
        } else {
          message.error(res.message)
        }
      }
    })
  }

  /* 跳转到详情页面 */ 
  let toListDetail = (type,record) => {  
    if(type=='edit') {
      history.push({
        pathname: '/materialManage/activeMaterial/list/newMaterial',
        query: {
          materialId:record.id,
          styleCode:styleCode[record.marketActivityType],
          marketType:record.marketType
        }
      })
    }else if(type=='add') {
      history.push({
        pathname: '/materialManage/activeMaterial/list/newMaterial',
        query: {
          marketType:payload.marketType
        }
      })
    }
  }
  /* 活动大类分类选择 */
  let marketTypeSelect=(e)=>{
    payload.marketType = e.target.value
    setPayload(JSON.parse(JSON.stringify(payload)))
  }
  /* 活动类型选择 */
  let [marketActivityCheckAll, setMarketActivityCheckAll] = useState(true) // 是否全选
  let [marketActivityTypeSelectList,setMarketActivityTypeSelectList] = useState([]) //选中列表
  let [marketActivityTypeSelectVisible, setMarketActivityTypeSelectVisible] = useState(false) //显示下拉选项
  let [isOperaActivity,setIsOperaActivity] = useState(false)
  // 全选选择
  let onChangeMarketActivity = (e) => {
    setIsOperaActivity(true)
    setMarketActivityCheckAll(true)
    payload.marketActivityTypes = []
    setMarketActivityTypeSelectList([])
  }
  //单选选择
  let marketActivityTypeSelect = (list) => {
    payload.marketActivityTypes = list
    setMarketActivityTypeSelectList(list)
    setIsOperaActivity(true)
    if(list.length==0){
      setMarketActivityCheckAll(true)
    }else{
      setMarketActivityCheckAll(false)
    }
  }
 // 打开下拉
 let marketActivityTypeSelectVisibleChange =(visible ) => {
  setMarketActivityTypeSelectVisible(visible)
  if(!visible && isOperaActivity){
    setPayload(JSON.parse(JSON.stringify(payload)))
    setIsOperaActivity(false)
  }
 }
 /* 分类名称选择 */
 //获取分类名称数据
 let [categoryList,setCategoryList] = useState([])
 let [categoryIdAllList,setCategoryIdAllList] = useState([])
 let materialCategoryList = ()=>{
    dispatch({
      type: 'activeMaterialList/materialCategoryList',
      payload: {
        method: 'postJSON',
        params: {
          pageNo:1,
          pageSize:100
        }
      },
      callback: (res) => {
        if (res.code === '0000') {
          setCategoryList(res.items.list)
          let categoryIdAllList = []
          res.items.list.forEach(item=>{
            categoryIdAllList.push(item.categoryId)
          })
          setCategoryIdAllList(categoryIdAllList)

        } else {
          message.error(res.message)
        }
      }
    })
 }
 let [categoryCheckAll, setCategoryCheckAll] = useState(true) // 是否全选
 let [categorySelectList,setCategorySelectList] = useState([]) //选中列表
 let [categoryVisible, setCategoryVisible] = useState(false)
 let [isOperaCategory,setIsOperaCategory] = useState(false)
 // 全选选择
 let onChangeCategoryCheckAll = (e) => {
   setCategoryCheckAll(true)
   setIsOperaCategory(true)
   payload.categoryIds = []
   setCategorySelectList([])
 }
 //单选选择
 let categorySelect = (list) => {
   payload.categoryIds = list
   setCategorySelectList(list)
   setIsOperaCategory(true)
   if(list.length==0){
    setCategoryCheckAll(true)
   }else {
    setCategoryCheckAll(false)
   }
 }
  // 打开下拉
  let categoryVisibleChange =(visible ) => {
    setCategoryVisible(visible)
    if(!visible&&isOperaCategory){
      setPayload(JSON.parse(JSON.stringify(payload)))
      setIsOperaCategory(false)
    }
  }
  /* 素材状态 */
  let allStatus = [1,2,3]
  let [statusCheckAll, setStatusCheckAll] = useState(true) // 是否全选
  let [statusSelectList,setStatusSelectList] = useState([]) //选中列表
  let [statusVisible, setStatusVisible] = useState(false)
  let [isOperaStatus, setIsOperaStatus] = useState(false)
  // 全选选择
  let onChangeStatusCheckAll = (e) => {
    setStatusCheckAll(true)
    setIsOperaStatus(true)
    payload.status = []
    setStatusSelectList([])
  }
  //单选选择
  let statusSelect = (list) => {
    payload.status = list
    setStatusSelectList(list)
    setIsOperaStatus(true)
    if(list.length==0){
      setStatusCheckAll(true)
    }else {
      setStatusCheckAll(false)
    }
  }
    // 打开下拉
    let statusVisibleChange =(visible ) => {
      setStatusVisible(visible)
      if(!visible&&isOperaStatus){
        setPayload(JSON.parse(JSON.stringify(payload)))
        setIsOperaStatus(false)
      }
    }
  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) => {
    payload.pageNo = page
    setPayload(payload)
    setPage(page)
    setPageSize(pageSize)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    payload.pageNo = page
    payload.pageSize = pageSize
    setPage(page)
    setPageSize(pageSize)
    setPayload(payload)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageSize)>0? Math.ceil(total / pageSize):1
    return `共${total}条记录 第 ${pageNo} / ${totalPage}  页`
  }
  /* 上架下架素材 */
  let [updateMaterialVisible,setUpdateMaterialVisible] = useState(false)
  let [recodeData,setRecordData] = useState({})
  let updateMaterialStatus = (record,status) => {
    setUpdateMaterialVisible(true)
    setRecordData({
      materialId:record.id,
      status:status
    })
  }
  let updateMaterialHandleOk = () => {
    dispatch({
      type: 'activeMaterialList/updateMaterialStatus',
      payload: {
        method: 'postJSON',
        params: recodeData
      },
      callback: (res) => {
        if(res.code=== '0000'){
          getList()
          setUpdateMaterialVisible(false)
        }else{
          message.error(res.message)
        }
      }})
  }
  let updateMaterialHandleCancel = () => {
    setUpdateMaterialVisible(false)
  }
  /* 删除素材 */
  let [deleteVisible,setDeleteVisible] = useState(false)
  let deleteMatrialList = (record,status) => {
    setDeleteVisible(true)
    setRecordData({
      materialId:record.id,
      status:status,
      marketActivityType:record.marketActivityType
    })
  }
  let deleteHandleOk = () => {
    dispatch({
      type: 'activeMaterialList/deleteMaterial',
      payload: {
        method: 'delete',
        params: {
          styleCode:styleCode[recodeData.marketActivityType],
          materialId:recodeData.materialId
        }
      },
      callback: (res) => {
        if(res.code=== '0000'){
          getList()
          setDeleteVisible(false)
        }else{
          message.error(res.message)
        }
      }})
  }
  let deleteHandleCancel = () => {
    setDeleteVisible(false)
  }

  return (
    <div>
      <div className={style.block__cont__t}>
        <Radio.Group buttonStyle="solid" size="large" style={{ margin: 24}}  value={payload.marketType}  onChange={(e)=>marketTypeSelect(e)}>
          <Space size={20}>
            <Radio.Button value={1}>活动抽奖</Radio.Button>
            <Radio.Button value={2}>商场促销</Radio.Button>
            <Radio.Button value={3}>互动游戏</Radio.Button>
            <Radio.Button value={4}>答题问卷</Radio.Button>
          </Space>
        </Radio.Group>
        <div className={style.block__header} style={{padding:'0 24px'}}>
          <Popover placement="bottom" 
              content={<div className={style.dropdown_list}>
                <div className={style.all_select}><Checkbox onChange={onChangeMarketActivity} checked={marketActivityCheckAll}>全部</Checkbox></div>
                <Checkbox.Group onChange={marketActivityTypeSelect} value={marketActivityTypeSelectList}>
                  <Space direction="vertical">
                    {activtiyTypeArr[payload.marketType].children.map((item=>{
                      return <Checkbox  value={item.marketActivityType}>{item.name}</Checkbox>
                    }))}
                  </Space>
                </Checkbox.Group>
                 </div>
                } 
                visible={marketActivityTypeSelectVisible}
                onVisibleChange={marketActivityTypeSelectVisibleChange}
                trigger="click">
            <span className={style.drop_btn}>活动类型 <CaretDownOutlined /></span>
          </Popover>
          <Popover placement="bottom"  
                content={<div className={style.dropdown_list}>
                <div className={style.all_select}><Checkbox onChange={onChangeCategoryCheckAll} checked={categoryCheckAll}>全部</Checkbox></div>
                <Checkbox.Group onChange={categorySelect} value={categorySelectList}>
                  <Space direction="vertical">
                    {categoryList.map((item=>{
                      return <Checkbox  value={item.categoryId}>{item.categoryName}</Checkbox>
                    }))}
                  </Space>
                </Checkbox.Group>
                 </div>
                } 
                visible={categoryVisible}
                onVisibleChange={categoryVisibleChange}
                trigger="click">
            <span className={style.drop_btn} style={{margin:'0 50px'}}>分类名称 <CaretDownOutlined /></span>
          </Popover>
          <Popover placement="bottom" 
              content={<div className={style.dropdown_list}>
                <div className={style.all_select}><Checkbox onChange={onChangeStatusCheckAll} checked={statusCheckAll}>全部</Checkbox></div>
                <Checkbox.Group onChange={statusSelect} value={statusSelectList}>
                  <Space direction="vertical">
                    {statusList.map((item=>{
                      return <Checkbox  value={item.value}>{item.label}</Checkbox>
                    }))}
                  </Space>
                </Checkbox.Group>
                </div>
                } 
              visible={statusVisible}
              onVisibleChange={statusVisibleChange}
              trigger="click">
              <span className={style.drop_btn}>素材状态  <CaretDownOutlined /></span>
            </Popover>
          <Button type="primary" className={style.add_new_theme} onClick={() => toListDetail('add')}>新建主题</Button>
        </div>
        <div className={style.table_part}>
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
          <ConfigProvider locale={zh_CN}>
            <Pagination
              className={style.pagination}
              showQuickJumper
              showTitle={false}
              current={payload.pageNo}
              defaultPageSize={payload.pageSize}
              total={pageTotal}
              onChange={onNextChange}
              showSizeChanger 
              pageSizeOptions={['10', '20', '30', '60']}
              onShowSizeChange={onSizeChange}
              showTotal={onPageTotal}
            />
          </ConfigProvider>
        </div>
      </div>
      {/* 上下架弹窗 */}
      <Modal title={recodeData.status==2?'上架素材':'下架素材'} visible={updateMaterialVisible} onOk={updateMaterialHandleOk} onCancel={updateMaterialHandleCancel}>
        <p>请确认是否{recodeData.status==2?'上架素材':'下架素材'}？</p>
      </Modal>
       {/* 删除素材 */}
       <Modal title='删除' visible={deleteVisible} onOk={deleteHandleOk} onCancel={deleteHandleCancel}>
        <p>请确认是否删除素材？</p>
      </Modal>
    </div>
  )
};
export default connect(({ activeMaterialList }) => ({
  activtiyTypeArr: activeMaterialList.activtiyTypeArr
}))(activeMaterialList)
