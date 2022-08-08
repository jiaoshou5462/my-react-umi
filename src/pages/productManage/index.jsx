import React, { useEffect, useState } from "react"
import { Link, connect, history } from 'umi'
import { Row, Col, Form, Space, Input, Modal, Table, Select, Button, message, Pagination, ConfigProvider, DatePicker } from "antd"
import style from "./style.less"
const { Option } = Select
const { RangePicker } = DatePicker
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'  // 日期处理
import 'moment/locale/zh-cn'
import { EditOutlined, DeleteOutlined, PlusSquareOutlined } from '@ant-design/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import NewProduct from './components/newProduct'
import { render } from "enzyme"
moment.locale('zh-cn')

const { confirm } = Modal
const porductManage = (props) => {
  let tokenObj = JSON.parse(localStorage.getItem('tokenObj'))
  let { dispatch } = props
  const [allCategory, setAllCategory] = useState([])
  const [form] = Form.useForm()
  const [list, setList] = useState([]) // 列表
  const [isShowAddCategory, setIsShowAddCategory] = useState(false)
  const [modalInfo, setModalInfo] = useState(null)
  const [addCategoryVisiable, setAddCategoryVisiable] = useState(false)  //新增编辑显示的弹框
  const [delCategoryVisiable, setDelCategoryVisiable] = useState(false)  //删除显示的弹框
  const [delProVisiable, setDelProVisiable] = useState(false)  //删除显示的弹框
  const [addOrUpdate, setAddOrUpdate] = useState(false)  //新增修改的标识  因为新增和修改用的不是同一个接口
  const [pageNo, setPageNo] = useState(1)//分页器
  const [pageSize, setPageSize] = useState(10)//分页器
  const [totalCount, setTotalCount] = useState(0)//分页器
  const [newsTags, setNewsTags] = useState(null)//分类选中
  const [payload, setPayload] = useState({
    channelId: tokenObj.channelId,
    pageInfo: {
      pageNo: pageNo,
      pageSize: pageSize
    }
  })  //查询条件需要的对象
  const [objectId, setObjectId] = useState()//删除编辑使用的ObjectId
  const [proObjectId, setProObjectId] = useState()//删除编辑使用的产品ObjectId
  const dateFormat = 'YYYY-MM-DD HH:mm'

  useEffect(() => {
    crmProCategoryList()
  }, [])


  useEffect(() => {
    getListProductData();
  }, [payload])

   // 渠道列表


  let efffectiveTime = (text, record) => {
    if (text) {
      if (text == '指定时间') {
        let result = record.startTime + ' - ' + record.endTime
        return <span>{result}</span>
      } else {
        return <span>永久</span>
      }
    }
  }

  let formatTime = (text) => {
    let result = moment(text).format(dateFormat)
    return <span>{result}</span>
  }
  /*列表表头数据*/
  let renderColumns = () => {
    return (
      [{
        title: '产品ID',
        dataIndex: 'objectId',
        width: '100px',
        align: 'center'
      },
      {
        title: '产品名称',
        dataIndex: 'goodTitle',
        width: '90px',
        align: 'center'
      },
      {
        title: '标题',
        dataIndex: 'title',
        width: '120px',
        align: 'center'
      }, {
        title: '生效期限',
        dataIndex: 'effectTerm',
        width: '180px',
        align: 'center',
        render: (text, record) => { return efffectiveTime(text, record) }
      }, {
        title: '创建时间  ',
        dataIndex: 'createTime',
        width: '120px',
        align: 'center',
        render: (text, record) => { return formatTime(text) }
      }, {
        title: '操作',
        dataIndex: '',
        fixed: 'right',
        width: '120px',
        align: 'center',
        render: (text, record) => Operation(text, record)
      }
      ]
    )
  }


  //操作组件
  const Operation = (text, record) => {
    return <div className={style.click_blue}>
      <span onClick={() => { editPro(record) }}>编辑</span>
      <span onClick={() => { delPro(record) }}>删除</span>
    </div>

  }

  //编辑 跳转到编辑页面
  let editPro = (record) => {
    setModalInfo({ modalName: 'edit', channelName: tokenObj.channelName, data: record })
  }

  let delPro = (record) => {
    console.log(record, "record")
    setDelProVisiable(true)
    setProObjectId(record.objectId)
  }

  let searchBtnEvent = (value) => {
    
    let result = JSON.parse(JSON.stringify(value))
    if(value.startTime){
      result.startTime = moment(value.startTime[0]).format('YYYY-MM-DD')
      result.endTime = moment(value.startTime[1]).format('YYYY-MM-DD')
    }
    result.newsCategory = newsTags
    result.pageInfo = {
      pageNo: 1,
      pageSize: 10
    }
    setPayload(result)
  }

  let getListProductData = () => {
    dispatch({
      type: 'productMange/getListProductData',
      payload: {
        method: 'postJSON',
        params: payload
      },
      callback: res => {
        if (res.result.code == '0') {
          setList(res.body.data)
          setPageNo(res.body.pageInfo.pageNo)
          setPageSize(res.body.pageInfo.pageSize)
          setTotalCount(res.body.pageInfo.totalCount)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  /* 移入显示操作按钮 */
  let showOperation = (item, index, type) => {
    if (type == 'enter') {
      allCategory[index].isShow = true
    } else {
      allCategory[index].isShow = false
    }
    setAllCategory(JSON.parse(JSON.stringify(allCategory)))
  }

  /* 获取分类文章列表 */
  let categoryArticleList = (item, index) => {
    setNewsTags(item.objectId)
    allCategory.forEach(item => {
      item.isActive = false
    })
    allCategory[index].isActive = true
    setAllCategory(allCategory)
    let result = JSON.parse(JSON.stringify(payload))
    result.newsCategory = item.objectId
    result.pageInfo = {
      pageNo: 1,
      pageSize: 10
    }
    setPayload(result)
  }

  let callModalInfo = (falg) => {
    console.log(falg)
    setModalInfo(null)
    if (falg) {
      resetEvent()
    }
  }
  // 查询全部分类
  let crmProCategoryList = () => {
    dispatch({
      type: 'productMange/crmProCategoryList',
      payload: {
        method: 'postJSON',
      },
      callback: res => {
        if (res.result.code == '0') {
          setAllCategory(res.body.data)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  //  添加分类
  let toSaveProCategory = (param) => {
    if (addOrUpdate) {
      let result = JSON.parse(JSON.stringify(param))
      result.objectId = objectId
      updateCategory(result)
    } else {
      saveProCategory(param)
    }

  }

  let saveProCategory = (param) => {
    dispatch({
      type: 'productMange/saveProCategory',
      payload: {
        method: 'postJSON',
        params: param
      },
      callback: res => {
        if (res.result.code == '0') {
          setAddCategoryVisiable(false)
          crmProCategoryList()
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  let closeAddCategoryModal = () => {
    setAddCategoryVisiable(false)
  }

  // 删除分类
  let delCategory = (e,param) => {
    e.stopPropagation()
    setObjectId(param.objectId)
    setDelCategoryVisiable(true)
  }

  let updateCategory = (param) => {
    dispatch({
      type: 'productMange/updateCategory',
      payload: {
        method: 'postJSON',
        params: param
      },
      callback: res => {
        if (res.result.code == '0') {
          setAddOrUpdate(false)
          setAddCategoryVisiable(false)
          crmProCategoryList()
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  //删除产品
  let handleDelProVisibleOk = () => {
    crmsDel()
  }

  let handleDelVisibleOk = () => {
    dispatch({
      type: 'productMange/deleteCategory',
      payload: {
        method: 'postJSON',
        objectId: objectId
      },
      callback: res => {
        if (res.result.code == '0') {
          setDelCategoryVisiable(false)
          crmProCategoryList()
        } else {

          message.error(res.result.message)
        }
      }
    })
  }
  
  let crmsDel = () => {
    dispatch({
      type: 'productMange/crmsDel',
      payload: {
        method: 'delete',
        newsId: proObjectId
      },
      callback: res => {
        if (res.result.code == '0') {
          setDelProVisiable(false)
          setPayload({
            pageInfo: {
              pageNo: pageNo,
              pageSize: pageSize
            }
          })
          crmProCategoryList()
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 编辑分类
  let editCategory = (e,param) => {
    e.stopPropagation();
    setObjectId(param.objectId)
    setAddOrUpdate(true)
    setAddCategoryVisiable(true)
    form.setFieldsValue({
      categoryName: param.categoryName
    })
  }

  //显示总条数和页数
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNo} / ${totalPage}  页`
  }
  //改变每页条数
  let onSizeChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    console.log(this_payload, "this_payload")
    this_payload.pageInfo.pageSize = pageSize
    setPayload(this_payload)
    onPageTotal()
  }
  //点击下一页上一页*
  let onNextChange = (pageNum, pageSize) => {
    console.log(pageNum, pageSize)
    let this_payload = JSON.parse(JSON.stringify(payload));
    console.log(this_payload, "this_payload")
    this_payload.pageInfo.pageNo = pageNum
    this_payload.pageInfo.pageSize = pageSize
    setPayload(this_payload)
  }

  let resetEvent = () =>{
    allCategory.forEach(item => {
      item.isActive = false
    })
    form.resetFields();
    let result = {
      pageInfo: {
        pageNo: 1,
        pageSize: 10
      }
    }
    setNewsTags(null)
    setPayload(result)
    crmProCategoryList()
  }

  return (
    <div>
      <div className={style.block__cont}>
        <Form className={style.form__cont} form={form} onFinish={searchBtnEvent} label>
          <Row >
            <Col span={8}>
              <Form.Item label="客户" labelCol={{ flex: '0 0 120px' }}>
                <Select
                  showSearch
                  notFoundContent='暂无数据'
                  placeholder="请输入"
                  optionFilterProp="children"
                  defaultValue={tokenObj.channelName}
                  disabled>
                  
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="产品ID" name="objectId" labelCol={{ flex: '0 0 120px' }}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="产品名称" name="title" labelCol={{ flex: '0 0 120px' }}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item label="生效时间" name="startTime" labelCol={{ flex: '0 0 120px' }}>
                <RangePicker locale={locale} placeholder={['开始时间', '结束时间']} format="YYYY-MM-DD" className={style.rangePicker} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" >
            <Space size={22}>
              <Button htmlType="submit" type="primary" >查询</Button>
              <Button htmlType="button" onClick={resetEvent}>重置</Button>
            </Space>
          </Row>
        </Form>
      </div>
      <div className={style.content_part}>
        <div className={style.block__cont__t} style={{ width: '20%', boxSizing: 'border-box', marginRight: '20px' }}>
          <div className={style.block__header} style={{ padding: '0 24px' }}>
            <span>产品分类</span>
            <span className={style.all_article} onClick={resetEvent}>全部产品</span>
          </div>
          <ul style={{ padding: 0 }}>
            {allCategory.map((item, index) => {
              return <li onClick={() => categoryArticleList(item, index)} className={`${style.list} ${item.isActive ? style.list_active : ''}`} onMouseEnter={() => showOperation(item, index, 'enter')} onMouseLeave={() => showOperation(item, index, 'leave')}>
                <span  className={style.list_title}>{item.categoryName} （{item.maxOrderNo}）</span>
                {item.isShow ? <div style={{ float: 'right' }}>
                  <span className={style.list_icon} onClick={(e) => editCategory(e,item)}><EditOutlined /></span>
                  <span className={style.list_icon} onClick={(e) => delCategory(e,item)}><DeleteOutlined /></span>
                </div> : null}
              </li>
            })}
          </ul>
          <div className={style.edit_title}>
            {isShowAddCategory ? <>
              <span>分类名称</span> <Input value={categoryData.categoryName} style={{ width: '60%' }} />
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button htmlType="button" type="primary" className={style.add_news} >确认</Button>
                <Button htmlType="button" type="primary" className={style.add_news} >取消</Button>
              </div>
            </> : <><span onClick={() => setAddCategoryVisiable(true)}><PlusSquareOutlined />添加分类</span></>}
          </div>
        </div>
        <div className={style.block__cont__t} style={{ flex: 1 }}>
          <div className={style.block__header} style={{ padding: '0 24px' }}>
            <span>结果列表</span><br />
            <div className={style.btn_content_left}>
              <Button htmlType="button" type="primary" className={style.add_news} onClick={() => { setModalInfo({ modalName: 'add', channelName: tokenObj.channelName }) }}>新建产品</Button>
            </div>
          </div>
          <div className={style.table_part}>
            <Table
              scroll={{ x: 1200 }}
              locale={{ emptyText: '暂无数据' }}
              columns={renderColumns()}
              dataSource={list}
              pagination={false}
              loading={{
                spinning: false,
                delay: 500
              }}
            />
            <ConfigProvider locale={zh_CN}>
              <Pagination
                showQuickJumper
                showSizeChanger
                className={style.pagination}
                showTitle={false}
                current={pageNo}
                defaultPageSize={pageSize}
                total={totalCount}
                onChange={onNextChange}
                pageSizeOptions={['10', '20', '30', '60']}
                onShowSizeChange={onSizeChange}
                showTotal={onPageTotal}
              />
            </ConfigProvider>
          </div>
        </div>

      </div>
      {modalInfo ? <NewProduct modalInfo={modalInfo} closeModal={(flag) => callModalInfo(flag)} ></NewProduct> : ''}
      <Modal width={1000} title='添加分类' visible={addCategoryVisiable}
        footer={null} onCancel={closeAddCategoryModal}>
        <Form form={form} onFinish={toSaveProCategory}>
          <Row >
            <Col span={24}>
              <Form.Item label="分类名称" name="categoryName" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="center" >
            <Col>
              <Space >
                <Button htmlType="button" onClick={() => { setAddCategoryVisiable(false) }}>取消</Button>
                <Button htmlType="submit" type="primary">保存</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal width={1000} title='删除' visible={delCategoryVisiable} onOk={handleDelVisibleOk}
        onCancel={() => setDelCategoryVisiable(false)}>
        你确定要删除吗？
      </Modal>

      <Modal width={1000} title='删除' visible={delProVisiable} onOk={handleDelProVisibleOk}
        onCancel={() => setDelProVisiable(false)}>
        你确定要删除吗？
      </Modal>
    </div>
  )
};
export default connect(({ productMange }) => ({
}))(porductManage)
