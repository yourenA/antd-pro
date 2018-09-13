import request from '../utils/request';


export async function query(params) {
  return request(`/pressure_sensor_historical_data`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
