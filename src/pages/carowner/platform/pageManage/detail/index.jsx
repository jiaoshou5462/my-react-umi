import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import { Input, Button, message, Modal,Space,Tabs  } from "antd"
import * as Icon from '@ant-design/icons';
import { ArrowUpOutlined,ArrowDownOutlined,DeleteOutlined } from "@ant-design/icons";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import style from "./style.less";

import CompList from "./components/compList";

import SingleLinePicture from "./components/singleLinePicture";   //单列图0
import CarouselPicture from "./components/carouselPicture";   //轮播图1
import LateralSliding from "./components/lateralSliding";   //横向滑动2
import Titles from "./components/title";   //标题3
import PictureNavigation from "./components/pictureNavigation";   //图文导航4

import GoldPosition from "./components/goldPosition";   //黄金位5
import WindowPosition from "./components/windowPosition";   //橱窗位6
import DoubleRowPicture from "./components/doubleRowPicture";   //双列图7
// import PictureNavigation from "./components/pictureNavigationTitle";   //图文导航标题版  10
import Activity1 from "./components/activity1";   //活动1  8
import Activity2 from "./components/activity2";   //活动2  9
import PartitionFootprint from "./components/partitionFootprint";   //分割占位    13
import ContentType1 from "./components/contentType1";   //内容分类1   11
import ContentType2 from "./components/contentType2";   //内容分类2   12
import UserInfo from "./components/userInfo";   //用户信息        14
import SettingAll from "./components/settingAll";   //整体设置      
import InsuranceSupermarket from "./components/insuranceSupermarket";//保险超市  
import ZktPictureAdvertising from "./components/zktPictureAdvertising";//掌客通-轮播图
import ZktpictureNavigation from "./components/zktpictureNavigation";//掌客通-图文导航 
import ZktNotice from "./components/zktNotice";//掌客通-公告 
import SmartField from "./components/smartField";//智能栏位
import PageContent from "./components/pageContent";//内容

import {no_settingAll_dict} from '@/pages/carowner/platform/pageManage/dict.js'

import {getOnlyId} from "@/utils/utils";   //整体设置    
import BottomArea from "@/components/commonComp/BottomArea"; //底部区域组件
const { TabPane } = Tabs;

