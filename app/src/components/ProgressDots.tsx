import { StyleSheet, View } from 'react-native';

type Props = {
  current: number;
  total: number;
};

export function ProgressDots({ current, total }: Props) {
  return (
    <View style={styles.row} accessibilityLabel={`Stap ${current + 1} van ${total}`}>
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
  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0D5C0',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#19715F',
  },
  doneDot: {
    backgroundColor: '#85B79D',
  },
});
