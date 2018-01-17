import request from '../utils/request';


export async function query(params) {
  return request(`/meter_models`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
