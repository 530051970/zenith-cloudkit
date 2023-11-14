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

export const TABLE_NAME = {
  SOURCE_S3_BUCKET: 'source_s3_bucket',
  SOURCE_ACCOUNT: 'source_account',
  SOURCE_RDS_INSTANCE: 'source_rds_instance',
  DISCOVERY_JOB: 'discovery_job',
  DISCOVERY_JOB_DATABASE: 'discovery_job_database',
  CATALOG_TABLE_LEVEL_CLASSIFICATION: 'catalog_table_level_classification',
  CATALOG_DATABASE_LEVEL_CLASSIFICATION:
    'catalog_database_level_classification',
  TEMPLATE_IDENTIFIER: 'template_identifier',
  TEMPLATE_MAPPING: 'template_mapping',
};
