import request from '../utils/request';


export async function query(params) {
  return request(`/night_abnormality`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function remove({id}) {
  return request(`/flow_meters/${id}`, {
    method: 'DELETE',
  });
}

export async function add({...restParams}) {
  return request(`/flow_meters`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/flow_meters/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
