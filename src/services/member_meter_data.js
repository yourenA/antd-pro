import request from '../utils/request';


export async function query(params) {
  return request(`/member_meter_data`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function queryOne({member_number,...restParams}) {
  return request(`/member_meter_data/${member_number}`,{
    method:'GET',
    params:{
      ...restParams
    }
  });
}
export async function remove({id}) {
  return request(`/member_meter_data/${id}`, {
    method: 'DELETE',
  });
}

export async function add({...restParams}) {
  return request(`/member_meter_data`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/member_meter_data/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
