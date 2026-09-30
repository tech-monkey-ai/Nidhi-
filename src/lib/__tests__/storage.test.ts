import { loadState, saveState, clearState } from "@/lib/storage";
import { createInitialState, type AppState } from "@/lib/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

describe("storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns initial state when nothing stored", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const state = await loadState();
    expect(state).toEqual(createInitialState());
    expect(state.isOnboarded).toBe(false);
    expect(state.language).toBe("en");
    expect(state.emergencyFundTarget).toBe(1000);
  });

  it("loads and parses stored state", async () => {
    const stored = { ...createInitialState(), userName: "Ramesh", isOnboarded: true };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(stored));
    const state = await loadState();
    expect(state.userName).toBe("Ramesh");
    expect(state.isOnboarded).toBe(true);
  });

  it("rescues corrupt JSON by returning initial state", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("not valid json {");
    const state = await loadState();
    expect(state).toEqual(createInitialState());
    expect(AsyncStorage.removeItem).toHaveBeenCalled();
  });

  it("saves state as JSON", async () => {
    const state = createInitialState();
    await saveState(state);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
    const [key, value] = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
    expect(key).toBe("nidhi:v1:state");
    expect(JSON.parse(value)).toMatchObject({ ...state, __schemaVersion: 1 });
  });

  it("clears state", async () => {
    await clearState();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("nidhi:v1:state");
  });

  it("migrates stored state with missing fields to defaults", async () => {
    // Simulate an old state missing newer fields
    const oldState = { isOnboarded: true, language: "hi", userName: "Old" };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(oldState));
    const state = await loadState();
    expect(state.isOnboarded).toBe(true);
    expect(state.language).toBe("hi");
    expect(state.userName).toBe("Old");
    // Missing fields defaulted
    expect(state.monthlyIncome).toBe(0);
    expect(state.emergencyFundTarget).toBe(1000);
    expect(state.spendingEntries).toEqual([]);
    expect(state.notifications.dailyLogReminder).toBe(true);
  });

  it("rejects invalid language and defaults to en", async () => {
    const bad = { ...createInitialState(), language: "invalid" };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(bad));
    const state = await loadState();
    expect(state.language).toBe("en");
  });

  it("rejects NaN monthlyIncome and defaults to 0", async () => {
    const bad = { ...createInitialState(), monthlyIncome: "not-a-number" as unknown as number };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(bad));
    const state = await loadState();
    expect(state.monthlyIncome).toBe(0);
  });

  it("rejects non-array emis and defaults to empty", async () => {
    const bad = { ...createInitialState(), emis: "not-an-array" as unknown as AppState["emis"] };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(bad));
    const state = await loadState();
    expect(state.emis).toEqual([]);
  });
});
