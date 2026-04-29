class KelaVisitorStatsConsent {
  static id = "kela-visitor-stats-consent";

  static isMatch() {
    return /(^|\.)kela\.fi$/.test(window.location.hostname);
  }

  static init() {
    return {};
  }

  async run(ctx) {
    const { Lib } = ctx;

    await Lib.sleep(3000);

    const banner =
      document.querySelector(".kds-cookie-banner") ||
      document.querySelector('[aria-label="Kävijätilastot"]');

    if (!banner) {
      return;
    }

    const rejectButton =
      banner.querySelector('button[aria-label="En hyväksy kävijätilastojen keräämistä"]') ||
      Array.from(banner.querySelectorAll("button")).find(btn =>
        (btn.textContent || "").trim() === "En hyväksy"
      );

    if (rejectButton) {
      rejectButton.click();
      await Lib.sleep(1500);
    }

    // Varotoimi: jos banneri jäi vielä DOMiin, poistetaan se näkyvistä.
    const remainingBanner =
      document.querySelector(".kds-cookie-banner") ||
      document.querySelector('[aria-label="Kävijätilastot"]');

    if (remainingBanner) {
      remainingBanner.remove();
      await Lib.sleep(500);
    }
  }
}
