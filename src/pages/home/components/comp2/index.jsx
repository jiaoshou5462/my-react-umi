import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { connect } from 'umi';

const Comp2 = (props) => {
  const { number, dispatch } = props;
  const [addVal, setAddVal] = useState('1');
  const buttonClick = () => {
    setAddVal((val) => {
      return Number(val) + 1;
    });
  };
  const toComp1 = () => {
    dispatch({
      type: 'setNumber/toComp1',
      payload: addVal,
    });
  };

  return (
    <div>
      <Button type="primary" onClick={buttonClick}>
        +1
      </Button>
      <Button type="danger" onClick={toComp1}>
        传值给组件1
      </Button>
      <Input
        value={addVal}
        onInput={(e) => {
          setAddVal(e.target.value);
        }}
      />
      组件1传来的值：{number}
    </div>
  );
};

export default connect(({ setNumber }) => ({
  number: setNumber.number,
}))(Comp2);
