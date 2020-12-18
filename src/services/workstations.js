import request from '../utils/request';


export async function query(params) {
  return request(`/workstations`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function remove({id}) {
  return request(`/workstations/${id}`, {
    method: 'DELETE',
  });
}

export async function add({...restParams}) {
  console.log('restParams',JSON.stringify(restParams))
  return request(`/workstations`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}
export async function addTask({task,...restParams}) {
  return request(`/${task}`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}
export async function removeTask({id}) {
  return request(`/timed_tasks/${id}`, {
    method: 'DELETE',
  });
}

export async function edit({id,...restParams}) {
  return request(`/workstations/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
