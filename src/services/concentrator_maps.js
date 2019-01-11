import request from '../utils/request';


export async function query(params) {
  return request(`/concentrator_maps`,{
    method:'GET',
    params:{
      ...params
    }
  });
}

