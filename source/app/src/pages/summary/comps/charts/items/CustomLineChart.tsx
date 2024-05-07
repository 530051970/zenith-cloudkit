import { Header, LineChart } from '@cloudscape-design/components';
import React from 'react';
import Box from '@cloudscape-design/components/box';
import { useTranslation } from 'react-i18next';

interface CustomLineChartProps {
  title: string;
}

const CustomLineChart: React.FC<CustomLineChartProps> = (
  props: CustomLineChartProps
) => {
  const { title } = props;
  const { t } = useTranslation();
  return (
    <div>
      <Header variant="h3">{title}</Header>
      <div className="mt-20">
        <LineChart
          series={[]}
          xDomain={undefined}
          yDomain={[0, 500000]}
          i18nStrings={{
            filterLabel: t('summary:filterLabel') || '',
            filterPlaceholder: t('summary:filterPlaceholder') || '',
            filterSelectedAriaLabel: t('summary:filterSelectedAriaLabel') || '',
            detailPopoverDismissAriaLabel:
              t('summary:detailPopoverDismissAriaLabel') || '',
            legendAriaLabel: t('summary:legendAriaLabel') || '',
            chartAriaRoleDescription:
              t('summary:chartAriaRoleDescription') || '',
          }}
          ariaLabel={t('summary:ariaLabel') || ''}
          errorText={t('summary:errorText') || ''}
          height={300}
          hideFilter
          loadingText={t('summary:loadingText') || ''}
          recoveryText={t('summary:recoveryText') || ''}
          xScaleType="time"
          empty={
            <Box textAlign="center" color="inherit">
              <b>{t('summary:noData')}</b>
              <Box variant="p" color="inherit">
                {t('summary:noDataDesc')}
              </Box>
            </Box>
          }
        />
      </div>
    </div>
  );
};

export default CustomLineChart;
