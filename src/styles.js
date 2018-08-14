import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden',
  },
  verticalHalf: {
    height: '50%',
    width: '100%',
  },
  horizontalHalf: {
    height: '100%',
    width: '50%',
  },
  under: {
    backgroundColor: '#000',
  },
  verticalFirstHalf: {
    top: 0,
  },
  verticalSecondHalf: {
    top: '50%',
  },
  horizontalFirstHalf: {
    left: 0,
  },
  horizontalSecondHalf: {
    left: '50%',
  },
});
