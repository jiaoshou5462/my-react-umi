import { message, Input, Button, Form } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import styles from './styles.less';;
let timer = null;
let timeNum = 0;
const forgetPwd = (props) => {
  const { dispatch, } = props;
  let [form] = Form.useForm();
  const [timeDown, setTimeDown] = useState(0);
  //校验账户
  const [isProving, setIsProving] = useState(false);
  //是否获取过验证码
  const [isCode, setIsCode] = useState(false);
  //校验验证码
  const [isCodeing, setIsCodeing] = useState(false);

  const suffix = (
    <CheckCircleOutlined
      style={{
        fontSize: 16,
        color: '#32D1AD',
      }}
    />
  );
  //跳转登录页
  const toLogin = () => {
    history.replace('/login')
  }
  //校验验证码
  let provCode = (e) => {
    if (isCode && e.target.value) {
      handleSubmit2();
    }
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
    let formObj = form.getFieldValue();
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
  useEffect(() => {
    form.setFieldsValue({
      userId: '',
      phone: '',
      authCode: '',
      password: '',
      newPassword: '',
    })
  }, [])

  //校验账号
  let getProving = () => {
    let values = form.getFieldValue();
    if (values.userId) {
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
            values.phone = res.data;
            console.log(values)
            form.setFieldsValue({ ...values });
            setIsProving(true);
          } else {
            message.error({ content: res.message });
          }
        }
      })
    } else {
      message.error({ content: '请输入账号' });
    }
  }
  //获取验证码
  const getCode = (obj) => {
    let formObj = form.getFieldValue();
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
          setIsCode(true)
        } else {
          message.warning({ content: res.message });
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
          phone: values.phone,
          authCode: values.authCode,
        }
      },
      callback: (res) => {
        if (res.code == 'S000000') {
          setIsCodeing(true)
        } else {
          message.error({ content: res.message });
        }
      }
    })
  }

  //保存并重新登录
  const handleSubmit = () => {
    let values = form.getFieldValue();
    dispatch({
      type: 'login/updatePassword',
      payload: {
        method: 'postJSON',
        params: {
          password: values.password,
          newPassword: values.newPassword,
          userId: values.userId,
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

  return (
    <div className={styles.main}>
      <div className={styles.top}>
        <div className={styles.left}>
          <img src={require('@/assets/login/logo.png')} onClick={toLogin} alt="" />
          <div className={styles.title}>找回密码</div>
        </div>
      </div>

      <div className={styles.content}>
        <Form form={form} onFinish={handleSubmit} className={styles.content_wrap}>
          <h2 className={styles.wrap_notop}>输入账号</h2>
          <div className={styles.wrap_pn}>
            <Form.Item className={styles.wrap_pn_lf} name="userId" rules={[{ required: true, message: "", }]} >
              <Input placeholder="请输入您要找回的账号" ></Input>
            </Form.Item>
            <Button type="primary" className={styles.wrap_pn_rg} onClick={getProving}>验证</Button>
          </div>
          <p className={styles.wrap_p1}>如忘记账号，请联系您的管理员</p>

          <h2>验证手机号</h2>
          <Form.Item name="phone">
            <Input placeholder="验证后自动获取" disabled></Input>
          </Form.Item>

          <h2>验证码</h2>
          <div className={styles.wrap_pn}>
            <Form.Item className={styles.wrap_pn_lf2} onBlur={provCode} name="authCode" rules={[{ required: true, message: "请输入验证码!" }]} >
              <Input placeholder="请输入验证码" disabled={!isProving} suffix={isCodeing ? suffix : null}></Input>
            </Form.Item>
            <Button type="primary" onClick={sendCode} className={styles.wrap_pn_rg2} disabled={timeDown > 0 || !isProving}>{timeDown > 0 ? `重新获取(${timeDown}s)` : '获取验证码'}</Button>
          </div>

          <h2>新密码</h2>
          <Form.Item name="password"
            rules={[
              { required: true, message: "请输入新密码!" },
              { pattern: /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,20}$/, message: '密码格式不正确，请输入6-20位密码，字母+数字' }
            ]} >
            <Input.Password maxLength="20" disabled={!isCodeing} autocomplete="off" placeholder="请输入6-20位密码，字母+数字" ></Input.Password>
          </Form.Item>
          <h2>确认密码</h2>
          <Form.Item name="newPassword"
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
            <Input.Password maxLength="20" autocomplete="off" disabled={!isCodeing} placeholder="请输入6-20位密码，字母+数字" ></Input.Password>
          </Form.Item>
          <div className={styles.wrap_btn}>
            <Button className={styles.wrap_btn1} onClick={toLogin}>取消</Button>
            <Button className={styles.wrap_btn2} disabled={!isCodeing} type="primary" htmlType="submit">保存并重新登录</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default connect(({ login, loading }) => ({

}))(forgetPwd);
