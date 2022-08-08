import { parse } from 'querystring';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path) => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);


export const dataURLtoFile = (dataurl, filename) => {//将base64转换为文件
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

//图片转base64
export const readFile = (file) =>{
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }
  let Id = 0;
  /**
   * @description 得到唯一id
   * @function getOnlyId
   * @param {Int}  len id的随机的长度
   * @memberof tools
   * @returns [String] id
   */
   export const  getOnlyId =  (len) => {
    let str = '';
    len = len || 8;
    for (; str.length < len; str += Math.random().toString(36).substr(2));
    return str.substr(0, len).replace(/^\d/, 'a') + Id++;
  };

/**
 *下载或导出文件
* @param blob  ：返回数据的blob对象
* @param encFileName  ：文件名加类型
*/
export const downloadFile = (blob, encFileName) => {
  let downloadElement = document.createElement('a')
  let href = window.URL.createObjectURL(new Blob([blob])); //创建下载的链接
  downloadElement.href = href;
  downloadElement.download = encFileName;//下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click(); //点击下载
  document.body.removeChild(downloadElement); //下载完成移除元素
  window.URL.revokeObjectURL(href); //释放掉blob对象
}

/**
 * 针对合并单元格列数
 * @param {*} data   [后台数据]
 * @param {*} key    [要合并的字段]
 * @param {*} target [后台数据对应的index]
 * @returns 合并的行数
 */
 export const getRowSpanCount = (data, key, target) => {
  if (!Array.isArray(data)) return 1;
  data = data.map(_ => _[key]); // 只取出筛选项
  let preValue = data[0];
  const res = [[preValue]]; // 放进二维数组里
  let index = 0; // 二维数组下标
  for (let i = 1; i < data.length; i++) {
    if (data[i] === preValue) { // 相同放进二维数组
      res[index].push(data[i]);
    } else { // 不相同二维数组下标后移
      index += 1;
      res[index] = [];
      res[index].push(data[i]);
      preValue = data[i];
    }
  }
  const arr = [];
  res.forEach((_) => {
    const len = _.length;
    for (let i = 0; i < len; i++) {
      arr.push(i === 0 ? len : 0);
    }
  });
  return arr[target];
}

/**
 * 解决js精度问题 乘法
 * @param {*} arg1   [需要乘的数]
 * @param {*} key    [乘的倍数]
 * @returns arg1乘以arg2的精确结果
 */
export const precisionMultiplication = (arg1,arg2) => {
  let m=0,s1=arg1.toString(),s2=arg2.toString();
  try{m+=s1.split(".")[1].length}catch(e){}
  try{m+=s2.split(".")[1].length}catch(e){}
  return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}