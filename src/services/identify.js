import request from '../utils/request';


export async function query({endpoint_id,...resetParams}) {
  return request(`/endpoints/${endpoint_id}/principals`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}

export async function remove({endpoint_id,id}) {
  return request(`/endpoints/${endpoint_id}/principals/${id}`, {
    method: 'DELETE',
  });
}

export async function add({name,description,policy_id,endpoint_id}) {
  return request(`/endpoints/${endpoint_id}/principals`, {
    method: 'POST',
    data: {
      name,
      description,
      policy_id
    },
  });
}

export async function edit({name,description,policy_id,endpoint_id,id}) {
  return request(`/endpoints/${endpoint_id}/principals/${id}`, {
    method: 'PUT',
    data: {
      name,
      description,
      policy_id
    },
  });
}
