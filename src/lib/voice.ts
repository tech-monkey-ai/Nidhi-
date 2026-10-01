// NIDHI — Voice pipeline via Sarvam AI Speech-to-Text (saaras:v4).
//
// Expo SDK 57 installs its own `fetch` (expo/fetch) as the global, and its
// multipart encoder only accepts strings, Blobs, or objects exposing
// bytes() — it throws "Unsupported FormDataPart implementation" for the
// classic React Native { uri, name, type } file part. expo-file-system's
// `File` class implements Blob, so we wrap the recording in one of those
// instead. (An earlier version pasted base64 text into a hand-built
// multipart body, so Sarvam received text, not audio. Before that it called
// legacy expo-file-system methods that throw in SDK 57.)

import Constants from "expo-constants";
import { File } from "expo-file-system";

const SARVAM_ENDPOINT = "https://api.sarvam.ai/speech-to-text";
const SARVAM_MODEL = "saaras:v4";
const REQUEST_TIMEOUT_MS = 30_000;

let _cachedKey: string | null = null;

function getApiKey(): string | null {
  if (_cachedKey !== null) return _cachedKey || null;
  const fromConfig = Constants.expoConfig?.extra?.sarvamApiKey;
  _cachedKey = ((fromConfig as string) || "").trim();
  return _cachedKey || null;
}

export function _resetKeyCache(): void {
  _cachedKey = null;
}

export interface VoiceTranscriptionResult {
  transcript: string;
  languageCode?: string;
}

export async function isVoiceConfigured(): Promise<boolean> {
  return !!getApiKey();
}

export async function transcribeAudio(
  audioUri: string,
): Promise<VoiceTranscriptionResult | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("[voice] No API key configured");
    return null;
  }
  if (!audioUri) {
    console.warn("[voice] No audio URI");
    return null;
  }

  const ext = audioUri.split("?")[0].split(".").pop()?.toLowerCase() ?? "m4a";

  let file: File;
  try {
    file = new File(audioUri);
    if (!file.exists) {
      console.warn("[voice] Audio file does not exist:", audioUri);
      return null;
    }
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    console.warn("[voice] Could not open recorded file:", errMsg);
    return null;
  }

  const form = new FormData();
  form.append("model", SARVAM_MODEL);
  // Expo SDK 57's fetch only accepts a Blob-like part (one exposing
  // bytes()). expo-file-system's File implements Blob, so this takes the
  // branch the old { uri, name, type } object could never reach.
  form.append("file", file, `voice.${ext}`);

  console.log("[voice] Sending to Sarvam API:", audioUri);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    console.warn("[voice] Request timed out");
  }, REQUEST_TIMEOUT_MS);

  try {
    const resp = await fetch(SARVAM_ENDPOINT, {
      method: "POST",
      // Do NOT set Content-Type: fetch adds multipart/form-data with the boundary.
      headers: { "api-subscription-key": apiKey },
      body: form,
      signal: controller.signal as unknown as AbortSignal,
    });

    console.log("[voice] Sarvam response status:", resp.status);

    if (!resp.ok) {
      const errorText = await resp.text().catch(() => "unknown error");
      console.warn(`[voice] Sarvam API error ${resp.status}: ${errorText.slice(0, 200)}`);
      return null;
    }

    const json = await resp.json();
    const transcript = json?.transcript;
    if (!transcript || typeof transcript !== "string") {
      console.warn("[voice] No transcript in response");
      return null;
    }

    const trimmed = transcript.trim().slice(0, 500);
    if (!trimmed) {
      console.warn("[voice] Empty transcript");
      return null;
    }

    return { transcript: trimmed, languageCode: json.language_code };
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    console.warn("[voice] Fetch failed:", errMsg);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
