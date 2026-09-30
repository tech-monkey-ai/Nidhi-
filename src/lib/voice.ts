// NIDHI — Voice pipeline via Sarvam AI Speech-to-Text (saaras:v4).
// Final version: uses base64 multipart upload (most reliable on Android).

import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";

const SARVAM_ENDPOINT = "https://api.sarvam.ai/speech-to-text";
const SARVAM_MODEL = "saaras:v4";
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_AUDIO_BYTES = 25 * 1024 * 1024;

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

  // Verify file exists
  let fileInfo;
  try {
    fileInfo = await FileSystem.getInfoAsync(audioUri);
  } catch (e) {
    console.warn("[voice] getInfoAsync failed:", e);
    return null;
  }
  if (!fileInfo.exists) {
    console.warn("[voice] Audio file does not exist:", audioUri);
    return null;
  }
  if (fileInfo.size && fileInfo.size > MAX_AUDIO_BYTES) {
    console.warn("[voice] Audio file too large:", fileInfo.size);
    return null;
  }

  console.log("[voice] Audio file:", audioUri, "Size:", fileInfo.size);

  // Read file as base64
  let base64Audio: string;
  try {
    base64Audio = await FileSystem.readAsStringAsync(audioUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } catch (e) {
    console.warn("[voice] Failed to read audio file:", e);
    return null;
  }

  console.log("[voice] Base64 length:", base64Audio.length);

  // Build multipart body manually — most reliable on Android
  const ext = audioUri.split("?")[0].split(".").pop()?.toLowerCase() ?? "m4a";
  const mimeType =
    ext === "wav" ? "audio/wav"
    : ext === "mp3" ? "audio/mpeg"
    : ext === "ogg" ? "audio/ogg"
    : "audio/m4a";

  const boundary = "----NidhiBoundary" + Date.now();
  const body =
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="model"\r\n\r\n${SARVAM_MODEL}\r\n` +
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="voice.${ext}"\r\n` +
    `Content-Type: ${mimeType}\r\n\r\n${base64Audio}\r\n` +
    `--${boundary}--\r\n`;

  console.log("[voice] Sending to Sarvam API...");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    console.warn("[voice] Request timed out");
  }, REQUEST_TIMEOUT_MS);

  try {
    const resp = await fetch(SARVAM_ENDPOINT, {
      method: "POST",
      headers: {
        "api-subscription-key": apiKey,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body,
      signal: controller.signal as unknown as AbortSignal,
    });

    console.log("[voice] Sarvam response status:", resp.status);

    if (!resp.ok) {
      const errorText = await resp.text().catch(() => "unknown error");
      console.warn(`[voice] Sarvam API error ${resp.status}: ${errorText.slice(0, 200)}`);
      return null;
    }

    const json = await resp.json();
    console.log("[voice] Sarvam response:", JSON.stringify(json).slice(0, 200));

    const transcript = json.transcript;
    if (!transcript || typeof transcript !== "string") {
      console.warn("[voice] No transcript in response");
      return null;
    }

    const trimmed = transcript.trim().slice(0, 500);
    if (!trimmed) {
      console.warn("[voice] Empty transcript");
      return null;
    }

    console.log("[voice] Transcript:", trimmed.slice(0, 50));
    return { transcript: trimmed, languageCode: json.language_code };
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    console.warn("[voice] Fetch failed:", errMsg);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
