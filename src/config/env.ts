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

  IS_CI: !!process.env.CI,
};
