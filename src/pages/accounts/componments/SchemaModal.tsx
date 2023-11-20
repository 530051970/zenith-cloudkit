import React, { useEffect, useState } from 'react';
import {
  Modal,
  Icon,
  Tabs,
  Box,
  SpaceBetween,
  Button,
  Select,
  SelectProps,
} from '@cloudscape-design/components';
import CommonBadge from 'pages/common-badge';
import CatalogDetailList from './CatalogDetailList';
import {
  BADGE_TYPE,
  PRIVARY_TYPE_DATA,
  PRIVARY_TYPE_INT_DATA,
} from 'pages/common-badge/types/badge_type';
import {
  SAMPLE_OBJECT_COLUMN,
  COLUMN_OBJECT_STR,
  SCHEMA_COLUMN,
  UPDATE_FLAG,
} from '../types/data_config';
import { DATA_TYPE_ENUM } from 'enum/common_types';
import {
  getRdsTableSampleRecords,
  updateCatalogColumn,
  updateCatalogTable,
  updateCatalogTableLabels,
} from 'apis/data-catalog/api';
import '../style.scss';
import { alertMsg, deepClone } from 'tools/tools';
import {
  CONTAINS_PII_OPTION,
  NA_OPTION,
  NON_PII_OPTION,
} from 'pages/common-badge/componments/Options';
import LabelModal from 'common/LabelModal';
import { Label } from 'ts/data-catalog/types';
import { useTranslation } from 'react-i18next';

