import React, { useEffect, useState, useCallback, useRef } from "react"
import { connect, history } from 'umi'
import {
  Input,
  message,
  Modal,
} from "antd"
import {RightOutlined,CloseOutlined,EllipsisOutlined,QuestionCircleOutlined,
  ArrowUpOutlined,ArrowDownOutlined,DeleteOutlined } from '@ant-design/icons';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Autoplay  } from 'swiper';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay ]);
import "swiper/swiper.less"
import 'swiper/components/navigation/navigation.less';
import 'swiper/components/pagination/pagination.less';
import 'swiper/components/scrollbar/scrollbar.less'
import huojian from '@/assets/carowner/huojian.png'
import icon_up from '@/assets/carowner/icon_up.png'
import icon_down from '@/assets/carowner/icon_down.png'
import icon_del from '@/assets/carowner/icon_del.png'
import {formatDate, formatTime} from '@/utils/date';

import style from "./style.less"
import defaultImg from '@/assets/level_m1.png';
import { resolveOnChange } from "antd/lib/input/Input";
let userBgc = require('@/assets/activity/uerInfoBg.png')
let headImg = require('@/assets/activity/moren.jpg')
let funcObj={};
const compList = (props) => {
  const { dispatch, pageCompList, noSort, isDrop,putItem,setIsDrop,settingAllData,pageAllList,marketData,queryPageComponentList, } = props;
  //获取全部组件模板列表
  useEffect(() => {
    let pageId = history.location.query.pageId;
    if(pageId){//修改
      queryPageComponentList();
    }
  }, []);
  
  
  let [bannerActivity, setBannerActivity] = useState({});
  
  // 滚动条置底操作
  let refFun = (el) => {
    if (isDrop && el) {
      const scrollHeight = el.scrollHeight + 500;//里面div的实际高度359+500
      const height = el.clientHeight;  //网页可见高度359
      const maxScrollTop = scrollHeight - height;
      el.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
      setIsDrop(false)
    }
  }
  //组件渲染判断
  const renderDom = (item) => {
    let type = item.type;
    //默认图片与默认值处理
    return funcObj[type](item);
  }
  //图片封装组件，设置默认图
  const myImg=(url,imgClass)=>{
    return <>
     {url ? <img src={url} className={imgClass}/>: <div className={`${style.my_img} ${imgClass}`}>
       <img src={defaultImg} alt="" /></div>}
    </>
  }
  //设置轮播图选中样式
  const setBannerIndex = (item,index)=>{
    let obj = {...bannerActivity};
    obj[item.objectId] = index >= item.compList.length ? 0 : index;
    setBannerActivity(obj);
  }
  const setBannerIndexLanwei=(item,index)=>{
    let obj = {...bannerActivity};
    obj[item.objectId] = index >= item.lanweiList.length ? 0 : index;
    setBannerActivity(obj);
  }
  //组件-单列图片
  funcObj.singleLinePicture = (comp) => {
    return (
      <div className={style.singleLinePicture} key={comp.objectId}>
        {myImg(comp.compList[0].pictureUrl)}
      </div>
    )
  }
  //组件-轮播图
  funcObj.carouselPicture = (comp) => {
    let speed = comp.compStyle.length && comp.compStyle[0].speed ? comp.compStyle[0].speed * 1000 : 4*1000;
    let bannerStyle = comp.compStyle[0].bannerStyle;//控制器样式
    let frontUncheckColor = comp.compStyle[0].frontUncheckColor;//控制器未选中色
    let frontCheckColor = comp.compStyle[0].frontCheckColor;//控制器选中色
    let activityIndex = bannerActivity[comp.objectId];
    return (
      <div className={comp.defaultComponent==1 ? style.carouselPicture_Top : style.carouselPicture} key={comp.objectId}>
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            allowTouchMove={false}
            loop={true}
            autoplay={
              {delay: speed}
            }
            onSlideChange={(res) => {
              setBannerIndex(comp,res.activeIndex-1);
            }}
            onSwiper={(swiper) => {}}
          >
            {
              comp.compList.map((item, index) => {
                return (
                  <SwiperSlide>{myImg(item.pictureUrl,style.car_img)}</SwiperSlide>
                )
              })
            }
            <div className={style.myPagination}>
              {
                comp.compList.map((item, index) => {
                  return (
                    <div className={bannerStyle=='2'&& (activityIndex!==undefined?activityIndex:0)==index ? 
                      style.bannerStyle2:''} style={{
                      backgroundColor: (activityIndex!==undefined?activityIndex:0)==index ? frontCheckColor : frontUncheckColor
                    }}></div>
                  )
                })
              }
            </div>
          </Swiper>
      </div>
    )
  }
  //组件-横向滚动
  funcObj.lateralSliding = (comp) => {
    return (
      <div className={style.singleLinePicture} key={comp.objectId}>
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          allowTouchMove={false}
          autoplay
          loop={true}
          pagination={{ clickable: true }}
          onSlideChange={() => {}}
          onSwiper={(swiper) => {}}
        >
          {
            comp.compList.map((item, index) => {
              return (
                <SwiperSlide>{myImg(item.pictureUrl,style.car_img)}</SwiperSlide>
              )
            })
          }
        </Swiper>
      </div>
    )
  }
  //组件-标题
  funcObj.title = (comp) => {
    return (
      <div className={style.title} key={comp.objectId}>
        <div className={style.title_name}
        style={{color:comp.compList[0].color||'#333'}}>{comp.compList[0].title}</div>
        {
          comp.compList[0].subtitle ? 
          <div className={style.title_des} style={{color:comp.compList[0].subColor}}>
            {comp.compList[0].subtitle}
            <RightOutlined />
          </div> : ''
        }
      </div>
    )
  }
  //组件-图文导航
  funcObj.pictureNavigation = (comp) => {
    return <div className={comp.defaultComponent==1 ? style.pictureNavigation_Top : style.pictureNavigation}
    key={comp.objectId} 
    style={{
      backgroundImage: comp.compStyle[0].isBackground=='1' ? `url(${comp.compStyle[0].backgroundUrl || ''})`:'',
      }}>
      {
        comp.compList.map((item, index) => {
          return <div className={style.item} key={index}>
            {myImg(item.pictureUrl,style.img)}
            <span>{item.text}</span>
          </div>
        })
      }
    </div>
  }
  //组件-掌客通-公告
  funcObj.zktNotice = (comp) => {
    return (
      <div className={style.zktNotice}  key={comp.objectId}
      style={{
        color:comp.compList.textColor||'#333',
        backgroundColor: comp.compList.backgroundColor,
      }}>{comp.compList.title}</div>
    )
  }
  //组件-掌客通-图文导航
  funcObj.zktpictureNavigation = (comp) => {
    let width = comp.compStyle.lineNum?`${100/comp.compStyle.lineNum}%`:'20%';
    return <div className={style.zktpictureNavigation} key={comp.objectId} 
    style={{backgroundColor: comp.compStyle.backgroundColor || '#fff'}}>
      {
        comp.compList.map((item, index) => {
          return <div className={style.item} key={index} 
          style={{width: width}}>
            {myImg(item.pictureUrl,style.img)}
            <span style={{color: comp.compStyle.textColor || '#333'}}>{item.title}</span>
          </div>
        })
      }
    </div>
  }
  //组件-掌客通-轮播图
  funcObj.zktPictureAdvertising = (comp) => {
    let speed = comp.compStyle.speed ? comp.compStyle.speed * 1000 : 4*1000;
    let bannerStyle = comp.compStyle.bannerStyle;//控制器样式
    let frontUncheckColor = comp.compStyle.frontUncheckColor;//控制器未选中色
    let frontCheckColor = comp.compStyle.frontCheckColor;//控制器选中色
    let activityIndex = bannerActivity[comp.objectId];
    return (
      <div className={style.carouselPicture} key={comp.objectId}>
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            allowTouchMove={false}
            loop={true}
            autoplay={
              {delay: speed}
            }
            onSlideChange={(res) => {
              setBannerIndex(comp,res.activeIndex-1);
            }}
            onSwiper={(swiper) => {}}
          >
            {
              comp.compList.map((item, index) => {
                return (
                  <SwiperSlide>{myImg(item.pictureUrl,style.car_img)}</SwiperSlide>
                )
              })
            }
            <div className={style.myPagination}>
              {
                comp.compList.map((item, index) => {
                  return (
                    <div className={bannerStyle=='2'&& (activityIndex!==undefined?activityIndex:0)==index ? 
                      style.bannerStyle2:''} style={{
                      backgroundColor: (activityIndex!==undefined?activityIndex:0)==index ? frontCheckColor : frontUncheckColor
                    }}></div>
                  )
                })
              }
            </div>
          </Swiper>
      </div>
    )
  }
  //组件-黄金位
  funcObj.goldPosition = (comp) => {
    return <div className={comp.defaultComponent==1 ? style.goldPosition_Top : style.pictureNavigation} key={comp.objectId}>
      {
        comp.compList.map((item, index) => {
          return <div className={style.item} key={index}>
            {myImg(item.pictureUrl,style.img)}
            <span>{item.text}</span>
          </div>
        })
      }
    </div>
  }
  //组件-橱窗位
  funcObj.windowPosition = (comp) => {
    return (
      <div className={style.windowPosition} key={comp.objectId}>
        <div className={style.img_left}>
          {myImg(comp.compList[0].pictureUrl)}
        </div>
        <div className={style.img_right}>
          {myImg(comp.compList[1].pictureUrl,style.img_right_img)}
          {myImg(comp.compList[2].pictureUrl,style.img_right_img)}
        </div>
      </div>
    )
  }
  //组件-双列图
  funcObj.doubleRowPicture = (comp) => {
    return (
      <div className={style.doubleRowPicture} key={comp.objectId}>
        {
          comp.compList.map((item, index) => {
            return myImg(item.pictureUrl)
          })
        }
      </div>
    )
  }
  //组件-分割占位
  funcObj.partitionFootprint = (comp) => {
    let styleData = comp.compList[0]
    return (
      <div style={
        {
          backgroundColor: styleData.backgroundColor ? styleData.backgroundColor : 'transparent',
          padding: `${styleData.lineHeight || 10}px 0`
        }
      } className={style.partitionFootprint} key={comp.objectId}>
        <div style={
          {
            borderBottom: `1px ${styleData.lineStyle || 'dashed'} ${styleData.lineColor || '#ccc'}`
          }
        } className={style.line}></div>
      </div>
    )
  }
  //组件-活动1
  funcObj.activity1 = (comp) => {
    return (
      <div className={style.activity1} key={comp.objectId}>
        <div className={style.img_left}>
          {myImg(comp.compList[0].pictureUrl)}
        </div>
        <div className={style.text_right}>
          <div className={style.text_right_title}>{comp.compList[0].title}</div>
          <div className={style.text_right_des}>{comp.compList[0].subtitle}</div>
        </div>
      </div>
    )
  }
  //组件-活动2
  funcObj.activity2 = (comp) => {
    return (
      <div className={style.activity2} key={comp.objectId}>
        <div className={style.img}>
          {myImg(comp.compList[0].pictureUrl)}
        </div>
        <div className={style.text}>
          <div className={style.text_title}>{comp.compList[0].title}</div>
          <div className={style.text_des}>点击查看</div>
        </div>
      </div>
    )
  }
  //组件-内容分类1
  funcObj.contentType1 = (comp) => {
    return (
      <div className={style.contentType1} key={comp.objectId}>
        <div style={
          {
            color: comp.compStyle[0].frontUncheckColor ? `${comp.compStyle[0].frontUncheckColor}` : '#444',
            backgroundColor: `${comp.compStyle[0].backgroundColor}`,
            paddingTop: `${comp.compStyle[0].marginTop}`,
            paddingBottom: `${comp.compStyle[0].marginTop}`,
          }
        } className={style.listAll}>
          {
            comp.compList.map((item, index) => {
              return <div className={style.listBox}>{item.menuName}</div>
            })
          }
        </div>
      </div>
    )
  }
  //组件-内容分类2
  funcObj.contentType2 = (comp) => {
    return (
      <div className={style.contentType2} style={{
        backgroundColor:comp.compStyle[0].backgroundColor,
        paddingTop: comp.compStyle[0].marginTop,
        paddingBottom: comp.compStyle[0].marginBottom
        }}>
        {
          comp.compList.map((item, index) => {
            return <div className={style.contentList_box}
            style={{boxShadow: comp.compStyle[0].needFrame=='0' ? `0 2px 6px ${comp.compStyle[0].frameColor || '#fff'}`:''}}>
              <div className={style.contentList_box_img}>
                {myImg(item.pictureUrl)}
              </div>
              <div className={style.contentList_box_des} style={{color:comp.compStyle[0].frontUncheckColor}}>{item.menuName}</div>
            </div>
          })
        }
      </div>
    )
  }
  //组件-用户信息
  funcObj.userInfo = (comp) => {
    let compSet = comp.compList;
    return <div className={style.userInfo}>
      <img className={style.userBgc} src={compSet.background || userBgc} alt="" />
      <div className={style.userBgc_head_img}>
        <img src={headImg} alt="" />
      </div>
      <div className={style.userBgc_phone}>185****5660</div>
      {compSet.type==1 || !compSet.type ? <div className={style.userBgc_car}>沪A8R75C</div> :
      <div className={style.grow_bar_box}>
        <p>提升成长值 <RightOutlined /></p>
        <div className={style.grow_left}>
          <span></span> 200</div>
        <div className={style.grow_bar}>
          <div className={style.grow_bar_white}><img src={huojian} /></div>
        </div>
        <div className={style.grow_right}> 400 <span></span></div>
        <p>成长规则<QuestionCircleOutlined /></p>
      </div>}
    </div>
  }
  //页面内容
  funcObj.pageContent = (comp) => {
    let compSet = comp.compList;
    let pageNameUnique = history.location.query.pageNameUnique;
    let imgSrc = `https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/images/carowner-admin/page-content/pageContent_bg_${pageNameUnique}.jpg`;
    return <div className={style.pageContent}>
      <img src={imgSrc} className={style.pageContent_bg}/>
    </div>
  }
  
  //智能栏位
  funcObj.smartField = (comp) => {
    let compSet = comp.compList;
    let lanweiList = [];
    if(compSet.contentShowNum==1){
      lanweiList = comp.lanweiList && [comp.lanweiList[0]] || [];
    }else{
      lanweiList = comp.lanweiList || [];
    }
    if(lanweiList && lanweiList.length){//调用内容列表
      let activityIndex = bannerActivity[comp.objectId];
      return <>
        {
          compSet.contentType===1?<div className={style.carouselPicture} key={comp.objectId} 
          style={{height:`${compSet.imgHeight || 160}px`,}}>
          <Swiper
              spaceBetween={50}
              slidesPerView={1}
              allowTouchMove={false}
              loop={compSet.contentShowNum!==1}
              autoplay={
                {delay: compSet.speed*1000}
              }
              onSlideChange={(res) => {
                setBannerIndexLanwei(comp,res.activeIndex-1);
              }}
              onSwiper={(swiper) => {}}
            >
              {
                lanweiList.map((item, index) => {
                  return (
                    <SwiperSlide>
                      <img className={style.car_img} src={item.imageUrl} 
                      style={{'border-radius': compSet.imgAngle==2?'8px':'0',height:`${compSet.imgHeight || 160}px`,}} />
                    </SwiperSlide>
                  )
                })
              }
              <div className={style.myPagination}>
                {
                  compSet.contentShowNum!==1 && lanweiList.map((item, index) => {
                    return (
                      <div className={compSet.bannerStyle== 2 && (activityIndex!==undefined?activityIndex:0)==index ? 
                        style.bannerStyle2:''} style={{
                        backgroundColor: (activityIndex!==undefined?activityIndex:0)==index ? '#4B7FE8' : '#999'
                      }}></div>
                    )
                  })
                }
              </div>
            </Swiper>
          </div> :''
        }
        {
          compSet.contentType===2 ? <div className={style.insuranceSupermarket}>
            <div className={style.content}>
            {
              lanweiList.map((item,index)=>{
                return <div className={style.content_item_list}>
                <div className={style.info}>
                  <div className={style.img_box} style={{backgroundImage: `url(${item.goodImg})`}}></div>
                  <div className={style.text_box}>
                    <div className={style.text_title}>{item.goodTitle}</div>
                    <div className={style.text_max}>最高保障 {item.guarAmount}{item.amountUnit==1?'千':'万'}</div>
                    <div className={style.text_price}>
                      <span className={style.span_big}>
                      {item.goodPrice}</span>{item.priceType=='起步价'?'元起':'元'}
                    </div>
                  </div>
                </div>
                <div className={style.desc}>
                  <div className={style.desc_text} style={{color:item.descColor,}}>
                    <span>{item.goodDesc}</span>{item.descDetails}
                  </div>
                  <div className={style.desc_bg}
                  style={{background:item.descColor,}}></div>
                </div>
              </div>
              })
            }
            </div>
          </div>:''
        }
        {
          compSet.contentType===3?<div className={style.article_box}>
            {
              lanweiList.map((item,index)=>{
                let imgUrls = item.imgUrls && item.imgUrls.filter((item)=>{return item}) || [];
                return <div className={style.article_item}>
                  <div className={imgUrls.length<=1 ? style.article_style1 : style.article_style2}>
                    <div className={style.article_info}>{item.articleTitle}</div>
                    <div className={style.article_img_box}>
                    {
                      imgUrls.map((imgItem,index)=>{
                        return <img src={imgItem} />
                      })
                    }
                    </div>
                  </div>
                  <div className={style.article_time}>{formatTime(item.updateTime)}</div>
                </div>
              })
            }
          </div>:''
        }
      </>
    }else{
      return <div className={style.smartField_tips}>组件配置完成后展示</div>;
    }
  }
  //组件 保险超市
  funcObj.insuranceSupermarket = (comp) => {
    let goodsList = [];
    if(comp.compList.listType==3 || comp.compList.listType==2){
      goodsList = marketData.goodsList.slice(0,2);
    }
    if(comp.compList.listType==1){
      goodsList = marketData.goodsList.slice(0,1);
    }
    return <div className={style.insuranceSupermarket}>
      <div className={style.tabs}>
      {marketData.tabList.map((item)=>{
        return <div className={style.tab_item}>{item.className}</div>
      })}
      </div>
      <div className={style.content}>
      {goodsList.map((item)=>{
        return <>
        {/* 列表模式 */}
        { comp.compList.listType==3 ? <div className={style.content_item_list}>
          <div className={style.info}>
            <div className={style.img_box} style={{backgroundImage: `url(${item.goodImg})`}}></div>
            <div className={style.text_box}>
              <div className={style.text_title}>{item.goodTitle}</div>
              <div className={style.text_max}>最高保障 {item.guarAmount}{item.amountUnit==1?'千':'万'}</div>
              <div className={style.text_price}>
                <span className={style.span_big}>
                {item.goodPrice}</span>{item.priceType=='起步价'?'元起':'元'}
              </div>
            </div>
          </div>
          <div className={style.desc}>
            <div className={style.desc_text} style={{color:item.descColor,}}>
              <span>{item.goodDesc}</span>{item.descDetails}
            </div>
            <div className={style.desc_bg}
            style={{background:item.descColor,}}></div>
          </div>
        </div>:''}
        {/* 一行两个 */}
        { comp.compList.listType==2 ? <div className={style.content_item_tow}>
          <div className={style.info}>
            <div className={style.img_box} style={{backgroundImage: `url(${item.goodImg})`}}></div>
            <div className={style.text_box}>
              <div className={style.text_title}>{item.goodTitle}</div>
              <div className={style.text_max}>最高保障 {item.guarAmount}{item.amountUnit==1?'千':'万'}</div>
              <div className={style.desc}>
                <div className={style.desc_text} style={{color:item.descColor,}}>
                  <span>{item.goodDesc}</span>{item.descDetails}
                </div>
                <div className={style.desc_bg}
                style={{background:item.descColor,}}></div>
              </div>
              <div className={style.text_price}>
                <span className={style.span_big}>
                {item.goodPrice}</span>{item.priceType=='起步价'?'元起':'元'}
              </div>
            </div>
          </div>
        </div>:''}
        {/* 大图模式 */}
        { comp.compList.listType==1 ? <div className={style.content_item_big}>
          <div className={style.info}>
            <div className={style.img_box} style={{backgroundImage: `url(${item.goodImg})`}}></div>
            <div className={style.text_box}>
              <div className={style.text_title}>{item.goodTitle}</div>
              <div className={style.desc_box}>
                <div className={style.desc}>
                  <div className={style.desc_text} style={{color:item.descColor,}}>
                    {item.goodDesc}
                  </div>
                  <div className={style.desc_bg}
                  style={{background:item.descColor,}}></div>
                </div>
                <div className={style.desc}>
                  <div className={style.desc_text} style={{color:item.descColor,}}>
                    {item.descDetails}
                  </div>
                  <div className={style.desc_bg}
                  style={{background:item.descColor,}}></div>
                </div>
              </div>
              <div className={style.bottom}>
                <div className={style.text_price}>
                  <span className={style.text_gray}>{item.priceDefine} </span>
                  <span className={style.span_big}>{item.goodPrice}</span>
                  {item.priceType=='起步价'?'元起':'元'}
                </div>
                <div className={style.text_max}>
                  <span className={style.text_gray}>最高保障 </span>
                  <span className={style.span_big}>{item.guarAmount}</span>
                  {item.amountUnit==1?'千':'万'}
                </div>
              </div>
            </div>
          </div>
        </div>:''}
        </>
      })}
      </div>
    </div>
  }
  //点击子组件
  const putKey = (item) => {
    dispatch({
      type: 'carowner_pageManage/setPutItem',
      payload: {
        isClick:true,
        ...item,
      }
    })
  }

  //删除组件
  const delComp=()=>{
    let noDelete = ['insuranceSupermarket','pageContent'];
    if(noDelete.includes(putItem.type)){
      message.error('不可删除');
      return;
    }
    if(history.location.query.pageNameUnique=='memberCenter' && putItem.type=='userInfo'){
      message.error('不可删除');
      return;
    }
    Modal.confirm({
      content:'您确定要删除当前选中组件吗？',
      onOk:()=>{
        let list = JSON.parse(JSON.stringify(pageAllList));
        for(let i=0;i<list.length;i++){
          if(putItem.objectId==list[i].objectId){
            list.splice(i,1);
            --i;break;
          }
        }
        dispatch({
          type:'carowner_pageManage/setPageComponentList',
          payload: list,
        })
        dispatch({
          type: 'carowner_pageManage/setPutItem',
          payload: {}
        })
        dispatch({
          type: 'carowner_pageManage/setSendItem',
          payload: {}
        })
      }
    })
  }
  //设置上下移动
  const setSort=(type)=>{
    if(putItem.defaultComponent=='1' || putItem.type=='userInfo') return message.info('置顶组件无法移动');
    let _pageCompList = JSON.parse(JSON.stringify(pageCompList));
    for(let i=0;i<_pageCompList.length;i++){
      let item = _pageCompList[i];
      if(item.objectId==putItem.objectId){
        let addIndex = i;
        if(type=='up'){
          if(addIndex==0) return;
          --addIndex;
        }else{
          ++addIndex;
        }
        let delItem = _pageCompList.splice(i,1);
        _pageCompList.splice(addIndex,0,...delItem);
        break;
      }
    }
    dispatch({
      type:'carowner_pageManage/setPageComponentList',
      payload: [...noSort,..._pageCompList]
    })
  }

  return (
    <div className={style.posiBox}>
      {JSON.stringify(putItem)!='{}' ? <div className={style.handler_box}>
        <img src={icon_up} onClick={()=>{setSort('up')}} />
        <img src={icon_down} onClick={()=>{setSort('down')}} />
        <img src={icon_del} onClick={delComp} />
      </div>:''}
      <div className={style.phoneTopBox}>
        <div className={style.phoneTitle}><CloseOutlined /><span>
          {settingAllData.isDisplayName ? settingAllData.pageName:''}</span><EllipsisOutlined /></div>
      </div>
      <div className={style.compList} ref={(el) => { refFun(el) }} 
        style={{
          background: settingAllData.backgroundColor || '#fff',
        }}>
        {noSort.map((item, index) => {
          return <div onClick={() => { putKey(item) }} className={putItem.objectId==item.objectId?style.activeItem:''}>
            {renderDom(item)}
          </div>
        })}
        <Droppable droppableId="comp-box" type="PERSON">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {pageCompList.map((item, index) => {
                return <Draggable draggableId={'compItem-' + item.objectId} index={index} key={item.objectId}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} className={style.compHoverBox}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                      <div onClick={() => { putKey(item) }} className={putItem.objectId==item.objectId?style.activeItem:''}>
                        {renderDom(item)}
                      </div>
                    </div>
                  )}
                </Draggable>
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {!pageCompList.length && !noSort.length ? 
        <div className={style.no_data_tips}>您还没有保存过组件...</div>:''}
      </div>
    </div>
  )
};
export default connect(({ carowner_pageManage }) => ({
  pageCompList: carowner_pageManage.pageCompList,
  noSort: carowner_pageManage.noSort,
  putItem: carowner_pageManage.putItem,
  pageItem: carowner_pageManage.pageItem,
  settingAllData: carowner_pageManage.settingAllData,
  pageAllList: carowner_pageManage.pageAllList,
  marketData: carowner_pageManage.marketData,
}))(compList)
