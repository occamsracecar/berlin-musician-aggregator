/**
 * Returns true when running inside GitHub Actions.
 */
function isCiEnvironment() {
  return process.env.GITHUB_ACTIONS === "true";
}

/**
 * Timeouts tuned for slow or bot-protected sites on CI runners.
 */
function getScrapeTimeouts() {
  const ci = isCiEnvironment();

  return {
    navigationMs: ci ? 120000 : 90000,
    selectorMs: ci ? 60000 : 30000,
    retryDelayMs: ci ? 4000 : 2000,
    maxAttempts: ci ? 4 : 3,
  };
}

/**
 * Dismisses common German/English cookie consent overlays if present.
 */
async function dismissConsentDialogs(page) {
  const selectors = [
    "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll",
    "#onetrust-accept-btn-handler",
    'button:has-text("Alle akzeptieren")',
    'button:has-text("Akzeptieren")',
    'button:has-text("Accept all")',
    'button:has-text("Accept")',
  ];

  for (const selector of selectors) {
    const button = page.locator(selector).first();

    try {
      if (await button.isVisible({ timeout: 1500 })) {
        await button.click({ timeout: 3000 });
        await page.waitForTimeout(500);
        return;
      }
    } catch {
      // Try next selector.
    }
  }
}

/**
 * Blocks heavy assets on CI to speed up page loads and reduce timeouts.
 */
async function blockHeavyAssets(context) {
  await context.route("**/*", (route) => {
    const type = route.request().resourceType();

    if (type === "image" || type === "font" || type === "media") {
      return route.abort();
    }

    return route.continue();
  });
}

/**
 * Detects Cloudflare or bot-challenge interstitial pages.
 */
async function isBotChallengePage(page) {
  const title = (await page.title().catch(() => "")).toLowerCase();

  return (
    title.includes("nur einen moment") ||
    title.includes("just a moment") ||
    title.includes("attention required")
  );
}

module.exports = {
  isCiEnvironment,
  getScrapeTimeouts,
  dismissConsentDialogs,
  blockHeavyAssets,
  isBotChallengePage,
};
