//变更记录
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import styles from './styles.less';
import {
  Table,
} from "antd";
import { QueryFilter} from '@ant-design/pro-form';

import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const ChangeRecord = (props) => {
  const { historyData, dispatch } = props;
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const {Column, showTotal} = Table
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }

  }, []);

  // 查询用户群
  const getUserGroupList = () => {
    let data = {
      pageNum: current,
      pageSize: pageSize,
    }
    dispatch({
      type: 'setTagHistory/getHistoryData',
      payload: {
        method: 'get',
        params: data
      },
    });
  }

  //条件查询
  useEffect(() => {
    getUserGroupList()
  }, [pageSize, current]);

  //分页切换
  const handleTableChange = (page, pageSize) => {
    setCurrent(page)
    setPageSize(pageSize)
  }


  return (
    <>
    <div className={styles.list_box}>
      <ListTitle titleName="变更记录">
      </ListTitle>
      <ListTable showPagination current={current} pageSize={pageSize} total={historyData.total}
      onChange={handleTableChange} 
      >
        <Table dataSource={historyData.list} scroll={{x:1000}} pagination={false}>
        <Column title="操作" dataIndex="operateName" key="operateName" />
        <Column title="调整时间" dataIndex="createTime" key="createTime" 
        render={(text, record)=>(
          <ListTableTime>{text}</ListTableTime>
        )}/>
        <Column title="标签名称" dataIndex="tagInfoName" key="tagInfoName" />
        <Column title="提示" dataIndex="prompt" key="prompt" />
        <Column title="账号" dataIndex="createUserName" key="createUserName" />
        </Table>
      </ListTable>
    </div>
    </>
    
  )
}
export default connect(({ loading, setTagHistory }) => ({
  loading: loading.effects['user/fetchCurrent'],
  historyData: setTagHistory.historyData
}))(ChangeRecord);
