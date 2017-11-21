import request from '../utils/request';


export async function query({endpoint_id,...resetParams}) {
  return request(`/endpoints/${endpoint_id}/policies`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}

export async function remove({endpoint_id,id}) {
  return request(`/endpoints/${endpoint_id}/policies/${id}`, {
    method: 'DELETE',
  });
}

export async function add({name,description,permissions,endpoint_id}) {
  return request(`/endpoints/${endpoint_id}/policies`, {
    method: 'POST',
    data: {
      name,
      description,
      permissions
    },
  });
}

export async function edit({name,description,permissions,endpoint_id,id}) {
  return request(`/endpoints/${endpoint_id}/policies/${id}`, {
    method: 'PUT',
    data: {
      name,
      description,
      permissions
    },
  });
}
