// Parts of the following is modified from react-vis source code.
// The following is the copyright notice from that.
//
// Copyright (c) 2016 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';

import { AbstractSeries } from 'react-vis';

export default class IsotypeSeries extends AbstractSeries {
  static getParentConfig(attr) {
    return {
      isDomainAdjustmentNeeded: attr === 'x',
      zeroBaseValue: attr === 'y',
    };
  }

  renderRectangle(attrs) {
    // Fallback if no icon is provided
    return <rect {...attrs} />;
  }

  renderSymbol(attrs) {
    const { icon: Icon = this.renderRectangle, ...rest } = attrs;
    return <Icon {...rest} />;
  }

  render() {
    this._getAttributeFunctor('fill');
    const {
      data,
      marginLeft,
      marginTop,
      style,
      scaleFactor = 0.85,
    } = this.props;

    if (!data) {
      return null;
    }

    const lineFunctor = this._getAttributeFunctor('x');
    const valueFunctor = this._getAttributeFunctor('y');
    const value0Functor = this._getAttr0Functor('y');
    const fillFunctor =
      this._getAttributeFunctor('fill') || this._getAttributeFunctor('color');
    const strokeFunctor =
      this._getAttributeFunctor('stroke') || this._getAttributeFunctor('color');
    const opacityFunctor = this._getAttributeFunctor('opacity');

    const heightPerIcon = Math.abs(valueFunctor({ y: 1 }) - value0Functor({}));
    const widthPerIcon = this._getScaleDistance('x');
    const size = Math.min(widthPerIcon, heightPerIcon) * scaleFactor;

    return (
      <g transform={`translate(${marginLeft},${marginTop})`}>
        {data.map((column, i) => {
          const dataPointsForColumn = Array(column.y)
            .fill()
            .map((_, i) => ({ ...column, y: i + 1 }));

          return (
            <g
              key={column.x}
              onMouseOver={e => this._valueMouseOverHandler(column, e)}
              onMouseOut={e => this._valueMouseOutHandler(column, e)}
            >
              <rect
                x={lineFunctor(column) - size / 2}
                width={size}
                y={Math.min(value0Functor(column), valueFunctor(column))}
                height={Math.abs(-value0Functor(column) + valueFunctor(column))}
                fill="transparent"
              />

              {dataPointsForColumn.map(d => {
                const attrs = {
                  style: {
                    fill: d.fill || 'rgb(18, 147, 154)',
                    ...style,
                  },
                  x: lineFunctor(d) - size / 2,
                  y: valueFunctor(d),
                  width: size,
                  height: size,
                  key: d.y,
                  icon: column.icon,
                };

                return this.renderSymbol(attrs);
              })}
            </g>
          );
        })}
      </g>
    );
  }
}
