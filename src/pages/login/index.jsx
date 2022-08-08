import {
  LockTwoTone,
  UserOutlined,

} from '@ant-design/icons';
import { Alert,notification, Form,Input,Button,Checkbox,Modal } from 'antd';
import React, { useState,useEffect } from 'react';
import { connect } from 'umi';
import styles from './styles.less';
import { history } from 'umi';
import logo from '@/assets/login/logo.png';
import leftBg from '@/assets/login/left_bg.png';
import leftWord from '@/assets/login/left_word.png';
import leftImg from '@/assets/login/left_img.png';

let currentYear = new Date().getFullYear();
const Login = (props) => {
  const { userLogin = {},dispatch,roleData,jumpPage,refreshLoginPage } = props;
  let [form] = Form.useForm()
  
  
  
  //提交方法
  const handleSubmit = () => {
    
    //防水墙验证
    let bindCaptcha = new window.TencentCaptcha('2090087764', (res) => {
      if (res.ret === 0) {
        let obj = {
          ticket: res.ticket,
          rand: res.randstr
        }
        bindCaptcha.destroy();
        loginRequest(obj);
      }
    },{});
    bindCaptcha.show();
  };

  const loginRequest = (obj)=>{
    let values = form.getFieldValue();
    dispatch({
      type: 'login/login',
      payload: {
        method: 'postJSON',
        params: {
          ...values,
          ...obj,
        }
      },
      callback:(res)=>{
        console.log(res)
        dispatch({
          type: 'login/getRoleData',
          payload: {
            method: 'get',
            params: {}
          },
          jumpPage:true,//跳转到第一个路由
          callback:(res)=>{
            if(!res.menuInfo || !res.menuInfo.length){
              notification.error({
                message: '提示',
                description: '无权限',
              });
            }
          }
        });
      }
    });
  }

  //跳转第一个页面
  useEffect(() => {
    //jumpPage 允许跳转开关
    if(roleData.length && jumpPage){
      let toPage = '';
      let setTop = false;
      for(let item of window._user_menuList){
        if(!setTop){//只执行一次
          localStorage.setItem('carowner_admin_top_path',item.path);
          setTop = true;
        }
        if(item.isPage){//找到第一个页面
          toPage = item.path;
          break;
        }
      }
      //允许跳转开关 关闭
      dispatch({
        type: 'login/setJumpPage',
        payload: false,
      });
      if(toPage){//跳第一个页面
        history.push(toPage);
      }else{
        history.push('/home');
      }
    }
  }, [roleData]);

  const forgetPwdClick = ()=>{
    history.push('/forgetPwd');
  }

  return (
    <div className={styles.container}>
      <div className={styles.left} style={{backgroundImage: `url(${leftBg})`}}>
        <img src={leftWord} className={styles.left_word} />
        <img src={leftImg} className={styles.left_img} />
      </div>
      <div className={styles.content_box}>
        <div className={styles.logo}>
          <img src={logo} alt="" />
        </div>
        <div className={styles.input_box}>
          <div className={styles.info}>数字营销和服务管理平台</div>
          <div className={styles.content}>
            <div className={styles.main}>
              <Form className={styles.form} form={form} onFinish={handleSubmit}>
                <Form.Item className={styles.form_item} name="userId" rules={[{ required: true,message: "请输入账号!" }]} >
                  <Input className={styles.form_input} placeholder="请输入账号" ></Input>
                </Form.Item>
                <Form.Item className={styles.form_item} name="password" rules={[{ required: true,message: "请输入密码!" }]} >
                  <Input.Password className={styles.form_input} visibilityToggle={false} placeholder="请输入密码" htmlType="password" ></Input.Password>
                </Form.Item>
                <div className={styles.forget_pwd}>
                  {/* <Checkbox style={{color:'#999'}} checked={checkPwd} onChange={(e)=>{setCheckPwd(e.target.checked)}}>记住密码</Checkbox> */}
                  <div onClick={forgetPwdClick}>忘记密码</div>
                </div>
                <Form.Item className={styles.form_item}>
                  <Button type="primary" htmlType="submit" className={styles.form_btn}>登录</Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
        <div className={styles.beian}>
          {`© 2015-${currentYear}上海路天信息科技有限公司`} <br />
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">沪ICP备2020030376号-3</a>
        </div>
      </div>
    </div>
    
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  roleData: login.roleData,
  jumpPage: login.jumpPage,
  refreshLoginPage: login.refreshLoginPage,
}))(Login);
