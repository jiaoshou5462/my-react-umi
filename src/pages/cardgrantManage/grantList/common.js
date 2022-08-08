// 此方法针对卡券投放 卡券中心等页面一些列表公用方法封装
export const useThresholdRender = (status, record) => {
  return status ? <span>满{record.useThresholdAmount}元可用</span> : <span>无门槛</span>
}