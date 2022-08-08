import React, { useEffect, useState } from "react"
import { Link, connect, history } from 'umi'
import {
  Form,
  Space,
  Input,
  Modal,
  Table,
  Select,
  Button,
  message,
  DatePicker
} from "antd"
import {
  LtbItem,
  ListTitle,
  ListTable,
  StateBadge,
  TextEllipsis,
  ListTableTime,
  ListTableBtns
} from "@/components/commonComp/index"
import style from "./style.less"
const { Option } = Select
const { RangePicker } = DatePicker
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'  // 日期处理
import 'moment/locale/zh-cn'
import { QueryFilter} from '@ant-design/pro-form';
import { EditOutlined, DeleteOutlined ,ArrowUpOutlined} from '@ant-design/icons'
import NewArticleModel from '../components/newArticleModel'
moment.locale('zh-cn')

const articleManagePage = (props) => {
  let tokenObj=JSON.parse(localStorage.getItem('tokenObj'));
  let { dispatch, allCategoryList} = props,
      [form] = Form.useForm(),
      [list, setList] = useState([]), // 列表
      [pageTotal, setPageTotal] = useState(0), // 列表
      [pageSize, setPageSize] = useState(10),
      [pageNo, setPage] = useState(1),
      [allCategory,setAllCategory ] = useState([]),
      [selectedRowKeys, setSelectedRowKeys] = useState([]),
      [articleId,setArticleId] = useState(''),
      [isShowAddCategory,setIsShowAddCategory] = useState(false),
      [categoryData,setCategoryData] = useState({}),
      [newArticleVisible, setNewArticleVisible] = useState(false),
      [objectId,setObjectId] = useState(''),
      [payload, setPayload] = useState({
        channelId:tokenObj.channelId,
        categoryId: '', // 品类Id
        sortName: "releaseTime",  //固定传递asc
        sortOrder: "asc",  //固定传递asc
        articleTitle:'', // 文章标题
        articleStatus:'' , // 0 停用  1启用
        startDate:'',   //开始时间
        endDate:'' ,    //结束时间
        relationTime:[],
        pageInfo: {
          pageNo: 1,
          pageSize: 10,
          totalCount:0
        }
      })

   /*列表表头数据*/
   let renderColumns = () => {
    return (
      [{
        title: '文章ID',
        dataIndex: 'objectId',
        width: 70,
      },
       {
        title: '标题',
        dataIndex: 'articleTitle',
        width: 150,
        render: (text, record) => {
          return <>
              <span>{text}</span>
              {record.isTop?<img className={style.isTop_icon} src="https://dev.yltapi.com/uniway/static/image/isTop_icon.png"></img>:null}
          </>
        }
      },
      {
        title: '分类',
        dataIndex: 'categoryNames',
        width: 150,
        render: (categoryNames) => {
          return <TextEllipsis>{categoryNames}</TextEllipsis>
        }
      }, {
        title: '排序',
        dataIndex: 'orderNo',
        width: 60,
      }, {
        title: '规则',
        dataIndex: 'articleStatus',
        width: 80,
        render: (text) => {
          return <>
            {
              text == 1 ? <StateBadge status="success">启用</StateBadge>
                  : <StateBadge color='#ccc'>停用</StateBadge>
            }
          </>
        }
      }, {
        title: '状态',
        dataIndex: 'isShow',
        width: 100,
        render:(text) => {
          return <>
            <StateBadge status={text == '显示' ? 'success' : ''} color={text == '显示' ? '' : '#ccc'}>
              {text}
            </StateBadge>
         </>
        }
      },{
        title: '生效期限',
        dataIndex: 'effectiveDate',
        width: 150,
        render:(text, record) => {
          return <ListTableTime>{record.isPermanent == 1 ? '永久' : text }</ListTableTime>
        }
      },{
        title: '发布时间',
        dataIndex: 'releaseTime',
        width: 150,
        render:(releaseTime) => {
          return <ListTableTime>{releaseTime}</ListTableTime>
        }
      },{
        title: '操作',
        fixed: 'right',
        width: 180,
        render: (text, record) => operateRender(record)
      }
      ]
    )
  }
  let operateRender = (record) => {
     return <ListTableBtns showNum={3}>
       <LtbItem onClick={()=>{articleStatusChange(record)}}>
         {record.articleStatus ===1 ? '停用' : '启用'}
       </LtbItem>
       <LtbItem onClick={()=>{cancelArticleTop(record)}}>
         {record.isTop !==1 ? '设为置顶' : '取消置顶'}
       </LtbItem>
       <LtbItem onClick={()=>{addNewArticle(record)}}>编辑</LtbItem>
       {
         record.articleStatus==0 && record.isShow=='不显示' ?
           <LtbItem className={style.soso_box1_isopen} onClick={()=>{delArticle(record)}}>删除</LtbItem>
             : null
       }
     </ListTableBtns>
  }
  /*回调*/
  useEffect(() => {
    payload.relationTime = []
    form.setFieldsValue(payload)
    customerChannelList(tokenObj.channelId);
    queryAllCategory()
  },[])

  /* 文章保存之后，保持原来分类的激活状态 */
  useEffect(()=>{
    allCategoryList.forEach(item=>{
       if(item.objectId === objectId) {
         item.isActive = true
       }
    })
    setAllCategory(allCategoryList)
  },[allCategoryList])

  useEffect(() => {
    getList()
  }, [pageNo, pageSize,payload,objectId])

  /* 获取渠道列表 */
  let customerChannelList = (channelId) => {
    dispatch({
      type: 'articleManage/customerChannelList',
      payload: {
        method:'get',
        params: {
          channelId:channelId,
        }
      }
    })
  }
 /* 打开新建文章 */
 let addNewArticle = (record) =>{
    setNewArticleVisible(true)
    setArticleId(record.objectId)
 }
 /* 隐藏新建文章 */
  let hideAddNewArticle = (type) =>{
    if(type=='save') {
      getList()
      queryAllCategory()
    }
    setNewArticleVisible(false)
  }
  /* 获取全部分类 */
  let queryAllCategory = () =>  {
    dispatch({
      type: 'articleManage/queryAllCategory',
      payload: {
        method: 'postJSON',
        params: {}
      }
    })
  }
  /* 添加、更改分类名称 */
  let changeCategoryName = (e) => {
    setCategoryData({
      categoryName:e.target.value,
      objectId:categoryData.objectId?categoryData.objectId:''
   })
  }
  /* 修改分类名称 */
  let editCategory = (item)=>{
    setCategoryData({
      categoryName:item.categoryName,
      objectId:item.objectId?item.objectId:''
    })
    setIsShowAddCategory(true)
  }
  /* 点击添加分类 */
  let changeCategory = (isShow,type) =>{
    if(type=='save'){
      dispatch({
        type: 'articleManage/saveCategory',
        payload: {
          method: 'postJSON',
          params: categoryData
        },
        callback: (res) => {
          if(res.result.code === '0'){
            queryAllCategory()
            message.success('保存成功')
            setIsShowAddCategory(isShow)
          }else {
            message.error(res.result.message)
          }
        }
      })
    }else{
      if(type=='add'){
        setCategoryData({
          categoryName:'',
          objectId:''
        })
      }
      setIsShowAddCategory(isShow)
    }
  }
  /* 删除分类 */
  let delCategory = (item) => {
    dispatch({
      type: 'articleManage/delCategory',
      payload: {
        method: 'postJSON',
        params: {
          objectId:item.objectId
        }
      },
      callback: (res) => {
        if(res.result.code === '0'){
          queryAllCategory()
          message.success('删除成功')
        }else {
          message.error(res.result.message)
        }
      }
    })
  }
  /* 调整分类排序 */
  let orderCategory = (index) => {
    let splictItem = allCategory.splice(index,1)
    allCategory.splice(index-1,0,splictItem[0])
    setAllCategory(JSON.parse(JSON.stringify(allCategory)))
    let categoryIds = []
    allCategory.forEach(item=>{
      categoryIds.push(item.objectId)
    })
    dispatch({
      type: 'articleManage/orderCategory',
      payload: {
        method: 'postJSON',
        params: {
          categoryIds:categoryIds
        }
      }
    })

  }

  /*获取列表*/
  let getList = (val) => {
    let formData = {
      ...payload,
      categoryId:val?val:objectId,
      sortName: "releaseTime",  //固定传递asc
      sortOrder: "asc",  //固定传递asc
    }
    dispatch({
      type: 'articleManage/articleList',
      payload: {
        method: 'postJSON',
        params: formData
      },
      callback: (res) => {
        if (res.result.code === '0') {
          res.body.list.forEach((item,index)=>{
            item.key = item.objectId
          })
          setList(res.body.list)
          setPageTotal(res.body.total)
          setSelectedRowKeys([])
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  /* 全部文章 */
  let getAllList = () => {
    allCategory.forEach(item=>{
      item.isActive = false
    })
    setObjectId('')
    setAllCategory(JSON.parse(JSON.stringify(allCategory)))
  }

  /* 获取分类文章列表 */
  let categoryArticleList = (item,index) => {
    allCategory.forEach(item => {
      item.isActive = false
    })
    allCategory[index].isActive = true
    payload.pageInfo.pageNo = 1
    setPayload(payload)
    setAllCategory(allCategory)
    setObjectId(item.objectId)
    setPage(1)
  }
  /* 移入显示操作按钮 */
  let showOperation = (item,index,type) => {
    if(type=='enter'){
      allCategory[index].isShow =true
    }else{
      allCategory[index].isShow =false
    }

    setAllCategory(JSON.parse(JSON.stringify(allCategory)))
  }

  /*清空内容*/
  let resetBtnEvent = () => {
    let tokenObj=JSON.parse(localStorage.getItem('tokenObj'));
    let data = {
      channelId: tokenObj.channelId,  // 所属客户
      sortName: "releaseTime",  //固定传递asc
      sortOrder: "asc",  //固定传递asc
      articleTitle:'', // 文章标题
      articleStatus:'' , // 0 停用  1启用
      startDate:'',   //开始时间
      endDate:'' ,    //结束时间
      relationTime:[],
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
        totalCount:0
      }
    }
    dispatch({
      type:'customerList/resetTeamInfoList',
      payload: []
    })
    form.setFieldsValue(data)
    setPage(1)
    setPayload(data)

  }
  /*搜索按钮*/
  let searchBtnEvent = (e) => {
    setPage(1)
    if(e.relationTime){
        if( e.relationTime.length === 2) {
          e.startDate = moment(e.relationTime[0]).format('YYYY-MM-DD');
          e.endDate =  moment(e.relationTime[1]).format('YYYY-MM-DD');
        }else{
          e.startDate = "";
          e.endDate = "";
        }
      }
    setPayload({...e,pageInfo:{
      pageSize: 10,
      pageNo: 1,
      totalCount:0
    }})
  }
  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) => {
    payload.pageInfo.pageNo = page
    setPayload(payload)
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
  }
  /* 批量删除选择 */
  let rowSelection = {
    selectedRowKeys,
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  /* 启用-停用 */
  let articleStatusChange = (record) => {
    dispatch({
      type: 'articleManage/articleStatus',
      payload: {
        method: 'postJSON',
        params: {
          objectId: record.objectId,
          articleStatus:record.articleStatus?0:1
        }
      },
      callback: (res) => {
        if(res.result.code == '0'){
          getList()
          message.success(res.body)
        }else{
          message.error(res.result.message)
        }
      }
    })
  }
  /* 置顶 */
  let cancelArticleTop = (record) => {
    console.log(record)
    dispatch({
      type: 'articleManage/cancelArticleTop',
      payload: {
        method: 'postJSON',
        params: {
          articleId: record.objectId,
          isTop:record.isTop?0:1
        }
      },
      callback: (res) => {
        if(res.result.code == '0'){
          getList()
          message.success(res.body)

        }else{
          message.error(res.result.message)
        }
      }
    })
  }
  /* 删除文章 */
  let delArticle = (record) => {
    let deleteData = null
    if(record) {
      deleteData = {
        objectId: record.objectId,
      }
    }else{
      deleteData = {
        articleIds:selectedRowKeys
      }
    }
    dispatch({
      type: 'articleManage/delArticle',
      payload: {
        method: 'postJSON',
        params: deleteData
      },
      callback: (res) => {
        if(res.result.code == '0'){
          message.success(res.body)
          setSelectedRowKeys([])
          getList()
          queryAllCategory()
        }else{
          message.error(res.result.message)
        }
      }
    })
  }

  return (
    <div>
      <div className={style.block__cont}>
        <QueryFilter className={style.form__cont} form={form} defaultCollapsed onFinish={searchBtnEvent} onReset={resetBtnEvent}>
          <Form.Item label="标题" name="articleTitle" labelCol={{flex:'0 0 120px'}}>
            <Input placeholder="请输入"/>
          </Form.Item>
          <Form.Item label="状态"  name="articleStatus" labelCol={{flex:'0 0 120px'}}>
            <Select
                showSearch
                notFoundContent='暂无数据'
                placeholder="请输入"
                allowClear >
              <Option value={0}>停用</Option>
              <Option value={1}>启用</Option>
            </Select>
          </Form.Item>
          <Form.Item label="生效时间" name="relationTime"  labelCol={{flex:'0 0 120px'}}>
            <RangePicker locale={locale} placeholder={['开始时间', '结束时间']} format="YYYY-MM-DD"  className={style.rangePicker}/>
          </Form.Item>
        </QueryFilter>
      </div>

      <div className={style.content_part}>
        <div className={style.block_left_cont_posi} />
        <div className={style.block_left_cont}>
          <div className={style.block__header} style={{padding:'0 24px'}}>
            <span>文章分类</span>
            <span className={style.all_article} onClick={()=>getAllList()}>全部文章</span>
          </div>
          <div className={style.list_item_box}>
            <ul style={{padding:0}} >
              {allCategory.map((item,index) => {
                  return <li className={`${style.list} ${item.isActive?style.list_active:''}`}  onMouseEnter={()=>showOperation(item,index,'enter')}  onMouseLeave={()=>showOperation(item,index,'leave')}>
                    <span onClick={() => categoryArticleList(item,index)} className={style.list_title}>{item.categoryName} （{item.articleCount}）</span>
                    {item.isShow?<div style={{float:'right'}}>
                      <span className={style.list_icon} onClick={()=>editCategory(item)}><EditOutlined /></span>
                      <span className={style.list_icon} onClick={()=>delCategory(item)}><DeleteOutlined /></span>
                      <span className={style.list_icon} onClick={()=>orderCategory(index)}><ArrowUpOutlined /></span>
                    </div>:null}
                  </li>
              })}
            </ul>
          </div>
          <div className={style.edit_title}>
              {isShowAddCategory?<>
                <span>分类名称</span> <Input value={categoryData.categoryName} onChange={changeCategoryName} style={{width:'60%'}}/>
                <div style={{textAlign:'center',marginTop: '20px'}}>
                  <Button htmlType="button" type="primary" className={style.add_news} onClick={()=>changeCategory(false,'save')}>确认</Button>
                  <Button htmlType="button" type="primary" className={style.add_news} onClick={()=>changeCategory(false)}>取消</Button>
                </div>
              </>:<Button htmlType="button" type="primary" className={style.add_news} onClick={()=>changeCategory(true,'add')}>添加分类</Button>}
          </div>
        </div>
        <div className={style.block__cont} style={{flex:1,marginBottom: 0}}>
          <ListTitle titleName="结果列表">
            <Space size={8}>
              <Button htmlType="button" disabled={!selectedRowKeys.length > 0} onClick={()=>delArticle()}>批量删除</Button>
              <Button htmlType="button" type="primary" onClick={addNewArticle}>新建文章</Button>
            </Space>
          </ListTitle>
          <ListTable
              showPagination
              current={pageNo}
              pageSize={pageSize}
              total={pageTotal}
              onChange={onNextChange}
          >
            <Table
                locale={{ emptyText: '暂无数据' }}
                rowSelection={{...rowSelection}}
                columns={renderColumns()}
                pagination={false}
                dataSource={list}
                scroll={{x:1200}}
                loading={{
                  spinning: false,
                  delay: 500
                }}
            />
          </ListTable>
          </div>
          {
            newArticleVisible ?
                <NewArticleModel
                    objectId={objectId}
                    articleId={articleId}
                    allCategory={allCategory}
                    hideAddNewArticle={hideAddNewArticle}
                    newArticleVisible={newArticleVisible}
                /> : null
          }
      </div>
    </div>
  )
};
export default connect(({ articleManage }) => ({
  channelList: articleManage.channelList,
  allCategoryList: articleManage.allCategoryList
}))(articleManagePage)
