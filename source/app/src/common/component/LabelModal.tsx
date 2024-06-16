import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Box,
  SpaceBetween,
  Table,
  Header,
  FormField,
  Input,
  Pagination,
  CollectionPreferences,
  TextFilter,
} from '@cloudscape-design/components';
import {
  requestCreateLabel,
  requestDeleteLabel,
  requestGetAllLabels,
  requestUpdateLabel,
} from 'apis/label/api';
import { Label } from 'ts/data-catalog/types';
import { useTranslation } from 'react-i18next';

export interface LabelModalProps {
  showModal: boolean;
  defaultSelectLabels: Label[];
  clickHideModal: () => void;
  saveLoading: boolean;
  saveLabelToResource: (labelIds: Label[], callback: () => void) => void;
  addButtonText?: string;
  cleanData?: number;
}

const LabelModal: React.FC<LabelModalProps> = (props: LabelModalProps) => {
  const {
    showModal,
    defaultSelectLabels,
    clickHideModal,
    saveLabelToResource,
    saveLoading,
    addButtonText,
    cleanData,
  } = props;
  const { t } = useTranslation();
  const [showCreateLabel, setShowCreateLabel] = useState(false);

  const [allLabelList, setAllLabelList] = useState<Label[]>([]);
  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchLabelName, setSearchLabelName] = useState('');
  const [loadingLabel, setLoadingLabel] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  // const [newLabelName, setNewLabelName] = useState('');
  const [createOrUpdate, setCreateOrUpdate] = useState('create');
  const [currentLabel, setCurrentLabel] = useState<Label>({
    id: '',
    label_name: '',
  });
  const [selectedItems, setSelectedItems] = useState<Label[]>(
    defaultSelectLabels || []
  );
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tableDisplayData, setTableDisplayData] = useState<Label[]>([]);

  const getLabelsList = async () => {
    try {
      setLoadingLabel(true);
      const result: Label[] = await requestGetAllLabels({
        label_name: searchLabelName,
      });
      setLoadingLabel(false);
      if (result) {
        setAllLabelList(result);
        // set default selected items
        if (defaultSelectLabels.length > 0) {
          const defaultIds = defaultSelectLabels.map((item) => item.id);
          setSelectedItems(result.filter((e) => defaultIds.includes(e.id)));
        } else {
          setSelectedItems([]);
        }
        setTotalCount(result.length);
        const start = (curPage - 1) * pageSize;
        setTableDisplayData(result.slice(start, start + pageSize));
      } else {
        setAllLabelList([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createlabel = async () => {
    try {
      setLoadingUpdate(true);
      const result: Label = await requestCreateLabel({
        label_name: currentLabel.label_name,
      });
      setLoadingUpdate(false);
      if (result.label_name) {
        setCurrentLabel({
          id: '',
          label_name: '',
        });
        getLabelsList();
        setShowCreateLabel(false);
      }
    } catch (error) {
      setLoadingUpdate(false);
    }
  };

  const updatelabel = async () => {
    try {
      setLoadingUpdate(true);
      const result: Label = await requestUpdateLabel(currentLabel);
      setLoadingUpdate(false);
      if (result) {
        getLabelsList();
        setShowCreateLabel(false);
      }
    } catch (error) {
      setLoadingUpdate(false);
    }
  };

  const deleteLabel = async () => {
    try {
      setLoadingDelete(true);
      const result: boolean = await requestDeleteLabel({
        ids: selectedItems.map((e) => e.id),
      });
      setLoadingDelete(false);
      if (result) {
        setSelectedItems([]);
        setShowDeleteModal(false);
        getLabelsList();
      }
    } catch (error) {
      setLoadingDelete(false);
    }
  };

  useEffect(() => {
    setSelectedItems([]);
    clickHideModal();
    setSearchLabelName('');
  }, [cleanData]);

  useEffect(() => {
    if (showModal) {
      getLabelsList();
    }
  }, [showModal]);

  useEffect(() => {
    const start = (curPage - 1) * pageSize;
    setTableDisplayData(allLabelList.slice(start, start + pageSize));
  }, [curPage, pageSize]);

  useEffect(() => {
    const start = 1;
    const afterFilterList = allLabelList.filter(
      (element) => element.label_name.indexOf(searchLabelName) >= 0
    );
    setTableDisplayData(afterFilterList.slice(start - 1, start + pageSize));
    setTotalCount(afterFilterList.length);
  }, [searchLabelName]);

  return (
    <div>
      <Modal
        onDismiss={() => {
          setSelectedItems([]);
          clickHideModal();
          setSearchLabelName('');
        }}
        visible={showModal}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="link"
                onClick={() => {
                  setSelectedItems([]);
                  clickHideModal();
                  setSearchLabelName('');
                }}
              >
                {t('button.cancel')}
              </Button>
              <Button
                loading={saveLoading}
                variant="primary"
                onClick={() => {
                  saveLabelToResource(selectedItems, () => {
                    setSearchLabelName('');
                    setSelectedItems([]);
                  });
                }}
              >
                {addButtonText || t('button.addToCatalog')}
              </Button>
            </SpaceBetween>
          </Box>
        }
        header={t('label.customLabel')}
      >
        <Table
          selectionType="multi"
          columnDefinitions={[
            {
              id: 'label',
              header: t('label.label'),
              cell: (item: Label) => item.label_name || '-',
              sortingField: 'label_name',
            },
          ]}
          selectedItems={selectedItems}
          onSelectionChange={(e) => {
            if (e.detail.selectedItems.length === 1) {
              setCurrentLabel(e.detail.selectedItems[0]);
            }
            setSelectedItems(e.detail.selectedItems);
          }}
          items={tableDisplayData}
          loading={loadingLabel}
          loadingText={t('label.loadingLabel') || ''}
          sortingDisabled
          variant="embedded"
          empty={
            <Box textAlign="center" color="inherit">
              <div>
                <p>
                  {searchLabelName.trim()
                    ? t('label.noLabelFound')
                    : t('label.noLabel')}
                </p>
              </div>
              {!searchLabelName.trim() && (
                <Button
                  onClick={() => {
                    setShowCreateLabel(true);
                  }}
                >
                  {t('button.createLabel')}
                </Button>
              )}
            </Box>
          }
          header={
            <Header
              counter={`(${allLabelList?.length.toString()})`}
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button
                    loading={loadingDelete}
                    disabled={selectedItems.length <= 0}
                    onClick={() => {
                      setShowDeleteModal(true);
                    }}
                  >
                    {t('button.delete')}
                  </Button>
                  <Button
                    disabled={selectedItems.length !== 1}
                    onClick={() => {
                      setCreateOrUpdate('update');
                      setShowCreateLabel(true);
                    }}
                  >
                    {t('button.edit')}
                  </Button>
                  <Button
                    iconName="add-plus"
                    onClick={() => {
                      setCreateOrUpdate('create');
                      setCurrentLabel({
                        id: '',
                        label_name: '',
                      });
                      setShowCreateLabel(true);
                    }}
                  >
                    {t('button.create')}
                  </Button>
                </SpaceBetween>
              }
            >
              {t('label.labels')}
            </Header>
          }
          filter={
            <TextFilter
              onChange={(e) => {
                setSearchLabelName(e.detail.filteringText);
              }}
              filteringPlaceholder={t('label.findLabels') || ''}
              filteringText={searchLabelName}
            />
          }
          preferences={
            <CollectionPreferences
              title={t('table.preferences')}
              confirmLabel={t('table.confirm')}
              cancelLabel={t('table.cancel')}
              preferences={{
                pageSize: pageSize,
              }}
              pageSizePreference={{
                title: t('table.selectPageSize'),
                options: [
                  { value: 10, label: t('table.pageSize10') },
                  { value: 20, label: t('table.pageSize20') },
                  { value: 50, label: t('table.pageSize50') },
                  { value: 100, label: t('table.pageSize100') },
                ],
              }}
              onConfirm={(e) => {
                setCurPage(1);
                setPageSize(e.detail.pageSize || 10);
              }}
            />
          }
          pagination={
            <Pagination
              currentPageIndex={curPage}
              pagesCount={Math.ceil(totalCount / pageSize)}
              onChange={(e) => {
                setCurPage(e.detail.currentPageIndex);
              }}
            />
          }
        />
      </Modal>

      <Modal
        size="small"
        onDismiss={() => setShowCreateLabel(false)}
        visible={showCreateLabel}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="link"
                onClick={() => {
                  setShowCreateLabel(false);
                }}
              >
                {t('button.cancel')}
              </Button>
              <Button
                loading={loadingUpdate}
                variant="primary"
                onClick={() => {
                  if (createOrUpdate === 'create') {
                    createlabel();
                  } else {
                    updatelabel();
                  }
                }}
              >
                {createOrUpdate === 'create'
                  ? t('button.create')
                  : t('button.update')}
              </Button>
            </SpaceBetween>
          </Box>
        }
        header={
          createOrUpdate === 'create'
            ? t('label.createLabel')
            : t('label.updateLabel')
        }
      >
        <FormField>
          <Input
            value={currentLabel?.label_name || ''}
            onChange={(e) => {
              setCurrentLabel((prev) => {
                return {
                  ...prev,
                  label_name: e.detail.value,
                };
              });
            }}
          />
        </FormField>
      </Modal>

      <Modal
        onDismiss={() => setShowDeleteModal(false)}
        visible={showDeleteModal}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="link"
                onClick={() => {
                  setShowDeleteModal(false);
                }}
              >
                {t('button.cancel')}
              </Button>
              <Button
                loading={loadingDelete}
                variant="primary"
                onClick={() => {
                  deleteLabel();
                }}
              >
                {t('button.delete')}
              </Button>
            </SpaceBetween>
          </Box>
        }
        header={t('label.deleteLabel')}
      >
        <FormField>
          {t('label.deleteTips')}
          <b>{selectedItems.map((element) => element.label_name).join(', ')}</b>
          .
        </FormField>
      </Modal>
    </div>
  );
};

export default LabelModal;
