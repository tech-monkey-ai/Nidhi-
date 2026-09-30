// Jest setup — mock native modules so unit tests can run in pure Node.

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

// Mock expo modules used at runtime
jest.mock("expo-font", () => ({
  loadAsync: jest.fn().mockResolvedValue(undefined),
  isLoaded: jest.fn().mockReturnValue(true),
}));

jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn().mockResolvedValue(undefined),
  hideAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: "Light", Medium: "Medium", Heavy: "Heavy" },
  NotificationFeedbackType: { Success: "Success", Warning: "Warning", Error: "Error" },
}));

jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  setNotificationChannelAsync: jest.fn().mockResolvedValue(undefined),
  cancelScheduledNotificationAsync: jest.fn().mockResolvedValue(undefined),
  cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue(undefined),
  scheduleNotificationAsync: jest.fn().mockResolvedValue("notif-id"),
  AndroidImportance: { DEFAULT: "default", HIGH: "high", LOW: "low", MAX: "max", MIN: "min" },
  DailyTriggerInput: {},
  WeeklyTriggerInput: {},
  DateTriggerInput: {},
  TimeIntervalTriggerInput: {},
  SchedulableTriggerInputTypes: {},
}));

jest.mock("expo-audio", () => ({
  useAudioRecorder: jest.fn().mockReturnValue({
    isPrepared: false,
    uri: "file://test.m4a",
    record: jest.fn(),
    stop: jest.fn().mockResolvedValue(undefined),
    prepareToRecordAsync: jest.fn().mockResolvedValue(undefined),
  }),
  RecordingPresets: { HIGH_QUALITY: {} },
  setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
  getRecordingPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  requestRecordingPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
}));

jest.mock("react-native-google-mobile-ads", () => ({
  MobileAds: jest.fn().mockReturnValue({
    initialize: jest.fn().mockResolvedValue([]),
    setRequestConfiguration: jest.fn().mockResolvedValue(undefined),
  }),
  BannerAd: jest.fn().mockImplementation(() => null),
  BannerAdSize: {
    ANCHORED_ADAPTIVE_BANNER: "ANCHORED_ADAPTIVE_BANNER",
    FULL_BANNER: "FULL_BANNER",
    BANNER: "BANNER",
  },
  InterstitialAd: {
    createForAdRequest: jest.fn().mockReturnValue({
      addAdEventListener: jest.fn(),
      load: jest.fn(),
      show: jest.fn(),
    }),
  },
  AdEventType: {
    LOADED: "loaded",
    ERROR: "error",
    CLOSED: "closed",
    OPENED: "opened",
  },
  TestIds: {
    BANNER: "ca-app-pub-3940256099942544/9214589741",
    INTERSTITIAL: "ca-app-pub-3940256099942544/1033173712",
  },
}));

jest.mock("react-native-purchases", () => ({
  default: {
    configure: jest.fn(),
    setLogLevel: jest.fn(),
    shutdown: jest.fn().mockResolvedValue(undefined),
    adTracker: {
      trackAdDisplayed: jest.fn().mockResolvedValue(undefined),
      trackAdRevenue: jest.fn().mockResolvedValue(undefined),
      trackAdLoaded: jest.fn().mockResolvedValue(undefined),
      trackAdOpened: jest.fn().mockResolvedValue(undefined),
      trackAdFailedToLoad: jest.fn().mockResolvedValue(undefined),
    },
  },
  LOG_LEVEL: { DEBUG: 0, VERBOSE: 1, INFO: 2, WARN: 3, ERROR: 4 },
}));

jest.mock("expo-file-system", () => ({
  getInfoAsync: jest.fn().mockResolvedValue({ exists: true, size: 1000 }),
  readAsStringAsync: jest.fn().mockResolvedValue("base64-data"),
  EncodingType: { Base64: "base64" },
}));

jest.mock("expo-constants", () => ({
  expoConfig: {
    version: "1.0.0",
    extra: { sarvamApiKey: "", revenueCatAndroidApiKey: "" },
  },
  default: {
    expoConfig: {
      version: "1.0.0",
      extra: { sarvamApiKey: "", revenueCatAndroidApiKey: "" },
    },
  },
}));

// Silence console.warn / console.error during tests for clean output
const originalWarn = console.warn;
const originalError = console.error;
beforeAll(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});
afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
