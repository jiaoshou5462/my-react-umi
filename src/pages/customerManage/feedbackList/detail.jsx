
import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import { Row, Col, Space, Table, Button, message, Modal, Input, Image } from "antd"
import style from "./detailStyle.less";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { parseToThousandth } from '@/utils/date';
const { TextArea } = Input;

// 反馈详情
const feedbackDetail = (props) => {
  let { dispatch, feedBackDetailObj } = props;
  // 登录成功返回的数据
  const currentUser = localStorage.getItem('tokenObj') ? JSON.parse(localStorage.getItem('tokenObj')) : {};

  let [isBackModal, setIsBackModal] = useState(false);  //返回弹框
  let [isSubmitModal, setIsSubmitModal] = useState(false);  //提交弹框

  useEffect(() => {
    getOpinionFeedBackDetail();
  }, [])

  //详情信息查询
  let getOpinionFeedBackDetail = () => {
    dispatch({
      type: 'customerFeedbackManage/getOpinionFeedBackDetail',
      payload: {
        method: 'get',
        params: {},
        objectId: history.location.query.objectId
      }
    })
  }

  let [replyContent, setReplyContent] = useState('');
  let replyContentChange = (e) => {
    setReplyContent(e.target.value)
  }
  let handleSummit = () => {
    if (replyContent.match(/^\s*$/)) {
      message.warning('请输入回复内容！')
    } else {
      setIsSubmitModal(true)
    }
  }
  // 确认提交
  let summitOk = () => {

    dispatch({
      type: 'customerFeedbackManage/getAddOpinionFeedBackReply',
      payload: {
        method: 'postJSON',
        params: {
          objectId: history.location.query.objectId,
          replyContent: replyContent
        }
      },
      callback: (res) => {
        console.log(res, 'res')
        if (res.result.code == '0') {
          message.success('提交成功');
          setIsSubmitModal(false);
          history.push({
            pathname: '/customerManage/feedbackList',
          })
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  return (
    <>
      <div className={style.block__cont}>
        <div className={style.block__header}>
          <div className={style.block__header_h}>反馈详情页</div>
        </div>
        <div className={style.form__cont}>

          <div className={style.form__cont}>
            <Row justify="space-around">
              <Col className={style.form__item} span={6}>
                <div>姓名</div>
                <p>{feedBackDetailObj.name}</p>
              </Col>
              <Col className={style.form__item} span={6}>
                <div>身份证号</div>
                <p>{feedBackDetailObj.idNo}</p>
              </Col>
              <Col className={style.form__item} span={6}>
                <div>手机号</div>
                <p>{feedBackDetailObj.mobilePhoneReal}</p>
              </Col>
              <Col className={style.form__item} span={6}>
                <div>创建时间</div>
                <p>{feedBackDetailObj.createTime}</p>
              </Col>
            </Row>
          </div>
          <h3>反馈内容</h3>
          <div className={style.form__cont}>
            <Row justify="space-around">
              <Col className={style.form__item} span={24}>
                <p>{feedBackDetailObj.feedbackContent}</p>
              </Col>
              <Col className={style.form__item} span={24}>
              <Image.PreviewGroup>
                {
                  feedBackDetailObj.imageUrl && feedBackDetailObj.imageUrl.map((item) => <Image className={style.form_wrap_img} src={item} style={{ width: '100px', height: '100px' }} />)
                }
                </Image.PreviewGroup>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <div className={style.block__cont}>
        {
          history.location.query.readOnly == false || history.location.query.readOnly == 'false' ?
            <div className={style.form__cont}>
              <h3>回复内容</h3>
              <TextArea placeholder="请输入回复内容" showCount maxLength={1000} onChange={replyContentChange}></TextArea>
              <div className={style.form_tools}>
                <Button onClick={() => { setIsBackModal(true) }}>返回</Button>
                <Button type="primary" onClick={handleSummit}>提交</Button>
              </div>
            </div> :
            <div className={style.form__cont}>
              <h3>回复内容</h3>
              <div>{feedBackDetailObj.replyContent}</div>
              <div className={style.form_tools}>
                <Button onClick={() => { history.goBack() }}>返回</Button>
              </div>
            </div>
        }
      </div>
      <Modal title='返回' visible={isBackModal} onOk={() => { history.goBack() }} onCancel={() => { setIsBackModal(false) }}>
        <div style={{ textAlign: 'center' }}>
          <h3>确认返回吗？</h3>
          <p>注：返回后回复内容不做保存。</p>
        </div>
      </Modal>
      <Modal title='提交' visible={isSubmitModal} onOk={summitOk} onCancel={() => { setIsSubmitModal(false) }}>
        <div style={{ textAlign: 'center' }}>
          <h3>请确认是否提交？</h3>
          <p>注：提交成功后回复内容奖呈现给用户</p>
        </div>
      </Modal>
    </>
  )
};
export default connect(({ customerFeedbackManage }) => ({
  feedBackDetailObj: customerFeedbackManage.feedBackDetailObj
}))(feedbackDetail)
