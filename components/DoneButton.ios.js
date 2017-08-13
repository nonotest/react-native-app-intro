import React from 'react'
import { Text, View, TouchableOpacity, Animated } from 'react-native'

export const DoneButton = ({
  styles,
  onDoneBtnClick,
  onNextBtnClick,
  rightTextColor,
  isDoneBtnShow,
  doneBtnLabel,
  nextBtnLabel,
  doneFadeOpacity,
  skipFadeOpacity,
  nextOpacity,
  btnContainerBorderColor
}) => {
  return (
    <View
      style={[
        styles.btnContainer,
        isDoneBtnShow
          ? { backgroundColor: '#fff' }
          : { backgroundColor: 'transparent' },
        { borderColor: btnContainerBorderColor }
      ]}
    >
      <Animated.View
        style={[
          styles.full,
          { height: 0 },
          {
            opacity: doneFadeOpacity,
            transform: [
              {
                translateX: skipFadeOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 20]
                })
              }
            ]
          }
        ]}
      >
        <View style={styles.full}>
          <Text style={[styles.controllText, { color: '#4467ff' }]}>
            {doneBtnLabel}
          </Text>
        </View>
      </Animated.View>
      <Animated.View
        style={[styles.full, { height: 0 }, { opacity: nextOpacity }]}
      >
        <TouchableOpacity
          style={styles.full}
          onPress={isDoneBtnShow ? onDoneBtnClick : onNextBtnClick}
        >
          <Text style={[styles.nextButtonText, { color: rightTextColor }]}>
            {nextBtnLabel}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export default DoneButton
