import request from '../utils/request';


export async function query(params) {
  return request(`/monitoring_meters`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function remove({id}) {
  return request(`/village_meter_data/${id}`, {
    method: 'DELETE',
  });
}

export async function syncData(data) {
  return request(`/monitoring_meters`, {
    method: 'POST',
    data: {
      ...data,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/monitoring_meters/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
