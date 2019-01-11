import request from '../utils/request';


export async function query({endpoint_id,...resetParams}) {
  return request(`/meter_images`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}

export async function remove({id}) {
  return request(`/meter_images/${id}`, {
    method: 'DELETE',
  });
}

export async function resetPassword({id}) {
  return request(`/users/${id}/default_password`, {
    method: 'PUT',
  });
}
export async function add({data:{...restParams}}) {
  return request(`/users`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function edit({data:{id,...restParams}}) {
  return request(`/users/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}

export async function editStatus({data:{id,status}}) {
  return request(`/users/${id}/status`, {
    method: 'PUT',
    data: {
      status,
    },
  });
}
