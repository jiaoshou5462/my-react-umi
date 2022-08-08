import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import { Row, Col, Tag, Form, Checkbox, Input, Modal, Table, Select, Button, message,ConfigProvider,Pagination} from "antd"
import style from "./style.less"
import zh_CN from 'antd/lib/locale-provider/zh_CN';
const peopleSelectModel = (props) => {
  let { dispatch,peopleSelectVisible,hidePeopelSelectModel,wanderStrategyCrowdVOList } = props
  const [form] = Form.useForm();
  let [visible, setVisible] = useState(false),
      [pageInfo,setPageInfo] = useState({
        pageNum:1,
        pageSize:10,
        groupName:'',
        type:1,
        id:''
      })
  let [selectedRowKeys,setSelectedRowKeys] = useState([]);
  let [selectedRows,setSelectedRows] = useState([]);
  let renderColumns = () => {
    return (
      [{
        title: '群组ID',
        dataIndex: 'crowdId',  
        width: '100px', 
        align: 'center'
      },{
        title: '群组名称',
        dataIndex: 'crowdName',  
        width: '100px', 
        align: 'center'
      },{
        title: '人数',
        dataIndex: 'countNum',  
        width: '100px', 
        align: 'center'
      }]
   )}
  /*== 弹窗显示与关闭 ==*/  
   let handleCancel = () => {
    setVisible(false)
    hidePeopelSelectModel()
  }
  let [selectList,setSelectList] = useState([])
  let [selectNameStr,setSelectNameStr] = useState('')
  useEffect(()=>{
    let obj = {}
    let newList = selectedRows.concat(wanderStrategyCrowdVOList) // 之前选的和目前选中的结合
    let newSelectList = newList.filter(item=>{
      if(item){
        return selectedRowKeys.indexOf(item.crowdId)>-1
      }
    })
    console.log(selectedRowKeys,newSelectList)
     newSelectList = newSelectList.reduce((cur, next) => {
      if (!obj[next.crowdId]) {
          obj[next.crowdId] = true
            cur.push(next)
        }
      return cur
     }, [])
     setSelectList(newSelectList)
     let nameStr = newSelectList.map((item)=>{
        return item.crowdName
     }).join(',')
     setSelectNameStr(nameStr)
  },[selectedRowKeys])
  let handleOk = () => {
    setVisible(false)
    hidePeopelSelectModel(selectList)
  }
  /*== 群名称搜索 == */ 
  let groupNameChange = (e)=>{
    pageInfo.pageNum=1
    pageInfo.groupName = e.target.value
  }
  /* == 获取数据 == */
  useEffect(()=>{
    let keyArr = []
    wanderStrategyCrowdVOList.forEach((item)=>{
      keyArr.push(item.crowdId)
    })
    setSelectedRowKeys(keyArr)
  },[])
  useEffect(()=>{
    if(peopleSelectVisible){
      getUserGroupList()
      setVisible(peopleSelectVisible);
    }
  },[pageInfo,peopleSelectVisible])
  

  /* 查询用户群 */
  let [userGroupList,setUserGroupList] = useState({
    pageNum:1,
    pageSize:10,
    total:10,
    totalPage:1
  })
  const getUserGroupList = () => {
    dispatch({
      type: 'createStrategic/queryCrowdByStrategyId',
      payload: {
        method: 'postJSON',
        params: pageInfo
      },
      callback:(res)=>{
        if(res.result.code=='0'){
          res.body.wanderUserGroupVOList.forEach(item=>{
            item.key = item.crowdId
          })
          userGroupList.list = res.body.wanderUserGroupVOList
          userGroupList.total = res.body.totalCount
          userGroupList.totalPage = res.body.totalPage
          setUserGroupList({...userGroupList})
        }else{
          message.error(res.result.message)
        }
      }
    });
  }
   /* 分页切换 */
  const handleTableChange = (page,pageSize) => {
    pageInfo.pageNum = page
    pageInfo.pageSize = pageSize
    setPageInfo({...pageInfo})
  }
  /* 列表条数切换 */
  const onSizeChange = (page,pageSize) => {
    pageInfo.pageNum = page
    pageInfo.pageSize = pageSize
    setPageInfo({...pageInfo})
    onPageTotal()
  }
  /* 显示条数 */
  const onPageTotal = (total, range) => {
    return `共${userGroupList.total}条记录 第 ${userGroupList.pageNum} / ${userGroupList.totalPage?userGroupList.totalPage:1}  页`
  }
  /* 获取单选数据 */
  const rowSelection = {
    selectedRowKeys:selectedRowKeys,
    selectedRows:selectedRows,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
      setSelectedRows(selectedRows)
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <>
      <Modal
        width={820}
        title="选择人群"
        maskClosable={false}
        visible={visible}
        footer={null}
        onOk={handleOk} 
        onCancel={handleCancel}>
          <div className={style.search_content}>
            <span>群组名称：</span>
            <Input onChange={groupNameChange} allowClear placeholder="请输入群组名称"/>
            <Button type="primary" onClick={getUserGroupList}>搜索</Button>
          </div>
          <Table
            locale={{ emptyText: '暂无数据' }}
            columns={renderColumns()}
            dataSource={userGroupList.list}
            rowSelection={{
              preserveSelectedRowKeys:true,
              type: 'checkBox',
              ...rowSelection,
            }}
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
              current={pageInfo.pageNum}
              defaultPageSize={userGroupList.pageSize}
              total={userGroupList.total}
              onChange={handleTableChange}
              showSizeChanger 
              pageSizeOptions={['10', '20', '30', '60']}
              onShowSizeChange={onSizeChange}
              showTotal={onPageTotal}
            />
          </ConfigProvider>
          <div className={style.footer_content}>
             <div className={style.select_name}>
                已选择{selectList.length}个群组{selectList.length>0?`：${selectNameStr}`:''}
              </div>
              <div  className={style.btn_content}>
                <Button onClick={handleCancel}>取消</Button>
                <Button onClick={handleOk} type="primary" style={{marginLeft:'10px'}}>保存</Button>
              </div>
          </div>
      </Modal>
    </>
  )
};
export default connect(({ }) => ({
}))(peopleSelectModel)
