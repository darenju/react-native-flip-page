import React from 'react';
import {
  PanResponder,
  View,
  StyleSheet,
} from 'react-native';
import { rotateX, transformOrigin } from '../transform-utils';

export default class FlipPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      angle: 0,
      page: 0,
      halfHeight: 0,
      shouldGoNext: false,
      shouldGoPrevious: false,
      direction: '',
    };

    this.firstHalves = [];
    this.secondHalves = [];

    this.onLayout = this.onLayout.bind(this);
    this.renderPage = this.renderPage.bind(this);
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.handlePanResponderMove.bind(this),
      onPanResponderRelease: this.handlePanResponderStop.bind(this),
    });
  }

  rotateFirstHalf(angle) {
    const { halfHeight, page } = this.state;
    const firstHalf = this.firstHalves[page];

    let matrix = rotateX(angle);
    transformOrigin(matrix, { x: 0, y: halfHeight / 2, z: 0 });
    firstHalf.setNativeProps({
      transform: [
        { matrix },
        { perspective: '130em' }
      ],
    });
  }

  rotateSecondHalf(angle) {
    const { halfHeight, page } = this.state;
    const secondHalf = this.secondHalves[page];

    let matrix = rotateX(angle);
    transformOrigin(matrix, { x: 0, y: -1 * halfHeight / 2, z: 0 });
    secondHalf.setNativeProps({
      transform: [
        { matrix },
        { perspective: '130em' }
      ],
    });
  }

  handlePanResponderMove(e, gestureState) {
    const { dx, dy } = gestureState;
    const { halfHeight, page, direction } = this.state;

    let angle = (dy / 250) * 180;

    if (angle < 0) {
      angle = Math.max(-180, angle);
    } else {
      angle = Math.min(180, angle);
    }

    let nextDirection = direction;
    if (dy < 0 && direction === '') {
      nextDirection = 'top';
    } else if (dy > 0 && direction === '') {
      nextDirection = 'bottom';
    }

    this.setState({ direction: nextDirection });

    if (dy < 0 && nextDirection === 'top') {
      if (page === this.props.children.length - 1) {
        angle = Math.max(angle, -30);
      }

      this.rotateSecondHalf(angle);

      this.setState({
        angle,
      });
    } else if (dy > 0 && nextDirection === 'bottom') {
      if (page === 0) {
        angle = Math.min(angle, 30);
      }
      this.rotateFirstHalf(angle);

      this.setState({
        angle,
      });
    }
  }

  resetHalves() {
    const {
      angle,
      direction,
      shouldGoNext,
      shouldGoPrevious,
      page,
      halfHeight,
    } = this.state;

    const firstHalf = this.firstHalves[page];
    const secondHalf = this.secondHalves[page];

    const finish = () => {
      this.setState({ direction: '' });

      if (shouldGoNext) {
        this.setState({
          angle: 0,
          page: page + 1,
        }, () => {
          firstHalf.setNativeProps({ transform: [] });
          secondHalf.setNativeProps({ transform: [] });
        });
      } else if (shouldGoPrevious) {
        this.setState({
          angle: 0,
          page: page - 1,
        }, () => {
          firstHalf.setNativeProps({ transform: [] });
          secondHalf.setNativeProps({ transform: [] });
        });
      }
    };

    // Already swiped all the way
    if (Math.abs(angle) === 180) {
      finish();
      return;
    }

    let targetAngle;
    if (angle < -90) {
      targetAngle = -180;
    } else if (angle > 90) {
      targetAngle = 180;
    } else {
      targetAngle = 0;
    }

    this.resetTimer = setInterval(() => {
      let { angle } = this.state;

      angle += angle < targetAngle ? 5 : -5;

      if (angle < 0) {
        angle = Math.max(angle, -180);
      } else {
        angle = Math.min(angle, 180);
      }

      let matrix = rotateX(angle);

      if (angle < 0) {
        this.rotateSecondHalf(angle);
      } else {
        this.rotateFirstHalf(angle);
      }

      this.setState({ angle });

      if (
        (targetAngle < 0 && angle <= targetAngle) || // Flip second half to top
        (targetAngle === 0 && Math.abs(angle) <= 5) ||
        (targetAngle > 0 && angle >= targetAngle) // Flip first half to bottom
      ) {
        clearInterval(this.resetTimer);

        if (direction === 'top' || direction === '') {
          this.rotateSecondHalf(targetAngle);
        } else if (direction === 'bottom' || direction === '') {
          this.rotateFirstHalf(targetAngle);
        }

        finish();
      }
    }, 10);
  }

  handlePanResponderStop(e, gestureState) {
    const { dy } = gestureState;
    const { angle, page, direction } = this.state;
    const absAngle = Math.abs(angle);

    if (dy === 0) {
      const { onPress } = this.props.children[page].props;
      if (typeof onPress === 'function') {
        onPress();
      }
    }

    this.setState({
      shouldGoNext: absAngle > 90 && direction === 'top',
      shouldGoPrevious: absAngle > 90 && direction === 'bottom',
    }, this.resetHalves);
  }

  onLayout(e) {
    const halfHeight = e.nativeEvent.layout.height / 2;

    this.setState({ halfHeight });
  }

  renderPage(component, index) {
    const {
      angle,
      page,
      direction,
      targetPage,
      halfHeight,
    } = this.state;
    const { children } = this.props;
    const absAngle = Math.abs(angle);

    const thisPage = component;
    const nextPage = children[index + 1];
    const previousPage = index > 0 ? children[index - 1] : null;

    const secondHalfPull = {
      marginTop: halfHeight * -1,
    };

    return (
      <View
        style={[styles.page, { zIndex: page === index ? 1 : -1}]}
        key={`page-${index}`}
      >
        {/* Previous & next pages shown underneath the current page */}
        <View style={styles.page}>
          <View style={[styles.half, styles.firstHalf, styles.under]}>
            {previousPage}
          </View>
          <View style={[styles.half, styles.secondHalf, styles.under]}>
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
              styles.firstHalf,
              { zIndex: direction === 'bottom' ? 4 : 3 }
            ]}
            ref={view => this.firstHalves[index] = view}
          >
            <View style={{ zIndex: absAngle < 90 || direction !== 'bottom' ? 3 : 2 }}>
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
              styles.secondHalf,
              { zIndex: direction === 'top' ? 4 : 3 }
            ]}
            ref={view => this.secondHalves[index] = view}
          >
            <View style={styles.shadow} />
            <View
              style={[
                secondHalfPull,
                { zIndex: absAngle < 90 || direction === 'bottom' ? 3 : 2 },
              ]}>
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
              {nextPage}
            </View>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { children } = this.props;

    return (
      <View
        style={styles.container}
        {...this.panResponder.panHandlers}
        onLayout={this.onLayout}
      >
        {children.map(this.renderPage)}
      </View>
    );
  }
};

class FlipPagePage extends React.PureComponent {
  render() {
    const { children, style, onPress } = this.props;
    const defaultStyle = {
      backgroundColor: '#fff',
      height: '100%',
      width: '100%',
    };
    const finalStyle = Object.assign({}, defaultStyle, style);

    return (
      <View style={finalStyle}>
        {children}
      </View>
    )
  }
};

export {
  FlipPagePage
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  half: {
    height: '50%',
    position: 'absolute',
    left: 0,
    width: '100%',
    overflow: 'hidden',
  },
  under: {
    backgroundColor: '#000',
  },
  firstHalf: {
    top: 0,
  },
  secondHalf: {
    top: '50%',
  },
});
