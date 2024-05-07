import React from 'react';

import { Marker } from 'react-simple-maps';
interface MapMarkerProps {
  coordinates: any;
  name: string;
  markerOffset: any;
  showPopover: (show: boolean) => void;
  markerMouseover: (e: any) => void;
}
const MapMarker: React.FC<MapMarkerProps> = (props: MapMarkerProps) => {
  const { coordinates, name, markerOffset, showPopover, markerMouseover } =
    props;
  return (
    <>
      <Marker
        coordinates={coordinates}
        onMouseMove={(e: any) => {
          showPopover(true);
          markerMouseover(e);
        }}
        onMouseLeave={() => {
          showPopover(false);
        }}
      >
        <circle
          id={`marker-${name}`}
          data-tooltip-content="hello world"
          r={8}
          fill="#fff"
          stroke="#0972d3"
          strokeWidth={4}
        />
        <text
          id="my-element"
          data-tooltip-content="hello abcd world"
          textAnchor="middle"
          y={markerOffset}
          style={{ fontFamily: 'system-ui', fill: '#222' }}
        >
          {name}
        </text>
      </Marker>
    </>
  );
};

export default MapMarker;
