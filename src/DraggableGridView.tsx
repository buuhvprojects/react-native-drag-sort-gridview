import React from 'react'
import { ScrollView, ScrollViewProps, View, ViewStyle } from 'react-native'
import DraggableItem from './components/DraggableItem'
import styles from './styles'
import useDraggableGridViewHooks from './useDraggableGridViewHooks'

const DraggableGridView = <T,>(
  props: ScrollViewProps & {
    data: Array<T>
    listWidth?: number
    itemHeight?: number
    isEditing: boolean
    shouldVibrate?: boolean
    shouldAnimOnRelease?: boolean
    itemContainerStyle?: ViewStyle
    animMoveDuration?: number
    numColumns: number
    debounce?: number | undefined
    renderItem: ({ item, index }: { item: T; index: number }) => React.ReactElement | null
    keyExtractor: (item: T) => string
    onOrderChanged: (orderedData: Array<T>, from: number, to: number) => void
  }
) => {
  const {
    style,
    contentContainerStyle,
    data,
    isEditing,
    shouldVibrate = true,
    shouldAnimOnRelease = false,
    itemContainerStyle,
    listWidth,
    itemHeight: propsItemHeight,
    numColumns,
    animMoveDuration,
    debounce,
    keyExtractor,
    onOrderChanged
  } = props

  const {
    isLock,
    dragIndex,
    dragToIndex,
    isEnableScroll,
    itemWidth,
    itemHeight,
    sectionWidth,
    sectionHeight,
    lockTouch,
    unlockTouch,
    onStartDrag,
    updateDragToIndex,
    onEndDrag
  } = useDraggableGridViewHooks({
    data,
    listWidth,
    propsItemHeight,
    numColumns,
    debounce,
    onOrderChanged
  })

  const renderItem = ({ item, index }: { item: T; index: number }) => (
    <DraggableItem
      key={keyExtractor(item)}
      style={itemContainerStyle}
      itemWidth={itemWidth}
      itemHeight={itemHeight}
      sectionWidth={sectionWidth}
      sectionHeight={sectionHeight}
      numColumns={numColumns || 1}
      itemLength={data.length}
      dragItemOriginIndex={dragIndex}
      dragItemTargetIndex={dragToIndex}
      index={index}
      isEditing={isEditing}
      shouldVibrate={shouldVibrate}
      shouldAnimOnRelease={shouldAnimOnRelease}
      animMoveDuration={animMoveDuration || 1000}
      lockTouch={lockTouch}
      unlockTouch={unlockTouch}
      onStartDrag={onStartDrag}
      updateDragToIndex={updateDragToIndex}
      onEndDrag={onEndDrag}>
      <>{props.renderItem({ item, index })}</>
    </DraggableItem>
  )

  return (
    <>
      <ScrollView
        {...props}
        style={[styles.list, style, { width: listWidth }]}
        contentContainerStyle={[contentContainerStyle, styles.content]}
        scrollEnabled={isEnableScroll}>
        {data.map((item: T, index: number) => renderItem({ item, index }))}
      </ScrollView>
      {isLock === true && <View style={styles.uiBlock} />}
    </>
  )
}

export default DraggableGridView
