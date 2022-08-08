import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';


class AvatarDropdown extends React.Component {
  onMenuClick = (event) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'login/logout',
          payload: {
            method: 'delete'
          },
        });
      }
    }
    if(key === 'changePwd'){
      history.push('/personalCenter/changePassword');
    }
    if(key === 'messageCenter'){
      history.push('/messageManage/msgCenter');
    }
  };
  
  render() {
    const {
      menu,
    } = this.props;
    const tokenObj = localStorage.getItem('tokenObj') ? JSON.parse(localStorage.getItem('tokenObj')) : {};
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <div className={styles.channelName}>
          <div className={styles.face}>{tokenObj.userName.substr(0,1)}</div>
          <div className={styles.info}>
            <p>{tokenObj.userName}</p>
          </div>
        </div>
        <Menu.Item key="changePwd" style={{'text-align': 'center'}}>
          修改密码
        </Menu.Item>
        <Menu.Item key="messageCenter" style={{'text-align': 'center'}}>
          消息中心
        </Menu.Item>
        <Menu.Item key="logout" style={{'text-align': 'center'}}>
          退出登录
        </Menu.Item>
      </Menu>
    );
    return <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          {/* <Avatar size="small" className={styles.avatar} src={tokenObj.avatar} alt="avatar" /> */}
          <div className={styles.avatar}>{tokenObj.userName.substr(0,1)}</div>
          {/* <span className={`${styles.name} anticon`}>{tokenObj.userName}</span> */}
        </span>
      </HeaderDropdown>
  }
}

export default connect(({ setTagPanel }) => ({
  // tokenObj: setTagPanel.userInfo,
}))(AvatarDropdown);
