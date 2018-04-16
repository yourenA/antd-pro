import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import navData from '../common/nav';
import {message} from 'antd'
import messageJson from './message.json';
export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }
  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }
    const beginTime = now.getTime() - (day * oneDay);
    return [moment(beginTime), moment( now.getTime())];
  }
  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${year}-${parseInt(month+1)}-${day} 00:00:00`).valueOf())];
  }

  if (type === 'year') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    return [moment(`${year}-01-01 00:00:00`), moment(moment(`${year}-${parseInt(month+1)}-${day} 23:59:59`).valueOf())];
  }
}

function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }

  });
  return arr;
}

export function getRouteData(path) {
  if (!navData.some(item => item.layout === path) ||
      !(navData.filter(item => item.layout === path)[0].children)) {
    return null;
  }
  const dataList = cloneDeep(navData.filter(item => item.layout === path)[0]);
  const nodeList = getPlainNode(dataList.children);
  return nodeList;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}

const removeLoginStorage = () => {
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('permissions');
  sessionStorage.clear();
  localStorage.clear()
  // localStorage.removeItem('username');
  // localStorage.removeItem('token');
};
exports.removeLoginStorage = removeLoginStorage;

/**
 *  判断错误码(数组)
 * */

export function converErrorCodeToMsg (error) {
  console.log("error", error.toString())
  if (error.toString() === 'Error: Network Error') {
    message.error(messageJson['network error'], 3);
    return false
  }
  if (error.response.status === 401) {
    message.error(messageJson['token fail']);
    removeLoginStorage();
    // setTimeout(function () {
    //   window.location.reload()
    // },1000)
  } else if (!error.response.data.errors) {
    message.error(error.response.data.message);
  } else if (error.response.status === 422) {
    let first;
    for (first in error.response.data.errors) break;
    message.error(`${error.response.data.errors[first][0]}`);
  } else {
    message.error(messageJson['unknown error']);
  }
}

export function convertPoliciesTopic  (form)  {
  console.log('form',form)
  const addPoliciesDate = {
    name: form.name,
    description: form.desc,
    permissions: []
  };
  for (var k in form) {
    if (k.indexOf('topics') >= 0) {
      if (form.hasOwnProperty(k)) {
        if(form[k]===undefined){
          return false
        }
        if (form[k].authority == 0) {
          addPoliciesDate.permissions.push({
            id:form[k].id,
            topic: form[k].name,
            allow_publish: -1,
            allow_subscribe: 1
          })
        } else if (form[k].authority == 1) {
          addPoliciesDate.permissions.push({
            id:form[k].id,
            topic: form[k].name,
            allow_publish: 1,
            allow_subscribe: -1
          })
        } else if (form[k].authority == 2) {
          addPoliciesDate.permissions.push({
            id:form[k].id,
            topic: form[k].name,
            allow_publish: 1,
            allow_subscribe: 1
          })
        }else{
          addPoliciesDate.permissions.push({
            id:form[k].id,
            topic: form[k].name,
            allow_publish: form[k].allow_publish,
            allow_subscribe: form[k].allow_subscribe
          })
        }
      }
    }
  }

  return addPoliciesDate;
};

export function getBetweemDay(begin, end) {
  var ab = begin.split("-");
  var ae = end.split("-");
  var db = new Date();
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
  var de = new Date();
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
  var unixDb = db.getTime();
  var unixDe = de.getTime();
  var result=[];
  for (var k = unixDb; k <= unixDe;) {
    result.push(moment(parseInt(k)).format("YYYY-MM-DD"));
    k = k + 24 * 60 * 60 * 1000;
  }
  return result
}

export function download(url) {
  let iframe = document.createElement('a')
  // iframe.style.display = 'none'
  // iframe.style.width = '150px'
  // iframe.style.height = '150px'
  iframe.href = url
  // iframe.text = url
  iframe.onload = function () {
    console.log('onload')
    document.body.removeChild(iframe)
  }
  document.body.appendChild(iframe)
  iframe.click();
}

export function disabledDate(current) {
  return (current && current > moment().add(0, 'days'))||(current && current < moment('2017-10-01'));
}
