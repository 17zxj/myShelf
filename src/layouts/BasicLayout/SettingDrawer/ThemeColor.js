import React from 'react';
import { Tooltip, Icon } from 'antd';
import styles from './ThemeColor.less';

const Tag = ({ color, check, ...rest }) => (
  <div{...rest} style={{ backgroundColor: color }}>
    {check ? <Icon type="check"/> : ''}
  </div>
);

const ThemeColor = ({ colors, title, value, onChange }) => {
  let colorList = colors;
  if (!colors) {
    colorList = [
      { key: 'sunset', title: '日暮', color: '#fe7e27' },
      { key: 'cyan', title: '明青', color: '#14c2d1' },
      { key: 'green', title: '极光绿', color: '#00b73c' },
      { key: 'daybreak', title: '拂晓蓝(默认)', color: '#1890ff' },
      { key: 'purple', title: '酱紫', color: '#665eff' },
    ];
  }
  return (
    <div className={styles.themeColor}>
      <h3 className={styles.title}>{title}</h3>
      <div>
        {colorList.map(({ key, title, color }) => (
          <Tooltip key={color} title={title}>
            <Tag
              className={styles.colorBlock}
              color={color}
              check={value === key}
              onClick={() => onChange && onChange(key)}
            />
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default ThemeColor;
