import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import { connect } from 'umi';
import styles from './style.less';
const { Search } = Input;

const choiceCrowd = (props) => {
  let { dispatch } = props;
  let [isModalVisible, setIsModalVisible] = useState(true);
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    props.toIsChoie(false)
  };
  const onSearch = value => {
    // console.log(value)
  };
  return (
    <>
      <Modal title="选择人群" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={600} okText='确定' cancelText="取消" nzDirection='ltr'>
        <div className={styles.wrap_search}>
          <Search placeholder="请输入人群名称" allowClear enterButton="搜索" size="large" onSearch={onSearch} />
        </div>
        <div className={styles.wrap_tag}>
          <span><b>有孩一族</b><i>17,899人</i></span>
          <span><b>有孩一族</b><i>17,899人</i></span>
          <span><b>有孩一族</b><i>17,899人</i></span>
          <span><b>有孩一族</b><i>17,899人</i></span>
        </div>
        <div className={styles.wrap_footer}>
        已选：有孩一族；汽车发烧友；人脉广的人
        </div>
      </Modal>
    </>
  );
};

export default connect(({ }) => ({
}))(choiceCrowd);
