

export const fieldType_dict = [
  { label: '千人千面', value: 2 },
  { label: '通用', value: 1 },
]
export const status_dict = [
  { label: '启用', value: 2 },
  { label: '未启用', value: 1 },
]
export const fieldContentType_dict = [
  { label: '图片', value: 1 },
  { label: '产品', value: 2 },
  { label: '文章', value: 3 },
]

export const getDictName=(dict,value)=>{
  for(let item of dict){
    if(item.value==value){
      return item.label;
    }
  }
}
