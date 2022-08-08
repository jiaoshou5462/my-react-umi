import React, { useEffect, useState } from 'react';
import reactCSS from 'reactcss';
import { Button } from 'antd';
import style from './style.less';
import { SketchPicker } from 'react-color'

const SketchExample = (props) => {
  let [color, setColor] = useState(props.colors)
  let [intColor, setIntColor] = useState('');
  let [detailStatus, setDetailStatus] = useState(localStorage.getItem('activityDetail') === '1' ? true : false) //是否是详请状态，1为是
  let [isActivityHave, setIsActivityHave] = useState(localStorage.getItem('isActivityHave')) //是否是活动发布状态
  const [state, setState] = useState({
    displayColorPicker: false,
  });

  let handleClick = () => {
    setState({ displayColorPicker: !state.displayColorPicker })
  };

  let handleClose = () => {
    setState({ displayColorPicker: false })
  };

  let handleChange = (color) => {
    setColor(color.hex)
  };
  useEffect(() => {
    setColor(props.colors)
    setIntColor(props.colors)
  }, [props.colors])

  //取消
  let cancalClick = (e) => {
    setColor(intColor)
    setState({ displayColorPicker: false })
  }
  //确定
  let oklClick = () => {
    setIntColor(color)
    props.setMColor(props.colorName, color)
    setState({ displayColorPicker: false })
  }

  const styles = reactCSS({
    'default': {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `${color}`,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  return (
    <div>
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color} />
      </div>
      {state.displayColorPicker ? <div style={styles.popover}>
        <div style={styles.cover} />
        <SketchPicker color={color} onChange={handleChange} />
        <div className={style.wrap_btn}><Button onClick={cancalClick}>取消</Button><Button type="primary" onClick={oklClick}>确定</Button></div>
      </div> : null}

    </div>
  )
}

export default SketchExample
