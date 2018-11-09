import { AxisTicksDimensions } from '../axes/axis_utils';
import { AxisOrientation, AxisPosition, AxisSpec } from '../series/specs';
import { AxisId } from './ids';

export interface Dimensions {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface Margins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
/**
 * Compute the chart dimension padding the parent dimension by the specified set of axis
 * @param parentDimensions the parent dimension
 * @param axisDimensions the axis dimensions
 * @param axisSpecs the axis specs
 */
export function computeChartDimensions(
  parentDimensions: Dimensions,
  chartMargins: Margins,
  chartPaddings: Margins,
  axisDimensions: Map<AxisId, AxisTicksDimensions>,
  axisSpecs: Map<AxisId, AxisSpec>,
): Dimensions {
  let vLeftAxisSpecWidth = 0;
  let vRightAxisSpecWidth = 0;
  let hTopAxisSpecHeight = 0;
  let hBottomAxisSpecHeight = 0;

  axisDimensions.forEach(({ maxTickWidth = 0, maxTickHeight = 0 }, id) => {
    const axisSpec = axisSpecs.get(id);
    if (!axisSpec) {
      return;
    }
    const { orientation, position, tickSize, tickPadding } = axisSpec;
    if (orientation === AxisOrientation.Horizontal) {
      if (position === AxisPosition.Top) {
        hTopAxisSpecHeight += maxTickHeight + tickSize + tickPadding + chartMargins.top;
      } else if (position === AxisPosition.Bottom) {
        hBottomAxisSpecHeight += maxTickHeight + tickSize + tickPadding  + chartMargins.bottom;
      }
    } else {
      if (position === AxisPosition.Left) {
        vLeftAxisSpecWidth += maxTickWidth + tickSize + tickPadding + chartMargins.left;
      } else if (position === AxisPosition.Right) {
        vRightAxisSpecWidth += maxTickWidth + tickSize + tickPadding + chartMargins.right;
      }
    }
  });
  // const hMargins = chartMargins.left + chartMargins.right;
  const chartWidth = parentDimensions.width - vLeftAxisSpecWidth - vRightAxisSpecWidth;
  const chartHeight = parentDimensions.height - hTopAxisSpecHeight - hBottomAxisSpecHeight;
  let vMargin = 0;
  if (hTopAxisSpecHeight === 0) {
    vMargin += chartMargins.top;
  }
  if (hBottomAxisSpecHeight === 0) {
    vMargin += chartMargins.bottom;
  }
  let hMargin = 0;
  if (vLeftAxisSpecWidth === 0) {
    hMargin += chartMargins.left;
  }
  if (vRightAxisSpecWidth === 0) {
    hMargin += chartMargins.right;
  }
  return {
    top: hTopAxisSpecHeight === 0 ? chartMargins.top + chartPaddings.top : hTopAxisSpecHeight + chartPaddings.top,
    left: vLeftAxisSpecWidth === 0 ? chartMargins.left + chartPaddings.left : vLeftAxisSpecWidth + chartPaddings.left,
    width: chartWidth - hMargin - chartPaddings.left - chartPaddings.right,
    height: chartHeight - vMargin - chartPaddings.bottom - chartPaddings.bottom,
  };
  // return {
  //   top: hTopAxisSpecHeight === 0 ? chartMargins.top : hTopAxisSpecHeight,
  //   left: vLeftAxisSpecWidth === 0 ? chartMargins.left : vLeftAxisSpecWidth,
  //   width: chartWidth - hMargin,
  //   height: chartHeight - vMargin,
  // };
}