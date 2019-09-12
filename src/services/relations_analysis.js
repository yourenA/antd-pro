import request from '../utils/request';


export async function query(params) {
  return request(`/attrition_rate_data`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
