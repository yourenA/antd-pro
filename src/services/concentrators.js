import request from '../utils/request';


export async function query(params) {
  return request(`/concentrators`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function remove({id}) {
  return request(`/concentrators/${id}`, {
    method: 'DELETE',
  });
}

export async function add({...restParams}) {
  return request(`/concentrators`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/concentrators/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
