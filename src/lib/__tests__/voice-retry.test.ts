// Tests for the voice retry logic — verifies error handling + retry behavior.

import { transcribeAudio, _resetKeyCache } from "@/lib/voice";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;
global.AbortController = class {
  signal = {} as AbortSignal;
  abort() {}
};

describe("voice retry logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    _resetKeyCache();
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true, size: 1000 });
    (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue("dGVzdA==");
    (Constants as any).expoConfig = {
      extra: { sarvamApiKey: "test-key" },
    };
  });

  it("returns null when no API key is configured", async () => {
    (Constants as any).expoConfig = { extra: { sarvamApiKey: "" } };
    _resetKeyCache();
    const result = await transcribeAudio("file://test.m4a");
    expect(result).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns null when audio file does not exist", async () => {
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: false });
    const result = await transcribeAudio("file://test.m4a");
    expect(result).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns null when audio file is too large", async () => {
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
      exists: true,
      size: 30 * 1024 * 1024,
    });
    const result = await transcribeAudio("file://test.m4a");
    expect(result).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns null on 4xx error", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    });
    const result = await transcribeAudio("file://test.m4a");
    expect(result).toBeNull();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("returns null on 5xx error", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 503,
      text: async () => "Service unavailable",
    });
    const result = await transcribeAudio("file://test.m4a");
    expect(result).toBeNull();
  });

  it("returns null on network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network failed"));
    const result = await transcribeAudio("file://test.m4a");
    expect(result).toBeNull();
  });

  it("returns transcript on success", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ transcript: "hello world", language_code: "en-IN" }),
    });
    const result = await transcribeAudio("file://test.m4a");
    expect(result).toEqual({ transcript: "hello world", languageCode: "en-IN" });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("returns null when response has no transcript field", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ language_code: "en-IN" }),
    });
    const result = await transcribeAudio("file://test.m4a");
    expect(result).toBeNull();
  });

  it("returns null when transcript is empty", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ transcript: "", language_code: "en-IN" }),
    });
    const result = await transcribeAudio("file://test.m4a");
    expect(result).toBeNull();
  });

  it("truncates transcript to 500 chars", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ transcript: "x".repeat(1000), language_code: "en-IN" }),
    });
    const result = await transcribeAudio("file://test.m4a");
    expect(result?.transcript.length).toBe(500);
  });

  it("never throws, always returns null on failure", async () => {
    mockFetch.mockImplementation(() => {
      throw new Error("random crash");
    });
    const result = await transcribeAudio("file://test.m4a");
    expect(result).toBeNull();
  });
});
