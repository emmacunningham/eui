import { Dimensions } from '../../../dimensions';
import { getGroupId, getSpecId } from '../../../ids';
import { ColorConfig, ScalesConfig } from '../../../themes/theme';
import { SpecDomains } from '../../../utils/domain';
import { ScaleType } from '../../../utils/scales';
import { BarSeriesSpec } from '../../specs';
import { computeDataDomain } from '../domains';
import { renderBarSeriesSpec } from '../rendering';

const CHART_DIMS: Dimensions = {
  top: 0,
  left: 0,
  width: 160, // to easy compute spaces
  height: 100,
};

const chartScalesConfig: ScalesConfig = {
  ordinal: {
    padding: 0,
  },
};

const chartColorsConfig: ColorConfig = {
  vizColors: ['green', 'blue'],
  defaultVizColor: 'red',
};

const colorScales = {
  y1: 'green',
  y2: 'blue',
};

const SPEC: BarSeriesSpec = {
  id: getSpecId('spec1'),
  groupId: getGroupId('group1'),
  data: [
    { x: 0, y1: 1, y2: 3 },
    { x: 1, y1: 2, y2: 7 },
    { x: 2, y1: 1, y2: 2 },
    { x: 3, y1: 6, y2: 10 },
  ],
  xAccessor: 'x',
  yAccessors: ['y1', 'y2'],
  xScaleType: ScaleType.Linear,
  yScaleType: ScaleType.Linear,
  yScaleToDataExtent: false,
};

describe('Bar rendering 2Y0G', () => {
  let computedDomains: SpecDomains;

  test('should compute the domain', () => {
    computedDomains = computeDataDomain(SPEC);
    // we will expect a 0 level x domain with ordinal type because
    // we have 2 y variables and they needs to be grouped along X
    expect(computedDomains).toMatchSnapshot();
  });

  test('should render the bar series', () => {
    const renderedData = renderBarSeriesSpec(
      SPEC,
      computedDomains,
      CHART_DIMS,
      0,
      colorScales,
      chartColorsConfig,
      chartScalesConfig,
    );
    expect(renderedData).toMatchSnapshot();
  });
});