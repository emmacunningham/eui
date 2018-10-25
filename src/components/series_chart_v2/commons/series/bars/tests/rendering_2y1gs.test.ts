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
  height: 150,
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
  'a--y1': 'green',
  'a--y2': 'blue',
  'b--y1': 'yellow',
  'b--y2': 'violet',
};

const SPEC: BarSeriesSpec = {
  id: getSpecId('spec1'),
  groupId: getGroupId('group1'),
  data: [
    { x: 0, g: 'a', y1: 1, y2: 4 },
    { x: 0, g: 'b', y1: 3, y2: 6 },
    { x: 1, g: 'a', y1: 2, y2: 1 },
    { x: 1, g: 'b', y1: 2, y2: 5 },
    { x: 2, g: 'a', y1: 10, y2: 5 },
    { x: 2, g: 'b', y1: 3, y2: 1 },
    { x: 3, g: 'a', y1: 7, y2: 3 },
    { x: 3, g: 'b', y1: 6, y2: 4 },
  ],
  xAccessor: 'x',
  yAccessors: ['y1', 'y2'],
  xScaleType: ScaleType.Linear,
  yScaleType: ScaleType.Linear,
  yScaleToDataExtent: false,
  splitSeriesAccessors: ['g'],
  stackAccessors: ['x', 'g'],
};

describe('Bar rendering 2Y1GS', () => {
  let computedDomains: SpecDomains;

  test('should compute the domain', () => {
    computedDomains = computeDataDomain(SPEC);

    expect(computedDomains).toMatchSnapshot();
  });

  test('Should compute a 2Y1GS bar series domain', () => {
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