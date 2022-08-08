import {api} from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js'; //环境变量

/* 保存或修改活动素材 */
export const saveOrUpdate = (payload) => {
  return createApi({
    url: `${api}/api/uniway/marketing-material/saveOrUpdate`,
    ...payload
  })
}
/* 获取活动素材详情 */
export const getMaterialDetails = (payload) => {
  return createApi({
    url: `${api}/api/uniway/marketing-material/getMaterialDetails`,
    ...payload
  })
}
/* 查询活动素材列表 */
export const materialList = (payload) => {
  return createApi({
    url: `${api}/api/uniway/marketing-material/materialList`,
    ...payload
  })
}

/* 上下架素材 */
export const updateMaterialStatus = (payload) => {
  return createApi({
    url: `${api}/api/uniway/marketing-material/updateMaterialStatus`,
    ...payload
  })
}

/* 删除素材 */
export const deleteMaterial = (payload) => {
  return createApi({
    url: `${api}/api/uniway/marketing-material/deleteMaterial?materialId=${payload.params.materialId}&styleCode=$${payload.params.styleCode}`,
    ...payload
  })
}

/* 复制素材 */
export const copyMaterial = (payload) => {
  return createApi({
    url: `${api}/api/uniway/marketing-material/copyMaterial`,
    ...payload
  })
}

/* 查询素材分类列表 */
export const materialCategoryNameList = (payload) => {
  return createApi({
    url: `${api}/api/uniway/material-category/materialCategoryNameList`,
    ...payload
  })
}

/* 新增素材分类 */
export const addMaterialCategory = (payload) => {
  return createApi({
    url: `${api}/api/uniway/material-category/addMaterialCategory`,
    ...payload
  })
}
//活动中心-应用主题创建活动
export const saveActivityCenter = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelActivityCenter/saveActivityCenter`,
    ...payload
  })
};
