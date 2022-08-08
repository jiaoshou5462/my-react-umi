import React, { useEffect, useState, } from "react"
import { connect, history } from 'umi'
import { Modal, Input, Button, Table, Pagination, ConfigProvider, message } from "antd"
import moment from 'moment'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn'
import style from "./style.less"
let userListPage = (props) => {
  let { dispatch, isModalUser, changeIsModalUser, userDataConfigVOList, changeUserDataConfigVOList } = props;
  //保存
  let handleOk = () => {
    changeUserDataConfigVOList(productList)
    changeIsModalUser(false);
  }
  //取消
  let handleCancel = () => {
    changeIsModalUser(false);
  }
  /*；列表-Table*/
  let renderColumns = () => {
    return (
      [{
        title: '基本信息',
        dataIndex: 'basicInfo',
        width: '25%'
      }, {
        title: '数据类型',
        dataIndex: 'dataTypeStr',
        width: '25%',
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        width: '25%',
        render: (createTime, record) => {
          return <span>{moment(createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        }
      }, {
        title: '创建人',
        dataIndex: 'createUser',
        width: '25%',
      }]
    )
  }
  let [list, setList] = useState([]);  //产品列表
  let [productList, setProductList] = useState([]);  //勾选的产品列表
  let [selectedRowKeys, setSelectedRowKeys] = useState([]);  //勾选的产品列表key
  let [pageTotal, setPageTotal] = useState(1); // 列表总数
  let [isPageType, setIsPageType] = useState(false) //是否是分页格式
  let [baseName, setBaseName] = useState('');
  let [pageSize, setPageSize] = useState(10),
    [pageNo, setPage] = useState(1),  //列表分頁
    [payload, setPayload] = useState({
      pageNo,
      pageSize,
      baseName: ''
    })
  let filtSelect = (name) => {
    let toN = [];
    let newArr = name.concat(productList);
    newArr.forEach((e, i) => {
      if (toN.indexOf(e) == -1) toN.push(e);
    });
    return toN;
  }
  //列表-勾选
  let rowSelection = {
    type: 'checkbox',
    onSelectAll: (selected, selectedRows, changeRows) => {//全选过滤
      if (selected) {
        let toSelectedRows = filtSelect(changeRows);
        let toSelectedRowKey = toSelectedRows.map((e) => { return e.id });
        setProductList([...toSelectedRows]);
        setSelectedRowKeys([...toSelectedRowKey])
      } else {
        let newArr = productList.filter((x) => !changeRows.some((item) => x.id === item.id));
        let newArr2 = newArr.map((e) => { return e.id });
        setProductList([...newArr]);
        setSelectedRowKeys([...newArr2]);
      }
    },
    onSelect: (record, selected, selectedRows, nativeEvent) => {  //单选
      if (selected) {
        let toSelectedRows = filtSelect([record]);
        let toSelectedRowKey = toSelectedRows.map((e) => { return e.id });
        setProductList([...toSelectedRows]);
        setSelectedRowKeys([...toSelectedRowKey])
      } else {
        let newArr = productList.filter((x) => x.id != record.id);
        let newArr2 = newArr.map((e) => { return e.id });
        setProductList([...newArr]);
        setSelectedRowKeys([...newArr2]);
      }
    },
    getCheckboxProps: record => ({
      // defaultChecked: selectedRowKeys.includes(`${record}`),
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
  //搜索框
  let changeSoName = (e) => {
    setBaseName(e.target.value)
  }
  let soFn = (topayload) => {
    setPayload({ ...topayload });
    setPage(1)
    queryUserData();
  }
  //确认搜索
  let configSo = () => {
    if (baseName) {
      let topayload = payload;
      topayload.baseName = baseName;
      topayload.pageNo = 1;
      soFn(topayload);
    } else {
      message.error('请输入搜索内容')
    }

  }
  //重置
  let resetSo = () => {
    setBaseName('');
    let topayload = payload;
    topayload.baseName = '';
    topayload.pageNo = 1;
    soFn(topayload);
  }
  /*分页回调*/
  useEffect(() => {
    if (isPageType) {
      queryUserData()
    }
  }, [isPageType])
  useEffect(() => {
    queryUserData();
    if (userDataConfigVOList && userDataConfigVOList.length > 0) {
      setProductList([...userDataConfigVOList]);
      let toUserVOList = [];
      userDataConfigVOList.forEach(e => {
        toUserVOList.push(e.id);
      });
      setSelectedRowKeys([...toUserVOList])
    }
  }, [])
  // 查询列表
  const queryUserData = () => {
    dispatch({
      type: 'userList/queryUserData',
      payload: {
        method: 'postJSON',
        params: payload
      }, callback: (res) => {
        if (res.code === '0000') {
          let toList = res.items.list;
          toList = toList.map((item, i) => { item.key = item.id; return item; })
          setList([...toList]);
          setPageTotal(res.items.total || 1);
          setIsPageType(false)
        } else {
          message.error(res.message)
        }
      }
    });
  }
  return (
    <>
      <Modal title="用户信息维护" visible={isModalUser} okText="保存" cancelText='取消' width="1038px" footer={null} closable={false} className={style.wrap_main}>
        <div className={style.wrap_soso}>
          <Input className={style.wrap_soso_n1} placeholder="请输入" value={baseName} onChange={changeSoName} />
          <Button type="primary" onClick={configSo}>搜 索</Button>
          <Button onClick={resetSo}>重 置</Button>
        </div>
        <div className={style.wrap_body}>
          <Table className={style.wrap_body_table}
            locale={{ emptyText: '暂无数据' }}
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
        <div className={style.wrap_footer}>
          <Button onClick={handleCancel}>取 消</Button>
          <Button type="primary" onClick={handleOk}>保 存</Button>
        </div>
      </Modal>
    </>
  )
};
export default connect(({ userList }) => ({
}))(userListPage)
