//基础信息
import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import {
  Form, Input, Select,Modal
} from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import UserAttribute from '@/pages/dataModule/components/userAttribute/userAttribute'
import UserAction from '@/pages/dataModule/components/userAction/userAction'

const {confirm } = Modal;
const { Option } = Select;
let indexTitle = 1;
let compId = 0;//子组件自增id，用于渲染key
let defaultObj = {
  propertiesEventRelation:'AND',//属性/行为 关系 总关系
  remark:'',
  eventRelation:'AND',//行为关系
  propertiesRelation:'AND',//属性关系
  propertiesDefinitionGroups: [],//属性数组
  eventDefinitionGroups:[],//行为数组
}
const TagRules = (props) => {
  const { tagLayerInfos, dispatch,cRef,hierarchyIndex,modalType } = props;
  //通过Form.useForm对表单数据域进行交互。useForm是React Hooks的实现，只能用于函数组件
  const [form] = Form.useForm();
  //cRef就是父组件传过来的ref
  useImperativeHandle(cRef, () => ({
    //getForm就是暴露给父组件的方法
    getForm: () => form,
  }));

  //若有正则验证，则在所有的正则校验都通过后用来获取输入的数据，若没有正则校验，则直接获取输入的数据
  const onFinish = values => {
    // values.date = timestampToTime(values.date).replace(' ', '')
  };

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
  };

  const validateMessages = {
    required: '${label} 必填!',
  };
  const setHierarchyIndex=(index)=>{
    dispatch({
      type: 'setTagPanel/setHierarchyIndex',
      payload: index
    });
  }
  //改变分层名称
  const changeHierarchyTitle = (e) => {
    tagLayerInfos[hierarchyIndex].layerName = e.target.value;
    dispatch({
      type: 'setTagPanel/setTagLayerInfos',
      payload: JSON.parse(JSON.stringify(tagLayerInfos))
    });
  }

  
  //修改备注
  const remarkInput = (e) => {
    tagLayerInfos[hierarchyIndex].remark = e.target.value;
    dispatch({
      type: 'setTagPanel/setTagLayerInfos',
      payload: JSON.parse(JSON.stringify(tagLayerInfos))
    });
  }

  //查看分层
  const seeHierarchy = (item, index) => {
    setHierarchyIndex(index);
    form.setFieldsValue({
      layerName: item.layerName,
      remark: item.remark,
    });
  }

  //删除分层
  const deleteHierarchy = (e,index) => {
    e.stopPropagation();
    confirm({
      title: '提示',
      content: '确定删除该分层？',
      onOk() {
        tagLayerInfos.splice(index, 1)
        dispatch({
          type: 'setTagPanel/setTagLayerInfos',
          payload: JSON.parse(JSON.stringify(tagLayerInfos))
        });
      },
      onCancel() {},
    })
    
  }
  //属性行为 关系
  const relationTag=(index)=>{
    let thisRel = tagLayerInfos[index].propertiesEventRelation == 'AND'?'OR':'AND';
    tagLayerInfos[index].propertiesEventRelation = thisRel;
    dispatch({
      type: 'setTagPanel/setTagLayerInfos',
      payload: JSON.parse(JSON.stringify(tagLayerInfos))
    });
  }
  //添加分层
  const addHierarchy = () => {
    let obj = JSON.parse(JSON.stringify(defaultObj));
    indexTitle++;
    obj.layerName = "分层" + indexTitle;
    tagLayerInfos.push(obj)
    form.setFieldsValue({
      layerName: tagLayerInfos[tagLayerInfos.length - 1].layerName
    })
    setHierarchyIndex(tagLayerInfos.length - 1)
    dispatch({
      type: 'setTagPanel/setTagLayerInfos',
      payload: JSON.parse(JSON.stringify(tagLayerInfos))
    });
  }
  //页面加载，初始创建分层
  useEffect(()=>{
    if(modalType == "create") {//新增
      if(tagLayerInfos.length<=0){
        indexTitle = 1;
        let obj = JSON.parse(JSON.stringify(defaultObj));
        obj.layerName = "分层" + indexTitle;
        obj.loopId = `loop${++compId}`;
        tagLayerInfos.push(obj);
        setHierarchyIndex(0)
        form.setFieldsValue({
          layerName: tagLayerInfos[0].layerName,
          gender:'other',
        })
      }else{
        indexTitle = tagLayerInfos.length
        setHierarchyIndex(0)
        form.setFieldsValue({
          layerName: tagLayerInfos[0].layerName,
          gender:'other',
          remark: tagLayerInfos[0].remark,
        })
      }
      dispatch({
        type: 'setTagPanel/setTagLayerInfos',
        payload: JSON.parse(JSON.stringify(tagLayerInfos))
      });
    } else {//修改
      console.log(tagLayerInfos)
      indexTitle = tagLayerInfos.length;
      form.setFieldsValue({
        layerName: tagLayerInfos[0].layerName,
        remark: tagLayerInfos[0].remark,
        gender:'other',
      })
    }
  },[]);
  
  //选择分层改变分层名称
  const onGenderChange = (value) => {
    let obj = JSON.parse(JSON.stringify(defaultObj));
    switch (value) {
      case 'other':
        obj.layerName = "分层" + indexTitle;
        tagLayerInfos.push(obj);
        setHierarchyIndex(0)
        form.setFieldsValue({
          layerName: tagLayerInfos[0].layerName
        })
        dispatch({
          type: 'setTagPanel/setTagLayerInfos',
          payload: JSON.parse(JSON.stringify(tagLayerInfos))
        });
        return;
      case 'auto':
        form.setFieldsValue({
          layerName: '',
        });
        return;
    }
  };


  
  return (
    <div className={style.layer_box}>
      <Form {...layout} form={form} onFinish={onFinish} validateMessages={validateMessages}>
        <Form.Item
          name="gender"
          label="分层方式"
        >
          <Select placeholder="请选择分层方式" onChange={onGenderChange}>
            <Option value="other">自定义分层</Option>
            {/* <Option value="auto">自动分层</Option> */}
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
        >
          {({ getFieldValue }) => {
            return getFieldValue('gender') === 'other' ? (
              <div style={{paddingLeft:'80px'}}>
                <div className={style.hierarchy}>
                  {
                    tagLayerInfos.map((item, index) => {
                      return <div className={index == hierarchyIndex ? `${style.btnActive}` : `${style.btn}`} key={item.id || item.loopId}
                      onClick={() => seeHierarchy(item, index)}>
                        <div>
                          <span>{item.layerName}</span>
                        </div>
                        {tagLayerInfos.length>1?<div className={style.close} onClick={(e) => deleteHierarchy(e,index)}>
                          <span><CloseOutlined />
                          </span>
                        </div>:''}
                      </div>
                    })
                  }
                  <div className={style.btn} style={{ textAlign: "center" }} onClick={addHierarchy}>
                    <span><PlusOutlined />添加分层</span>
                  </div>
                </div>
                <Form.Item
                  name="layerName"
                  label="分层名称"
                >
                  <Input placeholder="请选择分层名称" autocomplete="off" onInput={changeHierarchyTitle} />
                </Form.Item>
              </div>
            ) : null;
          }}
        </Form.Item>
        <Form.Item name='remark' label="分层描述">
          <Input.TextArea placeholder="请选择分层描述" onInput={remarkInput}/>
        </Form.Item>
      </Form>
      {/* 用户属性动态表单 */}
      {
        tagLayerInfos.map((item, index) => {
          return <div style={{display:index == hierarchyIndex?'block':'none'}} key={item.id || item.loopId}>
            <div className={style.tagBox}>
              <div className={style.tagRaletion}>
                <span className={style.relationLine}></span>
                <span className={style.clickBtn} onClick={()=>relationTag(index)}>{item.propertiesEventRelation=='AND'?'且':'或'}</span>
                <span className={style.relationLine}></span>
              </div>
              <div className={style.tagItem}>
                <UserAttribute tagLayerInfosItem={item} itemIndex={index} /> 
                <UserAction tagLayerInfosItem={item} itemIndex={index} />
              </div>
            </div>
          </div>
        })
      }
    </div >
  )
}
export default connect(({ setTagPanel }) => ({
  tagLayerInfos: setTagPanel.tagLayerInfos,
  hierarchyIndex: setTagPanel.hierarchyIndex,
  modalType: setTagPanel.modalType,
}))(TagRules);