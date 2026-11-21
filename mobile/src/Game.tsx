import { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { brand, Button, colors, fonts, ui, type IconName } from './design';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Challenge, LevelUp } from './Challenge';

const stages: { title: string; icon: IconName; tag: string }[] = [
  { title: 'Luz e enquadramento', icon: 'play', tag: 'Aula' },
  { title: 'Quiz relâmpago', icon: 'help-circle', tag: 'Quiz' },
  { title: 'Experimente na prática', icon: 'camera', tag: 'Missão' },
  { title: 'Primeiro clique', icon: 'award', tag: 'Figurinha' },
];

export function Game({ step, onAdvance }: { step: number; onAdvance: () => void }) {
  const [screen, setScreen] = useState<'map' | 'phase' | 'challenge' | 'level'>('map');
  const [answer, setAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  function finishStage() {
    setScreen('map');
    setAnswer(null);
    setShowAnswer(false);
    onAdvance();
  }

  function openStage() {
    if (step === 3) setScreen('level');
    else setScreen(step === 2 ? 'challenge' : 'phase');
  }

  return (
    <>
      <View style={styles.progressHeader}>
        <Text accessibilityLabel={step === 3 ? 'Nível 2' : 'Nível 1'} style={styles.level}>{step === 3 ? 2 : 1}</Text>
        <View style={{ flex: 1, gap: 4 }}>
          <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 3, now: step }} style={styles.track}>
            <View style={[styles.progress, { width: `${step / 3 * 100}%` }]} />
          </View>
          <Text style={ui.muted}>{step === 3 ? 120 : 0} / 120 XP</Text>
        </View>
      </View>
      <View style={styles.module}>
        <Text style={styles.moduleLabel}>Módulo 1 · Mídia</Text>
        <Text accessibilityRole="header" style={ui.heading}>Luz e enquadramento</Text>
      </View>
      <View accessibilityLabel="Mapa da trilha" style={styles.map}>
        <Feather name="cloud" size={52} color={colors.line} style={styles.mapCloud} />
        <Feather name="cloud" size={42} color={colors.line} style={styles.mapCloudEnd} />
        {[3, 2, 1, 0].map(index => {
          const stage = stages[index];
          const complete = index < step || (index === 3 && step === 3);
          const active = index === step && step < 3;
          const right = index % 2 === 0;
          return <View key={stage.title} style={[styles.nodeRow, right && styles.right]}>
            {index > 0 && <View pointerEvents="none" style={[styles.connector, right && styles.connectorRight, index <= step && styles.connectorDone]} />}
            <Pressable disabled={!active && !(index === 3 && complete)} accessibilityRole="button"
              accessibilityLabel={`${stage.tag}: ${stage.title}. ${complete ? 'Concluída' : active ? 'Disponível' : 'Bloqueada'}`}
              onPress={openStage} style={[styles.node, right && styles.nodeRight]}>
              <View style={[styles.circle, index === 3 && styles.stickerNode, active && styles.active, complete && styles.complete]}>
                <Feather name={complete ? 'check' : active ? stage.icon : 'lock'} color={complete ? colors.night : colors.cream} size={23} />
              </View>
              <View style={styles.nodeText}><Text style={styles.tag}>{stage.tag}</Text><Text style={styles.nodeTitle}>{stage.title}</Text></View>
            </Pressable>
            {active && <View style={styles.cta}><Button label={step === 2 ? 'Abrir desafio' : 'Começar'} tone="lime" onPress={openStage} /></View>}
          </View>;
        })}
        <View style={styles.guide} pointerEvents="none">
          <Image source={brand.pulo} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
        </View>
      </View>

      <Modal visible={screen === 'phase'} transparent animationType="slide" onRequestClose={() => setScreen('map')}>
        <View style={styles.scrim}>
          <ScrollView style={styles.sheet} contentContainerStyle={styles.sheetContent}>
            <View style={styles.handle} />
            <Text style={styles.tag}>{stages[step].tag} · Trilha de mídia</Text>
            <Text accessibilityRole="header" style={ui.heading}>{stages[step].title}</Text>
        {step === 0 && <>
          <Text style={ui.body}>Posicione a pessoa de frente para uma fonte de luz suave, como uma janela. Segure o celular firme e deixe um pouco de espaço acima da cabeça.</Text>
          <Button label="Concluir aula" icon="check" tone="lime" onPress={finishStage} />
        </>}
        {step === 1 && <>
          <Text style={ui.body}>Onde a luz principal deve ficar para iluminar bem o rosto?</Text>
          {['Atrás da pessoa', 'À frente da pessoa', 'Direto no fundo'].map((option, index) => (
            <Pressable key={option} onPress={() => { setAnswer(index); setShowAnswer(false); }}
              accessibilityRole="radio" accessibilityState={{ checked: answer === index }}
              style={[styles.option, answer === index && styles.optionSelected]}>
              <Feather name={answer === index ? 'check-circle' : 'circle'} size={19} color={colors.action} />
              <Text style={ui.body}>{option}</Text>
            </Pressable>
          ))}
          {showAnswer && <Text accessibilityLiveRegion="polite" style={answer === 1 ? styles.correct : ui.muted}>
            {answer === 1 ? 'Acertou! A luz de frente ajuda a iluminar o rosto.' : 'Tente de novo. Pense em onde a luz precisa bater.'}
          </Text>}
          <Button label={showAnswer && answer === 1 ? 'Ir para missão' : 'Conferir resposta'} disabled={answer === null}
            onPress={showAnswer && answer === 1 ? finishStage : () => setShowAnswer(true)} />
        </>}
            <Button label="Voltar ao mapa" tone="outline" onPress={() => setScreen('map')} />
          </ScrollView>
        </View>
      </Modal>

      <Modal visible={screen === 'challenge' || screen === 'level'} animationType="fade" onRequestClose={() => setScreen('map')}>
        <SafeAreaView style={styles.fullScreen}>
          {screen === 'challenge' && <Challenge onBack={() => setScreen('map')} onApprove={() => { onAdvance(); setScreen('level'); }} />}
          {screen === 'level' && <LevelUp onContinue={() => setScreen('map')} />}
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  progressHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 4 },
  level: { width: 42, height: 42, lineHeight: 38, borderRadius: 21, borderWidth: 2, borderColor: colors.lime, overflow: 'hidden', textAlign: 'center', fontFamily: fonts.title, backgroundColor: colors.action, color: colors.night },
  module: { borderRadius: 16, borderColor: colors.cream, borderWidth: 2, backgroundColor: colors.blue, padding: 12 },
  moduleLabel: { fontFamily: fonts.title, color: colors.lime, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1 },
  fullScreen: { flex: 1, backgroundColor: colors.canvas },
  scrim: { flex: 1, backgroundColor: '#10102099', justifyContent: 'flex-end' },
  sheet: { flexGrow: 0, maxHeight: '85%', backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 2, borderColor: colors.cream },
  sheetContent: { gap: 13, padding: 20, paddingBottom: 32, width: '100%', maxWidth: 600, alignSelf: 'center' },
  handle: { height: 4, width: 40, borderRadius: 3, backgroundColor: colors.muted, alignSelf: 'center', marginBottom: 5 },
  mapCloud: { position: 'absolute', top: 25, right: 24 },
  mapCloudEnd: { position: 'absolute', bottom: 36, left: 22 },
  guide: { position: 'absolute', bottom: 21, left: 4, width: 73, height: 63 },
  nodeRight: { flexDirection: 'row-reverse' },
  stickerNode: { borderRadius: 14, transform: [{ rotate: '-7deg' }], borderWidth: 3 },
  track: { height: 12, borderRadius: 6, backgroundColor: colors.subtle, borderColor: colors.cream, borderWidth: 1, overflow: 'hidden' },
  progress: { height: '100%', backgroundColor: colors.lime },
  map: { padding: 12, paddingBottom: 30, gap: 12, minHeight: 385, borderRadius: 24, backgroundColor: colors.canvas },
  nodeRow: { gap: 7, minHeight: 66, position: 'relative', alignItems: 'flex-start' },
  right: { alignItems: 'flex-end' },
  connector: { position: 'absolute', zIndex: 0, left: '27%', top: 65, width: '46%', borderTopWidth: 3, borderStyle: 'dashed', borderColor: colors.line, transform: [{ rotate: '-15deg' }] },
  connectorRight: { transform: [{ rotate: '15deg' }] },
  connectorDone: { borderColor: colors.lime },
  node: { flexDirection: 'row', alignItems: 'center', gap: 9, maxWidth: '76%', backgroundColor: colors.canvas },
  circle: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.line, backgroundColor: colors.subtle },
  active: { backgroundColor: colors.blue, borderColor: colors.lime, borderWidth: 3 },
  complete: { backgroundColor: colors.lime, borderColor: colors.cream },
  tag: { fontFamily: fonts.strong, color: colors.action, fontSize: 13 },
  nodeText: { gap: 2, flexShrink: 1 },
  nodeTitle: { fontFamily: fonts.strong, color: colors.cream, fontSize: 15 },
  cta: { marginLeft: 5 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 12, minHeight: 48, borderWidth: 1, borderColor: colors.line, borderRadius: 12, backgroundColor: colors.subtle },
  optionSelected: { borderColor: colors.action },
  correct: { color: colors.success, fontFamily: fonts.strong, lineHeight: 21 },
});
