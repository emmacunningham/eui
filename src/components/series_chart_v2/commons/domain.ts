import { extent, sum } from 'd3-array';
import { nest } from 'd3-collection';
import { sortedUniq, uniq } from 'lodash';
import { ScaleType } from './scales';
import { DataSeriesSpec } from './specs';

export type Domain = number[] | string[] | [number, number] | [undefined, undefined];

export interface SeriesScales {
  groupLevel: number;
  xDomain: Domain;
  yDomain?: Domain;
  xScaleType: ScaleType;
  yScaleType?: ScaleType;
  xAccessor: Accessor;
  yAccessor?: Accessor;
}

export type OrdinalAccessor = (d: any) => any;
export type ContinuousAccessor = (d: any) => number;
export type Accessor = OrdinalAccessor | ContinuousAccessor;
// type ContinuousScaleTypes = ScaleType.Linear | ScaleType.Sqrt | ScaleType.Log

export function computeDataDomain(
  data: any[],
  accessor: Accessor,
  scaleType: ScaleType,
  scaleToExtent = false,
  sorted = false,
  stackAccessor?: Accessor,
) {
  if (scaleType === ScaleType.Ordinal) {
    return computeOrdinalDataDomain(data, accessor as OrdinalAccessor, sorted);
  }
  if (stackAccessor) {
    return computeStackedContinuousDomain(data, stackAccessor, accessor as ContinuousAccessor, scaleToExtent);
  } else {
    return computeContinuousDataDomain(data, accessor as ContinuousAccessor, scaleToExtent);
  }
}

function computeOrdinalDataDomain(
  data: any[],
  accessor: OrdinalAccessor,
  sorted?: boolean,
): string[] | number[] {
  const domain = data.map(accessor);
  return sorted ? sortedUniq(domain) : uniq(domain);
}

export function computeContinuousDataDomain(
  data: any[],
  accessor: ContinuousAccessor,
  scaleToExtent = false,
): [number, number] | [undefined, undefined] {
  const range = extent(data, accessor);
  return scaleToExtent ? range : [0, range[1] || 0];
}

export function computeStackedContinuousDomain(
  data: any[],
  stackAccessor: OrdinalAccessor,
  accessor: ContinuousAccessor,
  scaleToExtent = false,
): any {
  const groups = nest<any, number>()
    .key(stackAccessor)
    .rollup((values) => {
      return sum(values, accessor);
    })
    .entries(data);
  const cumulativeSumAccessor = (d: any) => d.value;
  return computeContinuousDataDomain(groups, cumulativeSumAccessor, scaleToExtent);
}

export function computeSeriesDomains(seriesSpec: DataSeriesSpec): SeriesScales[] {
  const {
    xScaleType,
    yScaleType,
    xAccessor,
    yAccessor,
    stackAccessor,
    groupAccessors,
    data,
    scaleToExtent,
  } = seriesSpec;
  const mainXDomainScaleType = (groupAccessors && groupAccessors.length) > 0 ? ScaleType.Ordinal : xScaleType;
  const xDomain = computeDataDomain(data, xAccessor, mainXDomainScaleType);
  const mainYDomain = computeDataDomain(data, yAccessor, yScaleType, scaleToExtent, true, stackAccessor);
  if (groupAccessors && groupAccessors.length > 0) {
    const groupDomains = groupAccessors.map((accessor, groupLevel) => {
      const groupXDomain = computeDataDomain(data, accessor, ScaleType.Ordinal);
      return {
        groupLevel,
        xDomain: groupXDomain,
        xScaleType: ScaleType.Ordinal,
        xAccessor: accessor,
      };
    });
    return [
      ...groupDomains,
      {
        groupLevel: groupDomains.length,
        xDomain,
        yDomain: mainYDomain,
        xScaleType: ScaleType.Ordinal,
        yScaleType,
        xAccessor,
        yAccessor,
      },
    ];
  }

  return [{
    groupLevel: 0,
    xDomain,
    yDomain: mainYDomain,
    xScaleType,
    yScaleType,
    xAccessor,
    yAccessor,
  }];
}

/**
 * Merge passed domain into a multidomain. If save scaletype is available,
 * then the merge is on the same scale type, if not ordinal scale type is used
 * @return [description]
 */
export function mergeGlobalDomains(currentSeriesScales: SeriesScales, seriesScales: SeriesScales) {
  // TODO
}
