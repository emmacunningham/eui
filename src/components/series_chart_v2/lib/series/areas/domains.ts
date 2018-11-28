import { extent, sum } from 'd3-array';
import { uniq } from 'lodash';
import { Accessor, getAccessorFn } from '../../utils/accessor';
import { Domain, SpecDomains } from '../../utils/domain';
import { ScaleType } from '../../utils/scales/scales';
import { AreaSeriesSpec } from '../specs';

/**
 * Compute the domains configuration based for a bar series spec.
 * Depending on groupings and stacking, the resulting domains will reflect
 * the number of group levels required to correctly render data.
 * @param spec the BarSeriesSpec
 * @return SpecDomains
 */
export function computeDataDomain(spec: AreaSeriesSpec): SpecDomains {
  // compute x domains
  const {
    data,
    xScaleType,
    yScaleType,
    xAccessor,
    yAccessors,
    splitSeriesAccessors = [],
    stackAccessors = [],
    colorAccessors = [],
  } = spec;
  const stackedData: Map<string, any[]> = new Map();
  const colorKeys: Set<string> = new Set();
  let yDomain: any[] = [];

  let xDomain: Domain = [];
  let configuredColorAccessors: Accessor[];
  if (colorAccessors.length > 0) {
    configuredColorAccessors = colorAccessors;
  } else {
    configuredColorAccessors = splitSeriesAccessors;
  }

  data.map((datum) => {
    // computing the xDomain of each splitted series
    if (!xDomain) {
      xDomain = [];
    }
    const value = datum[xAccessor];
    (xDomain as any[]).push(value);
    // getting all the y values
    const yValues = yAccessors.map((accessor) => {
      return datum[accessor];
    });
    // compute y domain
    if (spec.yDomain) {
      yDomain = spec.yDomain;
    } else {
      // TODO check this, the y value can be ordinal only when using point series.
      if (yScaleType === ScaleType.Ordinal) {
        yDomain = [...yDomain, ...yValues];
      } else {
        // computing the stack value
        if (stackAccessors.length > 0) {
          const stackKey = stackAccessors.map((accessor) => String(datum[accessor])).join('--');
          if (!stackedData.has(stackKey)) {
            stackedData.set(stackKey, []);
          }
          const prevValues = stackedData.get(stackKey)!;
          stackedData.set(stackKey, [...prevValues, ...yValues]);
        } else {
          const yExtent = extent(yValues);
          if (yDomain.length === 0) {
            yDomain = [yExtent[0], yExtent[1]];
          }
          const [min, max] = yDomain;
          yDomain = [Math.min(min, yExtent[0]), Math.max(max, yExtent[1])];
        }
      }
    }
    const colorKey = configuredColorAccessors.map((accessor) => getAccessorFn(accessor)(datum));
    if (yAccessors.length > 1) {
      yAccessors.forEach((yAccessor) => {
        colorKeys.add([...colorKey, yAccessor].join('--'));
      });
    } else {
      colorKeys.add(colorKey.join('--'));
    }
  });
  if (stackAccessors.length > 0) {
    const stackedDataArray = Array.from(stackedData.values());

    const stackedDomain = stackedDataArray.map((sdaValue) => {
      return sum(sdaValue);
    });
    yDomain = extent(stackedDomain);
  }
  if (!spec.yScaleToDataExtent) {
    yDomain = [0, yDomain[1]];
  }
  let domain: Domain = [];
  if (spec.xDomain) {
    domain = spec.xDomain;
  } else {
    domain = getDomain(xScaleType, xDomain);
  }
  const xDomains = [
    {
      accessor: xAccessor,
      level: 0,
      scaleType: xScaleType,
      domain,
    },
  ];

  return {
    xDomains,
    yDomain: {
      accessor: 'y',
      level: 0,
      domain: yDomain,
      scaleType: yScaleType,
      isStacked: stackAccessors.length > 0,
    },
    colorDomain: {
      accessors: configuredColorAccessors,
      yAccessors: yAccessors.length > 1 ? yAccessors : undefined,
      domain: [...colorKeys],
      scaleType: ScaleType.Ordinal,
    },
  };
}

function getDomain(scaleType: ScaleType, domain: Domain) {
  if (scaleType === ScaleType.Linear) {
    return extent(domain as number[]);
  } else {
    return uniq(domain as string[]);
  }
}
