import { stringify } from 'qs';
import config from '../common/config'
import request from '../utils/request';


export async function query(params) {
  return request(`/endpoints`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function queryName({endpoint_id}) {
  return request(`/endpoints/${endpoint_id}`,{
    method:'GET',
  });
}
export async function remove(params) {
  return request(`/endpoints/${params}`, {
    method: 'DELETE',
  });
}

export async function add(params) {
  return request(`/endpoints`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function edit({id,description}) {
  return request(`/endpoints/${id}`, {
    method: 'PUT',
    data: {
      description,
    },
  });
}
