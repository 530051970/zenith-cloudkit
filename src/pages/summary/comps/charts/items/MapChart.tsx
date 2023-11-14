import { Header, Spinner } from '@cloudscape-design/components';
import React, { useEffect, useState } from 'react';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import MapMarker from './MapMarker';
import { getCatalogSummaryByRegion } from 'apis/dashboard/api';
import { IRegionDataType } from 'ts/dashboard/types';
import { formatSize, numberFormat } from 'tools/tools';

interface MapChartProps {
  title: string;
  sourceType: 's3' | 'rds';
}

const SUPPORTED_REGEIONS = [
  {
    markerOffset: 25,
    name: 'Northern Virginia (US East)',
    region: 'us-east-1',
    coordinates: [-77.0469, 38.8048],
  },
  {
    markerOffset: 25,
    name: 'Ohio (US East)',
    region: 'us-east-2',
    coordinates: [-83.0007, 39.9623],
  },
  {
    markerOffset: 25,
    name: 'Northern California (US West)',
    region: 'us-west-1',
    coordinates: [-122.4194, 37.7749],
  },
  {
    markerOffset: 25,
    name: 'Oregon (US West)',
    region: 'us-west-2',
    coordinates: [-123.0351, 44.9429],
  },
  {
    markerOffset: 25,
    name: 'Hong Kong (Asia Pacific)',
    region: 'ap-east-1',
    coordinates: [114.1694, 22.3193],
  },
  {
    markerOffset: 25,
    name: 'Mumbai (Asia Pacific)',
    region: 'ap-south-1',
    coordinates: [72.8777, 19.076],
  },
  {
    markerOffset: 25,
    name: 'Osaka (Asia Pacific)',
    region: 'ap-northeast-3',
    coordinates: [135.5023, 34.6937],
  },
  {
    markerOffset: 25,
    name: 'Seoul (Asia Pacific)',
    region: 'ap-northeast-2',
    coordinates: [126.978, 37.5665],
  },
  {
    markerOffset: 25,
    name: 'Singapore (Asia Pacific)',
    region: 'ap-southeast-1',
    coordinates: [103.8198, 1.3521],
  },
  {
    markerOffset: 25,
    name: 'Sydney (Asia Pacific)',
    region: 'ap-southeast-2',
    coordinates: [151.2093, -33.8688],
  },
  {
    markerOffset: 25,
    name: 'Tokyo (Asia Pacific)',
    region: 'ap-northeast-1',
    coordinates: [139.6503, 35.6762],
  },
  {
    markerOffset: 25,
    name: 'Montreal (Canada Central)',
    region: 'ca-central-1',
    coordinates: [-73.5673, 45.5017],
  },
  {
    markerOffset: 25,
    name: 'Frankfurt (EU Central)',
    region: 'eu-central-1',
    coordinates: [8.6821, 50.1109],
  },
  {
    markerOffset: 25,
    name: 'Dublin (EU West)',
    region: 'eu-west-1',
    coordinates: [-6.2603, 53.3498],
  },
  {
    markerOffset: 25,
    name: 'London (EU West)',
    region: 'eu-west-2',
    coordinates: [-0.1278, 51.5074],
  },
  {
    markerOffset: 25,
    name: 'Milan (EU South)',
    region: 'eu-south-1',
    coordinates: [9.19, 45.4642],
  },
  {
    markerOffset: 25,
    name: 'Paris (EU West)',
    region: 'eu-west-3',
    coordinates: [2.3522, 48.8566],
  },
  {
    markerOffset: 25,
    name: 'Stockholm (EU North)',
    region: 'eu-north-1',
    coordinates: [18.0686, 59.3293],
  },
  {
    markerOffset: 25,
    name: 'Bahrain (Middle East)',
    region: 'me-south-1',
    coordinates: [50.5577, 26.0667],
  },
  {
    markerOffset: 25,
    name: 'Sao Paulo (South America)',
    region: 'sa-east-1',
    coordinates: [-46.6333, -23.5505],
  },
  {
    markerOffset: 25,
    name: 'Beijing (China North)',
    region: 'cn-north-1',
    coordinates: [116.4074, 39.9042],
  },
  {
    markerOffset: 25,
    name: 'Ningxia (China Northwest)',
    region: 'cn-northwest-1',
    coordinates: [106.1581, 37.1987],
  },
];

