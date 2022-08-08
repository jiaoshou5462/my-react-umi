import React, { useState, useEffect, useRef, useContext } from 'react';
import { connect, history } from 'umi';
import {
  Row, Form, Input, Table, Select, 
   Modal, message, Button,
} from "antd"
import style from './styles.less';
import {ListTable, } from "@/components/commonComp/index";

const { Option,} = Select;
const {Column, showTotal} = Table;
let allIds = [];//保存翻页后的卡券id
//设置卡券id，防止重复
const setIds=(id,idAdd)=>{
  //在全选的情况下id是数组
  let isArray = id instanceof Array;
  if(idAdd){
    if(isArray){
      allIds.push(...id);
    }else{
      allIds.push(id);
    }
  }else{
    for(let i=0;i<allIds.length;i++){
      if(isArray){
        for(let idItem of id){
          if(idItem==allIds[i]){
            allIds.splice(i,1);
            --i;
            break;
          }
        }
      }else{
        if(id==allIds[i]){
          allIds.splice(i,1);
          --i;
          break;
        }
      }
    }
  }
  return allIds;
}

// 添加卡包弹框
const selCard = (props) => {
  let { dispatch,cardCategorys,skuList,closeModal,sendCardIds,cardIds} = props;
  let [form] = Form.useForm();
  let [pageInfo,setPageInfo] = useState({
    pageNum:1,
    pageSize:10,
  });
  let [total, setTotal] = useState(0);
  let [couponList,setCouponList] = useState([]);
  let [selectedRowKeys,setSelectedRowKeys] = useState([]);

  useEffect(()=>{
    if(!skuList.length){
      dispatch({
        type: 'dataModule_common/selectChannelSku',
        payload: {
          method: 'postJSON',
          params: {}
        }
      })
    }
  },[])

  useEffect(()=>{
    getCouponList();
  },[pageInfo])

  useEffect(()=>{
    allIds = [...cardIds];
    setSelectedRowKeys([...cardIds]);
  },[cardIds])

  const getCouponList=()=>{
    let formObj = form.getFieldsValue();
    dispatch({
      type: 'dataModule_common/selectChannelCoupon',
      payload: {
        method: 'postJSON',
        params: {
          ...pageInfo,
          ...formObj,
          serviceType:1,
        }
      },
      callback:(res)=>{
        if(res && res.list){
          setCouponList(res.list);
          setTotal(res.total);
        }
      }
    })
  }

  //确认按钮
  const handleCouponOk=()=>{
    //传递卡券编号
    sendCardIds(selectedRowKeys);
  }
  //搜索按钮
  const onFinish=()=>{
    getCouponList();
  }
  //分页切换
  const handleTableChange = (pageNum,pageSize) => {
    let _obj = JSON.parse(JSON.stringify(pageInfo));
    _obj.pageNum = pageNum;
    _obj.pageSize = pageSize;
    setPageInfo(_obj);
  }
  const rowSelection = {
    selectedRowKeys,
    onSelect:(record,selectd)=>{
      let _selectedRowKeys = setIds(record.quotationItemId,selectd);
      setSelectedRowKeys([..._selectedRowKeys]);
    },
    onSelectAll:(selectd,selectedRows)=>{
      let list = couponList.map(item=>{
        return item.quotationItemId;
      })
      let _selectedRowKeys = setIds(list,selectd);
      setSelectedRowKeys([..._selectedRowKeys]);
    }
  };
  // 发放类型
  let serviceTypeText = (text, all) => {
    return <>
      {
        text == 1 ? <span>壹路通</span> :
          text == 2 ? <span>第三方</span> :
            ''
      }
    </>
  }

  return (
    <Modal width={1200} title='选择卡券' centered visible={true} onOk={handleCouponOk} onCancel={() => { closeModal() }}>
      <div className={style.selCard_win}>
        <Form form={form} onFinish={onFinish}>
          <div className={style.form_item_box}>
            <Form.Item name="couponSkuName" label="卡券名称" className={style.form_item}>
              <Input placeholder='请输入'></Input>
            </Form.Item>
            <Form.Item label="卡券品类" name="couponCategoryType" className={style.form_item} >
              <Select placeholder="请选择" allowClear>
                {
                  cardCategorys && cardCategorys.map((v) => <Option key={v.id} value={v.id}>{v.categoryName}</Option>)
                }
              </Select>
            </Form.Item>
            <Form.Item label="SKU" name="productNo" className={style.form_item} >
              <Select placeholder="不限" allowClear>
                {
                  skuList.map((v) => <Option key={v.productNo} value={v.productNo}>{v.productName}</Option>)
                }
              </Select>
            </Form.Item>
            <Form.Item className={style.form_item_btn}>
              <Button htmlType="submit" type='primary'>搜索</Button>
            </Form.Item>
          </div>
        </Form>
        <ListTable showPagination current={pageInfo.pageNum} pageSize={pageInfo.pageSize} total={total} style={{padding: 0,}}
        onChange={handleTableChange}>
            <Table pagination={false} dataSource={couponList} scroll={{ y: 500 }} rowKey="quotationItemId"
              rowSelection={{
                type: 'checkbox',
                ...rowSelection,
              }}>
              <Column title="ID" width={70} dataIndex="quotationItemId"/>
              <Column title="卡券编号" width={180} dataIndex="couponSkuNo"/>
              <Column title="卡券名称" dataIndex="couponSkuName"/>
              <Column title="卡券品类" dataIndex="couponCategoryName"/>
              <Column title="面值(元)" width={100} dataIndex="faceValue"/>
              <Column title="领取有效天数" dataIndex="receiveValidDays" render={(receiveValidDays, record) => {
                return <>
                  {
                    receiveValidDays ? <span>{receiveValidDays}</span> : <span>不限制</span>
                  }
                </>
              }}/>
              <Column title="使用有效天数" dataIndex="useValidDays" render={(useValidDays, record) => {
                // useValidType	使用有效期从何时计算：1、从实际发放日开始 2、从实际领取率开始 3、投放时配置
                return <>
                  {
                    useValidDays!=null ?  
                    record.useValidType==1 ? <span>{`${useValidDays}天(发放后立即生效)`}</span> : 
                    record.useValidType==2 ? <span>{`${useValidDays}天(领取后立即生效)`}</span> : 
                    record.useValidType==3 ? <span>{`${useValidDays}天`}</span> : <span>{`${useValidDays}天`}</span>
                    :
                    <span>不限制</span>
                  }
                </>
              }} />
              <Column title="供应商" dataIndex="serviceType" 
              render={(text, all) => serviceTypeText(text, all)} />
            </Table>
        </ListTable>
      </div>
    </Modal>
  )

}


export default connect(({ dataModule_common }) => ({
  cardCategorys: dataModule_common.cardCategorys,
  skuList: dataModule_common.skuList,
}))(selCard)