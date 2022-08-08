//属性表单
import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import {
  Form, Input, Button, Select, Tooltip, DatePicker, Modal
} from 'antd';
import { EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/zh-cn';
import SelCard from './selCard';
import { eventDataTypeDown_Dict,eventDataTypeDown_bt_Dict,cardIncludes,cardSel_dict } from '@/pages/dataModule/tagModule/dict.js';

const { TextArea } = Input;
const { Option } = Select;

//根据id回显oneType
const getOneType=(list,id)=>{
  for(let item of list){
    if(item.id == id){
      return item.metaKey
    }
  }
  return null;
}

//根据类型回显卡券数据
const getCardObj=(value)=>{
  // 指定卡券或品类
  let objList = value.split(';');
  let obj={};
  if(objList.length){
    if(objList.length>=2){//正常选择
      if(objList[0]== 'all_coupon'){//不限
        obj.cardValue = objList[0];
        obj.propertyValue = objList[1] || '';
      }else if(objList[0]== 'coupon'){//指定卡券
        obj.cardValue = objList[0];
        obj.cardIds = objList[1].split(',').map(item=>{
          return Number(item)
        });;
        obj.propertyValue = objList[2] || '';
      }else if(objList[0]== 'coupon_category'){//卡券品类
        obj.cardValue = objList[0];
        obj.cardType = objList[1].split(',').map(item=>{
          return Number(item)
        });
        obj.propertyValue = objList[2] || '';
      }
    }else{//二级清空
      obj.cardValue = objList[0];
      obj.cardIds = [];
      obj.cardType = [];
      obj.propertyValue = '';
    }
  }else{//一级清空
    obj.cardValue = null;
    obj.cardIds = [];
    obj.cardType = [];
    obj.propertyValue = '';
  }
  obj.list = objList;
  return obj;
}
let isGetCardCategorys=false;
console.log(11111111)
const UserAttributeModule = (props) => {
  const { dispatch, twoObj ,selectData,indexObj,setParentsData,cardCategorys} = props;//selectData从model取
  //下拉框 初始值
  let obj = JSON.parse(JSON.stringify(twoObj))
  obj.userMetaInfoId = obj.userMetaInfoId !=='' ? obj.userMetaInfoId : selectData.oneList[0].id;
  obj.predicateInfoId = obj.predicateInfoId !=='' ? obj.predicateInfoId : selectData.twoList[0].id;
  obj.dataTypeKey = obj.dataTypeKey || obj.predicateInfo && obj.predicateInfo.controlType || selectData.twoList[0].controlType;
  obj.metaKey = obj.metaKey || obj.meta && obj.meta.metaKey ||  selectData.oneList[0].metaKey;
  let propertyValue = obj.propertyValue;
  let startDates = ''
  let entDates = ''
  let relValues_def = [];
  let isShowIcon_def = true;
  let _oneValue = getOneType(selectData.oneList,obj.userMetaInfoId);
  let cardObj ={};
  //卡券类型数据获取
  if(cardIncludes.includes(_oneValue)){
    cardObj = getCardObj(propertyValue);
    propertyValue = cardObj.propertyValue;
    if(cardObj.cardValue=='coupon_category'){
      getCardCategorys();
    }
  }
  if(obj.dataTypeKey == 'MULTIPLE_DROP' || obj.dataTypeKey == 'MULTIPLE'){
    propertyValue = propertyValue && propertyValue.split(',');
  } else if(obj.dataTypeKey=='DATE' && propertyValue) {
    startDates =  propertyValue.split(',')[0];
    entDates =  propertyValue.split(',')[1];
  } else if(obj.dataTypeKey == 'INPUT_SINGLE_DROP' || obj.dataTypeKey=='SINGLE_DROP_INPUT_RANG'){
    //相对区间
    relValues_def = propertyValue.split(',');
    isShowIcon_def = false;
  }
  
  const [twoList, setTwoList] = useState(selectData.twoList);//下拉列表2
  const [threeList, setThreeList] = useState(selectData.threeList);//下拉列表3

  const [startDate, setStartDate] = useState(startDates);//日期选择框
  const [entDate, setEntDate] = useState(entDates);//日期选择框
  const [oneValue, setOneValue] = useState(obj.userMetaInfoId);//1级值
  const [oneType, setOneType] = useState(_oneValue || null);//1级值-类型
  const [twoValue, setTwoValue] = useState(obj.predicateInfoId);//2级值
  const [dataTypeKey, setDataTypeKey] = useState(obj.dataTypeKey);//3级显示类型
  const [threeValue, setThreeValue] = useState(propertyValue);//3级值

  const [isShowThree, setIsShowThree] = useState(true);//三级后的图标显示
  const [isShowIcon, setIsShowIcon] = useState(isShowIcon_def);//三级后的图标显示
  const [titleValue, setTitleValue] = useState(null);//多条件弹窗
  const [isConditionModalVisible, setIsConditionModalVisible] = useState(false);//多条件弹窗
  const [inputValue, setInputValue] = useState("");//多条件输入
  
  const [cardValue,setCardValue] = useState(cardObj.cardValue || null);//卡券1下拉
  const [cardType,setCardType] = useState(cardObj.cardType || []);//卡券品类下拉
  const [cardIds,setCardIds] = useState(cardObj.cardIds || []);//卡券
  const [isModalVisible, setIsModalVisible] = useState(false);//添加卡券弹框

  //相对时间 渲染对象
  const [relValues,setRelValues] = useState(relValues_def);
  const [cardPropertyValue,setCardPropertyValue] = useState(cardObj.list || []);//卡券选择 拼接数组

  //多条件弹窗
  const handleOk = () => {
    obj.propertyValue = inputValue;
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
  //设置 setCardPropertyValue
  const setCardPropertyValue_com=(index,value,clear)=>{
    let _cardPropertyValue = JSON.parse(JSON.stringify(cardPropertyValue));
    if(clear) _cardPropertyValue = [];
    if(index !== null) _cardPropertyValue[index] = value;
    let rel = _cardPropertyValue.filter(item=>{
      return item;
    })
    obj.propertyValue = rel.join(';');
    sendDataToParents();
    //先发送数据，再更新cardPropertyValue，因为这里之需要记录，不触发渲染
    setCardPropertyValue(_cardPropertyValue);
  }

  //设置时间拼接
  const setTimeStr=(time,type)=>{
    let timeArr = [];
    if(type=='start'){
      timeArr = [time,entDate];
    }else{
      timeArr = [startDate,time];
    }
    if(timeArr.length>=2) {
      if(cardIncludes.includes(oneType)){
        setCardPropertyValue_com(2,timeArr.join(','))
      }else{
        obj.propertyValue = timeArr.join(',');
        sendDataToParents();
      }
    }
  }
  //开始时间
  const changeStart = (e) => {
    let time = e.format('YYYY-MM-DD');
    setTimeStr(time,'start');
    setStartDate(time)
  }
  //结束时间
  const changeEnd = (e) => {
    let time = e.format('YYYY-MM-DD');
    setTimeStr(time,'end');
    setEntDate(time)
  }

  //一级下拉
  const handleOneChange = (value, option) => {
    if(cardIncludes.includes(option.type)){
      setCardValue(null);
      setRelValues([]);
      setCardPropertyValue_com(null,null,'clear');
    }else{
      setCardValue(null);
    }
    setOneType(option.type)
    setOneValue(value)
    setTwoList(option.childList);
    setThreeList(option.threeList);
    setTwoValue(option.childList[0].id);
    setDataTypeKey(option.childList[0].controlType);
    option.childList[0].controlType == 'MULTIPLE_DROP' || option.childList[0].controlType == 'MULTIPLE' ? setThreeValue([]) : setThreeValue('');
    obj.propertyValue = '';
    obj.userMetaInfoId = value;
    obj.predicateInfoId = option.childList[0].id;
    obj.predicateInfo.id = option.childList[0].id;
    obj.dataTypeKey = option.childList[0].controlType
    obj.predicateInfo.controlType = option.childList[0].controlType;
    obj.metaKey = option.type;
    sendDataToParents();
  };
  
  //获取卡券品类
  function getCardCategorys(){
    if(!cardCategorys.length && !isGetCardCategorys){
      dispatch({
        type: 'dataModule_common/category',
        payload: {
          method: 'postJSON',
          params: {
            pageNum: 1,
            pageSize: 99999999
          }
        }
      })
      isGetCardCategorys = true;
    }
  }
 
  //卡券一级下拉框
  const cardChange = (value, option)=>{
    if(value=='coupon_category'){
      getCardCategorys();
    }
    setCardValue(value);
    setCardIds([]);
    setCardType([]);
    setRelValues([]);
    setThreeValue((dataTypeKey=='MULTIPLE_DROP' || dataTypeKey=='MULTIPLE') ? []:'');
    setStartDate('');
    setEntDate('');
    setCardPropertyValue_com(0,value,'clear');
  }
  //卡券品类下拉框
  const cardTypeChange = (value, option)=>{
    setCardType(value);
    setCardPropertyValue_com(1,value);
  }
  //卡券id集合
  const cardIdsChange = (value, option)=>{
    setCardIds(value);
    setCardPropertyValue_com(1,value);
  }
  //选择卡券
  const selCardOpen=()=>{
    setIsModalVisible(true);
  }
  //获取卡券编号
  const sendCardIds=(res)=>{
    setCardIds(res);
    setCardPropertyValue_com(1,res);
    setIsModalVisible(false);
  }
  //二级下拉
  const handleTwoChange = (value, option) => {
    setTwoValue(value)
    setTitleValue(option.children);
    let arr = twoList.filter(item => {
      return item.id == value
    })
    let controlType = arr[0].controlType;
    setDataTypeKey(controlType)
    controlType == 'MULTIPLE_DROP' || controlType == 'MULTIPLE' ? setThreeValue([]) : setThreeValue('');
    //设置选中值 传递给后台
    if(!cardIncludes.includes(oneType)) obj.propertyValue = '';//清空三级
    obj.predicateInfoId = value;
    obj.predicateInfo = arr[0];
    obj.controlType = controlType;
    obj.dataTypeKey = controlType;
    obj.dateType = value;
    //相对区间
    if(controlType == 'INPUT_SINGLE_DROP' || controlType=='SINGLE_DROP_INPUT_RANG'){
      setIsShowIcon(false);//相对区间 隐藏icon
      if(controlType == 'INPUT_SINGLE_DROP') setRelValues([null,null])
      if(controlType == 'SINGLE_DROP_INPUT_RANG') setRelValues([null,null,null])
    }else{
      setIsShowIcon(true)
    }
    if(cardIncludes.includes(oneType)){
      if(cardValue=='all_coupon'){
        setCardPropertyValue_com(1,'');
      }else{
        setCardPropertyValue_com(2,'');
      }
    }else{
      sendDataToParents();
    }
  };
  //三级多选下拉
  const handleThreeChange = (value, option) => {
    setThreeValue(value);
    if(cardIncludes.includes(oneType)){
      if(cardValue=='all_coupon'){
        setCardPropertyValue_com(1,value);
      }else{
        setCardPropertyValue_com(2,value);
      }
    }else{
      obj.propertyValue = value.join(',');
      sendDataToParents();
    }
  };
  //三级单选下拉
  const handleThreeChanges = (value, option) => {
    setThreeValue(value);
    if(cardIncludes.includes(oneType)){
      if(cardValue=='all_coupon'){
        setCardPropertyValue_com(1,value);
      }else{
        setCardPropertyValue_com(2,value);
      }
    }else{
      obj.propertyValue = value;
      sendDataToParents();
    }
  };
  //三级输入
  const changeInput = (e) => {
    setThreeValue(e.target.value);
    if(cardIncludes.includes(oneType)){
      setCardPropertyValue_com(2,e.target.value);
    }else{
      obj.propertyValue = e.target.value;
      sendDataToParents();
    }
  }
  //批量赋值粘贴 后续再支持
  const changeSetAllMess = () => {
    //第二级title
    let i = twoList.findIndex((value) => value.id == obj.predicateId);
    if (i != -1) {
      setTitleValue(twoList[i].predicateName)
    }
    setInputValue(obj.propertyValue)
    setIsConditionModalVisible(true)
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
    if(cardIncludes.includes(oneType)){
      setCardPropertyValue_com(2,_relValues.join(','));
      for(let item of _relValues){
        if(!item){
          setCardPropertyValue_com(2,'');
        }
      }
    }else{
      obj.propertyValue = _relValues.join(',');
      for(let item of _relValues){
        if(!item){
          obj.propertyValue = '';
        }
      }
      sendDataToParents();
    }
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
    setTwoList(selectData.twoList);
    setThreeList(selectData.threeList)
    if(oneValue && selectData.oneList.length) {
      let arr = selectData.oneList.filter(item => {
        return item.id == oneValue
      })
      setTwoList(JSON.parse(JSON.stringify(arr[0].dataTypeInfo.predicateInfoList)));
      setThreeList(JSON.parse(JSON.stringify(arr[0].userMetaInfoOptions)));
    }
  },[selectData])
  useEffect(()=>{
    sendDataToParents();
  },[])

  

  return (
    <div className={style.attributeFormItem} style={{ display: 'flex' }}>
      {/* 用户属性条件表单 */}
      <div style={{ flex: '0 0 160px', marginRight: '5px' }}>
        {/* 下拉列表1 */}
        <Select
          style={{ width: '100% ' }}
          placeholder=""
          value={oneValue}
          showSearch
          optionFilterProp="children"
          onChange={handleOneChange}
        >
          {selectData.oneList.map(d => (
            <Option key={d.id} value={d.id} type={d.metaKey}
            childList={d.dataTypeInfo?d.dataTypeInfo.predicateInfoList:[]} 
            threeList={d.userMetaInfoOptions}>{d.metaName}</Option>
          ))}
        </Select>
      </div>
      {cardIncludes.includes(oneType) ? <div style={{ flex: '0 0 120px', marginRight: '5px' }}>
        {/* 下拉列表 - 卡券 */}
        <Select style={{ width: '100% ' }} value={cardValue} onChange={cardChange} placeholder="请选择"> 
          {cardSel_dict.map((item)=>{
            return <Option key={item.id} value={item.id}>{item.value}</Option>
          })}
        </Select>
      </div>:''}
      {/* 卡券品类 */}
      {cardValue=='coupon_category'?<div style={{ flex: '0 0 150px', marginRight: '5px' }}>
        <Select mode="multiple" style={{ width: '100% ' }} value={cardType} onChange={cardTypeChange}>
          {cardCategorys.map(d => (
            <Option key={d.id} value={d.id}>{d.categoryName}</Option>
          ))}
        </Select>
      </div>:''}
      {/* 指定卡券 */}
      {cardValue=='coupon'?<div className={style.sel_card_box}  style={{ flex: '0 0 260px', marginRight: '5px' }}>
        <Select mode="multiple" open={false} style={{ width: '100% ' }} value={cardIds} onChange={cardIdsChange} >
        </Select>
        <div className={style.sel_card} onClick={selCardOpen}>选择卡券</div>
      </div>:''}
      <div style={{ flex: '0 0 100px', marginRight: '5px' }}>
        {/* 下拉列表2 */}
        <Select style={{ width: '100% ' }} value={twoValue} onChange={handleTwoChange}>
          {twoList.map(d => (
            <Option key={d.id} value={d.id}>{d.predicateName}</Option>
          ))}
        </Select>
      </div>
      {
        dataTypeKey!='HIDE' ? <div style={{ display: 'flex', marginRight: '5px',flex:'auto', }}>
          {/* 三级 */}
          {
            dataTypeKey=='DATE' ? <div style={{ paddingRight: '10px' }}>
              <span style={{ padding: '0 5px' }}>在</span>
              <DatePicker
                value={startDate?moment(startDate, 'YYYY-MM-DD'):null}
                style={{ width: '150px' }}
                format="YYYY-MM-DD"
                onChange={(e) => changeStart(e)}
              />
              <span style={{ padding: '0 5px' }}>到</span>
              <DatePicker
                value={entDate?moment(entDate, 'YYYY-MM-DD'):null}
                style={{ width: '150px' }}
                format="YYYY-MM-DD"
                onChange={(e) => changeEnd(e)}
              />
            </div> 
            // 多选下拉 
            : dataTypeKey=='MULTIPLE_DROP' ? 
            <div style={{ width: '200px' }}>
              <Select mode="multiple" style={{ width: '100% ' }} value={threeValue} placeholder="" onChange={handleThreeChange} allowClear>
              {threeList.map(d => (
                <Option key={d.optionsName} value={d.optionsName}>
                  {d.optionsName}
                </Option>
              ))}
            </Select> </div>
            // 多选输入
            : dataTypeKey=='MULTIPLE' ? 
            <div style={{ width: '200px' }}>
            <Select mode="tags" open={false} style={{ width: '100% ' }} value={threeValue} placeholder="" onChange={handleThreeChange} allowClear>
            {threeList.map(d => (
              <Option key={d.optionsName} value={d.optionsName}>
                {d.optionsName}
              </Option>
            ))}
          </Select> </div> 
            : dataTypeKey=='SINGLE_DROP' ? 
            <div style={{ width: '200px' }}>
            <Select style={{ width: '100% ' }} value={threeValue} placeholder="" onChange={handleThreeChanges} allowClear>
            {threeList.map(d => (
              <Option key={d.optionsName} value={d.optionsName}>
                {d.optionsName}
              </Option>
            ))}
          </Select> </div> : dataTypeKey=='INPUT_SINGLE_DROP' ? <div>
            <span style={{ padding: '0 5px' }}>在</span>
            <Input value={relValues[0]} style={{ width: '120px ' }} placeholder="请输入" onChange={(e)=>relChangeInput(e.target.value,0)} />
            <span style={{ padding: '0 5px' }}>天</span>
            <Select style={{ width: '120px ' }} value={relValues[1]} placeholder="请选择"  onChange={(e)=>relChangeInput(e,1)}>
              {eventDataTypeDown_Dict.map((item)=>{
                return <Option key={item.id} value={item.id}>{item.value}</Option>
              })}
            </Select>
          </div> : dataTypeKey=='SINGLE_DROP_INPUT_RANG' ? <div>
            <span style={{ padding: '0 5px' }}>在</span>
            <Select style={{ width: '120px' }} value={relValues[0]} placeholder="请选择" onChange={(e)=>relChangeInput(e,0)}>
              {eventDataTypeDown_bt_Dict.map((item)=>{
                return <Option key={item.id} value={item.id}>{item.value}</Option>
              })}
            </Select>
            {relValues[0] != 'now' ? <>
              <span style={{ padding: '0 5px' }}></span>
              <Input value={relValues[1]} style={{ width: '100px ' }} placeholder="请输入" onChange={(e)=>relChangeInput(e.target.value,1)} />
              <span style={{ padding: '0 5px' }}>到</span>
              <Input value={relValues[2]} style={{ width: '100px ' }} placeholder="请输入" onChange={(e)=>relChangeInput(e.target.value,2)} />
              <span style={{ padding: '0 5px' }}>天之间</span>
            </>:''}
          </div> :
            <div style={{ width: '200px' }}>
              <Input value={threeValue} placeholder="" autocomplete="off" onInput={changeInput} />
            </div>
          }
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
      {
        isModalVisible ?
          <SelCard closeModal={() => { setIsModalVisible(false) }} cardIds={cardIds} sendCardIds={sendCardIds}/>
          : ''
      }
    </div >
  )
}
export default connect(({ dataModule_common }) => ({
  selectData: dataModule_common.attributeSelectData,
  cardCategorys: dataModule_common.cardCategorys,
}))(UserAttributeModule);