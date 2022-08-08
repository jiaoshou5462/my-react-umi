import React, { useEffect, useState } from 'react';
import reactCSS from 'reactcss';
import { Button } from 'antd';
import style from './style.less';
import { SketchPicker } from 'react-color'

const SketchExample = (props) => {
  let [color, setColor] = useState(props.colors)
  let [colorPosition, setColorPosition] = useState('')
  let [intColor, setIntColor] = useState('');
  const [state, setState] = useState({
    displayColorPicker: false,
  })
  let [styleConfig, setStyleConfig] = useState(null)

  let handleClick = () => {
    setColorPosition(props.colorPosition ? props.colorPosition : '') //弹窗显示的位置
    if(!props.disabled){
      //disabled 为true时不会打开颜色选择器
      setState({ displayColorPicker: !state.displayColorPicker })
    }
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


  useEffect(() => {
    let styles = reactCSS({
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
          left: '0',
          top: '40px'
        },
      },
    })
    if(colorPosition === 'top'){
      //为top时，设置为向上弹出颜色选择器. 引入页面父组件需要设置定位
      styles.popover = {
        position: 'absolute',
        zIndex: '2',
        bottom: '40px',
        left: '0'
      }
    }
    setStyleConfig(styles)
  }, [colorPosition, color])

  return (<>
        {
          styleConfig ? <div className={style.color_sel_box}>
            <div style={styleConfig.swatch} onClick={handleClick}>
              <div style={styleConfig.color} ></div>
            </div>
            {
              state.displayColorPicker ? <div style={styleConfig.popover}>
                <SketchPicker color={color} onChange={handleChange} />
                <div className={style.wrap_btn}>
                  <Button onClick={cancalClick}>取消</Button>
                  <Button type="primary" onClick={oklClick}>确定</Button>
                </div>
              </div> : null
            }
          </div> : null
        }
    </>
  )
}

export default SketchExample
