import React,{useEffect, useState} from 'react';
import { connect,history } from 'umi';
import style from './style.less';
import { Form, Input, Table, Row,Col, Space, Select, Button, DatePicker, Modal, message } from "antd";
const { Column } = Table;
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, ListTableTime,} from "@/components/commonComp/index";

import {formatDate} from '@/utils/date'
import ModalBox from '../components/modal'
import BottomArea from "@/components/commonComp/BottomArea"; //底部区域组件
const ConfigureMenu = (props) =>{
  const { dispatch, menuInfo} = props;
  //Modal数据
  const [modalInfo, setMdalInfo] = useState('');
  const [callList, setCallList] = useState(false);// 控制列表的刷线
  //modal回调
  const callModal = (flag) => {
    setMdalInfo('')
    if(flag) {
      setCallList(!callList);
    }
  }
  // 菜单查询
  useEffect(()=> {
    dispatch({
      type: 'configureManage/wechatAppMenuSetting',
      payload: {
        method: 'postJSON',
        params: {
          wechatAppId: history.location.query.wechatAppId
        }
      }
    });
  },[callList])
  const backHome=()=>{
    window.history.go(-1);
  }
  return (
    <>
      <div className={style.list_box}>
        <ListTitle titleName="结果列表">
          <span style={{color:'#999','padding-right':'20px'}}>主菜单最多创建三个</span>
          <Space size={8}>
            {menuInfo.length<3?<Button type="primary" onClick={() => {setMdalInfo({modalName: 'addMenu',type:'add1'})}}>新增</Button>:''}
          </Space>
        </ListTitle>
        <ListTable showPagination={false}>
            <Table pagination={false} dataSource={menuInfo}  scroll={{x:1200}}>
              <Column title="菜单等级" dataIndex="parentId" key="parentId" render={(text, record)=> (
                <Space size="middle">{ record.parentId==0 ? '主菜单' : '子菜单'}</Space>
              )}/>
              <Column title="排序" dataIndex="menuOrder" key="menuOrder" />
              <Column title="名称" dataIndex="menuName" key="menuName" />
              <Column title="内容" dataIndex="menuEventMessageContent" key="menuEventMessageContent" render={(text, record)=> (
                <>
                {text || "-"}
                </>
              )}/>
              <Column title="类型" dataIndex="menuTypeName" key="menuTypeName" render={(text, record)=> (
                <>
                  {record.menuType==1?<TypeTags type="red">{'使用功能'}</TypeTags>:''}
                  {record.menuType==2?<TypeTags type="blue">{'使用链接'}</TypeTags>:''}
                  {record.menuType==3?<TypeTags type="yellow">{'使用小程序'}</TypeTags>:''}
                  {record.menuType==4?<TypeTags type="green">{'打开二级'}</TypeTags>:''}
                </>
              )}/>
              <Column title="创建时间" dataIndex="createTime" key="createTime" render={(text, record) => (
                <ListTableTime>{formatDate(record.createTime)}</ListTableTime>
              )} />
              <Column width={330} title="操作" key="id" fixed="right"
                render={(text, record) => (
                  <ListTableBtns showNum={3}>
                    {record.menuType==4 ? 
                    <LtbItem onClick={record.menuType==4 ? () => {history.push(`/carowner/officialAccount/configure/childMenu?wechatAppId=${record.wechatAppId}&objectId=${record.objectId}`)} :'return false'}>查看子菜单</LtbItem> : null}
                    <LtbItem onClick={() => {setMdalInfo({modalName: 'editMenu', type: 'edit1', ...record})}}>编辑</LtbItem>
                    <LtbItem onClick={() => {setMdalInfo({modalName: 'deleteParentMenu',...record})}}>删除</LtbItem>
                  </ListTableBtns>
                )} />
            </Table>
        </ListTable>
        {modalInfo?<ModalBox modalInfo={modalInfo} toFatherValue={(flag)=>callModal(flag)} />:''}
      </div>
      <BottomArea>
        <Button onClick={backHome}>返回</Button>
      </BottomArea>
    </>
  )
}
export default connect(({ configureManage }) => ({
  menuInfo: configureManage.menuInfo
}))(ConfigureMenu);