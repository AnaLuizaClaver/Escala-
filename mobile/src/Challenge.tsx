import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { Banner, brand, Button, Card, colors, fonts, ui } from './design';

export function Challenge({ onApprove, onBack }: { onApprove: () => void; onBack: () => void }) {
  const [evidence, setEvidence] = useState<{ label: string; photo?: string }>();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function chooseEvidence() {
    setError('');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images', 'videos'] });
      if (result.canceled) return;
      const asset = result.assets[0];
      setEvidence({
        label: asset.fileName || (asset.type === 'video' ? 'Vídeo selecionado' : 'Foto selecionada'),
        photo: asset.type === 'image' ? asset.uri : undefined,
      });
    } catch {
      setError('Não foi possível abrir a galeria. Tente novamente.');
    }
  }

  return (
    <ScrollView contentContainerStyle={screens.challenge}>
      <Button label="Voltar à trilha" icon="arrow-left" tone="outline" onPress={onBack} />
      <Text accessibilityRole="header" style={ui.heading}>Desafio da semana</Text>
      <Banner title="Grave um testemunho de 30 s" label="+120 XP · Prazo: sexta" mascot />
      <View style={screens.timeline}>
        {['Gravar', 'Enviar', 'Aprovação'].map((label, index) => {
          const active = index === (submitted ? 2 : evidence ? 1 : 0);
          return <View key={label} style={screens.milestone}>
            <Text style={[screens.number, active && screens.numberActive]}>{index + 1}</Text>
            <Text style={screens.milestoneText}>{label}</Text>
          </View>;
        })}
      </View>
      <Card>
        <Text style={ui.heading}>Como fazer</Text>
        {['Grave na horizontal, com boa luz.', 'Conte em até 30 segundos como o grupo te ajudou.', 'Anexe a foto ou o vídeo de evidência.'].map((item, index) => (
          <View key={item} style={screens.instruction}>
            <Text style={[screens.number, screens.numberActive]}>{index + 1}</Text>
            <Text style={[ui.body, { flex: 1 }]}>{item}</Text>
          </View>
        ))}
      </Card>
      {!submitted ? <>
        <View style={screens.evidence}>
          {evidence?.photo && <Image source={{ uri: evidence.photo }} style={screens.thumbnail} resizeMode="cover" />}
          <Text accessibilityLiveRegion="polite" style={ui.body}>{evidence ? evidence.label : 'Sua evidência'}</Text>
          <Button label={evidence ? 'Trocar foto ou vídeo' : 'Escolher foto ou vídeo'} icon="camera" tone="outline" onPress={() => void chooseEvidence()} />
          {!evidence && <Button label="Usar evidência de exemplo" tone="outline" onPress={() => setEvidence({ label: 'Vídeo de demonstração' })} />}
        </View>
        {!!error && <Text accessibilityRole="alert" style={ui.body}>{error}</Text>}
        <Button label="Enviar evidência" icon="send" tone="lime" disabled={!evidence} onPress={() => setSubmitted(true)} />
      </> : <Card style={screens.pending}>
        <Text accessibilityRole="header" style={ui.heading}>Aguardando aprovação</Text>
        <Text style={ui.muted}>Envio simulado. A evidência ficou neste aparelho.</Text>
        <Button label="Simular aprovação" icon="check" tone="lime" onPress={onApprove} />
      </Card>}
    </ScrollView>
  );
}

export function LevelUp({ onContinue }: { onContinue: () => void }) {
  return (
    <ScrollView style={screens.level} contentContainerStyle={screens.levelContent}>
      <View pointerEvents="none" style={screens.levelOrb} />
      <Feather name="cloud" size={46} color="#FFFFFF99" style={screens.cloud} />
      <Image source={brand.pulo} style={screens.mascot} resizeMode="contain" />
      <Text style={screens.levelEyebrow}>SUBIU DE NÍVEL!</Text>
      <Text accessibilityRole="header" style={screens.levelTitle}>Nível <Text style={screens.levelNumber}>2</Text></Text>
      <Text style={screens.levelCopy}>Você concluiu sua primeira fase da trilha de Mídia.</Text>
      <View style={screens.sticker}>
        <View style={screens.stickerIcon}><Feather name="award" size={24} color={colors.night} /></View>
        <View style={{ flex: 1 }}>
          <Text style={screens.rewardTitle}>Primeiro clique</Text>
          <Text style={screens.rewardBody}>Figurinha conquistada · +120 XP</Text>
        </View>
      </View>
      <Button label="Continuar" tone="lime" onPress={onContinue} />
    </ScrollView>
  );
}

const screens = StyleSheet.create({
  challenge: { gap: 15, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 },
  timeline: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  milestone: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  milestoneText: { color: colors.cream, fontFamily: fonts.strong, fontSize: 12 },
  number: { width: 24, height: 24, lineHeight: 22, textAlign: 'center', borderRadius: 12, borderWidth: 1, borderColor: colors.line, overflow: 'hidden', color: colors.cream, fontFamily: fonts.strong },
  numberActive: { color: colors.night, backgroundColor: colors.lime },
  instruction: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  evidence: { padding: 14, alignItems: 'stretch', gap: 10, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.action, borderRadius: 18, backgroundColor: colors.surface },
  thumbnail: { height: 140, width: '100%', borderRadius: 12 },
  pending: { borderColor: colors.warning },
  level: { backgroundColor: colors.blue },
  levelContent: { minHeight: '100%', justifyContent: 'center', gap: 14, padding: 22, overflow: 'hidden' },
  levelOrb: { position: 'absolute', width: 380, height: 380, borderRadius: 190, top: -140, right: -160, backgroundColor: colors.purple },
  cloud: { position: 'absolute', top: 80, left: 35 },
  mascot: { width: '75%', height: 205, alignSelf: 'center' },
  levelEyebrow: { textAlign: 'center', color: colors.lime, fontSize: 13, letterSpacing: 2, fontFamily: fonts.title },
  levelTitle: { textAlign: 'center', color: colors.cream, fontSize: 52, lineHeight: 60, fontFamily: fonts.title },
  levelNumber: { backgroundColor: colors.lime, color: colors.night },
  levelCopy: { color: colors.cream, textAlign: 'center', fontSize: 15, lineHeight: 22, fontFamily: fonts.strong },
  sticker: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 12, backgroundColor: colors.cream, borderWidth: 3, borderColor: colors.night, borderRadius: 18, marginVertical: 12 },
  stickerIcon: { width: 45, height: 45, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.action, borderRadius: 15, borderWidth: 2, borderColor: colors.night, transform: [{ rotate: '-7deg' }] },
  rewardTitle: { color: colors.night, fontFamily: fonts.title, fontSize: 16 },
  rewardBody: { color: colors.night, fontFamily: fonts.body, fontSize: 13, marginTop: 4 },
});
