import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Form, Image, Table,Button,Modal, message
} from "antd";
import { ListTable,ListTitle,MoneyFormat,ListTableBtns,LtbItem,
  TypeTags,StateBadge,} from "@/components/commonComp/index";
const {Column} = Table;
let rowOption = [];
let compData={};
import style from "./statistics.less";
import BottomArea from "@/components/commonComp/BottomArea"; //底部区域组件
const tokenObj = localStorage.getItem('tokenObj') ? JSON.parse(localStorage.getItem('tokenObj')) : {};
const modal = (props) => {
  const { dispatch,compData,closeEvent } = props;

  let [form] = Form.useForm();
  const [list,setList] = useState([]);
  const [total,setTotal] = useState(0);
  const [pageInfo,setPageInfo] = useState({
    pageNo: 1,
    pageSize: 9999
  });
  const [detailObj,setDetailObj] = useState({});

  const getList=()=>{
    console.log(compData)
    dispatch({
      type: 'smartField_model/contentStatistics',
      payload: {
        method:'get',
        id: compData.objectId,
      },
      callback:(res)=>{
        if(res.result.code == '0' && res.body){
          setDetailObj(res.body || {})
          setList(res.body.pageStatistics || []);
        }
      }
    })
  }

  //分页切换
  const handleTableChange = (current,pageSize) => {
    let _obj = JSON.parse(JSON.stringify(pageInfo));
    _obj.pageNo = current;
    _obj.pageSize = pageSize;
    setPageInfo(_obj)
  }

  useEffect(()=>{
    getList();
  },[pageInfo])
  
  //查看更多
  const handleCancel=()=>{
    closeEvent();
  }

  return (
    <Modal title={'查看更多'} width={1200} visible={true} centered maskClosable={false} onCancel={handleCancel} footer={false} bodyStyle={{padding: 0,}}>
      <div className={style.statisticsDetail}>
        <ListTitle titleName="内容明细"  ></ListTitle>
        <div className={style.detail_block}>
          <div className={style.word_box}>
            <div className={style.word_item}>
              <div className={style.word_name}>内容名称</div>
              <div className={style.word_info}>{detailObj.contentName}</div>
            </div>
            <div className={style.word_item}>
              <div className={style.word_name}>曝光数</div>
              <div className={style.word_info}><MoneyFormat prefix="" style={{textAlign:'left',}}>{detailObj.exposureNumber}</MoneyFormat></div>
            </div>
            <div className={style.word_item}>
              <div className={style.word_name}>点击人次</div>
              <div className={style.word_info}><MoneyFormat prefix="" style={{textAlign:'left',}}>{detailObj.clickHitNumber}</MoneyFormat></div>
            </div>
            <div className={style.word_item}>
              <div className={style.word_name}>点击人数</div>
              <div className={style.word_info}><MoneyFormat prefix="" style={{textAlign:'left',}}>{detailObj.clickNumber}</MoneyFormat></div>
            </div>
            <div className={style.word_item}>
              <div className={style.word_name}>点击率</div>
              <div className={style.word_info}>{detailObj.clickRate}%</div>
            </div>
          </div>
        </div>
        <div className={style.table_box}>
          <ListTitle titleName="数据统计"  ></ListTitle>
          <ListTable showPagination={false}  current={pageInfo.pageNo} pageSize={pageInfo.pageSize} total={total}
          onChange={handleTableChange}>
            <Table pagination={false} dataSource={list} >
              <Column title="调用页面" dataIndex="pageName" />
              <Column title="曝光数" dataIndex="exposureNumber"  />
              <Column title="点击人次" dataIndex="clickHitNumber" render={(text, record) => (
                <MoneyFormat prefix="" style={{textAlign:'left',}}>{text}</MoneyFormat>
              )}/>
              <Column title="点击人数" dataIndex="clickNumber" render={(text, record) => (
                <MoneyFormat prefix="" style={{textAlign:'left',}}>{text}</MoneyFormat>
              )}/>
              <Column title="点击率" dataIndex="clickRate"  render={(text, record) => (
                <>{Number(text)}%</>
              )}/>
            </Table>
          </ListTable>
        </div>
      </div>
    </Modal>
  )
};
export default connect(({  }) => ({
  
}))(modal)
