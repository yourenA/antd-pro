import request from '../utils/request';


export async function query({endpoint_id,...resetParams}) {
  return request(`/endpoints/${endpoint_id}/things`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}

export async function remove({endpoint_id,id}) {
  return request(`/endpoints/${endpoint_id}/things/${id}`, {
    method: 'DELETE',
  });
}

export async function add({endpoint_id,...restParams}) {
  return request(`/endpoints/${endpoint_id}/things`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function edit({endpoint_id,id,...restParams}) {
  return request(`/endpoints/${endpoint_id}/things/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
