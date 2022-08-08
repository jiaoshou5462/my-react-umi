//选择方式
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import { Row, Col, Form, Select, Input, Button, Tree, Modal, Tooltip, Steps, message } from 'antd';
import img1 from '@/assets/illustration1.png'
const selectCreate = (props) => {
  const { dispatch } = props;
  //自定义
  const customClick = () => {
    dispatch({
      type: 'setTagPanel/isCustomFlag',
      payload: true,
    });
    dispatch({
      type: 'setTagPanel/num',
      payload: 1,
    });
  };
  //导入
  const exportClick = () => {
    dispatch({
      type: 'setTagPanel/isCustomFlag',
      payload: false,
    });
    dispatch({
      type: 'setTagPanel/num',
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
        <div className={style.content_left} onClick={customClick}>
          <div className={style.title}>自定义标签</div>
          <div className={style.des}>自定义每个标签值的名称及计算规则，将人群划分成多个分层。</div>
        </div>
        <div className={style.content_right} onClick={exportClick}>
          <div className={style.title}>导入指定名单</div>
          <div className={style.des}>导入指定用户的名单，并对此固定人群打上需要的标签。</div>
        </div>
      </div>
      <div className={style.illustration}>
        <img src={img1} alt=""/>
      </div>
    </div>
  )
}
export default connect(({ setTagPanel }) => ({

}))(selectCreate);