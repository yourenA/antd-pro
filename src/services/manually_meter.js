import request from '../utils/request';


export async function query(params) {
  return request(`/manually_monitoring_meters`,{
    method:'GET',
    params:{
      ...params
    }
  });
}

export async function add({...restParams}) {
  return request(`/manually_monitoring_meters`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function remove({id}) {
  return request(`/manually_monitoring_meters/${id}`, {
    method: 'DELETE',
  });
}


export async function edit({id,...restParams}) {
  return request(`/manually_monitoring_meters/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
