import request from '../utils/request';


export async function query(params) {
  return request(`/meter_relations`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function remove({id}) {
  return request(`/meter_relations/${id}`, {
    method: 'DELETE',
  });
}

export async function add({...restParams}) {
  return request(`/meter_relations`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/meter_relations/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
