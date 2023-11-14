export const BADGE_TYPE = {
  Privacy: 'privacy',
  Classified: 'classifiedby',
  DataIndf: 'dataIndf',
};

export const PRIVARY_TYPE = {
  ContainsPII: 'Contain-PII',
  NonPII: 'Non-PII',
};

export const CLSAAIFIED_TYPE = {
  System: 'System',
  Manual: 'Manual',
  SystemMark: 'System(?)',
  Success: 'Success',
  Unconnected: 'Unconnected',
  Failed: 'Failed',
  Completed: 'Completed',
  Stopped: 'Stopped',
  Crawling: 'Crawling',
};

export const PRIVARY_TYPE_DATA = {
  ContainsPII: '1',
  NonPII: '0',
};

export const PRIVARY_TYPE_INT_DATA = {
  '-1': 'N/A',
  [PRIVARY_TYPE_DATA.NonPII]: PRIVARY_TYPE.NonPII,
  [PRIVARY_TYPE_DATA.ContainsPII]: PRIVARY_TYPE.ContainsPII,
  [PRIVARY_TYPE.ContainsPII]: PRIVARY_TYPE_DATA.ContainsPII,
  [PRIVARY_TYPE.NonPII]: PRIVARY_TYPE_DATA.NonPII,
  'N/A': '-1',
};
