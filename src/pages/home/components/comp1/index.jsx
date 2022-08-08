import React from 'react';
import { Button, Input } from 'antd';
import { connect } from 'umi';
import styles from './style.less';

const Comp1 = (props) => {
  const form = { comp1Val: 0 };
  const { comp1Num, dispatch } = props;
  const buttonClick = () => {
    dispatch({
      type: 'setNumber/addNumber',
      payload: form.comp1Val,
    });
  };
  const inputChange = (value) => {
    form.comp1Val = value;
  };
  return (
    <div className={styles.box}>
      <Button onClick={buttonClick}>传值给组件2</Button>
      <Input
        onInput={(event) => {
          inputChange(event.target.value);
        }}
      />
      组件2传来的值：{comp1Num}
    </div>
  );
};

export default connect(({ setNumber }) => ({
  comp1Num: setNumber.comp1Num,
}))(Comp1);
