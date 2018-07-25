import request from '../utils/request';


export async function query(params) {
  return request(`/meters`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function remove({id}) {
  return request(`/meters/${id}`, {
    method: 'DELETE',
  });
}

export async function add({...restParams}) {
  return request(`/meters`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function change({...restParams}) {
  return request(`/meter_change_records`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}


export async function edit({id,...restParams}) {
  return request(`/meters/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
