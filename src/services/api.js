import { stringify } from 'qs';
import request from '../utils/request';


export async function queryRule(params) {
  return request(`http://localhost:3000/matter-access-management`);
}

export async function removeRule(params) {
  return request(`http://localhost:3000/matter-access-management/${params}`, {
    method: 'delete',
  });
}

export async function addRule(params) {
  return request('http://localhost:3000/matter-access-management', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

