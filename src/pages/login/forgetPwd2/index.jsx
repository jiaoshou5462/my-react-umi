import {
  InfoCircleFilled,
} from '@ant-design/icons';
import { message, Input, Button, Steps, Form } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import styles from './styles.less';
import { history } from 'umi';
import { reject } from 'lodash';

const { Step } = Steps;
let timer = null;
let timeNum = 0;
const forgetPwd2 = (props) => {
  const { dispatch, } = props;
  let [form] = Form.useForm()
  const [step, setStep] = useState(0);
  const [timeDown, setTimeDown] = useState(0)
  const [formObj, setFormObj] = useState({
    userId: '',
    phone: '',
    authCode: '',
    password: '',
    newPassword: '',
  })
  //跳转登录页
  const toLogin = () => {
    history.replace('/login')
  }

  const startTimeDown = () => {
    timer = setInterval(() => {
      if (timeNum <= 0) {
        clearInterval(timer);
        return;
      }
      setTimeDown(--timeNum)
    }, 1000)
  }

  //提交方法
  const sendCode = () => {
    if (!/^1\d{10}$/.test(formObj.phone)) {
      message.warning({ content: '手机号格式不正确' }); return;
    }
    //防水墙验证
    let bindCaptcha = new window.TencentCaptcha('2090087764', (res) => {
      if (res.ret === 0) {
        let obj = {
          ticket: res.ticket,
          rand: res.randstr
        }
        bindCaptcha.destroy();
        getCode(obj);
      }
    }, {});
    bindCaptcha.show();
  };
  //获取验证码
  const getCode = (obj) => {
    timeNum = 60;
    startTimeDown();
    dispatch({
      type: 'login/sendFindPwdMessage',
      payload: {
        method: 'postJSON',
        params: {
          userId: formObj.userId,
          phone: formObj.phone,
          ...obj
        }
      },
      callback: (res) => {
        if (res.code == 'S000000') {
          message.success({ content: res.message });
        } else {
          message.warning({ content: res.message });
        }
      }
    })
  }

  //第一步
  const handleSubmit1 = () => {
    let _formObj = JSON.parse(JSON.stringify(formObj));
    let values = form.getFieldValue();
    dispatch({
      type: 'login/queryPhone',
      payload: {
        method: 'postJSON',
        params: {
          userId: values.userId
        }
      },
      callback: (res) => {
        if (res.code == 'S000000') {
          _formObj.phone = res.data;
          _formObj.userId = values.userId;
          setFormObj(_formObj);
          setStep(1)
        } else {
          message.error({ content: res.message });
        }
      }
    })
  }

  //第二步 校验验证码
  const handleSubmit2 = () => {
    let values = form.getFieldValue();
    dispatch({
      type: 'login/checkFindPwdMessage',
      payload: {
        method: 'postJSON',
        params: {
          phone: formObj.phone,
          authCode: values.authCode,
        }
      },
      callback: (res) => {
        if (res.code == 'S000000') {
          setStep(2)
        } else {
          message.error({ content: res.message });
        }
      }
    })
  }
  //第三步 修改密码
  const handleSubmit3 = () => {
    let values = form.getFieldValue();
    dispatch({
      type: 'login/updatePassword',
      payload: {
        method: 'postJSON',
        params: {
          password: values.password,
          newPassword: values.newPassword,
          userId: formObj.userId,
        }
      },
      callback: (res) => {
        if (res.code == 'S000000') {
          message.success({ content: '修改成功！' });
          setTimeout(() => {
            toLogin();
          }, 500);
        } else {
          message.error({ content: res.message });
        }
      }
    })
  }

  const domRender = (step) => {
    if (step == 0) {//第一步 输入账号
      return <Form form={form} layout="vertical" colon={false} validateTrigger="onBlur" onFinish={handleSubmit1}>
        <Form.Item label="您要找回的账号" name="userId" rules={[{ required: true, message: "请输入账号!", }]} >
          <Input size="large" placeholder="请输入账号" ></Input>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>下一步</Button>
          <div style={{ color: '#666', marginTop: '10px' }}>忘记账号，请联系您的管理员</div>
        </Form.Item>
      </Form>
    } else if (step == 1) {//第二步 短信验证
      return <Form form={form} layout="vertical" colon={false} validateTrigger="onBlur" onFinish={handleSubmit2}>
        <div className={styles.alert}><InfoCircleFilled className={styles.alert_icon} />为确保为您本人操作，需要验证账号关联的手机号</div>
        <p>验证手机号 <br /> {formObj.phone.replace(/(\d{3}).*(\d{4})/, '$1****$2')} </p>
        <div className={styles.code_box}>
          <Form.Item name="authCode" rules={[{ required: true, message: "请输入验证码!", }]} >
            <Input size="large" placeholder="验证码" ></Input>
          </Form.Item>
          <Button type="primary" size="large" onClick={sendCode} style={{ marginLeft: '15px', flex: '0 0 120px' }}
            disabled={timeDown > 0}>{timeDown > 0 ? `(${timeDown})s` : '获取验证码'}</Button>
        </div>
        <div className={styles.form_block}>
          <Button type="primary" htmlType="submit" size="large" block>完成验证</Button>
        </div>
      </Form>
    } else if (step == 2) {//第三部 重置密码
      return <Form form={form} layout="vertical" autocomplete="off" colon={false} validateTrigger="onBlur" onFinish={handleSubmit3}>
        <div className={styles.alert}><InfoCircleFilled className={styles.alert_icon} />您正在找回账号是：{formObj.userId}</div>
        <Form.Item label="新密码" name="password"
          rules={[
            { required: true, message: "请输入新密码!" },
            { pattern: /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,20}$/, message: '密码格式不正确，请输入6-20位密码，字母+数字' }
          ]} >
          <Input.Password maxLength="20" autocomplete="off"
            size="large" placeholder="请输入6-20位密码，字母+数字" ></Input.Password>
        </Form.Item>
        <Form.Item label="确认密码" name="newPassword"
          rules={[
            { required: true, message: "请输入确认密码!", },
            {
              validator: async (rule, value) => {
                return new Promise((resolve, reject) => {
                  if (value !== form.getFieldValue().password) {
                    reject('两次密码输入不一致')
                  } else {
                    resolve();
                  }
                })
              }
            }
          ]} >
          <Input.Password maxLength="20" autocomplete="off"
            size="large" placeholder="请输入6-20位密码，字母+数字" ></Input.Password>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>保存并重新登录</Button>
        </Form.Item>
      </Form>
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.top}>
        <div className={styles.left}>
          <img src={require('@/assets/login/logo.png')} onClick={toLogin} alt="" />
          <div className={styles.title}>找回密码</div>
        </div>
        <Button type="primary" onClick={toLogin} ghost>直接登录</Button>
      </div>

      <div className={styles.content}>
        <Steps current={step}>
          <Step title="输入账号" />
          <Step title="短信验证" />
          <Step title="重置密码" />
        </Steps>
        <div className={styles.form_box}>
          {domRender(step)}
        </div>
      </div>
    </div>
  );
};

export default connect(({ login, loading }) => ({

}))(forgetPwd2);
