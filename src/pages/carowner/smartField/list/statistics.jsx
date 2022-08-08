import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Form, Image, Table,Button,Modal, message
} from "antd";
import { ListTable,ListTitle,MoneyFormat,ListTableBtns,LtbItem,
  TypeTags,StateBadge,} from "@/components/commonComp/index";
import StatisticsDetail from './statisticsDetail';
import {formatDate, formatTime} from '@/utils/date'
const {Column} = Table;
let rowOption = [];
let compData={};
import style from "./statistics.less";
import BottomArea from "@/components/commonComp/BottomArea"; //底部区域组件
const tokenObj = localStorage.getItem('tokenObj') ? JSON.parse(localStorage.getItem('tokenObj')) : {};
const modal = (props) => {
  const { dispatch } = props;

  let [form] = Form.useForm();
  const [showWin,setShowWin] = useState(false);
  const [list,setList] = useState([]);
  const [total,setTotal] = useState(0);
  const [pageInfo,setPageInfo] = useState({
    pageNo: 1,
    pageSize: 9999
  });
  const [detailObj,setDetailObj] = useState({});

  const getList=()=>{
    dispatch({
      type: 'smartField_model/fieldStatistics',
      payload: {
        method:'get',
        id:history.location.query.id
      },
      callback:(res)=>{
        if(res.result.code == '0' && res.body){
          setDetailObj(res.body || {})
          setList(res.body.contentStatistics || []);
        }
      }
    })
  }

  useEffect(()=>{
    getList();
  },[pageInfo])

  //分页切换
  const handleTableChange = (current,pageSize) => {
    let _obj = JSON.parse(JSON.stringify(pageInfo));
    _obj.pageNo = current;
    _obj.pageSize = pageSize;
    setPageInfo(_obj)
  }
  const backHome=()=>{
    window.history.go(-1);
  }
  //查看更多
  const showMore=(record)=>{
    compData = record;
    setShowWin(true);
  }

  return (
    <>
      <div className={style.detail_block}>
        <ListTitle titleName="栏位信息" style={{'border-bottom': '1px solid #f0f0f0'}}></ListTitle>
        <div className={style.word_box}>
          <div className={style.word_item}>
            <div className={style.word_name}>栏位名称</div>
            <div className={style.word_info}>{detailObj.fieldName}</div>
          </div>
          <div className={style.word_item}>
            <div className={style.word_name}>栏位类型</div>
            <div className={style.word_info}>
              {detailObj.fieldType==1?<TypeTags type="green">通用</TypeTags>:''}
              {detailObj.fieldType==2?<TypeTags type="red">千人千面</TypeTags>:''}
            </div>
          </div>
          <div className={style.word_item}>
            <div className={style.word_name}>内容数量</div>
            <div className={style.word_info}>{detailObj.contentCount}</div>
          </div>
          <div className={style.word_item}>
            <div className={style.word_name}>状态</div>
            <div className={style.word_info}>
              {detailObj.status==1?<StateBadge type="red">未启用</StateBadge>:''}
              {detailObj.status==2?<StateBadge type="green">启用</StateBadge>:''}  
            </div>
          </div>
          <div className={style.word_item}>
            <div className={style.word_name}>更新时间</div>
            <div className={style.word_info}>{detailObj.updateTime && formatTime(detailObj.updateTime)}</div>
          </div>
          <div className={style.word_item}>
            <div className={style.word_name}>操作人</div>
            <div className={style.word_info}>{detailObj.updateUser}</div>
          </div>
          <div className={style.word_item} style={{flex: '0 0 100%',}}>
            <div className={style.word_name}>备注</div>
            <div className={style.word_info}>{detailObj.remark}</div>
          </div>
        </div>
      </div>
      <div className={style.table_box}>
        <ListTitle titleName="数据统计"  ></ListTitle>
        <ListTable showPagination={false}  current={pageInfo.pageNo} pageSize={pageInfo.pageSize} total={total}>
          <Table pagination={false} dataSource={list} >
            <Column title="内容" dataIndex="contentName" />
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
            <Column title="场景明细" render={(text, record) => (
              <ListTableBtns>
                <LtbItem onClick={()=>{showMore(record)}}>查看更多</LtbItem>
              </ListTableBtns>
            )}/>
          </Table>
        </ListTable>
      </div>
        
      {showWin ? <StatisticsDetail compData={compData} closeEvent={()=>{setShowWin(false)}} /> : ''}
      <BottomArea>
        <Button onClick={backHome}>返回</Button>
      </BottomArea>
    </>
  )
};
export default connect(({  }) => ({
  
}))(modal)
