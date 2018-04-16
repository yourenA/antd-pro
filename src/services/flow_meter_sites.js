import request from '../utils/request';


export async function query(params) {
  return request(`/sites`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function remove({id}) {
  return request(`/sites/${id}`, {
    method: 'DELETE',
  });
}

export async function add({...restParams}) {
  return request(`/sites`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/sites/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
