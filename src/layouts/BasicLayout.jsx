/**
 * 基础layout 包含菜单
 */
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef,useState } from 'react';
import { Link, connect, history } from 'umi';
import { ConfigProvider,Modal,Menu,Dropdown, message,Button } from 'antd';
const { SubMenu } = Menu;

import RightContent from '@/components/GlobalHeader/RightContent';
import { getMatchMenu } from '@umijs/route-utils';
import logo from '../assets/logo.png';
import 'moment/locale/zh-cn';
import '@/css/index.less';
import styles from './BlankLayout.less';
import ResetPwd from './ResetPwd';
//提前定义icon 减少打包大小
import {RightOutlined,EllipsisOutlined,ExclamationCircleFilled,DownOutlined,UpOutlined} from '@ant-design/icons';

let currentYear = new Date().getFullYear();
let menuDataRes = [];
let topMenuIds = [];//最外层菜单id
let routeList = [];//全部routes平级列表
let iconPath = 'https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/images/carowner-admin/menu-icon/';//icon的远程路径

//变量菜单列表，获取第一个菜单
const eachMenuGetpath = (list)=>{
  let path = '';
  for(let item of list){
    if(item.children && item.children.length){
      path = eachMenuGetpath(item.children);
    }else{
      path = item.path;
    }
    if(path) return path;
  }
}

//设置面包屑Item
const breadItem = (obj,component='')=>{
  return {
    breadcrumbName: obj.name,
    path: obj.path,
  }
}
//深度遍历routes
const setRouteList = (list)=>{
  let _list = [];
  for(let item of list){
    if(item.path){
      let obj = {
        path: item.path,
        name: item.name,
        component:item.component,
      }
      _list.push(obj);
    }
    if(item.children && item.children.length){
      let childrenList = setRouteList(item.children);
      _list = _list.concat(childrenList);
    }
  }
  return _list;
}
const eachRoutes = (list,path)=>{
  for(let item of list){
    if(item.path==path){
      return item;
    }
  }
}
//菜单处理
const menuDataRender = (list) => {
  return list.map((item) => {
    const localItem = {
      ...item,
      children: item.childNodeMenuInfos && item.childNodeMenuInfos.length ? menuDataRender(item.childNodeMenuInfos) : [],
    };
    return localItem;
  });
}
//匹配路由菜单，当进入子路由时 匹配菜单列表中存在的上级路由
//path为菜单路由
const getSelMenu = (path)=>{
  let _pathName = history.location.pathname;
  return _pathName.includes(path) && _pathName.indexOf(path) <=0
}
//获取当前地址的顶级路由
const getTopMenu = ()=>{
  if(window._user_menuList_obj){
    let currentTopPath = window._user_menuList_obj[history.location.pathname];
    if(!currentTopPath){//找不到当前路由 可能进入了子页面
      for(let key in window._user_menuList_obj){
        if(getSelMenu(key) && window._user_menuList_obj[key].isPage){
          return window._user_menuList_obj[key] || {};
        }
      }
      return {};//不存在的页面
    }else{
      return currentTopPath;
    }
  }
}
//设置菜单选中
const setIconSelect = (res,hoverTop)=>{
  let currentTopPath = getTopMenu();
  return currentTopPath.topMenu == res.path || hoverTop == res.path ? '_selected' : '';
}
//设置菜单选中加粗
const setFontSelect = (res)=>{
  let currentTopPath = getTopMenu();
  return currentTopPath.topMenu == res.path;
}


