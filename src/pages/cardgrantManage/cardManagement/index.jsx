import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import {
  Form,
  Space,
  Table,
  Button,
} from "antd"
import {
  QueryFilter,
  ProFormText,
  ProFormSelect
} from '@ant-design/pro-form'
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";
import style from "./style.less"
import ModalBox from './components/modal'

const cardVoucherManagement = (props) => {
  let { dispatch } = props;
  let [form] = Form.useForm();
  let [pageNum, setPageNum] = useState(1)
  let [pageSize, setPageSize] = useState(10);
  let [callList, setCallList] = useState(false);
  let [cardManagementInfo, setCardManagementInfo] = useState({}); // 页面数据
  let [queryCategoryList, setQueryCategoryList] = useState([]);// 卡券品类列表数据

  //modal数据
  let [modalInfo, setModalInfo] = useState('');

  //modal回调
  const callModal = (flag) => {
    setModalInfo('')
    if(flag) {
      setCallList(!callList)
    }
  }

  useEffect(()=> {
    queryCategory();// 查询已报价form表单卡券品类数据
    getSelectChannelCardAndCardPackage();// 查询列表
  }, [callList])
  // 表单搜索
  let SearchBtn = (val) => {
    setPageNum(1);
    setPageSize(10);
    setCallList(!callList)
  };
  // 表单重置
  let resetBtn = () => {
    form.resetFields();
    setPageNum(1);
    setPageSize(10);
    setCallList(!callList)
  };

  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    setPageNum(page);
    setPageSize(pageSize);
    setCallList(!callList)
  }

  // 查询已报价form表单卡券品类数据
  let queryCategory = () => {
    dispatch({
      type: 'cardManagement/queryCategory',
      payload: {
        method: 'postJSON',
        params: {
          pageNum: 1,
          pageSize: 99999999
        }
      },
      callback: res => {
        if( res.result.code == 0 ){
          setQueryCategoryList(res.body.list);
        }else {
          setQueryCategoryList([]);
        }
      }
    });
  }
  // 查询已报价管理查询列表
  let getSelectChannelCardAndCardPackage = () => {
    let info = form.getFieldValue();
    let query = JSON.parse(JSON.stringify(info));
    query.channelId = JSON.parse(localStorage.getItem('tokenObj')).channelId;
    dispatch({
      type: 'cardManagement/getSelectChannelCardAndCardPackage',
      payload: {
        method: 'postJSON',
        params: {
          pageNum,
          pageSize,
          ...query
        },
      },
      callback: res => {
        if( res.result.code == 0 ){
          setCardManagementInfo(res.body);
        }else {
          setCardManagementInfo({});
        }
      }
    });
  }

  let useThresholdRender = (isUseThreshold, record) => {
    let query = JSON.parse(JSON.stringify(form.getFieldValue()));
    if(query.couponPackageFlag==1) {
      return <span>-</span>
    }else {
      return isUseThreshold ? <span>满{record.useThresholdAmount}元可用</span> : <span>无门槛</span>
    }
  }

  // 已报价卡券列表columns
  let realColumns = [
    {
      title: '编号',
      dataIndex: 'id',
      render: (id, record) => <a onClick={() => { setModalInfo({...record}) }}>{record.couponSkuNo}</a>
    }, {
      title: '名称',
      dataIndex: 'couponSkuName',
    }, { title: '类型',
      dataIndex: 'couponPackageFlag',
      render: (couponPackageFlag, record) => <TypeTags color={couponPackageFlag==0 ? '#2Fb6E4' : '#32D1AD'}>{couponPackageFlag==0 ? '卡券' : '卡包'}</TypeTags>
    }, {
      title: '面值(元)',
      dataIndex: 'faceValue',
      align: 'right',
      render :(faceValue,record) => <MoneyFormat>{faceValue}</MoneyFormat>
    },{
      title: '使用门槛',
      dataIndex: 'isUseThreshold',
      render :(isUseThreshold,record) => useThresholdRender(isUseThreshold, record)
    },{
      title: '卡券品类',
      dataIndex: 'couponCategoryName',
      render:(couponCategoryName,record)=><span>{couponCategoryName||"-"}</span>
    }, {
      title: '供应商',
      dataIndex: 'serviceType',
      render: (serviceType) => <span>{serviceType==1 ? '壹路通' : '第三方'}</span>
    }, {
      title: '领取有效天数',
      dataIndex: 'receiveValidDays',
      render: (receiveValidDays, record) => <span>{receiveValidDays ? receiveValidDays : '不限制'}</span>
    }, {
      title: '使用有效天数',
      dataIndex: 'useValidDays',
      render: (useValidDays, record) => {
        return <>
          {
            useValidDays ?
                record.useValidType==1 ? <span>{`${useValidDays}天`}</span> :
                    record.useValidType==2 ? <span>{`${useValidDays}天`}</span> :
                        record.useValidType==3 ? <span>{`${useValidDays}天`}</span> : <span>{`${useValidDays}天`}</span>
                : <span>不限制</span>
          }
        </>
      }
    }, {
      title: '生效开始时间',
      dataIndex: 'useValidType',
      render: (useValidType, record) => {
        // useValidType	使用有效期从何时计算：1、从实际发放日开始 2、从实际领取率开始 3、投放时配置
        return <span>{useValidType==1 ? '实际发放日开始' : useValidType==2 ? '实际领取日开始' : useValidType==3 ? '投放时配置' : '不限制'}</span>
      }
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: () => <ListTableBtns><LtbItem onClick={() => {history.push('/cardgrantManage/grantList')}}>投放</LtbItem></ListTableBtns>
    },
  ]
  return <>
    <div className={style.filter_box} >
      <QueryFilter className={style.form} form={form}  defaultCollapsed labelWidth={140} onFinish={SearchBtn} onReset={resetBtn}>
        <ProFormText name="couponSkuNo" label='卡券/卡包编号' />
        <ProFormText name="couponSkuName" label='卡券/卡包名称' />
        <ProFormSelect name="couponCategoryType" label="卡券品类"
                       options={ queryCategoryList.map((v)=>{
                         return {value:v.id, label:v.categoryName}
                       })} />
        <ProFormSelect name="couponPackageFlag" label='类型'
                       options={[
                         {value:0, label:'卡券'},
                         {value:1, label:'卡包'},
                       ]} />
      </QueryFilter>
    </div>
    <div className={style.list_box}>
      <ListTitle titleName="结果列表" />
      <ListTable
          showPagination
          current={pageNum}
          pageSize={pageSize}
          total={cardManagementInfo.total}
          onChange={onSizeChange}
      >
        <Table
            pagination={false}
            columns={realColumns}
            dataSource={cardManagementInfo.list}
        />
      </ListTable>
    </div>
    { modalInfo? <ModalBox modalInfo={modalInfo} toFatherValue={(flag)=>callModal(flag)} /> :'' }
  </>
}


export default connect(({ cardManagement }) => ({
}))(cardVoucherManagement)