function relativeCoords(event: any) {
  const x = event.nativeEvent.offsetX - 240;
  const y = event.nativeEvent.offsetY + 50;
  return { x: x, y: y };
}

const MapChart: React.FC<MapChartProps> = (props: MapChartProps) => {
  const { title, sourceType } = props;
  const [loadingData, setLoadingData] = useState(true);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverLeft, setPopoverLeft] = useState(-99999);
  const [popoverTop, setPopoverTop] = useState(-99999);
  const [resRegionData, setResRegionData] = useState<IRegionDataType[]>([]);
  const [popoverData, setPopoverData] = useState({
    regionWithName: '',
    totalBuckets: 0,
    totalObjects: 0,
    totalFileSize: 0,
    totalInstances: 0,
    totalDatabases: 0,
    totalTables: 0,
    totalColums: 0,
  });
  const [markers, setMarkers] = useState(SUPPORTED_REGEIONS);

  const getSummaryDataByRegion = async () => {
    setLoadingData(true);
    const res = await getCatalogSummaryByRegion({
      database_type: sourceType,
    });
    const resDataAsType = res as IRegionDataType[];
    const hadDataRegions = resDataAsType.map((element) => element.region);
    setMarkers((prev) => {
      return prev.filter((element) => hadDataRegions.includes(element.region));
    });
    setResRegionData(resDataAsType);
    setLoadingData(false);
  };

  useEffect(() => {
    getSummaryDataByRegion();
  }, []);

  return (
    <div className="dashboard-map">
      <Header variant="h3">{title}</Header>
      <div className="pr">
        {showPopover && (
          <div
            className="map-popover"
            style={{ left: popoverLeft, top: popoverTop }}
          >
            <div className="popover left">
              <div className="arrow"></div>
              <div className="popover-content">
                <div className="data-title">
                  <b>{popoverData.regionWithName}</b>
                </div>
                {sourceType === 's3' && (
                  <>
                    <div className="map-pop-item flex justify-spacebetween">
                      <div>Total buckets</div>
                      <div>{numberFormat(popoverData.totalBuckets)}</div>
                    </div>
                    <div className="map-pop-item flex justify-spacebetween">
                      <div>Total objects</div>
                      <div>{numberFormat(popoverData.totalObjects)}</div>
                    </div>
                    <div className="map-pop-item flex justify-spacebetween">
                      <div>Total file size</div>
                      <div>{formatSize(popoverData.totalFileSize)}</div>
                    </div>
                  </>
                )}

                {sourceType === 'rds' && (
                  <>
                    <div className="map-pop-item flex justify-spacebetween">
                      <div>Total instances</div>
                      <div>{numberFormat(popoverData.totalInstances)}</div>
                    </div>
                    <div className="map-pop-item flex justify-spacebetween">
                      <div>Total tables</div>
                      <div>{numberFormat(popoverData.totalTables)}</div>
                    </div>
                    <div className="map-pop-item flex justify-spacebetween">
                      <div>Total columns</div>
                      <div>{numberFormat(popoverData.totalColums)}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {loadingData ? (
          <Spinner />
        ) : (
          <ComposableMap>
            <Geographies geography="/geo.json">
              {({ geographies }: any) =>
                geographies.map((geo: any) => (
                  <Geography key={geo.rsmKey} geography={geo} />
                ))
              }
            </Geographies>
            {markers.map(
              ({ name, region, coordinates, markerOffset }, index) => (
                <MapMarker
                  key={index}
                  coordinates={coordinates}
                  name={region}
                  markerOffset={markerOffset}
                  showPopover={(show) => {
                    const curRegionData = resRegionData.find(
                      (element) => element.region === region
                    );
                    setPopoverData({
                      regionWithName: name,
                      totalBuckets: curRegionData?.database_total || 0,
                      totalObjects: curRegionData?.object_total || 0,
                      totalFileSize: curRegionData?.size_total || 0,
                      totalDatabases: curRegionData?.database_total || 0,
                      totalTables: curRegionData?.table_total || 0,
                      totalColums: curRegionData?.column_total || 0,
                      totalInstances: curRegionData?.instance_total || 0,
                    });
                    setShowPopover(show);
                  }}
                  markerMouseover={(e) => {
                    const { x, y } = relativeCoords(e);
                    setPopoverTop(y);
                    setPopoverLeft(x);
                  }}
                />
              )
            )}
          </ComposableMap>
        )}
      </div>
    </div>
  );
};

export default MapChart;
