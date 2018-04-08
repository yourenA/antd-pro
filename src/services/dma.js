import request from '../utils/request';


export async function query(params) {
  return request(`/areas`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function remove({id}) {
  return request(`/areas/${id}`, {
    method: 'DELETE',
  });
}

export async function add({...restParams}) {
  return request(`/areas`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/areas/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
