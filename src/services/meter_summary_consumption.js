import request from '../utils/request';


export async function query(params) {
  return request(`/meter_summary_consumption`,{
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

export async function add({...restParams}) {
  return request(`/village_meter_data`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/village_meter_data/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
