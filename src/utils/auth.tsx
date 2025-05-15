const TOKEN_KEY = 'jwt'

function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

function setToken(token: string) {
    // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vbnN0ZXIxMDE4NjI5NjgxQGdtYWlsLmNvbSIsIm9yZ2FuaXphdGlvbiI6IiIsInJvbGUiOiIiLCJleHAiOjE3NDc0Mjk2OTB9.Xf9U7y0YAD8Y4CK-OPvrTVLxnBo_YoYeycpjD6_IcsY
    let tokenStr = token.substring(7)
    localStorage.setItem(TOKEN_KEY, tokenStr)
}

export {
    getToken,
    setToken,
}