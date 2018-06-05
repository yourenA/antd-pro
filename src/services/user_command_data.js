import request from '../utils/request';


export async function query(params) {
  return request(`/user_command_data`,{
    method:'GET',
    params:{
      ...params
    }
  });
}

export async function queryMeterDataDetail(params) {
  return request(`/meter_data_detail`,{
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
  return request(`/user_command_data`, {
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
