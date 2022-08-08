import React,{useEffect, useState} from 'react';
import { connect, history } from 'umi';
import style from './style.less';
import { Form, Input, Table, Row,Col, Space, Select, Button, DatePicker, Modal, message } from "antd";
const { Column } = Table;
const { RangePicker } = DatePicker;

import {formatDate} from '@/utils/date'
import ModalBox from '../components/modal'
import BottomArea from "@/components/commonComp/BottomArea"; //底部区域组件
const ConfigureChildMenu = (props) =>{
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
          objectId: history.location.query.objectId,
          wechatAppId: history.location.query.wechatAppId
        }
      },
      callback: (res) => {
        console.log(res)
      }
    });
  },[callList])
  const backHome=()=>{
    window.history.go(-1);
  }
  return (
    <>
      <div className={style.account}>
        <div className={style.tableData_title}>结果列表
          <div className={style.tableData_btn1}>
            <span style={{color:'#999','font-weight':'normal','font-size':'14px','padding-right':'20px'}}>子菜单最多创建五个</span>
            {menuInfo.length<5?<Button type="primary" onClick={() => {setMdalInfo({modalName: 'addMenu', type:'add2'})}}>新增</Button>:''}
          </div>
        </div>
        <div className={style.tableData}>
          <Table pagination={false} dataSource={menuInfo}  scroll={{x:1000}}>
            <Column title="菜单等级" dataIndex="parentId" align="center" key="parentId" render={(text, record)=> (
              <Space size="middle">{ record.parentId==0 ? '主菜单' : '子菜单'}</Space>
            )}/>
            <Column title="排序" dataIndex="menuOrder" key="menuOrder" align="center" />
            <Column title="名称" dataIndex="menuName" key="menuName" align="center" />
            <Column title="所属主菜单" dataIndex="parentMenuName" key="parentMenuName" align="center" />
            <Column title="内容" dataIndex="menuEventMessageContent" key="menuEventMessageContent" align="center" />
            <Column title="类型" dataIndex="menuTypeName" key="menuTypeName" align="center" />
            <Column title="创建时间" dataIndex="createTime" key="createTime" align="center" render={(text, record) => (
              <Space size="middle">{formatDate(record.createTime)}</Space>
            )} />
            <Column width={330} title="操作" key="id" align="center" fixed="right"
              render={(text, record) => (
                <div className={style.tab_btn_box}>
                  <a onClick={() => {setMdalInfo({modalName: 'editMenu', type:'edit2', ...record})}}>编辑</a>
                  <span></span>
                  <a onClick={() => {setMdalInfo({modalName: 'deleteChildMenu',...record})}}>删除</a>
                </div>
              )} />
          </Table>
        </div>
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
}))(ConfigureChildMenu);