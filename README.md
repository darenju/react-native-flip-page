[![npm version](https://badge.fury.io/js/react-native-flip-page.svg)](https://badge.fury.io/js/react-native-flip-page)

# react-native-flip-page

> **DISCLAIMER**: This package is in no way related to nor endorsed by Flipboard, Inc. nor [flipboard.com](http://www.flipboard.com). This is just a showcase of effect implemented with React Native.

This package allows you to use the cool Flipboard page swipe effect in your React Native apps.

![Demo GIF](https://raw.githubusercontent.com/darenju/react-native-flip-page/master/demo.gif)

## Install

Installation is pretty straight-forward, as you just have to `npm install` this package:

```
npm install --save react-native-flip-page
```

Then, use the module by importing in in your app code.

## Usage

This package consists of two components. Simply throw a `FlipPage` component with some `FlipPagePage` children that will be the content.

```
<FlipPage>
  <FlipPagePage>
    <Text>Page 1</Text>
  </FlipPagePage>
  <FlipPagePage>
    <Text>Page 2</Text>
  </FlipPagePage>
  <FlipPagePage>
    <Text>Page 3</Text>
  </FlipPagePage>
</FlipPage>
```

### Props

There are a few properties that define the behaviour of the component, here they are:

| Prop | Type | Default | Role |
|------|------|---------|------|
| `loopForever` | `bool` | `false` | Indicates if the component should go back to the first page when reaching last page, and go back to last page after reaching first page. |
| `orientation` | `string` | `vertical` | Orientation of swipes. `vertical` or `horizontal` for respectively up/down swipes and left/right swipes. |
| `onFinish(orientation)` | `function` | `null` | Function called after the swipe is finished. Only usable if `loopForever` is `false`. |
| `reverse` | `bool` | `false` | If true, the user must swip in reverse order: he must swipe down/right to see the next page, and up/left to see the previous page.(Good for Rtl book like persian) |
| `onPageChange(pageIndex,direction)` | `function` | `null` | Callback when the page has been changed. Parameters: pageIndex, direction |

## Contribute

Since this is an open source project and it's far from perfect, contribution is welcome. Fork the repository and start working on your fix or new feature. Remember, it's good practice to work in your own branch, to avoid painful merge conflicts.

Once you think your work is ready, fire a [pull request](https://github.com/darenju/react-native-flip-page/pulls) with an understandable description of what you're bringing to the project. If it's alright, chances are high your work will be merged!
