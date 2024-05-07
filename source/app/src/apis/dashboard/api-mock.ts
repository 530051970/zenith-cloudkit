import { IRegionDataType } from "ts/dashboard/types";

// import { apiRequest } from 'tools/apiRequest';
type MockRes = {
  status: string;
  code: number;
  message: string;
  data?: object
};


/**
 * Get Accounts Information
 * @param params
 * @returns
 */
const getAccountInformation = async () => {
  // const result = await apiRequest(
  //   'get',
  //   'catalog/dashboard/agg-data-source-summary',
  //   ''
  // );
  // let res:MockRes ={
  //   status: 'success',
  //   code: 1001,
  //   message: 'Operation Success'
  // }
  // res.data = {
  //   "account_total": 2,
  //   "region_total": 1
  // }
  return {
    "account_total": 2,
    "region_total": 1
  };
};

/**
 * Get Latest Job Time
 * @returns
 */
const getLatestJobTime = async () => {
  // const result = await apiRequest('get', 'discovery-jobs/last-job-time', '');
  return {};
};

/**
 * Get Catalog Summary
 * @param params
 * @returns
 */

const getDataCatalogSummary = async (params: any) => {
  // const result = await apiRequest(
  //   'get',
  //   'catalog/dashboard/agg-catalog-summay',
  //   params
  // );
  return {};
};

const getCatalogSummaryByRegion = async (params: any) => {
  // const result = await apiRequest(
  //   'get',
  //   'catalog/dashboard/agg-catalog-summay-by-region',
  //   params
  // );
  // export interface IRegionDataType {
  //   database_total: number;
  //   object_total: number;
  //   pii_table_total: number;
  //   region: string;
  //   size_total: number;
  //   table_total: number;
  
  //   column_total: 67;
  //   instance_total: 1;
  // }
  return [{"region": "cn-noreast-1","database_total":10,"object_total":203,"size_total":546786,"table_total":71}];
};

/**
 * Get catalog summary privacy
 * @param params
 * @returns
 */

const getCatalogSummaryByPrivacy = async (params: any) => {
  // const result = await apiRequest(
  //   'get',
  //   'catalog/dashboard/agg-catalog-summay-by-privacy',
  //   params
  // );
  // export interface IPrivacyPieChartType {
  //   instance_total: number;
  //   database_total: number;
  //   object_total: number;
  //   pii_table_total: number;
  //   privacy: number;
  //   size_total: number;
  //   table_total: number;
  // }
  return [{
    "privacy": -1,
    "database_total": 1,
    "object_total": 9,
    "size_total": 1550,
    "table_total": 9
  },
  {
    "privacy": 0,
    "database_total": 3,
    "object_total": 27,
    "size_total": 868332,
    "table_total": 8
  },
  {
    "privacy": 1,
    "database_total": 14,
    "object_total": 167,
    "size_total": 52121550,
    "table_total": 54
  }
];
};

/**
 * Get catalog summary by modify
 * @param params
 * @returns
 */
const getCatalogSummaryByModifier = async (params: any) => {
  // const result = await apiRequest(
  //   'get',
  //   'catalog/dashboard/agg-catalog-summary-by-modifier',
  //   params
  // );
  return [{
    "modifier": "Manual",
    "data_sources":1
  },
  {
    "modifier": "System",
    "data_sources":2
  }];
};

/**
 * Get catalog top n data
 * @param params
 * @returns
 */
const getCatalogTopNData = async (params: any) => {
  // const result = await apiRequest(
  //   'get',
  //   'catalog/dashboard/agg-catalog-top-n',
  //   params
  // );
  return {};
};

export {
  getAccountInformation,
  getDataCatalogSummary,
  getCatalogSummaryByPrivacy,
  getCatalogSummaryByModifier,
  getCatalogTopNData,
  getLatestJobTime,
  getCatalogSummaryByRegion,
};
