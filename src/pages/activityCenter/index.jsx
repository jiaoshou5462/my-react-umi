import React, { useEffect, useState } from "react"
import { Link, connect, history } from 'umi'
import { SearchOutlined } from '@ant-design/icons'
import {Popover,Modal, Space,Form,Table,Input,Select, Button, message, Pagination, ConfigProvider, Checkbox ,Radio, Menu} from "antd"
const { Search } = Input;
import style from "./style.less"
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'  // 日期处理
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const { Option } = Select;
let themeStyleCode = {//主题皮肤样式码
  1:"turntablePage_material",
  2:"seckilPage_material",
  3:"directPumpingPage_material",
  4:"discountPage_material",
  5:"dollMachinePage_material",
  6:"goldenEggsPage_material",
  7:"strikePage_material",
  8:"answerPage_material"
};
let saveStyleCode = {//保存样式码
  1:"tableHome",
  2:"seckilHome",
  3:"directHome",
  4:"discountHome",
  5:"dollHome",
  6:"goldenEggsHome",
  7:"strikeHome",
  8:"answerHome"
}
const activityCenter = (props) => {
  let toPayload = JSON.parse(localStorage.getItem("materialPayload")) || null;//获取上一次检索条件
  let tokenObj=JSON.parse(localStorage.getItem('tokenObj'));
  let defaultPayload = {
    categoryIds:[],
    channelId:'',
    marketActivityTypes:[],
    marketType:1,
    pageNo:1,
    pageSize:8,
    status:[2],
    themeName: '',
  };
  let [tabCurrent, setTabCurrent] = useState('1');
  let { dispatch } = props,
    [list, setList] = useState([]), // 列表
    [pageTotal, setPageTotal] = useState(0), // 列表
    [pageSize, setPageSize] = useState(8),
    [pageNo, setPage] = useState(1),
    [payload, setPayload] = useState(toPayload || defaultPayload),
    [channelId, setChannelId] = useState(tokenObj.channelId);
  useEffect(() => {
    if(tokenObj.channelId){
      setChannelId(tokenObj.channelId);
    }
  },[])
  useEffect(()=>{
    materialCategoryNameList();
  },[tabCurrent])
  useEffect(() => {
    getList()
  }, [pageNo, pageSize,payload])
  //活动数据
  let activtiyTypeArr = {
    1:{
      children:[{
        name:"全部",
        marketActivityType:"",
        checked: true
      },{
        name:"大转盘",
        marketActivityType:1,
        checked: false
      },{
        name:"直抽",
        marketActivityType:3,
        checked: false
      },{
        name:"砸金蛋",
        marketActivityType:6,
        checked: false
      },{
        name:"盲盒娃娃机",
        marketActivityType:5,
        checked: false
      }]
    },
    2:{
      children:[{
        name:"全部",
        marketActivityType:"",
        checked: true
      },{
        name:"秒杀专场",
        marketActivityType:2,
        checked: false
      },{
        name:"优惠购",
        marketActivityType:4,
        checked: false
      }]
    },
    3:{
      children:[{
        name:"全部",
        marketActivityType:"",
        checked: true
      },{
        name:"趣味点点乐",
        marketActivityType:7,
        checked: false
      }],
    },
    4:{
      children:[{
        name:"全部",
        marketActivityType:"",
        checked: true
      },{
        name:"答题有奖",
        marketActivityType:8,
        checked: false
      }]
    }
  }
   /*获取列表*/
   let getList = () => {
    dispatch({
      type: 'activityCenter/materialList',
      payload: {
        method: 'postJSON',
        params: payload
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let toList = res.body.list;
          toList.length > 0 && toList.map((item) => {
            let toShowImgList = [];
            toShowImgList.push(item.publicityPoster);
            toShowImgList.push(item.gamePageImg);
            toShowImgList.push(item.banner);
            item.showImgList = toShowImgList;
            item.showImg = toShowImgList[0];
            return item;
          })
          setList(toList)
          setPageTotal(res.body.total);
          localStorage.removeItem("materialPayload");
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
 /* 分类名称选择 */
 //获取分类名称数据
 let [categoryList,setCategoryList] = useState([])
 let materialCategoryNameList = ()=>{
    let marketActivityTypeList = activtiyTypeArr[tabCurrent].children;
    let list = [];
    marketActivityTypeList.map(item => {
      if(item.marketActivityType){
        list.push(item.marketActivityType)
      }
    })
    dispatch({
      type: 'activityCenter/materialCategoryNameList',
      payload: {
        method: 'postJSON',
        params: {
          "channelIds": [],
          "type": 2,
          marketActivityType: [...list]
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
  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) => {
    payload.pageNo = page
    setPayload(payload)
    setPage(page)
    setPageSize(pageSize)
  }
  const tabItems = [
    {
      label: '活动抽奖',
      key: "1",
    },
    {
      label: '商场促销',
      key: "2",
    },
    {
      label: '互动游戏',
      key: "3",
    },
    {
      label: '答题问卷',
      key: "4",
    },
  ]
  let [activityTypeList, setActivityTypeList] = useState(activtiyTypeArr[1].children);

  //选择活动类型大类
  let changeTab = (e) => {
    setTabCurrent(e.key);
    let toActivityTypeList = activtiyTypeArr[e.key].children;
    let toPayload = JSON.parse(JSON.stringify(payload));
    toPayload.marketType = e.key;
    toPayload.marketActivityTypes = [];
    toPayload.categoryIds = [];
    toPayload.themeName = '';
    setSearchValue('');
    let toCategoryList = JSON.parse(JSON.stringify(categoryList));
    toCategoryList  = toCategoryList.map((item, index) => {
      if(index == 0){
        item.checked = true;
      }else{
        item.checked = false;
      }
      return item;
    })
    setCategoryList(toCategoryList);
    setPayload(toPayload);
    setActivityTypeList(toActivityTypeList);
  }
  //选择活动类型
  let selectactivityTypeClick = (e, val) => {
    let toActivityTypeList = JSON.parse(JSON.stringify(activityTypeList));
    let toPayload = JSON.parse(JSON.stringify(payload));
    let toMarketActivityTypes = [];
    let selectAll = false;
    toActivityTypeList.map((item,index)=>{
      if(index != 0 && val.name == item.name){
        item.checked = !item.checked;
        toActivityTypeList[0].checked = false;
      }
      if(index == 0 && val.name == item.name){
        item.checked = !item.checked;
        selectAll = true;
      }
      if(index != 0 && item.checked){
        toMarketActivityTypes.push(item.marketActivityType);
      }
    })
    if(selectAll){
      toActivityTypeList.map((item,index) => {
        if(index != 0){
          item.checked = false;
        }
        return item;
      });
      toMarketActivityTypes = [];
    }
    if(toMarketActivityTypes.length == 0){
      toActivityTypeList[0].checked = true;
    }
    toPayload.pageNo = 1;
    setPage(1);
    toPayload.marketActivityTypes = [...toMarketActivityTypes];
    setPayload(toPayload);
    setActivityTypeList(toActivityTypeList);
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
  let [searchValue, setSearchValue] = useState('');//高级搜索内容
  let searchValueChange = (e) => {
    let value = e.target.value
    setSearchValue(value);
  }
  //高级搜索
  let themeNameSearch = () => {
    let toPayload = JSON.parse(JSON.stringify(payload));
    toPayload.themeName = searchValue;
    toPayload.pageNo = 1;
    setPayload(toPayload);
  }
  //选择展示图
  let changeShowImg = (e, val, index) => {
    let toList = JSON.parse(JSON.stringify(list));
    toList[index].showImg = val;
    setList(toList);
  }
  //应用主题创建活动
  let applyTheme = (e, item) => {
    let params = {
      channelId: channelId,
      marketType: item.marketType,
      marketActivityType: item.marketActivityType,
      materialId: item.id,
      themeStyleCode: themeStyleCode[item.marketActivityType],
      saveStyleCode: saveStyleCode[item.marketActivityType]
    }
    // dispatch({
    //   type: 'activityCenter/saveActivityCenter',
    //   payload: {
    //     method: 'postJSON',
    //     params: params
    //   },
    //   callback:(res) => {
    //     if(res.result.code === '0'){
          let temp = {
            channelId: channelId,
            // objectId: res.body.activityId,
            activityCenterSave: {
              channelId: channelId,
              marketType: item.marketType,
              marketActivityType: item.marketActivityType,
              materialId: item.id,
              themeStyleCode: themeStyleCode[item.marketActivityType],
              saveStyleCode: saveStyleCode[item.marketActivityType]
            },
            activityCenter_marketActivityType: item.marketActivityType
          }
          localStorage.setItem('activityInfo', JSON.stringify(temp));
          let payload = {
            pageNo:1,
            pageSize,
            status: '',
            endTime: '',
            startTime: '',
            channelId: '',
            internalName: '',
            objectId:null,
            jumpUrlStatus: false
          }
          sessionStorage.setItem('activityListData', JSON.stringify(payload))
          localStorage.setItem('isNewActivity', true)
          localStorage.setItem('isActivityHave', '');
          localStorage.setItem('activityDetail', 0);
          localStorage.setItem('activityStep', 1);
          history.push('/activityConfig/activityList/activityModule/info');
      //   } else {
      //     message.error(res.result.message)
      //   }
      // }
    // })
  }
  //根据活动类型展示活动类型描述
  let handledesc = (marketActivityType) => {
    switch (marketActivityType) {
      case 1 :
        return '点击开始按钮转盘开始转动，最终指针指着的即为您所中的奖品。';
      case 2 :
        return '限时秒杀商品，先到先得～';
      case 3 :
        return '点击物品盲盒，快速便捷抽出好礼。';
      case 4 :
        return '满满好礼任您选择。';
      case 5 :
        return '点击娃娃机抓取按钮，爪子落下后抓取礼物，有机会获得大奖。';
      case 6 :
        return '点击游戏页面物品，砸开物品后有机会中大奖。';
      case 7 :
        return '开始后屏幕上方会不断掉落物品，用手指点击物品可获得分数，达到目标分即可抽奖～';
      case 8 :
        return '根据题目选择正确的答案，部分题目会有多个正确答案，答对题目后即可抽奖。';
      case 9 :
        return '收集目标卡片，收集完成即可开奖～';
      case 10 :
        return '点击生成海报，生成后可参与活动抽奖～';
    }
  }
  return (
    <div>
      <div className={style.block__cont__t}>
        <div className={style.activityCenter_tab}>
          <Menu mode="horizontal" selectedKeys={[tabCurrent]} onClick={changeTab} style={{fontSize: '16px',color:'#333'}}>
            {
              tabItems.map((item, key) => {
                return <Menu.Item key={item.key}>{item.label}</Menu.Item>
              })
            }
          </Menu>
        </div>
        <div className={style.theme_type}>
          <div className={style.type_title}>高级搜索：</div>
          <div className={style.top_search}>
            <Input className={style.search_input} placeholder="请输入搜索关键字" value={searchValue} onChange={searchValueChange} style={{ width: 240 }}></Input>
            <Button className={style.search_button} type="primary" icon={<SearchOutlined />} onClick={themeNameSearch}></Button>
            {/* <Search className={style.search_input} placeholder="请输入搜索关键字" allowClear enterButton={<SearchOutlined />} onSearch={themeNameSearch} style={{ width: 300 }} /> */}
          </div>
        </div>
        <div className={style.theme_type}>
          <div className={style.type_title}>活动类型：</div>
          <div className={style.type_item}>
            {activityTypeList && activityTypeList.length > 0 ? activityTypeList.map((item)=>{
                return <span className={style.item} style={item.checked ? {'backgroundColor' : '#fff','color' : '#4B7FE8','border-color' :'#4B7FE8'} : null} onClick={(e) => {selectactivityTypeClick(e,item)}}>{item.name}</span>
              })
              : <span style={{lineHeight:'38px'}}>暂无类型</span>
            }
          </div>
        </div>
        <div className={`${style.theme_type} ${style.last_type}`}>
          <div className={style.type_title}>主题分类：</div>
          <div className={style.type_item}>
            {categoryList && categoryList.length > 0 ? categoryList.map((item)=>{
                return <span className={style.item} style={item.checked ? {'backgroundColor' : '#fff','color' : '#4B7FE8','border-color' :'#4B7FE8'} : null} onClick={(e) => {selectThemeClick(e,item)}}>{item.categoryName}</span>
              })
              : <span style={{lineHeight:'38px'}}>暂无分类</span>
            }
          </div>
        </div>
        <div className={style.theme_content}>
          {
            list.length > 0 ? list.map((item, index) => {
              return <div className={style.theme_item}>
                <div className={`${style.item_left} ${item.showImg == item.showImgList[2] ? style.banner_style : null}`}>
                  <img className={style.item_showImg} src={item.showImg} alt="" />
                  <div className={style.item_images}>
                    {
                      item.showImgList.length > 0 && item.showImgList.map((image, key) =>{
                        return <div>
                          {image ? <div className={`${style.image_wrap} ${key == 2 ? style.banner_style1 : null}`} onClick={(e) => {changeShowImg(e, image, index)}} style={item.showImg == image ? {'border-color' :'#FFD500'} : null}>
                            <img src={image} alt="" />
                          </div> : null}
                        </div>
                      })
                    }
                  </div>
                </div>
                <div className={style.item_right}>
                  <div className={style.item_message}>
                    <div className={style.item_name}>{item.themeName}</div>
                    <div className={style.item_detail}>{handledesc(item.marketActivityType)}</div>
                    <div className={style.item_label}>活动类型</div>
                    <div className={style.item_data}>{item.marketActivityTypeStr}</div>
                    <div className={style.item_label}>应用数量</div>
                    <div className={style.item_data}>{item.applyAmount}次</div>
                  </div>
                  <div className={style.item_apply} onClick={(e)=>{applyTheme(e, item)}}>应用</div>
                </div>
              </div>
            })
          :<div className={style.list_black}>
            <img src={require('../../assets/activity/searchFail.png')} alt="" />
          </div>}
        </div>
        <ConfigProvider locale={zh_CN}>
          <Pagination
            className={style.pagination}
            showQuickJumper
            showTitle={false}
            showSizeChanger={false}
            current={payload.pageNo}
            defaultPageSize={payload.pageSize}
            total={pageTotal}
            onChange={onNextChange}
          />
        </ConfigProvider>
      </div>
    </div>
  )
};
export default connect(({ activityCenter }) => ({
}))(activityCenter)
