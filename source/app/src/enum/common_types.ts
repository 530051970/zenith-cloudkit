export const LOGIN_TYPE = {
  USER: 'user',
  SNS: 'sns',
  OIDC: 'oidc',
};

export const LOGIN_TYPE_LABEL = {
  USER: 'Username',
  SNS: 'SNS Code',
  OIDC: 'OIDC',
};

export const THIRD_LOGIN_TYPE = {
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  LINKEDIN: 'linkedin',
};

export const BADGE: Map<string, any> = new Map<string, any>([
  ['1', {color:"blue", name:"数据处理"}],
  ['2', {color:"red", name:"人工智能"}]
]);


export const REGION_TYPE = {
  CN_NORTH1: 'cn-north-1',
  CN_NORTHWEST1: 'cn-northwest-1',
};

export const TAB_LIST = {
  S3: { label: 'Amazon S3', id: 's3' },
  RDS: { label: 'Amazon RDS', id: 'rds' },
  CN_NORTH1: { label: REGION_TYPE.CN_NORTH1, id: REGION_TYPE.CN_NORTH1 },
  CN_NORTHWEST1: {
    label: REGION_TYPE.CN_NORTHWEST1,
    id: REGION_TYPE.CN_NORTHWEST1,
  },
};

export const DATA_TYPE_ENUM = {
  s3: 's3',
  rds: 'rds',
};
