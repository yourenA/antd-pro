import request from '../utils/request';


export async function query(params) {
  return request(`/members`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function remove({id}) {
  return request(`/members/${id}`, {
    method: 'DELETE',
  });
}

export async function add({...restParams}) {
  return request(`/members`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/members/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
export async function exportCSV(params) {
  return request(`/member_files`,{
    method:'GET',
    params:{
      ...params
    }
  });
}

export async function exportConcentratorCSV(params) {
  return request(`/concentrator_files`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