const SchemaModal: React.FC<any> = (props: any) => {
  const {
    showSchemaModal,
    setShowSchemaModal,
    catalogType,
    selectRowData,
    selectPageRowData,
    setSelectRowData,
    updateFatherPage,
  } = props;
  const { t } = useTranslation();
  const [saveLoading, setSaveLoading] = useState(false);

  const [updateData, setUpdateData] = useState(null as any);
  const [isShowEditSelect, setIsShowEditSelect] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    null as SelectProps.Option | null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [rdsColumnList, setRDSColumnList] = useState([]);
  const [previewDataList, setPreviewDataList] = useState([]);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [saveLabelLoading, setSaveLabelLoading] = useState(false);
  const [cleanData, setCleanData] = useState(1);

  let tabsContent = [];

  if (catalogType === DATA_TYPE_ENUM.s3) {
    const objectsProps = {
      dataList: [],
      columnList: SAMPLE_OBJECT_COLUMN,
      catalogType,
      tagId: COLUMN_OBJECT_STR.SampleObjects,
      selectRowData,
      selectPageRowData,
      setSaveDisabled,
    };
    const schemaProps = {
      dataList: [],
      columnList: SCHEMA_COLUMN,
      catalogType,
      tagId: COLUMN_OBJECT_STR.Schema,
      detailDesInfo:
        'These files are structured files and were detected to have the same schema',
      selectRowData,
      selectPageRowData,
      needByPage: true,
      setSaveLoading,
      setUpdateData,
      setSaveDisabled,
    };
    tabsContent = [
      {
        id: COLUMN_OBJECT_STR.Schema,
        label: 'Schema',
        content: <CatalogDetailList {...schemaProps} />,
      },
      {
        id: COLUMN_OBJECT_STR.SampleObjects,
        label: 'Sample objects',
        content: <CatalogDetailList {...objectsProps} />,
      },
    ];
  } else {
    const previewProps = {
      columnList: rdsColumnList,
      catalogType,
      tagId: COLUMN_OBJECT_STR.DataPreview,
      detailDesHeader: 'These are 10 sampled data entries of this table.',
      selectRowData,
      selectPageRowData,
      previewDataList,
    };
    const schemaProps = {
      columnList: SCHEMA_COLUMN,
      catalogType,
      tagId: COLUMN_OBJECT_STR.Schema,
      selectRowData,
      selectPageRowData,
      needByPage: true,
      setSaveLoading,
      setUpdateData,
      setSaveDisabled,
    };
    tabsContent = [
      {
        id: COLUMN_OBJECT_STR.Schema,
        label: 'Schema',
        content: <CatalogDetailList {...schemaProps} />,
      },
      {
        id: COLUMN_OBJECT_STR.DataPreview,
        label: 'Data preview',
        content: <CatalogDetailList {...previewProps} />,
      },
    ];
  }

  const [activeTabId, setActiveTabId] = useState(tabsContent[0].id);

  const saveData = async () => {
    if (!updateData || updateData.length === 0) {
      alertMsg('No Save Data', 'warning');
      return;
    }
    setSaveLoading(true);
    // find which row is updated
    const tempUpdateData = deepClone(updateData).filter(
      (item: { [x: string]: any }) => item[UPDATE_FLAG]
    );
    const promiseList = tempUpdateData.map((item: any) => {
      // if (item.identifier && item.identifier.length > 0) {
      //   // const parseObj = item.identifier.reduce((acc: any, curr: string) => {
      //   //   acc[curr] = '1';
      //   //   return acc;
      //   // }, {});
      //   // const parseObj = toJSON(item.identifier);
      //   // const parseObj = JSON.stringify(item.identifier);
      //   // item.identifier = parseObj
      //   //   ? JSON.stringify(parseObj)
      //   //   : JSON.stringify({ 'N/A': 1 });
      // }
      delete item[UPDATE_FLAG];
      return updateCatalogColumn({ ...item });
    });
    await Promise.allSettled(promiseList);
    alertMsg('Save Success', 'success');
    setShowSchemaModal(false);
    setSaveLoading(false);
  };

  const clkCheckIcon = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const requestParam = {
      ...selectRowData,
    };
    requestParam[BADGE_TYPE.Privacy] = selectedOption?.value;
    const result = await updateCatalogTable(requestParam);
    setIsLoading(false);
    if (result) {
      alertMsg(t('updateSuccess'), 'success');
      setIsShowEditSelect(false);
      setSelectRowData(requestParam);
      updateFatherPage();
    } else {
      alertMsg(t('updateFailed'), 'error');
    }
  };

  const getDataPreview = async () => {
    if (catalogType !== DATA_TYPE_ENUM.rds) {
      return;
    }
    const requestParam = {
      account_id: selectRowData.account_id,
      region: selectRowData.region,
      database_name: selectRowData.database_name,
      database_type: 'rds',
      table_name: selectRowData.name,
      limit: 10,
    };
    const result = await getRdsTableSampleRecords(requestParam);
    if (!result || typeof result !== 'object') {
      alertMsg(result as any, 'error');
      return;
    }
    changeRdsDataToPage(result);
  };

  const changeRdsDataToPage = (rdsData: any) => {
    const result: any = [];
    for (let m = 0; m < rdsData.length; m++) {
      if (m === 0) {
        const tempColumnList: any = [];
        for (let i = 0; i < rdsData[0].length; i++) {
          tempColumnList.push({
            id: rdsData[0][i],
            label: rdsData[0][i],
          });
        }
        setRDSColumnList(tempColumnList);
        continue;
      }
      const addObj: any = {};
      for (let i = 0; i < rdsData[0].length; i++) {
        addObj[rdsData[0][i]] = rdsData[m][i];
      }
      result.push(addObj);
    }
    setPreviewDataList(result);
  };

  const saveLabelsToTable = async (labels: Label[], callback: () => void) => {
    try {
      setSaveLabelLoading(true);
      const result = await updateCatalogTableLabels({
        id: selectRowData.id,
        labels: labels.map((label) => label.id),
      });

      setSaveLabelLoading(false);
      if (result) {
        setCleanData((prev) => {
          return prev + 1;
        });
        setShowLabelModal(false);
        setSelectRowData((prev: any) => {
          return {
            ...prev,
            labels: labels,
          };
        });
        if (callback) {
          callback();
        }
        updateFatherPage();
      }
    } catch (error) {
      setSaveLabelLoading(false);
    }
  };

  useEffect(() => {
    getDataPreview();
    if (
      typeof selectRowData.privacy !== 'number' &&
      typeof selectRowData.privacy !== 'string'
    ) {
      return;
    }
    if (selectRowData.privacy.toString() === PRIVARY_TYPE_INT_DATA['N/A']) {
      setSelectedOption(NA_OPTION as any);
    }
    if (selectRowData.privacy.toString() === PRIVARY_TYPE_DATA.ContainsPII) {
      setSelectedOption(CONTAINS_PII_OPTION as any);
    }
    if (selectRowData.privacy === PRIVARY_TYPE_DATA.NonPII) {
      setSelectedOption(NON_PII_OPTION as any);
    }
  }, []);

  return (
    <Modal
      className="detail-modal"
      size="max"
      onDismiss={() => {
        setShowSchemaModal(false);
      }}
      visible={showSchemaModal}
      closeAriaLabel="Close modal"
      footer={
        activeTabId === 'schema' && (
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="link"
                onClick={() => {
                  setShowSchemaModal(false);
                }}
              >
                {t('button.cancel')}
              </Button>
              <Button
                variant="primary"
                loading={saveLoading}
                onClick={saveData}
                disabled={saveDisabled}
              >
                {t('button.save')}
              </Button>
            </SpaceBetween>
          </Box>
        )
      }
      header={
        catalogType === DATA_TYPE_ENUM.s3 ? 'Folder details' : 'Table details'
      }
    >
      <div className="schema-modal-header">
        <span className="schema-body-span">{selectRowData.table_name}</span>
        <div>
          <div>
            {(selectRowData[BADGE_TYPE.Privacy] ||
              selectRowData[BADGE_TYPE.Privacy] === 0) &&
              !isShowEditSelect && (
                <span>
                  <b>Privacy: </b>
                  <CommonBadge
                    badgeType={BADGE_TYPE.Privacy}
                    badgeLabel={selectRowData[BADGE_TYPE.Privacy]}
                  />
                  <div
                    onClick={() => setIsShowEditSelect(true)}
                    className="modal-badge-edit"
                  >
                    <Icon name="edit" />
                  </div>
                </span>
              )}
            {isShowEditSelect && (
              <div className="edit-privary">
                <div className="edit-privary-select">
                  <Select
                    onChange={(e) => {
                      setSelectedOption(e.detail.selectedOption as any);
                    }}
                    selectedOption={selectedOption}
                    triggerVariant="option"
                    options={[CONTAINS_PII_OPTION, NON_PII_OPTION, NA_OPTION]}
                    selectedAriaLabel="Selected"
                  ></Select>
                </div>
                <div className="check-icon">
                  <Button onClick={clkCheckIcon} iconName="check"></Button>
                </div>
              </div>
            )}
          </div>
          <div className="mt-5">
            <span>
              <b>Custom labels: </b>
              {selectRowData[COLUMN_OBJECT_STR.Labels].map((label: any) => {
                return (
                  <span key={label.id} className="custom-badge label mr-5">
                    {label.label_name}
                  </span>
                );
              })}
              <div
                onClick={() => setShowLabelModal(true)}
                className="modal-badge-edit"
              >
                <Icon name="edit" />
              </div>
            </span>
          </div>
        </div>
      </div>
      <Tabs
        className="modal-body-tabs"
        tabs={tabsContent}
        onChange={(e) => {
          setActiveTabId(e.detail.activeTabId);
        }}
      />
      <LabelModal
        showModal={showLabelModal}
        defaultSelectLabels={selectRowData[COLUMN_OBJECT_STR.Labels]}
        clickHideModal={() => {
          setShowLabelModal(false);
        }}
        saveLoading={saveLabelLoading}
        saveLabelToResource={(labelIds, callback) => {
          saveLabelsToTable(labelIds, callback);
        }}
        addButtonText={
          (catalogType === DATA_TYPE_ENUM.rds
            ? t('label.addToTable')
            : t('label.addToFolder')) || ''
        }
        cleanData={cleanData}
      />
    </Modal>
  );
};

export default SchemaModal;
