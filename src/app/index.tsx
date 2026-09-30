// NIDHI — Entry router
// Decides whether to send the user to onboarding or straight to the app.

import { Redirect } from "expo-router";
import { useAppStore } from "@/store/appStore";

export default function Index() {
  const isOnboarded = useAppStore((s) => s.isOnboarded);
  return isOnboarded ? (
    <Redirect href="/(app)/dashboard" />
  ) : (
    <Redirect href="/onboarding/language" />
  );
}
