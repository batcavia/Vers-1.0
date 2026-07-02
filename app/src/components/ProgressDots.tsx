import { StyleSheet, View } from 'react-native';

type Props = {
  current: number;
  total: number;
};

export function ProgressDots({ current, total }: Props) {
  return (
    <View style={styles.track} accessibilityLabel={`Stap ${current + 1} van ${total}`}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index < current ? styles.doneDot : null,
            index === current ? styles.activeDot : null,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F4E9D5',
    borderRadius: 999,
  },
  dot: {
    flex: 1,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#DDCDB0',
  },
  activeDot: {
    flex: 1.6,
    backgroundColor: '#1E7D68',
  },
  doneDot: {
    backgroundColor: '#8BC6A5',
  },
});
