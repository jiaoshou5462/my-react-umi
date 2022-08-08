// import { Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import { Tooltip, Dropdown, Modal } from 'antd';
import { BellOutlined,ExpandOutlined,SwitcherOutlined } from '@ant-design/icons';


const GlobalHeaderRight = (props) => {
  const { dispatch, theme, layout, msgList, msgCount } = props;
  let className = styles.right;
  const [dropShow, setDropShow] = useState(false);
  const [modalShow, setModalShow] = useState(false)
  const [currentMeg, setCurrentMeg] = useState({});
  const [isFullScreen,setIsFullScreen] = useState(false);

  // 消息轮询 
  let loopTime = process.env.REACT_APP_ENV == 'prod' ? 1000 * 60 : 1000 * 15;
  const loopMessage = () => {
    let noLoop = localStorage.getItem('no_message_loop_dev');
    if(process.env.REACT_APP_ENV != 'prod' && noLoop){
      return;
    }
    setInterval(() => {
      getList();
      getMsgCount();
    }, loopTime)
  }

  //获取消息列表
  const getList = () => {
    dispatch({
      type: 'login/messageSelectPage',
      payload: {
        method: 'postJSON',
        params: {
          pageNum: 1,
          pageSize: 10,
        },
        loading: false,
      },
    })
  }
  //设置消息状态 不传id为全部已读
  const setReadStatus = (item) => {
    let params = item ? { id: item.id } : null;
    dispatch({
      type: 'login/readMessage',
      payload: {
        method: 'postJSON',
        params: params,
        loading: false,
      },
      callback: () => {
        getList();
        getMsgCount();
      }
    })
  }
  //获取消息未读数量
  const getMsgCount = () => {
    dispatch({
      type: 'login/getCountMessageChannel',
      payload: {
        method: 'postJSON',
        params: {
          msgStatus: 1,
        },
        loading: false,
      },
    })
  }
  useEffect(() => {
    getList();
    getMsgCount();
    loopMessage();
  }, [])
  //全部已读
  const readAll = () => {
    if (msgCount > 0) {
      setReadStatus();
    }
  }
  //阅读消息
  const readMsg = (item) => {
    if (item.msgStatus === 1) {
      setReadStatus(item);
    }
    setCurrentMeg(item);
    setModalShow(true);
  }
  const textContent = (html) => {
    return html ? html.replace(/<[^>]*>/g, '') : '';
  }
  const timeReplace = (time) => {
    return time ? time.replace(/(\d{4})-(\d{2})-(\d{2})(.{6})(.*)/, '$2/$3$4') : '';
  }
  //显示全部
  const showMore = () => {
    setDropShow(false);
    history.push('/messageManage/msgCenter');
  }
  const screenFull=()=>{
    setIsFullScreen(!isFullScreen);
  }
  const dropMeun = () => {
    return <div className={styles.message_drop}>
      <div className={styles.top}>
        <div className={styles.top_left}><BellOutlined />消息</div>
        <a onClick={readAll}>全部已读</a>
      </div>
      <div className={styles.list}>
        {
          msgList.map((item, index) => {
            return  <div className={styles.item} onClick={() => readMsg(item, index)}>
              <div className={styles.item_left}>
                <img src="https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/images/carowner-admin/icons/msg_icon1.png" alt="" />
                {item.msgStatus === 1 ? <span></span> : ''}
              </div>
              <div className={styles.item_right}>
                <div className={styles.title}>{item.title}</div>
                <div className={styles.time}>{timeReplace(item.createTime)}</div>
                <div className={styles.content}>{textContent(item.contentHtml)}</div>
              </div>
            </div>
          })
        }
      </div>
      <div className={styles.bottom} onClick={showMore}>查看更多消息</div>
      {/* motal挂在到当前节点，点击弹窗时 消息下拉框不会隐藏 */}
      <Modal title={"消息详情"} width={isFullScreen?'100%':1200} getContainer={false} 
      style={{top: isFullScreen ? '8px':'100px',paddingBottom: 0}}
      bodyStyle={{height: isFullScreen?'calc(100vh - 70px)':'calc(100vh - 270px)'}}
        visible={modalShow} onCancel={() => setModalShow(false)} afterClose={() => setIsFullScreen(false)} footer={false}>
        <div className={styles.msg_box}>
          <div className={styles.msg_title}>{currentMeg.title}</div>
          <div className={styles.msg_content}
          dangerouslySetInnerHTML={{ __html: currentMeg.contentHtml }}></div>
          <div className={styles.msg_bottom}>
            <span>壹路通团队</span>
            <p>{timeReplace(currentMeg.createTime)}</p>
          </div>
        </div>
        <div className={styles.fullScreen} onClick={screenFull}>{isFullScreen?<SwitcherOutlined />:<ExpandOutlined />}</div>
      </Modal>
    </div>;
  }

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }
  const toHelp = () => {
    window.open('https://km.ylt.zone/pages/viewpage.action?pageId=12781927#');
  }
  const tokenObj = localStorage.getItem('tokenObj') ? JSON.parse(localStorage.getItem('tokenObj')) : {};
  return (
    <div className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        {...props}
      />
      <div className={`message-bell-posi ${styles.message_center}`}>
        <Dropdown trigger="click" overlay={dropMeun} placement="bottomCenter"
          onVisibleChange={setDropShow} getPopupContainer={() => document.querySelector('.message-bell-posi')}
          visible={dropShow} >
          <div className={styles.bellClick}>
            <BellOutlined style={{color:'#595959'}}/>
            {msgCount > 0 ? <div className={styles.msgCount}>{msgCount}</div> : ''}
          </div>
        </Dropdown>
      </div>
      <div className={styles.question} >
        <Tooltip placement="bottom" className={styles.question_icon} title='知识管理'>
          <img src="https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/images/carowner-admin/icons/question.png" onClick={toHelp} />
        </Tooltip>
      </div>
      <div className={styles.split_line}><span></span></div>
      <div className={styles.userName}>{tokenObj.channelName}</div>
      <Avatar />
    </div>
  );
};

export default connect(({ settings, login }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  msgList: login.msgList,
  msgCount: login.msgCount,
}))(GlobalHeaderRight);
