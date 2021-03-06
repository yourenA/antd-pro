import moment from 'moment';
import {Fragment}  from 'react';
import cloneDeep from 'lodash/cloneDeep';
import navData from '../common/nav';
import {message, Badge, Tooltip,Progress,notification,Icon} from 'antd'
import uuid from 'uuid/v4'
import messageJson from './message.json';
export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getMonth(val) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return `${year}-${fixedZero(month)}`
}
export function renderValveOpen(val,valve_status_explain){
  let type = '';
  let color = '';
  let text = '';
  switch (val) {
    case -1:
      type = 'close-circle', color = '#eb2f96', text = '关';
      return <p className={'table-error table-status'}>关闭</p>;
      break;
    case 1:
      type = 'check-circle', color = '#52c41a', text = '开';
      return <p className={'table-success table-status'}>开启</p>;
      break;
    case 2:
      type = 'close-circle', color = '#fe5810', text = '未上报';
      break;
    case 3:
      type = 'close-circle', color = '#fe1b2e', text = '异常';
      break;
    default:
      type = 'close-circle', color = '#eb2f96', text = '异常';
      break;
  }
  return <Fragment> <Icon type={type} theme="twoTone" className="table-icon" twoToneColor={color}/>{text}</Fragment>;
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
    return [moment(beginTime), moment(now.getTime())];
  }
  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(`${year}-${fixedZero(month + 1)}-${day} 00:00:00`)];
  }

  if (type === 'year') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-${fixedZero(month + 1)}-${day} 23:59:59`)];
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
  if (!navData.some(item => item.layout === path) || !(navData.filter(item => item.layout === path)[0].children)) {
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

const removeLoginStorage = (company_code) => {
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('permissions');
  sessionStorage.clear();
  // localStorage.clear()
  // localStorage.removeItem('username');
  // localStorage.removeItem('token');
};
exports.removeLoginStorage = removeLoginStorage;

/**
 *  判断错误码(数组)
 * */

export function converErrorCodeToMsg(error) {
  console.log("error", error.toString())
  if (error.toString() === 'Error: Network Error') {
    message.error(messageJson['network error'], 3);
    return false
  }
  if (error.response.status === 401) {
    // message.error(messageJson['token fail']);
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

export function convertPoliciesTopic(form) {
  console.log('form', form)
  const addPoliciesDate = {
    name: form.name,
    description: form.desc,
    permissions: []
  };
  for (var k in form) {
    if (k.indexOf('topics') >= 0) {
      if (form.hasOwnProperty(k)) {
        if (form[k] === undefined) {
          return false
        }
        if (form[k].authority == 0) {
          addPoliciesDate.permissions.push({
            id: form[k].id,
            topic: form[k].name,
            allow_publish: -1,
            allow_subscribe: 1
          })
        } else if (form[k].authority == 1) {
          addPoliciesDate.permissions.push({
            id: form[k].id,
            topic: form[k].name,
            allow_publish: 1,
            allow_subscribe: -1
          })
        } else if (form[k].authority == 2) {
          addPoliciesDate.permissions.push({
            id: form[k].id,
            topic: form[k].name,
            allow_publish: 1,
            allow_subscribe: 1
          })
        } else {
          addPoliciesDate.permissions.push({
            id: form[k].id,
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
  var result = [];
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
  return (current && current > moment().add(0, 'days')) || (current && current < moment('2017-10-01'));
}

export function disabledPreDate(current) {
  return (current && current > moment()) || (current && current < moment('2017-10-01'));
}

export function getPreMonth() {
  var date = new Date();
  var year = date.getFullYear(); //获取当前日期的年份
  var month = date.getMonth(); //获取当前日期的月份
  var day = date.getDate(); //获取当前日期的日
  if (month === 0) {//如果是1月份，则取上一年的12月份
    year = year - 1;
    month = 12;
  }
  day = new Date(year, month, 0).getDate();

  return [moment().add(-2, 'days'), moment(year + '-' + month + '-' + day, 'YYYY-MM-DD')]
}

export function getPreDay() {
  return [moment().add(-1, 'days'), moment(new Date(), 'YYYY-MM-DD')]
}

const errorNumber = '141414'
exports.errorNumber = errorNumber;

function renderIndex(meta, page, index) {
  const parseIndex = meta ? String((meta.pagination.per_page * (page - 1)) + (index + 1)) : 0;
  return (
    <span title={parseIndex}>
                {parseIndex.length > 4 ? parseIndex.substring(0, 3) + '...' : parseIndex}
            </span>
  )
}

exports.renderIndex = renderIndex;

function renderIndex2(meta, page, index) {
  const parseIndex = meta ? String((meta.pagination.per_page * (page - 1)) + (index + 1)) : 0;
  return (
    <span title={parseIndex}>
                {parseIndex.length > 4 ? parseIndex.substring(0, 3) + '...' : parseIndex}
            </span>
  )
}

exports.renderIndex2 = renderIndex2;

function renderErrorData(val, error = errorNumber) {
  if (val.toString().indexOf(error) >= 0) {
    return '异常数据'
  }
  return val

}

exports.renderErrorData = renderErrorData;

export function renderCustomHeaders(headers, meta, page) {
  let custom_width = 50;
  let custom_headers = [];
  headers && headers.forEach((item, index)=> {
    custom_width = custom_width + item.size;
    if (item.key === 'status_explain') {
      custom_headers.push({
        title: item.display_name,
        dataIndex: item.key,
        key: item.key,
        width: index === headers.length - 1 ? '' : item.size,
        render: (val, record, index) => {
          let status = 'success';
          switch (record.status) {
            case -3:
              status = 'default'
              break;
            case -2:
              status = 'error'
              break;
            case -1:
              status = 'warning'
              break;
            default:
              status = 'success'
          }
          return (
            ellipsis2(<span>
            <Badge status={status}/>{val}
          </span>, item.size - 5)

          )
        }
      })
    } else if (item.key === 'latest_value' || item.key === 'previous_value') {
      custom_headers.push({
        title: item.display_name,
        dataIndex: item.key,
        key: item.key,
        width: index === headers.length - 1 ? '' : item.size,
        render: (val, record, index) => {
          return renderErrorData(val)
        }
      })
    } else {
      custom_headers.push({
        title: item.display_name,
        dataIndex: item.key,
        key: item.key,
        width: index === headers.length - 1 ? '' : item.size,
        render: (val, record, index) => {
          return ellipsis2(val, item.size - 5)
        }
      })
    }
  })

  return {custom_headers, custom_width}
}
export function ellipsis(val, len = 8) {
  if (val) {
    return (
      <Tooltip title={val}>
        <span>{val.length > len ? val.substring(0, len) + '...' : val}</span>
      </Tooltip>
    )
  } else {
    return ''
  }

}

export function ellipsis2(val, len = 150) {
  if (val !== undefined) {
    const company_code = sessionStorage.getItem('company_code');
    if(company_code==='hngydx'){
      return (
        <Tooltip
          placement="topLeft"
          title={<p style={{wordWrap: 'break-word'}}>{val}</p>}>
          <p style={{
            display: 'inline-block',
            width: `${len - 15}px`,
          }}>{val}</p>
        </Tooltip>
      )
    }else{
      return (
        <Tooltip
          placement="topLeft"
          title={<p style={{wordWrap: 'break-word'}}>{val}</p>}>
          <p style={{
            display: 'inline-block',
            width: `${len - 15}px`,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>{val}</p>
        </Tooltip>
      )
    }

  } else {
    return ''
  }

}
exports.ellipsis2 = ellipsis2;
export function searchFormItemLayout() {
  return {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 18
    }
  };
}


function renderRowSpan(children, record) {
  const obj = {
    children: children,
    props: {},
  };
  obj.props.rowSpan = record.rowSpan;
  // These two are merged into above cell
  return obj;
}

exports.renderRowSpan = renderRowSpan;

function parseRowSpanData(data) {
  const company_code = sessionStorage.getItem('company_code');
  for (let i = 0; i < data.length; i++) {
    data[i].index = i
  }
  let resetMeterData = []
  data.map((item, index)=> {
    if (item.meters.data) {
      if (item.meters.data.length > 0) {
        for (let i = 0; i < (company_code==='hy'?1:item.meters.data.length); i++) {
          if (item.meters.data.length === 1) {
            resetMeterData.push({
              ...item, ...item.meters.data[i],
              rowSpan: 1,
              myId: item.meter_number + String(Math.random())
            })
          } else {
            resetMeterData.push({
              ...item, ...item.meters.data[i],
              rowSpan: i === 0 ? item.meters.data.length : 0,
              myId: item.meter_number + String(Math.random())
            })
          }
        }
      } else {
        resetMeterData.push({...item, rowSpan: 1, myId: item.meter_number + String(Math.random())})
      }
    } else {
      resetMeterData.push({...item, rowSpan: 1, myId: item.meter_number + String(Math.random())})
    }
  });
  return resetMeterData
}

exports.parseRowSpanData = parseRowSpanData;

function parseRowSpanData2(data) {
  for (let i = 0; i < data.length; i++) {
    data[i].index = i
  }
  let resetMeterData = []
  data.map((item, index)=> {
    if (item.meters) {
      if (item.meters.length > 0) {
        for (let i = 0; i < item.meters.length; i++) {
          if (item.meters.length === 1) {
            resetMeterData.push({
              ...item, ...item.meters[i],
              meter_difference_value: item.difference_value,
              rowSpan: 1,
              myId: item.meter_number + String(Math.random())
            })
          } else {
            resetMeterData.push({
              ...item, ...item.meters[i],
              meter_difference_value: item.difference_value,
              rowSpan: i === 0 ? item.meters.length : 0,
              myId: item.meter_number + String(Math.random())
            })
          }
        }
      } else {
        resetMeterData.push({
          ...item,
          meter_difference_value: item.difference_value,
          rowSpan: 1,
          myId: item.meter_number + String(Math.random())
        })
      }
    } else {
      resetMeterData.push({
        ...item,
        meter_difference_value: item.difference_value,
        rowSpan: 1,
        myId: item.meter_number + String(Math.random())
      })
    }
  });
  return resetMeterData
}

exports.parseRowSpanData2 = parseRowSpanData2;


function parsehistoryData(data) {
  for (let i = 0; i < data.length; i++) {
    data[i].index = i
  }
  let resetMeterData = []
  data.map((item, index)=> {
    if (item.meters) {
      if (item.meters.length > 0) {
        for (let i = 0; i < item.meters.length; i++) {
          if (item.meters.length === 1) {
            resetMeterData.push({
              ...item, ...item.meters[i],
              meter_difference_value: item.difference_value,
              rowSpan: 1,
              myId: item.meter_number + String(Math.random())
            })
          } else {
            resetMeterData.push({
              ...item, ...item.meters[i],
              meter_difference_value: item.difference_value,
              rowSpan: i === 0 ? item.meters.length : 0,
              myId: item.meter_number + String(Math.random())
            })
          }
        }
      } else {
        resetMeterData.push({
          ...item,
          meter_difference_value: item.difference_value,
          rowSpan: 1,
          myId: item.meter_number + String(Math.random())
        })
      }
    } else {
      resetMeterData.push({
        ...item,
        meter_difference_value: item.difference_value,
        rowSpan: 1,
        myId: item.meter_number + String(Math.random())
      })
    }
  });
  return resetMeterData
}

exports.parsehistoryData = parsehistoryData;

function parseRowSpanData3(data) {
  for (let i = 0; i < data.length; i++) {
    data[i].index = i
  }
  let resetMeterData = []
  data.map((item, index)=> {
    let allrowSpan = 0;
    item.all_meters = []
    for (let k = 0; k < item.temperature_types.length; k++) {
      allrowSpan = allrowSpan + item.temperature_types[k].meters.length;
      item.all_meters.push(...item.temperature_types[k].meters)
    }
    if (item.all_meters.length > 0) {
      for (let j = 0; j < item.all_meters.length; j++) {
        if (item.all_meters.length === 1) {
          resetMeterData.push({
            ...item, ...item.all_meters[j],
            rowSpan: 1,
            myId: item.meter_number + String(Math.random())
          })
        } else {
          resetMeterData.push({
            ...item, ...item.all_meters[j],
            rowSpan: j === 0 ? item.all_meters.length : 0,
            myId: item.meter_number + String(Math.random())
          })

        }
      }
    }
  });
  return resetMeterData
}
exports.parseRowSpanData3 = parseRowSpanData3;

export function GetQueryString(name, search) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = search.substr(1).match(reg);
  if (r != null)return r[2];
  return null;
}

export function fillZero(val) {
  if (Number(val) < 10) {
    return '0' + val
  }
  return val
}
import request from '../utils/request';
import React from "react";
export async function processed_request(params) {
  return request(`/processed_abnormalities`,{
    method:'POST',
    data: {
      ...params,
    },
  });
}

export function addChildById(seach,data) {
  if(!data){
    return false
  }
  return data.map((item) => {
    if(item.village_id===seach.village_parent_id){
      console.log('找到')
      item.children=item.children||[];
      item.children.push({village_id: uuid(),village_name:seach.village_name})
    }else  {
        addChildById(seach,item.children)
    }
    return  item
  });
  // console.log('data',data)
  //
  //
  //
  //
  // for(let i=0;i<data.length;i++){
  //   if(data[i].village_id===item.village_parent_id){
  //     console.log('找到')
  //     // data[i].children.push({village_id: uuid(),village_name:item.village_name})
  //     break
  //   }
  //
  // }
  // return data
}

export function parseHistory(data) {
  if(!data){
    return false
  }
  return data.map((item) => {
    if(item.children&&item.values){
      item.started_at='-'
      item.ended_at='-'
      item.total_difference_value='-'
      item.member_count='-'
      item.night_difference_value='-'
      item.other_value='-'
      item.forward_value='-'
      item.attrition_value='-'
      item.attrition_rate='-'
      item.started_at='-'
      item.uuid=uuid()
      item.children2=parseHistory(item.children)
    }else if(item.values){
      let muaChild=[]
      if(item.values){
        for(let i=0;i<item.values.length;i++){
          muaChild.push({uuid:uuid(),village_name:item.village_name,...item.values[i]})
        }
      }
      return muaChild
    }else{
      let muaChild=[]
      if(item.values){
        for(let i=0;i<item.values.length;i++){
          muaChild.push({uuid:uuid(),village_name:item.village_name,...item.values[i]})
        }
      }
      return muaChild
      // item.values.map((value_item) => {
      //
      //   console.log('value_item',value_item)
      // })
    }
    return  item
  });
}

export function Delayering(data) {
  let parseData=[]
  for(let i=0;i<data.length;i++){
    for(let j=0;j<data[i].values.length;j++){

      parseData.push({uuid:uuid(),...data[i],...data[i].values[j]})
    }
  }
  return parseData
}


export function renderNotification(renderNotificationObj){
  let i=0;
  let percent=0
  let conf={
    key:renderNotificationObj.key,
    message:renderNotificationObj.message,
    placement:'bottomRight',
    duration: 10,
    description:<Progress percent={percent}  size="small" status="active" strokeColor={{
      '0%': '#108ee9',
      '100%': '#87d068',
    }}/>,
    onClick: () => {
      clearInterval(timer)
      console.log('Notification Clicked!');
    },
  }
  notification.open(conf);
  let arr  = new Array(20).fill(0)
  for(let i=0;i<100;i++){
    let num = parseInt(Math.random()*20)
    arr[num] ++
  }
  let timer=setInterval(function () {
    percent=percent+arr[i]
    notification.open({
      key:renderNotificationObj.key,
      message:renderNotificationObj.message,
      placement:'bottomRight',
      duration: 12,
      description:<Progress percent={percent}  size="small" status="active"  strokeColor={{
        '0%': '#108ee9',
        '100%': '#87d068',
      }}/>,
      onClick: () => {
        clearInterval(timer)
        console.log('Notification Clicked!');
      },
    });
    if(i===19){
      console.log('clearInterval(timer)')
      clearInterval(timer)
    }
    i=i+1;
  },500)
}
export function dateIsToday(data) {
  return moment(data).format("YYYY-MM-DD")===moment().format("YYYY-MM-DD");
}

export function todayLastSecond(){
  let todayYear=(new Date()).getFullYear();
  let todayMonth=(new Date()).getMonth();
  let todayDay=(new Date()).getDate();
  return moment(todayYear+'-'+(parseInt(todayMonth)+1)+'-'+todayDay+' 23:59:59' , "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
}
function fixZero(number) {
  if(number<10){
    return '0'+number
  }
  else{
    return  number
  }
}
export function  timeStamp( second_time ){

  let time ="0d "+"00:00:"+fixZero(parseInt(second_time));
  if( parseInt(second_time )> 59){

    let second = fixZero(parseInt(second_time) % 60);
    let min = fixZero(parseInt(second_time / 60));
    time ="0d "+"00:"+min+":"+second;

    if( min > 59 ){
      min = fixZero(parseInt(second_time / 60) % 60);
      let hour = fixZero(parseInt( parseInt(second_time / 60) /60 ));
      time ="0d "+hour+":"+min+":"+second;

      if( hour > 23 ){
        hour =fixZero( parseInt( parseInt(second_time / 60) /60 ) % 24);
        let day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );
        time =day+"d "+hour+":"+min+":"+second;
      }
    }


  }

  return time;
}
