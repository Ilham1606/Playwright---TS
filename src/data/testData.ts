type TestDataProps = {
  uname: string;
  email: string;
  emailke2: string;
  password: string;

  // basic form //
  emailBasic: string;
  passBasic: string;

  // form without labels //
  recipients: string;
  subject: string;
  message: string;

  // block form //
  firstName: string;
  lastName: string;
  emailBlockForm: string;
  website: string;

  // common date picker //
  dateCommon: string;

  // date picker with range //
  dateRangeStart: string;
  dateRangeEnd: string;

  // date picker with disabled min max values //
  dateMinMax: string;
};

export const testData = (): TestDataProps => {
  return {
    uname: "Jane Doe",
    email: "jane.doe@email.com",
    emailke2: "emailkeduaseedoel@gmail.com",
    password: "Passwordnyanigh123",

    // basic form //
    emailBasic: "emailbasic@gmail.com",
    passBasic: "passbasic",

    // form without labels //
    recipients: "dia penerima",
    subject: "tolong terima",
    message: "ini adalah pesan, untuk memesan pesanan",

    // block form //
    firstName: "Depan",
    lastName: "Belakang",
    emailBlockForm: "depanbelakangnama@gmail.com",
    website: "websitenamalengkap.com",

    // common date picker //
    dateCommon: "Dec 31, 2025",

    // date picker with range //
    dateRangeStart: "1",
    dateRangeEnd: "31",

    // date picker with disabled min max values //
    dateMinMax: "31",
  };
};
