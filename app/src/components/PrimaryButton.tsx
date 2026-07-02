import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  label: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  onPress: () => void;
};

export function PrimaryButton({ label, disabled = false, variant = 'primary', onPress }: Props) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' ? styles.secondary : styles.primary,
        disabled ? styles.disabled : null,
        pressed ? styles.pressed : null,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.label, variant === 'secondary' ? styles.secondaryLabel : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 18,
    minHeight: 60,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primary: {
    backgroundColor: '#1E7D68',
    borderBottomColor: '#12614F',
    borderBottomWidth: 5,
    shadowColor: '#1E7D68',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0D0B2',
    borderWidth: 1,
    borderBottomColor: '#D0BE9B',
    borderBottomWidth: 4,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  secondaryLabel: {
    color: '#184339',
  },
});
