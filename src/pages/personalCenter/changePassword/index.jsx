import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Input, Button, message } from 'antd';
import style from "./style.less";

const changePasswordPage = (props) => {
  let { dispatch } = props;
  let [passInfo, setPassInfo] = useState({
    confirmNewPassword: "",
    newPassword: "",
    oldPassword: ""
  })
  //change输入框
  let changePassInput = (name, e) => {
    let topassInfo = { ...passInfo };
    topassInfo[name] = e.target.value;
    setPassInfo(topassInfo);
  }
  //确认修改
  let changPass = () => {
    if (!passInfo.oldPassword) {
      message.error('请输入原始密码');
      return false;
    }
    if (passInfo.newPassword.length < 6) {
      message.error('新密码格式有误！');
      return false;
    }
    if (passInfo.confirmNewPassword != passInfo.newPassword) {
      message.error('新密码与确认密码不一致！');
      return false;
    } else {
      channelUserpPassword();
    }
  }

  useEffect(() => {
  }, [])
  //返回登录页
  let goLogout = () => {
    if (dispatch) {
      dispatch({
        type: 'login/logout',
        payload: {
          method: 'delete'
        },
      });
    }
  }
  //确认提交
  let channelUserpPassword = (info) => {
    let tokenObj = localStorage.getItem("tokenObj") ? JSON.parse(localStorage.getItem("tokenObj")) : {};
    let params = passInfo;
    params.tokenVo = {
      accessToken: tokenObj.accessToken || '',
      refreshToken: tokenObj.refreshToken || ''
    }
    dispatch({
      type: 'changePassword/channelUserpPassword',
      payload: {
        method: 'postJSON',
        params: params,
      }, callback: (res) => {
        console.log(res)
        if (res.result.code === '0') {
          message.success("修改密码成功！")
          setTimeout(() => {
            goLogout();
          }, 1200);
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  return (
    <>
      <div className={style.block__cont}>
        <div className={style.block__header}>修改密码</div>
        <div className={style.wrap_centent}>
          <div className={style.wrap_pass}>
            <strong>原始密码：</strong>
            <Input.Password className={style.wrap_pass_put} onChange={(e) => { changePassInput('oldPassword', e) }} placeholder="请输入原始密码" value={passInfo.oldPassword} maxLength="20" />
          </div>
          <div className={style.wrap_pass}>
            <strong>新密码：</strong>
            <Input.Password className={style.wrap_pass_put} onChange={(e) => { changePassInput('newPassword', e) }} placeholder="请输入6-20位密码，字母+数字" value={passInfo.newPassword} maxLength="20" />
          </div>
          <div className={style.wrap_pass}>
            <strong>确认密码：</strong>
            <Input.Password className={style.wrap_pass_put} onChange={(e) => { changePassInput('confirmNewPassword', e) }} placeholder="请输入6-20位密码，字母+数字" value={passInfo.confirmNewPassword} maxLength="20" />
          </div>
          <div className={style.wrap_btn}>
            <Button type="primary" onClick={changPass}>确认修改</Button>
          </div>
        </div>
      </div>
    </>
  )
}


export default connect(({ changePassword }) => ({

}))(changePasswordPage)







