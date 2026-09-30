// NIDHI — Onboarding: Welcome carousel (mobile-first, full-screen slides)

import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Wallet, PiggyBank, Eye, ChevronRight } from "lucide-react-native";
import Animated, {
  FadeIn,
  SlideInRight,
  FadeOut,
  SlideOutLeft,
} from "react-native-reanimated";
import { useTheme } from "@/components/useTheme";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { H1, Body, Caption } from "@/components/ui/Text";
import { BackButton } from "@/components/ui/BackButton";
import { MOTION } from "@/lib/theme";
import * as haptics from "@/lib/haptics";

const SLIDES = [
  {
    icon: Wallet,
    titleKey: "welcome.title1",
    bodyKey: "welcome.body1",
  },
  {
    icon: PiggyBank,
    titleKey: "welcome.title2",
    bodyKey: "welcome.body2",
  },
  {
    icon: Eye,
    titleKey: "welcome.title3",
    bodyKey: "welcome.body3",
  },
] as const;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const Icon = slide.icon;
  const isLast = index === SLIDES.length - 1;

  const next = () => {
    void haptics.tap();
    if (isLast) {
      router.push("/onboarding/name");
    } else {
      setIndex((i) => Math.min(SLIDES.length - 1, i + 1));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top bar with back + skip */}
      <View style={styles.topBar}>
        <BackButton fallbackHref="/onboarding/language" label={t("common.back")} />
        <TouchableOpacity
          onPress={() => {
            void haptics.tap();
            router.push("/onboarding/name");
          }}
          accessibilityRole="button"
          hitSlop={12}
        >
          <Caption tone="muted" weight="600" style={styles.skip}>{t("common.skip")}</Caption>
        </TouchableOpacity>
      </View>

      {/* Full-screen hero */}
      <View style={styles.heroWrap}>
        <Animated.View
          key={`hero-${index}`}
          entering={SlideInRight.springify().damping(24).stiffness(220)}
          exiting={SlideOutLeft.duration(MOTION.duration.fast)}
          style={[styles.hero, { backgroundColor: colors.primary }]}
        >
          <View style={styles.iconWrap}>
            <Icon size={72} color="#FFFFFF" />
          </View>
        </Animated.View>
      </View>

      {/* Text */}
      <Animated.View
        key={`text-${index}`}
        entering={FadeIn.delay(120).duration(MOTION.duration.base)}
        exiting={FadeOut.duration(MOTION.duration.fast)}
        style={styles.body}
      >
        <H1 weight="700" align="center">{t(slide.titleKey)}</H1>
        <Body tone="muted" align="center" style={{ marginTop: 10 }}>{t(slide.bodyKey)}</Body>
      </Animated.View>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === index ? colors.primary : colors.divider,
                width: i === index ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          label={isLast ? t("common.getStarted") : t("common.next")}
          onPress={next}
          iconRight={<ChevronRight size={20} color="#FFFFFF" />}
          testID="welcome-next"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  skip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  heroWrap: {
    flex: 1,
    justifyContent: "center",
  },
  hero: {
    height: SCREEN_WIDTH * 0.55,
    marginHorizontal: 24,
    marginVertical: 12,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 4,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
});
