[![npm version](https://badge.fury.io/js/react-native-flip-page.svg)](https://badge.fury.io/js/react-native-flip-page)

# react-native-flip-page

> **DISCLAIMER**: This package is in no way related to nor endorsed by Flipboard, Inc. nor [flipboard.com](http://www.flipboard.com). This is just a showcase of effect implemented with React Native.

This package allows you to use the cool Flipboard page swipe effect in your React Native apps.

## Install

Installation is pretty straight-forward, as you just have to `npm install` this package:

```
npm install --save react-native-flip-page
```

Then, use the module by importing in in your app code.

## Usage

This package consists of two components. Simply throw a `FlipPage` component with some `FlipPagePage` children that will be the content.

```html
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
| `orientation` | `string` | `vertical` | Orientation of swipes. `vertical` or `horizontal` for respectively up/down swipes and left/right swipes |

## Contribute

Since this is an open source project and it's far from perfect, contribution is welcome. Fork the repository and start working on your fix or new feature. Remember, it's good practice to work in your own branch, to avoid painful merge conflicts.

Once you think your work is ready, fire a [pull request](https://github.com/darenju/react-native-flip-page/pulls) with an understandable description of what you're bringing to the project. If it's alright, chances are high your work will be merged!
