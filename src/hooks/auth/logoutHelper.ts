export async function executeLogoutRequest(logoutSessionApi: () => { unwrap: () => Promise<any> }) {
  try {
    await Promise.race([
      logoutSessionApi().unwrap(),
      new Promise((_, rej) => setTimeout(() => rej(new Error("Timeout")), 4000)),
    ]);
  } catch {
    // Ignore network errors or timeouts during logout
  }
}
