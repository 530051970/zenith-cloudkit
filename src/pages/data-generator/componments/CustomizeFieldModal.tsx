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
import RightModal from 'pages/right-modal';

const CustomizeFieldModal = (props: any) => {
  const { showModal, setShowModal } = props;
  

  return (<RightModal
    className="job-detail"
    setShowModal={setShowModal}
    showModal={showModal}
    header="添加自定义字段"
    showFolderIcon={false}
  >
    
  </RightModal>);
};

export default CustomizeFieldModal;