const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    roleData,
    openSearch,
    bottomArea,
  } = props;
  const menuDataRef = useRef([]);
  const [pageTitle,setPageTitle] = useState('');
  const [breadcrumbList,setBreadcrumbList] = useState([]);
  const [isModalVisible,setIsModalVisible] = useState(false);
  const [hoverTop,setHoverTop] = useState('');
  const [meunData,setMeunData] = useState([]);
  const [childrenData,setChildrenData] = useState([]);
  const [openKeys,setOpenKeys] = useState([]);
  const [showMenuAll,setShowMenuAll] = useState(false);
  const [selectedKeys,setSelectedKeys] = useState([]);
  const [imgPage,setImgPage] = useState('');
  const [isOpenTips,setIsOpenTips] = useState(false);
  const [nowPageTips,setNowPageTips] = useState({});
  const [showTipBtn,setShowTipBtn] = useState(false);

  //展开收起，顶部提示
  const openTips=()=>{
    setIsOpenTips(!isOpenTips);
  }

  //顶部菜单点击事件
  const topMenuClick=(res)=>{
    for(let item of meunData){
      if(item.path == res.path){
        let firstPath = eachMenuGetpath(item.children);
        history.push(firstPath);
        return;
      }
    }
  }
  routeList = setRouteList(props.route.children);

  //显示所有一级菜单 下拉框
  const setMenuAll=()=>{
    let topAllBtn = document.querySelector('.top_menu-top-menu-box');
    if(topAllBtn) setShowMenuAll(topAllBtn.clientHeight>64)
  }
  // 清空缓存数据
  const clearSaveData=()=>{
    window.smartField_groupList = [];
  }
  //路由监听
  const historyWatch=()=>{
    history.listen((location)=>{
      clearSaveData();
      if(window.bottomArea_path !== location.pathname){
        dispatch({
          type:'global/setBottomArea',
          payload: null
        })
      }
      if(window.pageMinWidth_path !== location.pathname){
        dispatch({
          type:'global/setPageMinWidth',
          payload: null
        })
      }
      //是否是菜单路由
      let isMenu = window._user_menuList_obj[history.location.pathname];
      for(let key in window._user_menuList_obj){
        let item = window._user_menuList_obj[key];
        if(getSelMenu(key) && item.isPage){
          setSelectedKeys([key]);
          isMenu && setNowPageTips({
            description: item.description || '',
            exhibitStatus: item.exhibitStatus,
            guideStatus: item.guideStatus,
          });
          let dom = document.querySelector('.tip_text_dom');
          setIsOpenTips(item.exhibitStatus==1 && dom && dom.clientHeight>22);
          if(item.icon && item.icon.includes('https://')){ //demo页面，展示demo图片
            setImgPage(item.icon);
          }else{
            setImgPage('');
          }
          return;
        }else{
          setNowPageTips({});
        }
      }
    })
  }
  useEffect(()=>{
    setTipBtnShow();
  },[nowPageTips])

  //设置展开按钮是否显示
  const setTipBtnShow=()=>{
    let dom = document.querySelector('.tip_text_dom');
    if(dom){
      setShowTipBtn(dom.clientHeight>22);
    }
  }

  //页面初始化useEffect 
  useEffect(() => {
    //获取用户基本信息
    dispatch({
      type: 'setTagPanel/getUserInfo',
      payload: {
        method: 'get',
        params: {}
      },
    });
    let tokenObj = localStorage.getItem("tokenObj") ? JSON.parse(localStorage.getItem("tokenObj")) : {};
    //强制重置密码
    if(tokenObj.isReset){
      setIsModalVisible(true);
    }
    //获取菜单数据
    dispatch({
      type: 'login/getRoleData',
      payload: {
        method: 'get',
        params: {}
      },
      callback:(res)=>{
        let _menuInfo = res && res.menuInfo;
        let meunData = menuDataRender(_menuInfo);//处理菜单数据，添加icon映射字段
        for(let item of meunData){//由于在menu数据附带字段会被复制进子路由，这里单独将一级路由加入一个列表，用于一级路由的渲染判断
          topMenuIds.push(item.id);
        }
        setMeunData(meunData);
        historyWatch();
      }
    });
    //顶部菜单 出现全部按钮
    window.onresize = () => {
      setMenuAll();
      setTipBtnShow();
    }
    // listenRoute();//直接监听 无需等待数据返回
  }, []);

  //搜索展开收起时，监听
  useEffect(()=>{
    setMenuAll();
  },[openSearch])

  //监听路由变化 渲染二三级菜单
  useEffect(()=>{
    if(meunData.length){
      let currentTopPath = getTopMenu();
      let _childrenData = meunData.filter(item=>{
        return item.path == currentTopPath.topMenu;
      })[0]
      setChildrenData(_childrenData && _childrenData.children);
    }
    if(meunData.length){
      let currentTopPath = getTopMenu();
      setOpenKeys(currentTopPath.parentMenu);
    }
    setMenuAll();
  },[selectedKeys,meunData])

  //菜单点击方法
  const handleClick=(obj)=>{
    history.push(obj.key)
  }

  const subClick = (path,parentPath)=>{
    if(openKeys.includes(path)){//点击展开的菜单
      let _openKeys = JSON.parse(JSON.stringify(openKeys));
      for(let i=0;i<_openKeys.length;i++){
        if(_openKeys[i] == path){
          _openKeys.splice(i,1);//剔除当前展开的菜单
        }
      }
      setOpenKeys(_openKeys)
    }else{
      setOpenKeys([...parentPath,path])
    }
  }

  //子菜单渲染 递归 后续可加入更多层级的菜单
  const menuItemRender = (list,parentPath=[])=>{
    return list.map((item)=>{
      //有子菜单
      if(item.children && item.children.length){
        return <SubMenu key={item.path}
        icon={<div className={styles.arrow_icon} style={{transform: openKeys.includes(item.path) ? 'rotate(90deg)' : 'rotate(0)'}}><RightOutlined style={{
          fontSize: '12px',
          transform: 'scaleX(0.8)',
        }} /></div>}
        title={<div className={styles.pro_icon_box}>{item.name}
          {item.menuMark?<img className={styles.pro_icon} src={item.menuMark} />:''}
        </div>} onTitleClick={()=>subClick(item.path,parentPath)}>
          {menuItemRender(item.children,[...parentPath,item.path])}
        </SubMenu>
      }else{
        return <Menu.Item key={item.path}>
          <div className={styles.pro_icon_box}>
            {item.name}
            {item.menuMark?<img className={styles.pro_icon} src={item.menuMark} />:''}
          </div>
        </Menu.Item>
      }
    })
  }

  const dropMeun = ()=>(
    <Menu className={styles.drop_menu} onClick={e=>topMenuClick({path:e.key})}>
      {
        meunData.map((item)=>{
          return <Menu.Item key={item.path} >
            <div className={setFontSelect(item)?styles.drop_item_active:''}>
              <img className={styles.drop_menu_icon} src={`${iconPath}${item.icon || 'user'}${setFontSelect(item)?'_selected':''}.png`} alt="" />
              {item.name}
            </div>
          </Menu.Item>
        })
      }
    </Menu>
  )

  const demoTips = ()=>{
    message.info('抱歉！您暂无权限使用该功能，请联系管理员开通。')
  }

  return (
    <>
      <ProLayout
        {...props}
        {...settings}
        logo={logo}
        title=""
        // siderWidth="160"
        collapsedButtonRender={false}
        menuRender={()=>(
        <div class="antd-side_menu">
            <Menu
            onClick={handleClick}
            style={{ width: '100%' }}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            mode="inline"
          >
          {
            childrenData && childrenData.length && menuItemRender(childrenData) || ''
          }
          <div className={styles.infoFooter}>{`© 2015-${currentYear}版权所有`} <br />上海路天信息科技有限公司</div>
          </Menu>
        </div>
        )}
        //自定义顶部菜单渲染
        headerRender={()=>(
          <div className={styles.top_box}>
            <div className={styles.top_left}>
              <div className={styles.top_logo}><img src={logo} /></div>
              <div className={styles.top_menu}>
                <div class="top_menu-top-menu-box">
                  {meunData.map((item)=>{
                    return <div className={`${styles.menu_item} 
                    ${setFontSelect(item)?styles.menu_item_active:'' } 
                    ${["销售","会员"].includes(item.name)?styles.menu_item_posi_hover:''}`}
                    onMouseEnter={()=>setHoverTop(item.path)}
                    onMouseLeave={()=>setHoverTop('')}
                    onClick={()=>{topMenuClick(item)}}
                    
                    >
                      <div className={styles.menu_item_posi}>
                        <img className={styles.menu_item_icon} src={`${iconPath}${item.icon || 'user'}${setIconSelect(item,hoverTop)}.png`} alt="" />
                        <span>{item.name}</span>
                        {item.menuMark?<img src={item.menuMark} className={styles.menu_item_label} />:''}
                      </div>
                      {item.name=='销售' ?<div className={styles.top_showLogo} >
                        <img src={'https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/images/carowner-admin/icons/logo_zkt.png'} />
                      </div>:''}
                      {item.name=='会员'?<div className={styles.top_showLogo} >
                        <img src={'https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/images/carowner-admin/icons/logo_hyt.png'} />
                      </div>:''}
                    </div>
                  })}
                </div>
                {showMenuAll ? <div className={styles.top_all_menu}>
                  <Dropdown trigger="hover" overlay={dropMeun} placement="bottomRight">
                    <p><EllipsisOutlined /></p>
                  </Dropdown>
                </div>:''}

              </div>
            </div>
            <div className={styles.top_right}><RightContent /></div>
          </div>
        )}
        // breadcrumbRender={(routes) => {
        //   return setBreadCrumb(roleData);
        // }}
        // itemRender={(route, params, routes, paths) => {
        //   const first = routes.indexOf(route) === 0;
        //   return first && route.component ? (
        //     <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        //   ) : (
        //     <span>{route.breadcrumbName}</span>
        //   );
        // }}
      >
        <PageContainer
          ghost
          header={{
            title: false,
            breadcrumb: {},
          }}
          >
          {imgPage?<div className={styles.imgPage}><img src={imgPage} alt="" onClick={demoTips}/></div> :
           <>
            {nowPageTips.guideStatus == 1 ? <div className={styles.tip_con} style={{
              'padding-right':isOpenTips ?'24px':'70px',
              'padding-bottom':isOpenTips && showTipBtn?'40px':'16px',
              }}>
                  <div className={styles.tip_con_info}>
                    <ExclamationCircleFilled className={styles.tip_icon}/>
                    <div className={styles.tip_text} style={{
                      height:isOpenTips?'auto':'22px',
                      }} >
                        <div className={'tip_text_dom'} dangerouslySetInnerHTML={{ __html: nowPageTips.description }}></div>
                      </div>
                  </div>
                  {showTipBtn ? <div className={styles.open_btn} onClick={openTips}>
                    {isOpenTips?
                    <><UpOutlined />收起</> : 
                    <><DownOutlined />展开</>}
                  </div>:''}
                </div>:'' }
            {children}
            </> }
            {/* 底部区域占位 */}
            {bottomArea?<>
              <div className={styles.bottom_area_posi}>底部区域占位</div>
            </>:''}
        </PageContainer>
      </ProLayout>
      <Modal
        title="修改初始密码"
        visible={isModalVisible}
        cancelButtonProps={{ disabled: true }}
        footer={null}
        >
          <ResetPwd />
      </Modal>
    </>
  );
};

export default connect(({ global, settings, user, setTagPanel,login }) => ({
  collapsed: global.collapsed,
  settings,
  user,
  setTagPanel,
  roleData: login.roleData,
  openSearch: global.openSearch,
  bottomArea: global.bottomArea,
  
}))(BasicLayout);
