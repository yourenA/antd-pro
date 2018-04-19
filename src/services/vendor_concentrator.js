import request from '../utils/request';


export async function query(params) {
  return request(`/manufacturer_status`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function remove({id}) {
  return request(`/manufacturer_status/${id}`, {
    method: 'DELETE',
  });
}

export async function add({...restParams}) {
  return request(`/manufacturer_status`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/manufacturer_status/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
export async function editStatus({id,status}) {
  return request(`/manufacturer_status/${id}/status`, {
    method: 'PUT',
    data: {
      status,
    },
  });
}
