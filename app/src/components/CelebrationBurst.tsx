import { Animated, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef } from 'react';

const PIECES = [
  { icon: '✦', color: '#F6C96D', x: -62, y: -40, rotate: '-18deg' },
  { icon: '✧', color: '#7CC9A1', x: 58, y: -46, rotate: '16deg' },
  { icon: '•', color: '#DB8A62', x: -42, y: -78, rotate: '8deg' },
  { icon: '✦', color: '#FFE27A', x: 38, y: -82, rotate: '-12deg' },
  { icon: '•', color: '#8FB8E8', x: 0, y: -92, rotate: '0deg' },
];

type Props = {
  active: boolean;
};

export function CelebrationBurst({ active }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      progress.setValue(0);
      return;
    }

    Animated.sequence([
      Animated.timing(progress, { toValue: 1, duration: 240, useNativeDriver: true }),
      Animated.timing(progress, { toValue: 0, duration: 520, useNativeDriver: true }),
    ]).start();
  }, [active, progress]);

  const opacity = progress.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] });
  const scale = progress.interpolate({ inputRange: [0, 0.35, 1], outputRange: [0.65, 1.08, 1] });

  return (
    <View pointerEvents="none" style={styles.wrap}>
      {PIECES.map((piece, index) => {
        const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, piece.x] });
        const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, piece.y] });
        return (
          <Animated.Text
            key={`${piece.icon}-${index}`}
            style={[
              styles.piece,
              {
                color: piece.color,
                opacity,
                transform: [{ translateX }, { translateY }, { rotate: piece.rotate }, { scale }],
              },
            ]}
          >
            {piece.icon}
          </Animated.Text>
        );
      })}
      <Animated.View style={[styles.ring, { opacity, transform: [{ scale }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 66,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 4,
  },
  piece: {
    position: 'absolute',
    fontSize: 26,
    fontWeight: '900',
  },
  ring: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderColor: '#F6C96D',
    borderWidth: 3,
  },
});
