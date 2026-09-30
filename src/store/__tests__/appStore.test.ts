import { useAppStore, DEFAULT_NOTIFICATIONS } from "@/store/appStore";
import { createInitialState } from "@/lib/types";

describe("appStore", () => {
  beforeEach(() => {
    // Reset store to initial state between tests
    useAppStore.setState({ ...createInitialState(), _hydrated: true });
  });

  it("starts with initial state", () => {
    const state = useAppStore.getState();
    expect(state.isOnboarded).toBe(false);
    expect(state.language).toBe("en");
    expect(state.emergencyFundTarget).toBe(1000);
    expect(state.notifications).toEqual(DEFAULT_NOTIFICATIONS);
  });

  describe("setLanguage", () => {
    it("sets the language", () => {
      useAppStore.getState().setLanguage("hi");
      expect(useAppStore.getState().language).toBe("hi");
    });
  });

  describe("setOnboarded", () => {
    it("sets the onboarded flag", () => {
      useAppStore.getState().setOnboarded(true);
      expect(useAppStore.getState().isOnboarded).toBe(true);
    });
  });

  describe("setUserName", () => {
    it("sets and trims the user name", () => {
      useAppStore.getState().setUserName("  Ramesh  ");
      expect(useAppStore.getState().userName).toBe("Ramesh");
    });
  });

  describe("setFinancialPicture", () => {
    it("patches income + savings goal + emergency target", () => {
      useAppStore.getState().setFinancialPicture({
        monthlyIncome: 25000,
        savingsGoal: 5000,
        emergencyFundTarget: 2000,
      });
      const s = useAppStore.getState();
      expect(s.monthlyIncome).toBe(25000);
      expect(s.savingsGoal).toBe(5000);
      expect(s.emergencyFundTarget).toBe(2000);
    });
  });

  describe("addEmi", () => {
    it("adds an EMI with auto-generated id and default isActive=true", () => {
      useAppStore.getState().addEmi({
        amount: 5000,
        totalAmount: 60000,
        durationMonths: 12,
        elapsedMonths: 0,
        description: "Bike loan",
        startDate: new Date().toISOString(),
      });
      const emis = useAppStore.getState().emis;
      expect(emis).toHaveLength(1);
      expect(emis[0].id).toMatch(/^emi_/);
      expect(emis[0].amount).toBe(5000);
      expect(emis[0].isActive).toBe(true);
    });

    it("honours isActive=false when passed in", () => {
      useAppStore.getState().addEmi({
        amount: 5000,
        totalAmount: 60000,
        durationMonths: 12,
        elapsedMonths: 0,
        description: "Paid off loan",
        startDate: new Date().toISOString(),
        isActive: false,
      });
      expect(useAppStore.getState().emis[0].isActive).toBe(false);
    });
  });

  describe("removeEmi", () => {
    it("removes the EMI by id", () => {
      useAppStore.getState().addEmi({
        amount: 1000,
        totalAmount: 12000,
        durationMonths: 12,
        elapsedMonths: 0,
        description: "Phone EMI",
        startDate: new Date().toISOString(),
      });
      const id = useAppStore.getState().emis[0].id;
      useAppStore.getState().removeEmi(id);
      expect(useAppStore.getState().emis).toHaveLength(0);
    });
  });

  describe("incrementEmiMonth", () => {
    it("bumps elapsedMonths", () => {
      useAppStore.getState().addEmi({
        amount: 1000,
        totalAmount: 12000,
        durationMonths: 12,
        elapsedMonths: 5,
        description: "Phone EMI",
        startDate: new Date().toISOString(),
      });
      const id = useAppStore.getState().emis[0].id;
      useAppStore.getState().incrementEmiMonth(id);
      expect(useAppStore.getState().emis[0].elapsedMonths).toBe(6);
      expect(useAppStore.getState().emis[0].isActive).toBe(true);
    });

    it("marks EMI as inactive when fully paid", () => {
      useAppStore.getState().addEmi({
        amount: 1000,
        totalAmount: 12000,
        durationMonths: 12,
        elapsedMonths: 11,
        description: "Phone EMI",
        startDate: new Date().toISOString(),
      });
      const id = useAppStore.getState().emis[0].id;
      useAppStore.getState().incrementEmiMonth(id);
      const emi = useAppStore.getState().emis[0];
      expect(emi.elapsedMonths).toBe(12);
      expect(emi.isActive).toBe(false);
    });
  });

  describe("addSpending", () => {
    it("adds a spending entry with generated id at the top of the list", () => {
      const newEntry = useAppStore.getState().addSpending({
        date: new Date().toISOString(),
        category: "food",
        amount: 250,
      });
      expect(newEntry.id).toMatch(/^sp_/);
      const entries = useAppStore.getState().spendingEntries;
      expect(entries).toHaveLength(1);
      expect(entries[0].id).toBe(newEntry.id);
      expect(entries[0].category).toBe("food");
      expect(useAppStore.getState().lastLoggedDate).toBeTruthy();
    });

    it("prepends new entries (most recent first)", () => {
      useAppStore.getState().addSpending({ date: new Date().toISOString(), category: "food", amount: 100 });
      useAppStore.getState().addSpending({ date: new Date().toISOString(), category: "transport", amount: 50 });
      const entries = useAppStore.getState().spendingEntries;
      expect(entries).toHaveLength(2);
      expect(entries[0].category).toBe("transport");
    });
  });

  describe("updateSpending", () => {
    it("updates a spending entry by id and stamps updatedAt", () => {
      const e = useAppStore.getState().addSpending({
        date: new Date().toISOString(),
        category: "food",
        amount: 100,
      });
      useAppStore.getState().updateSpending(e.id, { amount: 200 });
      const updated = useAppStore.getState().spendingEntries[0];
      expect(updated.amount).toBe(200);
      expect(updated.updatedAt).toBeTruthy();
    });
  });

  describe("deleteSpending", () => {
    it("removes a spending entry by id", () => {
      const e = useAppStore.getState().addSpending({
        date: new Date().toISOString(),
        category: "food",
        amount: 100,
      });
      useAppStore.getState().deleteSpending(e.id);
      expect(useAppStore.getState().spendingEntries).toHaveLength(0);
    });
  });

  describe("addSavings", () => {
    it("adds a savings entry with generated id", () => {
      useAppStore.getState().addSavings({
        date: new Date().toISOString(),
        amount: 500,
        type: "locked",
      });
      const s = useAppStore.getState().savingsEntries;
      expect(s).toHaveLength(1);
      expect(s[0].id).toMatch(/^sv_/);
      expect(s[0].type).toBe("locked");
    });
  });

  describe("recordEmergencyAccess", () => {
    it("records an emergency fund access", () => {
      useAppStore.getState().recordEmergencyAccess({
        date: new Date().toISOString(),
        amount: 1000,
        reason: "Medical emergency",
      });
      const records = useAppStore.getState().emergencyAccessRecords;
      expect(records).toHaveLength(1);
      expect(records[0].id).toMatch(/^ea_/);
      expect(records[0].reason).toBe("Medical emergency");
    });
  });

  describe("setNotifications", () => {
    it("patches notification settings without losing others", () => {
      useAppStore.getState().setNotifications({ dailyLogReminder: false });
      const n = useAppStore.getState().notifications;
      expect(n.dailyLogReminder).toBe(false);
      expect(n.largeExpenseAlert).toBe(true); // unchanged
      expect(n.emiDueReminder).toBe(true);
    });
  });

  describe("setTrustedContact", () => {
    it("sets a trusted contact", () => {
      useAppStore.getState().setTrustedContact({ name: "Sister", phone: "9876543210" });
      expect(useAppStore.getState().trustedContact).toEqual({ name: "Sister", phone: "9876543210" });
    });

    it("clears trusted contact when passed null", () => {
      useAppStore.getState().setTrustedContact({ name: "X", phone: "123" });
      useAppStore.getState().setTrustedContact(null);
      expect(useAppStore.getState().trustedContact).toBeNull();
    });
  });

  describe("setVoiceEnabled", () => {
    it("toggles voice enabled", () => {
      useAppStore.getState().setVoiceEnabled(false);
      expect(useAppStore.getState().voiceEnabled).toBe(false);
      useAppStore.getState().setVoiceEnabled(true);
      expect(useAppStore.getState().voiceEnabled).toBe(true);
    });
  });

  describe("resetAll", () => {
    it("resets store to initial state", async () => {
      useAppStore.getState().setUserName("Temp");
      useAppStore.getState().setOnboarded(true);
      await useAppStore.getState().resetAll();
      const s = useAppStore.getState();
      expect(s.userName).toBe("");
      expect(s.isOnboarded).toBe(false);
      expect(s.spendingEntries).toEqual([]);
    });
  });
});
