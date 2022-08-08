import React,{useEffect, useState} from 'react';
import { connect } from 'umi';
import style from './style.less';
import { Form, Input, Table, Select, Row, Space, Button,Col,ConfigProvider,Pagination,message,Cascader} from "antd";
const { Column } = Table;

import {formatDate} from '@/utils/date';
import ModalBox from './components/modal';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { QueryFilter} from '@ant-design/pro-form';

import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";
const { Option, OptGroup } = Select;
let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));
// 构建树
const eachTreeList = (treeList) => {
  let _treeList = [];
  for (let item of treeList) {
    let obj = {
      ...item,
      value:item.id,
      label:item.name,
    };

    if (item.childOrganizations.length) {
      obj.children = eachTreeList(item.childOrganizations);
    }
    _treeList.push(obj);
  }
  return _treeList;
}
const Account = (props) =>{
  const {dispatch} = props;
  let [form] = Form.useForm()

  const [filterData, setFilterData] = useState({})
  const [callList, setCallList] = useState(false);
  const [pageTotal, setPageTotal] = useState(1); // 列表
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [accountList,setAccountList]= useState([]);
  //Modal数据
  const [modalInfo, setMdalInfo] = useState('');
  //所属子机构
  const [institutionList, setInstitutionList] = useState([]);
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
    setMdalInfo('')
    if(flag) {
      setQueryUserList();
      if(typeof flag == 'object') {
        setMdalInfo({modalName: 'roleAccount', ...flag})
      }
    }
  }

  //表单提交
  const submitData = (val) => {
    let toVal=val;
    if(toVal.orgId && toVal.orgId.length>0){
      toVal.orgId=toVal.orgId[toVal.orgId.length-1];
    }else{
      toVal.orgId=null;
    }
    setFilterData(JSON.parse(JSON.stringify(toVal)))
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
    setQueryUserList();
  }, [pageSize, payload])
  //列表接口
  let setQueryUserList=()=>{
    dispatch({
      type: 'accountManage/getQueryUserList',
      payload: {
        method: 'get',
        params: {
          pageNum: payload.pageNo,
          pageSize: pageSize,
          ...filterData
        }
      },
      callback:(res)=>{
        if(res.result.code === "0"){
          let tores=res.body;
          setAccountList([...tores.list])
          setPageTotal(tores.total)
        }else{
          message.error(res.result.message)
        }
      }
    });
  }
  useEffect(() => {
    queryList();
  },[])

   //查询组织机构列表
   const queryList = () => {
    dispatch({
      type: 'combination/queryList',
      payload: {
        method: 'postJSON',
        params: {
          platformType: 'channel',
          channelId: tokenObj.channelId
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {
          let info=res.body;
          if(info.channelOrganizations && info.channelOrganizations.length>0){
            let tree = eachTreeList(info.channelOrganizations[0].childOrganizations);
            setInstitutionList([...tree]);
          }else{
            setInstitutionList([...[]]);
          }
        } else {
          message.error({ content: res.result.message })
        }
      }
    })
  }
  

  return(
    <>
    <div className={style.filter_box}>
      {/* 为了方便迁移，这里可以直接使用Form.Item内嵌的方式 */}
      <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={submitData} onReset={resetForm}>
        <Form.Item label="账号ID" name="userId" labelCol={{flex: '0 0 120px'}}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="用户姓名" name="userName" labelCol={{flex: '0 0 120px'}}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="手机号" name="phoneNo" labelCol={{flex: '0 0 120px'}}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="状态" name="userStatus" labelCol={{flex: '0 0 120px'}}>
          <Select placeholder="不限">
            <Option value="1">已启用</Option>
            <Option value="2">已停用</Option>
          </Select>
        </Form.Item>
        <Form.Item label="所属子机构" name="orgId" labelCol={{flex: '0 0 120px'}}>
          <Cascader
            options={institutionList}
            placeholder="请选择子机构"
            showSearch
            onSearch={value => console.log(value)}
            changeOnSelect 
          />
        </Form.Item>
      </QueryFilter>
    </div>
    <div className={style.list_box}>
      <ListTitle titleName="结果列表">
        <Space size={8}>
          <Button type='primary' onClick={()=> {setMdalInfo({modalName: 'addAccount'})}}>新增</Button>
        </Space>
      </ListTitle>
      <ListTable showPagination current={payload.pageNo} pageSize={pageSize} total={pageTotal}
      onChange={onNextChange} 
      >
        <Table dataSource={accountList} scroll={{x:1200}} pagination={false}>
          <Column title="账号ID" dataIndex="userId" key="userId" />
          <Column title="用户姓名" dataIndex="userName" key="userName" />
          <Column title="手机号" dataIndex="phone" key="phone" />
          <Column title="关联角色（个）" dataIndex="roleRelNm" key="roleRelNm" />
          <Column title="所属子机构" dataIndex="orgName" key="orgName" 
          render={(text, record) => (
            <span>{text?text:'-'}</span>
          )}/>
          <Column title="创建时间" dataIndex="createTime" key="createTime" 
          render={(text, record)=>(
            <ListTableTime>{text}</ListTableTime>
          )}/>
          <Column title="状态" dataIndex="isEnable" key="isEnable" 
          render={(text, record)=>(<>
            {text==1?<StateBadge type="green">{record.isEnable==1?'已启用':'已停用'}</StateBadge>:<StateBadge type="red">{record.isEnable==1?'已启用':'已停用'}</StateBadge>}
          </>)}/>
          <Column title="操作"  key="id" fixed="right" width={230}
          render={(text, record)=>(
            <ListTableBtns showNum={3}>
              {record.isEnable == 1 ? <LtbItem onClick={() => {setMdalInfo({modalName: 'banAccount',userStatus: 0, ...record})}}>停用</LtbItem> 
              : <LtbItem onClick={() => {setMdalInfo({modalName: 'banAccount',userStatus: 1, ...record})}}>启用</LtbItem>}
              <LtbItem onClick={() => {setMdalInfo({modalName: 'putAccount', ...record})}}>修改</LtbItem>
              <LtbItem onClick={() => {setMdalInfo({modalName: 'roleAccount', ...record})}}>分配角色</LtbItem>
            </ListTableBtns> 
          )}/>
        </Table>
      </ListTable>
    </div>
      {modalInfo?<ModalBox modalInfo={modalInfo} institutionList={institutionList} toFatherValue={(flag)=>callModal(flag)} />:''}
    </>
  )
}
export default connect(({ accountManage }) => ({
  // accountList: accountManage.accountList
}))(Account);