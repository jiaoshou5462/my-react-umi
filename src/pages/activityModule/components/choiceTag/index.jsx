import React, { useState } from 'react';
import { Modal, Button, Checkbox, Row, Col } from 'antd';
import { connect } from 'umi';
import styles from './style.less';

const choiceTag = (props) => {
  let { dispatch } = props;
  let tagArr = ["标签A", "标签B", "标签C", "标签D", "标签E", "标签F", "标签G", "标签H", "标签I"]
  let [isModalVisible, setIsModalVisible] = useState(true);
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    props.toIsTag(false)
  };
  let onChange=()=>{

  }
  return (
    <>
      <Modal title="选择标签" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={600} okText='确定' cancelText="取消" nzDirection='ltr'>
        <div className={styles.wrap_tag}>
          <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
            <Row>
              {tagArr.map((item, key) => {
                return <Col key={key} span={6} className={styles.tag_box1}><Checkbox value={item}>{item}</Checkbox></Col>})
              }
            </Row>
          </Checkbox.Group>
        </div>
        <div className={styles.wrap_footer}>
          已选：标签1；
        </div>
      </Modal>
    </>
  );
};

export default connect(({ }) => ({
}))(choiceTag);