let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));
let list = []
let allList = [];
let thisNoSort = [];
let _allCompList = [];
let toolsCategoryData = {
  //通用组件-自定义页面
  commom:[
    'singleLinePicture','carouselPicture','lateralSliding','title',
    'pictureNavigation','goldPosition','windowPosition','doubleRowPicture',
    'partitionFootprint','activity1',
    'contentType2','userInfo','insuranceSupermarket'
  ],
  //个人中心
  memberCenter:[
    'singleLinePicture','carouselPicture','lateralSliding','title',
    'pictureNavigation','goldPosition','windowPosition','doubleRowPicture',
    'partitionFootprint','activity1','contentType2','userInfo',
  ],
  //保险超市
  insuranceSupermarket:[
    'singleLinePicture','carouselPicture','lateralSliding','title',
    'pictureNavigation','goldPosition','windowPosition','doubleRowPicture',
    'partitionFootprint','activity1','insuranceSupermarket'
  ],
  //掌客通组件 pageNameUnique: 'zktProgram'
  zktProgram:[
    'zktPictureAdvertising','zktpictureNavigation','zktNotice',
  ],
  //智能栏位 pageNameUnique: 'couponList','couponMiddle','couponDetail','orderList'
  smartField:[
    'smartField',
  ]
}
const detail = (props) => {
  const { dispatch, allCompList, pageCompList,pageAllList,putItem,sendItem,noSort,settingAllData,pageItem,checkSettingAll,
    marketData,pageCompListComplete } = props;
  
  //组件模板
  const [toolsCategory, setToolsCategory] = useState({
    'singleLinePicture': { icon: 'FileImageOutlined', name: '',},
    'carouselPicture': { icon: 'PictureOutlined', name: '' },
    // 'lateralSliding': { icon: 'MinusSquareOutlined', name: '' },
    'title': { icon: 'EditOutlined', name: '' },
    'pictureNavigation': { icon: 'AppstoreOutlined', name: '黄金位',compListNum:4, },
    // 'goldPosition': { icon: 'AppstoreOutlined', name: '',compListNum:4, },
    'windowPosition': { icon: 'DatabaseOutlined', name: '',compListNum:3, },
    'doubleRowPicture': { icon: 'ControlOutlined', name: '',compListNum:2, },
    'partitionFootprint': { icon: 'LineOutlined', name: '' },
    'activity1': { icon: 'FileImageOutlined', name: '图文描述' },
    // 'activity2': { icon: 'GiftOutlined', name: '' },
    // 'contentType1': { icon: 'FileTextOutlined', name: '' },
    'contentType2': { icon: 'FileTextOutlined', name: '电梯导航' },
    'userInfo': { icon: 'UserOutlined', name: '' },
    'insuranceSupermarket': { icon: 'UserOutlined', name: '',},

    //掌客通组件
    'zktPictureAdvertising': { icon: 'PictureOutlined', name: '',},
    'zktpictureNavigation': { icon: 'ProfileOutlined', name: '',},
    'zktNotice': { icon: 'BellOutlined', name: '',},

    //智能栏位
    'smartField': { icon: 'AppstoreOutlined', name: '',},
    // 'zktActivity': { icon: 'UserOutlined', name: '',},
    // 'zktSourceMaterial': { icon: 'UserOutlined', name: '',},
    // 'zktTask': { icon: 'UserOutlined', name: '',},
    // 'zktCard': { icon: 'UserOutlined', name: '',},
    // 'zktCustomerInformation': { icon: 'UserOutlined', name: '',},
  });

  //搭建好的组件列表
  const [compList, setCompList] = useState([]);
  //当前选中组件
  let [choiceComp, setChoiceComp] = useState({});
  let [isDelModal, setIsDelModal] = useState(false);
  let [activeKey,setActiveKey] = useState('1');
  let [delComp,setDelComp] = useState(false);

  //不排序组件
  useEffect(()=>{
    thisNoSort = JSON.parse(JSON.stringify(noSort));
  },[noSort])
  //排序组件
  useEffect(() => {
    list = JSON.parse(JSON.stringify(pageCompList));
  }, [pageCompList]);
  // 全部组件
  useEffect(()=>{
    allList = JSON.parse(JSON.stringify(pageAllList));
  },[pageAllList])
 //设置默认组件
  useEffect(()=>{
    if(pageCompListComplete && allCompList.length){
      setMarketData();
    }
  },[allCompList,pageCompListComplete])
  

  //获取全部组件模板列表
  const getAllComp=()=>{
    let params = {};
    dispatch({
      type: 'carowner_pageManage/queryAllComponentList',
      payload: {
        method: 'postJSON',
        params: params
      },
    })
  }

  useEffect(()=>{
    getAllComp();
    let pageNameUnique = history.location.query.pageNameUnique;
    let _checkSettingAll = true;
    if(pageNameUnique && no_settingAll_dict.includes(pageNameUnique)){
      _checkSettingAll = false;
    }
    dispatch({
      type:'carowner_pageManage/setCheckSettingAll',
      payload: _checkSettingAll,
    });
    
    //设置页面最低宽度 字符串带单位
  },[])

  useEffect(() => {
    //遍历数据，加入到不同的分类中
    _allCompList = JSON.parse(JSON.stringify(allCompList));
    if (allCompList && allCompList.length) {
      let _toolsCategory_bp = JSON.parse(JSON.stringify(toolsCategory));
      let _toolsCategory={};
      //toolsCategoryData
      let pageNameUnique = history.location.query.pageNameUnique;
      //根据页面类型筛选左侧要显示的组件
      for(let key in _toolsCategory_bp){
        if(toolsCategoryData[pageNameUnique]){//特定页面
          if(toolsCategoryData[pageNameUnique].includes(key)){
            _toolsCategory[key] = _toolsCategory_bp[key];
          }
        }else if(no_settingAll_dict.includes(pageNameUnique)){//智能栏位
          if(toolsCategoryData.smartField.includes(key)){
            _toolsCategory[key] = _toolsCategory_bp[key];
          }
        }else{//通用-自定义
          if(toolsCategoryData.commom.includes(key)){
            _toolsCategory[key] = _toolsCategory_bp[key];
          }
        }
      }
      for (let key in _toolsCategory) {
        let cate = _toolsCategory[key];
        for (let item of allCompList) {//item每一项
          if (item.componentKey == key && !cate.name) {
            cate.name = item.componentName;
          }
          cate.showBg = false;
        }
      }
      setToolsCategory(_toolsCategory);
    }
  }, [allCompList])

  //监听选中组件，渲染右侧表单区域
  useEffect(() => {
    //设置选中
    if(JSON.stringify(putItem)!='{}'){
      if (allCompList && allCompList.length && putItem.type) {
        for (var i = 0; i < allCompList.length; i++) {
          if (allCompList[i].componentKey == putItem.type) {
            setChoiceComp({ ...allCompList[i] })
          }
        }
      }
    }else{
      setChoiceComp(null);
    }
  }, [putItem])

  //监听表单变动，更新预览区域
  useEffect(() => {
    if(sendItem.objectId){//修改
      for(let i=0;i<allList.length;i++){//for of无法改变数组元素，这里用for循环
        if(sendItem.objectId == allList[i].objectId){
          let _sendItem = JSON.parse(JSON.stringify(sendItem))
          delete _sendItem.isAddItem;
          allList[i] = _sendItem;
          break;
        }
      }
      setPageDataList(allList);
    }
  }, [sendItem])

  //实时更新左侧列表
  const setPageDataList=(list)=>{
    dispatch({
      type:'carowner_pageManage/setPageComponentList',
      payload: list,
    })
  }

  //监听选中的组件，动态切换tabs
  useEffect(()=>{
    if(choiceComp && choiceComp.componentKey){
      setActiveKey('2');
    }else{
      setActiveKey('1');
    }
  },[choiceComp])

  const publishPage=(id)=>{
    dispatch({
      type: 'carowner_pageManage/publishPageData',
      payload: {
        method: 'post',
        params: {
          objectId: id,
        }
      },
      callback: (res) => {
        if(res.code == 'S000000') {
          message.success('发布成功');
          window.history.go(-1);
        }
      }
    })
  }
  // 保存组件
  const saveComponent = (type) => {
    //设置页面整体属性
    let settingAllDataTips={
      pageName:'页面名称不能为空',
      pageDescribe:'页面描述不能为空',
      shareTitle:'分享标题不能为空',
      shareDescribe:'分享描述不能为空',
      shareImage:'分享图片不能为空',
    }
    if(checkSettingAll){
      for(let key in settingAllDataTips){
        if(!settingAllData[key]){
          setActiveKey('1');
          return message.warning({ content: settingAllDataTips[key] })
        }
      }
    }
    for(let newPutItem of allList){
      if(JSON.stringify(newPutItem)!='{}'){
        for (let i = 0; i < newPutItem.compList.length; i++) {
          // 1单列图校验 && 5图文导航校验 && 6黄金位校验 && 8双列图校验
          if (newPutItem.type == 'singleLinePicture' || newPutItem.type == 'pictureNavigation' || newPutItem.type == 'goldPosition' || newPutItem.type == 'doubleRowPicture') {
            if (!newPutItem.compList[i].pictureUrl) return message.warning({ content: '图片不能为空' })
            if (!newPutItem.compList[i].actionUrl) return message.warning({ content: '链接不能为空' })
            if (!newPutItem.compList[i].text) return message.warning({ content: 'text不能为空' })
          }
          // 2轮播图校验 && 3横向滑动校验 && 7橱窗位校验
          if (newPutItem.type == 'carouselPicture' || newPutItem.type == 'lateralSliding' || newPutItem.type == 'windowPosition') {
            if (!newPutItem.compList[i].pictureUrl) return message.warning({ content: '图片不能为空' })
            if (!newPutItem.compList[i].actionUrl) return message.warning({ content: '链接不能为空' })
          }
          // 4标题校验
          if (newPutItem.type == 'title') {
            if (!newPutItem.compList[i].title) return message.warning({ content: '正标题文本不能为空' })
          }
          // 10分割占位校验
          if (newPutItem.type == 'partitionFootprint') {
            if (!newPutItem.compList[i].lineColor) return message.warning({ content: '线条颜色不能为空' })
          }
          if(newPutItem.type == 'pictureNavigation'){
            if(newPutItem.compStyle[0].isBackground=='1' && !newPutItem.compStyle[0].backgroundUrl){
              return message.warning({ content: '背景图不能为空' })
            }
          }
          // 11活动1校验
          if (newPutItem.type == 'activity1') {
            if (!newPutItem.compList[i].pictureUrl) return message.warning({ content: '图片不能为空' })
            if (!newPutItem.compList[i].actionUrl) return message.warning({ content: '链接不能为空' })
            if (!newPutItem.compList[i].title) return message.warning({ content: '标题不能为空' })
            if (!newPutItem.compList[i].subtitle) return message.warning({ content: '副标题不能为空' })
          }
          // 12活动2校验
          if (newPutItem.type == 'activity2') {
            if (!newPutItem.compList[i].pictureUrl) return message.warning({ content: '图片不能为空' })
            if (!newPutItem.compList[i].actionUrl) return message.warning({ content: '链接不能为空' })
            if (!newPutItem.compList[i].title) return message.warning({ content: '标题不能为空' })
          }
          // 13内容分类1校验
          if (newPutItem.type == 'contentType1') {
            if (!newPutItem.compList[i].menuName) return message.warning({ content: '菜单名称不能为空' })
            if (newPutItem.compList[i].positionType == '2') {
              if (!newPutItem.compList[i].insideUrl) return message.warning({ content: '（下拉）展示链接不能为空' })
            }
          }
          // 14内容分类2校验
          if (newPutItem.type == 'contentType2') {
            if (!newPutItem.compList[i].pictureUrl) return message.warning({ content: '图片不能为空' })
            if (!newPutItem.compList[i].menuName) return message.warning({ content: '菜单名称不能为空' })
            if (newPutItem.compList[i].positionType == '2') {
              if (!newPutItem.compList[i].insideUrl) return message.warning({ content: '（下拉）展示链接不能为空' })
            }
          }
          if (newPutItem.type == 'zktPictureAdvertising') {
            if (!newPutItem.compList[i].pictureUrl) return message.warning({ content: '图片不能为空' })
            if (!newPutItem.compList[i].type) return message.warning({ content: '类型不能为空' })
            if(newPutItem.compList[i].type && !newPutItem.compList[i].content.value){
              return message.warning({ content: '内容不能为空' });
            }
          }
          if (newPutItem.type == 'zktpictureNavigation') {
            if (!newPutItem.compList[i].pictureUrl) return message.warning({ content: '图片不能为空' })
            if (!newPutItem.compList[i].title) return message.warning({ content: '标题不能为空' })
            if (!newPutItem.compList[i].type) return message.warning({ content: '类型不能为空' })
            if(newPutItem.compList[i].type && !newPutItem.compList[i].content.value){
              return message.warning({ content: '内容不能为空' });
            }
          }
        }
        if (newPutItem.type == 'zktNotice') {
          if (!newPutItem.compList.title) return message.warning({ content: '公告内容不能为空' })
        }
        if (newPutItem.type == 'smartField') {
          if (!newPutItem.compList.lanwei) return message.warning({ content: '栏位内容不能为空' })
        }
  
        //置顶校验
        if(newPutItem.defaultComponent==1){
          let alreadyTop = thisNoSort.some(item=>{//已有置顶组件
            return item.defaultComponent==1 && item.wechatH5ComponentVO.componentKey != 'userInfo';
          });
          let isNoSort = thisNoSort.some(item=>{//目前操作的组件，是否在已置顶列表中
            return newPutItem.objectId == item.objectId
          });
          //已有置顶组件，切当前操作组件，不在置顶列表中，则拦截
          if(alreadyTop && !isNoSort) return message.warning({ content: '置顶失败，已存在置顶组件，请先取消已置顶组件' })
        }
      }
    }
    
    //过滤传递给后台的参数
    let sendList = [];
    for(let item of allList){
      let obj = {
        componentId: item.componentId,
        defaultComponent: item.defaultComponent,
        componentAttributes: JSON.stringify(item.compList),
        componentStyle: (typeof item.compStyle==='string')?item.compStyle:JSON.stringify(item.compStyle),
      };
      sendList.push(obj);
    }
    dispatch({
      type: 'carowner_pageManage/addPageData',
      payload: {
        method: 'postJSON',
        params: {
          components:sendList,
          pageStatus: pageItem.pageStatus || null,
          backgroundColor: settingAllData.backgroundColor,
          pageName: settingAllData.pageName,
          isDisplayName: settingAllData.isDisplayName===true?1:2,
          objectId: history.location.query.pageId  || null,
          pageDescribe:settingAllData.pageDescribe,
          shareTitle:settingAllData.shareTitle,
          shareDescribe:settingAllData.shareDescribe,
          shareImage:settingAllData.shareImage,
        }
      },
      callback: (res) => {
        if (res.code == 'S000000') {
          if(type=='publish'){
            publishPage(res.data.objectId)
          }else{
            message.success({content: '保存成功'});
            if(history.location.query.pageId){//修改
              queryPageComponentList()//刷新
            }else{//新增
              window.history.go(-1);
            }
          }
        } else {
          message.warning({
            content: res.message || '保存失败'
          });
        }
      }
    })
  }
  //获取智能栏位数据
  const getSmartFieldList=(obj)=>{
    return new Promise((resolve,reject)=>{
      dispatch({
        type: 'smartField_model/channelWechatSmartFieldDetail',
        payload: {
          method: 'get',
          id: obj.objectId,
        },
        callback: (res) => {
          if(res.result.code=='0' && res.body){
            resolve(res.body.contentVoList)
          }
        }
      })
    })
  }
  //刷新
  let queryPageComponentList = () => {
    dispatch({
      type: 'carowner_pageManage/queryPageComponentList',
      payload: {
        method: 'postJSON',
        params: {
          pageId: history.location.query.pageId
        }
      },
      callback:(list)=>{
        let _pageAllList = JSON.parse(JSON.stringify(list));
        let compNum=0;//合并多个赋值操作
        for(let i=0;i<list.length;i++){
          let item = list[i];
          if(item.type=='smartField'){
            let compSet = item.compList;
            ++compNum;
            getSmartFieldList(compSet.lanwei).then((res)=>{
              _pageAllList[i].lanweiList = res;
              --compNum;
              if(compNum==0){
                dispatch({
                  type: 'carowner_pageManage/setPageComponentList',
                  payload: _pageAllList,
                })
              }
            })
          }
        }
      }
    })
    dispatch({
      type: 'carowner_pageManage/setPutItem',
      payload: {}
    })
  }

  //根据icon名称动态生成icon
  const getIconDom = (iconName) => {
    return React.createElement(Icon[iconName], { style: { 'font-size': '30px',} });
  }

  const onBeforeCapture = useCallback((res) => {
    // console.log('onBeforeCapture',res)
    /*...*/
  }, []);
  const onBeforeDragStart = useCallback((res) => {
    // console.log('onBeforeDragStart',res)
    /*...*/
  }, []);
  const onDragStart = useCallback((res) => {
    //console.log('onDragStart',res)
    /*...*/
  }, []);
  const onDragUpdate = useCallback((res) => {
    //console.log('onDragUpdate',res)
    /*...*/
  }, []);

  let [isDrop, setIsDrop] = useState(false);//控制滚动条是否在置底

  const onDragEnd = useCallback((res) => {
    
    // the only one that is required
    //拖拽到布局容器中
    if (res.destination && res.destination.droppableId == 'phoneBox') {
      
      let alreadyTop = thisNoSort.some(item=>{
        return item.type== 'userInfo'
      });
      let newAllCompList = _allCompList.filter((item) => {
        return item.componentKey == res.draggableId
      });
      
      if (alreadyTop && res.draggableId=='userInfo'){//用户信息组件不能重复
        return message.error({ content: `用户信息组件只能配置一个`});
      }
      let zktCompList = ['zktNotice'];
      for(let compName of zktCompList){
        if(res.draggableId==compName){
          let isZktComp = allList.some(item=>{
            return item.type == compName;
          });
          if(isZktComp){
            return message.error({ content: `每种掌客通组件只能配置一个`});
          }
        }
      }
      
      //设置默认数量 初始一个
      let compList = [{}];
      for(let key in toolsCategory){
        let item = toolsCategory[key];
        if(res.draggableId==key && item.compListNum){
          //有初始，这里少push一个
          for(let i=0;i<item.compListNum-1;i++){
            compList.push({});
          }
        }
      }
      let putItem = {
        type: res.draggableId,
        componentId: newAllCompList[0].objectId,
        objectId: getOnlyId(),
        compList: compList,
        defaultComponent:2,//默认2 不置顶
        compStyle: [{}],
        isAddItem:true,
        componentName:newAllCompList[0].componentName,
      };
      allList.push(putItem)
      //预览区列表数据更新
      setPageDataList(allList);
      //设置选中组件
      dispatch({
        type: 'carowner_pageManage/setPutItem',
        payload: putItem,
      });
      setChoiceComp({ ...allCompList[res.source.index] }); //切换当前选择
      // 在这里做滚动条置底
      setIsDrop(true);
    }
    if (res.destination && res.destination.droppableId == 'comp-box') {
      setIsDrop(false);
      let delItems = list.splice(res.source.index, 1);
      list.splice(res.destination.index, 0, ...delItems);
      setPageDataList([...thisNoSort,...list])
    }
  }, []);

  //返回首页
  const backHome=()=>{
    window.history.go(-1);
  }

  //
  const addDefaultComp=(type)=>{
    let isMarket = false;//是否已有保险超市
    for(let item of allList){
      if(item.type==type){
        isMarket = true;
        break;
      }
    }
    if(!isMarket){//没有保险超市组件，自动添加一个
      let newAllCompList = allCompList.filter((item) => {
        return item.componentKey == type
      });
      if(!newAllCompList.length) return;
      let putItem = {
        type: type,
        componentId: newAllCompList[0].objectId,
        objectId: getOnlyId(),
        compList: {},
        defaultComponent:2,//默认2 不置顶
        compStyle: [{}],
        isAddItem:true,
        componentName:newAllCompList[0].componentName,
      };
      allList.push(putItem)
      //预览区列表数据更新
      setPageDataList(allList);
      //设置选中组件
      dispatch({
        type: 'carowner_pageManage/setPutItem',
        payload: putItem,
      });
    }
  }

  //保险超市逻辑***************start
  //保险超市默认加载数据
  const setMarketData=()=>{
    let pageNameUnique = history.location.query.pageNameUnique;
    console.log(pageNameUnique)
    if(no_settingAll_dict.includes(pageNameUnique)){
      addDefaultComp('pageContent');
    }
    if(pageNameUnique=='insuranceSupermarket'){
      addDefaultComp('insuranceSupermarket');
      //获取产品
      const getSupGoodsById=(id,tabList)=>{
        dispatch({
          type: 'carowner_pageManage/getSupGoodsById',
          payload: {
            method: 'postJSON',
            params:{
              channelId: tokenObj.channelId,
              levelParentId: id,
              pageInfo: {
                pageNo: 1, pageSize: 4
              }
            }
          }, callback: (res) => {
            if (res.code === 'S000000' && res.data && res.data.length) {
              dispatch({
                type: 'carowner_pageManage/setMarketData',
                payload: {
                  tabList:tabList,
                  goodsList:res.data,
                }
              })
            }
          }
        })
      };
      //获取分类 不要重复获取
      if(!marketData.tabList.length){
        dispatch({
          type: 'carowner_pageManage/getAllGoodClass',
          payload: {
            method: 'get',
            channelId:tokenObj.channelId,
          }, callback: (res) => {
            if (res.code === 'S000000' && res.data && res.data.length) {
              getSupGoodsById(res.data[0].objectId,res.data)
            }
          }
        })
      }
    }
    //保险超市逻辑***************end
  }

  return (
    <div className={style.carownerDetail}>
      <DragDropContext
        onBeforeCapture={onBeforeCapture}
        onBeforeDragStart={onBeforeDragStart}
        onDragStart={onDragStart}
        onDragUpdate={onDragUpdate}
        onDragEnd={onDragEnd}
      >
        <div className={style.tools}>
          {/* 1 */}
          <div className={style.title}>组件库
          </div>
          <div className={style.box}>
            {
              Object.keys(toolsCategory).map((childKey, index) => {
                let child = toolsCategory[childKey];
                // 防止拖动变形 生产多个Droppable
                return <>{child.name ? <Droppable getContainerForClone
                  droppableId={childKey} isDropDisabled>
                  {(provided, snapshot) => (
                    <div className={style.draggableBox} ref={provided.innerRef} {...provided.droppableProps}>
                      <Draggable draggableId={childKey} index={index} key={childKey} >
                        {(provided, snapshot) => (
                          <div className={style.toolsItem} ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            {getIconDom(child.icon)}
                            <span className={style.name}>{child.name}</span>
                          </div>
                        )}
                      </Draggable>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>:''}
                </>
              })
            }
          </div>
        </div>
        {/* 2 */}
        <div className={style.preview}>
          <div className={style.title}>可视化预览
          </div>
          <div className={style.box}>
            <Droppable droppableId="phoneBox" >
              {(provided, snapshot) => (
                <div className={style.phoneBox} ref={provided.innerRef} {...provided.droppableProps}>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className={style.compListBox} style={{backgroundImage:`url(${require('@/assets/carowner/phone_bg.png')})`}}>
              <CompList complist={compList} isDrop={isDrop} setIsDrop={setIsDrop} queryPageComponentList={queryPageComponentList}/>
            </div>
          </div>
        </div>
      </DragDropContext>
      
      {/* 编辑区域 */}
      <div className={style.setting}>
        <div className={style.tabBox}>
          <div className={style.tab_btn}>
            <span onClick={()=>{setActiveKey('1')}} className={activeKey=='1' && style.active}>页面基础设置</span>
            <span onClick={()=>{setActiveKey('2')}} className={activeKey=='2' && style.active}>组件管理</span>
          </div>
          <div className={style.tab_con}>
            <div className={style.tab_con_item} style={{display: activeKey=='1'?'block':'none',}}>
              <SettingAll />
            </div>
            <div className={style.tab_con_item} style={{display: activeKey=='2'?'block':'none',}}>
              {choiceComp && choiceComp.componentKey ?
                <>
                {choiceComp && choiceComp.componentKey == "singleLinePicture" ? <SingleLinePicture /> :''}
                {choiceComp && choiceComp.componentKey == "carouselPicture" ? <CarouselPicture /> :''}
                {choiceComp && choiceComp.componentKey == "lateralSliding" ? <LateralSliding /> :''}
                {choiceComp && choiceComp.componentKey == "title" ? <Titles /> :''}
                {choiceComp && choiceComp.componentKey == "pictureNavigation" ? <PictureNavigation /> :''}
                {choiceComp && choiceComp.componentKey == "goldPosition" ? <GoldPosition /> :''}
                {choiceComp && choiceComp.componentKey == "windowPosition" ? <WindowPosition /> :''}
                {choiceComp && choiceComp.componentKey == "doubleRowPicture" ? <DoubleRowPicture /> :''}
                {choiceComp && choiceComp.componentKey == "partitionFootprint" ? <PartitionFootprint /> :''}
                {choiceComp && choiceComp.componentKey == "activity1" ? <Activity1 /> :''}
                {choiceComp && choiceComp.componentKey == "activity2" ? <Activity2 /> :''}
                {choiceComp && choiceComp.componentKey == "contentType1" ? <ContentType1 /> :''}
                {choiceComp && choiceComp.componentKey == "contentType2" ? <ContentType2 /> :''}
                {choiceComp && choiceComp.componentKey == "userInfo" ? <UserInfo /> :''}
                {choiceComp && choiceComp.componentKey == "insuranceSupermarket" ? <InsuranceSupermarket /> :''}
                {choiceComp && choiceComp.componentKey == "zktPictureAdvertising" ? <ZktPictureAdvertising /> :''}
                {choiceComp && choiceComp.componentKey == "zktpictureNavigation" ? <ZktpictureNavigation /> :''}
                {choiceComp && choiceComp.componentKey == "zktNotice" ? <ZktNotice /> :''}
                {choiceComp && choiceComp.componentKey == "smartField" ? <SmartField getSmartFieldList={getSmartFieldList}/> :''}
                {choiceComp && choiceComp.componentKey == "pageContent" ? <PageContent /> :''}
                </>:<div style={{ textAlign: "center" }}><h3 style={{ marginTop: '200px',fontSize:'20px',color:'#999',padding:'0 20px' }}>
                  请点击预览区组件，进行编辑
                </h3></div>
              }
            </div>
          </div>
        </div>
      </div>
    <BottomArea>
      <Space size={8}>
        <Button onClick={backHome}>返回</Button>
        <Button type="primary" onClick={saveComponent}>保存</Button>
        <Button type="primary" onClick={()=>{saveComponent('publish')}}>保存并发布</Button>
      </Space>
    </BottomArea>
    </div>
  )
};
export default connect(({ carowner_pageManage }) => ({
  allCompList: carowner_pageManage.allCompList,
  pageCompList: carowner_pageManage.pageCompList,
  pageAllList: carowner_pageManage.pageAllList,
  putItem: carowner_pageManage.putItem,
  sendItem: carowner_pageManage.sendItem,
  noSort: carowner_pageManage.noSort,
  settingAllData: carowner_pageManage.settingAllData,
  pageItem: carowner_pageManage.pageItem,
  marketData: carowner_pageManage.marketData,
  pageCompListComplete: carowner_pageManage.pageCompListComplete,
  checkSettingAll: carowner_pageManage.checkSettingAll,
}))(detail)
