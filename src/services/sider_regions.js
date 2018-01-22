import request from '../utils/request';


export async function query(params) {
  return request(`/villages`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
