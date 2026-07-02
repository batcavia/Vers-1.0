import { StyleSheet, Text, View } from 'react-native';

import { Mascot } from './Mascot';

type Props = {
  title: string;
  translation: string;
  reference: string;
};

export function HomeHero({ title, translation, reference }: Props) {
  return (
    <View style={styles.hero}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>Vandaag leren</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{translation} · start met {reference}</Text>
      </View>
      <Mascot tone="idle" message="We laten de tekst rustig verdwijnen." compact />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#1E7D68',
    borderBottomColor: '#12614F',
    borderBottomWidth: 6,
    borderRadius: 26,
    gap: 16,
    padding: 20,
  },
  copy: {
    gap: 6,
  },
  eyebrow: {
    color: '#FFE7A8',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 39,
  },
  subtitle: {
    color: '#DFF7EE',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
  },
});
