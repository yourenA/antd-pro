import React from 'react';
import classNames from 'classnames';
import { Row } from 'antd';
import styles from './index.less';

export default ({ className, title, col = 3, layout = 'horizontal', gutter = 32,
  children, size, ...restProps }) => {
  const clsString = classNames(styles.descriptionList, styles[layout], className, {
    [styles.descriptionListSmall]: size === 'small',
    [styles.descriptionListLarge]: size === 'large',
  });
  const column = col > 4 ? 4 : col;
  /**
   *  React 提供一个工具方法 React.Children 来处理 this.props.children 。我们可以用 React.Children.map 来遍历子节点
   */
  /**
   * react提供了一个克隆 API：
   * React.cloneElement(
   * element,
   * [props],
   * [...children]
   * )
   * */
  return (
    <div className={clsString} {...restProps}>
      {title ? <div className={styles.title}>{title}</div> : null}
      <Row gutter={gutter}>
        {React.Children.map(children, child => React.cloneElement(child, { column }))}
      </Row>
    </div>
  );
};
