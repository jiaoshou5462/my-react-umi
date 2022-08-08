import React, { useEffect, useState, } from "react"
import { connect, history } from 'umi'
import {
  Table,
  Button,
  Space,
  message
} from "antd"
import { PlusOutlined } from '@ant-design/icons'
import style from "./style.less";
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";
const { Column } = Table;
let rightListPage = (props) => {
  let { dispatch, list } = props;
 

  //编辑跳转
  let editOperation = (record) => {
    history.replace({
      pathname: '/platformBuild/growthSystem/addRight',
      state: {
        objectId: record.id
      }
    })
  }
  //添加权益
  let goToAdd = () => {
    history.replace({
      pathname: '/platformBuild/growthSystem/addRight',
    })
  }

  //-------
  useEffect(() => {
    queryEquityManagementList();
  }, [])
  // 查询列表
  const queryEquityManagementList = () => {
    let params = {
      pageNo: 1,
      pageSize: 100
    };
    dispatch({
      type: 'rightList/queryEquityManagementList',
      payload: {
        method: 'postJSON',
        params: params,
      },
    });
  }
  //删除
  let delOperation = (info) => {
    dispatch({
      type: 'rightList/deleteEquityManagement',
      payload: {
        method: 'get',
        params: {},
        id: info.id,
      }, callback: (res) => {
        if (res.code === '0000') {
          queryEquityManagementList();
        } else {
          message.error(res.message)
        }
      }
    })
  }


  return (
    <>
      <div className={style.block__cont}>
        <ListTitle titleName="权益管理">
          <Button type="primary" onClick={goToAdd}>添加权益</Button>
        </ListTitle>

        <ListTable showPagination={false}>
          <Table dataSource={list} scroll={{x:1200}} pagination={false}>
            <Column title="展示名称" dataIndex="exhibitionName" key="exhibitionName" />
            <Column title="权益" dataIndex="equityTypeStr" key="equityTypeStr" />
            <Column title="权益内部描述" dataIndex="equityDesc" key="equityDesc" render={(text, record)=>(
              <TextEllipsis>{text}</TextEllipsis>
            )}/>
            <Column title="操作"  key="status" fixed="right" width={230}
            render={(text, record)=>(
              <ListTableBtns>
                <LtbItem onClick={() => { editOperation(record) }}>编辑</LtbItem>
                <LtbItem onClick={() => { delOperation(record) }}>删除</LtbItem>
              </ListTableBtns>
            )}/>
          </Table>
        </ListTable>

      </div>
    </>
  )
};
export default connect(({ rightList }) => ({
  list: rightList.list
}))(rightListPage)
