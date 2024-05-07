import _ from 'lodash';
import { DependencyList, useEffect, useRef } from 'react';
import { AlertType } from 'ts/common-alert/types';

export const deepClone = (data: any) => {
  if (!data || typeof data !== 'object') {
    return data;
  }
  return _.cloneDeep(data);
};

export const formatSize = (size: string | number) => {
  if (!size) {
    return '-';
  }
  if (typeof size === 'string') {
    size = parseInt(size);
  }
  let result = '';
  if (size < 0.1 * 1024) {
    //小于0.1KB，则转化成B
    result = size.toFixed(1) + 'B';
  } else if (size < 0.1 * 1024 * 1024) {
    //小于0.1MB，则转化成KB
    result = (size / 1024).toFixed(1) + 'KB';
  } else if (size < 0.1 * 1024 * 1024 * 1024) {
    //小于0.1GB，则转化成MB
    result = (size / (1024 * 1024)).toFixed(1) + 'MB';
  } else {
    //其他转化成GB
    result = (size / (1024 * 1024 * 1024)).toFixed(1) + 'GB';
  }

  const resultStr = result + ''; //转成字符串
  const index = resultStr.indexOf('.'); //获取小数点处的索引
  const dou = resultStr.substr(index + 1, 2); //获取小数点后两位的值
  if (dou === '00') {
    //判断后两位是否为00，如果是则删除00
    return resultStr.substring(0, index) + resultStr.substr(index + 3, 2);
  }
  return result;
};

export const alertMsg = (alertTxt: string, alertType: AlertType) => {
  const patchEvent = new CustomEvent('showAlertMsg', {
    detail: {
      alertTxt,
      alertType,
    },
  });
  window.dispatchEvent(patchEvent);
};

export const showHideSpinner = (isShow: boolean) => {
  const patchEvent = new CustomEvent('showSpinner', {
    detail: {
      isShow,
    },
  });
  window.dispatchEvent(patchEvent);
};

export const formatNumber = (num: number) => {
  const units = ['', 'K', 'M', 'B', 'T', 'Q'];

  for (let i = units.length - 1; i >= 0; i--) {
    const decimal = Math.pow(1000, i);

    if (num >= decimal) {
      return (num / decimal).toFixed(1).replace(/\.0$/, '') + units[i];
    }
  }

  return num.toString();
};

export const downloadFun = (content: BlobPart, filename: string) => {
  // 创建隐藏的可下载链接 A 标签
  const dom = document.createElement('a');
  dom.download = filename || '未命名文件';
  // 隐藏
  dom.style.display = 'none';
  // 将字符内容转换为成 blob 二进制
  const blob = new Blob([content]);
  // 创建对象 URL
  dom.href = URL.createObjectURL(blob);
  // 添加 A 标签到 DOM
  document.body.appendChild(dom);
  // 模拟触发点击
  dom.click();
  // 移除 A 标签
  document.body.removeChild(dom);
};

export const WEEK_CONFIG: any = {
  L: 'SAT',
  SUN: 'MON',
  MON: 'TUE',
  TUE: 'WED',
  WED: 'THU',
  THU: 'FRI',
  FRI: 'SAT',
  SAT: 'SUN',
};

export const SUB_WEEK_CONFIG: any = {
  SUN: 'SAT',
  MON: 'SUN',
  TUE: 'MON',
  WED: 'TUE',
  THU: 'WED',
  FRI: 'THU',
  SAT: 'FRI',
};

export const getCronData = (cron: string | undefined | null) => {
  if (!cron) {
    return '-';
  }
  const tempSchedule = cron.split(' ');
  const startHour =
    parseInt(tempSchedule[1]) >= 16
      ? parseInt(tempSchedule[1]) - 24
      : parseInt(tempSchedule[1]);
  if (tempSchedule[2] === '*' && tempSchedule[3] === '*') {
    return `By daily, start: ${
      startHour + 8 >= 10 ? startHour + 8 : '0' + (startHour + 8).toString()
    }:00`;
  }
  if (tempSchedule[2] === '?' && tempSchedule[3] === '*') {
    return `By weekly, start: ${WEEK_CONFIG[tempSchedule[4]]}`;
  }
  if (
    tempSchedule[2] === '*' &&
    tempSchedule[3] !== '*' &&
    tempSchedule[3] !== '?'
  ) {
    return `By monthly, start: ${
      tempSchedule[3] === 'L' ? '1' : parseInt(tempSchedule[3]) + 1
    }`;
  }
  if (
    tempSchedule[2] === '*' &&
    tempSchedule[3] !== '*' &&
    tempSchedule[3] === '?'
  ) {
    return `By daily, start: ${startHour + 8}h`;
  }
  return cron;
};

export const toJSON = (data: string) => {
  if (!data) {
    return null;
  }
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return { [data]: 1 };
    }
  }
  return data;
};

export const toJsonList = (data: string) => {
  if (!data) {
    return null;
  }
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return data.split(',');
    }
  }
  return data;
};

export const useDidUpdateEffect = (
  fn: () => void,
  inputs: DependencyList | undefined
) => {
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, inputs);
};

export const numberFormat = (value: { toString: () => string }) => {
  if (!value) return '0';

  // 获取整数部分的数字
  const intPart = Number(value).toFixed(0);
  // 将整数部分逢三一断
  const intPartFormat = intPart
    .toString()
    .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  // 预定义小数部分
  let floatPart = '.00';
  const value2Array = value.toString().split('.');

  // =2表示数据有小数位
  if (value2Array.length === 2) {
    floatPart = value2Array[1].toString(); // 拿到小数部分
    if (floatPart.length === 1) {
      // 补0
      return intPartFormat + '.' + floatPart + '0';
    } else {
      return intPartFormat + '.' + floatPart;
    }
  } else {
    return intPartFormat;
  }
};
