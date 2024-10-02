interface LoginEventBody {
    email: string;
    password: string;
}

interface regiseterEventBody {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: number;
    password: string;
}

interface registerEventFieldMissingBody {
    firstName: string;
    lastName: string;
    phoneNumber: number;
    password: string;
}

const registerEventFieldMissingBody: registerEventFieldMissingBody = {
    firstName: "test",
    lastName: "2",
    phoneNumber: 1234567890,
    password: "12345",
};

const loginEventBody: LoginEventBody = {
    email: "arnavtest@mail.com",
    password: "arnavtest@123",
};

const registerEventBody: regiseterEventBody = {
    firstName: "arnav",
    lastName: "test",
    email: "arnavtest@mail.com",
    phoneNumber: 1234567890,
    password: "arnavtest@123",
};

export { loginEventBody, registerEventBody, registerEventFieldMissingBody };
