import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, Form, Button, Checkbox, Radio,Upload, Space, Modal, message
} from "antd";
import style from "./style.less";
import { uploadIcon } from '@/services/activity.js';
import { FormOutlined,DeleteOutlined} from '@ant-design/icons';
let homeHost = {
  'local':'https://dev.yltapi.com',
  'dev':'https://dev.yltapi.com',
  'test1':'https://test1.yltapi.com',
  'uat':'https://uat.yltapi.com',
  'prod':'https://www.yltapi.com',
}[process.env.DEP_ENV]
//isParams 1需要带参数 2不需要
let def_list = [
  {
    name:'我的卡券',icon:'icon-cardb',isParams:1,
    url:`${homeHost}/wechat_carowner/pages/coupon/list.html`,show:true,
  },
  {
    name:'我的订单',icon:'icon-icon',isParams:1,
    url:`${homeHost}/wechat_carowner/list.html`,show:true,
  },
  {
    name:'我的车辆',icon:'icon-icon',isParams:1,
    url:`${homeHost}/cpic_usercenter/carList.html`,show:true,
  },
  {
    name:'意见反馈',icon:'icon-fankuizhongxinon',url:'',show:true,bottom:true,
  },
  {
    name:'联系客服',icon:'icon-wodekefu',url:'',show:true,bottom:true,
  },
]
let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
let isEdit = false;
// 14用户信息
const userInfo = (props) => {
  const { dispatch, putItem } = props;
  //总数据
  let [selObj,setSelObj] = useState({
    type: 1,
    moduleSel: 1,
    background:'',
  });
  let [addObj,setAddObj] = useState({});
  let [showAdd,setShowAdd] = useState(false);

  useEffect(() => {
    if (JSON.stringify(putItem)!='{}') {
      let newObj = JSON.parse(JSON.stringify(putItem));
      if(newObj.isAddItem){//新增
        setSelObj({
          type: 1, moduleSel: 1,background:'',
          menuList: def_list,
        });
      }else{//修改
        let obj={
          type: newObj.compList.type || 1,
          moduleSel: newObj.compList.moduleSel || 1,
          background: newObj.compList.background || '',
          menuList: newObj.compList.menuList || def_list,
        }
        newObj.compList = obj;
        setSelObj(newObj.compList);
      }
    }
  }, [putItem])

  useEffect(() => {
    if(putItem.isClick){
      delete putItem.isClick;return;
    }
    let newObj = JSON.parse(JSON.stringify(putItem));
    newObj.compList = JSON.parse(JSON.stringify(selObj));
    dispatch({
      type: 'carowner_pageManage/setSendItem',
      payload: newObj
    })
  }, [selObj])

  //一级radio选中
  const onChange = (res)=>{
    let value = res.target.value;
    let _selObj = JSON.parse(JSON.stringify(selObj));
    _selObj.type = value;
    setSelObj(_selObj);
  }

  //二级radio选中
  const twoChange = (res)=>{
    let value = res.target.value;
    let _selObj = JSON.parse(JSON.stringify(selObj));
    _selObj.moduleSel = value;
    setSelObj(_selObj);
  }
  const menuChange=(value,index)=>{
    let _selObj = JSON.parse(JSON.stringify(selObj));
    _selObj.menuList[index].show = value;
    setSelObj(_selObj);
  }
  const valueChange=(value,key)=>{
    console.log(value)
    let _addObj = {...addObj};
    _addObj[key] = value;
    setAddObj(_addObj);
  }
   //图片上传
  const imgUpload = (file) => {
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
  let imgChange = (info,type) => {
    if(type=='bg'){
      let _selObj = JSON.parse(JSON.stringify(selObj));
      _selObj.background = info.file.response ? info.file.response.items : '';
      setSelObj(_selObj);
    }else{
      let _addObj = {...addObj};
      let toItems = info.file.response ? info.file.response.items : '';
      _addObj.icon = toItems;
      setAddObj(_addObj);
    }
  };
  //取消菜单
  const cancelAdd=()=>{
    setShowAdd(false);
  }
  //添加菜单
  const okAdd=(index)=>{
    let _addObj = JSON.parse(JSON.stringify(addObj));
    if(!_addObj.name) return message.error('请输入菜单名称');
    if(!_addObj.icon) return message.error('请上传菜单icon');
    if(!_addObj.url) return message.error('请输入跳转链接');
    let _selObj = JSON.parse(JSON.stringify(selObj));
    let list1 = _selObj.menuList.slice(0,_selObj.menuList.length-2);
    let list2 = _selObj.menuList.slice(_selObj.menuList.length-2,_selObj.menuList.length+1);
    if(isEdit){//编辑
      list1[index] = _addObj;
    }else{//新增
      _addObj.show = true;
      _addObj.custom = true;
      list1.push(_addObj);
    }
    _selObj.menuList = [...list1,...list2];
    setSelObj(_selObj);
    setAddObj({});
    setShowAdd(false);
  }
  //新增菜单
  const addMenu=()=>{
    isEdit = false;
    setShowAdd(true);
  }
  //编辑菜单
  const editMenu=(item)=>{
    isEdit = true;
    setAddObj({...item});
    setShowAdd(true);
  }
  const deleteMenu=(index)=>{
    Modal.confirm({
      content:'您确定要删除该菜单吗？',
      onOk:()=>{
        let _selObj = JSON.parse(JSON.stringify(selObj));
        for(let i=0;i<_selObj.menuList.length;i++){
          if(index == i){
            _selObj.menuList.splice(i,1);
            --i;break;
          }
        }
        setSelObj(_selObj);
      }
    })
  }
  //重置图片
  const resetBg=()=>{
    let _selObj = JSON.parse(JSON.stringify(selObj));
    _selObj.background = '';
    setSelObj(_selObj);
  }

  const addMenuDom=(index)=>{
    return <div className={style.add_box}>
      <Form autoComplete="off">
        <Form.Item label={<div className={style.require_lable}>名称</div>}>
          <Input value={addObj.name} onChange={(e)=>valueChange(e.target.value,'name')} maxLength="10"/>
        </Form.Item>
        <Form.Item label={<div className={style.require_lable}>图标</div>} >
          {/* <Input value={addObj.icon} onChange={(e)=>valueChange(e.target.value,'icon')}/> */}
          <Upload
            name="files"
            listType="picture-card"
            action={uploadIcon}
            showUploadList={false}
            beforeUpload={(e)=>imgUpload(e)}
            onChange={(e)=>imgChange(e)}
            headers={headers}
            className={style.upload_box}
          >
            {addObj.icon ? <img src={addObj.icon} alt="图片上传" style={{ width: '100%', height: '100%' }} /> : <span >图片上传</span>}
          </Upload>
        </Form.Item>
        <Form.Item label={<div className={style.require_lable}>跳转链接</div>}>
          <Input value={addObj.url} onChange={(e)=>valueChange(e.target.value,'url')}/>
        </Form.Item>
        <Form.Item label={<div className={style.require_lable}>链接携带参数</div>}>
          <Radio.Group onChange={(e)=>valueChange(e.target.value,'isParams')} defaultValue={2} value={addObj.isParams}>
            <Radio value={1}>携带</Radio>
            <Radio value={2}>不携带</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
      <div className={style.btn_box}>
        <Space size={16}>
          <Button onClick={cancelAdd}>取消</Button>
          <Button onClick={()=>{okAdd(index)}} type="primary">确认</Button>
        </Space>
      </div>
    </div>
  }

  return (
    <div className={style.userInfo}>
      <h5>用户信息模板</h5>
      <div className={style.block}>
        <Radio.Group onChange={onChange} value={selObj.type} buttonStyle="solid">
          <Radio.Button value={1}>通用模板</Radio.Button>
          <Radio.Button value={2}>积分成长值模板</Radio.Button>
        </Radio.Group>
      </div>
      <div className={style.block}>
        <Radio.Group onChange={twoChange} value={selObj.moduleSel}>
          <Radio value={1}>模板1</Radio>
        </Radio.Group>
      </div>
      <h5>背景图上传</h5>
      <div className={style.bg_tips}>建议尺寸：宽高比 750px*360px</div>
      <div className={style.upload_box}>
        <Upload
          name="files"
          listType="picture-card"
          action={uploadIcon}
          showUploadList={false}
          beforeUpload={(e)=>imgUpload(e)}
          onChange={(e)=>imgChange(e,'bg')}
          headers={headers}
          className={style.upload_box_bg}
        >
          {selObj.background ? <img src={selObj.background} alt="图片上传" style={{ width: '100%', height: '100%' }} /> : <span >图片上传</span>}
        </Upload>
        <span className={style.reset_btn} onClick={resetBg}>重置</span>
      </div>
      
      <h5>侧边栏配置</h5>
      <div className={style.menu_list}>
        {selObj.menuList && selObj.menuList.map((item,index)=>{
          return <>
          <div className={style.menu_item}>
            <Checkbox checked={item.show} onChange={(e)=>{menuChange(e.target.checked,index)}}>{item.name}</Checkbox>
            {item.custom ? 
            <div className={style.menu_item_btn}>
              <FormOutlined onClick={()=>{editMenu(item)}}/>
              <DeleteOutlined onClick={()=>{deleteMenu(index)}} style={{marginLeft:'10px',}}/>
            </div>:''}
          </div>
          {index==selObj.menuList.length-3 ? 
          <div className={style.menu_item}>
            {showAdd?addMenuDom(index):<Button type="primary" onClick={addMenu}>增加自定义菜单</Button>}
          </div>:''}
          </>
        })}
      </div>
    </div>
  )
};
export default connect(({ carowner_pageManage }) => ({
  putItem: carowner_pageManage.putItem,
}))(userInfo)
