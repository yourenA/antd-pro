import request from '../utils/request';


export async function query({...resetParams}) {
  return request(`/companies`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}

export async function remove({id}) {
  return request(`/companies/${id}`, {
    method: 'DELETE',
  });
}



export async function resetPassword({id}) {
  return request(`/companies/${id}/default_password`, {
    method: 'PUT',
  });
}
export async function add({...restParams}) {
  return request(`/companies`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/companies/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
export async function editStatus({id,status}) {
  return request(`/companies/${id}/status`, {
    method: 'PUT',
    data: {
      status,
    },
  });
}


