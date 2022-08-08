
/*标签状态*/
export const labelState = [{ value: '待审核', id: 'PENDING' }, { value: '通过', id: 'PASS' }, { value: '审核拒绝', id: 'FAIL' }]; // 新的
/*创建方式*/
export const createAWay = [
  { value: '自定义', id: 'CUSTOMIZE' }, 
  { value: '标签人群', id: 'TAG' },
  { value: '导入指定名单', id: 'IMPORT' }
]
/*更新方式*/
export const updateMode = [{ value: '手动更新', id: 'MANUAL' }, { value: '自动更新', id: 'AUTO' }, { value: '导入', id: 'IMPORT' }]
/*运行状态*/
export const runState = [{ value: '禁用', id: '0' }, { value: '启用', id: '1' }]
//用户行为 运算符
export const operatorDict = [
  { value: '=', id: '=' },
  { value: '!=', id: '!=' },
  { value: '>', id: '>' },
  { value: '>=', id: '>=' },
  { value: '<', id: '<' },
  { value: '<=', id: '<=' },
]
//用户行为 统计类型
export const countTypeDict = [
  { value: '总次数', id: 'SUM_COUNT' },
  { value: '触发天数', id: 'TRIGGER_DAYS' },
  { value: '触发小时数', id: 'TRIGGER_HOURS' },
]
//用户行为 行为类型
export const behaviorTypeDict = [
  { value: '做过', id: 'DONE' },
  { value: '未做过', id: 'NO_DONE' },
]
//用户行为 时间区间
export const eventDataType_Dict = [
  { value: '时间区间', id: 'BETWEEN' },
  { value: '相对当前时间', id: 'BEFORE_AFTER_NOW' },
  { value: '相对当前时间区间', id: 'BEFORE_AFTER_NOW_BET' },
]
//用户行为 时间区间-行为-区间
export const eventDataTypeDown_Dict = [
  { value: '之前', id: 'before' },
  { value: '之内', id: 'after' },
]
//用户行为 时间区间-行为
export const eventDataTypeDown_bt_Dict = [
  { value: '过去', id: 'before' },
  { value: '未来', id: 'after' },
  { value: '当天', id: 'now' },
]
export const cardIncludes = [
  'not_get_coupon',//未领取卡券
  'not_use_coupon',//未使用取卡券数
  'expiring_coupon',//即将过期卡券 
  'used_coupon' //已使用卡券
]
//卡券大分类选择
export const cardSel_dict = [
  { value: '不限', id: 'all_coupon' },
  { value: '指定卡券', id: 'coupon' },
  { value: '指定卡券品类', id: 'coupon_category' },
]
