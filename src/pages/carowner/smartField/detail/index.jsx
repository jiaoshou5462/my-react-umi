import React,{useEffect,useState} from 'react';
import { connect,history } from 'umi';
import style from './style.less';
import {  Form, Input, Table, Select,Radio,Button,Tag,Upload,Modal, message, Space,} from 'antd';
import {PlusOutlined} from '@ant-design/icons';

import { ListTitle } from "@/components/commonComp/index";
import SelectGroup from '../components/selectGroup';
import SelectProduct from '../components/selectProduct';
import SelectArticle from '../components/selectArticle';
import SelectLabel from '../components/selectLabel';

import {fieldType_dict,status_dict,fieldContentType_dict} from '../dict';

const { Column } = Table;

const { Option } = Select;
const { TextArea } = Input;
import { uploadIcon } from '@/services/activity.js';
let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
let currentIndex = 0;
let selList=[];//当前选中的群组/标签
const Home = (props) =>{
  const {dispatch} = props;
  let [form] = Form.useForm()

  const [itemStatus,setItemStatus] = useState(1);//1未启用 2启用
  //弹窗显示隐藏
  const [showSelectGroup,setShowSelectGroup] = useState(false);
  const [showSelectLabel,setShowSelectLabel] = useState(false);
  const [showSelectArticle,setShowSelectArticle] = useState(false);
  const [showSelectProduct,setShowSelectProduct] = useState(false);

  const [lanweiList,setLanweiList] = useState([]);
  const [sendObj,setSendObj] = useState({
    fieldName:'',//栏位名称
    fieldType: 2,//栏位类型 1通用 2千人前面
    crowdType:1,//展示规则 1标签 2群组
    fieldContentType:1,//栏位内容 1图片 2产品 3文章
    contentVoList:[],
    remark:'',
  });

  //获取详情
  const getDetail=(id)=>{
    dispatch({
      type: 'smartField_model/channelWechatSmartFieldDetail',
      payload: {
        method: 'get',
        id: id,
      },
      callback: (res) => {
        if(res.result.code=='0' && res.body){
          let obj={
            fieldName: res.body.fieldName,//栏位名称
            fieldType: res.body.fieldType,//栏位类型 1通用 2千人前面
            crowdType: res.body.crowdType,//展示规则 1标签 2群组
            fieldContentType: res.body.fieldContentType,//栏位内容 1图片 2产品 3文章
            contentVoList: res.body.contentVoList,
            remark: res.body.remark,
          }
          setItemStatus(res.body.status || 1);
          setLanweiList(res.body.contentVoList);
          setSendObj(obj);
        }else{
          message.error(res.result.message || '');
        }
      }
    })
  }

  useEffect(()=>{
    //编辑
    if(history.location.query.id){
      getDetail(history.location.query.id);
    }
  },[])
 
  //群组关闭
  const tagClose=(index)=>{
    let _lanweiList = JSON.parse(JSON.stringify(lanweiList));
    _lanweiList[currentIndex].personVOList.splice(index,1);
    setLanweiList(_lanweiList);
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
  let imgChange = (info,index) => {
    let _lanweiList = JSON.parse(JSON.stringify(lanweiList));
    _lanweiList[index].imageUrl = info.file.response ? info.file.response.items : '';
    setLanweiList(_lanweiList);
  };
  //栏位内容修改
  const lanweiChange=(res,keyName,index)=>{
    let _lanweiList = JSON.parse(JSON.stringify(lanweiList));
    _lanweiList[index][keyName] = res;
    setLanweiList(_lanweiList);
  }
  //新增栏位
  const addItems=()=>{
    if(sendObj.fieldContentType==1){//图片
      let _lanweiList = JSON.parse(JSON.stringify(lanweiList));
      _lanweiList.push({
        imageName:'',
        imageUrl:'',
        imageHrefUrl:'',
        personVOList:[],
      });
      setLanweiList(_lanweiList);
    }
    if(sendObj.fieldContentType==2){//产品
      setShowSelectProduct(true);
    }
    if(sendObj.fieldContentType==3){//文章
      setShowSelectArticle(true);
    }
  }
  //新增群组 标签
  const addGroup=(index)=>{
    currentIndex = index;
    selList = lanweiList[index].personVOList || [];
    if(sendObj.crowdType==1){
      setShowSelectLabel(true);//选择标签
    }else{
      setShowSelectGroup(true);//选择群组
    }
  }
  //遍历列表判断是否重复
  const eachList=(list,res,keyName)=>{
    for(let item of list){
      if(item[keyName] == res[keyName]){
        return true;
      }
    }
    return false;
  }
  //弹窗选择数据
  const sendData=(res,type)=>{
    let _lanweiList = JSON.parse(JSON.stringify(lanweiList));
    if(type=='SelectGroup'){//群组
      if(res){
        _lanweiList[currentIndex].personVOList = res;
        setLanweiList(_lanweiList);
      }
      setShowSelectGroup(false)
    }
    if(type=='SelectLabel'){//标签
      if(res){
        if(eachList(_lanweiList[currentIndex].personVOList,res,'crowdId')){
          return message.warning('请勿重复添加');
        }
        _lanweiList[currentIndex].personVOList.push(res);
        setLanweiList(_lanweiList);
      }
      setShowSelectLabel(false)
    }
    if(type=='SelectProduct'){//产品
      if(res){
        if(eachList(_lanweiList,res[0],'businessId')){
          return message.warning('请勿重复添加');
        }
        _lanweiList.push({...res[0],personVOList:[]});
        setLanweiList(_lanweiList);
      }
      setShowSelectProduct(false)
    }
    if(type=='SelectArticle'){//文章
      if(res){
        if(eachList(_lanweiList,res[0],'businessId')){
          return message.warning('请勿重复添加');
        }
        _lanweiList.push({...res[0],personVOList:[]});
        setLanweiList(_lanweiList);
      }
      setShowSelectArticle(false)
    }
  }
  //删除内容
  const deleteContent=(index)=>{
    Modal.confirm({
      content:'确定删除内容吗？',
      onOk:()=>{
        let _lanweiList = JSON.parse(JSON.stringify(lanweiList));
        _lanweiList.splice(index,1);
        setLanweiList(_lanweiList);
      }
    })
  }
 
  //表达双向绑定
  const formChange=(res,name)=>{
    let _sendObj = JSON.parse(JSON.stringify(sendObj));
    if(lanweiList.length && name!='remark' && name!='fieldName'){
      Modal.confirm({
        content:'确定切换选中么？切换操作会清空已选则的内容',
        onOk:()=>{
          let _lanweiList = JSON.parse(JSON.stringify(lanweiList));
          _lanweiList = [];
          setLanweiList(_lanweiList);
          _sendObj[name] = res;
          setSendObj(_sendObj);
        }
      })
    }else{
      _sendObj[name] = res;
      setSendObj(_sendObj);
    }
  }

  //取消
  const cancelBtn=()=>{
    if(itemStatus===1){
      Modal.confirm({
        content:'请确认是否取消并关闭当前页面？',
        onOk:()=>{
          window.history.go(-1);
        }
      })
    }else{
      window.history.go(-1);
    }
  }
  //确认
  const confirmSubmit=()=>{
    if(!sendObj.fieldName) return message.warning('请填写栏位名称');
    if(!lanweiList.length) return message.warning('请添加栏位内容');
    let contentVoList = JSON.parse(JSON.stringify(lanweiList));
    for(let i=0;i<lanweiList.length;i++){
      let item = lanweiList[i];
      if(sendObj.fieldContentType==1){
        if(!item.imageName) return message.warning(`内容${i+1} 图片名称不能为空`);
        if(!item.imageUrl) return message.warning(`内容${i+1} 图片链接不能为空`);
        if(!item.imageHrefUrl) return message.warning(`内容${i+1} 内容图片不能为空`);
      }
      if(item.personVOList && !item.personVOList.length && sendObj.fieldType==2){
        return message.warning(`内容${i+1} 用户${sendObj.crowdType==1?'标签':'群组'}不能为空`);
      }
    }
    
    if(sendObj.fieldContentType==2 || sendObj.fieldContentType==3){
      contentVoList = lanweiList.map((item)=>{
        return item.objectId ? {
          businessId:item.businessId,
          personVOList:item.personVOList || [],
          objectId:item.objectId
        }:{
          businessId:item.businessId,
          personVOList:item.personVOList || [],
        };
      })
    }
    Modal.confirm({
      content:'确认保存吗？',
      onOk:()=>{
        dispatch({
          type: 'smartField_model/channelWechatSmartFieldSave',
          payload: {
            method: 'postJSON',
            params: {
              ...sendObj,
              contentVoList:contentVoList,
              objectId: history.location.query.id || null,
            }
          },
          callback: (res) => {
            if(res.result.code=='0'){
              message.success('保存成功');
              window.history.go(-1);
            }else{
              message.error(res.result.message || '');
            }
          }
        })
      }
    })
  }

  // 所有组件根据自己需要引入
  return(
    <div className={style.detail_block}>
      <ListTitle titleName="新建栏位内容" style={{'border-bottom': '1px solid #f0f0f0'}}></ListTitle>
      <div className={style.form_box}>
        <div className={style.form_mid}>
          <div className={style.form_title}>栏位信息</div>
          <div className={style.form_block}>
            <Form.Item label={<div className={style.require_lable}>栏位名称</div>} labelCol={{flex: '0 0 120px'}}>
              <Input onChange={(e)=>formChange(e.target.value,'fieldName')} value={sendObj.fieldName} disabled={itemStatus==2}/>
            </Form.Item>
            <Form.Item label={<div className={style.require_lable}>栏位类型</div>} labelCol={{flex: '0 0 120px'}}>
              <Radio.Group onChange={(e)=>formChange(e.target.value,'fieldType')} value={sendObj.fieldType} disabled={itemStatus==2}> 
                {
                  fieldType_dict.map(item=>{
                    return <Radio value={item.value}>{item.label}</Radio>
                  })
                }
              </Radio.Group>
            </Form.Item>
            {sendObj.fieldType===2 ? <Form.Item label={<div className={style.require_lable}>展示规则</div>} labelCol={{flex: '0 0 120px'}}>
              <Radio.Group onChange={(e)=>formChange(e.target.value,'crowdType')} value={sendObj.crowdType} disabled={itemStatus==2}>
                <Radio value={1}>用户标签</Radio>
                <Radio value={2}>用户群组</Radio>
              </Radio.Group>
            </Form.Item>:''}
            <Form.Item label={<div className={style.require_lable}>栏位内容</div>} labelCol={{flex: '0 0 120px'}}>
              <Radio.Group onChange={(e)=>formChange(e.target.value,'fieldContentType')} value={sendObj.fieldContentType} disabled={itemStatus==2}>
                {
                  fieldContentType_dict.map(item=>{
                    return <Radio value={item.value}>{item.label}</Radio>
                  })
                }
              </Radio.Group>
            </Form.Item>
          </div>
          <div className={style.form_title}>栏位内容  <Button type='primary' onClick={addItems} disabled={itemStatus==2}>添加内容</Button></div>
          <div className={style.form_block} style={{'background':'#fafafa'}}>
            {/* 图片 */}
            {
              sendObj.fieldContentType==1 && lanweiList.map((item,index)=>{
                return <div className={style.list_item}>
                <div className={style.item_top}><div>内容{index+1}</div> <span onClick={()=>{deleteContent(index)}}>删除内容</span></div>
                <Form.Item label={<div className={style.require_lable}>名称</div>} labelCol={{flex: '0 0 120px'}}>
                  <Input value={item.imageName} onChange={(e)=>{lanweiChange(e.target.value,'imageName',index)}} />
                </Form.Item>
                <Form.Item  label={<div className={style.require_lable}>图片链接</div>} labelCol={{flex: '0 0 120px'}}>
                  <Input value={item.imageHrefUrl} onChange={(e)=>{lanweiChange(e.target.value,'imageHrefUrl',index)}} />
                </Form.Item>
                <Form.Item label={<div className={style.require_lable}>图片</div>} labelCol={{flex: '0 0 120px'}}>
                  <Upload
                    name="files"
                    listType="picture-card"
                    action={uploadIcon}
                    showUploadList={false}
                    beforeUpload={(e)=>imgUpload(e)}
                    onChange={(e)=>imgChange(e,index)}
                    headers={headers}
                    className={style.upload_box_bg}
                  >
                    {item.imageUrl?<img src={item.imageUrl} alt="图片上传" style={{ width: '100%', height: '100%' }} />:
                      <span >图片上传</span>
                    }
                  </Upload>
                  <div style={{color:'#999'}}>建议尺寸：750*320，图片大小不超过2M</div>
                </Form.Item>
                {sendObj.fieldType==2?<Form.Item label={<div className={style.require_lable}>
                  {sendObj.crowdType==1?'用户标签':'用户群组'}</div>
                } labelCol={{flex: '0 0 120px'}}>
                  <div className={style.tag_box}>
                    {
                      item.personVOList && item.personVOList.map((gItem,gIndex)=>{
                        return <Tag closable onClose={()=>tagClose(gIndex)} key={gItem.crowdId}>{gItem.crowdName}</Tag>
                      })
                    }
                    <Tag icon={<PlusOutlined />} className={style.tag_add} onClick={()=>{addGroup(index)}}>{sendObj.crowdType==1?'添加标签':'添加群组'}</Tag>
                  </div>
                </Form.Item>:''}
              </div>
              })
            }
            
            {/* 产品 */}
            {
              sendObj.fieldContentType==2 && lanweiList.map((item,index)=>{
                return <div className={style.list_item}>
                <div className={style.item_top}><div>内容{index+1}</div> <span onClick={()=>{deleteContent(index)}}>删除内容</span></div>
                <Form.Item label={<div className={style.require_lable}>产品ID</div>} labelCol={{flex: '0 0 120px'}}>
                  <Input value={item.businessId} disabled />
                </Form.Item>
                <Form.Item  label={<div className={style.require_lable}>产品名称</div>} labelCol={{flex: '0 0 120px'}}>
                  <Input value={item.goodTitle} disabled />
                </Form.Item>
                <Form.Item  label={<div className={style.require_lable}>产品价格</div>} labelCol={{flex: '0 0 120px'}}>
                  <Input value={item.goodPrice} disabled />
                </Form.Item>
                <Form.Item label={<div className={style.require_lable}>产品图片</div>} labelCol={{flex: '0 0 120px'}}>
                  <img className={style.upload_img} src={item.goodImg} />
                </Form.Item>
                {sendObj.fieldType==2?<Form.Item label={<div className={style.require_lable}>
                  {sendObj.crowdType==1?'用户标签':'用户群组'}
                </div>} labelCol={{flex: '0 0 120px'}}>
                  <div className={style.tag_box}>
                    {
                      item.personVOList && item.personVOList.map((gItem,gIndex)=>{
                        return <Tag closable onClose={()=>tagClose(gIndex)} key={gItem.crowdId}>{gItem.crowdName}</Tag>
                      })
                    }
                    <Tag icon={<PlusOutlined />} className={style.tag_add} onClick={()=>{addGroup(index)}}>{sendObj.crowdType==1?'添加标签':'添加群组'}</Tag>
                  </div>
                </Form.Item>:""}
              </div>
              })
            }
            
            {/* 文章 */}
            {
              sendObj.fieldContentType==3 && lanweiList.map((item,index)=>{
                return <div className={style.list_item}>
                <div className={style.item_top}><div>内容{index+1}</div> <span onClick={()=>{deleteContent(index)}}>删除内容</span></div>
                <Form.Item label={<div className={style.require_lable}>文章ID</div>} labelCol={{flex: '0 0 120px'}}>
                  <Input value={item.businessId} disabled />
                </Form.Item>
                <Form.Item  label={<div className={style.require_lable}>文章标题</div>} labelCol={{flex: '0 0 120px'}}>
                  <Input value={item.articleTitle} disabled />
                </Form.Item>
                <Form.Item label={<div className={style.require_lable}>文章链接</div>} labelCol={{flex: '0 0 120px'}}>
                  <Input value={item.refUrl} disabled />
                </Form.Item>
                {sendObj.fieldType==2?<Form.Item label={<div className={style.require_lable}>
                  {sendObj.crowdType==1?'用户标签':'用户群组'}
                </div>} labelCol={{flex: '0 0 120px'}}>
                  <div className={style.tag_box}>
                    {
                      item.personVOList && item.personVOList.map((gItem,gIndex)=>{
                        return <Tag closable onClose={()=>tagClose(gIndex)} key={gItem.crowdId}>{gItem.crowdName}</Tag>
                      })
                    }
                    <Tag icon={<PlusOutlined />} className={style.tag_add} onClick={()=>{addGroup(index)}}>{sendObj.crowdType==1?'添加标签':'添加群组'}</Tag>
                  </div>
                </Form.Item>:""}
              </div>
              })
            }
            {!lanweiList.length?<div className={style.content_empty}>待添加</div>:''}
            {itemStatus==2?<div className={style.cant_edit}></div>:''}
          </div>
          <div className={style.form_title}>其他</div>
          <div className={style.form_block}>
            <Form.Item label="备注说明" labelCol={{flex: '0 0 120px'}}>
              <TextArea showCount maxLength={500} rows="4" value={sendObj.remark} onChange={(e)=>formChange(e.target.value,'remark')} disabled={itemStatus==2} />
            </Form.Item>
          </div>
          <div className={style.btn_box}>
            <Space span={8}>
              <Button onClick={cancelBtn}>{itemStatus===1?'取消':'返回'}</Button>
              {itemStatus===1?<Button type='primary' onClick={confirmSubmit}>确认</Button>:''}
            </Space>
          </div>
        </div>
      </div>

      {showSelectGroup ? <SelectGroup selList={selList} sendData={(res)=>{sendData(res,'SelectGroup')}} />:''}
      {showSelectLabel ? <SelectLabel selList={selList} sendData={(res)=>{sendData(res,'SelectLabel')}} /> : ''}

      {showSelectProduct ? <SelectProduct closeEvent={(res)=>{sendData(res,'SelectProduct')}} />:''}
      {showSelectArticle ? <SelectArticle closeEvent={(res)=>{sendData(res,'SelectArticle')}} /> : ''}
      
      
    </div>
  )
}
export default connect(({ loading }) => ({
  
}))(Home);