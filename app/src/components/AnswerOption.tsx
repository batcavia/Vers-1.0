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
    minHeight: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D8CBB3',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selected: {
    borderColor: '#19715F',
    backgroundColor: '#E8F3EE',
  },
  correct: {
    borderColor: '#19715F',
    backgroundColor: '#DFF2E9',
  },
  incorrect: {
    borderColor: '#C97965',
    backgroundColor: '#FBE8E1',
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    color: '#26342F',
    fontSize: 17,
    fontWeight: '700',
  },
  strongLabel: {
    color: '#123D35',
    fontWeight: '900',
  },
});
