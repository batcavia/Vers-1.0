import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { Mascot } from '../components/Mascot';
import { PrimaryButton } from '../components/PrimaryButton';

type Props = {
  onFinish: () => void;
};

type OnboardingSlide = {
  title: string;
  body: string;
  smallText?: string;
  mascotMessage: string;
};

const SLIDES: OnboardingSlide[] = [
  {
    title: 'Welkom bij Vers',
    body: 'Belangrijke Bijbelteksten leren kennen is meer dan iets onthouden. Je bewaart woorden die je kunnen dragen, richting geven en helpen wanneer je ze nodig hebt.',
    mascotMessage: 'Welkom. We beginnen rustig.',
  },
  {
    title: 'Een woord voor het juiste moment',
    body: 'In de Bijbel wordt Gods Woord het zwaard van de Geest genoemd. Niet als iets hards of afstandelijks, maar als iets dat je helpt om staande te blijven, waarheid te herkennen en je hart te richten op God.',
    smallText: 'Gebaseerd op Efeze 6:17',
    mascotMessage: 'Woorden kunnen je dragen op het juiste moment.',
  },
  {
    title: 'Laag voor laag onthouden',
    body: 'Je begint met de hele tekst. Daarna verdwijnen er steeds meer woorden. Eerst herken je de juiste woorden, daarna vul je ze zelf in, en uiteindelijk probeer je de tekst helemaal uit je hoofd.',
    mascotMessage: 'De hulp verdwijnt stap voor stap.',
  },
  {
    title: 'Begin klein',
    body: 'Eén korte les is genoeg om te starten. Liever elke dag een paar minuten met aandacht, dan af en toe heel lang. De teksten komen later terug, zodat ze langzaam in je geheugen zakken.',
    mascotMessage: 'Klein beginnen is sterk beginnen.',
  },
];

export function OnboardingScreen({ onFinish }: Props) {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  function continueOnboarding() {
    if (isLast) {
      onFinish();
      return;
    }
    setIndex((current) => current + 1);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.progressRow}>
        {SLIDES.map((_, dotIndex) => (
          <View key={dotIndex} style={[styles.progressDot, dotIndex <= index ? styles.activeDot : null]} />
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.mascotWrap}>
          <Mascot tone="idle" message={slide.mascotMessage} compact />
        </View>

        <View style={styles.copy}>
          <Text style={styles.eyebrow}>Vers</Text>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.body}>{slide.body}</Text>
          {slide.smallText ? <Text style={styles.smallText}>{slide.smallText}</Text> : null}
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label={isLast ? 'Start mijn eerste les' : 'Verder'} onPress={continueOnboarding} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF8EC',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  progressDot: {
    width: 34,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E2D2B4',
  },
  activeDot: {
    backgroundColor: '#1E7D68',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E6D8BF',
    borderRadius: 30,
    borderWidth: 1,
    gap: 22,
    padding: 22,
    shadowColor: '#6B4D20',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  mascotWrap: {
    backgroundColor: '#F7EAD3',
    borderRadius: 24,
    padding: 14,
  },
  copy: {
    gap: 12,
  },
  eyebrow: {
    color: '#B25E2A',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: '#173F35',
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 40,
  },
  body: {
    color: '#485950',
    fontSize: 18,
    lineHeight: 29,
  },
  smallText: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF7F1',
    borderRadius: 999,
    color: '#1E7D68',
    fontSize: 13,
    fontWeight: '900',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  footer: {
    gap: 12,
  },
});
