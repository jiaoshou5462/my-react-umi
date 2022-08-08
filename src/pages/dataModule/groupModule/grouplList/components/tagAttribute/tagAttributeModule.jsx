//属性表单
import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import {
  Form, Input, Button, Select, Tooltip, DatePicker, Modal,Cascader
} from 'antd';
import { EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/zh-cn';

const { TextArea } = Input;
const { Option } = Select;

//级联选择器 通过最后一项id 获取完整id数组
const eachCascaderList=(list,id)=>{
  for(let one of list){
    for(let two of one.tagInfos){
      if(two.id == id){
        return [one.id,two.id]
      }
    }
  }
  return [];
}
//获取 二级下拉类型
const getDataTypeKey = (list,id)=>{
  for(let item of list){
    if(item.id == id){
      return item.controlType;
    }
  }
  return list.length ? list[0].controlType : '';
}
//获取三级下拉的中文字符 拼接
const getThreeName=(list)=>{
  let arr = [];
  for(let item of list){
    arr.push(item.labelName);
  }
  return arr.join(',');
}
const UserAttributeModule = (props) => {
  const { dispatch, twoObj ,selectData,twoListData,indexObj,setParentsData} = props;//selectData从model取
  //下拉框 初始值
  let obj = JSON.parse(JSON.stringify(twoObj))
  obj.tagInfoId = obj.tagInfoId !=='' ? obj.tagInfoId : '';
  obj.predicateInfoId = obj.predicateInfoId? obj.predicateInfoId : twoListData[0].id;
  obj.dataTypeKey = getDataTypeKey(twoListData,obj.predicateInfoId);
  let tagLayerInfoIds = '';
  let isShowIcon_def = true;
  let oneIds = eachCascaderList(selectData.oneList,obj.tagInfoId);
  if(obj.dataTypeKey == 'MULTIPLE_DROP'){
    tagLayerInfoIds = obj.tagLayerInfoIds ? obj.tagLayerInfoIds.split(',') : [];
  }else{
    tagLayerInfoIds = obj.tagLayerInfoIds;
  }

  const [twoList, setTwoList] = useState(twoListData);//下拉列表2
  const [threeList, setThreeList] = useState(selectData.threeList);//下拉列表3

  const [oneValue, setOneValue] = useState(oneIds);//1级值
  const [twoValue, setTwoValue] = useState(obj.predicateInfoId);//2级值
  const [dataTypeKey, setDataTypeKey] = useState(obj.dataTypeKey);//3级显示类型
  const [threeValue, setThreeValue] = useState(tagLayerInfoIds);//3级值

  const [isShowIcon, setIsShowIcon] = useState(isShowIcon_def);//三级后的图标显示
  const [titleValue, setTitleValue] = useState(null);//多条件弹窗
  const [isConditionModalVisible, setIsConditionModalVisible] = useState(false);//多条件弹窗
  const [inputValue, setInputValue] = useState("");//多条件输入
  

  //多条件弹窗
  const handleOk = () => {
    obj.tagLayerInfoIds = inputValue;
    setThreeValue(inputValue)
    setIsConditionModalVisible(false)
  };
  //关闭多行输入弹框
  const handleCancel = () => {
    setIsConditionModalVisible(false)
  };
  //多行输入
  const changeInputMess = (e) => {
    setInputValue(e.target.value)
  }

  //一级下拉
  const handleOneChange = (value, option) => {
    setOneValue(value)
    setTwoValue(twoListData[0].id);
    setThreeList(option[1].tagLayers);
    twoListData[0].controlType == 'MULTIPLE_DROP' ? setThreeValue([]) : setThreeValue('');
    obj.tagInfoId = value[1];
    obj.predicateInfoId = twoListData[0].id;
    obj.dataTypeKey = twoListData[0].controlType;
    obj.tagLayerInfoIds = '';
    setDataTypeKey(obj.dataTypeKey);
    sendDataToParents();
  };

  //二级下拉
  const handleTwoChange = (value, option) => {
    setTwoValue(value)
    // setTitleValue(option.children);
    let arr = twoList.filter(item => {
      return item.id == value
    })
    let controlType = arr[0].controlType;
    controlType == 'MULTIPLE_DROP' ? setThreeValue([]) : setThreeValue('');
    //设置选中值 传递给后台
    obj.predicateInfoId = value;
    obj.dataTypeKey = controlType;
    obj.tagLayerInfoIds = '';
    setDataTypeKey(controlType);
    sendDataToParents();
  };
  //三级多选下拉
  const handleThreeChange = (value, option) => {
    obj.tagLayerInfoIds = value.join(',');
    obj.tagLayerInfoIds_name = getThreeName(option);
    setThreeValue(value);
    sendDataToParents();
  };
 
  //批量赋值粘贴
  const changeSetAllMess = () => {
    //第二级title
    let i = twoList.findIndex((value) => value.id == obj.predicateId);
    if (i != -1) {
      setTitleValue(twoList[i].predicateName)
    }
    setInputValue(obj.tagLayerInfoIds)
    setIsConditionModalVisible(true)
    sendDataToParents();
  }
  
  //向父组件发送数据
  const sendDataToParents=()=>{
    setParentsData({
      data:obj,
      indexObj:indexObj,
    })
  }
  
  //监听下拉列表的变化
  useEffect(()=>{
    setTwoList(twoListData);
    setThreeList(selectData.threeList)
    if(oneValue.length>1 && selectData.oneList.length) {
      let obj={};
      for(let item of selectData.oneList){
        for(let two of item.tagInfos){
          if(two.id == oneValue[1]){
            obj = two;
          }
        }
      }
      setThreeList(JSON.parse(JSON.stringify(obj.tagLayers)));
    }
  },[selectData])
  useEffect(()=>{
    sendDataToParents();
  },[])

  return (
    <div className={style.attributeFormItem} style={{ display: 'flex' }}>
      {/* 用户属性条件表单 */}
      <div style={{ flex: '0 0 220px', marginRight: '5px' }}>
        {/* 下拉列表1 */}
        <Cascader
          style={{ width: '100% ' }}
          placeholder="请选择标签"
          value={oneValue}
          fieldNames={{
            label: 'tagName',
            value : 'id',
            children: 'tagInfos',
          }}
          showSearch
          options={selectData.oneList}
          onChange={handleOneChange}
        >
        </Cascader>
      </div>
      <div style={{ flex: '0 0 100px', marginRight: '5px' }}>
        {/* 下拉列表2 */}
        <Select style={{ width: '100% ' }} value={twoValue} onChange={handleTwoChange} placeholder="请选择">
          {twoList.map(d => (
            <Option key={d.id} value={d.id}>{d.predicateName}</Option>
          ))}
        </Select>
      </div>
      {
        dataTypeKey!='HIDE' ? <div style={{ display: 'flex', marginRight: '5px',flex:'auto', }}>
          {/* 三级 */}
          <div style={{ width: '200px' }}>
            <Select mode="multiple" style={{ width: '100% ' }} value={threeValue} placeholder="请选择分层" onChange={handleThreeChange} allowClear>
            {threeList.map(d => (
              <Option key={d.id} value={d.id+''} labelName={d.layerName}>
                {d.layerName}
              </Option>
            ))}
          </Select> </div>
          {
            twoValue == '9' ? <div style={{ display: 'flex', alignItems: 'center', padding: '0 5px' }}> <Tooltip placement="top" title="区间包含起始和结束时间。输入时间格式为 yyyy-mm-dd hh:ii:ss。" arrowPointAtCenter>
              <QuestionCircleOutlined style={{ padding: '0 5px', color: '#99a9bf', cursor: 'pointer' }} />
            </Tooltip></div> :
              isShowIcon ? 
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 5px' }}>
                {/* <Tooltip placement="top" title="点击可批量赋值粘贴" arrowPointAtCenter>
                  <EditOutlined style={{ padding: '0 5px', color: '#99a9bf', cursor: 'pointer' }} onClick={changeSetAllMess} />
                </Tooltip> */}
                <Tooltip placement="top" title="提示选项为最近7天的属性关键词（最多展示 20 条），非所有关键词。可直接输入关键词，回车完成。" arrowPointAtCenter>
                  <QuestionCircleOutlined style={{ padding: '0 5px', color: '#99a9bf', cursor: 'pointer' }} />
                </Tooltip>
              </div> : ""
          }
        </div> : ""
      }
      <Modal title={titleValue} width={600} cancelText="取消" okText="确定" visible={isConditionModalVisible} onCancel={handleCancel} onOk={handleOk}>
        <div style={{ color: "#475669", fontSize: "12px", padding: "0 0 10px 0" }}>注意：按换行符分隔，每行一个值</div>
        <TextArea value={inputValue} rows={10} onChange={changeInputMess} />
      </Modal>
    </div >
  )
}
export default connect(({ tagAttribute }) => ({
  selectData: tagAttribute.selectData,
  twoListData: tagAttribute.twoListData,
}))(UserAttributeModule);