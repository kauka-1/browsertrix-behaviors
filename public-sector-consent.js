class KelaVisitorStatsConsent {
  static id = "kela-visitor-stats-consent";

  static isMatch() {
    return /(^|\.)kela\.fi$/.test(window.location.hostname);
  }

  static init() {
    return {};
  }

  async* run(ctx) {
    const { Lib } = ctx;

    yield { msg: "Kela consent behavior started" };

    await Lib.sleep(3000);

    const banner =
      document.querySelector(".kds-cookie-banner") ||
      document.querySelector('[aria-label="Kävijätilastot"]');

    if (!banner) {
      yield { msg: "Kela banner not found" };
      return;
    }

    const rejectButton =
      banner.querySelector('button[aria-label="En hyväksy kävijätilastojen keräämistä"]') ||
      Array.from(banner.querySelectorAll("button")).find(btn =>
        (btn.textContent || "").trim() === "En hyväksy"
      );

    if (rejectButton) {
      rejectButton.click();
      yield { msg: "Clicked Kela En hyväksy" };
      await Lib.sleep(2000);
    }

    const remainingBanner =
      document.querySelector(".kds-cookie-banner") ||
      document.querySelector('[aria-label="Kävijätilastot"]');

    if (remainingBanner) {
      remainingBanner.remove();
      yield { msg: "Removed remaining Kela banner" };
      await Lib.sleep(500);
    }
  }
}
