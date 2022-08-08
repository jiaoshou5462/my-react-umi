import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import {
  Form,
  Input,
  Table,
  Select,
  Button,
  Badge,
  Pagination,
  Modal,
  Tooltip,
  message,
} from "antd"
const { Option } = Select
import { FormOutlined,ExclamationCircleOutlined,StopOutlined,
  SendOutlined,EyeOutlined,LinkOutlined,DeleteOutlined} from '@ant-design/icons';
import style from "./style.less";

import Preview from './components/preview'
let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));
const pageManage = (props) => {
  let { pageList, pageTotal, allChannelList, dispatch,listFormSave} = props;
  let [pageNo, setPageNo] = useState(listFormSave.pageNo);
  let [pageSize, setPageSize] = useState(12);
  let [pageName, setPageName] = useState('');
  let [anew, setAnew] = useState(false);
  const [showPreview,setShowPreview] = useState(false);

  //modal数据
  let [modalInfo, setModalInfo] = useState('')
  //表单提交
  const searchBtn = ()=>{
    setPageNo(1)
    setPageSize(12)
    setAnew(!anew)
  }
  
  //分页切换
  const handleTableChange = (current,pageSize) => {
    setPageNo(current)
    setPageSize(pageSize)
    setAnew(!anew)
  }

  //渠道筛选
  const screenChannel = (id) => {
    if(allChannelList && allChannelList.length) {
      let nameList = allChannelList.filter( v => {
        return v.channelId == id
      })
      return nameList.length ? nameList[0].channelName : '';
    }
  }
  
  //设为主页
  const setHome = async (obj)=>{
    //首先判断是否已存在主页
    await setHomeCheck(obj);
    dispatch({
      type: 'carowner_pageManage/updatePageForHome',
      payload: {
        method: 'postJSON',
        params: {
          objectId: obj.objectId,
          homeFlag: '1',
          pageChannelId: tokenObj.channelId
        }
      },
      callback:(res)=>{
        if(res.code=='S000000'){
          message.success('设置成功');
          getPageListData();
        }
      }
    })
  }
  //设置主页前检查
  const setHomeCheck=(obj)=>{
    return new Promise((resolve,reject)=>{
      dispatch({
        type: 'carowner_pageManage/existHomeFlag',
        payload: {
          method: 'get',
          params: {
            pageChannelId:tokenObj.channelId,
          }
        },
        callback:(res)=>{
          if(res.code=='S000000'){
            if(res.data==1){//已有主页
              Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                content: '该渠道下已有主页，是否选择当前页面替换？',
                okText: '确认',
                cancelText: '取消',
                onOk:()=>{
                  resolve();
                }
              });
            }else{
              resolve();
            }
          }
        }
      })
    })
  }
  
  //获取列表
  const getPageListData = ()=>{
    dispatch({
      type: 'carowner_pageManage/getPageListData',
      payload: {
        method: 'postJSON',
        params: {
          pageChannelId: tokenObj.pageChannelId,
          pageName:pageName,
          pageInfo: {
            pageNo: pageNo,
            pageSize: pageSize,
            totalCount: 0,
            totalPage: 0,
          }
        }
      }
    })
  }
  useEffect(() => {
    getPageListData();
  },[anew])

  useEffect(() => {
    setPageName(listFormSave.pageName)
  },[])

  //装修页面
  const editPage = (record)=>{
    //情况详情缓存
    dispatch({
      type: 'carowner_pageManage/clearDetail',
      payload: {},
    });
    dispatch({//设置分页缓存
      type: 'carowner_pageManage/setListFormSave',
      payload: {
        pageName: pageName,
        pageNo: pageNo,
      }
    });
    if(record=='add'){
      history.push(`/carowner/platform/pageManage/detail`)
    }else{
      let pageNameUnique = record.pageNameUnique?`&pageNameUnique=${record.pageNameUnique}`:''
      history.push(`/carowner/platform/pageManage/detail?pageId=${record.objectId}${pageNameUnique}`)
    }
  }
  const preClick = (item,type)=>{
    setModalInfo({
      ...item,
      modalType:type,
    });
    setShowPreview(true);
  }
  //启用停用
  const updEnableStatus=(item)=>{
    Modal.confirm({
      content:'是否停用该页面？',
      onOk:()=>{
        dispatch({//设置分页缓存
          type: 'carowner_pageManage/updEnableStatus',
          payload: {
            method: 'postJSON',
            params: {
              "enableStatus": 1,
              "objectId":item.objectId
            }
          },
          callback: (res) => {
            if(res.code == 'S000000') {
              message.success('操作成功');
              getPageListData();
            }
          }
        });
      }
    })
  }
  //发布页面
  const publishPage = (item) => {
    Modal.confirm({
      content:'您确定要发布页面吗？',
      onOk:()=>{
        dispatch({
          type: 'carowner_pageManage/publishPageData',
          payload: {
            method: 'post',
            params: {
              objectId: item.objectId,
            }
          },
          callback: (res) => {
            if(res.code == 'S000000') {
              setModalInfo({
                ...item,
                modalType:'publish',
              });
              setShowPreview(true);
              getPageListData();
            }
          }
        })
      }
    })
  }
  //删除页面
  const delPage = (item) => {
    Modal.confirm({
      content:'您确定要删除页面吗？',
      onOk:()=>{
        dispatch({
          type: 'carowner_pageManage/delPageData',
          payload: {
            method: 'post',
            params: {
              objectId: item.objectId,
            }
          },
          callback: (res) => {
            if(res.code == 'S000000') {
              message.success('删除成功');
              getPageListData();
            }
          }
        })
      }
    })
  }

  return (
    <>
      <div className={style.block__cont}>
        <div className={style.listTitle}>
          <span>结果列表</span>
        </div>
        <div className={style.content_box}>
          <div className={style.search_box}>
            <div className={style.add_box}>
              <Button htmlType="button" type="primary" onClick={()=> {editPage('add')}}>新建页面</Button>
            </div>
            <div className={style.input_box}>
              <Input placeholder="请输入" value={pageName} onChange={(e)=>{setPageName(e.target.value)}}
              style={{flex:'auto',marginRight:'8px'}}></Input>
              <Button htmlType="submit" type="primary" onClick={searchBtn} >查询</Button>
            </div>
          </div>
          <div className={style.card_box}>
            {pageList.map((item)=>{
              return <div className={style.card_col}>
                <div className={style.card_item}>
                  <div className={style.card_top} style={{background: item.pageType==1?'#4B7FE8':'#FF724D'}}>
                    <div className={style.card_name}>{item.pageName} (ID:{item.objectId})</div>
                    <div className={style.card_status}>{item.pageStatusName}</div>
                  </div>
                  <div className={style.card_content}>
                    <div className={style.card_block}>
                      <img src={require(`@/assets/carowner/list_icon1.png`)} alt="" />
                      <div className={style.card_block_info}>
                        <span>页面简介</span>
                        <p>{item.pageDescribe || '暂无'}</p>
                      </div>
                    </div>
                    <div className={style.card_block}>
                      <img src={require(`@/assets/carowner/list_icon2.png`)} alt="" />
                      <div className={style.card_block_info}>
                        <span>操作人</span>
                        <p>{item.updateUser}</p>
                      </div>
                    </div>
                    <div className={style.card_block}>
                      <img src={require(`@/assets/carowner/list_icon3.png`)} alt="" />
                      <div className={style.card_block_info}>
                        <span>更新时间</span>
                        <p>{item.updateTime}</p>
                      </div>
                    </div>
                  </div>
                  <div className={style.card_handler}>
                    <div className={style.card_handler_item} onClick={()=>{editPage(item)}}>
                      <div><FormOutlined /> 装修</div>
                    </div>
                    {item.pageStatus != '2' ? <div className={style.card_handler_item}>
                      <div onClick={()=>{preClick(item,'pre')}}><EyeOutlined /> 预览</div>
                    </div>:''}
                    {item.pageStatus != '2' ? <div className={style.card_handler_item}>
                      <div onClick={() => {publishPage(item)}} >
                        <SendOutlined /> 发布
                      </div>
                    </div>:''}
                    {item.pageStatus != '1' ? <div className={style.card_handler_item}>
                      <div onClick={()=>{preClick(item,'check')}}><LinkOutlined /> 查看</div>
                    </div>:''}
                    {item.pageType=='2' && item.pageStatus!='1'?<div className={style.card_handler_item}>
                      <div onClick={()=>{updEnableStatus(item)}}>
                        <StopOutlined /> 停用
                      </div>
                    </div>:''}
                    {item.pageType=='2' && item.pageStatus=='1'?<div className={style.card_handler_item}>
                      <div onClick={() => {delPage(item)}}>
                        <DeleteOutlined /> 删除
                      </div>
                    </div>:''}
                  </div>
                  
                </div>
              </div>
            })}
          </div>
          <div className={style.page_box}>
            <Pagination showQuickJumper showSizeChanger current={pageNo} total={pageTotal} onChange={handleTableChange} 
            pageSizeOptions={[12,24,36,48]} defaultPageSize={12} pageSize={pageSize}/>
          </div>
        </div> 
      </div>
      <Preview showPreview={showPreview} modalInfo={modalInfo} closeModal={e=>{setShowPreview(e)}}/>
    </>
  )
}


export default connect(({ carowner_pageManage }) => ({
  pageList: carowner_pageManage.pageList,
  pageTotal: carowner_pageManage.pageTotal,
  allChannelList: carowner_pageManage.allChannelList,
  listFormSave: carowner_pageManage.listFormSave,
}))(pageManage)







