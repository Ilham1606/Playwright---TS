function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined!`);
  }
  return value;
}

export const ENV = {
  BASE_URL_CONDUIT: process.env.CI
    ? "https://playground.bondaracademy.com"
    : requireEnv("BASE_URL_CONDUIT"),

  BASE_URL_DUMMYJSON: process.env.CI
    ? "https://dummyjson.com"
    : requireEnv("BASE_URL_DUMMYJSON"),

  BASE_URL_BONDARCONDUIT: process.env.CI
    ? "https://conduit.bondaracademy.com"
    : requireEnv("BASE_URL_BONDARCONDUIT"),

  TEST_EMAIL_CONDUIT: requireEnv("TEST_EMAIL_CONDUIT"),
  TEST_PASSWORD_CONDUIT: requireEnv("TEST_PASSWORD_CONDUIT"),

  IS_CI: !!process.env.CI,
};
