declare namespace NodeJS {
  interface ProcessEnv {
    BASE_URL_CONDUIT: string;
    BASE_URL_DUMMYJSON: string;
    BASE_URL_BONDARCONDUIT: string;
    CI?: string;

    TEST_EMAIL_CONDUIT: string;
    TEST_USER_CONDUIT: string;
  }
}
