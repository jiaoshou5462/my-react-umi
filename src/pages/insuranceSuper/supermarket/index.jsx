import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import {
  Form,
  Input,
  Button,
  message,
  Modal,
  InputNumber,
  ConfigProvider,
  Table,
  Pagination,
  Space,
} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import styles from './style.less';
import {
  EditOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  FormOutlined,
  CaretUpOutlined,
  CaretDownOutlined
} from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard'
import {
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  QueryFilter
} from "@ant-design/pro-form";
import style from "../../sale/task/style.less";
let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));
let homeHost = {
  'local':'https://dev.yltapi.com',
  'dev':'https://dev.yltapi.com',
  'test1':'https://test1.yltapi.com',
  'uat':'https://uat.yltapi.com',
  'prod':'https://www.yltapi.com',
}[process.env.DEP_ENV]

import {
  LtbItem,
  ListTitle,
  ListTable,
  StateBadge,
  ListTableTime,
  ListTableBtns
} from "@/components/commonComp/index";

const superInfo = (props) => {
  const { dispatch, channelList, location } = props;
  let [form] = Form.useForm();
  let [toclassifys, setToclassifys] = useState() //当前所选分类
  let [typesArr, setTypesArr] = useState(['下架', '上架', '全部']) //状态
  let [classifyList, setClassifyList] = useState([//分类
  ])
  let [isDeleProduct, setIsDeleProduct] = useState(false); //删除产品
  let [onProductObj, setOnProductObj] = useState({}); //删除产品-所选
  let [allGooldType, setAllGooldType] = useState(false); //全部产品
  let [goodQueryType, setGoodQueryType] = useState(0); //是否按照分类查询
  let [isModalClassity, setIsModalClassity] = useState(false) //分类弹窗
  let [isAddClassity, setIsAddClassity] = useState(false) //是否新增分类
  let [classityName, setClassityName] = useState("") //分类名称
  let [classitySort, setClassitySort] = useState(1) //排序
  let [classityId, setClassityId] = useState() //当前所选分类id
  let [toSortKey, setToSortKey] = useState(0) //当前编辑key
  let [isDeleClassity, setIsDeleClassity] = useState(false) //删除弹窗
  let [isSortClassity, setIsSortClassity] = useState(false) //排序弹窗
  let [list, setList] = useState([]); // 列表
  let [goodSortSort, setGoodSortSort] = useState('') //产品排序 1正序，2倒序
  let [publishTimeSort, setPublishTimeSort] = useState('') //发布时间排序 1正序，2倒序
  let [pageTotal, setPageTotal] = useState(1); // 列表
  let [pageSize, setPageSize] = useState(10),
    [channelId, setChannelId] = useState(tokenObj.channelId),
    [pageNo, setPage] = useState(1),  //列表分頁
    [payload, setPayload] = useState({
      pageNo,
      pageSize,
      status: '',
      endTime: '',
      goodSortSort,
      startTime: '',
      channelId: '',
      publishTimeSort,
      internalName: '',
    })
  let [productList, setProductList] = useState([]);  //勾选的产品列表
  let [selectedRowKeys, setSelectedRowKeys] = useState([]);  //勾选的产品列表key
  let [isDeleBatch, setIsDeleBatch] = useState(false) //批量删除弹窗
  let [isPageType, setIsPageType] = useState(false) //是否是分页格式

  let [copyLink, changeCopyLink] = useState('') //前台链接

  useEffect(() => {
    getChannel();
    setChannelId(tokenObj.channelId)
    form.setFieldsValue({
      channelId,
      types: 2,
      title: "",
      activityTime: ""
    });
    getAllGoodClass();
    channelChanges();
  }, [])


  //复制前台链接
  let setCopyLink = () => {
    if (channelId) {
      message.success('已复制到剪贴板')
    } else {
      message.error('请选择渠道！')
    }
  }
  //渠道
  let channelChanges = () => {
    let toLink = `${homeHost}/wechat-carowner-new/home?jumpPage=/sub-special/insurSupermarket&channelId=` + channelId
    changeCopyLink(toLink)
  }

  //查询
  let onSubmit = (value) => {
    getAllGoodClass();
  }
  //重置
  let onReset = (value) => {
    form.resetFields();
    form.setFieldsValue({
      channelId
    })
  }
  //关闭弹窗
  let handleCancel = () => {
    setIsModalClassity(false);
    setIsDeleClassity(false);
    setIsSortClassity(false);
    setIsDeleProduct(false);
    setIsDeleBatch(false);
  }

  //添加、编辑分类确定
  let classityOk = () => {
    if (classityName) {
      if (!isAddClassity) { //编辑
        updateGoodClass();
      } else {   //新增
        createGoodClass();
      }
    } else {
      message.error("请填写完整信息")
    }
  }
  //编辑分类
  let editClassity = (item, i) => {
    setIsAddClassity(false);
    setIsModalClassity(true);
    setToSortKey(i);
    setClassityName(item.className);
    setClassityId(item.objectId);
  }
  //分类内容改变
  let changeName = (value) => {
    setClassityName(value.target.value);
  }
  let changeSort = (value) => {
    setClassitySort(value)
  }
  //删除提示
  let deleClassity = (item, i) => {
    setClassityId(item.objectId);
    setIsDeleClassity(true);
  }
  //确认删除分类
  let classityDeleOk = () => {
    delGoodClass();
  }
  //排序显示
  let sortProduct = (item) => {
    setOnProductObj({ ...item });
    setClassitySort(item.goodSort)
    setIsSortClassity(true);
  }
  //新建产品
  let newProduct = () => {
    if (channelId) {
      history.push({
        pathname: '/insuranceSuper/supermarket/insuranceProduct',
        state: {
          channelId
        }
      })
    } else {
      message.error("请先选择渠道！")
    }
  }
  //编辑
  let editProduct = (item) => {
    history.push({
      pathname: '/insuranceSuper/supermarket/insuranceProduct',
      state: {
        channelId,
        objectId: item.objectId
      }
    })
  }
  //详情
  let detailsProduct = (item) => {
    history.push({
      pathname: '/insuranceSuper/supermarket/insuranceProduct',
      state: {
        channelId,
        objectId: item.objectId,
        type: 1
      }
    })
  }

  /*操作组件*/
  let Operation = (goodRules, record) => {
    let tempCopyLink = `${homeHost}/wechat-carowner-new/home?jumpPage=/sub-special/guideNews&noFilterParams=1&source=7&channelId=` + record.channelId + '&newsId=' + record.objectId
    return  <ListTableBtns showNum={3}>
      {
        goodRules === 1 ? <LtbItem onClick={() => { stopChannelSupGood(record) }}>下架</LtbItem> : <LtbItem onClick={() => { startChannelSupGood(record) }}>上架</LtbItem>
      }
      {
        goodRules === 0 ? <LtbItem onClick={() => { editProduct(record) }}>编辑</LtbItem> : <LtbItem onClick={() => { detailsProduct(record) }}>详情</LtbItem>
      }
      {
        goodRules === 0 ? <LtbItem onClick={() => { setOnProductObj({ ...record }); setIsDeleProduct(true) }}>删除</LtbItem> : ''
      }
      {
        record.statusName === '上架' ? <LtbItem><CopyToClipboard text={tempCopyLink} onCopy={() => setCopyLink()}><span>复制地址</span></CopyToClipboard> </LtbItem> : null
      }
    </ListTableBtns>
  }
  /*商品排序*/
  let onListGoodSort = () => {
    let temp = goodSortSort === '2' ? '1' : '2'
    setGoodSortSort(temp)
    setPublishTimeSort('')
    setIsPageType(true)
  }
  /*时间排序*/
  let onListTimeSort = () => {
    let temp = publishTimeSort === '2' ? '1' : '2'
    setPublishTimeSort(temp)
    setGoodSortSort('')
    setIsPageType(true)
  }
  /*；列表*/
  let renderColumns = () => {
    return (
      [{
        title: '产品ID',
        dataIndex: 'objectId',
        width: 100,
        fixed: 'left',
      }, {
        title: '产品名称',
        dataIndex: 'goodTitle',
        width: 200,
      }, {
        title: '产品分类',
        dataIndex: 'className',
        width: 150,
      }, {
        title: '价格',
        dataIndex: 'goodPrice',
        width: 120,
        render: (goodPrice, record) => {
          return <span>{goodPrice}{record.priceType === 1 ? ' 元起' : ' 元 '}</span>
        }
      }, {
        title: () => {
          return <div className={styles.wrap_list_title} >
            <div>排序</div>
            <div onClick={onListGoodSort}>
              <CaretUpOutlined  style={{display: 'block', cursor: 'pointer', height: '8px', color: goodSortSort === '1' ? '#4B7FE8' : '#ccc'}}/>
              <CaretDownOutlined  style={{display: 'block', cursor: 'pointer', color: goodSortSort === '2' ? '#4B7FE8' : '#ccc'}}/>
            </div>
          </div>
        },
        dataIndex: 'goodSort',
        width: 80,
        render: (goodSort, record) => {
          return <span>{goodSort}<FormOutlined onClick={() => { sortProduct(record) }} className={styles.wrap_list_ts1} /></span>
        }
      }, {
        title: '状态',
        dataIndex: 'statusName',
        width: 80,
        render: (statusName, record) => {
          return <StateBadge type={record.statusName == '上架' ? '' : 'red'} status={record.statusName == '上架' ? 'success' : ''}>
            {statusName}
          </StateBadge>
        }
      }, {
        title: '生效日期开始',
        dataIndex: 'startTime',
        width: 160,
        render: (startTime) => {
          return <ListTableTime>{startTime ? startTime : '永久'}</ListTableTime>
        }
      }, {
        title: '生效日期结束',
        dataIndex: 'endTime',
        width: 160,
        render: (endTime, record) => {
          return <ListTableTime>{record.startTime ? endTime : '永久'}</ListTableTime>
        }
      }, {
        title: () => {
          return <div className={styles.wrap_list_title} >
            <div>发布时间</div>
            <div onClick={onListTimeSort}>
              <CaretUpOutlined  style={{display: 'block', cursor: 'pointer', height: '8px', color: publishTimeSort === '1' ? '#4B7FE8' : '#ccc'}}/>
              <CaretDownOutlined  style={{display: 'block', cursor: 'pointer', color: publishTimeSort === '2' ? '#4B7FE8' : '#ccc'}}/>
            </div>
          </div>
        },
        dataIndex: 'publishTime',
        width: 160,
        render: (publishTime) => {
          return <ListTableTime>{publishTime ? publishTime : '-'}</ListTableTime>
        }
      }, {
        title: '操作',
        dataIndex: 'goodRules',
        width: 180,
        fixed: 'right',
        render: (goodRules, record) => Operation(goodRules, record)
      }]
    )
  }
  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) => {
    payload.pageNo = page
    setPayload(payload)
    setPage(page)
    setPageSize(pageSize);
    setIsPageType(true);
  }
  /*分页回调*/
  useEffect(() => {
    if (isPageType) {
      getSupGoodsPage()
    }
  }, [isPageType])
  //勾选列表
  let rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKey, selectedRows) => {
      setProductList([...selectedRows]);
      setSelectedRowKeys([...selectedRowKey])
    },
    getCheckboxProps: (record) => ({
      disabled: record.goodRules === 1
    }),
    selectedRowKeys: selectedRowKeys
  };
  //选择分类
  let changeClassifys = (item) => {
    setGoodQueryType(1);
    setPage(1);
    setToclassifys(item.objectId);
  }
  useEffect(() => {
    if (goodQueryType && toclassifys) {
      getSupGoodsPage();
    }
    if (allGooldType) {
      getSupGoodsPage();
    }
  }, [goodQueryType, toclassifys, allGooldType])
  //添加分类
  let addClassitys = () => {
    if (channelId) {
      setIsModalClassity(true);
      setIsAddClassity(true);
      setClassitySort(1);
      setClassityName("");
    } else {
      message.error("请先选择渠道！")
    }
  }
  //全部产品
  let allProduct = () => {
    if (channelId) {
      setToclassifys(""); //所选分类清空
      setPage(1);
      setGoodQueryType(0);
      setAllGooldType(true);
    } else {
      message.error("请先选择渠道！")
    }
  }

  //批量删除
  let batchDelete = () => {
    if (productList.length > 0) {
      setIsDeleBatch(true);
    } else {
      message.error("请先勾选需删除的产品！")
    }
  }


  //数据层
  /*获取渠道*/
  let getChannel = () => {
    dispatch({
      type: 'superMarket/getActivityChannelList',
      payload: {
        method: 'postJSON',
        params: {}
      }
    })
  }
  /*分类新增*/
  let createGoodClass = () => {
    dispatch({
      type: 'superMarket/createGoodClass',
      payload: {
        method: 'postJSON',
        params: {
          channelId,
          className: classityName
        }
      }, callback: (res) => {
        if (res.code === 'S000000') {
          setIsModalClassity(false);
          getAllGoodClass();
        } else {
          message.error(res.message)
        }
      }
    })
  }
  //分类获取
  let getAllGoodClass = (onlyClass) => {
    dispatch({
      type: 'superMarket/getAllGoodClass',
      payload: {
        method: 'get',
        channelId
      }, callback: (res) => {
        if (res.code === 'S000000') {
          setClassifyList([...res.data]);
          if(onlyClass) return;//仅刷新分类
          setToclassifys(""); //所选分类清空
          setPage(1);
          setGoodQueryType(0);
          getSupGoodsPage();
        } else {
          message.error(res.message)
        }
      }
    })
  }
  /*分类修改*/
  let updateGoodClass = () => {
    dispatch({
      type: 'superMarket/updateGoodClass',
      payload: {
        method: 'postJSON',
        params: {
          objectId: classityId,
          className: classityName
        }
      }, callback: (res) => {
        if (res.code === 'S000000') {
          setIsModalClassity(false);
          getAllGoodClass();
        } else {
          message.error(res.message)
        }
      }
    })
  }
  /*分类删除*/
  let delGoodClass = () => {
    dispatch({
      type: 'superMarket/delGoodClass',
      payload: {
        method: 'postJSON',
        objectId: classityId
      }, callback: (res) => {
        if (res.code === 'S000000') {
          setIsDeleClassity(false);
          getAllGoodClass();
        } else {
          message.error(res.message)
        }
      }
    })
  }

  //产品列表获取
  let getSupGoodsPage = () => {
    dispatch({
      type: 'superMarket/getSupGoodsPage',
      payload: {
        method: 'postJSON',
        params: {
          channelId,
          goodSortSort,
          publishTimeSort,
          objectId: toclassifys,
          goodQueryType: goodQueryType,
          goodTitle: form.getFieldsValue().title,
          goodStatus: form.getFieldsValue().types,
          productId: form.getFieldsValue().productId,
          startTime: form.getFieldsValue().activityTime ? moment(form.getFieldsValue().activityTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
          endTime: form.getFieldsValue().activityTime ? moment(form.getFieldsValue().activityTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
          pageInfo: {
            pageNo,
            pageSize
          },
        }
      }, callback: (res) => {
        if (res.code === 'S000000') {
          let toList = res.data;
          toList = toList.map((item, i) => { item.key = i; return item; })
          setList([...toList]);
          setProductList([...[]]);
          setSelectedRowKeys([...[]]);
          setPageTotal(res.pageInfo.totalCount || 1);
        } else {
          setToclassifys(""); //所选分类清空
          setGoodQueryType(0);
          message.error(res.message)
        }
        setIsPageType(false);
        setAllGooldType(false);
      }
    })
  }
  //产品列表-停用
  let stopChannelSupGood = (item) => {
    dispatch({
      type: 'superMarket/stopChannelSupGood',
      payload: {
        method: 'postJSON',
        objectId: item.objectId
      }, callback: (res) => {
        if (res.code === 'S000000') {
          getSupGoodsPage();
        } else {
          message.error(res.message)
        }
      }
    })
  }
  //产品列表-启用
  let startChannelSupGood = (item) => {
    dispatch({
      type: 'superMarket/startChannelSupGood',
      payload: {
        method: 'postJSON',
        objectId: item.objectId
      }, callback: (res) => {
        if (res.code === 'S000000') {
          getSupGoodsPage();
        } else {
          message.error(res.message)
        }
      }
    })
  }
  //产品列表-删除
  let productDeleOk = (item) => {
    dispatch({
      type: 'superMarket/delChannelSupGoods',
      payload: {
        method: 'postJSON',
        objectId: onProductObj.objectId
      }, callback: (res) => {
        if (res.code === 'S000000') {
          getSupGoodsPage();
          getAllGoodClass(true);
          setIsDeleProduct(false);
        } else {
          message.error(res.message)
        }
      }
    })
  }
  //排序确认
  let classitySortOk = () => {
    dispatch({
      type: 'superMarket/changeSort',
      payload: {
        method: 'postJSON',
        objectId: onProductObj.objectId,
        goodSort: classitySort
      }, callback: (res) => {
        if (res.code === 'S000000') {
          getSupGoodsPage();
          setIsSortClassity(false);
        } else {
          message.error(res.message)
        }
      }
    })
  }
  //批量删除确认
  let productBatchDeleOk = () => {
    let objectIds = [];
    productList.forEach((item) => {
      objectIds.push(item.objectId)
    })
    dispatch({
      type: 'superMarket/batchDelChannelSupGoods',
      payload: {
        method: 'postJSON',
        params: {
          objectIds: objectIds,
        }
      }, callback: (res) => {
        if (res.code === 'S000000') {
          getSupGoodsPage();
          getAllGoodClass(true);
          setIsDeleBatch(false);
        } else {
          message.error(res.message)
        }
      }
    })
  }

  /*分类向上/向下移动*/
  let onMoveSort = (tag, key) => {
    let temp = classifyList.splice(key,1)
    if (tag === 1) {
      classifyList.splice(key - 1,0, temp[0])
    }else {
      classifyList.splice(key + 1,0, temp[0])
    }
    setClassifyList(JSON.parse(JSON.stringify(classifyList)))
    let tempId = []
    classifyList.map(item => {
      tempId.push(item.objectId)
    })
    if (tempId.length <= 0) return
    dispatch({
      type: 'superMarket/onUpDataProductCategory',
      payload: {
        method: 'postJSON',
        params: {
          categoryIds: tempId,
          channelId,
        }
      }, callback: (res) => {
        if (res.result.code === '0') {
          getAllGoodClass()
        } else {
          message.error(res.message)
        }
      }
    })
  }

  return (
    <div>
      {/*头部搜索*/}
      <div className={styles.wrap_head}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={onSubmit} onReset={onReset}>
          <ProFormText name="title" label="产品名称" labelCol={{ flex: '0 0 120px' }}/>
          <ProFormText name="productId" label="产品ID" labelCol={{ flex: '0 0 120px' }}/>
          <ProFormSelect name="types" label="状态" labelCol={{ flex: '0 0 120px' }} options={
            typesArr.map((item, key)=>{
                           return {value: key,label: item}
                         })}
          />
          <ProFormDateRangePicker format="YYYY-MM-DD" name="activityTime" label="生效时间" labelCol={{ flex: '0 0 120px' }}/>
        </QueryFilter>
      </div>

      {/*左边分类*/}
      <div className={styles.wrap_main}>
        <div className={styles.block_left_cont_posi} />
        <div className={styles.wrap_side}>
          <h3><span>产品分类</span><i onClick={allProduct}>全部产品</i></h3>
          <div className={styles.wrap_side_list}>
            <ul style={{padding:0}}>
              {classifyList.map((item, i) => {
                return <li className={`${styles.list} ${item.objectId == toclassifys ? styles.active : ''}`}>
                  <em onClick={() => { changeClassifys(item) }}>{item.className}（{item.goodNums ? item.goodNums : 0}）</em>
                  <span>
                    <EditOutlined onClick={(e) => {editClassity(item, i)}} />
                    <DeleteOutlined onClick={(e) => {deleClassity(item, i)}} className={styles.wrap_side_lio1} />
                    {
                      i > 0 ? <ArrowUpOutlined onClick={(e) => {onMoveSort(1, i)}} className={styles.wrap_side_lio1} /> : null
                    }
                    {
                      i < classifyList.length - 1 ? <ArrowDownOutlined onClick={(e) => {onMoveSort(2, i)}} className={styles.wrap_side_lio1} /> : null
                    }
                </span>
                </li>
              })
              }
            </ul>
          </div>
          <div className={styles.wrap_side_add}>
            <Button htmlType="button" type="primary" onClick={addClassitys}>添加分类</Button>
          </div>
        </div>

        {/*右边列表*/}
        <div className={styles.wrap_list}>
          <ListTitle titleName="产品列表">
            <Space size={8}>
              <Button disabled={!productList.length > 0} onClick={batchDelete}>批量删除</Button>
              <CopyToClipboard text={copyLink} onCopy={() => setCopyLink()}>
                <Button type="primary">复制前台链接</Button>
              </CopyToClipboard>
              <Button type='primary' onClick={newProduct}>新建产品</Button>
            </Space>
          </ListTitle>
          <div className={styles.wrap_list_by}>
            <ListTable
                showPagination
                current={pageNo}
                total={pageTotal}
                pageSize={pageSize}
                onChange={onNextChange}
            >
              <Table
                  locale={{ emptyText: '暂无数据' }}
                  columns={renderColumns()}
                  rowSelection={rowSelection}
                  dataSource={list}
                  pagination={false}
                  scroll={{
                    x: 600
                  }}
                  loading={{
                    spinning: false,
                    delay: 500
                  }}
              />

            </ListTable>
          </div>
        </div>
      </div>

      {/* 添加分类 */}
      <Modal title={isAddClassity ? '添加分类' : '编辑分类'} closable={false} visible={isModalClassity} onOk={classityOk} onCancel={handleCancel}>
        <p className={styles.modal_p_n1}>
          <span><i>*</i>分类名称：</span>
          <Input
              value={classityName}
              className={styles.modal_p_n2}
              onChange={(e) => { changeName(e) }}
          />
        </p>
      </Modal>
      <Modal title="调整排序" closable={false} visible={isSortClassity} onOk={classitySortOk} onCancel={handleCancel}>
        <p className={styles.modal_p_n1}>
          <span><i>*</i>排序：</span>
          <InputNumber
              value={classitySort}
              min={0}
              onChange={changeSort}
          />
        </p>
        <div className={styles.modal_label_msg}>数字越大越靠前，对同一个分类下的内容生效</div>
      </Modal>
      <Modal title="提示" closable={false} visible={isDeleClassity} onOk={classityDeleOk} onCancel={handleCancel}>
        <p>是否删除该分类</p>
      </Modal>
      <Modal title="提示" closable={false} visible={isDeleProduct} onOk={productDeleOk} onCancel={handleCancel}>
        <p>是否删除该产品</p>
      </Modal>
      <Modal title="提示" closable={false} visible={isDeleBatch} onOk={productBatchDeleOk} onCancel={handleCancel}>
        <p>是否批量删除所选择产品</p>
      </Modal>
    </div>
  )
}

export default connect(({ superMarket }) => ({
  channelList: superMarket.channelList,
}))(superInfo)
