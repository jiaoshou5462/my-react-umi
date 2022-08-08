import React, { useEffect, useState, } from "react"
import { connect, history } from 'umi'
import {
  Pagination,
  Form,
  ConfigProvider,
  Input,
  Table,
  Modal,
  Button,
  Select,
  DatePicker,
  message,
  Menu,
  Dropdown,
  Space,
} from "antd"
import { EditOutlined, DeleteOutlined, PlusOutlined, InfoCircleFilled, UpOutlined, DownOutlined } from '@ant-design/icons';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { QueryFilter } from '@ant-design/pro-form';

import {
  ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,
} from "@/components/commonComp/index";

import style from "./style.less"
const { Option } = Select
const { TextArea } = Input
const { confirm } = Modal;
const { RangePicker } = DatePicker;

let taskManagePage = (props) => {
  let { dispatch, classifyList, channelList } = props;
  let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));   //基础配置信息
  let [toclassifys, setToclassifys] = useState() //当前所选分类
  let [isAddClassity, setIsAddClassity] = useState(false) //是否新增分类
  let [isModalClassity, setIsModalClassity] = useState(false) //分类弹窗
  let [isDeleClassity, setIsDeleClassity] = useState(false) //删除弹窗
  let [classityName, setClassityName] = useState("") //当前所选分类名称
  let [classityId, setClassityId] = useState() //当前所选分类id

  let [list, setList] = useState([]); // 列表
  let [productList, setProductList] = useState([]);  //勾选的产品列表
  let [selectedRowKeys, setSelectedRowKeys] = useState([]);  //勾选的产品列表key
  let [pageTotal, setPageTotal] = useState(1); // 列表数
  let [isPageType, setIsPageType] = useState(false) //是否是分页格式
  let [pageSize, setPageSize] = useState(10),
    [pageNo, setPage] = useState(1),  //列表分頁
    [payload, setPayload] = useState({
      pageNo,
      pageSize,
    })
  //批量操作
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => { batchOperate(1) }}>批量启用</Menu.Item>
      <Menu.Item key="2" onClick={() => { batchOperate(0) }}>批量停用</Menu.Item>
    </Menu>
  );
  let batchOperate = (type) => {
    if (productList && productList.length > 0) {
      let toId = [];
      productList.forEach((e) => {
        toId.push(e.id);
      })
      updateTaskStatus(toId, type);
    } else {
      message.error("请先勾选任务列表")
    }
  }
  //编辑分类
  let editClassity = (item, i) => {
    setIsAddClassity(false);
    setIsModalClassity(true);
    setClassityName(item.taskClassification);
    setClassityId(item.id);
  }
  //删除分类提示
  let deleClassity = (item, i) => {
    setClassityId(item.id);
    setIsDeleClassity(true);
  }
  //添加分类
  let addClassitys = () => {
    setIsAddClassity(true);
    setIsModalClassity(true);
    setClassityName("");
    setClassityId("");
  }

  //添加、编辑 - 分类确定
  let classityOk = () => {
    if (classityName) {
      saveTaskClassification();
    } else {
      message.error("请填写完整信息")
    }
  }
  //分类-输入框改变
  let changeName = (value) => {
    setClassityName(value.target.value);
  };
  //关闭弹窗
  let handleCancel = () => {
    setIsModalClassity(false);
    setIsDeleClassity(false);
  }
  //确认删除分类
  let classityDeleOk = () => {
    deleteTaskClassification();
  }
  //选择分类
  let changeClassifys = (item) => {
    setPage(1);
    setToclassifys(item.id);
  }
  //全部任务
  let allProduct = () => {
    setToclassifys(""); //所选分类清空
    setPage(1);
    soReset();
  }
  //搜索-是否展开
  let [isSoOpen, setIsSoOpen] = useState(false);
  let changeIsOpen = (type) => {
    setIsSoOpen(type)
  }
  //确定查询搜索栏
  let [soInfo, setSoInfo] = useState({
    channelId: String(tokenObj.channelId),   //客户
    createUser: "",     //创建人
    cyclePeriod: null,  //循环周期：
    tackTime: [],    //创建时间
    taskDescribe: "",   //任务描述	
    taskEvent: null,    //任务事件
    taskName: '',    //任务名称
    id: '',     //任务ID
    taskSortId: null,  //任务分类
    taskStatus: null,   //状态
  })
  //搜索栏对应信息
  let [soObj, setSoObj] = useState({
    channelId: String(tokenObj.channelId),   //客户
    createUser: "",     //创建人
    cyclePeriod: null,  //循环周期：
    tackTime: [],    //创建时间
    taskDescribe: "",   //任务描述	
    taskEvent: null,    //任务事件
    taskName: '',    //任务名称
    id: '',     //任务ID
    taskSortId: null,  //任务分类
    taskStatus: null,   //状态
  })
  let soFn = () => {
    let topayload = payload;
    topayload.pageNo = 1;
    setPayload({ ...topayload });
    setPage(1);
  }
  //搜索-重置
  let soReset = () => {
    let toSoObj = {
      channelId: String(tokenObj.channelId),   //客户
      createUser: "",     //创建人
      cyclePeriod: null,  //循环周期：
      tackTime: [],    //创建时间
      taskDescribe: "",   //任务描述	
      taskEvent: null,    //任务事件
      taskName: '',    //任务名称
      id: '',     //任务ID
      taskSortId: null,  //任务分类
      taskStatus: null,   //状态
    }
    soFn();
    setSoObj({ ...toSoObj });
    setSoInfo({ ...toSoObj });
    setIsPageType(true);
  }
  //搜索-查询
  let soQuery = () => {
    soFn();
    setSoInfo({ ...soObj });
    setIsPageType(true);
  }
  //搜索-输入
  let changeSoName = (name, e) => {
    let tosoObj = { ...soObj };
    tosoObj[name] = e.target.value;
    setSoObj(tosoObj);
  }
  //选择器
  let changeSoSelect = (name, e) => {
    let tosoObj = { ...soObj };
    tosoObj[name] = e;
    setSoObj(tosoObj);
  }
  //日期
  let changeSoTime = (name, e) => {
    let tosoObj = { ...soObj };
    if (e) {
      tosoObj[name] = [moment(e[0].format('YYYY-MM-DD HH:mm:ss')), moment(e[1].format('YYYY-MM-DD HH:mm:ss'))];
    } else {
      tosoObj[name] = [];
    }
    setSoObj(tosoObj);
  }
  //选择器-多选
  let changeSoMultiple = (name, e) => {
    let tosoObj = { ...soObj };
    tosoObj[name] = e;
    setSoObj(tosoObj);
  }
  //操作-状态
  let statusOperation = (record, type) => {
    updateTaskStatus([record.id], type)
  }

  /*操作组件*/
  let Operation = (status, record) => {
    return <ListTableBtns>
      {status === 1 ?<LtbItem onClick={() => { statusOperation(record, 0) }}>停用</LtbItem>:''}
      {status === 0 ?<LtbItem onClick={() => { statusOperation(record, 1) }}>启用</LtbItem>:''}
      {status === 0 ?<LtbItem onClick={() => { editOperation(record) }}>编辑</LtbItem>:''}
      {status === 0 ?<LtbItem onClick={() => { delOperation(record) }}>删除</LtbItem>:''}
    </ListTableBtns> 
  }
  /*；列表-Table*/
  let renderColumns = () => {
    return (
      [{
        title: '任务ID',
        dataIndex: 'id',
        width: '100px',
        fixed:"left",
        render: (name) => {
          return <span>{name? name : '-'}</span>
        },
      }, {
        title: '任务名称',
        dataIndex: 'taskName',
        width: '200px',
        render: (taskName, record) => {
          return <span className={style.click_blue2} onClick={() => { detailOperation(record) }}>{taskName}</span>
        }
      }
        // , {
        //   title: '任务描述',
        //   dataIndex: 'taskDescribe',
        //   width: '10%',
        // }
        , {
        title: '任务分类',
        dataIndex: 'classificationName',
        width: '160px',
        render: (name) => {
          return <span>{name? name : '-'}</span>
        },
      }, {
        title: '任务事件',
        dataIndex: 'taskEventStr',
        width: '140px',
        render: (name) => {
          return <span>{name? name : '-'}</span>
        },
      }, {
        title: '状态',
        dataIndex: 'taskStatusStr',
        width: '120px',
        render: (taskStatusStr, record) => {
          return <>{record.taskStatusStr == '启用' ?<StateBadge type="green">{taskStatusStr}</StateBadge>:<StateBadge type="red">{taskStatusStr}</StateBadge>}</>
        }
      }, {
        title: '客户',
        dataIndex: 'channelIdStr',
        width: '160px',
        render: (name) => {
          return <span>{name? name : '-'}</span>
        },
      }, {
        title: '循环周期',
        dataIndex: 'cyclePeriodStr',
        width: '120px',
        render: (name) => {
          return <span>{name? name : '-'}</span>
        },
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        width: '200px',
        render: (createTime, record) => {
          return <ListTableTime>{moment(createTime).format('YYYY-MM-DD HH:mm:ss')}</ListTableTime>
        }
      }, {
        title: '更新时间',
        dataIndex: 'updateTime',
        width: '200px',
        render: (updateTime, record) => {
          return <ListTableTime>{updateTime ? moment(updateTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</ListTableTime>
        }
      }, {
        title: '创建人',
        dataIndex: 'createUser',
        width: '140px',
        render: (name) => {
          return <span>{name? name : '-'}</span>
        },
      }, {
        title: '操作',
        dataIndex: 'taskStatus',
        width: '150px',
        fixed:"right",
        render: (taskStatus, record) => Operation(taskStatus, record)
      }]
    )
  }
  //列表-勾选
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
  //分页
  const pageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
    payload.pageNo = page
    payload.pageSize = pageSize;
    setPayload(payload);
    setIsPageType(true);
  }
  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) => {
    payload.pageNo = page
    setPayload(payload)
    setPage(page)
    setPageSize(pageSize);
    setIsPageType(true);
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    payload.pageNo = page
    payload.pageSize = pageSize
    setPage(page)
    setPageSize(pageSize)
    setPayload(payload)
    onPageTotal();
    setIsPageType(true);
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNo} / ${totalPage}  页`
  }

  //新建跳转
  let addTask = () => {
    history.replace({
      pathname: '/platformBuild/growthSystem/taskDetails'
    })
  }
  //编辑跳转
  let editOperation = (record) => {
    history.replace({
      pathname: '/platformBuild/growthSystem/taskDetails',
      state: {
        objectId: record.id
      }
    })
  }
  //任务详情跳转
  let detailOperation = (record) => {
    history.replace({
      pathname: '/platformBuild/growthSystem/taskDetails',
      state: {
        objectId: record.id,
        type: record.taskStatus
      }
    })
  }
  useEffect(() => {
    queryTaskClassification();
    getChannel();
    queryTaskList();

    //设置页面最低宽度 字符串带单位
    dispatch({
      type:'global/setPageMinWidth',
      payload: '1400px'
    })
  }, [])

  //监听搜索
  useEffect(() => {
    if (isPageType) {
      queryTaskList();
    }
  }, [soInfo, isPageType])

  // 查询任务分类
  const queryTaskClassification = () => {
    let data = {
      channelId: tokenObj.channelId,
      type: 1,
    }
    dispatch({
      type: 'taskManages/queryTaskClassification',
      payload: {
        method: 'get',
        params: data
      },
    });
  }
  /*新增-修改分类*/
  let saveTaskClassification = () => {
    dispatch({
      type: 'taskManages/saveTaskClassification',
      payload: {
        method: 'postJSON',
        params: {
          channelId: tokenObj.channelId,
          id: classityId,
          taskClassification: classityName
        }
      }, callback: (res) => {
        if (res.code === '0000') {
          setIsModalClassity(false);
          queryTaskClassification();
        } else {
          message.error(res.message)
        }
      }
    })
  }
  /*删除分类*/
  let deleteTaskClassification = () => {
    dispatch({
      type: 'taskManages/deleteTaskClassification',
      payload: {
        method: 'get',
        params: {
        },
        id: classityId,
      }, callback: (res) => {
        if (res.code === '0000') {
          setIsDeleClassity(false);
          queryTaskClassification();
        } else {
          message.error(res.message)
        }
      }
    })
  }
  /*获取渠道客户*/
  let getChannel = () => {
    dispatch({
      type: 'taskManages/getAllChannel',
      payload: {
        method: 'get',
        params: {},
      },
    })
  }
  // 查询任务列表
  const queryTaskList = () => {
    let params = soInfo;
    if (soInfo.tackTime && soInfo.tackTime.length > 0) {
      params.startTime = moment(soInfo.tackTime[0]).format('YYYY-MM-DD HH:mm:ss');
      params.endTime = moment(soInfo.tackTime[1]).format('YYYY-MM-DD HH:mm:ss');
    } else {
      params.endTime = null;
      params.startTime = null;
      params.tackTime = null;
    }
    params.pageNo = payload.pageNo;
    params.pageSize = payload.pageSize;
    dispatch({
      type: 'taskManages/queryTaskList',
      payload: {
        method: 'postJSON',
        params: params
      }, callback: (res) => {
        if (res.code === '0000') {
          let toList = res.items.list;
          toList = toList.map((item, i) => { item.key = i; return item; })
          setList([...toList]);
          setPageTotal(res.items.total || 1);
          setIsPageType(false)
          setProductList([...[]]);
          setSelectedRowKeys([...[]]);
        } else {
          message.error(res.message)
        }
      }
    });
  }
  //删除任务
  let delOperation = (info) => {
    dispatch({
      type: 'taskManages/deleteTask',
      payload: {
        method: 'get',
        params: {
        },
        id: info.id,
      }, callback: (res) => {
        if (res.code === '0000') {
          queryTaskList();
        } else {
          message.error(res.message)
        }
      }
    })
  }
  // 任务-状态修改
  let updateTaskStatus = (id, status) => {
    let params = {
      id: id,
      status: status
    };
    dispatch({
      type: 'taskManages/updateTaskStatus',
      payload: {
        method: 'postJSON',
        params: params
      }, callback: (res) => {
        if (res.code === '0000') {
          queryTaskList();
          setProductList([...[]]);
          setSelectedRowKeys([...[]]);
        } else {
          message.error(res.message)
        }
      }
    });
  }
  return (
    <>
      <Modal title={isAddClassity ? '添加分类' : '编辑分类'} closable={false} visible={isModalClassity} onOk={classityOk} onCancel={handleCancel}>
        <p className={style.modal_p_n1}><span><i>*</i>分类名称：</span><Input className={style.modal_p_n2} maxLength="15" value={classityName} onChange={(e) => { changeName(e) }} /></p>
      </Modal>
      <Modal title="提示" closable={false} visible={isDeleClassity} onOk={classityDeleOk} onCancel={handleCancel}>
        <p>是否删除该分类</p>
      </Modal>
      <div className={style.task_main}>
        {/* 任务分类 */}
        <div className={`${style.block__cont} ${style.wrap_side}`}>
          <h3><span>任务分类</span></h3>
          <div className={style.wrap_side_list}>
            <ul>
              {classifyList.map((item, i) => {
                return <li className={item.id == toclassifys ? style.active : ''}><em onClick={() => { changeClassifys(item) }}>{item.taskClassification}（{item.num ? item.num : 0}）</em><span><EditOutlined onClick={(e) => {
                  editClassity(item, i)
                }}></EditOutlined><DeleteOutlined onClick={(e) => {
                  deleClassity(item, i)
                }} className={style.wrap_side_lio1}></DeleteOutlined>
                </span></li>
              })
              }

            </ul>
          </div>
          <div className={style.wrap_side_add}>
            <span onClick={(e) => { addClassitys() }}><PlusOutlined></PlusOutlined> 添加分类</span>
          </div>
        </div>
        {/* 任务列表 */}
        <div className={`${style.wrap_main}`}>
          <div className={style.wrap_overflow}>
            <div className={style.wrap_mbody}>
              {/* 搜索栏 */}
              <QueryFilter className={style.form} defaultCollapsed onFinish={soQuery} onReset={soReset}>
                <Form.Item label="任务ID" labelCol={{ flex: '0 0 120px' }}>
                  <Input placeholder="请输入" value={soObj.id} onChange={(e) => { changeSoName('id', e) }} />
                </Form.Item>
                <Form.Item label="任务名称" labelCol={{ flex: '0 0 120px' }}>
                  <Input placeholder="请输入" value={soObj.taskName} onChange={(e) => { changeSoName('taskName', e) }} />
                </Form.Item>
                <Form.Item label="任务描述" labelCol={{ flex: '0 0 120px' }}>
                  <Input placeholder="请输入" value={soObj.taskDescribe} onChange={(e) => { changeSoName('taskDescribe', e) }} />
                </Form.Item>
                <Form.Item label="任务分类" labelCol={{ flex: '0 0 120px' }}>
                  <Select placeholder="请选择" value={soObj.taskSortId} onChange={(e) => { changeSoSelect('taskSortId', e) }}>
                    {classifyList.map((item, i) => {
                      return <Option key={item.id}>{item.taskClassification}</Option>
                    })
                    }
                  </Select>
                </Form.Item>
                <Form.Item label="任务事件" labelCol={{ flex: '0 0 120px' }}>
                  <Select placeholder="请选择" value={soObj.taskEvent} onChange={(e) => { changeSoMultiple('taskEvent', e) }}>
                    <Option key='1'>会员注册</Option>
                    <Option key='2'>完善信息</Option>
                    <Option key='3'>每日签到</Option>
                    <Option key='4'>邀请好友注册</Option>
                    <Option key='5'>使用权益</Option>
                    <Option key='6'>外链接任务</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="状态" labelCol={{ flex: '0 0 120px' }}>
                  <Select placeholder="请选择" value={soObj.taskStatus} onChange={(e) => { changeSoSelect('taskStatus', e) }}>
                    <Option key='0'>未启用</Option>
                    <Option key='1'>启用</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="客户" labelCol={{ flex: '0 0 120px' }}>
                  <Select showSearch
                    notFoundContent='暂无数据'
                    placeholder="输入渠道可筛选"
                    optionFilterProp="children"
                    value={soObj.channelId}
                    onChange={(e) => { changeSoSelect('channelId', e) }}
                    disabled={tokenObj.channelId ? true : false}
                  >
                    {
                      channelList && channelList.length > 0 ?
                        channelList.map((item, key) => {
                          return <Option key={key} value={String(item.id)}>{item.channelName}</Option>
                        })
                        : ''
                    }
                  </Select>
                </Form.Item>
                <Form.Item label="循环周期" labelCol={{ flex: '0 0 120px' }}>
                  <Select placeholder="请选择" value={soObj.cyclePeriod} onChange={(e) => { changeSoSelect('cyclePeriod', e) }}>
                    <Option key='1'>每天</Option>
                    <Option key='2'>每周</Option>
                    <Option key='3'>每月</Option>
                    <Option key='4'>每年</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="创建时间" labelCol={{ flex: '0 0 120px' }}>
                  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" value={soObj.tackTime} onChange={(e) => { changeSoTime('tackTime', e) }} />
                </Form.Item>
                <Form.Item label="创建人" labelCol={{ flex: '0 0 120px' }}>
                  <Input placeholder="请输入" value={soObj.createUser} onChange={(e) => { changeSoName('createUser', e) }} />
                </Form.Item>
              </QueryFilter>
              {/* 按钮功能栏 */}
              <div className={style.wrap_tools}>
                <ListTitle titleName="任务列表">
                  <Space size={8}>
                    <Button onClick={() => { batchOperate(1) }}>批量启用</Button>
                    <Button onClick={() => { batchOperate(0) }}>批量停用</Button>
                    <Button className={style.wrap_tools_box1_btn} type="primary" onClick={addTask}>新建</Button>
                  </Space>
                </ListTitle>
                {productList && productList.length > 0?<ListTips>已选择 {productList.length} 项</ListTips>:null}
                <ListTable showPagination current={pageNo} pageSize={pageSize} total={pageTotal}
                  onChange={pageChange}
                >
                  <Table
                    locale={{ emptyText: '暂无数据' }}
                    columns={renderColumns()}
                    rowSelection={rowSelection}
                    dataSource={list}
                    pagination={false}
                    scroll={{ x: 1600 }}
                    loading={{
                      spinning: false,
                      delay: 500
                    }}
                  />
                </ListTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};
export default connect(({ taskManages }) => ({
  classifyList: taskManages.classifyList,
  channelList: taskManages.channelList
}))(taskManagePage)
