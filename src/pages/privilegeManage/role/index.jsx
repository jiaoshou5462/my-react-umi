import React,{useEffect, useState} from 'react';
import { connect } from 'umi';
import style from './style.less';
import { Form, Input, Table, Row,Col, Space, Button, DatePicker, Modal,ConfigProvider,Pagination,message } from "antd";
const { Column } = Table;
const { RangePicker } = DatePicker;
import { QueryFilter} from '@ant-design/pro-form';

import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";
import {formatDate, formatTime} from '@/utils/date'
import ModalBox from './components/modal';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

const Role = (props) =>{
  const {dispatch} = props;
  let [form] = Form.useForm()

  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filterData, setFilterData] = useState({})
  const [callList, setCallList] = useState(false);
  //Modal数据
  const [modalInfo, setMdalInfo] = useState('');
  const [roleList,setRoleList]=useState([]);
  const [pageTotal, setPageTotal] = useState(1); // 列表
  const [payload, setPayload] = useState({
    pageNo:1,
    pageSize,
  })

  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) => {
    let _payload = JSON.parse(JSON.stringify(payload));
    _payload.pageNo = page
    _payload.pageSize = pageSize
    setPayload(_payload)
    setPageSize(pageSize)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    let _payload = JSON.parse(JSON.stringify(payload));
    _payload.pageNo = page
    _payload.pageSize = pageSize
    setPageSize(pageSize)
    setPayload(_payload)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${payload.pageNo} / ${totalPage}  页`
  }
  
  //modal回调
  const callModal = (flag) => {
    console.log(flag)
    setMdalInfo('')
    if(flag) {
      setQueryRoleList();
      if(typeof flag == 'object') {
        setMdalInfo({modalName: 'configRole', ...flag})
      }
    }
  }

  //表单提交
  const submitData = (val) => {
    setFilterData(JSON.parse(JSON.stringify(val)))
    let topayload=payload;
    topayload.pageNo=1;
    setPayload({...topayload})
     setPageSize(10)
  }
  //表单重置
  const resetForm = () => {
    form.resetFields();
    setFilterData({...{}})
    let topayload=payload;
    topayload.pageNo=1;
    setPayload({...topayload});
    setPageSize(10)
  }
  useEffect(() => {
    setQueryRoleList();
  }, [pageSize, payload])
  //列表接口
  let setQueryRoleList=()=>{
    let query = JSON.parse(JSON.stringify(filterData))
    if(query.date) {
      query.startDateTime = formatDate(query.date[0])
      query.endDateTime = formatDate(query.date[1])
    }
    delete query.date
    dispatch({
      type: 'roleManage/getQueryRoleList',
      payload: {
        method: 'get',
        params: {
          pageNum: payload.pageNo,
          pageSize: pageSize,
          ...query
        }
      },
      callback:(res)=>{
        if(res.result.code === "0"){
          let tores=res.body;
          setRoleList([...tores.list])
          setPageTotal(tores.total)
        }else{
          message.error(res.result.message)
        }
      }
    });
  }

  return(
    <>
    <div className={style.filter_box}>
      <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={submitData} onReset={resetForm}>
        <Form.Item label="角色名称：" name="roleName" labelCol={{flex: '0 0 120px'}}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="创建时间：" name="date" labelCol={{flex:'0 0 120px'}}>
          <RangePicker placeholder={['开始时间', '结束时间']} style={{width: '100%'}} format="YYYY-MM-DD"
          />
        </Form.Item>
      </QueryFilter>
    </div>
    <div className={style.list_box}>
      <ListTitle titleName="结果列表">
        <Space size={8}>
          <Button onClick={()=> {setMdalInfo({modalName: 'addRole'})}} type='primary'>新增</Button>
        </Space>
      </ListTitle>
      <ListTable showPagination current={payload.pageNo} pageSize={pageSize} total={pageTotal}
      onChange={onNextChange} 
      >
        <Table dataSource={roleList} scroll={{x:1200}} pagination={false}>
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="角色名称" dataIndex="name" key="name" />
        <Column title="关联账号（个）" dataIndex="userRelNm" key="userRelNm" />
        <Column title="数据权限" dataIndex="dataRoleName" key="dataRoleName" 
        render={(text, record) => (
          <span>{text?text:'--'}</span>
        )}/>
          <Column title="创建时间" dataIndex="createTime" key="createTime" 
          render={(text, record)=>{
            let time = formatTime(text);
            return <ListTableTime>{time}</ListTableTime>
          }}/>
          <Column title="状态" dataIndex="isEnable" key="isEnable" 
          render={(text, record)=>(<>
            {text==1?<StateBadge type="green">{record.isEnable==1?'已启用':'已停用'}</StateBadge>:<StateBadge type="red">{record.isEnable==1?'已启用':'已停用'}</StateBadge>}
          </>)}/>
          <Column title="操作"  key="id" fixed="right" width={300}
          render={(text, record)=>(
            <ListTableBtns showNum={3}>
              {!record.superRole ? <>
                {record.isEnable == 1  ? <LtbItem onClick={() => {setMdalInfo({modalName: 'banRole',roleStatus: 0, ...record})}}>停用</LtbItem> 
                : <LtbItem onClick={() => {setMdalInfo({modalName: 'banRole',roleStatus: 1, ...record})}}>启用</LtbItem>}
                <LtbItem onClick={() => {setMdalInfo({modalName: 'putRole', ...record})}}>修改</LtbItem>
              </> : ''}
              <LtbItem onClick={() => {setMdalInfo({modalName: 'configRole', ...record})}}>配置权限</LtbItem>
              <LtbItem onClick={() => {setMdalInfo({modalName: 'accountRole', ...record})}}>分配账号</LtbItem>
              {
                !record.superRole && record.isEnable=='0'?
                <LtbItem onClick={()=> {Number(record.userRelNm) > 0? Modal.error({title: '提示',content: '当前角色存在关联账号，无法删除！',}): setMdalInfo({modalName: 'delRole', ...record})}}>删除</LtbItem> : ''}
            </ListTableBtns> 
          )}/>
        </Table>
      </ListTable>
    </div>
      {modalInfo?<ModalBox modalInfo={modalInfo} toFatherValue={(flag)=>callModal(flag)} />:''}
    </>
  )
}
export default connect(({ roleManage }) => ({
  // roleList: roleManage.roleList
}))(Role);