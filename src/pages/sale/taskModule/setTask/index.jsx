import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Table, Modal, Tree, message, Checkbox, Row, Col, Space, Button, Transfer,Switch, Tooltip, InputNumber, ConfigProvider, Pagination} from "antd"
import { InfoCircleOutlined, FormOutlined, FileTextOutlined } from "@ant-design/icons";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import style from "./style.less";
const { Column } = Table;
const { TextArea, Search } = Input;
const { DirectoryTree } = Tree;
const setTask = (props) => {
  let { dispatch, modalInfo, toFatherValue, couponList, quideList, quideInfo, ArticleInfo, ArticleList} = props;
  /****************************************选择卡券 && 选择奖品***************************************************************/
  let [pageNum, setPageNum] = useState(1)
  let [pageSize, setPageSize] = useState(10)
  let [callList, setCallList] = useState(false)
  let [couponSkuName, setCouponSkuName] = useState('');// 选择卡券  &&  选择奖品
  let [qrTitle, setQrTitle] = useState('');// 扫码获客
  let [articleTitle, setArticleTitle] = useState('');// 文章推广
  let [cardPrizeList, setCardPrizeList] = useState([]) //选中的卡券数据
  let [cardKeyList, setCardKeyList] = useState([]) //选中的卡券数据的key
  let [productTitle, setProductTitle] = useState('');
  let [productList, setProductList] = useState([]);
  let [productInfo, setProductInfo] = useState({});

  /****************************************选择卡券 && 选择奖品***************************************************************/
  // 查询卡券列表
  useEffect(()=> {
    // 选择卡券  &&  选择奖品
    if(modalInfo.modalName=='setCard' || modalInfo.modalName=='setPrize') {
      getCouponList()
    }
    // 扫码获客
    if(modalInfo.modalName=='setCode') {
      getCodeList()
    }
    // 文章推广
    if(modalInfo.modalName=='setArticle') {
      getArticleList()
    }
    if(modalInfo.modalName=='setProduct') {
      getListProductData()
    }
  },[callList])


  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) => {
    setPageNum(page)
    setPageSize(pageSize)
    setCallList(!callList)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    setPageNum(page)
    setPageSize(pageSize)
    setCallList(!callList)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNum} / ${totalPage}  页`
  }
  // 选择卡券
  const columns = [
    {
      title: () => {
        return <div>卡券编号
          <Tooltip title="单套奖品所包含对应卡券的数量">
            <InfoCircleOutlined className={style.wrap2_ico} />
          </Tooltip>
        </div>
      },
      dataIndex: 'couponSkuNo',
    },
    {
      title: '卡券内部名称',
      dataIndex: 'couponSkuName',
    },
    {
      title: '单价（元）',
      dataIndex: 'quotaPrice',
    }
  ]
  // 选择奖品
  const columns1 = [
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
      render: (couponNum, record) => renderNum( record)
    }, {
      title: '有效期',
      dataIndex: 'effectiveDate',
      render: (effectiveDate, record) => renderTime(record)
    }, {
      title: '可否转增',
      dataIndex: 'shareFlag',
      render: (shareFlag, record) => renderGiving( record)
    }
  ]
  /*数量组件*/
  let renderNum = (record) => {
    let handleNum = (val, item) => {
      couponList.list.forEach((ni, i)=> {
        if(item.couponSkuNo==ni.couponSkuNo) {
          ni.couponNum = val
        }
      })
    }
    return <div><InputNumber min={0} onChange={(value) => { handleNum(value, record) }} /></div>
  }
  /*转增组件*/
  let renderGiving = ( record) => {
    let onChange = (e) => {
      couponList.list.forEach((ni, i)=> {
        if(record.couponSkuNo==ni.couponSkuNo) {
          if(e) {
            ni.shareFlag = 2
          }else{
            ni.shareFlag = 1
          }
        }
      })
    }
    return <Switch checkedChildren="开" unCheckedChildren="关" onChange={onChange}/>
  }
  /*有效期组件*/
  let renderTime = (record) => {
    let handleTime = (val, record) => {
      if (val > record.maxEffectiveDays) {
        promptBox('有效期不能大于最大有效期！')
        return
      }
      if (val <= 0) {
        promptBox('有效期需大于0！')
        return
      }
      couponList.list.forEach((ni, i)=> {
        if(record.couponSkuNo==ni.couponSkuNo) {
          ni.effectiveDate	 = val
        }
      })
    }
    return <div>领取后<InputNumber min={1} defaultValue={record.defaultEffectiveDays} onChange={(value) => { handleTime(value, record) }} />天</div>
  }
  //优惠购卡券列表单选
  const rowSelection = {
    onChange: (key, value) => {
      setCardKeyList(key)
      setCardPrizeList(value || [])
    },
    type: 'radio',
    hideSelectAll: true,
    selectedRowKeys: cardKeyList
  }
  // 奖品列表多选
  const prizeRowSelection = {
    onChange: (key, value) => {
      setCardKeyList(key)
      setCardPrizeList(value || [])
    },
    type: 'checkbox',
    hideSelectAll: true,
    selectedRowKeys: cardKeyList
  }
  // 查询卡券列表 && 查询活动奖品
  let getCouponList = () => {
    dispatch({
      type:'setTaskModal/getCouponList',
      payload: {
        method: 'postJSON',
        params: {
          pageNum,
          pageSize,
          channelNo: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          couponSkuName,
          serviceType: 1,
        }
      }
    })
  }
  // 选择卡券确认事件
  const setCard = () => {
    if(modalInfo.modalName=='setCard') {
      localStorage.setItem('cardList', JSON.stringify(cardPrizeList));
    }
    if(modalInfo.modalName=='setPrize') {
      let list = cardPrizeList.filter(item => {return item.couponNum})
      if(list.length == cardPrizeList.length) {
        localStorage.setItem('prizeList', JSON.stringify(cardPrizeList));
      }else {
        return message.error('请填写奖品数量(张)')
      }
    }
    toFatherValue(true, modalInfo.modalName)
  }
  // 卡券搜索 && 奖品搜索
  let couponSearch = () => {
    if(!couponSkuName) {
      promptBox('请输入查询内容')
    } else {
      setPageNum(1);
      setCallList(!callList)
    }
  }
  // 卡券搜索重置 && 奖品搜索重置
  let resetCoupon = () => {
    setCouponSkuName('')
    setPageNum(1);
    setCallList(!callList)
  }
  /*提示框*/
  let promptBox = (content) => {
    Modal.info({ content })
  }
  /*******************************************************扫码获客***************************************************************/
  let getCodeList = () => {
    dispatch({
      type: 'setTaskModal/qeGuideGetList',
      payload: {
        method: 'postJSON',
        params: {
          pageInfo: {
            pageNo:pageNum,
            pageSize,
          },
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          qrTitle
        }
      }
    })
  }
  // 扫码获客搜索
  let codeSearch = () => {
    if(!qrTitle) {
      promptBox('请输入查询内容')
    } else {
      setPageNum(1);
      setCallList(!callList)
    }
  }
  // 扫码获客重置
  let resetCode = () => {
    setQrTitle('')
    setPageNum(1);
    setCallList(!callList)
  }
  // 选择二维码确认事件
  const setCode = () => {
    localStorage.setItem('codeList', JSON.stringify(cardPrizeList));
    toFatherValue(true, modalInfo.modalName)
  }
  // 扫码获客
  const codeColumns = [
    {
      title: '标题',
      dataIndex: 'qrTitle',
    },
    {
      title: '描述',
      dataIndex: 'qrDesc',
    },
    {
      title: 'url/关联公众号',
      dataIndex: 'qrUrl',
    }
  ]
  /*******************************************************文章推广***************************************************************/
  // 文章推广查询
  let getArticleList = () => {
    dispatch({
      type: 'setTaskModal/getNewsByIdOrTitle',
      payload: {
        method: 'postJSON',
        params: {
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          pageNo:pageNum,
          pageSize,
          title: articleTitle
        }
      }
    })
  }
  // 文章推广搜索
  let articleSearch = () => {
    if(!articleTitle) {
      promptBox('请输入查询内容')
    } else {
      setPageNum(1);
      setCallList(!callList)
    }
  }
  const articleColumns = [
    {
      title: '分类',
      dataIndex: 'typeName',
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '简介',
      dataIndex: 'articleDescribe',
    }
  ]
  // 文章推广确认
  const setArticle = () => {
    localStorage.setItem('ArticleList', JSON.stringify(cardPrizeList));
    toFatherValue(true, modalInfo.modalName)
  }
  // 文章推广重置
  let resetArticle = () => {
    setArticleTitle('')
    setPageNum(1);
    setCallList(!callList)
  }

  /************************************** 产品推广 ******************************************/
  //获取产品列表
  const getListProductData = ()=>{
    dispatch({
      type:'setTaskModal/getListProductData',
      payload:{
        method: 'postJSON',
        params:{
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          title: productTitle,
          pageInfo:{
            pageNo: pageNum,
            pageSize: pageSize,
          }
        }
      },
      callback:(res=>{
        if(res.result.code === '0'){
          setProductInfo(res.body.pageInfoVO)
          setProductList(res.body.taskProductInfoRsps)
        }
      })
    })
  }
  // 产品搜索
  let productSearch = () => {
    if(!productTitle) {
      promptBox('请输入查询内容')
    } else {
      setPageNum(1);
      setCallList(!callList)
    }
  }
  let efffectiveTime = (text, record) => {
    if (text == '指定时间') {
      let result = record.startTime + ' - ' + record.endTime
      return <span>{result}</span>
    } else {
      return <span>{text}</span>
    }
  }
  const productColumns = [
    {
      title: '产品ID',
      dataIndex: 'productId',
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
    },
    {
      title: '生效期限',
      dataIndex: 'effectTerm',
      render: (text, record) => { return efffectiveTime(text, record) }
    }
  ]
  // 文章推广确认
  const setProduct = () => {
    localStorage.setItem('productList', JSON.stringify(cardPrizeList));
    toFatherValue(true, modalInfo.modalName)
  }
  // 文章推广重置
  let resetProduct = () => {
    setProductTitle('')
    setPageNum(1);
    setCallList(!callList)
  }

  return (
    <>
      {/* 选择二维码 */}
      <Modal title='选择二维码' width={900} visible={modalInfo.modalName=='setCode'} onOk={()=> {setCode()}} onCancel={()=> {toFatherValue(false)}}>
        <div>
          <Row>
            <Col span={14}>
              <Input
                  placeholder='请输入二维码标题'
                  value={qrTitle} onChange={(e)=> {setQrTitle(e.target.value)}}
              />
            </Col>
            <Col span={4} offset={1}>
              <Space size={22}>
                <Button type="primary" onClick={() => {codeSearch()}}>搜索</Button>
                <Button onClick={()=> {resetCode()}}>重置</Button>
              </Space>
            </Col>
          </Row>
          <Table
            rowKey={(record, index) => index}
            className={style.table_box}
            locale={{ emptyText: '暂无数据' }}
            rowSelection={rowSelection}
            columns={codeColumns}
            dataSource={quideList}
            pagination={false}
            loading={{
              spinning: false,
              delay: 500
            }}/>
          <ConfigProvider locale={zh_CN}>
            <Pagination
              className={style.pagination}
              showQuickJumper
              showTitle={false}
              current={pageNum}
              defaultPageSize={pageSize}
              total={quideInfo.totalCount}
              onChange={onNextChange}
              pageSizeOptions={['10', '20', '30', '60']}
              onShowSizeChange={onSizeChange}
              showTotal={onPageTotal}/>
          </ConfigProvider>
        </div>
      </Modal>
      {/* 选择卡券 */}
      <Modal title='选择卡券' width={900} visible={modalInfo.modalName=='setCard'} onOk={()=> {setCard()}} onCancel={()=> {toFatherValue(false)}}>
        <div>
          <Row>
            <Col span={14}>
              <Input placeholder={modalInfo.modalName=='setCard'?'请输入卡券内部名称': '请输入奖品名称(卡券内部名称)'} value={couponSkuName} onChange={(e)=> {setCouponSkuName(e.target.value)}}></Input>
            </Col>
            <Col span={4} offset={1}>
              <Space size={22}>
                <Button type="primary" onClick={() => {couponSearch()}}>搜索</Button>
                <Button onClick={()=>{resetCoupon()}}>重置</Button>
              </Space>
            </Col>
          </Row>
          <Table
            rowKey={(record, index) => index}
            className={style.table_box}
            locale={{ emptyText: '暂无数据' }}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={couponList.list}
            pagination={false}
            loading={{
              spinning: false,
              delay: 500
            }}/>
            <ConfigProvider locale={zh_CN}>
              <Pagination
                className={style.pagination}
                showQuickJumper
                showTitle={false}
                current={pageNum}
                defaultPageSize={pageSize}
                total={couponList.total}
                onChange={onNextChange}
                pageSizeOptions={['10', '20', '30', '60']}
                onShowSizeChange={onSizeChange}
                showTotal={onPageTotal}/>
            </ConfigProvider>
        </div>
      </Modal>
      {/* 选择奖品 */}
      <Modal title='选择奖品' width={1200} visible={modalInfo.modalName=='setPrize'} onOk={()=> {setCard()}} onCancel={()=> {toFatherValue(false)}}>
        <div>
          <Row>
            <Col span={14}>
              <Input placeholder={modalInfo.modalName=='setCard'?'请输入卡券内部名称': '请输入奖品名称(卡券内部名称)'} value={couponSkuName} onChange={(e)=> {setCouponSkuName(e.target.value)}}></Input>
            </Col>
            <Col span={4} offset={1}>
              <Space size={22}>
                <Button type="primary" onClick={() => {couponSearch()}}>搜索</Button>
                <Button onClick={()=>{resetCoupon()}}>重置</Button>
              </Space>
            </Col>
          </Row>
          <Table
            rowKey={(record, index) => index}
            className={style.table_box}
            locale={{ emptyText: '暂无数据' }}
            rowSelection={prizeRowSelection}
            columns={columns1}
            dataSource={couponList.list}
            pagination={false}
            loading={{
              spinning: false,
              delay: 500
            }}/>
            <ConfigProvider locale={zh_CN}>
              <Pagination
                className={style.pagination}
                showQuickJumper
                showTitle={false}
                current={pageNum}
                defaultPageSize={pageSize}
                total={couponList.total}
                onChange={onNextChange}
                pageSizeOptions={['10', '20', '30', '60']}
                onShowSizeChange={onSizeChange}
                showTotal={onPageTotal}/>
            </ConfigProvider>
        </div>
      </Modal>
      {/* 文章推广 */}
      <Modal title='选择文章' width={900} visible={modalInfo.modalName=='setArticle'} onOk={()=> {setArticle()}} onCancel={()=> {toFatherValue(false)}}>
        <div>
          <Row>
            <Col span={14}>
              <Input
                  value={articleTitle}
                  placeholder='请输入文章ID或文章名称'
                  onChange={(e)=> {
                    setArticleTitle(e.target.value)}
                  }/>
            </Col>
            <Col span={4} offset={1}>
              <Space size={22}>
                <Button type="primary" onClick={() => {articleSearch()}}>搜索</Button>
                <Button onClick={() => {resetArticle()}}>重置</Button>
              </Space>
            </Col>
          </Row>
          <Table
            rowKey={(record, index) => index}
            className={style.table_box}
            locale={{ emptyText: '暂无数据' }}
            rowSelection={rowSelection}
            columns={articleColumns}
            dataSource={ArticleList}
            pagination={false}
            loading={{
              spinning: false,
              delay: 500
            }}/>
            <ConfigProvider locale={zh_CN}>
              <Pagination
                className={style.pagination}
                showQuickJumper
                showTitle={false}
                current={pageNum}
                defaultPageSize={pageSize}
                total={ArticleInfo.totalCount}
                onChange={onNextChange}
                pageSizeOptions={['10', '20', '30', '60']}
                onShowSizeChange={onSizeChange}
                showTotal={onPageTotal}/>
            </ConfigProvider>
        </div>
      </Modal>
      {/* 选择产品 */}
      <Modal title='选择产品' width={900} visible={modalInfo.modalName=='setProduct'} onOk={()=> {setProduct()}} onCancel={()=> {toFatherValue(false)}}>
        <div>
          <Row>
            <Col span={14}>
              <Input
                  value={productTitle}
                  placeholder='请输入产品ID或产品名称'
                  onChange={(e)=> {setProductTitle(e.target.value)}}
              />
            </Col>
            <Col span={4}  offset={1}>
              <Space size={22}>
                <Button type="primary" onClick={() => {productSearch()}}>搜索</Button>
                <Button onClick={() => {resetProduct()}}>重置</Button>
              </Space>
            </Col>
          </Row>
          <Table
            rowKey={(record, index) => index}
            className={style.table_box}
            locale={{ emptyText: '暂无数据' }}
            rowSelection={rowSelection}
            columns={productColumns}
            dataSource={productList}
            pagination={false}
            loading={{
              spinning: false,
              delay: 500
            }}/>
            <ConfigProvider locale={zh_CN}>
              <Pagination
                className={style.pagination}
                showQuickJumper
                showTitle={false}
                current={pageNum}
                defaultPageSize={pageSize}
                total={productInfo.totalCount}
                onChange={onNextChange}
                pageSizeOptions={['10', '20', '30', '60']}
                onShowSizeChange={onSizeChange}
                showTotal={onPageTotal}/>
            </ConfigProvider>
        </div>
      </Modal>
    </>
  )
}


export default connect(({ setTaskModal }) => ({
  couponList: setTaskModal.couponList,
  quideList: setTaskModal.quideList,
  quideInfo: setTaskModal.quideInfo,
  ArticleList: setTaskModal.ArticleList,
  ArticleInfo: setTaskModal.ArticleInfo,
}))(setTask)







