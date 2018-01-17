import request from '../utils/request';


export async function query(params) {
  return request(`/concentrator_models`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
