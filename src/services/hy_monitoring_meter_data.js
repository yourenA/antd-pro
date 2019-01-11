import request from '../utils/request';


export async function query(params) {
  return request(`/village_meter_data`,{
    method:'POST',
    data:{
      ...params
    }
  });
}

export async function queryHistory(params) {
  return request(`/village_meter_data`,{
    method:'POST',
    data:{
      ...params
    }
  });
}
