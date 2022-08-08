import React,{useState,useForm} from 'react';
import { connect,Helmet,history } from 'umi';
import styles from './ResetPwd.less';
import {Form,Input,Button,Row,message} from "antd";

const ResetPwd = (props) => {
  let {dispatch} =  props;
  let [passInfo, setPassInfo] = useState({
    oldPassword: "",
    newPassword: "",
  })
  let [form] = Form.useForm();

  const changePwd = ()=>{
    let obj = form.getFieldValue();
    let tokenObj = localStorage.getItem("tokenObj") ? JSON.parse(localStorage.getItem("tokenObj")) : {};
    dispatch({
      type: 'login/passwordInit',
      payload: {
        method: 'postJSON',
        params: {
          newPassword: obj.newPassword,
          confirmNewPassword: obj.confirmNewPassword,
          tokenVo:{
            accessToken: tokenObj.accessToken,
            refreshToken: tokenObj.refreshToken,
          }
        }
      },
      callback:(res)=>{
        if(res.result && res.result.code==='0'){
          dispatch({
            type: 'login/logout',
            payload: {
              method: 'delete'
            },
          });
        } else {
          message.error(res.result.message)
        }
      }
    })
  }


  return (
    <div className={styles.container}>
      <Form form={form} onFinish={changePwd}>
        <Form.Item label="新密码" name="newPassword" labelCol={{flex:'0 0 100px'}}
        rules={[{ required: true, message: '新密码不能为空' }]}>
          <Input.Password type="password"  placeholder="请输入" maxLength="20" />
        </Form.Item>
        <Form.Item label="确认密码" name="confirmNewPassword" labelCol={{flex:'0 0 100px'}}
        rules={[{ required: true, message: '确认密码不能为空' }]}>
          <Input.Password type="password"  placeholder="请输入"  maxLength="20" />
        </Form.Item>
        <Row justify="end">
          <Button type="primary" htmlType="submit" >确认修改</Button>
        </Row>
      </Form>
    </div>
  );
};
export default connect(({ settings }) => ({
  ...settings
}))(ResetPwd);
