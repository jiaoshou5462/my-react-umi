//用户画像管理
import React, { useEffect } from 'react';
import { connect } from 'umi';
import styles from './styles.less';

const PortrayalList = (props) => {
  const { dispatch } = props;
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);
  return (
    <div className={styles.contentBox}>
      用户画像管理
    </div>
  )
}
export default connect(({ loading }) => ({
  loading: loading.effects['user/fetchCurrent'],
}))(PortrayalList);