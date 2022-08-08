//属性表单
import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import {
  Form, Input, Button, Select, Tooltip, DatePicker, Modal
} from 'antd';
import { EditOutlined, QuestionCircleOutlined,PlusOutlined,CloseOutlined,PlusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { behaviorTypeDict, countTypeDict, operatorDict,
  eventDataType_Dict,eventDataTypeDown_Dict,eventDataTypeDown_bt_Dict } from '@/pages/dataModule/tagModule/dict.js';
const { RangePicker } = DatePicker;


const { TextArea } = Input;
const { Option } = Select;
const _defaultTotal = {
  countType:'SUM_COUNT',//统计类型
  operatorValue:'=',//运算符
  propertyValue:1//属性值
}
const getFilterControlType=(dict,id)=>{
  for(let item of dict){
    if(item.id == id){
      return item.controlType;
    }
  }
  return dict[0].controlType;
}
let compId=0;
const userActionModal = (props) => {
  const { dispatch, twoObj ,selectData,indexObj,setParentsData} = props;
  //设定初始值
  let obj = JSON.parse(JSON.stringify(twoObj))
  obj.behaviorType = obj.behaviorType !=='' ? obj.behaviorType : 'DONE';
  obj.userEventInfoId = obj.userEventInfoId !=='' ? obj.userEventInfoId : selectData.oneList[0].id;
  let defaultGroups = obj.eventPropertiesGroup.eventPropertiesDefinitions;//筛选
  let defaultTotal = obj.eventCountGroup.eventCountDefinitions.length ?
    obj.eventCountGroup.eventCountDefinitions : 
    [{..._defaultTotal,loopId: `loop${++compId}`}];//统计
  obj.eventCountGroup.eventCountDefinitions = defaultTotal; //统计
  let defaultDate = obj.startDate && obj.endDate ? [moment(obj.startDate),moment(obj.endDate)] : [];
  let relValues_def = [];
  //时间区间
  if(obj.dateType == 'BEFORE_AFTER_NOW' || obj.dateType == 'BEFORE_AFTER_NOW_BET'){
    relValues_def = obj.dateExtraValue ? obj.dateExtraValue.split(',') : [];
  }
  const [dateList,setDateList] = useState(defaultDate);
  const [groups,setGroups] = useState(defaultGroups);//筛选
  const [totalGroups,setTotalGroups] = useState(defaultTotal);//统计

  const [relationValue,setRelationValue] = useState(obj.eventPropertiesGroup.relationValue);//筛选 关系
  const [totalRelation,setTotalRelation] = useState(obj.eventCountGroup.relationValue);//统计 关系
  const [twoList, setTwoList] = useState(selectData.twoList);//下拉列表2
  const [threeList, setThreeList] = useState(selectData.threeList);//下拉列表3

  const [oneValue, setOneValue] = useState(obj.userEventInfoId);//用户行为 值 浏览页面

  const [behaviorType, setBehaviorType] = useState(obj.behaviorType);//行为类型-值

  const [titleValue, setTitleValue] = useState(null);//多条件弹窗
  const [isConditionModalVisible, setIsConditionModalVisible] = useState(false);//多条件弹窗
  const [inputValue, setInputValue] = useState("");//多条件输入
  const [dateType,setDateType] = useState(obj.dateType || 'BETWEEN'); //时间类型 区间/相对区间
  const [relValues,setRelValues] = useState(relValues_def);

  //多条件弹窗
  const handleOk = () => {
    obj.propertyValue = inputValue;
    setThreeValue(inputValue)
    setIsConditionModalVisible(false)
  };
  
  const handleCancel = () => {
    setIsConditionModalVisible(false)
  };

  const changeInputMess = (e) => {
    setInputValue(e.target.value)
  }
  //向父组件发送数据
  const sendDataToParents=()=>{
    setParentsData({
      data:obj,
      indexObj:indexObj,
    })
  }
  //开始时间-结束时间
  const changeStart = (value) => {
    if(value) {
      obj.startDate = value[0].format('YYYY-MM-DD');
      obj.endDate = value[1].format('YYYY-MM-DD');
      setDateList(value)
    } else {
      obj.startDate = ''
      obj.endDate = ''
      setDateList([])
    }
    sendDataToParents();
  }
  //时间类型选择
  const dateTypeChange = (value)=>{
    if(value=='BEFORE_AFTER_NOW'){
      setRelValues([null,null])
    }
    if(value=='BEFORE_AFTER_NOW_BET'){
      setRelValues([null,null,null])
    }
    obj.dateType = value;
    setDateType(value);
    sendDataToParents();
  }
  //相对区间 input 绑定
  const relChangeInput = (value,index)=>{
    let _relValues = [...relValues];
    if(value=='now' && index==0){
      _relValues = ['now'];
    }else{
      _relValues[index] = value;
    }
    setRelValues(_relValues);
    obj.dateExtraValue = _relValues.join(',');
    for(let item of _relValues){
      if(!item){
        obj.dateExtraValue = '';
      }
    }
    sendDataToParents();
  }
  //一级下拉
  const handleOneChange = (value, option) => {
    setOneValue(value)
    let arr = selectData.oneList.filter(item => {
      return item.id == value
    })
    setTwoList(arr[0].userEventPropertiesInfos);
    setThreeList(arr[0].userEventPropertiesInfos[0].dataTypeInfo.predicateInfoList)
    let datas = JSON.parse(JSON.stringify(groups))
    for(let i=0; i<datas.length; i++) {
      datas[i].userEventPropertiesInfoId = arr[0].userEventPropertiesInfos[0].id
      datas[i].predicateInfoId = arr[0].userEventPropertiesInfos[0].dataTypeInfo.predicateInfoList[0].id
      datas[i].propertyValue = ''
      datas[i].propertyValueList = []
    }
    setGroups(datas)
    obj.userEventInfoId = value;
    sendDataToParents();
  };

  //行为类型
  const behaviorTypeChange = (value) => {
    obj.behaviorType = value;
    setBehaviorType(value);
    sendDataToParents();
  };
  
  //批量赋值粘贴 别删
  const changeSetAllMess = () => {
    //第二级title
    let i = twoList.findIndex((value) => value.id == obj.predicateId);
    if (i != -1) {
      setTitleValue(twoList[i].predicateName)
    }
    setInputValue(obj.propertyValue)
    setIsConditionModalVisible(true)
  }
  const relationFilter=()=>{
    let thisRel = relationValue == 'AND'?'OR':'AND';
    obj.eventPropertiesGroup.relationValue = thisRel;
    setRelationValue(thisRel);
    sendDataToParents();
  }
  const relationTotal=()=>{
    let thisRel = totalRelation == 'AND'?'OR':'AND';
    obj.eventCountGroup.relationValue = thisRel;
    setTotalRelation(thisRel);
    sendDataToParents();
  }
  
  //筛选下拉 选择事件 propertyValueList为接收值
  const fitlterChange=(item,value,keyName)=>{
    item[keyName] = value;
    //二级下拉
    if(keyName=='predicateInfoId'){
      let arr = threeList.filter((ele)=>{
        return ele.id == value;
      })
      if(arr.length){
        item.controlType = arr[0].controlType;
        if(item.controlType=='HIDE'){
          item.propertyValueList = [];
          item.propertyValue = '';
        }
      }
    }
    //三级下拉
    if(keyName=='propertyValueList'){//多选
      let arr = threeList.filter((ele)=>{
        return ele.id == item.predicateInfoId;
      })
      if(arr.length){
        if(arr[0].controlType=='MULTIPLE'){
          item.propertyValue =  value.join(',');//处理多选
        }
      }
    }
    let groupsData = JSON.parse(JSON.stringify(groups));
    obj.eventPropertiesGroup.eventPropertiesDefinitions = groupsData;
    setGroups(groupsData);
    sendDataToParents();
  }
  //添加筛选
  const addFilter = ()=>{
    let goupsObj = JSON.parse(JSON.stringify(groups));
    let thisObj = {
      userEventPropertiesInfoId: twoList[0].id,//筛选item1 下拉菜单
      predicateInfoId: threeList[0].id,//筛选item2 下拉菜单
      propertyValue:'',//筛选item3 输入
      controlType:threeList[0].controlType,
      loopId: `loop${++compId}`,
    };
    goupsObj.push(thisObj)
    obj.eventPropertiesGroup.eventPropertiesDefinitions.push(thisObj);
    setGroups(goupsObj);
    sendDataToParents();
  }
  //删除-筛选
  const deleteChild = (list,index)=>{
    list.splice(index,1);
    let goupsObj = JSON.parse(JSON.stringify(groups));
    obj.eventPropertiesGroup.eventPropertiesDefinitions = goupsObj;
    setGroups(goupsObj);
    sendDataToParents();
  }
  //添加-统计
  const addTotal = ()=>{
    let totalObj = JSON.parse(JSON.stringify(totalGroups));
    totalObj.push({..._defaultTotal,loopId: `loop${++compId}`});
    obj.eventCountGroup.eventCountDefinitions = totalObj;
    setTotalGroups(totalObj);
    sendDataToParents();
  }
  //删除-统计
  const deleteTotal = (list,index)=>{
    list.splice(index,1);
    let totalObj = JSON.parse(JSON.stringify(totalGroups));
    obj.eventCountGroup.eventCountDefinitions = totalObj;
    setTotalGroups(totalObj);
    sendDataToParents();
  }
  
  //统计事件 值改变
  const totalChange = (item,value,keyName)=>{
    item[keyName] = value;
    let totalGroupsObj = JSON.parse(JSON.stringify(totalGroups));
    obj.eventCountGroup.eventCountDefinitions = totalGroupsObj;
    setTotalGroups(totalGroupsObj);
    sendDataToParents();
  }
  useEffect(()=>{
    sendDataToParents();
  },[])
  useEffect(() => {
    if(selectData.oneList.length) {
      let arr = selectData.oneList.filter(item => {
        return item.id == oneValue
      })
      setTwoList(arr[0].userEventPropertiesInfos);
      setThreeList(arr[0].userEventPropertiesInfos[0].dataTypeInfo.predicateInfoList)
    }
  },[selectData])
  //筛选渲染
  const filterRender = (list)=>{
    return list.map((item,index)=>{
      if(!item.propertyValueList){
        item.propertyValueList = item.propertyValue ==='' ? [] : item.propertyValue.split(',');
      }
      if(item.predicateInfoId){//设置
        item.controlType = getFilterControlType(threeList,item.predicateInfoId)
      }
      return <div className={style.filterBox} key={item.id || item.loopId}>
        <div style={{flex:'0 0 180px',marginRight:'10px'}}>
          <Select style={{ width: '100% ' }} value={item.userEventPropertiesInfoId} 
          onChange={value=>fitlterChange(item,value,'userEventPropertiesInfoId')}>
            {twoList.map(d => (
              <Option key={d.id} value={d.id}>{d.nameZh}</Option>
            ))}
          </Select>
        </div>
        <div style={{flex:'0 0 180px',marginRight:'10px'}}>
          <Select style={{ width: '100% ' }} value={item.predicateInfoId} 
          onChange={value=>fitlterChange(item,value,'predicateInfoId')}>
            {threeList.map(d => (
              <Option key={d.id} value={d.id}>{d.predicateName}</Option>
            ))}
          </Select>
        </div>
        {
          getFilterControlType(threeList,item.predicateInfoId) != 'HIDE' ? <div style={{flex:'0 0 200px',marginTop:'5px'}}>
            {getFilterControlType(threeList,item.predicateInfoId) == 'MULTIPLE' ? 
            <Select mode="tags" open={false} style={{ width: '100% ' }} placeholder="" allowClear value={item.propertyValueList}
              onChange={value=>fitlterChange(item,value,'propertyValueList')}></Select> : 
            <Input value={item.propertyValue} placeholder="" autocomplete="off"
             onInput={e=>fitlterChange(item,e.target.value,'propertyValue')} />}
          </div>:''
        }
        {getFilterControlType(threeList,item.predicateInfoId) != 'HIDE'?<div className={style.filterIconBox} style={{marginTop:'5px'}}>
          {/* <Tooltip placement="top" title="点击可批量赋值粘贴" arrowPointAtCenter>
            <EditOutlined style={{ padding: '0 5px', color: '#99a9bf', cursor: 'pointer' }} onClick={changeSetAllMess} />
          </Tooltip> */}
          <Tooltip placement="top" title="提示选项为最近7天的属性关键词（最多展示 20 条），非所有关键词。可直接输入关键词，回车完成。" arrowPointAtCenter>
            <QuestionCircleOutlined style={{ padding: '0 5px', color: '#99a9bf', cursor: 'pointer' }} />
          </Tooltip>
          <span className={style.closeBtn} onClick={() => deleteChild(list,index)}>
            <CloseOutlined />
          </span>
        </div>:''}
      </div>
    })
  }
  //统计渲染
  const totalRender = (list)=>{
    return list.map((item,index)=>{
      return <div className={style.totalItem} key={item.id || item.loopId}>
        <div style={{flex:'0 0 180px',marginRight:'10px'}}>
          <Select style={{ width: '100% ' }} value={item.countType} 
          onChange={value=>totalChange(item,value,'countType')} >
            {countTypeDict.map(d => (
              <Option key={d.id} value={d.id}>{d.value}</Option>
            ))}
          </Select>
        </div>
        <div style={{flex:'0 0 80px',marginRight:'10px'}}>
          <Select style={{ width: '100% ' }} value={item.operatorValue} 
          onChange={value=>totalChange(item,value,'operatorValue')} >
            {operatorDict.map(d => (
              <Option key={d.id} value={d.id}>{d.value}</Option>
            ))}
          </Select>
        </div>
        <div style={{flex:'0 0 150px'}}>
          <Input value={item.propertyValue} placeholder="" autocomplete="off" 
          onChange={e=>totalChange(item,e.target.value,'propertyValue')} />
        </div>
        {list.length>1?<span className={style.closeBtn} onClick={() => deleteTotal(list,index)}>
          <CloseOutlined />
        </span>:''}
      </div>
    })
  }
  return (
    <div className={style.attributeFormItem} style={{ display: 'flex' }}>
      {/* 用户行为条件表单 */}
      <div style={{ width: '130px', marginRight: '10px' }}>
        <Select style={{ width: '100%' }} value={dateType} placeholder="请选择"  onChange={dateTypeChange}>
          {eventDataType_Dict.map((item)=>{
            return <Option key={item.id} value={item.id}>{item.value}</Option>
          })}
        </Select>
      </div>
      { dateType == 'BEFORE_AFTER_NOW' ? <div style={{ marginRight: '5px'}}>
          <span style={{ paddingRight: '5px' }}>在</span>
          <Input value={relValues[0]} style={{ width: '120px ' }} placeholder="请输入" onChange={(e)=>relChangeInput(e.target.value,0)} />
          <span style={{ padding: '0 5px' }}>天</span>
          <Select style={{ width: '120px ' }} value={relValues[1]} placeholder="请选择"  onChange={(e)=>relChangeInput(e,1)}>
            {eventDataTypeDown_Dict.map((item)=>{
              return <Option key={item.id} value={item.id}>{item.value}</Option>
            })}
          </Select>
        </div> :
        dateType == 'BEFORE_AFTER_NOW_BET' ? <div style={{paddingRight: '5px'}}>
          <span style={{ paddingRight: '5px' }}>在</span>
          <Select style={{ width: '80px' }} value={relValues[0]} placeholder="请选择" onChange={(e)=>relChangeInput(e,0)}>
            {eventDataTypeDown_bt_Dict.map((item)=>{
              return <Option key={item.id} value={item.id}>{item.value}</Option>
            })}
          </Select>
          {relValues[0] != 'now' ? <>
            <span style={{ padding: '0 5px' }}></span>
            <Input value={relValues[1]} style={{ width: '80px ' }} placeholder="请输入" onChange={(e)=>relChangeInput(e.target.value,1)} />
            <span style={{ padding: '0 5px' }}>到</span>
            <Input value={relValues[2]} style={{ width: '80px ' }} placeholder="请输入" onChange={(e)=>relChangeInput(e.target.value,2)} />
            <span style={{ paddingLeft: '5px' }}>天之间</span>
          </> : ''}
        </div> : <div style={{ width: '250px', marginRight: '5px' }}>
        {/* 日期选择 */}
        <RangePicker defaultValue={dateList} format={'YYYY-MM-DD'} onChange={changeStart}/>
      </div>}

      <div style={{ width: '100px', marginRight: '5px' }}>
        {/* 下拉列表 行为类型 */}
        <Select style={{ width: '100% ' }} value={behaviorType} onChange={behaviorTypeChange}>
          {behaviorTypeDict.map(d => (
            <Option key={d.id} value={d.id}>{d.value}</Option>
          ))}
        </Select>
      </div>
      <div style={{ width: '160px', marginRight: '5px' }}>
        {/* 下拉列表 用户行为 */}
        <Select style={{ width: '100% ' }} value={oneValue} showSearch
          optionFilterProp="children" onChange={handleOneChange}>
          {selectData.oneList.map(d => (
            <Option key={d.id} value={d.id}>{d.nameZh}</Option>
          ))}
        </Select>
      </div>
      <div className={style.addFilter} onClick={addFilter}><PlusOutlined />添加筛选</div>
      {/* 筛选数组 */}
      {groups.length>0 ? <div className={style.filterOuter}>
        <div className={style.filterText}>并且满足</div>
        {groups.length>1 ? <div className={style.filterRelation}>
          <span className={style.relationLine}></span>
          <span className={style.clickBtn} onClick={relationFilter}>{relationValue=='AND'?'且':'或'}</span>
          <span className={style.relationLine}></span>
        </div>:''
        }
        <div style={{flex:'auto',}}>{filterRender(groups)}</div>
      </div>:''}
      {/* 统计属性 */}
      <div className={style.totalOuter}>
        <PlusCircleOutlined className={style.totalAddBtn} onClick={addTotal}/>
        {totalGroups.length>1 ? <div className={style.totalRelation}>
          <span className={style.relationLine}></span>
          <span className={style.clickBtn} onClick={relationTotal}>{totalRelation=='AND'?'且':'或'}</span>
          <span className={style.relationLine}></span>
        </div>:''
        }
        <div className={style.totalBox}>
          {totalRender(totalGroups)}
        </div>
      </div>
      <Modal title={titleValue} width={600} cancelText="取消" okText="确定" visible={isConditionModalVisible} onCancel={handleCancel} onOk={handleOk}>
        <div style={{ color: "#475669", fontSize: "12px", padding: "0 0 10px 0" }}>注意：按换行符分隔，每行一个值</div>
        <TextArea value={inputValue} rows={10} onChange={changeInputMess} />
      </Modal>
    </div >
  )
}
export default connect(({ dataModule_common }) => ({
  selectData: dataModule_common.actionSelectData
}))(userActionModal);