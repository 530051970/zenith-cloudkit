import { BarChart } from '@cloudscape-design/components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnChartData } from 'ts/dashboard/types';

interface HorizontalBarChartProps {
  chartData: ColumnChartData[];
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = (
  props: HorizontalBarChartProps
) => {
  const { chartData } = props;
  const { t } = useTranslation();
  return (
    <div className="horizon-bar-chart">
      <BarChart
        hideFilter
        series={chartData}
        xDomain={['']}
        yDomain={[0, 1]}
        errorText={t('summary:errorText') || ''}
        height={30}
        horizontalBars
        loadingText={t('summary:loadingText') || ''}
        recoveryText={t('summary:recoveryText') || ''}
        stackedBars
        xScaleType="categorical"
      />
    </div>
  );
};

export default HorizontalBarChart;
