import React from 'react';
import PropertyFilter from '@cloudscape-design/components/property-filter';
import { deepClone } from 'tools/tools';
import { ResourcesFilterProps } from 'ts/resources-filter/types';
import { useDistributionsPropertyFiltering } from './hook';
import { useTranslation } from 'react-i18next';

const DEFAULT_FILTER = ['=', '!=', ':', '!:'];

/**
 * Data text filter
 * @returns
 */
const ResourcesFilter: React.FC<ResourcesFilterProps> = (
  props: ResourcesFilterProps
) => {
  const {
    totalCount,
    columnList,
    className,
    tableName,
    query,
    setQuery,
    filteringPlaceholder,
    isFreeText,
  } = props;
  const { t } = useTranslation();

  const PROPERTY_FILTERING_I18N_CONSTANTS = {
    filteringAriaLabel: t('filter.filteringAriaLabel'),
    dismissAriaLabel: t('filter.dismissAriaLabel'),
    filteringPlaceholder: t('filter.filteringPlaceholder'),
    groupValuesText: t('filter.groupValuesText'),
    groupPropertiesText: t('filter.groupPropertiesText'),
    operatorsText: t('filter.operatorsText'),
    operationAndText: t('filter.operationAndText'),
    operationOrText: t('filter.operationOrText'),
    operatorLessText: t('filter.operatorLessText'),
    operatorLessOrEqualText: t('filter.operatorLessOrEqualText'),
    operatorGreaterText: t('filter.operatorGreaterText'),
    operatorGreaterOrEqualText: t('filter.operatorGreaterOrEqualText'),
    operatorContainsText: t('filter.operatorContainsText'),
    operatorDoesNotContainText: t('filter.operatorDoesNotContainText'),
    operatorEqualsText: t('filter.operatorEqualsText'),
    operatorDoesNotEqualText: t('filter.operatorDoesNotEqualText'),
    editTokenHeader: t('filter.editTokenHeader'),
    propertyText: t('filter.propertyText'),
    operatorText: t('filter.operatorText'),
    valueText: t('filter.valueText'),
    cancelActionText: t('filter.cancelActionText'),
    applyActionText: t('filter.applyActionText'),
    allPropertiesLabel: t('filter.allPropertiesLabel'),
    tokenLimitShowMore: t('filter.tokenLimitShowMore'),
    tokenLimitShowFewer: t('filter.tokenLimitShowFewer'),
    clearFiltersText: t('filter.clearFiltersText'),
    removeTokenButtonAriaLabel: (token: any) =>
      `${t('filter.removeToken')} ${token.propertyKey} ${token.operator} ${
        token.value
      }`,
    enteredTextLabel: (text: any) => `${t('filter.use')}"${text}"`,
  };

  const filterColumns = columnList?.map((item: { id: any; label: any }) => {
    return {
      key: item.id,
      operators: deepClone(DEFAULT_FILTER),
      propertyLabel: t(item.label),
      groupValuesLabel: `${t(item.label)} ${t('filter.values')}`,
    };
  });

  const {
    status: filteringStatus,
    filteringOptions,
    handleLoadItems,
  } = useDistributionsPropertyFiltering(tableName);

  const i18Info = PROPERTY_FILTERING_I18N_CONSTANTS;
  if (filteringPlaceholder) {
    i18Info.filteringPlaceholder = filteringPlaceholder;
  }

  return (
    <PropertyFilter
      className={className}
      onChange={({ detail }) => setQuery(detail)}
      query={query}
      i18nStrings={PROPERTY_FILTERING_I18N_CONSTANTS}
      countText={
        totalCount || totalCount === 0
          ? `${totalCount} ${t('filter.matches')}`
          : undefined
      }
      hideOperations={true}
      tokenLimit={3}
      expandToViewport
      filteringOptions={
        isFreeText
          ? [
              { propertyKey: 'privacy', value: 'Contain-PII' },
              { propertyKey: 'privacy', value: 'Non-PII' },
              { propertyKey: 'privacy', value: 'N/A' },
            ]
          : filteringOptions
      } // 待筛选项
      filteringProperties={
        isFreeText
          ? [
              {
                key: 'privacy',
                operators: ['=', '!=', ':', '!:'],
                propertyLabel: t('table.label.privacy'),
                groupValuesLabel: t('table.label.privacy'),
              },
            ]
          : (filterColumns as any)
      }
      onLoadItems={handleLoadItems}
      filteringStatusType={filteringStatus as any}
    />
  );
};

export default ResourcesFilter;
