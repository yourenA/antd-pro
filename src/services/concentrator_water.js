import request from '../utils/request';


export async function query({id,...params}) {
  return request(`/concentrators/${id}/meters`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
