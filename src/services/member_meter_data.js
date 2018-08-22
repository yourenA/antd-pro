import request from '../utils/request';


export async function query(params) {
  return request(`/member_meter_data`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function queryOne({member_number,...restParams}) {
  return request(`/member_meter_data/${member_number}`,{
    method:'GET',
    params:{
      ...restParams
    }
  });
}

export async function exportCSV(params) {
  return request(`/meter_data_files`,{
    method:'GET',
    params:{
      ...params
    }
  });
}


