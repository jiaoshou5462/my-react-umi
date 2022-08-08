import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, Upload, message, Button, Radio, Tabs, InputNumber,Popover, Select
} from "antd";
import { PlusOutlined, DeleteOutlined, UpOutlined, DownOutlined,DownloadOutlined } from '@ant-design/icons';
import { uploadIcon } from '@/services/activity.js';
import SetColor from '@/pages/activityModule/components/setColor';   //选择颜色组件
import style from "./style.less";
import Information from "./modal/information";
import Activity from "./modal/activity";
import Product from "./modal/product";
import {miniProgram_dict,type_dict} from '@/pages/carowner/platform/pageManage/dict.js'

const { TabPane } = Tabs;
const { Option, OptGroup } = Select;

let defObj={
  pictureUrl:'',
  title:'',
  type:'customLink',
  content:{
    value:'',
    label:'',
  }
}

const getDictName=(dict,value)=>{
  for(let item of dict){
    if(item.value==value){
      return item.label;
    }
  }
}
let currentIndex = 0;//当前打开的弹窗所属的item下标
let selectedKeys = [];//当前打开的弹窗所属的item

// 1轮播图
const zktPictureAdvertising = (props) => {
  const { dispatch, putItem,pageAllList } = props;
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };

  // 总数据list内容设置
  let [formData, setFormData] = useState([])
  // 总数据style样式设置
  let [formDataStyle, setFormDataStyle] = useState({})
  let [activeKey, setActiveKey] = useState('1')
  const [modalName,setModalName] = useState('');

  useEffect(() => {
    setActiveKey('1')//重置tab
    if (JSON.stringify(putItem)!='{}') {
      let newObj = JSON.parse(JSON.stringify(putItem));
      if(newObj.compList[0].type){//有值
        setFormData(newObj.compList);
      }else{//初始化 赋默认值
        newObj.compList[0] = defObj
        setFormData(newObj.compList);
      }
      console.log(putItem.compStyle)
      if(putItem.compStyle && putItem.compStyle.bannerStyle){
        setFormDataStyle(newObj.compStyle);
      }else{
        setFormDataStyle({
          bannerStyle: '1',//（轮播圆点）样式
          frontCheckColor: "#4b7fe8",//选中色
          frontUncheckColor: "#999",//未选中色
          speed: 2//轮播速度
        });
      }
    }
  }, [putItem])


  useEffect(() => {
    if(putItem.isClick){
      delete putItem.isClick;return;
    }
    let newObj = JSON.parse(JSON.stringify(putItem));
    newObj.compList = JSON.parse(JSON.stringify(formData));
    newObj.compStyle = JSON.parse(JSON.stringify(formDataStyle));
    dispatch({
      type: 'carowner_pageManage/setSendItem',
      payload: newObj
    })
  }, [formData, formDataStyle])

  //图片上传
  let imgUpload = (i, file) => {
    // console.log(file,'888')/
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传JPG/PNG 格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能高于 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  // 改变图片1
  let imgChange = (i, info) => {
    let toFormData = JSON.parse(JSON.stringify(formData));
    let toItems = info.file.response ? info.file.response.items : '';
    toFormData[i].pictureUrl = toItems;
    setFormData([...toFormData]);
  };

  //标题
  let inputChange = (i, e) => {
    let toFormData = JSON.parse(JSON.stringify(formData));
    toFormData[i].title = e;
    setFormData([...toFormData]);
  };
  //输入链接
  let linkChange = (i, e) => {
    let toFormData = JSON.parse(JSON.stringify(formData));
    toFormData[i].content = {
      value: e,
      label: e,
    };
    setFormData([...toFormData]);
  };
  //类型
  let typeChange = (i, e) => {
    let toFormData = JSON.parse(JSON.stringify(formData));
    toFormData[i].type = e;
    toFormData[i].content={};
    setFormData([...toFormData]);
  };
  //小程序页面选择
  let miniPageChange = (i, e,option) => {
    console.log(option)
    let toFormData = JSON.parse(JSON.stringify(formData));
    toFormData[i].content = {
      value: e,
      label: option.children,
    };
    setFormData([...toFormData]);
  };

  //增加图片列表3
  let addList = e => {
    let toFormData = JSON.parse(JSON.stringify(formData));
    toFormData.push(defObj)
    setFormData([...toFormData]);
  }


  //样式(轮播圆点)4
  let styleChange = e => {
    let toFormDataStyle = JSON.parse(JSON.stringify(formDataStyle));
    toFormDataStyle.bannerStyle = e.target.value;
    setFormDataStyle(toFormDataStyle);
  };

  //颜色5
  let setMcolor = (n, i) => {//名称，颜值
    let toFormDataStyle = JSON.parse(JSON.stringify(formDataStyle));
    toFormDataStyle[n] = i;
    setFormDataStyle(toFormDataStyle);
  };
  //重置颜色
  const resetColor=(name)=>{
    let toFormDataStyle = JSON.parse(JSON.stringify(formDataStyle));
    let resetStr = name=='frontUncheckColor' ? '#999' : '#4b7fe8';
    toFormDataStyle[name] = resetStr;
    setFormDataStyle(toFormDataStyle);
  }
  //轮播速度6
  let numberChange = (e) => {
    let toFormDataStyle = JSON.parse(JSON.stringify(formDataStyle));
    toFormDataStyle.speed = e;
    setFormDataStyle(toFormDataStyle);
  };

  //图片列表删除及上下
  let setListTs = (name, int) => {
    let toFormData = JSON.parse(JSON.stringify(formData));
    if (name == "up") {   //上移
      if (int > 0) {
        toFormData.splice(int - 1, 0, (toFormData[int]))
        toFormData.splice(int + 1, 1)
      }
    } else if (name == "dele") {//删除
      if(toFormData.length>1) toFormData.splice(int, 1)
    } else if (name == "down") {//下移
      toFormData.splice(int + 2, 0, (toFormData[int]))
      toFormData.splice(int, 1)
    }
    setFormData([...toFormData]);
  }

  //打开弹窗
  const openMadal=(item,index)=>{
    currentIndex = index;
    selectedKeys = [item.content];
    setModalName(item.type);
    if(item.type=='information'){//资讯
      //
    }
    if(item.type=='activity'){//营销活动
      //
    }
    if(item.type=='product'){//热销产品
      //
    }
  }

  //内容区域渲染
  const contentRender=(item,index)=>{
    if(item.content && item.content.value){
      return <div className={style.content_show}
      onClick={()=>{openMadal(item,index)}}>{item.content.label}</div>
    }else{
      return <div className={`${style.content_show} ${style.content_sel}`}
      onClick={()=>{openMadal(item,index)}}>
        选择{getDictName(type_dict,item.type)}
        </div>
    }
  }
  //弹窗关闭事件
  const closeEvent=(res)=>{
    if(!res){
      setModalName('')
    }else{
      let toFormData = JSON.parse(JSON.stringify(formData));
      toFormData[currentIndex].content = res[0];
      setFormData([...toFormData]);
      setModalName('');
    }
  }

  return (
    <div className={style.wrap}>
      <Tabs defaultActiveKey="1" activeKey={activeKey} onTabClick={setActiveKey} className={style.wrap_tab}>
        <TabPane tab="轮播内容" key="1">
          <div className={style.wrap_box}>
            <div className={style.wrap_child2}>
              <h5>上传图片</h5>
              <p>要求：图片宽度710px，图片大小不超过200kb，支持图片格式jpg/png。<br />若轮播上传多张图片高度不同，统一按照第一张图片的高度。</p>
              <div className={style.wrap_list}>
                {
                  formData.map((item, index) => {
                    return <div className={style.wrap_list_li}>
                      <div className={style.wrap_list_li_img}>
                        <Upload
                          name="files"
                          headers={headers}
                          listType="picture-card"
                          action={uploadIcon}
                          showUploadList={false}
                          beforeUpload={imgUpload.bind(this, index)}
                          onChange={imgChange.bind(this, index)}
                        >
                          {item.pictureUrl ? <img src={item.pictureUrl} alt="图片上传" style={{ width: '100%' }} /> : <span className={style.wrap_list_li_imgs}>图片上传</span>}
                        </Upload>
                      </div>
                      <div className={style.wrap_list_li_info}>
                        <div className={style.wrap_list_li_item}>
                          <span>标题：</span><Input onChange={(e)=>{inputChange(index,e.target.value)}} 
                          className={style.item_input} value={item.title} placeholder="请输入"/>
                        </div>
                        <div className={style.wrap_list_li_item}>
                          <span>类型：</span><Select onChange={(e)=>{typeChange(index,e)}}
                           className={style.item_input} value={item.type || null} placeholder="请选择类型">
                            {
                              type_dict.map((item)=>{
                                return <Option value={item.value}>{item.label}</Option>
                              })
                            }
                          </Select>
                        </div>
                        <div className={style.wrap_list_li_item}>
                          <span>内容：</span>
                          <>
                            {
                              item.type=='customLink'?
                              <Input onChange={(e)=>{linkChange(index,e.target.value)}}  placeholder="请输入"
                              className={style.item_input} value={item.content && item.content.label || ''} />:''
                            }
                            {
                              item.type=='information' || item.type=='activity' || item.type=='product'?
                              contentRender(item,index) :''
                            }
                            {
                              item.type=='miniProgram'?
                              <Select onChange={(e,option)=>{miniPageChange(index,e,option)}}
                              className={style.item_input} value={item.content && item.content.value || null} placeholder="请选择">
                                {miniProgram_dict.map(item=>{
                                  return <Option value={item.value}>{item.label}</Option>
                                })}
                             </Select>:''
                            }
                          </>
                        </div>
                      </div>
                      <div className={style.wrap_list_li_tools}>
                        <span onClick={() => { setListTs("up", index) }}><UpOutlined /> </span>
                        <span onClick={() => { setListTs("dele", index) }}><DeleteOutlined style={{color:'red'}}/></span>
                        <span onClick={() => { setListTs("down", index) }}><DownOutlined /></span>
                        {item.pictureUrl?<a download href={item.pictureUrl}><DownloadOutlined style={{color:'#1890ff'}}/></a>:''}
                      </div>
                    </div>
                  })
                }
                <Button className={style.wrap_list_btn} onClick={addList} icon={<PlusOutlined />}>继续添加组件</Button>
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane tab="样式设置" key="2">
          <div className={style.wrap_box2}>
            <h5>轮播导航</h5>
            <div className={style.wrap_box2_main}>
              <div className={style.wrap_box2_p}>
                <strong>样式</strong>
                <Radio.Group className={style.wrap_box2_top2} onChange={styleChange} value={formDataStyle.bannerStyle}>
                  <Radio value={'1'} className={style.wrap_box2_pro}><i>1</i><div className={style.wrap_box2_proi}><i className={style.wrap_box2_pro_a1}></i><i></i><i></i></div></Radio>
                  <Radio value={'2'} className={style.wrap_box2_pro}><i>2</i><div className={style.wrap_box2_proi}><i className={style.wrap_box2_pro_a2}></i><i></i><i></i></div></Radio>
                </Radio.Group>
              </div>
              <div className={style.wrap_box2_p}>
                <strong>未选中色</strong>
                <div className={style.wrap_box2_top}><SetColor colors={formDataStyle.frontUncheckColor} colorName='frontUncheckColor' setMColor={setMcolor}></SetColor></div>
                <span className={style.reset_btn} onClick={()=>{resetColor('frontUncheckColor')}}>重置</span>
              </div>
              <div className={style.wrap_box2_p}>
                <strong>选中色</strong>
                <div className={style.wrap_box2_top}> <SetColor colors={formDataStyle.frontCheckColor} colorName='frontCheckColor' setMColor={setMcolor}></SetColor></div>
                <span className={style.reset_btn} onClick={()=>{resetColor('frontCheckColor')}}>重置</span>
              </div>
              <div className={style.wrap_box2_p}>
                <strong>轮播速度</strong>
                <InputNumber min={1} value={formDataStyle.speed} onChange={numberChange} />
                <em>秒替换一张</em>
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
      {
        modalName && modalName=='information'? <Information selectedKeys={selectedKeys} closeEvent={closeEvent}/>:''
      }
      {
        modalName && modalName=='activity'? <Activity selectedKeys={selectedKeys} closeEvent={closeEvent} />:''
      }
      {
        modalName && modalName=='product'? <Product selectedKeys={selectedKeys} closeEvent={closeEvent} />:''
      }

    </div>
  )
};
export default connect(({ carowner_pageManage }) => ({
  putItem: carowner_pageManage.putItem,
  pageAllList: carowner_pageManage.pageAllList,
}))(zktPictureAdvertising)
