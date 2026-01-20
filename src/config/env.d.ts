declare namespace NodeJS {
  interface ProcessEnv {
    BASE_URL_CONDUIT: string;
    BASE_URL_DUMMYJSON: string;
    CI?: string;
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined!`);
  }
  return value;
}

export const ENV = {
  BASE_URL_CONDUIT: requireEnv("BASE_URL_CONDUIT"),
  BASE_URL_DUMMYJSON: requireEnv("BASE_URL_DUMMYJSON"),
  IS_CI: !!process.env.CI,
};
