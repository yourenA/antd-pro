import request from '../utils/request';


export async function query({endpoint_id,...resetParams}) {
  return request(`/endpoints/${endpoint_id}/rules`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}
export async function queryOneRule({endpoint_id,rule_id}) {
  return request(`/endpoints/${endpoint_id}/rules/${rule_id}`,{
    method:'GET',
  });
}
export async function remove({endpoint_id,id}) {
  return request(`/endpoints/${endpoint_id}/rules/${id}`, {
    method: 'DELETE',
  });
}

export async function add({endpoint_id,name,description,from,select,where,destinations}) {
  return request(`/endpoints/${endpoint_id}/rules`, {
    method: 'POST',
    data: {
      name,description,from,select,where,destinations
    },
  });
}

export async function edit({endpoint_id,name,description,from,select,where,destinations,id}) {
  return request(`/endpoints/${endpoint_id}/rules/${id}`, {
    method: 'PUT',
    data: {
      name,description,from,select,where,destinations
    },
  });
}
