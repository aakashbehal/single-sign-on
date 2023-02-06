
import { history } from "../helpers";
import { handleResponse, axiosCustom } from "../helpers/util"

const login = async (username: string, password: string) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_USER_SERVICE}/login`, {
            loginKey: username.trim(),
            loginSecret: password.trim()
        })
        const data = handleResponse(response)
        if (data.response) {
            let jwtToken = data.response.token;
            if (jwtToken) {
                delete data.response.token
            }
            if (data.response.isResetRequired) {
                localStorage.setItem('tempUser', JSON.stringify(data.response))
            } else {
                sessionStorage.setItem('jwtToken', jwtToken)
                const dataToSet = { ...data.response, ...{ version: '1' } }
                localStorage.setItem('user', JSON.stringify(dataToSet))
            }
            return data.response
        }
    } catch (error: any) {
        if (error.message) {
            throw error.message
        }
        throw error
    }
}

async function logout() {
    const user = getUser()
    try {
        console.log(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_USER_SERVICE}/logout`)
        await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_USER_SERVICE}/logout`, {
            principleId: user.principleId,
            loginKey: user.loginKey
        })
        localStorage.removeItem('user');
        history.push('/login')
    } catch (error: any) {
        throw error
    }
    // remove user from local storage to log user out
}

function logoutAuthExpired() {
    localStorage.removeItem('user');
    history.push('/login')
}

const isLoggedIn = () => {
    const user = localStorage.getItem('user')
    if (user) {
        return true
    } else {
        return false
    }
}

const isPasswordResetRequired = () => {
    const user: any = localStorage.getItem('tempUser')
    const userParsed = JSON.parse(user)
    if (userParsed && userParsed.isResetRequired) {
        return true
    } else {
        return false
    }
}

const getTempUser = () => {
    return JSON.parse(localStorage.getItem('tempUser')!)
}

const getUser = () => {
    const user = JSON.parse(localStorage.getItem('user')!)
    if (!user) {
        localStorage.clear()
        history.push('/login')
        return null
    }
    return user
}

const getUserType = () => {
    const user = JSON.parse(localStorage.getItem('user')!)
    return user.recordSource
}

const getAccessToken = () => {
    const token = sessionStorage.getItem('jwtToken')
    return token
}

export const userService = {
    login,
    logout,
    isLoggedIn,
    getUser,
    getAccessToken,
    getTempUser,
    logoutAuthExpired,
    isPasswordResetRequired,
    getUserType
}
