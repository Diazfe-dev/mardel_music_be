export  class AuthService {
    constructor() {
    }

    validateLoginCredentials({email, password}) {
        return {
            name: "Fake", lastName: "User", email: email, password: password,
        };
    }
}