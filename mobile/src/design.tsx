import { Image, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps, ReactNode } from 'react';

export const colors = {
  canvas: '#101020', surface: '#1C1B32', subtle: '#282640', blue: '#2732FF',
  purple: '#A74CFF', action: '#B873FF', lime: '#C6FF4D', cream: '#FFF9F0',
  night: '#171326', muted: '#C1BED2', line: '#44415F', success: '#5BD99B', warning: '#FFB84D',
};

export const fonts = { title: 'Sora_800ExtraBold', body: 'Inter_400Regular', strong: 'Inter_600SemiBold' };
export const brand = {
  logo: require('../assets/escalae-primary.png'),
  horizontal: require('../assets/escalae-horizontal.png'),
  pulo: require('../assets/pulo.png'),
};

export type IconName = ComponentProps<typeof Feather>['name'];

export function Button({ label, onPress, icon, tone = 'primary', disabled }: {
  label: string; onPress: () => void; icon?: IconName; tone?: 'primary' | 'lime' | 'outline'; disabled?: boolean;
}) {
  const foreground = tone === 'outline' ? colors.cream : colors.night;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
      style={({ pressed }) => [ui.button, {
        backgroundColor: tone === 'lime' ? colors.lime : tone === 'primary' ? colors.action : 'transparent',
        opacity: disabled ? .45 : pressed ? .75 : 1,
      }]}>
      {icon && <Feather name={icon} size={17} color={foreground} />}
      <Text style={[ui.buttonText, { color: foreground }]}>{label}</Text>
    </Pressable>
  );
}

export function Banner({ title, label, mascot = false }: { title: string; label?: string; mascot?: boolean }) {
  return (
    <View style={ui.banner}>
      <View pointerEvents="none" style={ui.orb} />
      <View style={ui.bannerCopy}>
        {!!label && <Text style={ui.bannerLabel}>{label}</Text>}
        <Text accessibilityRole="header" style={ui.title}>{title}</Text>
      </View>
      {mascot && <Image source={brand.pulo} style={ui.bannerMascot} resizeMode="contain" />}
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[ui.card, style]}>{children}</View>;
}

export const ui = StyleSheet.create({
  button: { minHeight: 48, borderRadius: 24, paddingHorizontal: 16, borderWidth: 1, borderColor: colors.cream, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonText: { fontFamily: fonts.strong, fontSize: 14, textAlign: 'center' },
  banner: { overflow: 'hidden', borderRadius: 24, borderWidth: 2, borderColor: colors.night, backgroundColor: colors.blue, padding: 18, minHeight: 122, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  orb: { position: 'absolute', right: -72, top: -114, width: 238, height: 238, borderRadius: 119, backgroundColor: colors.purple },
  bannerCopy: { flex: 1, gap: 4 },
  bannerLabel: { color: colors.cream, fontFamily: fonts.strong, fontSize: 13 },
  bannerMascot: { width: 85, height: 85, marginLeft: 4 },
  title: { fontFamily: fonts.title, fontSize: 28, lineHeight: 35, color: colors.cream },
  heading: { fontFamily: fonts.title, fontSize: 19, lineHeight: 25, color: colors.cream },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.cream },
  muted: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21, color: colors.muted },
  card: { gap: 12, padding: 16, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
});
