import request from '../utils/request';


export async function query(params) {
  return request(`/meter_status`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function remove({id}) {
  return request(`/members/${id}`, {
    method: 'DELETE',
  });
}

export async function add({...restParams}) {
  return request(`/members`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/members/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
