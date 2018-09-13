import request from '../utils/request';


export async function query(params) {
  return request(`/pressure_sensors`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function remove({id}) {
  return request(`/pressure_sensors/${id}`, {
    method: 'DELETE',
  });
}

export async function add({...restParams}) {
  return request(`/pressure_sensors`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}


export async function edit({id,...restParams}) {
  return request(`/pressure_sensors/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
