import request from '../utils/request';


export async function query({...resetParams}) {
  return request(`/roles`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}

export async function queryOneUsergroup({id}) {
  return request(`/roles/${id}`,{
    method:'GET',
  });
}
export async function remove({id}) {
  return request(`/roles/${id}`, {
    method: 'DELETE',
  });
}

export async function add({data}) {
  return request(`/roles`, {
    method: 'POST',
    data: {
      ...data,
    },
  });
}

export async function edit({data:{id,...data}}) {
  return request(`/roles/${id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
  });
}
export async function editStatus({data:{id,status}}) {
  return request(`/roles/${id}/status`, {
    method: 'PUT',
    data: {
      status,
    },
  });
}
