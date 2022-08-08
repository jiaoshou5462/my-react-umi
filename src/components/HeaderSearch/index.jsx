import { SearchOutlined } from '@ant-design/icons';
import { Select} from 'antd';
import React, { useRef,useState,useEffect } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { history,connect } from 'umi';
const { Option } = Select;
let timer = null;
const HeaderSearch = (props) => {
  const {
    className,
    dispatch,
    roleData,
  } = props;
  const inputRef = useRef(null);
  const [searchMode, setSearchMode] = useState(true);
  const [selValue,setSelValue] = useState(null);
  const inputClass = classNames(styles.input, {
    [styles.show]: searchMode,
  });
  const [options,setOptions] = useState([]);
  useEffect(()=>{
  },[searchMode])
  useEffect(()=>{
    if(window._user_menuList && window._user_menuList.length){
      let _list = [];
      for(let item of window._user_menuList){
        if(item.isPage){
          _list.push(item);
        }
      }
      setOptions(_list)
    }
  },[roleData])

  //选中菜单
  const selChange=(value)=>{
    // setSearchMode(false)
    setSelValue(null);
    if(value) history.push(value);
  }

  return (
    <div
      className={classNames(className)}
      onTransitionEnd={({ propertyName }) => {
        if (propertyName === 'width' && !searchMode) {
          // setSearchMode(searchMode);
        }
      }}
      onClick={() => {
        setSearchMode(true);
      }}
    >
      <div className={styles.search_border}>
        <Select 
        style={{width: '180px',background:'none',zIndex:2}}
        ref={inputRef}
        placeholder="搜索菜单…"
        showSearch
        bordered={false}
        autocomplete="off"
        value={selValue}
        onChange={selChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onBlur={() => {
          // setSearchMode(false);
        }}
        suffixIcon={false}
        >
          {
            options.map((item)=>{
              return <Option value={item.path}>{item.name}</Option>
            })
          }
        </Select>
        <SearchOutlined
          key="Icon"
          className={styles.searchIcon}
        />
      </div>
    </div>
  );
};

export default connect(({login}) => ({
  roleData: login.roleData
}))(HeaderSearch);
