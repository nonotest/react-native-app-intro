import React from 'react'
import { Text, View, TouchableOpacity, Animated } from 'react-native'

export const SkipButton = ({
  styles,
  onSkipBtnClick,
  isSkipBtnShow,
  leftTextColor,
  skipBtnLabel,
  skipFadeOpacity,
  btnContainerBorderColor
}) => {
  return (
    <View
      style={[
        [styles.btnContainer, { borderColor: btnContainerBorderColor }],
        { paddingBottom: 5, opacity: isSkipBtnShow ? 1 : 0 }
      ]}
    >
      <TouchableOpacity
        style={styles.full}
        onPress={isSkipBtnShow ? () => onSkipBtnClick() : null}
      >
        <Text style={[styles.controllText, { color: leftTextColor }]}>
          {skipBtnLabel}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default SkipButton
