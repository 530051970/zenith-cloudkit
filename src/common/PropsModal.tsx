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
  requestCreateProps,
  requestDeleteProps,
  requestPropsByType,
  requestUpdateProps,
} from 'apis/props/api';
import { useTranslation } from 'react-i18next';
import { alertMsg } from 'tools/tools';

export interface Props {
  id: string;
  prop_name: string;
  prop_type: string;
}

export interface PropsModalProps {
  isManage?: boolean;
  propsType: string;
  showModal: boolean;
  defaultSelectPropss: Props[];
  clickHideModal: () => void;
  saveLoading: boolean;
  savePropsToResource: (propsIds: Props[], callback: () => void) => void;
  addButtonText?: string;
  cleanData?: number;
}

const PropsModal: React.FC<PropsModalProps> = (props: PropsModalProps) => {
  const {
    isManage,
    propsType,
    showModal,
    defaultSelectPropss,
    clickHideModal,
    savePropsToResource,
    saveLoading,
    cleanData,
  } = props;
  const { t } = useTranslation();
  const [showCreateProps, setShowCreateProps] = useState(false);

  const [allPropsList, setAllPropsList] = useState<Props[]>([]);
  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchPropsName, setSearchPropsName] = useState('');
  const [loadingProps, setLoadingProps] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [createOrUpdate, setCreateOrUpdate] = useState('create');
  const [currentProps, setCurrentProps] = useState<Props>({
    id: '',
    prop_name: '',
    prop_type: propsType,
  });
  const [selectedItems, setSelectedItems] = useState<Props[]>(
    defaultSelectPropss || []
  );
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tableDisplayData, setTableDisplayData] = useState<Props[]>([]);

  const getPropsList = async () => {
    setAllPropsList([]);
    try {
      setLoadingProps(true);
      const result: Props[] = await requestPropsByType({
        type: propsType,
      });
      setLoadingProps(false);
      if (result) {
        setAllPropsList(
          result.sort((a, b) => a.prop_name.localeCompare(b.prop_name))
        );
        // set default selected items
        if (defaultSelectPropss.length > 0) {
          const defaultIds = defaultSelectPropss.map((item) => item.id);
          const findItems = result.filter((e) => defaultIds.includes(e.id));
          setSelectedItems(findItems);
          setCurrentProps(
            findItems.length > 0
              ? findItems[0]
              : {
                  id: '',
                  prop_name: '',
                  prop_type: propsType,
                }
          );
        } else {
          setSelectedItems([]);
        }
        setTotalCount(result.length);
        const start = (curPage - 1) * pageSize;
        setTableDisplayData(result.slice(start, start + pageSize));
      } else {
        setAllPropsList([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createprops = async () => {
    try {
      setLoadingUpdate(true);
      const result: Props = await requestCreateProps({
        prop_type: propsType,
        prop_name: currentProps.prop_name,
      });
      setLoadingUpdate(false);
      if (result.prop_name) {
        setCurrentProps({
          id: '',
          prop_name: '',
          prop_type: '',
        });
        getPropsList();
        setShowCreateProps(false);
      }
    } catch (error) {
      setLoadingUpdate(false);
    }
  };

  const updateprops = async () => {
    try {
      setLoadingUpdate(true);
      await requestUpdateProps(currentProps);
      setLoadingUpdate(false);
      // if (result) {
      setSelectedItems([]);
      getPropsList();
      setShowCreateProps(false);
      // }
    } catch (error: any) {
      alertMsg(error, 'error');
      setLoadingUpdate(false);
    }
  };

  const deleteProps = async () => {
    try {
      setLoadingDelete(true);
      await requestDeleteProps({
        id: selectedItems[0].id,
      });
      setLoadingDelete(false);
      // if (result) {
      setSelectedItems([]);
      setShowDeleteModal(false);
      getPropsList();
      // }
    } catch (error: any) {
      alertMsg(error, 'error');
      setLoadingDelete(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      getPropsList();
    } else {
      setCurPage(1);
    }
  }, [showModal]);

  useEffect(() => {
    setSelectedItems([]);
    clickHideModal();
    setSearchPropsName('');
  }, [cleanData]);

  useEffect(() => {
    const start = (curPage - 1) * pageSize;
    setTableDisplayData(allPropsList.slice(start, start + pageSize));
  }, [curPage, pageSize]);

  useEffect(() => {
    const start = 1;
    const afterFilterList = allPropsList.filter(
      (element) => element.prop_name.indexOf(searchPropsName) >= 0
    );
    setTableDisplayData(afterFilterList.slice(start - 1, start + pageSize));
    setTotalCount(afterFilterList.length);
  }, [searchPropsName]);

  return (
    <div>
      <Modal
        onDismiss={() => {
          setSelectedItems([]);
          clickHideModal();
          setSearchPropsName('');
        }}
        visible={showModal}
        footer={
          <Box float="right">
            {isManage ? (
              <Button
                onClick={() => {
                  setSelectedItems([]);
                  clickHideModal();
                  setSearchPropsName('');
                }}
              >
                {t('button.close')}
              </Button>
            ) : (
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  variant="link"
                  onClick={() => {
                    setSelectedItems([]);
                    clickHideModal();
                    setSearchPropsName('');
                  }}
                >
                  {t('button.cancel')}
                </Button>
                <Button
                  loading={saveLoading}
                  variant="primary"
                  onClick={() => {
                    savePropsToResource(selectedItems, () => {
                      setSearchPropsName('');
                      setSelectedItems([]);
                      clickHideModal();
                    });
                  }}
                >
                  {t('button.addToIdentifier')}
                </Button>
              </SpaceBetween>
            )}
          </Box>
        }
        header={
          propsType === '1'
            ? t('category.category')
            : t('identLabel.identLabel')
        }
      >
        <Table
          selectionType="single"
          columnDefinitions={[
            {
              id: 'props',
              header:
                propsType === '1'
                  ? t('category.category')
                  : t('identLabel.identLabel'),
              cell: (item: Props) => item.prop_name || '-',
              sortingField: 'prop_name',
            },
          ]}
          selectedItems={selectedItems}
          onSelectionChange={(e) => {
            if (e.detail.selectedItems.length === 1) {
              setCurrentProps(e.detail.selectedItems[0]);
            }
            setSelectedItems(e.detail.selectedItems);
          }}
          items={tableDisplayData}
          loading={loadingProps}
          loadingText={
            (propsType === '1'
              ? t('category.loadingCategories')
              : t('identLabel.loadingLabel')) || ''
          }
          sortingDisabled
          variant="embedded"
          empty={
            <Box textAlign="center" color="inherit">
              <div>
                <p>
                  {searchPropsName.trim()
                    ? propsType === '1'
                      ? t('category.noLabelFound')
                      : t('identLabel.noLabelFound')
                    : propsType === '1'
                    ? t('category.noCategories')
                    : t('identLabel.noLabel')}
                </p>
              </div>
              {!searchPropsName.trim() && (
                <Button
                  onClick={() => {
                    setShowCreateProps(true);
                  }}
                >
                  {propsType === '1'
                    ? t('button.createCategory')
                    : t('button.createIdentifierLabel')}
                </Button>
              )}
            </Box>
          }
          header={
            <Header
              counter={`(${allPropsList?.length.toString()})`}
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button
                    loading={loadingDelete}
                    disabled={selectedItems.length !== 1}
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
                      setShowCreateProps(true);
                    }}
                  >
                    {t('button.edit')}
                  </Button>
                  <Button
                    iconName="add-plus"
                    onClick={() => {
                      setCreateOrUpdate('create');
                      setCurrentProps({
                        id: '',
                        prop_name: '',
                        prop_type: '',
                      });
                      setShowCreateProps(true);
                    }}
                  >
                    {t('button.create')}
                  </Button>
                </SpaceBetween>
              }
            >
              {propsType === '1'
                ? t('category.category')
                : t('identLabel.identLabel')}
            </Header>
          }
          filter={
            <TextFilter
              onChange={(e) => {
                setSearchPropsName(e.detail.filteringText);
              }}
              filteringPlaceholder={
                (propsType === '1'
                  ? t('category.findCategories')
                  : t('identLabel.findLabels')) || ''
              }
              filteringText={searchPropsName}
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
        onDismiss={() => setShowCreateProps(false)}
        visible={showCreateProps}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="link"
                onClick={() => {
                  setShowCreateProps(false);
                }}
              >
                {t('button.cancel')}
              </Button>
              <Button
                loading={loadingUpdate}
                variant="primary"
                onClick={() => {
                  if (createOrUpdate === 'create') {
                    createprops();
                  } else {
                    updateprops();
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
            ? propsType === '1'
              ? t('category.createCategory')
              : t('identLabel.createLabel')
            : propsType === '1'
            ? t('category.updateCategory')
            : t('identLabel.updateLabel')
        }
      >
        <FormField>
          <Input
            value={currentProps.prop_name}
            onChange={(e) => {
              console.info('e:', e);
              setCurrentProps((prev) => {
                return {
                  ...prev,
                  prop_name: e.detail.value,
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
            {
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
                    deleteProps();
                  }}
                >
                  {t('button.delete')}
                </Button>
              </SpaceBetween>
            }
          </Box>
        }
        header={
          propsType === '1'
            ? t('category.deleteCategory')
            : t('identLabel.deleteLabel')
        }
      >
        <FormField>
          {propsType === '1'
            ? t('category.deleteTips')
            : t('identLabel.deleteTips')}
          <b>{selectedItems.map((element) => element.prop_name).join(', ')}</b>.
        </FormField>
      </Modal>
    </div>
  );
};

export default PropsModal;
