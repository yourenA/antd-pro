import request from '../utils/request';


export async function query(params) {
  return request(`/valve_sensors`,{
    method:'GET',
    params:{
      ...params
    }
  });
}
export async function remove({id}) {
  return request(`/valve_sensors/${id}`, {
    method: 'DELETE',
  });
}

export async function add({...restParams}) {
  return request(`/valve_sensors`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/valve_sensors/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}


export async function connect({...restParams}) {
  return request(`/liquid_sensor_valve_sensor`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function command({...restParams}) {
  return request(`/user_command_data`, {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

