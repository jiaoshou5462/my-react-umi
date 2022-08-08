import React, { useEffect, useState } from "react";
import { connect, history } from 'umi';
import { Table, Tag, Space, Pagination, ConfigProvider,message } from 'antd';
import style from "./style.less";
import locale from 'antd/lib/date-picker/locale/zh_CN';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
const carInformation = (props) => {
  let customerId = history.location.query.customerId
  let { dispatch } = props,
      // [pageNo, setPageNo] = useState(0),
      // [pageSize, setPageSize] = useState(10),
      // [pageTotal, setPageTotal] = useState(0),
      [listData, setListData] = useState([])
   
  const columns = [
    {
      title: '序号',
      dataIndex: '',
      key: '',
       render: (text,record,index) => <span>{index+1}</span>,
    },
    {
      title: '车牌号',
      dataIndex: 'carPlateNo',
      key: 'carPlateNo',
    },
    {
      title: '车型品牌',
      dataIndex: 'carBrandName',
      key: 'carBrandName',
    },
    {
      title: '车型',
      key: 'carModelName',
      dataIndex: 'carModelName',
    },
    {
      title: '车架号',
      dataIndex: 'carVinNo',
      key: 'carVinNo',
    },
    {
      title: '发动机号',
      dataIndex: 'carEngineNo',
      key: 'carEngineNo',
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      key: 'createTime',
    }
      
  ];
  useEffect(() => {
    if(customerId) {
      getCarList()
    }
  },[customerId])
  /* 获取车俩列表信息 */

  let getCarList = () => {
    dispatch({
      type: 'customerListDetail/getCustomerCars',
      payload: {
        method: 'post',
        params:{
          customerId:customerId
        }
      },
      callback: (res) => {
        if( res.result.code === '0' ) {
          setListData (res.body);
        }else {
          message.error(res.result.message)
        } 
      }
    })
  }

  // /* 更改页码 */
  // let onNextChange = () => {

  // } 
  // /* 更改以页显示数量 */
  // let onSizeChange = () => {

  // } 
  // let onPageTotal = (total, range) => {
  //   let totalPage = Math.ceil(total / pageSize)
  //   return `共${total}条记录 第 ${pageNo} / ${totalPage}  页`
  // }
  return (
    <>
      <Table columns={columns} dataSource={listData} pagination={false}/>
      {/* <ConfigProvider locale={zh_CN}>
          <Pagination
            className={style.pagination}
            showQuickJumper
            showTitle={false}
            current={pageNo}
            defaultPageSize={pageSize}
            total={pageTotal}
            onChange={onNextChange}
            pageSizeOptions={['10', '20', '30', '60']}
            onShowSizeChange={onSizeChange}
            showTotal={onPageTotal}
          />
        </ConfigProvider> */}
    </>
  )
};
export default connect(({ customerListDetail }) => ({
}))(carInformation)
