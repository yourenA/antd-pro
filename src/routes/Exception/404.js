import React from 'react';
import { Link } from 'dva/router';
import Exception from '../../components/Exception';

export default ({desc}) => (
  <Exception type="404" style={{ minHeight: 500, height: '80%' }} desc={desc} linkElement={Link} />
);
