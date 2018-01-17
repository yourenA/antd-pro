import request from '../utils/request';


export async function query(params) {
  return request(`/manufacturers`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
