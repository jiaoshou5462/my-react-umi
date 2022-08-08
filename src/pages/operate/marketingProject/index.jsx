import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Table, Select, Row,Col , Space, Button, DatePicker, Switch, Modal, message, ConfigProvider, Pagination } from "antd";
import style from "./style.less";
import moment from 'moment';
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import { QueryFilter} from '@ant-design/pro-form';

import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";
const { TextArea } = Input;


// 营销项目
const marketingProject = (props) => {
  let { dispatch, marketingList, marketingTotal, channelList, carCaseServiceList, caseStatusList, branchList } = props;
  let [form1] = Form.useForm();
  let [form2] = Form.useForm();
  let [form3] = Form.useForm();
  let tokenObj = JSON.parse(localStorage.getItem('tokenObj'))//原先直接调用market服务没有地方获取channelId
  let [objectId, setObjectId] = useState(null);//当前项目ID
  let [isNewVisible, setIsNewVisible] = useState(false);//新增营销项目弹框
  let [isDelVisible, setIsDelVisible] = useState(false);//删除营销项目弹框
  let [isEditVisible, setIsEditVisible] = useState(false);//编辑营销项目弹框

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [payload, setPayload] = useState({});
  const [bussinessType, setBussinessType ] = useState([]);

  useEffect(() => {
    marketList()
  }, [current, pageSize, payload])
  //业务类型下拉框
  useEffect(() => {
    queryBusinessType()
  }, [])
  // 列表
  const marketList = () => {
    let newPayload = JSON.parse(JSON.stringify(payload));
    dispatch({
      type: 'marketingProjectModel/marketList',//列表
      payload: {
        method: 'postJSON',
        params: {
          pageNum: current,
          pageSize: pageSize,
          query: newPayload
        },
      }
    });
  }
  // 查询全部业务类型
  const queryBusinessType = () => {
    dispatch({
      type: 'marketingProjectModel/queryBussinessType',//列表
      payload: {
        method: 'postJSON',
      },
      callback: res => {
        console.log(res)
        setBussinessType(res.body)
      }
    });
  }
  
  
  let businessType = (text, all) => {
    return <>
      { text == 1 ?<TypeTags color="#2FB6E4">钩子产品</TypeTags> : '' }
      { text == 2 ? <TypeTags color="#32D1AD">智能活动</TypeTags> : '' }
      { text == 3 ? <TypeTags color="#7545A7">智能卡券</TypeTags> : '' }
      { text == 4 ? <TypeTags color="#ff4A1A">通用</TypeTags> : '' }
      { text == 0 ? "-" : '' }
    </>
  }

  let statusType = (text, all) => {
    return <>
      {text==1 ? <StateBadge type="red">禁用</StateBadge>:''}
      {text==2 ? <StateBadge status="success">开启</StateBadge>:''}
    </>
  }
  let createTimeType = (text, all) => {
    return <span>{moment(text).format('YYYY-MM-DD')}</span>
  }
  const columns = [
    {
      title: '项目ID',
      dataIndex: 'objectId',
      key: 'objectId',
      width:90,
      fixed: 'left',
    }, {
      title: '项目名称',
      dataIndex: 'marketProjectName',
      key: 'marketProjectName',
      width:150,
    },{
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
      width:150,
      render: (text, all) => businessType(text, all)
    },  {
      title: '说明',
      dataIndex: 'marketProjectDescribe',
      key: 'marketProjectDescribe',
      width:150,
    },
    {
      title: '状态',
      dataIndex: 'marketProjectStatus',
      key: 'marketProjectStatus',
      width:90,
      render: (text, all) => statusType(text, all)
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width:150,
      render: (text, all) => <ListTableTime>{moment(text).format('YYYY-MM-DD')}</ListTableTime>
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 100,
      fixed: 'right',
      render: (text, all) => Option(text, all)
    }
  ]
  // 确认新增营销项目
  const marketAdd = () => {
    let values = form2.getFieldValue();
    if (!values.marketProjectName) {
      message.warning({
        content: '项目名称不能为空'
      });
    } else if (!values.marketProjectDescribe) {
      message.warning({
        content: '项目说明不能为空'
      });
    } else {
      dispatch({
        type: 'marketingProjectModel/marketAdd',//添加
        payload: {
          method: 'postJSON',
          params: {
            marketProjectName: values.marketProjectName,//营销项目名称
            marketProjectDescribe: values.marketProjectDescribe,//营销项目描述
            marketProjectStatus: values.marketProjectStatus === true ? 2 : 1,//营销项目状态
            businessType: values.businessType,//营销项目状态  
          },
        },
        callback: (res) => {
          if (res.result.code == '0') {
            message.success({
              content: '新增成功'
            });
            setIsNewVisible(false);
            marketList();
          } else {
            message.error({
              content: res.result.message
            });
          }
        }
      });
    }
  }
  // 确认编辑
  const marketEdit = () => {
    let values = form3.getFieldValue();
    if (!values.marketProjectName) {
      message.warning({
        content: '项目名称不能为空'
      });
    } else if (!values.marketProjectDescribe) {
      message.warning({
        content: '项目说明不能为空'
      });
    }else if (!values.businessType) {
      message.warning({
        content: '业务类型不能为空'
      });
    } else {
      dispatch({
        type: 'marketingProjectModel/marketEdit',//编辑
        payload: {
          method: 'postJSON',
          params: {
            objectId: objectId,//项目ID
            marketProjectName: values.marketProjectName,//营销项目名称
            marketProjectDescribe: values.marketProjectDescribe,//营销项目描述
            marketProjectStatus: values.marketProjectStatus === true ? 2 : 1,//营销项目状态
            businessType: values.businessType,//营销项目状态  
            channelId: tokenObj.channelId,//渠道ID                 
          }
        },
        callback: (res) => {
          if (res.result.code == '0') {
            message.success({
              content: '编辑成功'
            });
            setIsEditVisible(false);
            marketList();
          } else {
            message.error({
              content: res.result.message
            });
          }
        }
      });
    }
  }

  // 确认删除
  const marketDel = () => {
    dispatch({
      type: 'marketingProjectModel/marketDel',//删除
      payload: {
        method: 'postJSON',
        params: {
          objectId: objectId//项目ID
        },
      },
      callback: (res) => {
        if (res.result.code == '0') {
          message.success({
            content: '删除成功'
          });
          setIsDelVisible(false);
          marketList();
        } else {
          message.error({
            content: res.result.message
          });
        }
      }
    });
  }
  
  const Option = (text, all) => {
    // 点击编辑
    let handelClickEdit = () => {
      console.log(all)
      setIsEditVisible(true);
      setObjectId(all.objectId);
      //设置编辑数据
      form3.setFieldsValue({
        marketProjectName: all.marketProjectName,
        marketProjectDescribe: all.marketProjectDescribe,
        marketProjectStatus: all.marketProjectStatus == 2,
        businessType:all.businessType
      });
    }

    // 点击删除
    let handelClickDel = () => {
      setIsDelVisible(true);
      setObjectId(all.objectId);
    }
    return <ListTableBtns>
      <LtbItem onClick={()=>{handelClickEdit()}}>编辑</LtbItem>
      <LtbItem onClick={()=>{handelClickDel()}}>删除</LtbItem>
    </ListTableBtns>
  }
  // 点击新增
  let handelClickAdd = () => {
    setIsNewVisible(true);
    form2.resetFields();
    form2.setFieldsValue({
      marketProjectStatus:true,
    })
  }

  //表单查询
  const searchBtn = (val) => {
    setCurrent(1);
    setPayload(JSON.parse(JSON.stringify(val)))
  }

  //表单重置
  const resetBtnEvent = () => {
    form1.resetFields();
    setPayload({})
  }

  //分页
  const pageChange=(page,pageSize)=>{
    setCurrent(page)
    setPageSize(pageSize)
  }
  return (
    <>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form1} defaultCollapsed onFinish={searchBtn} onReset={resetBtnEvent}>
          <Form.Item label="营销项目名称" name="marketProjectName" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入营销项目名称" ></Input>
          </Form.Item>
          <Form.Item label="业务类型" name="businessType" labelCol={{ flex: '0 0 120px' }}>
            <Select allowClear placeholder="不限">
              {
                bussinessType.map(item=><Option value={item.type}>{item.name}</Option>)
              }
            </Select>
          </Form.Item>
        </QueryFilter>
      </div>

      <div className={style.list_box}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
            <Button onClick={ () => { handelClickAdd() } } type="primary">新增营销项目</Button>
          </Space>
        </ListTitle>
        <ListTable showPagination current={current} pageSize={pageSize} total={marketingTotal} onChange={pageChange}>
          <Table  columns={columns} dataSource={marketingList} scroll={{ x: 1500 }}  pagination={false} >
          </Table>
        </ListTable>
      </div>

      {/* 新增营销项目弹框 */}
      <Modal title="新建营销项目" visible={isNewVisible} onOk={marketAdd} onCancel={() => { setIsNewVisible(false) }}>
        <Form form={form2}>
          <Form.Item className={style.form_item} label="项目名称：" name='marketProjectName'>
            <Input placeholder="最多不超过20个字" maxLength={20} ></Input>
          </Form.Item>
          <Form.Item className={style.form_item} label="业务类型" name="businessType">
            <Select allowClear placeholder="请选择业务类型">
              {
                bussinessType.map(item=>{
                  return <Option value={item.type}>{item.name}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item className={style.form_item} label="项目说明：" name='marketProjectDescribe'>
            <TextArea showCount maxLength={200} />
          </Form.Item>  
          <Form.Item className={style.form_item} label="状态：" valuePropName="checked" name="marketProjectStatus">
            <Switch checkedChildren="开启" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑弹框 */}
      <Modal title="编辑营销项目" visible={isEditVisible} onOk={marketEdit} onCancel={() => { setIsEditVisible(false) }}>
        <Form form={form3}>
          <Form.Item className={style.form_item} label="项目名称：" name="marketProjectName">
            <Input placeholder="最多不超过20个字" maxLength={20}></Input>
          </Form.Item>
          <Form.Item className={style.form_item} label="业务类型" name="businessType">
              <Select allowClear placeholder="请选择业务类型">
                {
                  bussinessType.map(item=>{
                    return <Option value={item.type}>{item.name}</Option>
                  })
                }
              </Select>
          </Form.Item>
          <Form.Item className={style.form_item} label="项目说明：" name="marketProjectDescribe">
            <TextArea showCount maxLength={200}  />
          </Form.Item>
          <Form.Item className={style.form_item} label="状态：" valuePropName="checked" name="marketProjectStatus">
            <Switch checkedChildren="开启" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 删除弹框 */}
      <Modal title="删除营销项目" visible={isDelVisible} onOk={marketDel} onCancel={() => { setIsDelVisible(false) }}>
        <p>是否确认删除此营销项目？</p>
      </Modal>
    </>
  )
}

export default connect(({ marketingProjectModel }) => ({
  marketingList: marketingProjectModel.marketingList,
  marketingTotal: marketingProjectModel.marketingTotal,
  // channelList: marketingProjectModel.channelList,
  // carCaseServiceList: marketingProjectModel.carCaseServiceList,
  // caseStatusList: marketingProjectModel.caseStatusList,
  // branchList: marketingProjectModel.branchList
}))(marketingProject)