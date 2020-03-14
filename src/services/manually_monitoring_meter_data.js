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
  return request(`/village_meter_historical_data`,{
    method:'GET',
    params:{
      ...params
    }
  });
}

export async function remove({id}) {
  return request(`/village_meter_historical_data/${id}`, {
    method: 'DELETE',
  });
}
