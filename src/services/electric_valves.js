import request from '../utils/request';


export async function query(params) {
  return request(`/electric_valves`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function remove({id}) {
  return request(`/electric_valves/${id}`, {
    method: 'DELETE',
  });
}

export async function add({...restParams}) {
  return request(`/electric_valves`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}


export async function edit({id,...restParams}) {
  return request(`/electric_valves/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
