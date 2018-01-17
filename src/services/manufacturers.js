import request from '../utils/request';


export async function query(params) {
  return request(`/manufacturers`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function remove({id}) {
  return request(`/manufacturers/${id}`, {
    method: 'DELETE',
  });
}

export async function add({...restParams}) {
  return request(`/manufacturers`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/manufacturers/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
