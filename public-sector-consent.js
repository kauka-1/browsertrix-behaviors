class PublicSectorConsent {
  static id = "public-sector-consent";

  static isMatch() {
    return true;
  }

  static init() {
    return {};
  }

  async run() {
    const selectors = [
      // Kela
      'button[aria-label="En hyväksy kävijätilastojen keräämistä"]',
      '.kds-cookie-banner button',

      // hel.fi / HDS
      'button[aria-label*="Hyväksy vain välttämättömät"]',
      'button[aria-label*="Reject"]',
      'button[aria-label*="Vain välttämättömät"]'
    ];

    const preferredTexts = [
      "En hyväksy",
      "Hyväksy vain välttämättömät evästeet",
      "Vain välttämättömät",
      "Reject all",
      "Decline",
      "No"
    ];

    function visible(el) {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        rect.width > 0 &&
        rect.height > 0
      );
    }

    function clickElement(el) {
      el.scrollIntoView({ block: "center", inline: "center" });
      el.click();
    }

    // 1. Tarkat selektorit ensin
    for (const selector of selectors) {
      const candidates = Array.from(document.querySelectorAll(selector)).filter(visible);
      for (const el of candidates) {
        const text = (el.textContent || "").trim();
        const aria = (el.getAttribute("aria-label") || "").trim();

        if (
          preferredTexts.some(t => text.includes(t) || aria.includes(t)) ||
          selector.includes("kds-cookie-banner")
        ) {
          clickElement(el);
          await new Promise(r => setTimeout(r, 1000));
          return;
        }
      }
    }

    // 2. Yleinen tekstihaku nappien joukosta
    const buttons = Array.from(document.querySelectorAll("button, [role='button']"))
      .filter(visible);

    for (const wanted of preferredTexts) {
      const btn = buttons.find(el => {
        const text = (el.textContent || "").trim();
        const aria = (el.getAttribute("aria-label") || "").trim();
        return text.includes(wanted) || aria.includes(wanted);
      });

      if (btn) {
        clickElement(btn);
        await new Promise(r => setTimeout(r, 1000));
        return;
      }
    }
  }
}
