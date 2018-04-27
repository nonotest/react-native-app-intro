import assign from 'assign-deep'
import React, { Component } from 'react'
import PropTypes from 'prop-types';

import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  Platform
} from 'react-native'
import Swiper from 'react-native-swiper'
import DoneButton from './components/DoneButton'
import SkipButton from './components/SkipButton'
import RenderDots from './components/Dots'

const windowsWidth = Dimensions.get('window').width
const windowsHeight = Dimensions.get('window').height

const defaulStyles = {
  header: {
    flex: 0.45,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#cccccc'
  },
  pic: {
    width: 150,
    height: 150
  },
  info: {
    flex: 0.8,
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 32
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  title: {
    color: '#000',
    fontSize: 18,
    paddingBottom: 16,
    textAlign: 'center'
  },
  description: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center'
  },
  controllText: {
    color: '#fff',
    fontSize: 17
  },
  dotStyle: {
    backgroundColor: 'rgba(255,255,255,.3)',
    width: 11,
    height: 11,
    borderRadius: 7,
    marginLeft: 7,
    marginRight: 7,
    marginTop: 7,
    marginBottom: 7
  },
  activeDotStyle: {
    backgroundColor: '#fff'
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  dotContainer: {
    flex: 0.6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnContainer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingBottom: 2,
    borderColor: '#fff',
    borderWidth: 2
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: 'normal'
  },
  full: {
    height: 80,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    flex: 1.4,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent'
  }
}

export default class AppIntro extends Component {
  constructor(props) {
    super(props)

    this.styles = StyleSheet.create(
      assign({}, defaulStyles, props.customStyles)
    )

    this.state = {
      skipFadeOpacity: new Animated.Value(1),
      doneFadeOpacity: new Animated.Value(1),
      nextOpacity: new Animated.Value(1),
      parallax: new Animated.Value(0),
      isScrolling: false
    }
  }

  onNextBtnClick = context => {
    if (
      this.state.isScrolling ||
      context.state.isScrolling ||
      context.state.total < 2
    ) {
      return
    }
    this.state.isScrolling = true
    const state = context.state
    const diff = (context.props.loop ? 1 : 0) + 1 + context.state.index
    let x = 0
    if (state.dir === 'x') x = diff * state.width
    if (Platform.OS === 'ios') {
      context.refs.scrollView.scrollTo({ y: 0, x })
    } else {
      context.refs.scrollView.setPage(diff)
      context.onScrollEnd({
        nativeEvent: {
          position: diff
        }
      })
    }
    this.props.onNextBtnClick(context.state.index)
  }

  setDoneBtnOpacity = value => {
    Animated.timing(this.state.doneFadeOpacity, { toValue: value }).start()
  }

  setSkipBtnOpacity = value => {
    Animated.timing(this.state.skipFadeOpacity, { toValue: value }).start()
  }

  setNextOpacity = value => {
    Animated.timing(this.state.nextOpacity, { toValue: value }).start()
  }
  getTransform = (index, offset, level) => {
    const isFirstPage = index === 0
    const statRange = isFirstPage ? 0 : windowsWidth * (index - 1)
    const endRange = isFirstPage ? windowsWidth : windowsWidth * index
    const startOpacity = isFirstPage ? 1 : 0
    const endOpacity = isFirstPage ? 1 : 1
    const leftPosition = isFirstPage ? 0 : windowsWidth / 3
    const rightPosition = isFirstPage ? -windowsWidth / 3 : 0
    const transform = [
      {
        transform: [
          {
            translateX: this.state.parallax.interpolate({
              inputRange: [statRange, endRange],
              outputRange: [
                isFirstPage ? leftPosition : leftPosition - offset * level,
                isFirstPage ? rightPosition + offset * level : rightPosition
              ]
            })
          }
        ]
      },
      {
        opacity: this.state.parallax.interpolate({
          inputRange: [statRange, endRange],
          outputRange: [startOpacity, endOpacity]
        })
      }
    ]
    return {
      transform
    }
  }

  renderPagination = (index, total, context) => {
    let isDoneBtnShow
    let isSkipBtnShow
    if (index === total - 1) {
      this.setDoneBtnOpacity(1)
      this.setSkipBtnOpacity(0)
      this.setNextOpacity(0)
      isDoneBtnShow = true
      isSkipBtnShow = false
    } else {
      this.setDoneBtnOpacity(0)
      this.setSkipBtnOpacity(1)
      this.setNextOpacity(1)
      isDoneBtnShow = false
      isSkipBtnShow = true
    }
    return (
      <View style={[this.styles.paginationContainer]}>
        <View style={{ flex: 0.02 }} />
        {this.props.showSkipButton
          ? <SkipButton
              {...this.props}
              {...this.state}
              isSkipBtnShow={isSkipBtnShow}
              styles={this.styles}
              onSkipBtnClick={() => this.props.onSkipBtnClick(index)}
            />
          : <View
              style={[this.styles.btnContainer, { borderColor: 'transparent' }]}
            />}
        <View style={{ flex: 0.04 }} />
        {this.props.showDots &&
          RenderDots(index, total, {
            ...this.props,
            styles: this.styles
          })}
        <View style={{ flex: 0.04 }} />
        {this.props.showDoneButton
          ? <DoneButton
              {...this.props}
              {...this.state}
              isDoneBtnShow={isDoneBtnShow}
              styles={this.styles}
              onNextBtnClick={this.onNextBtnClick.bind(this, context)}
              onDoneBtnClick={this.props.onDoneBtnClick}
            />
          : <View style={this.styles.btnContainer} />}
        <View style={{ flex: 0.02 }} />
      </View>
    )
  }

  renderBasicSlidePage = (
    index,
    {
      title,
      description,
      img,
      imgStyle,
      backgroundColor,
      fontColor,
      level,
      imgContainer
    }
  ) => {
    const AnimatedStyle1 = this.getTransform(index, 10, level)
    const AnimatedStyle2 = this.getTransform(index, 8, level)
    const AnimatedStyle3 = this.getTransform(index, 15, level)
    const imgSource = typeof img === 'string' ? { uri: img } : img
    const pageView = (
      <View
        style={[this.styles.slide, { backgroundColor }]}
        showsPagination={false}
        key={index}
      >
        {/*<Animated.View style={[this.styles.header, ...AnimatedStyle1.transform]}>*/}
        <View style={[this.styles.imageContainer, imgContainer]}>
          <Image style={imgStyle} source={imgSource} />
        </View>
        {/*</Animated.View>*/}
        <View style={this.styles.info}>
          <Animated.View style={AnimatedStyle2.transform}>
            <Text style={[this.styles.title, { color: fontColor }]}>
              {title}
            </Text>
          </Animated.View>
          <Animated.View style={AnimatedStyle3.transform}>
            <Text style={[this.styles.description, { color: fontColor }]}>
              {description}
            </Text>
          </Animated.View>
        </View>
      </View>
    )
    return pageView
  }

  renderChild = (children, pageIndex, index) => {
    const level = children.props.level || 0
    const { transform } = this.getTransform(pageIndex, 10, level)
    const root = children.props.children
    let nodes = children
    if (Array.isArray(root)) {
      nodes = root.map((node, i) =>
        this.renderChild(node, pageIndex, `${index}_${i}`)
      )
    }
    let animatedChild = children
    if (level !== 0) {
      animatedChild = (
        <Animated.View key={index} style={[children.props.style, transform]}>
          {nodes}
        </Animated.View>
      )
    } else {
      animatedChild = (
        <View key={index} style={children.props.style}>
          {nodes}
        </View>
      )
    }
    return animatedChild
  }

  shadeStatusBarColor(color, percent) {
    const first = parseInt(color.slice(1), 16)
    const black = first & 0x0000ff
    const green = (first >> 8) & 0x00ff
    const percentage = percent < 0 ? percent * -1 : percent
    const red = first >> 16
    const theme = percent < 0 ? 0 : 255
    const finalColor = (0x1000000 +
      (Math.round((theme - red) * percentage) + red) * 0x10000 +
      (Math.round((theme - green) * percentage) + green) * 0x100 +
      (Math.round((theme - black) * percentage) + black))
      .toString(16)
      .slice(1)

    return `#${finalColor}`
  }

  render() {
    const childrens = this.props.children
    let pages = []
    let androidPages = null

    if (Platform.OS === 'ios') {
      pages = childrens.map((children, i) => this.renderChild(children, i, i))
    } else {
      androidPages = childrens.map((children, i) => {
        const { transform } = this.getTransform(i, -windowsWidth / 3 * 2, 1)
        pages.push(<View key={i} />)
        return (
          <Animated.View
            key={i}
            style={[
              {
                position: 'absolute',
                height: windowsHeight,
                width: windowsWidth,
                top: 0
              },
              {
                ...transform[0]
              }
            ]}
          >
            {this.renderChild(children, i, i)}
          </Animated.View>
        )
      })
    }

    return (
      <View>
        {androidPages}
        <Swiper
          loop={false}
          index={this.props.defaultIndex}
          renderPagination={this.renderPagination}
          onMomentumScrollEnd={(e, state) => {
            this.props.onSlideChange(state.index, state.total)
            this.state.isScrolling = false
          }}
          onScroll={Animated.event([{ x: this.state.parallax }])}
          containerStyle={this.styles.containerStyle}
        >
          {pages}
        </Swiper>
      </View>
    )
  }
}

AppIntro.propTypes = {
  btnContainerBorderColor: PropTypes.string,
  dotColor: PropTypes.string,
  activeDotColor: PropTypes.string,
  rightTextColor: PropTypes.string,
  leftTextColor: PropTypes.string,
  onSlideChange: PropTypes.func,
  onSkipBtnClick: PropTypes.func,
  onDoneBtnClick: PropTypes.func,
  onNextBtnClick: PropTypes.func,
  pageArray: PropTypes.array,
  doneBtnLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  skipBtnLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  nextBtnLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  customStyles: PropTypes.object,
  defaultIndex: PropTypes.number,
  showSkipButton: PropTypes.bool,
  showDoneButton: PropTypes.bool,
  showDots: PropTypes.bool
}

AppIntro.defaultProps = {
  btnContainerBorderColor: 'white',
  dotColor: 'rgba(255,255,255,.3)',
  activeDotColor: '#fff',
  rightTextColor: '#fff',
  leftTextColor: '#fff',
  pageArray: [],
  onSlideChange: () => {},
  onSkipBtnClick: () => {},
  onDoneBtnClick: () => {},
  onNextBtnClick: () => {},
  doneBtnLabel: 'Done',
  skipBtnLabel: 'Skip',
  nextBtnLabel: '›',
  defaultIndex: 0,
  showSkipButton: true,
  showDoneButton: true,
  showDots: true
}
