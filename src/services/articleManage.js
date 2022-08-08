import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js';

/*获取所属渠道*/
export const customerChannelList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channel/queryCustomerChannelByChannelId`,
    ...payload
  })
};

/* 查询文章全部分类 */
export const queryAllCategory = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/articles/queryAllCategory`,
    ...payload
  })
};

/* 添加文章分类 */
export const saveCategory = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/articles/saveCategory`,
    ...payload
  })
};

/* 排序分类 */
export const orderCategory = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/articles/orderCategory`,
    ...payload
  })
};

/* 删除分类 */
export const delCategory = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/articles/delCategory`,
    ...payload
  })
};

/* 文章详情 */
export const articleDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/articles/articleDetail`,
    ...payload
  })
};

/* 通过分类查询文章 */
export const articleList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/articles/articleList`,
    ...payload
  })
};

/* 停用-启用 */
export const articleStatus = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/articles/articleStatus`,
    ...payload
  })
};

/* 置顶文章 */
export const cancelArticleTop = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/articles/cancelArticleTop`,
    ...payload
  })
};

/* 删除文章 */
export const delArticle = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/articles/delArticle`,
    ...payload
  })
};

/* 保存文章 */
export const saveArticle = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/articles/saveArticle`,
    ...payload
  })
};
