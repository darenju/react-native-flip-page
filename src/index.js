import React from 'react';
import {
  PanResponder,
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import { rotateX, rotateY, transformOrigin } from './transform-utils';
import renderVerticalPage from './vertical-page';
import renderHorizontalPage from './horizontal-page';

class FlipPage extends React.Component {
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
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) >= 1 && Math.abs(dy) >= 1;
      },
      onPanResponderMove: this.handlePanResponderMove.bind(this),
      onPanResponderRelease: this.handlePanResponderStop.bind(this),
    });
  }

  rotateFirstHalf(angle) {
    const {
      halfHeight,
      halfWidth,
      page,
    } = this.state;
    const { orientation } = this.props;
    const firstHalf = this.firstHalves[page];

    let matrix = orientation === 'vertical' ? rotateX(angle) : rotateY(angle);
    const origin = orientation === 'vertical' ?
      { x: 0, y: halfHeight / 2, z: 0 } :
      { x: halfWidth / 2, y: 0, z: 0 };
    transformOrigin(matrix, origin);
    firstHalf.setNativeProps({
      transform: [
        { matrix },
        { perspective: '130em' },
      ],
    });
  }

  rotateSecondHalf(angle) {
    const {
      halfHeight,
      halfWidth,
      page,
    } = this.state;
    const { orientation } = this.props;
    const secondHalf = this.secondHalves[page];

    let matrix = orientation === 'vertical' ? rotateX(angle) : rotateY(angle);
    const origin = orientation === 'vertical' ?
      { x: 0, y: -halfHeight / 2, z: 0 } :
      { x: -halfWidth / 2, y: 0, z: 0 };
    transformOrigin(matrix, origin);
    secondHalf.setNativeProps({
      transform: [
        { matrix },
        { perspective: '130em' },
      ],
    });
  }

  handlePanResponderMove(e, gestureState) {
    const { dx, dy } = gestureState;
    const { page, direction } = this.state;
    const { orientation } = this.props;
    const dn = orientation === 'vertical' ? dy : dx;

    let angle = (dn / 250) * 180;

    if (angle < 0) {
      angle = Math.max(-180, angle);
    } else {
      angle = Math.min(180, angle);
    }

    let nextDirection = direction;

    if (dn < 0 && direction === '') {
      nextDirection = orientation === 'vertical' ? 'top' : 'left';
    } else if (dn > 0 && direction === '') {
      nextDirection = orientation === 'vertical' ? 'bottom' : 'right';
    }

    this.setState({ direction: nextDirection });

    if (dn < 0 && (nextDirection === 'top' || nextDirection === 'left')) {
      if (page === this.props.children.length - 1) {
        angle = Math.max(angle, -30);
      }

      this.rotateSecondHalf(angle);

      this.setState({
        angle,
      });
    } else if (dn > 0 && (nextDirection === 'bottom' || nextDirection === 'right')) {
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

        if (direction === 'top' || direction === 'left' || direction === '') {
          this.rotateSecondHalf(targetAngle);
        } else if (direction === 'bottom' || direction === 'right' || direction === '') {
          this.rotateFirstHalf(targetAngle);
        }

        finish();
      }
    }, 10);
  }

  handlePanResponderStop(e, gestureState) {
    const { dx, dy } = gestureState;
    const { angle, page, direction } = this.state;
    const { orientation } = this.props;
    const dn = orientation === 'vertical' ? dy : dx;
    const absAngle = Math.abs(angle);

    if (dn === 0) {
      const { onPress } = this.props.children[page].props;
      if (typeof onPress === 'function') {
        onPress();
      }
    }

    this.setState({
      shouldGoNext: absAngle > 90 && (direction === 'top' || direction === 'left'),
      shouldGoPrevious: absAngle > 90 && (direction === 'bottom' || direction === 'right'),
    }, this.resetHalves);
  }

  onLayout(e) {
    const { layout } = e.nativeEvent;
    const { width, height } = layout;
    const halfHeight = height / 2;
    const halfWidth = width / 2;

    this.setState({
      halfHeight,
      halfWidth,
    });
  }

  renderVerticalPage(previousPage, thisPage, nextPage, index) {
    const {
      angle,
      page,
      halfHeight,
      direction,
    } = this.state;

    const height = { height: halfHeight * 2 };

    const absAngle = Math.abs(angle);

    const secondHalfPull = {
      marginTop: -halfHeight,
    };

    const setViewCallback = (view) => this.firstHalves[index] = view;
    console.log(typeof setViewCallback);

    return renderVerticalPage(
      absAngle,
      page,
      halfHeight,
      direction,
      height,
      secondHalfPull,
      styles,
      index,
      this,
      previousPage,
      thisPage,
      nextPage,
    );
  }

  renderHorizontalPage(previousPage, thisPage, nextPage, index) {
    const {
      angle,
      page,
      halfHeight,
      halfWidth,
      direction,
    } = this.state;

    const width = { width: halfWidth * 2 };

    const absAngle = Math.abs(angle);

    const secondHalfPull = {
      marginLeft: -halfWidth,
    };

    return renderHorizontalPage(
      absAngle,
      page,
      halfWidth,
      direction,
      width,
      secondHalfPull,
      styles,
      index,
      this,
      previousPage,
      thisPage,
      nextPage,
    );
  }

  renderPage(component, index) {
    const { halfWidth } = this.state;
    const { children, orientation } = this.props;

    const thisPage = component;
    const nextPage = children[index + 1];
    const previousPage = index > 0 ? children[index - 1] : null;

    if (orientation === 'vertical') {
      return this.renderVerticalPage(previousPage, thisPage, nextPage, index);
    } else {
      return this.renderHorizontalPage(previousPage, thisPage, nextPage, index);
    }
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

FlipPage.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
};

FlipPage.defaultProps = {
  orientation: 'vertical',
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
  FlipPage as default,
  FlipPagePage
};
