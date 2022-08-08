import React, { useEffect, useState, } from "react"
import { connect, history } from 'umi'
import { Button, Table, Pagination } from "antd"
import style from "./style.less";
import { } from '@ant-design/icons';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
let detailAccountPage = (props) => {
  let { dispatch, location } = props;
  let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));   //基础配置信息

  useEffect(() => {

  }, []);


  return (
    <>
      <div className={style.block__cont}>

      </div>
    </>
  )
};
export default connect(({ pointAccount, taskManages }) => ({
}))(detailAccountPage)
