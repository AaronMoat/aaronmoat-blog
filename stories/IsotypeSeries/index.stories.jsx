import React, { useState, useMemo } from 'react';
import { FlexibleWidthXYPlot, XAxis, YAxis, LineSeries } from 'react-vis';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCat, faLock } from '@fortawesome/free-solid-svg-icons';

import IsotypeSeries from '.';

export default {
  title: 'Isotype Series (custom react-vis chart)',
};

const getCustomIcon = icon => props => (
  <FontAwesomeIcon {...props} color={props.style.fill} icon={icon} />
);

const data = [
  { x: 'Clock', y: 8, icon: getCustomIcon(faClock) },
  { x: 'Cat', y: 11, icon: getCustomIcon(faCat) },
  { x: 'Lock', y: 3, icon: getCustomIcon(faLock) },
];

export const Chart = () => {
  const [activeColumn, setActiveColumn] = useState(null);

  const onMouseOver = column => {
    setActiveColumn(column.x);
  };

  const onMouseOut = () => {
    setActiveColumn(null);
  };

  const dataWithActiveState = useMemo(
    () =>
      data.map(item =>
        item.x === activeColumn ? { ...item, fill: '#fcba03' } : item
      ),
    [activeColumn]
  );

  return (
    <FlexibleWidthXYPlot height={300} xType="ordinal">
      <XAxis />
      <YAxis />
      <IsotypeSeries
        data={dataWithActiveState}
        onValueMouseOver={onMouseOver}
        onValueMouseOut={onMouseOut}
      />
    </FlexibleWidthXYPlot>
  );
};
