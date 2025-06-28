const phishingHosts = [
  "allegro.pl-oferta862543094.shop",
  "allegro.pl-kategorie91237714278123.icu",
  "alexandrebrochot.com"
];

const secureHosts = [
  "google.com",
  "wikipedia.org",
  "github.com",
  "stackoverflow.com",
  "microsoft.com",
  "apple.com",
  "amazon.com",
  "example.com"
];

// Keeps track of already alerted tab URLs
const alertedTabs = new Set();

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const hostname = new URL(tab.url).hostname;

    // Don't alert again for the same tab
    const alertKey = `${tabId}-${hostname}`;
    if (alertedTabs.has(alertKey)) return;

    // Add to alerted list
    alertedTabs.add(alertKey);

    if (phishingHosts.some(phish => hostname.includes(phish))) {
      console.log("⚠️ Phishing site detected:", hostname);
      try {
        await chrome.scripting.executeScript({
          target: { tabId },
          func: () => alert("🚨 Warning: This website may be a phishing site!")
        });
      } catch (err) {
        console.error("❌ Injection failed:", err.message);
      }
    } else if (secureHosts.some(domain => hostname.endsWith(domain))) {
      console.log("✅ Safe site detected:", hostname);
      try {
        await chrome.scripting.executeScript({
          target: { tabId },
          func: () => alert("✅ This website is safe. You can continue using it.")
        });
      } catch (err) {
        console.error("❌ Injection failed:", err.message);
      }
    }
  }
});
