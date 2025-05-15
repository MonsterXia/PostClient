const TOKEN_KEY = 'jwt'

function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

export {
    getToken
}