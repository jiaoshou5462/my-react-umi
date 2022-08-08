import React, { useEffect, useState } from "react"
import { Link, connect, history } from 'umi'
import { Row, Col, Form, Space, Input, Modal, Table, Select, Button, message, Pagination, ConfigProvider, DatePicker, Checkbox, Collapse, Radio } from "antd"
import style from "./style.less"
const { Option } = Select
const { RangePicker } = DatePicker
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'  // 日期处理
import 'moment/locale/zh-cn'
import { EditOutlined, DeleteOutlined, PlusSquareOutlined } from '@ant-design/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { render } from "enzyme"
import AddPoster from "./components/addPoster"
moment.locale('zh-cn')
const { Panel } = Collapse;
const { confirm } = Modal
const propagandPoster = (props) => {
  let tokenObj = JSON.parse(localStorage.getItem('tokenObj'))
  let { dispatch } = props
  const [allCategory, setAllCategory] = useState([])
  const [form] = Form.useForm()
  const [formToCategory] = Form.useForm()
  const [formToCategorys] = Form.useForm()
  const [list, setList] = useState([]) // 列表
  const [collapseIds, setCollapseIds] = useState([]) // 海报分类类型

  const [hotColor, setHotColor] = useState({}) // 热门推荐color
  const [newColor, setNewColor] = useState({ 'color': 'blue' }) // 最新上传colorcolor
  const [batchPutOnVisiable, setBatchPutOnVisiable] = useState(false) //批量上架
  const [txt, setTxt] = useState('') //上架下架文案
  const [changeCategoryVisiable, setChangeCategoryVisiable] = useState(false) //更换品类
  const [modalInfo, setModalInfo] = useState(null)
  const [addCategoryVisiable, setAddCategoryVisiable] = useState(false)  //新增编辑显示的弹框
  const [delCategoryVisiable, setDelCategoryVisiable] = useState(false)  //删除显示的弹框
  const [delProVisiable, setDelProVisiable] = useState(false)  //删除显示的弹框
  const [categoryId, setCategoryId] = useState(null)  //修改分类使用 
  const [delPosterId, setDelPosterId] = useState(null)  //删除海报使用 
  const [categoryIdByQuery, setCategoryIdByQuery] = useState(null)  //修改分类使用 
  const [pageNum, setPageNum] = useState(1)//分页器
  const [pageSize, setPageSize] = useState(10)//分页器
  const [totalCount, setTotalCount] = useState(0)//分页器
  const [indeterminate, setIndeterminate] = useState(false)//全选
  const [checkAll, setCheckAll] = useState()//全选
  const [checkAllIds, setCheckAllIds] = useState()//全部ids
  const [emIds, setEmIds] = useState([])//临时IDs
  const [payload, setPayload] = useState({
    pageNum: pageNum,
    pageSize: pageSize
  })  //查询条件需要的对象
  let statusStr = {
    1: '预上架',
    2: '已上架',
    3: '预下架',
    4: '已下架'
  }
  let categoryType = {
    1: '咨询内容',
    2: '热销产品',
    3: '扫码获客',
    4: '营销活动给'
  }
  useEffect(() => {
    crmCategoryList()
  }, [])

  useEffect(() => {
    posterList()
  }, [payload])

  let searchBtnEvent = (value) => {

    let result = JSON.parse(JSON.stringify(value))
    result.posterCategoryId = categoryIdByQuery
    result.pageNum = 1
    result.pageSize = 10
    setPayload(result)
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

  /* 获取分类海报列表 */
  let categoryArticleList = (item, index) => {
    setCategoryIdByQuery(item.objectId)
    allCategory.forEach(item => {
      item.isActive = false
    })
    allCategory[index].isActive = true
    setAllCategory(allCategory)
    let result = JSON.parse(JSON.stringify(payload))
    result.posterCategoryId = item.objectId
    result.pageNum = 1
    result.pageSize = 10
    setPayload(result)
  }

  let handleDelProVisibleOk = () => {
    delPosterByIds(delPosterId)
    setDelPosterId(null)
  }
  // 查询全部海报 
  let posterList = () => {
    dispatch({
      type: 'propagandPoster/posterLists',
      payload: {
        method: 'postJSON',
        params: payload
      },
      callback: res => {
        if (res.result.code == '0') {
          setList(res.body.data)
          setPageNum(res.body.pageInfo.pageNo)
          setPageSize(res.body.pageInfo.pageSize)
          setTotalCount(res.body.pageInfo.totalCount)
          let em = []
          res.body.data.map(item => {
            em.push(item.objectId)
          })
          onCheckChange([])
          console.log(em);
          setCheckAllIds(em)//全选使用
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  // 查询全部分类
  let crmCategoryList = () => {
    dispatch({
      type: 'propagandPoster/posterCategoryManageList',
      payload: {
        method: 'postJSON',
        params: {}
      },
      callback: res => {
        if (res.result.code == '0') {
          let data = res.body.data
          // res.body.data.map()
          // let emis = []
          // data.categoryTypeList.map(item=>{
          //   emis.push(categoryType[item.categoryType])
          // })
          // data.txt = emis.toString()
          // console.log(data,"data");
          setAllCategory(data)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  //  添加分类
  let toSaveProCategory = (param) => {
    let pm = JSON.parse(JSON.stringify(param))
    if (categoryId != null) {
      pm.objectId = categoryId
    }
    pm.categoryType = param.categoryType.toString()
    savePosterCategory(pm)
  }

  let savePosterCategory = (param) => {
    dispatch({
      type: 'propagandPoster/saveOrUpdatePosterCategory',
      payload: {
        method: 'postJSON',
        params: param
      },
      callback: res => {
        if (res.result.code == '0') {
          setAddCategoryVisiable(false)
          crmCategoryList()
          setCategoryId(null)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  let closeAddCategoryModal = () => {
    setAddCategoryVisiable(false)
    setCategoryId(null)
  }

  // 删除分类
  let delCategory = (e, param) => {
    e.stopPropagation()
    if (param.posterCount > 0) {
      return message.warn("分类下海报数量大于0，不可删除")
    }
    setCategoryId(param.objectId)
    setDelCategoryVisiable(true)
  }

  let openAddFun = () => {
    setAddCategoryVisiable(true)
    formToCategory.setFieldsValue({
      categoryName: '',
      categoryType: []
    })
  }

  // 删除海报分类
  let handleDelVisibleOk = () => {
    dispatch({
      type: 'propagandPoster/deletePosterCategory',
      payload: {
        method: 'postJSON',
        params: {
          objectId: categoryId
        }
      },
      callback: res => {
        if (res.result.code == '0') {
          setDelCategoryVisiable(false)
          setCategoryId(null)
          crmCategoryList()
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 编辑分类
  let editCategory = (e, param) => {

    e.stopPropagation();
    setCategoryId(param.objectId)
    setAddCategoryVisiable(true)
    let emLists = []
    if (param.categoryTypeList.length > 0) {
      param.categoryTypeList.map(item => {
        emLists.push(item.categoryType)
      })
    }
    formToCategory.setFieldsValue({
      categoryName: param.categoryName,
      categoryType: emLists
    })
  }

  //显示总条数和页数
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNum} / ${totalPage}  页`
  }
  //改变每页条数
  let onSizeChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageInfo.pageSize = pageSize
    setPayload(this_payload)
    onPageTotal()
  }
  //点击下一页上一页*
  let onNextChange = (pageNum, pageSize) => {
    console.log(pageNum, pageSize)
    let this_payload = JSON.parse(JSON.stringify(payload));
    console.log(this_payload, "this_payload")
    this_payload.pageNum = pageNum
    this_payload.pageSize = pageSize
    setPayload(this_payload)
  }

  let resetEvent = () => {
    allCategory.forEach(item => {
      item.isActive = false
    })
    setCollapseIds([])
    form.resetFields();
    let result = {
      pageNum: 1,
      pageSize: 10
    }
    setNewColor({ 'color': 'blue' })
    setHotColor({})
    setCategoryIdByQuery(null)
    setPayload(result)
  }

  let closeDelCategroy = () => {
    setDelCategoryVisiable(false)
    setCategoryId(null)
  }

  let onCheckChange = (paramList) => {
    console.log(paramList, "paramList");
    setEmIds(paramList)
    setIndeterminate(!!paramList.length && paramList.length < checkAllIds.length)
    setCheckAll(paramList.length && paramList.length === checkAllIds.length);
  }

  let onCheckAllChange = (e) => {
    setEmIds(e ? checkAllIds : []);
    setIndeterminate(false);
    setCheckAll(e);
  }

  let toDelPosterByIds = (param) => {
    setDelProVisiable(true)
    setDelPosterId({ posterIds: param })
  }

  let delPosterByIds = (param) => {
    dispatch({
      type: 'propagandPoster/deletePoster',
      payload: {
        method: 'postJSON',
        params: param
      },
      callback: res => {
        console.log(res, "res");
        if (res.result.code == '0') {
          setPayload({
            orderType: 1,
            pageNum: 1,
            pageSize: 10
          })
          allCategory.forEach(item => {
            item.isActive = false
          });
          crmCategoryList()
          setCollapseIds([])
          onCheckChange([])
          setDelProVisiable(false)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  let putOnPoster = (status) => {
    saveByPosterStatus({ posterIds: emIds.toString(), posterStatus: status })
  }

  let changeCategory = (param) => {
    let pm = JSON.parse(JSON.stringify(param))
    pm.posterIds = emIds.toString()
    posterCategoryReplace(pm)
  }

  // 修改分类
  let posterCategoryReplace = (param) => {
    dispatch({
      type: 'propagandPoster/posterCategoryReplace',
      payload: {
        method: 'postJSON',
        params: param
      },
      callback: res => {
        console.log(res, "res");
        if (res.result.code == '0') {
          setPayload({
            orderType: 1,
            pageNum: 1,
            pageSize: 10
          })
          crmCategoryList()
          setChangeCategoryVisiable(false)
          allCategory.forEach(item => {
            item.isActive = false
          });
          setCollapseIds([])
          onCheckAllChange(false)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  let saveByPosterStatus = (param) => {
    dispatch({
      type: 'propagandPoster/saveByPosterStatus',
      payload: {
        method: 'postJSON',
        params: param
      },
      callback: res => {
        console.log(res, "res");
        if (res.result.code == '0') {
          setPayload({
            orderType: 1,
            pageNum: 1,
            pageSize: 10
          })
          allCategory.forEach(item => {
            item.isActive = false
          });
          setCollapseIds([])
          onCheckAllChange(false)
          setBatchPutOnVisiable(false)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  return (
    <div>
      <div className={style.block__cont}>
        <Form className={style.form__cont} form={form} onFinish={searchBtnEvent} label>
          <Row >
            <Col span={8}>
              <Form.Item label="海报标题" name="posterTitle" labelCol={{ flex: '0 0 120px' }}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="状态" name="posterStatus" labelCol={{ flex: '0 0 120px' }}>
                <Select>
                  <Option value={1}>预上架</Option>
                  <Option value={2}>上架</Option>
                  <Option value={3}>预下架</Option>
                  <Option value={4}>下架</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8} align="right">
              <Space size={22}>
                <Button htmlType="submit" type="primary" >查询</Button>
                <Button htmlType="button" onClick={resetEvent}>重置</Button>
              </Space>
            </Col>
          </Row>

        </Form>
      </div>
      <div className={style.content_part}>
        <div className={style.block__cont__t} style={{ width: '20%', boxSizing: 'border-box', marginRight: '20px' }}>
          <div className={style.block__header} style={{ padding: '0 24px' }}>
            <span>海报分类</span>
            <span className={style.all_article} onClick={resetEvent}>全部海报</span>
          </div>
          <ul style={{ padding: 0 }}>
            {allCategory.map((item, index) => {
              return <li onClick={() => categoryArticleList(item, index)} className={`${style.list} ${item.isActive ? style.list_active : ''}`} onMouseEnter={() => showOperation(item, index, 'enter')} onMouseLeave={() => showOperation(item, index, 'leave')}>
                <span className={style.list_title}>{item.categoryName} （{item.posterCount}）</span>
                {item.isShow ? <div style={{ float: 'right' }}>
                  <span className={style.list_icon} onClick={(e) => editCategory(e, item)}><EditOutlined /></span>
                  <span className={style.list_icon} onClick={(e) => delCategory(e, item)}><DeleteOutlined /></span>
                </div> : null}
              </li>
            })}
          </ul>
          <div className={style.edit_title}>
            <span onClick={() => openAddFun()}><PlusSquareOutlined />添加分类</span>
          </div>
        </div>
        <div className={style.block__cont__t} style={{ flex: 1, 'margin-bottom': '24px' }}>
          <div className={style.block__header} >
            <span>海报展示</span> <span style={{
              'position': "absolute",
              'right': '10px'
            }}>
             <Button className={style.newUpload} style={newColor} onClick={() => {
                setNewColor({ 'color': 'blue' }); setHotColor({});  let categoryId = JSON.parse(JSON.stringify(payload)).posterCategoryId; setPayload({
                  posterCategoryId: categoryId,
                  orderType: 1,
                  pageNum: pageNum,
                  pageSize: pageSize
                })
              }}>最新上传</Button>
              <Button className={style.hottuijian} style={hotColor} onClick={() => {
                setHotColor({ 'color': 'blue' }); setNewColor({});  let categoryId = JSON.parse(JSON.stringify(payload)).posterCategoryId; setPayload({
                  posterCategoryId: categoryId,
                  orderType: 2,
                  pageNum: pageNum,
                  pageSize: pageSize
                })
              }}>热门下载</Button></span>
          </div>
          <div className={style.addPoster}>
            <div className={style.quanxuan}>
              <Checkbox indeterminate={indeterminate} onChange={(e) => onCheckAllChange(e.target.checked)} checked={checkAll}>
                全选
              </Checkbox>
            </div>
            <div className={style.piliangcaozuo}>
              <Collapse expandIconPosition={'right'} activeKey={collapseIds} onChange={(e) => { setCollapseIds(e) }} >
                <Panel header="批量操作" key="1">
                  <p onClick={() => { if (emIds.length == 0) { return message.warn("至少选中一个海报！") } setBatchPutOnVisiable(true); setTxt('上架') }}>{'批量上架'}</p>
                  <p onClick={() => { if (emIds.length == 0) { return message.warn("至少选中一个海报！") } setBatchPutOnVisiable(true); setTxt('下架') }}>{'批量下架'}</p>
                  <p onClick={() => { if (emIds.length == 0) { return message.warn("至少选中一个海报！") } setChangeCategoryVisiable(true); formToCategorys.setFieldsValue({ posterCategoryId: '' }) }}>{'更改分类'}</p>
                  <p onClick={() => { if (emIds.length == 0) { return message.warn("至少选中一个海报！") } toDelPosterByIds(emIds.toString()) }}>{'批量删除'}</p>
                </Panel>
              </Collapse>
            </div>
            <div className={style.addPst}>
              <Button htmlType="button" type="primary" className={style.add_news} style={{
                'height': '46px',
                'margin-top': '-5px',
                'width': '120px'
              }} onClick={() => { setModalInfo({ modalName: 'add', categoryList: allCategory }) }}>新建海报</Button>
            </div>


          </div>
          <div style={{ 'padding': '24px' }} >
            <Checkbox.Group style={{ width: '100%' }} onChange={onCheckChange} className={style.imageData} value={emIds}>
              {list && list.length ? list.map((item, key) => {
                return <div className={style.image_item} key={item.objectId}>
                  <div className={style.all_mess}>
                    <Checkbox value={item.objectId} className={style.checkBox} ></Checkbox>
                    <span className={style.image_box}>
                      {item.posterTitle.length > 6 ? item.posterTitle.substring(0, 6) + '...' : item.posterTitle}
                    </span> <span className={style.image_useCount}>已使用{item.useCount}次</span>
                  </div>
                  <div className={style.time}>
                    <span className={style.time_item}>{statusStr[item.posterStatus]}  {item.posterStatus == 1 ? item.onshelfTimeStr : item.posterStatus == 3 ? item.offshelfTimeStr : ''}</span>
                  </div>
                  <img src={item.posterUrl} width='293px' height='521px' style={{ 'margin-left': '16px', 'margin-top': '10px' }} /><br />
                  <div style={{ 'margin-top': '10px' }}>
                    <span className={style.del} onClick={() => toDelPosterByIds(item.objectId)}>删除</span>
                    <span className={style.fenge}>|</span>
                    <span className={style.edit} onClick={() => { setModalInfo({ modalName: 'edit', categoryList: allCategory, info: item.objectId }) }}>编辑</span>
                  </div>

                </div>
              }) : ''}
            </Checkbox.Group>
            <ConfigProvider locale={zh_CN} >
              <Pagination
                className={style.pagination}
                showTitle={false}
                current={pageNum}
                defaultPageSize={pageSize}
                total={totalCount}
                onChange={onNextChange}
                showSizeChanger
                pageSizeOptions={['10', '20', '30', '60']}
                onShowSizeChange={onSizeChange}
                showTotal={onPageTotal}
              />
            </ConfigProvider>
          </div>

        </div>

      </div>

      <Modal width={1000} title='添加分类' visible={addCategoryVisiable}
        footer={null} onCancel={closeAddCategoryModal}>
        <Form form={formToCategory} onFinish={toSaveProCategory}>
          <Row >
            <Col span={24}>
              <Form.Item label="分类名称" name="categoryName" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="适用二维码类型" name="categoryType" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
                <Select mode="multiple" placeholder="请选择"
                >
                  <Option value={1}>咨询内容</Option>
                  <Option value={2}>热销产品</Option>
                  <Option value={3}>扫码获客</Option>
                  <Option value={4}>营销活动</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row justify="center" >
            <Col>
              <Space >
                <Button htmlType="button" onClick={closeAddCategoryModal}>取消</Button>
                <Button htmlType="submit" type="primary">保存</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal width={1000} title='删除' visible={delCategoryVisiable} onOk={handleDelVisibleOk}
        onCancel={() => closeDelCategroy()}>
        你确定要删除吗？
      </Modal>

      <Modal width={1000} title='删除' visible={delProVisiable} onOk={handleDelProVisibleOk}
        onCancel={() => { setDelProVisiable(false); setDelPosterId(null) }}>
        你确定要删除吗？
      </Modal>

      <Modal width={1000} title={'批量' + txt} visible={batchPutOnVisiable}
        onCancel={() => { setBatchPutOnVisiable(false) }} footer={null}>
        <Form form={formToCategory} onFinish={() => putOnPoster(txt == '上架' ? 2 : 4)}>
          <Form.Item label={txt + '时间'} name="posterStatus" labelCol={{ flex: '0 0 120px' }} >
            <Radio checked={true}>立即{txt}</Radio>
          </Form.Item>
          <Row justify="center" >
            <Col>
              <Space >
                <Button htmlType="button" onClick={() => { setBatchPutOnVisiable(false) }}>取消</Button>
                <Button htmlType="submit" type="primary">保存</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal width={1000} title='更改海报分类' visible={changeCategoryVisiable}
        onCancel={() => { setChangeCategoryVisiable(false) }} footer={null}>
        <Form form={formToCategorys} onFinish={changeCategory}>
          <Form.Item label='海报分类' name="posterCategoryId" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
            <Select
              showSearch
              notFoundContent='暂无数据'
              placeholder="请选择"
            >
              {
                allCategory && allCategory.length ? allCategory.map((item, key) => {
                  return <Option value={item.objectId}>{item.categoryName}</Option>
                }) : ''
              }
            </Select>
          </Form.Item>
          <Row justify="center" >
            <Col>
              <Space >
                <Button htmlType="button" onClick={() => { setChangeCategoryVisiable(false) }}>取消</Button>
                <Button htmlType="submit" type="primary">保存</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Modal>
      {modalInfo ? <AddPoster modalInfo={modalInfo} closeModal={() => { setModalInfo(null); resetEvent(); crmCategoryList(); }}></AddPoster> : ""}
    </div>
  )
};
export default connect(({ propagandPoster }) => ({
}))(propagandPoster)
