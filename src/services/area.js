import request from '../utils/request';


export async function query(params) {
  return request(`/villages`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function remove({id}) {
  return request(`/villages/${id}`, {
    method: 'DELETE',
  });
}

export async function add({...restParams}) {
  return request(`/villages`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/villages/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
