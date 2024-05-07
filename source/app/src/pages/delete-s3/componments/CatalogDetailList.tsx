import React, { memo, useEffect, useState } from 'react';
import {
  Table,
  Box,
  Icon,
  Pagination,
  CollectionPreferences,
  Select,
  SelectProps,
  Popover,
  StatusIndicator,
  Badge,
  Textarea,
  Multiselect,
  TextFilter,
} from '@cloudscape-design/components';
import CommonBadge from 'pages/common-badge';
import SchemaModal from './SchemaModal';
import {
  BADGE_TYPE,
  CLSAAIFIED_TYPE,
} from 'pages/common-badge/types/badge_type';
import { COLUMN_OBJECT_STR, UPDATE_FLAG } from '../types/data_config';
import { CatalogDetailListProps } from '../../../ts/data-catalog/types';
import '../style.scss';
import ResourcesFilter from 'pages/resources-filter';
import {
  getDatabaseIdentifiers,
  // getTablesByDatabase,
  getTablesByDatabaseIdentifier,
  getColumnsByTable,
  getS3SampleObjects,
  getBucketProperties,
  searchTablesByDatabase,
} from 'apis/data-catalog/api';
import { alertMsg, formatSize, toJSON } from 'tools/tools';
import moment from 'moment';
import {
  CONTAINS_PII_OPTION,
  NA_OPTION,
  NON_PII_OPTION,
} from 'pages/common-badge/componments/Options';
import { deepClone } from 'tools/tools';
import { TABLE_NAME } from 'enum/common_types';
import { getIdentifiersList } from 'apis/data-template/api';
import { nFormatter } from 'ts/common';
import { useTranslation } from 'react-i18next';
import { Props } from 'common/PropsModal';

