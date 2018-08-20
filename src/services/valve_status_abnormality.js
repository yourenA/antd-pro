import request from '../utils/request';


export async function query(params) {
  return request(`/valve_status_abnormality`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
