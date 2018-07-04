import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import navData from '../common/nav';
import {message,Badge,Tooltip} from 'antd'
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

const removeLoginStorage = () => {
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
  return (current && current > moment().add(-1, 'days')) || (current && current < moment('2017-10-01'));
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

  return [moment(year + '-' + month + '-' + '0', 'YYYY-MM-DD'), moment(year + '-' + month + '-' + day, 'YYYY-MM-DD')]
}

export function getPreDay() {
  return [moment().add(-1, 'days'), moment(new Date(), 'YYYY-MM-DD')]
}

const errorNumber='141414'
exports.errorNumber = errorNumber;

function renderIndex(meta,page,index) {
  const parseIndex=meta?String((meta.pagination.per_page*(page-1))+(index + 1)):0;
  return (
    <span title={parseIndex} >
                {parseIndex.length>4?parseIndex.substring(0,3)+'...':parseIndex}
            </span>
  )
}

exports.renderIndex = renderIndex;

function renderIndex2(meta,page,index) {
  const parseIndex=meta?String((meta.pagination.per_page*(page-1))+(index + 1)):0;
  return (
    <span title={parseIndex} >
                {parseIndex.length>4?parseIndex.substring(0,3)+'...':parseIndex}
            </span>
  )
}

exports.renderIndex2 = renderIndex2;

function renderErrorData(val,error=errorNumber) {
  if(val.toString().indexOf(error)>=0){
    return '异常数据'
  }
  return val

}

exports.renderErrorData = renderErrorData;

export function renderCustomHeaders(headers,meta,page) {
  let  custom_width=50;
  let custom_headers=[{
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    width: 50,
    className: 'table-index',
    fixed: 'left',
    render: (text, record, index) => {
      return renderIndex(meta,page,index)
    }
  }];
  headers&&headers.forEach((item, index)=> {
    custom_width =custom_width+ item.size;
    /*if(item.key==='install_address'){
      custom_headers.push({
          title: item.display_name,
          dataIndex: item.key,
          key: item.key,
          width: index === headers.length - 1 ? '' : item.size,
          render: (val, record, index) => (
            <Tooltip title={val}>
              <span>{val.length>10?val.substring(0,7)+'...':val}</span>
            </Tooltip>
          )
        })
    }else if(item.key==='real_name'){
      custom_headers.push({
        title: item.display_name,
        dataIndex: item.key,
        key: item.key,
        width: index === headers.length - 1 ? '' : item.size,
        render: (val, record, index) => {
          return ellipsis(val,3)
        }
      })
    }else */
    if (item.key === 'status_explain') {
      custom_headers.push({
        title: item.display_name,
        dataIndex: item.key,
        key: item.key,
        width: index === headers.length - 1 ? '' : item.size,
        render: (val, record, index) => {
          let status='success';
          switch (record.status){
            case -2:
              status='error'
              break;
            case -1:
              status='warning'
              break;
            default:
              status='success'
          }
          return (
            <p>
              <Badge status={status}/>{val}
            </p>
          )
        }
      })
    }else if(item.key === 'latest_value'||item.key === 'previous_value'){
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
          return ellipsis2(val,item.size-5)
        }
      })
    }
  })

  return {custom_headers,custom_width}
}
export function ellipsis(val,len=8) {
  if(val){
    return (
      <Tooltip title={val}>
        <span>{val.length>len?val.substring(0,len)+'...':val}</span>
      </Tooltip>
    )
  }else{
    return ''
  }

}

export function ellipsis2(val,len=150) {
  if(val!==undefined){
    return (
      <Tooltip arrowPointAtCenter
               title={<p style={{wordWrap: 'break-word'}}>{val}</p>}>
        <p style={{
          display:'inline-block',
          width: `${len-15}px`,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>{val}</p>
      </Tooltip>
    )
  }else{
    return ''
  }

}
exports.ellipsis2 = ellipsis2;
export function searchFormItemLayout() {
  return {
    labelCol: {
      span:6
    },
    wrapperCol: {
      span:18
    }
  };
}


function renderRowSpan(children,record) {
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
  for (let i = 0; i < data.length; i++) {
    data[i].index = i
  }
  let resetMeterData = []
  data.map((item, index)=> {
    if(item.meters.data){
      if(item.meters.data.length>0){
        for (let i = 0; i < item.meters.data.length; i++) {
          if (item.meters.data.length === 1) {
            resetMeterData.push({...item, ...item.meters.data[i], rowSpan: 1})
          } else {
            resetMeterData.push({...item, ...item.meters.data[i], rowSpan: i === 0 ? item.meters.data.length : 0})
          }
        }
      }else{
        resetMeterData.push({...item, rowSpan: 1})
      }
    }else{
      resetMeterData.push({...item, rowSpan: 1})
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
    if(item.meters){
      if(item.meters.length>0){
        for (let i = 0; i < item.meters.length; i++) {
          if (item.meters.length === 1) {
            resetMeterData.push({...item, ...item.meters[i], meter_difference_value:item.difference_value,rowSpan: 1})
          } else {
            resetMeterData.push({...item, ...item.meters[i],meter_difference_value:item.difference_value, rowSpan: i === 0 ? item.meters.length : 0})
          }
        }
      }else{
        resetMeterData.push({...item,meter_difference_value:item.difference_value, rowSpan: 1})
      }
    }else{
      resetMeterData.push({...item, meter_difference_value:item.difference_value,rowSpan: 1})
    }
  });
  return resetMeterData
}

exports.parseRowSpanData2 = parseRowSpanData2;

export function  GetQueryString(name,search){
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = search.substr(1).match(reg);
  if(r!=null)return r[2]; return null;
}

export function  fillZero(val){
  if(Number(val)<10){
    return '0'+val
  }
  return val
}
