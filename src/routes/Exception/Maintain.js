import React from 'react';
import { Link } from 'dva/router';
import Exception from '../../components/Exception';

export default () => (
  <Exception type="403" style={{ minHeight: 500, height: '80%' }} desc={'系统正在维护......'}  linkElement={Link} actions={<div></div>} />
);