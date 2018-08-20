import request from '../utils/request';


export async function query(params) {
  return request(`/voltage_status_abnormality`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
