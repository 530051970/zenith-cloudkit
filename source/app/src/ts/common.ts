export const AMPLIFY_CONFIG_JSON = '__sdps_solution_amplify_config_json__';
export const BACKEND_URL_KEY = 'BACKEND_URL';

export const ZH_LANGUAGE_LIST = ['zh'];
export const GIHUB_REPO_LINK =
  'https://github.com/awslabs/sensitive-data-protection-on-aws';

export const CN_DOC_LINK =
  'https://awslabs.github.io/sensitive-data-protection-on-aws/zh';
export const EN_DOC_LINK =
  'https://awslabs.github.io/sensitive-data-protection-on-aws/en';
export interface ColumnList {
  id: string;
  label: string;
  sortingField?: any;
  filter: boolean;
}

export const buildDocLink = (lang: string, url?: string) => {
  if (ZH_LANGUAGE_LIST.includes(lang)) {
    return CN_DOC_LINK + (url ?? '');
  }
  return EN_DOC_LINK + (url ?? '');
};

export interface FilteringOptionsTypes {
  propertyKey: string;
  value: string;
}

export const nFormatter = (num: any, digits: any) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0';
};
