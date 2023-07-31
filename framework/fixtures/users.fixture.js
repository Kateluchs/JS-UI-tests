import config from "../config/config"

export const users = {
admin: {
        loginName: config.credentials.login,
        password: config.credentials.password,
        language: config.credentials.language
    }
}