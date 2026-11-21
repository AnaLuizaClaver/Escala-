import { useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Sora_800ExtraBold } from '@expo-google-fonts/sora/800ExtraBold';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import Feather from '@expo/vector-icons/Feather';
import { Banner, brand, Button, Card, colors, fonts, ui, type IconName } from './src/design';
import { Game } from './src/Game';

const tabs: { id: 'home' | 'game' | 'schedules' | 'profile'; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Início', icon: 'home' },
  { id: 'game', label: 'Jogar', icon: 'play-circle' },
  { id: 'schedules', label: 'Escalas', icon: 'calendar' },
  { id: 'profile', label: 'Perfil', icon: 'user' },
];

export default function App() {
  return <SafeAreaProvider><StatusBar style="light" /><Escalae /></SafeAreaProvider>;
}

function Escalae() {
  const [loaded, fontError] = useFonts({ Sora_800ExtraBold, Inter_400Regular, Inter_600SemiBold });
  const [signedIn, setSignedIn] = useState(false);
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('home');
  const [confirmed, setConfirmed] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [scheduleView, setScheduleView] = useState('Próximas');
  const [swapOpen, setSwapOpen] = useState(false);
  const [swapReason, setSwapReason] = useState('');
  const [submittedSwap, setSubmittedSwap] = useState('');

  if (!loaded && !fontError) return <SafeAreaView style={styles.loader}><ActivityIndicator color={colors.lime} size="large" /></SafeAreaView>;

  if (!signedIn) return (
    <SafeAreaView style={[styles.safe, styles.welcome]}>
      <ScrollView contentContainerStyle={styles.welcomeContent}>
        <View pointerEvents="none" style={styles.welcomeOrb} />
        <Image source={brand.logo} accessibilityLabel="Escalaê" style={styles.heroLogo} resizeMode="contain" />
        <Text accessibilityRole="header" style={styles.heroTitle}>Talentos que sobem <Text style={styles.lime}>juntos.</Text></Text>
        <Text style={styles.heroDescription}>Suas escalas e sua jornada de aprendizado em um só lugar.</Text>
        <View style={styles.welcomeActions}>
          <Button label="Entrar na demonstração" icon="arrow-right" tone="lime" onPress={() => setSignedIn(true)} />
          <Text style={styles.heroNote}>Prévia com dados fictícios. Nenhuma senha é necessária.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const showDetails = () => setDetailsOpen(true);
  const confirm = () => setConfirmed(true);
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Image source={brand.horizontal} accessibilityLabel="Escalaê" style={styles.logo} resizeMode="contain" />
          <Text style={styles.preview}>Demonstração</Text>
        </View>

        <ScrollView key={tab} style={styles.scroll} contentContainerStyle={styles.content}>
          {tab === 'home' && <>
            <Banner label="Olá, voluntário!" title="Sua jornada" mascot />
            <Text accessibilityRole="header" style={ui.heading}>Próxima escala</Text>
            <Ticket confirmed={confirmed} swapRequested={!!submittedSwap} onConfirm={confirm} onDetails={showDetails} onSwap={() => setSwapOpen(true)} />
            <Card>
              <Text accessibilityRole="header" style={ui.heading}>Trilha de mídia</Text>
              <Text style={ui.muted}>{step === 3 ? 'Você ganhou sua primeira figurinha.' : 'Aprenda a iluminar e enquadrar uma cena.'}</Text>
              <Button label={step === 3 ? 'Ver conquista' : 'Abrir trilha'} icon="play" tone="outline" onPress={() => setTab('game')} />
            </Card>
          </>}
          {tab === 'game' && <Game step={step} onAdvance={() => setStep(previous => Math.min(3, previous + 1))} />}
          {tab === 'schedules' && <>
            <Banner title="Suas escalas" label="Olá, voluntário!" mascot />
            <View accessibilityRole="tablist" style={styles.scheduleTabs}>
              {['Próximas', 'Trocas', 'Histórico'].map(label => (
                <Pressable key={label} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{ selected: scheduleView === label }}
                  onPress={() => setScheduleView(label)} style={[styles.scheduleTab, scheduleView === label && styles.activeScheduleTab]}>
                  <Text style={[styles.navLabel, scheduleView === label && styles.activeScheduleLabel]}>{label}</Text>
                </Pressable>
              ))}
            </View>
            {scheduleView === 'Próximas' ? <Ticket confirmed={confirmed} swapRequested={!!submittedSwap} onConfirm={confirm} onDetails={showDetails} onSwap={() => setSwapOpen(true)} />
              : scheduleView === 'Trocas' && submittedSwap ? <Card>
                <Text style={ui.heading}>Culto de domingo</Text>
                <Text style={ui.body}>Troca solicitada</Text>
                <Text style={ui.muted}>{submittedSwap}</Text>
              </Card> : <Card>
                <Text style={ui.heading}>{scheduleView === 'Trocas' ? 'Nenhuma troca solicitada' : 'Nenhuma escala anterior'}</Text>
                <Text style={ui.muted}>Seus registros de demonstração aparecem aqui.</Text>
              </Card>}
          </>}
          {tab === 'profile' && <>
            <Banner title="Seu perfil" label="Escalaê" />
            <Card>
              <View style={styles.profile}>
                <View style={styles.avatar}><Feather name="user" color={colors.night} size={24} /></View>
                <View style={{ flex: 1 }}><Text style={ui.heading}>Voluntário de teste</Text><Text style={ui.muted}>Mídia & Transmissão</Text></View>
              </View>
              <Text style={ui.body}>{step === 3 ? '120 XP · 1 figurinha' : '0 XP · Comece sua primeira fase'}</Text>
              <Button label="Ver minha trilha" icon="award" onPress={() => setTab('game')} />
            </Card>
            <Button label="Sair da demonstração" icon="log-out" tone="outline" onPress={() => {
              setSignedIn(false); setTab('home'); setDetailsOpen(false); setSwapOpen(false);
            }} />
          </>}
        </ScrollView>

        <View accessibilityRole="tablist" style={styles.nav}>
          {tabs.map(entry => {
            const selected = tab === entry.id;
            return <Pressable key={entry.id} accessibilityRole="tab" accessibilityLabel={entry.label} accessibilityState={{ selected }} onPress={() => setTab(entry.id)}
              style={[styles.navItem, selected && styles.navSelected]}>
              <Feather name={entry.icon} size={21} color={selected ? colors.night : colors.muted} />
              <Text style={[styles.navLabel, selected && styles.navLabelSelected]}>{entry.label}</Text>
            </Pressable>;
          })}
        </View>

        <Modal visible={detailsOpen} transparent animationType="fade" onRequestClose={() => setDetailsOpen(false)}>
          <View style={styles.backdrop}>
            <Card style={styles.sheet}>
              <Text style={styles.eyebrow}>Escala de demonstração</Text>
              <Text accessibilityRole="header" style={ui.heading}>Culto de domingo</Text>
              <Text style={ui.body}>Domingo, 24 de novembro · 19h</Text>
              <Text style={ui.muted}>Templo principal · Mídia & Transmissão · Câmera 1</Text>
              <Text accessibilityLiveRegion="polite" style={ui.body}>{submittedSwap ? 'Troca solicitada' : confirmed ? 'Presença confirmada' : 'Aguardando sua confirmação'}</Text>
              {!confirmed && !submittedSwap && <Button label="Confirmar presença" icon="check" onPress={confirm} />}
              <Button label="Fechar detalhes" tone="outline" onPress={() => setDetailsOpen(false)} />
            </Card>
          </View>
        </Modal>
        <Modal visible={swapOpen} transparent animationType="fade" onRequestClose={() => setSwapOpen(false)}>
          <View style={styles.backdrop}>
            <Card style={styles.sheet}>
              <Text accessibilityRole="header" style={ui.heading}>Solicitar troca</Text>
              <Text style={ui.muted}>Conte por que precisa trocar o Culto de domingo.</Text>
              <TextInput accessibilityLabel="Motivo da troca" multiline value={swapReason} onChangeText={setSwapReason}
                placeholder="Motivo da troca" placeholderTextColor={colors.muted} style={styles.swapInput} />
              <Button label="Enviar pedido" disabled={!swapReason.trim()} onPress={() => {
                setSubmittedSwap(swapReason.trim()); setSwapReason(''); setSwapOpen(false);
                setTab('schedules'); setScheduleView('Trocas');
              }} />
              <Button label="Cancelar" tone="outline" onPress={() => setSwapOpen(false)} />
            </Card>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

function Ticket({ confirmed, swapRequested, onConfirm, onDetails, onSwap }: { confirmed: boolean; swapRequested: boolean; onConfirm: () => void; onDetails: () => void; onSwap: () => void }) {
  return (
    <View style={styles.ticket}>
      <View style={styles.stub}>
        <Text style={styles.stubSmall}>DOM</Text>
        <Text style={styles.day}>24</Text>
        <Text style={styles.stubSmall}>NOV</Text>
        <Text style={styles.time}>19h</Text>
      </View>
      <View pointerEvents="none" style={[styles.notch, styles.topNotch]} />
      <View pointerEvents="none" style={[styles.notch, styles.bottomNotch]} />
      <View style={styles.ticketContent}>
        <View style={styles.ticketTags}>
          <Text style={styles.ministry}>Mídia</Text>
          <Text style={[styles.stamp, confirmed && !swapRequested && styles.stampConfirmed]}>{swapRequested ? 'Troca pedida' : confirmed ? 'Confirmado' : 'Aguardando'}</Text>
        </View>
        <Text accessibilityRole="header" style={ui.heading}>Culto de domingo</Text>
        <Text style={ui.muted}>Templo principal · Câmera 1</Text>
        <View style={styles.ticketActions}>
          {!confirmed && !swapRequested && <Button label="Confirmar" onPress={onConfirm} />}
          {!swapRequested && <Button label="Trocar" tone="outline" onPress={onSwap} />}
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Ver detalhes" style={styles.detailsLink} onPress={onDetails}>
          <Text style={styles.activeScheduleLabel}>Ver detalhes</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.canvas },
  shell: { width: '100%', maxWidth: 720, alignSelf: 'center', flex: 1 },
  header: { minHeight: 56, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { width: 134, height: 44 },
  preview: { color: colors.muted, fontFamily: fonts.strong, fontSize: 12 },
  scroll: { flex: 1 },
  content: { gap: 16, paddingHorizontal: 16, paddingBottom: 20 },
  nav: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.cream, borderRadius: 20, marginHorizontal: 14, marginBottom: 8, padding: 5, gap: 4, flexDirection: 'row' },
  navItem: { flex: 1, minHeight: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', gap: 3 },
  navSelected: { backgroundColor: colors.action },
  navLabel: { color: colors.muted, fontFamily: fonts.strong, fontSize: 11 },
  navLabelSelected: { color: colors.night },
  welcome: { backgroundColor: colors.blue },
  welcomeContent: { flexGrow: 1, width: '100%', maxWidth: 540, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14, overflow: 'hidden' },
  welcomeOrb: { position: 'absolute', width: 350, height: 350, borderRadius: 175, backgroundColor: colors.purple, top: -150, right: -140 },
  heroLogo: { width: '92%', maxWidth: 360, height: 230 },
  heroTitle: { color: colors.cream, fontFamily: fonts.title, fontSize: 32, lineHeight: 40, textAlign: 'center' },
  lime: { color: colors.lime },
  heroDescription: { color: colors.cream, textAlign: 'center', fontFamily: fonts.body, fontSize: 15, lineHeight: 23 },
  welcomeActions: { width: '100%', marginTop: 18, gap: 12 },
  heroNote: { color: colors.cream, textAlign: 'center', fontFamily: fonts.strong, fontSize: 12 },
  ticket: { position: 'relative', flexDirection: 'row', overflow: 'hidden', borderWidth: 2, borderColor: colors.cream, borderRadius: 18, backgroundColor: colors.surface, boxShadow: '3px 4px 0 #A74CFF' },
  stub: { width: 72, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blue, borderRightWidth: 2, borderStyle: 'dashed', borderColor: colors.cream, paddingVertical: 12 },
  stubSmall: { fontFamily: fonts.title, fontSize: 11, color: colors.cream, letterSpacing: 1 },
  day: { fontFamily: fonts.title, fontSize: 32, color: colors.cream },
  time: { fontFamily: fonts.strong, color: colors.night, backgroundColor: colors.cream, borderRadius: 12, paddingHorizontal: 7, paddingVertical: 3, marginTop: 6 },
  notch: { position: 'absolute', zIndex: 1, left: 64, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: colors.cream, backgroundColor: colors.canvas },
  topNotch: { top: -8 },
  bottomNotch: { bottom: -8 },
  scheduleTabs: { flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.line },
  scheduleTab: { flex: 1, minHeight: 46, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 3, borderColor: 'transparent' },
  activeScheduleTab: { borderColor: colors.action },
  activeScheduleLabel: { color: colors.action, fontFamily: fonts.strong, fontSize: 13 },
  ticketActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  detailsLink: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  swapInput: { borderRadius: 12, borderWidth: 1, borderColor: colors.action, color: colors.cream, padding: 10, minHeight: 82, textAlignVertical: 'top' },
  ticketContent: { flex: 1, minWidth: 0, padding: 12, gap: 9 },
  ticketTags: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  ministry: { fontFamily: fonts.strong, color: colors.cream, backgroundColor: colors.blue, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4, fontSize: 12 },
  stamp: { color: colors.warning, borderColor: colors.warning, borderWidth: 1, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2, fontFamily: fonts.title, fontSize: 9, letterSpacing: .6, textTransform: 'uppercase', transform: [{ rotate: '4deg' }] },
  stampConfirmed: { color: colors.success, borderColor: colors.success },
  backdrop: { flex: 1, backgroundColor: '#101020C9', padding: 18, justifyContent: 'center' },
  sheet: { width: '100%', maxWidth: 490, alignSelf: 'center', borderColor: colors.cream },
  eyebrow: { color: colors.action, fontFamily: fonts.strong, fontSize: 12 },
  profile: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.lime },
});
