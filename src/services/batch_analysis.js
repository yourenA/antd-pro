import request from '../utils/request';


export async function query(params) {
  return request(`/meter_consumption`,{
    method:'GET',
    params:{
      ...params
    }
  });
}


export async function showDetail({id,...restParams}) {
  return request(`/meters/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}
