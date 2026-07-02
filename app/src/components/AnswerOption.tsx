import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  label: string;
  selected?: boolean;
  correct?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function AnswerOption({ label, selected = false, correct, disabled = false, onPress }: Props) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.option,
        selected ? styles.selected : null,
        correct === true ? styles.correct : null,
        correct === false ? styles.incorrect : null,
        pressed ? styles.pressed : null,
        disabled && !selected ? styles.disabled : null,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.label, selected || correct === true ? styles.strongLabel : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    minHeight: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderColor: '#E0CFB0',
    borderBottomColor: '#CDB993',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  selected: {
    borderColor: '#1E7D68',
    borderBottomColor: '#12614F',
    backgroundColor: '#E8F7EF',
  },
  correct: {
    borderColor: '#1E7D68',
    borderBottomColor: '#12614F',
    backgroundColor: '#DFF7EA',
  },
  incorrect: {
    borderColor: '#CB7F68',
    borderBottomColor: '#A95E48',
    backgroundColor: '#FCE9E1',
  },
  pressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    color: '#26342F',
    fontSize: 17,
    fontWeight: '800',
  },
  strongLabel: {
    color: '#123D35',
    fontWeight: '900',
  },
});
