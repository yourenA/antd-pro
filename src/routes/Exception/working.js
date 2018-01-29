import React from 'react';
import { Link } from 'dva/router';
import Exception from '../../components/Exception';

export default () => (
  <Exception type="404" style={{ minHeight: 500, height: '80%' }} desc={'页面正在开发中......'} linkElement={Link} />
);
