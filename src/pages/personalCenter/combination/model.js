
import { queryList,deleteOrganization,detailOrganization ,insertOrganization,updateOrganization,queryParentList} from "@/services/privilege";
const Model = {
  namespace: 'combination',
  state: {
  },
  effects: {
    /*查询组织机构列表*/
    *queryList ({ payload, callback }, { put, call }) {
      let response = yield call(queryList, payload)
      callback && callback(response)
    },
     /*删除组织机构*/
     *deleteOrganization ({ payload, callback }, { put, call }) {
      let response = yield call(deleteOrganization, payload)
      callback && callback(response)
    },
     /*查询组织机构详情*/
     *detailOrganization ({ payload, callback }, { put, call }) {
      let response = yield call(detailOrganization, payload)
      callback && callback(response)
    },
     /*新增组织机构*/
     *insertOrganization ({ payload, callback }, { put, call }) {
      let response = yield call(insertOrganization, payload)
      callback && callback(response)
    },
     /*编辑组织机构*/
     *updateOrganization ({ payload, callback }, { put, call }) {
      let response = yield call(updateOrganization, payload)
      callback && callback(response)
    },
     /*上级组织机构列表*/
     *queryParentList ({ payload, callback }, { put, call }) {
      let response = yield call(queryParentList, payload)
      callback && callback(response)
    },
    
  },
  reducers: {
  },
};
export default Model;
