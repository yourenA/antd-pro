import request from '../utils/request';


export async function query(params) {
  return request(`/concentrator_models`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function remove({id}) {
  return request(`/concentrator_models/${id}`, {
    method: 'DELETE',
  });
}

export async function add({...restParams}) {
  return request(`/concentrator_models`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/concentrator_models/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
