//选择方式
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import { Row, Col, Form, Select, Input, Button, Tree, Modal, Tooltip, Steps, message } from 'antd';
import img1 from '@/assets/illustration2.png'
const selectCreate = (props) => {
  const { dispatch } = props;
  //自定义
  const customClick = () => {
    dispatch({
      type: 'setGroupList/isCustomFlag',
      payload: 'custom',
    });
    dispatch({
      type: 'setGroupList/num',
      payload: 1,
    });
  };
  const tagClick=()=>{
    dispatch({
      type: 'setGroupList/isCustomFlag',
      payload: 'tag',
    });
    dispatch({
      type: 'setGroupList/num',
      payload: 1,
    });
  }
  //导入
  const exportClick = () => {
    dispatch({
      type: 'setGroupList/isCustomFlag',
      payload: 'import',
    });
    dispatch({
      type: 'setGroupList/num',
      payload: 1,
    });
  };

  useEffect(() => {

  }, []);
  return (
    <div>
      <div className={style.img_header}>
        {/* <img src="" alt="" srcset="" /> */}
      </div>
      <div className={style.content_footer}>
        <div className={style.content_right} onClick={exportClick}>
          <div className={style.title}>导入指定名单</div>
          <div className={style.des}>导入指定用户的名单，并对此固定人群的名称以及计算规则。</div>
        </div>
        <div className={style.content_left} onClick={tagClick}>
          <div className={style.title}>标签人群</div>
          <div className={style.des}>使用既有标签(系统标签或自定义标签)创建群组，筛选出符合条件的用户</div>
        </div>
        <div className={style.content_left} onClick={customClick}>
          <div className={style.title}>自定义人群</div>
          <div className={style.des}>自定义每个用户群的名称以及计算规则。</div>
        </div>
      </div>
      <div className={style.illustration}>
        <img src={img1} alt=""/>
      </div>
    </div>
  )
}
export default connect(({ setGroupList }) => ({

}))(selectCreate);