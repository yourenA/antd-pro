import request from '../utils/request';


export async function query(params) {
  return request(`/temperature_sensors`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
