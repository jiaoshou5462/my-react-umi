import React, { useEffect, useState, } from "react"
import { connect, history } from 'umi'
import {
  Row,
  Col,
  Form,
  Input,
  Modal,
  Button,
  Select,
  Upload,
  message,
  Menu,
  Dropdown,
  Table,
  Pagination,
  ConfigProvider
} from "antd"
import style from "./style.less";
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
const { Option } = Select
let pointAccountPage = (props) => {
  let { dispatch, location, channelList } = props;
  let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));   //基础配置信息

  //搜索栏对应信息setSoObj
  let [soObj, setSoObj] = useState({
    channelId: String(tokenObj.channelId),   //客户
    userId: "",     //用户ID
    userName: '',    //用户姓名
    iphone: '',      //手机号码
    cardId: '',      //身份证号
  })
  //搜索-是否展开
  let [isSoOpen, setIsSoOpen] = useState(false);
  let changeIsOpen = (type) => {
    setIsSoOpen(type)
  }
  //搜索-输入
  let changeSoName = (name, e) => {
    let tosoObj = { ...soObj };
    tosoObj[name] = e.target.value;
    setSoObj(tosoObj);
  }
  //搜索-选择
  let changeSoSelect = (name, e) => {
    let tosoObj = { ...soObj };
    tosoObj[name] = e;
    setSoObj(tosoObj);
  }
  //--------- 列表
  let [list, setList] = useState([]); // 列表
  let [productList, setProductList] = useState([]);  //勾选的产品列表
  let [selectedRowKeys, setSelectedRowKeys] = useState([]);  //勾选的产品列表key
  let [pageTotal, setPageTotal] = useState(1); // 列表分頁数
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
      <Menu.Item key="1">导出</Menu.Item>
      <Menu.Item key="2">冻结</Menu.Item>
      <Menu.Item key="3">解冻</Menu.Item>
    </Menu>
  );

  /*；列表-Table*/
  let renderColumns = () => {
    return (
      [{
        title: '用户ID',
        dataIndex: 'id',
        width: '10%',
        render: (id, record) => {
          return <span className={style.click_blue2}>{id}</span>
        }
      }, {
        title: '用户姓名',
        dataIndex: 'taskName',
        width: '8%',
      }
        , {
        title: '手机号',
        dataIndex: 'taskDescribe',
        width: '8%',
      }
        , {
        title: '身份证',
        dataIndex: 'classificationName',
        width: '12%',
      }, {
        title: '用户类型',
        dataIndex: 'taskEventStr',
        width: '8%',
      }, {
        title: '账户类型',
        dataIndex: 'taskStatusStr',
        width: '8%',
      }, {
        title: '账户来源',
        dataIndex: 'channelIdStr',
        width: '8%',
      }, {
        title: '所属客户',
        dataIndex: 'cyclePeriodStr',
        width: '8%',
      }, {
        title: '可用积分余额',
        dataIndex: 'createTime',
        width: '10%',
      }, {
        title: '账户状态',
        dataIndex: 'taskStatusStr',
        width: '8%',
        render: (taskStatusStr, record) => {
          return <span className={record.taskStatusStr == '启用' ? style.wrap_list_s1 : style.wrap_list_s2}>{taskStatusStr}</span>
        }
      }, {
        title: '操作',
        dataIndex: 'taskStatus',
        width: '12%',
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

  useEffect(() => {
    getChannel();
  }, []);
  /*获取渠道客户*/
  let getChannel = () => {
    dispatch({
      type: 'taskManages/getAllChannel',
      payload: {
        method: 'postJSON',
        params: {},
      },
    })
  }


  return (
    <>
      <div className={style.block__cont}>
        <div className={style.block__header}>积分账户</div>
        <div className={style.wrap_centent}>
          {/* 搜索栏 */}
          <div className={`${style.wrap_soso} ${isSoOpen ? style.wrap_soso2 : null}`}>
            <div className={style.soso_box1_pn}>
              <strong>客户：</strong>
              <Select placeholder="请选择" showSearch
                notFoundContent='暂无数据'
                placeholder="输入客户可筛选"
                optionFilterProp="children"
                value={soObj.channelId}
                className={style.soso_box1_pnn}
                onChange={(e) => { changeSoSelect('channelId', e) }}
                disabled={tokenObj.channelId ? true : false}
              >
                {
                  channelList && channelList.length > 0 ?
                    channelList.map((item, key) => {
                      return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                    })
                    : ''
                }
              </Select>
            </div>
            <div className={style.soso_box1_pn}>
              <strong>用户ID：</strong>
              <Input className={style.soso_box1_pnn} placeholder="请输入" value={soObj.userId} onChange={(e) => { changeSoName('userId', e) }} />
            </div>
            <div className={style.soso_box1_pn}>
              <strong>用户姓名：</strong>
              <Input className={style.soso_box1_pnn} placeholder="请输入" value={soObj.userName} onChange={(e) => { changeSoName('userName', e) }} />
            </div>
            <div className={style.soso_box1_pn}>
              <strong>手机号码：</strong>
              <Input className={style.soso_box1_pnn} placeholder="请输入" value={soObj.iphone} onChange={(e) => { changeSoName('iphone', e) }} />
            </div>
            <div className={style.soso_box1_pn}>
              <strong>身份证号：</strong>
              <Input className={style.soso_box1_pnn} placeholder="请输入" value={soObj.cardId} onChange={(e) => { changeSoName('cardId', e) }} />
            </div>
            <div className={`${style.soso_box1_pn} ${isSoOpen ? style.soso_show : style.soso_hide}`}>
              <strong>用户类型：</strong>
              <Select className={style.soso_box1_pnn} placeholder="请选择" value={soObj.userType} onChange={(e) => { changeSoSelect('userType', e) }}>
                <Option key='1'>服务商人员</Option>
                <Option key='2'>渠道业务员</Option>
                <Option key='3'>渠道用户</Option>
              </Select>
            </div>

            <div className={`${style.soso_box1_pn} ${isSoOpen ? style.soso_show : style.soso_hide}`}>
              <strong>账户类型：</strong>
              <Select className={style.soso_box1_pnn} placeholder="请选择" value={soObj.accountType} onChange={(e) => { changeSoMultiple('accountType', e) }}>
                <Option key='1'>个人积分账户</Option>
                <Option key='2'>公司积分账户</Option>
              </Select>
            </div>

            <div className={`${style.soso_box1_pn} ${isSoOpen ? style.soso_show : style.soso_hide}`}>
              <strong>积分来源：</strong>
              <Input className={style.soso_box1_pnn} placeholder="请输入" value={soObj.integralSource} onChange={(e) => { changeSoName('integralSource', e) }} />
            </div>

            <div className={`${style.soso_box1_pn} ${isSoOpen ? style.soso_show : style.soso_hide}`}>
              <strong>状态：</strong>
              <Select className={style.soso_box1_pnn} placeholder="请选择" value={soObj.taskStatus} onChange={(e) => { changeSoSelect('taskStatus', e) }}>
                <Option key='0'>未启用</Option>
                <Option key='1'>启用</Option>
              </Select>
            </div>
            <div className={`${style.soso_box1_pn} ${isSoOpen ? style.soso_show : style.soso_hide}`}>
              <strong>循环周期：</strong>
              <Select className={style.soso_box1_pnn} placeholder="请选择" value={soObj.cyclePeriod} onChange={(e) => { changeSoSelect('cyclePeriod', e) }}>
                <Option key='1'>每天</Option>
                <Option key='2'>每周</Option>
                <Option key='3'>每月</Option>
                <Option key='4'>每年</Option>
              </Select>
            </div>

            <div className={`${style.soso_box1_pn} ${isSoOpen ? style.soso_show : style.soso_hide}`}>
              <strong>创建人：</strong>
              <Input className={style.soso_box1_pnn} placeholder="请输入" value={soObj.createUser} onChange={(e) => { changeSoName('createUser', e) }} />
            </div>
            <div className={style.soso_box1_tools}>
              <Button type="primary">查 询</Button>
              <Button>重 置</Button>
              {
                !isSoOpen ? <span className={style.soso_box1_isopen} onClick={() => { changeIsOpen(true) }}>展开 <DownOutlined /></span> : <span className={style.soso_box1_isopen} onClick={() => { changeIsOpen(false) }}>收起 <UpOutlined /></span>
              }
            </div>
          </div>
          {/* 按钮功能栏 */}
          <div className={style.wrap_tools}>
            <div className={style.wrap_tools_box1}>
              <Dropdown.Button overlay={menu}>批量操作</Dropdown.Button>
            </div>
            {productList && productList.length > 0 ? <div className={style.wrap_tools_box2}><InfoCircleFilled className={style.wrap_tools_icon} /><span>已选择 {productList.length} 项</span></div> : null}
          </div>
          {/* 列表 */}
          <div className={style.wrap_table}>
            <Table
              locale={{ emptyText: '暂无数据' }}
              scroll={{ x: 1000 }}
              columns={renderColumns()}
              rowSelection={rowSelection}
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
                current={pageNo}
                defaultPageSize={pageSize}
                total={pageTotal}
                onChange={onNextChange}
                pageSizeOptions={['10', '20', '30', '60']}
                onShowSizeChange={onSizeChange}
                showTotal={onPageTotal}
              />
            </ConfigProvider>
          </div>



        </div>
      </div>
    </>
  )
};
export default connect(({ pointAccount, taskManages }) => ({
  channelList: taskManages.channelList
}))(pointAccountPage)
