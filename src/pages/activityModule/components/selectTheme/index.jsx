import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {
  Row,
  Tag,
  Form,
  Space,
  Input,
  Modal,
  Table,
  Select,
  Button,
  message,
  Pagination,
  ConfigProvider,
  DatePicker,
  Spin,
} from "antd";
import { SearchOutlined } from '@ant-design/icons'
const { Search } = Input;
import style from "./style.less"
import PreviewModel from "../themePreview/previewModel";
import { CopyToClipboard } from 'react-copy-to-clipboard'
const selectThemePage = (props) => {
  let { dispatch, themeShow, onHideSelectTheme, styleCodeType, materialCode } = props;
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  let  [visible, setVisible] = useState(true);
  let  [isSelect, setIsSelect] = useState(false);
  let  [list, setList] = useState([]);//主题列表
  let [categoryList,setCategoryList] = useState([]);//主题分类
  let [payload, setPayload] = useState({//查询列表参数
    categoryIds:[],
    channelId:'',
    marketActivityTypes:[activityInfo.marketActivityType],
    marketType:activityInfo.marketType,
    pageNo:1,
    pageSize:8,
    status:[2],
    themeName:''
  });
  
  let [pageTotal, setPageTotal] = useState(0);// 列表总条数
  let [pageNo, setPage] = useState(1);
  let [pageSize, setPageSize] = useState(8);
  let [applyTheme, setApplyTheme] = useState(null);//应用主题ID
  /*回调*/
  useEffect(() => {
    if (themeShow) {
      setVisible(themeShow);
    }
  }, [themeShow])
  useEffect(()=>{
    materialCategoryNameList();
  },[])
  useEffect(()=>{
    getList();
  },[payload])
  let materialCategoryNameList = ()=>{
    dispatch({
      type: 'selectTheme/materialCategoryNameList',
      payload: {
        method: 'postJSON',
        params: {
          "channelIds": [],
          "type": 2,
          "marketActivityType": activityInfo.marketActivityType
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let items = res.body;
          items.map(item=>{
            item.checked = false;
          })
          items.unshift({
            categoryId:'',
            categoryName:'全部',
            checked: true
          })
          setCategoryList(items)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  
  /*获取列表*/
  let getList = () => {
    dispatch({
      type: 'selectTheme/materialList',
      payload: {
        method: 'postJSON',
        params: payload
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let list = res.body.list || [];
          if(list.length > 1){
            list = list.map(item => {
              item.isPreview = false;
              return item
            })
          }
          setList(list)
          setPageTotal(res.body.total)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  //搜索主题名称
  let themeNameSearch = (value) => {
    let toPayload = JSON.parse(JSON.stringify(payload));
    toPayload.themeName = value;
    toPayload.pageNo = 1;
    setPage(1);
    setPayload(toPayload);
  }
  //显示浮层
  let showPreview = (value,index) => {
    let toList = JSON.parse(JSON.stringify(list));
    toList[index].isPreview = true;
    setList(toList)
  }
  //隐藏浮层
  let hidePreview = (value,index) => {
    let toList = JSON.parse(JSON.stringify(list));
    toList[index].isPreview = false;
    setList(toList)
  }
  //选择主题分类
  let selectThemeClick = (e,val) => {
    let toCategoryList = JSON.parse(JSON.stringify(categoryList));
    let toPayload = JSON.parse(JSON.stringify(payload));
    let toCategoryIds = [];
    let selectAll = false;
    toCategoryList.map((item,index)=>{
      if(index != 0 && val.categoryName == item.categoryName){
        item.checked = !item.checked;
        toCategoryList[0].checked = false;
      }
      if(index == 0 && val.categoryName == item.categoryName){
        item.checked = !item.checked;
        selectAll = true;
      }
      if(index != 0 && item.checked){
        toCategoryIds.push(item.categoryId);
      }
    })
    if(selectAll){
      toCategoryList.map((item,index) => {
        if(index != 0){
          item.checked = false;
        }
        return item;
      });
      toCategoryIds = [];
    }
    if(toCategoryIds.length == 0){
      toCategoryList[0].checked = true;
    }
    toPayload.pageNo = 1;
    setPage(1);
    toPayload.categoryIds = [...toCategoryIds];
    setPayload(toPayload);
    setCategoryList(toCategoryList);
  }
  let useTheme = (e,val) => {
    setApplyTheme(val.id);
    setIsSelect(true);
  }
  let onCancel = () => {
    setVisible(false);
    onHideSelectTheme(false);
  }
  let cancelTheme = () => {
    setIsSelect(false);
  }
  //应用主题
  let confirmTheme = () => {
    window.activityStyle_clickSave = null;
    putActivityMaterialId();
    getMaterialDetails();
    // setIsSelect(false);
    // setVisible(false);
    // onHideSelectTheme(false);
  }
   // 获取素材数据
   let getMaterialDetails = ()=>{
    dispatch({
      type: 'selectTheme/getMaterialDetails',
      payload: {
        method: 'get',
        params: {
          materialId: applyTheme,
          styleCode: materialCode
        }
      },
      callback: (res) => {
        if(res.result.code === '0') {
          let items = JSON.parse(res.body.styleValue);
          newStyleSave(items);
        }else{
          message.error(res.result.message)
        }
      }
    })
  }
  let newStyleSave = (value) => {
    if(materialCode == "strikePage_material"){
      let list = value.dropGoodsList;
      let toDropGoodsList = window.activityData_materialApply.dropGoodsList || {};
      if(toDropGoodsList.length > 0){
        toDropGoodsList = toDropGoodsList.map((item, index) => {
          if(list[index].imgUrl){
            item.imgUrl = list[index].imgUrl;
          }
          return item
        })
        value.dropGoodsList = JSON.parse(JSON.stringify(toDropGoodsList));
      }
    }
    let materialSkins = JSON.parse(JSON.stringify(value));
    let toFormData = Object.assign(materialSkins, window.activityData_materialApply);
    if(materialCode == "strikePage_material" && !toFormData.dropGoodsList){
      toFormData.dropGoodsList = JSON.parse(JSON.stringify(value.dropGoodsList))
    }
    dispatch({
      type: 'selectTheme/newStyleSave',
      payload: {
        method: 'postJSON',
        params: {
          styleCode: styleCodeType,
          activityId: activityInfo.objectId,
          styleValue: JSON.stringify(toFormData)
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          if(materialCode != "discountPage_material" && materialCode != "seckilPage_material"){
            saveAddCountAdStyle(value);
          }else{
            dispatch({
              type: 'selectTheme/onSetTheme',
              payload: applyTheme
            })
            setIsSelect(false);
            setVisible(false);
            onHideSelectTheme(false);
          }
          message.success(res.result.message);
        } else {
          message.error(res.result.message);
        }
      }
    });
  };
  let saveAddCountAdStyle = (value) => {
    let toForm = {
      turntableAd: window.activityData_materialApply.turntableAd,
      activityId: activityInfo.objectId,
      isShow: window.activityData_materialApply.isShow || 0,
      turntableAdTitleName : window.activityData_materialApply.turntableAdTitleName,
      isTaskShow : window.activityData_materialApply.isTaskShow,
      isTaskStyle : value.isTaskStyle,
    }
    dispatch({
      type: 'visGame/saveAddCountAdStyle',
      payload: {
        method: 'postJSON',
        params: toForm
      },
      callback: (res) => {
        if (res.result.code === '0') {
          dispatch({
            type: 'selectTheme/onSetTheme',
            payload: applyTheme
          })
          setIsSelect(false);
          setVisible(false);
          onHideSelectTheme(false);
          message.success(res.result.message);
        } else {
          message.error(res.result.message);
        }
      }
    });
  }
  let putActivityMaterialId = () => {
    dispatch({
      type: 'selectTheme/putActivityMaterialId',
      payload: {
        method: 'postJSON',
        params: {
          objectId: activityInfo.objectId,
          materialId: applyTheme,
        }
      },
      callback: (res) => {
        if (res.result.code !== '0') {
          message.error(res.result.message);
        }
      }
    });
  }
  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) => {
    let toPayload = JSON.parse(JSON.stringify(payload));
    toPayload.pageNo = page
    setPayload(toPayload)
    setPage(page)
    setPageSize(pageSize)
  }
  let onPageTotal = (total) => {
    return `共${total}条记录`
  }
  let [previewModelVisble, setPreviewModelVisble] = useState(false); //预览是否显示
  let [listData, setListData] = useState({});
  //预览
  let setPreviewClick = (e, record) => {
    setListData(record)
    setPreviewModelVisble(true)
  }
  let hidePreviewModel = () => {
    setPreviewModelVisble(false)
  }
  return (
    <>
    {previewModelVisble ?
      <PreviewModel 
        hidePreviewModel={hidePreviewModel} 
        previewModelVisble={previewModelVisble} 
        listData={listData} 
        setApplyTheme={setApplyTheme}
        setIsSelect={setIsSelect}
        styleCode={materialCode}/>
    :null}
      <Modal
        width={500}
        title="应用主题"
        maskClosable={false}
        visible={isSelect}
        onCancel={cancelTheme}
        onOk={confirmTheme}
      >
        <p>应用主题后，活动分享海报会同步应用，请确认是否应用主题</p>
      </Modal>
      <Modal
        width={1000}
        title="素材中心"
        footer={null}
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
      >
        <div className={style.theme_wrap}>
          <div className={style.theme_search}>
            <Search className={style.search_input} placeholder="搜索主题名称" allowClear enterButton={<SearchOutlined />} onSearch={themeNameSearch} style={{ width: 300 }} />
          </div>
          <div className={style.theme_type}>
            <div className={style.type_title}>主题分类：</div>
            <div className={style.type_item}>
              {categoryList && categoryList.length > 0 ? categoryList.map((item)=>{
                  return <Button className={style.item} style={item.checked ? {'backgroundColor' : '#F28E8E','color' : '#fff','border-color' :'#F28E8E'} : null} onClick={(e) => {selectThemeClick(e,item)}}>{item.categoryName}</Button>
                })
                : <span style={{lineHeight:'26px'}}>暂无分类</span>
              }
            </div>
          </div>
          <div className={style.theme_list}>
            <div className={style.list_wrap}>
              {list && list.length > 0 ? list.map((item,index)=>{
                return <div className={style.theme_item} key={index}>
                  <div className={style.item_name}>{item.themeName}</div>
                  <div className={style.item_image}>
                    {item.isPreview ? 
                      <div className={style.item_preview} onMouseEnter={(value) => {showPreview(value,index)}} onMouseLeave={(value) => {hidePreview(value,index)}}>
                        <span onClick={(e) => {setPreviewClick(e,item)}}>预览</span>
                      </div> : null}
                    <img src={item.themeShowImg} onMouseEnter={(value) => {showPreview(value,index)}} onMouseLeave={(value) => {hidePreview(value,index)}} alt="" />
                  </div>
                  <div className={style.item_operation} onClick={(e)=>{useTheme(e,item)}}>应用主题</div>
                </div>
              })
              :<div className={style.list_black}>暂无主题，敬请期待</div>}
            </div>
            <Pagination
              className={style.theme_pagination}
              showQuickJumper
              showSizeChanger={false}
              showTitle={false}
              current={pageNo}
              defaultPageSize={pageSize}
              total={pageTotal}
              onChange={onNextChange}
              showTotal={onPageTotal}
            />
          </div>
        </div>
      </Modal>
    </>
  )
};
export default connect(({ putModal }) => ({
}))(selectThemePage)
