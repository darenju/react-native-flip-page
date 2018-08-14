
export default (
  page,
  halfWidth,
  direction,
  width,
  secondHalfPull,
  styles,
  index,
  that,
  previousPage,
  thisPage,
  nextPage,
) => (
  <View
    style={[
      styles.page,
      { zIndex: page === index ? 1 : -1} // Page should not be visible if not current.
    ]}
    key={`page-${index}`}
  >
    <View
      style={[
        styles.page,
        { width: direction === 'left' ? '100%' : 0 },
      ]}
    >
      <View
        style={[
          styles.half,
          styles.horizontalHalf,
          styles.horizontalFirstHalf,
          styles.under,
        ]}
      >
        <View style={width}>
          {thisPage}
        </View>
      </View>
      <View
        style={[
          styles.half,
          styles.horizontalHalf,
          styles.horizontalSecondHalf,
          styles.under
        ]}
      >
        <View style={secondHalfPull}>
          {nextPage}
        </View>
      </View>
    </View>
    <View
      style={[
        styles.page,
        { width: direction === 'right' ? '100%' : 0 },
      ]}
    >
      <View
        style={[
          styles.half,
          styles.horizontalHalf,
          styles.horizontalFirstHalf,
          styles.under
        ]}
      >
        <View style={width}>
          {previousPage}
        </View>
      </View>
      <View
        style={[
          styles.half,
          styles.horizontalHalf,
          styles.horizontalSecondHalf,
          styles.under
        ]}
      >
        <View style={secondHalfPull}>
          {thisPage}
        </View>
      </View>
    </View>
    {/* Current page */}
    <View
      style={styles.page}
    >
      {/* Left part */}
      <View
        style={[
          styles.half,
          styles.horizontalHalf,
          styles.horizontalFirstHalf,
          { zIndex: direction === 'right' ? 4 : 3 },
          { width: direction === 'left' ? 0 : '50%' },
        ]}
        ref={view => this.firstHalves[index] = view}
      >
        <View
          style={[
            { zIndex: absAngle < 90 || direction !== 'right' ? 3 : 2 },
            width,
          ]}
        >
          {thisPage}
        </View>
        <View
          style={[
            styles.page,
            { zIndex: absAngle > 90 && direction === 'right' ? 3 : 2}
          ]}
          transform={[
            { rotateZ: '180deg' },
            { rotateX: '180deg' },
          ]}
        >
          <View style={secondHalfPull}>
            {previousPage}
          </View>
        </View>
      </View>
      {/* Right part */}
      <View
        style={[
          styles.half,
          styles.horizontalHalf,
          styles.horizontalSecondHalf,
          { zIndex: direction === 'left' ? 4 : 3 },
          { width: direction === 'right' ? 0 : '50%' },
        ]}
        ref={view => this.secondHalves[index] = view}
      >
        <View
          style={[
            secondHalfPull,
            { zIndex: absAngle < 90 || direction === 'right' ? 3 : 2 },
          ]}>
          {thisPage}
        </View>
        <View
          style={[
            styles.page,
            { zIndex: absAngle > 90 && direction === 'left' ? 3 : 2 },
          ]}
          transform={[
            { rotateZ: '180deg' },
            { rotateX: '180deg' },
          ]}
        >
          <View style={width}>
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
