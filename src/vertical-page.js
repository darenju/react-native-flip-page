import React from 'react';
import { View } from 'react-native';

export default (absAngle,
  page,
  halfHeight,
  direction,
  height,
  secondHalfPull,
  styles,
  index,
  that,
  previousPage,
  thisPage,
  nextPage,
) => (
  <View
    style={[styles.page, { zIndex: page === index ? 1 : -1}]}
    key={`page-${index}`}
  >
    {/* Previous & next pages shown underneath the current page */}
    <View style={styles.page}>
      <View
        style={[
          styles.half,
          styles.verticalHalf,
          styles.verticalFirstHalf,
          styles.under
        ]}
      >
        <View style={height}>
          {previousPage}
        </View>
      </View>
      <View
        style={[
          styles.half,
          styles.verticalHalf,
          styles.verticalSecondHalf,
          styles.under
        ]}
      >
        <View style={secondHalfPull}>
          {nextPage}
        </View>
      </View>
    </View>
    {/* Current page */}
    <View style={styles.page}>
      <View
        style={[
          styles.half,
          styles.verticalHalf,
          styles.verticalFirstHalf,
          { zIndex: direction === 'bottom' ? 4 : 3 }
        ]}
        ref={view => that.firstHalves[index] = view}
      >
        <View
          style={[
            { zIndex: absAngle < 90 || direction !== 'bottom' ? 3 : 2 },
            height,
          ]}
        >
          {thisPage}
        </View>
        <View
          style={[
            styles.page,
            { zIndex: absAngle > 90 && direction === 'bottom' ? 3 : 2}
          ]}
          transform={[
            { rotateZ: '180deg' },
            { rotateY: '180deg' },
          ]}
        >
          <View style={secondHalfPull}>
            {previousPage}
          </View>
        </View>
      </View>
      <View
        style={[
          styles.half,
          styles.verticalHalf,
          styles.verticalSecondHalf,
          { zIndex: direction === 'top' ? 4 : 3 }
        ]}
        ref={view => that.secondHalves[index] = view}
      >
        <View style={styles.shadow} />
        <View
          style={[
            secondHalfPull,
            { zIndex: absAngle < 90 || direction === 'bottom' ? 3 : 2 },
          ]}
        >
          {thisPage}
        </View>
        <View
          style={[
            styles.page,
            { zIndex: absAngle > 90 && direction === 'top' ? 3 : 2 },
          ]}
          transform={[
            { rotateZ: '180deg' },
            { rotateY: '180deg' },
          ]}
        >
          <View style={height}>
            {nextPage}
          </View>
        </View>
      </View>
    </View>
    <View
      style={[
        styles.page,
        {
          top: direction !== '' ? '-100%' : 0,
          overflow: 'hidden',
        },
      ]}
    >
      {thisPage}
    </View>
  </View>
);

export default renderVerticalPage;