const CatalogDetailList: React.FC<CatalogDetailListProps> = memo(
  (props: CatalogDetailListProps) => {
    const {
      catalogType,
      selectRowData,
      columnList,
      needFilter = false,
      needByPage = false,
      detailDesHeader,
      detailDesInfo,
      needSchemaModal = false,
      tagId,
      clickTableCountProp,
      clickIdentifiers,
      selectPageRowData,
      setUpdateData,
      previewDataList,
      setSaveLoading,
      setSaveDisabled,
      isFreeText,
    } = props;

    const { t } = useTranslation();

    const [currentPage, setCurrentPage] = useState(1);

    const [selectDetailRowData, setSelectDetailRowData] = useState({}); //click row data
    const [isLoading, setIsLoading] = useState(false);
    const [showSchemaModal, setShowSchemaModal] = useState(false);
    const [dataList, setDataList] = useState([] as any);
    const [totalCount, setTotalCount] = useState(0);
    const [identifiersFilter, setIdentifiersFilter] =
      useState(clickIdentifiers);
    const [editIndentifier, setEditIndentifier] = useState(null as any);
    const [editPrivacy, setEditPrivacy] = useState(null as any);
    const [selectIndentOption, setSelectIndentOption] = useState<any>([]);
    const [selectPrivacyOption, setSelectPrivacyOption] = useState(
      null as SelectProps.Option | null
    );
    const [nameFilterText, setNameFilterText] = useState('');
    const [preferences, setPreferences] = useState({
      pageSize: 20,
      wrapLines: true,
      visibleContent: columnList.map((o) => o.id),
    } as any);
    const [query, setQuery] = useState({
      tokens: [],
      operation: 'and',
    } as any);
    const [identifierOptions, setIdentifierOptions] = useState([] as any);
    const resourcesFilterProps = {
      totalCount,
      query,
      setQuery,
      tableName: TABLE_NAME.CATALOG_TABLE_LEVEL_CLASSIFICATION,
      columnList: columnList.filter((i) => i.filter),
      filteringPlaceholder: t('catalog:detail.filterCatalogs'),
    };

    const [editComments, setEditComments] = useState(null as any);

    // click Forder or database name to schema
    const clickFolderName = (data: any) => {
      const rowData = {
        ...data,
        name: data.table_name,
      };
      setSelectDetailRowData(rowData);
      setShowSchemaModal(true);
      return;
    };

    const updateFatherPage = () => {
      getPageData();
    };

    const schemaModalProps = {
      showSchemaModal,
      setShowSchemaModal,
      selectRowData: selectDetailRowData,
      catalogType,
      selectPageRowData: selectRowData,
      setSelectRowData: setSelectDetailRowData,
      updateFatherPage,
    };

    const clickEditIcon = (rowData: any, type: string) => {
      setSaveDisabled && setSaveDisabled(false);
      if (type === COLUMN_OBJECT_STR.Identifier) {
        setEditIndentifier(rowData);
        setEditPrivacy(null);
        setEditComments(null);
        setSelectIndentOption([]);
      }
      if (type === COLUMN_OBJECT_STR.Privacy) {
        setEditPrivacy(rowData);
        setEditIndentifier(null);
        setEditComments(null);
        setSelectPrivacyOption(null);
      }
      if (type === COLUMN_OBJECT_STR.Comments) {
        setEditComments(rowData);
        setEditIndentifier(null);
        setEditPrivacy(null);
        setSelectPrivacyOption(null);
        setSelectIndentOption([]);
      }
      return;
    };

    // useEffect(() => {
    //   getPageData();
    // }, []);

    useEffect(() => {
      getPageData(nameFilterText);
    }, [query, currentPage, nameFilterText, preferences.pageSize]);

    // useEffect(() => {
    //   if (currentPage !== 1) {
    //     setCurrentPage(1);
    //   } else {
    //     getPageData();
    //   }
    // }, [preferences.pageSize]);

    const getPageData = async (nameFilter?: string) => {
      setIsLoading(true);
      switch (tagId) {
        case 'dataIdentifiers':
          await getDataIdentifiers();
          break;
        case COLUMN_OBJECT_STR.Folders:
          await getDataFolders(nameFilter || '');
          break;
        case COLUMN_OBJECT_STR.Tables:
          await getDataFolders(nameFilter || '');
          break;
        case COLUMN_OBJECT_STR.Schema:
          setSaveLoading(true);
          await Promise.all([getDataSchema(), getIdentifierOptions()]);
          setSaveLoading(false);
          break;
        case COLUMN_OBJECT_STR.SampleObjects:
          await getDataSampleObjects();
          break;
        case COLUMN_OBJECT_STR.DataPreview:
          await getDataPreview();
          break;
        case COLUMN_OBJECT_STR.BucketProperties:
          await getPropertiesData();
          break;
        default:
          break;
      }
      setIsLoading(false);
    };

    const getIdentifierOptions = async () => {
      const requestParam = {
        page: currentPage,
        size: 100,
        sort_column: '',
        asc: false,
        conditions: [] as any,
      };
      const optList: any = await getIdentifiersList(requestParam);
      if (!optList || !optList.items) {
        return;
      }
      const setOptList = optList.items.map(
        (item: { id: any; name: string }) => {
          return {
            label: item.name,
            value: item.name,
          };
        }
      );
      setOptList.push({
        label: 'N/A',
        value: 'N/A',
      });
      setIdentifierOptions(setOptList);
    };

    const getPropertiesData = async () => {
      const requestParam = {
        account_id: selectRowData.account_id,
        region: selectRowData.region,
        database_type: selectRowData.database_type,
        database_name: selectRowData.database_name,
      };
      const result: any = await getBucketProperties(requestParam);
      if (result && result.length >= 0) {
        const tempPropertiesData = [] as any[];
        result.forEach((item: any[]) => {
          if (item[0] === 'CreationDate') {
            tempPropertiesData.push({
              property: item[0],
              value: item[1]
                ? moment(item[1]).add(8, 'h').format('YYYY-MM-DD HH:mm')
                : item[1],
            });
          } else if (item[0] === 'Tags') {
            tempPropertiesData.push({
              property: item[0],
              isTag: true,
              value: item[1],
            });
          } else {
            tempPropertiesData.push({
              property: item[0],
              value:
                item[1] !== undefined && item[1] !== null
                  ? item[1].toString()
                  : item[1],
            });
          }
        });
        setDataList(tempPropertiesData);
      }
      return;
    };

    const getDataPreview = () => {
      setDataList(previewDataList);
    };

    const getDataSampleObjects = async () => {
      const requestParam = {
        account_id: selectRowData.account_id,
        region: selectRowData.region,
        s3_location: selectRowData.storage_location,
        limit: 10,
      };
      const result = await getS3SampleObjects(requestParam);
      if (typeof result !== 'object') {
        alertMsg(result as any, 'error');
        return;
      }
      setDataList(result);
    };

    const getDataIdentifiers = async () => {
      const requestParam = {
        account_id: selectRowData.account_id,
        region: selectRowData.region,
        database_type: selectRowData.database_type,
        database_name: selectRowData.database_name,
        page: currentPage,
        size: preferences.pageSize,
      };
      const result: any = await getDatabaseIdentifiers(requestParam);
      if (typeof result !== 'object') {
        alertMsg(result as any, 'error');
        return;
      }
      // frontend pagination
      const start = (currentPage - 1) * preferences.pageSize;
      setDataList(result.slice(start, start + preferences.pageSize));
      setTotalCount(result.length);
    };

    const clearIdentifiersFilter = () => {
      setIdentifiersFilter('');
      getPageData();
    };

    const getDataFolders = async (nameFilter?: string) => {
      try {
        const requestParam: any = {
          account_id: selectRowData.account_id,
          region: selectRowData.region,
          database_type: selectRowData.database_type,
          database_name: selectRowData.database_name,
          table_name: nameFilter,
          page: currentPage,
          size: preferences.pageSize,
        };

        let result: any;
        if (identifiersFilter) {
          requestParam.identifier = identifiersFilter;
          result = await getTablesByDatabaseIdentifier(requestParam);
        } else {
          const requestBody: any = {
            page: currentPage,
            size: preferences.pageSize,
            sort_column: '',
            asc: true,
            conditions: [
              {
                column: 'account_id',
                values: [`${selectRowData.account_id}`],
                condition: 'and',
              },
              {
                column: 'region',
                values: [`${selectRowData.region}`],
                condition: 'and',
              },
              {
                column: 'database_type',
                values: [`${selectRowData.database_type}`],
                condition: 'and',
              },
              {
                column: 'database_name',
                values: [`${selectRowData.database_name}`],
                condition: 'and',
              },
            ],
          };
          // account_id region database_type database_name table_name
          query.tokens &&
            query.tokens.forEach((item: any) => {
              if (item.propertyKey === 'privacy') {
                const convertMap: any = {
                  'Contain-PII': 1,
                  'Non-PII': 0,
                  'N/A': -1,
                };
                requestBody.conditions.push({
                  column: 'privacy',
                  values: [convertMap[item.value]],
                  condition: 'and',
                  operation: item.operator,
                });
              } else {
                requestBody.conditions.push({
                  column: 'table_name',
                  values: [`${item.value}`],
                  condition: 'and',
                  operation: ':',
                });
              }
            });
          result = await searchTablesByDatabase(requestBody);
        }
        if (result && result.items) {
          setDataList(result.items);
          setTotalCount(result.total);
        }
      } catch (e) {
        console.error(e);
      }
    };

    const getDataSchema = async () => {
      const requestParam = {
        account_id: selectPageRowData.account_id,
        region: selectPageRowData.region,
        database_type: catalogType,
        database_name: selectPageRowData.database_name,
        table_name: selectRowData.table_name,
        page: currentPage,
        size: preferences.pageSize,
      };
      const result: any = await getColumnsByTable(requestParam);
      setTotalCount(result.total);
      setDataList(result.items);
    };

    const clickTableCount = (rowData: any) => {
      clickTableCountProp && clickTableCountProp(rowData);
    };

    const updateSelectChange = (
      tempOption: SelectProps.Option | null | any,
      tempRowData: any,
      editType: string
    ) => {
      const tempDataList = deepClone(dataList);
      const tempData = tempDataList.filter(
        (item: { id: any }) => item.id === tempRowData.id
      );
      if (editType === COLUMN_OBJECT_STR.Privacy) {
        setSelectPrivacyOption(tempOption);
        if (tempData && tempData.length > 0) {
          tempData[0][COLUMN_OBJECT_STR.Privacy] = tempOption?.value;
          tempData[0][UPDATE_FLAG] = true;
        }
      } else if (editType === COLUMN_OBJECT_STR.Identifier) {
        if (tempData && tempData.length > 0) {
          console.info('tempOption:', tempOption);
          const selectedIdentifiers = tempOption.map(
            (element: any) => element.value
          );
          // tempData[0][COLUMN_OBJECT_STR.Identifier] = selectedIdentifiers;
          const parseObj = selectedIdentifiers.reduce(
            (acc: any, curr: string) => {
              acc[curr] = '1';
              return acc;
            },
            {}
          );
          tempData[0][COLUMN_OBJECT_STR.Identifier] = JSON.stringify(parseObj);
          //   tempData[0][COLUMN_OBJECT_STR.Identifier] =
          //     tempOption?.iconSvg.props.badgeLabel;
          tempData[0][UPDATE_FLAG] = true;
        }
      } else {
        if (tempData && tempData.length > 0) {
          tempData[0][COLUMN_OBJECT_STR.Comments] = tempOption;
          tempData[0][UPDATE_FLAG] = true;
        }
      }
      setDataList(tempDataList);
      setUpdateData(tempDataList);
    };

    return (
      <div className="catalog-detail-list">
        {identifiersFilter && (
          <div className="filter-identifiers">
            <span className="title-identifiers">
              {t('catalog:detail.identifier')} {identifiersFilter}
            </span>
            <div className="clear-identifiers" onClick={clearIdentifiersFilter}>
              <Icon name="close" alt="clear" size="small" />
            </div>
          </div>
        )}
        <div className="pd-10">
          <Table
            variant="embedded"
            loading={isLoading}
            // wrapLines
            columnDefinitions={
              columnList.map((item) => {
                return {
                  id: item.id,
                  header: t(item.label),
                  width:
                    tagId === COLUMN_OBJECT_STR.Schema &&
                    item.id === COLUMN_OBJECT_STR.Identifier
                      ? 300
                      : item.id === COLUMN_OBJECT_STR.Identifier
                      ? 220
                      : '',
                  // different column tag
                  cell: (e: any) => {
                    if (
                      e.property === 'Tags' &&
                      e.isTag &&
                      item.id === 'value'
                    ) {
                      if (e.value !== 'N/A') {
                        const tags = JSON.parse(JSON.stringify(e.value));
                        return tags.map((element: any, index: number) => {
                          return (
                            <div key={index} className="mb-5">
                              <Badge>{JSON.stringify(element)}</Badge>
                            </div>
                          );
                        });
                      } else {
                        return 'N/A';
                      }
                    }
                    if (item.id === 's3objects') {
                      if (!(e as any)['s3_full_path']) {
                        return '';
                      }
                      const pathList = (e as any)['s3_full_path'].split('/');
                      return pathList[pathList.length - 1];
                    }
                    if (
                      item.id === 'size' ||
                      item.id === COLUMN_OBJECT_STR.Size ||
                      item.id === 'file_size'
                    ) {
                      return formatSize((e as any)[item.id]);
                    }
                    if (item.id === COLUMN_OBJECT_STR.DataIdent) {
                      return (
                        <CommonBadge
                          badgeType={BADGE_TYPE.DataIndf}
                          badgeLabel={(e as any)[item.id]}
                        />
                      );
                    }
                    if (item.id === COLUMN_OBJECT_STR.TableCount) {
                      return (
                        <span
                          className="catalog-detail-row-folders hander"
                          onClick={() => clickTableCount(e)}
                        >
                          {(e as any)[item.id]}
                        </span>
                      );
                    }
                    if (item.id === COLUMN_OBJECT_STR.FolderName) {
                      return (
                        <div className="wrap-line">
                          <span
                            className="catalog-detail-row-folders hander"
                            onClick={() => clickFolderName(e as any)}
                          >
                            {(e as any)[item.id]}
                          </span>
                        </div>
                      );
                    }

                    if (item.id === COLUMN_OBJECT_STR.Category) {
                      return (
                        <div className="wrap-line">
                          {e?.props?.find(
                            (prop: Props) => prop.prop_type?.toString() === '1'
                          )?.prop_name || 'N/A'}
                        </div>
                      );
                    }

                    if (item.id === COLUMN_OBJECT_STR.IdentifierLabel) {
                      return (
                        <div className="wrap-line">
                          {e?.props?.find(
                            (prop: Props) => prop.prop_type?.toString() === '2'
                          )?.prop_name || 'N/A'}
                        </div>
                      );
                    }

                    if (item.id === COLUMN_OBJECT_STR.Privacy) {
                      if (editPrivacy && editPrivacy.id === (e as any).id) {
                        return (
                          <div className="detail-edit-icon-width">
                            <div>
                              <Select
                                selectedOption={selectPrivacyOption}
                                onChange={(select) => {
                                  updateSelectChange(
                                    select.detail.selectedOption,
                                    e as any,
                                    COLUMN_OBJECT_STR.Privacy
                                  );
                                }}
                                triggerVariant="option"
                                options={[
                                  CONTAINS_PII_OPTION,
                                  NON_PII_OPTION,
                                  NA_OPTION,
                                ]}
                                selectedAriaLabel="Selected"
                                onBlur={() => {
                                  setEditPrivacy(null);
                                }}
                              ></Select>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="detail-edit-icon">
                            <CommonBadge
                              badgeType={BADGE_TYPE.Privacy}
                              badgeLabel={(e as any)[item.id]}
                            />
                            {tagId === COLUMN_OBJECT_STR.Schema && (
                              <div
                                onClick={() =>
                                  clickEditIcon(
                                    e as any,
                                    COLUMN_OBJECT_STR.Privacy
                                  )
                                }
                              >
                                <Icon
                                  name="edit"
                                  className="modal-badge-edit"
                                />
                              </div>
                            )}
                          </div>
                        );
                      }
                    }
                    if (item.id === COLUMN_OBJECT_STR.Identifier) {
                      if (
                        editIndentifier &&
                        editIndentifier.id === (e as any).id
                      ) {
                        return (
                          <div className="detail-edit-icon-max-width">
                            <Multiselect
                              hideTokens
                              placeholder={
                                t('catalog:detail.selectIdentifier') || ''
                              }
                              selectedOptions={selectIndentOption}
                              onChange={(event) => {
                                setSelectIndentOption(
                                  event.detail.selectedOptions
                                );
                                updateSelectChange(
                                  event.detail.selectedOptions,
                                  e as any,
                                  COLUMN_OBJECT_STR.Identifier
                                );
                              }}
                              // triggerVariant="option"
                              options={identifierOptions}
                              selectedAriaLabel={t('selected') || ''}
                              onBlur={() => {
                                setEditIndentifier(null);
                              }}
                            ></Multiselect>
                          </div>
                        );
                      } else {
                        if (tagId === COLUMN_OBJECT_STR.Schema) {
                          const showIdentifierObj = toJSON(
                            (e as any)[item.id]
                          ) || { 'N/A': 1 };

                          const identifierList = Object.keys(showIdentifierObj);
                          let hasMore = false;
                          if (identifierList.length > 1) {
                            hasMore = true;
                          }
                          return identifierList.length > 0 ? (
                            <div className="flex">
                              <span className="mr-5" title={identifierList[0]}>
                                <CommonBadge
                                  badgeType={BADGE_TYPE.DataIndf}
                                  badgeLabel={
                                    identifierList[0].length > 20
                                      ? identifierList[0]?.substring(0, 19) +
                                        '...'
                                      : identifierList[0]
                                  }
                                />
                              </span>
                              {hasMore && (
                                <Popover
                                  dismissButton={false}
                                  position="top"
                                  size="small"
                                  triggerType="custom"
                                  content={
                                    <div>
                                      {identifierList.map(
                                        (ident: any, index) => {
                                          return (
                                            <span
                                              key={index}
                                              className="inline-block mr-5 mb-2"
                                            >
                                              <CommonBadge
                                                badgeType={BADGE_TYPE.DataIndf}
                                                badgeLabel={ident}
                                              />
                                            </span>
                                          );
                                        }
                                      )}
                                    </div>
                                  }
                                >
                                  <span className="custom-badge more">{`+${
                                    identifierList?.length - 1
                                  }`}</span>
                                </Popover>
                              )}
                              <div
                                onClick={() =>
                                  clickEditIcon(
                                    e as any,
                                    COLUMN_OBJECT_STR.Identifier
                                  )
                                }
                              >
                                <Icon
                                  name="edit"
                                  className="modal-badge-edit"
                                />
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() =>
                                clickEditIcon(
                                  e as any,
                                  COLUMN_OBJECT_STR.Identifier
                                )
                              }
                            >
                              N/A
                              <Icon name="edit" className="modal-badge-edit" />
                            </div>
                          );
                        }
                        const showIdentifier =
                          !(e as any)[item.id] ||
                          (e as any)[item.id].indexOf('N/A') > -1
                            ? 'N/A'
                            : (e as any)[item.id];
                        return (
                          <div>
                            <CommonBadge
                              badgeType={BADGE_TYPE.DataIndf}
                              badgeLabel={showIdentifier}
                            />
                          </div>
                        );
                      }
                    }

                    if (item.id === COLUMN_OBJECT_STR.Comments) {
                      if (editComments && editComments.id === (e as any).id) {
                        return (
                          <div className="wrap-line">
                            <Textarea
                              value={e[item.id]}
                              onChange={({ detail }) => {
                                updateSelectChange(
                                  detail.value,
                                  e as any,
                                  COLUMN_OBJECT_STR.Comments
                                );
                              }}
                              onBlur={() => {
                                setEditComments(null);
                              }}
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div className="detail-edit-icon">
                            <div className="wrap-line">{e[item.id]}</div>
                            <div
                              onClick={() =>
                                clickEditIcon(
                                  e as any,
                                  COLUMN_OBJECT_STR.Comments
                                )
                              }
                            >
                              <Icon name="edit" className="modal-badge-edit" />
                            </div>
                          </div>
                        );
                      }
                    }
                    if (item.id === COLUMN_OBJECT_STR.IdentifierScore) {
                      return (
                        <span>
                          {parseFloat((e as any)[item.id]) > 0
                            ? `${parseFloat((e as any)[item.id]) * 100}%`
                            : '0'}
                        </span>
                      );
                    }

                    if (item.id === COLUMN_OBJECT_STR.Classifiedby) {
                      return (
                        <CommonBadge
                          badgeType={BADGE_TYPE.Classified}
                          badgeLabel={
                            (e as any)[COLUMN_OBJECT_STR.LastModifyBy]
                              ? (e as any)[COLUMN_OBJECT_STR.LastModifyBy] ===
                                CLSAAIFIED_TYPE.System
                                ? CLSAAIFIED_TYPE.System
                                : CLSAAIFIED_TYPE.Manual
                              : CLSAAIFIED_TYPE.SystemMark
                          }
                        />
                      );
                    }
                    if (item.id === COLUMN_OBJECT_STR.Labels) {
                      let hasMore = false;
                      if (e.labels?.length > 1) {
                        hasMore = true;
                      }
                      return e.labels?.length > 0 ? (
                        <div className="flex">
                          <span className="custom-badge label mr-5">
                            {e.labels?.[0]?.label_name}
                          </span>
                          {hasMore && (
                            <Popover
                              dismissButton={false}
                              position="top"
                              size="small"
                              triggerType="custom"
                              content={
                                <div>
                                  {e.labels?.map((label: any) => {
                                    return (
                                      <span
                                        key={label.id}
                                        className="custom-badge label mr-5 mb-2"
                                      >
                                        {label.label_name}
                                      </span>
                                    );
                                  })}
                                </div>
                              }
                            >
                              <span className="custom-badge more">{`+${
                                e.labels?.length - 1
                              }`}</span>
                            </Popover>
                          )}
                        </div>
                      ) : (
                        ''
                      );
                    }
                    if (item.id === COLUMN_OBJECT_STR.ObjectCount) {
                      return nFormatter((e as any)[item.id], 2);
                    }
                    if (item.id === COLUMN_OBJECT_STR.RowCount) {
                      return nFormatter((e as any)[item.id], 2);
                    }
                    if (
                      item.id === COLUMN_OBJECT_STR.LastModifyBy &&
                      (e as any)[item.id] === 'SDPS'
                    ) {
                      return 'System';
                    }
                    if (item.id === COLUMN_OBJECT_STR.LastModifyAt) {
                      return moment((e as any)[item.id])
                        .add(8, 'h')
                        .format('YYYY-MM-DD HH:mm');
                    }
                    if (
                      item.id === 'column_value_example' ||
                      item.id === 'column_type'
                    ) {
                      if (!(e as any)[item.id]) {
                        return '';
                      }
                      if ((e as any)[item.id].length > 90) {
                        return (
                          <Popover
                            dismissButton={false}
                            position="top"
                            size={
                              item.id === 'column_value_example'
                                ? 'large'
                                : 'small'
                            }
                            content={
                              <StatusIndicator type="info">
                                {(e as any)[item.id]}
                              </StatusIndicator>
                            }
                          >
                            {(e as any)[item.id].substr(0, 90)}...
                          </Popover>
                        );
                      }
                      return (
                        <div className="wrap-line">{(e as any)[item.id]}</div>
                      );
                    }
                    return (
                      <div className="wrap-line">{(e as any)[item.id]}</div>
                    );
                  },
                  sortingField: item.sortingField,
                  minWidth:
                    item.id === 'column_value_example' ? 300 : undefined,
                };
              }) as any
            }
            resizableColumns
            items={dataList}
            loadingText={t('table.loadingResources') || ''}
            visibleColumns={preferences.visibleContent}
            empty={
              <Box textAlign="center" color="inherit">
                <b>{t('catalog:detail.noDataIdentifier')}</b>
                <Box padding={{ bottom: 's' }} variant="p" color="inherit">
                  {t('catalog:detail.noDataIdentifierDesc')}
                </Box>
              </Box>
            }
            filter={
              identifiersFilter ? (
                <>
                  <TextFilter
                    filteringText={nameFilterText}
                    onChange={({ detail }) => {
                      setNameFilterText(detail.filteringText);
                    }}
                    countText={`${totalCount} ${t('filter.matches')}`}
                  />
                </>
              ) : needFilter ? (
                <ResourcesFilter
                  isFreeText={isFreeText}
                  {...resourcesFilterProps}
                />
              ) : (
                <></>
              )
            }
            header={
              detailDesHeader && (
                <div className="deatil-desc-body">
                  <span className="deatil-desc-header">{detailDesHeader}</span>
                  {detailDesInfo && (
                    <span className="deatil-desc-info">{detailDesInfo}</span>
                  )}
                </div>
              )
            }
            pagination={
              needByPage && (
                <Pagination
                  currentPageIndex={currentPage}
                  onChange={({ detail }) =>
                    setCurrentPage(detail.currentPageIndex)
                  }
                  pagesCount={Math.ceil(totalCount / preferences.pageSize)}
                  ariaLabels={{
                    nextPageLabel: t('table.nextPage') || '',
                    previousPageLabel: t('table.previousPage') || '',
                    pageLabel: (pageNumber) =>
                      `${t('table.pageLabel', { pageNumber: pageNumber })}`,
                  }}
                />
              )
            }
            preferences={
              needByPage && (
                <CollectionPreferences
                  onConfirm={({ detail }) => setPreferences(detail)}
                  preferences={preferences}
                  title={t('table.preferences')}
                  confirmLabel={t('table.confirm')}
                  cancelLabel={t('table.cancel')}
                  pageSizePreference={{
                    title: t('table.selectPageSize'),
                    options: [
                      { value: 10, label: t('table.pageSize10') },
                      { value: 20, label: t('table.pageSize20') },
                      { value: 50, label: t('table.pageSize50') },
                      { value: 100, label: t('table.pageSize100') },
                    ],
                  }}
                  visibleContentPreference={{
                    title: t('table.selectVisibleContent'),
                    options: [
                      {
                        label: t('table.mainDistributionProp'),
                        options: columnList,
                      },
                    ],
                  }}
                />
              )
            }
          />
        </div>
        {needSchemaModal && showSchemaModal && (
          <SchemaModal {...schemaModalProps} />
        )}
      </div>
    );
  }
);

export default CatalogDetailList;
