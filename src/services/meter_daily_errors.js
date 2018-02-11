import request from '../utils/request';


export async function query(params) {
  return request(`/meter_daily_errors`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function remove({id}) {
  return request(`/servers/${id}`, {
    method: 'DELETE',
  });
}

export async function add({...restParams}) {
  return request(`/servers`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/servers/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
export async function editStatus({id,status}) {
  return request(`/servers/${id}/status`, {
    method: 'PUT',
    data: {
      status,
    },
  });
}
