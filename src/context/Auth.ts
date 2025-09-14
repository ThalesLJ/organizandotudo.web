import { makeAutoObservable } from "mobx";
import IUser from "../types/IUser";
import IAuthResponse from "../types/IAuthResponse";
import Api from "../services/Api";

class Auth {
    user: IUser = { id: "", username: "", email: "", createdAt: "", updatedAt: "" };
    token: string = "";
    isTokenValid: boolean = false;

    constructor() {
        makeAutoObservable(this);
        this.hydrate();
    }

    private isJWTValid(token: string): boolean {
        try {
            // JWT tem 3 partes separadas por pontos: header.payload.signature
            const parts = token.split('.');
            if (parts.length !== 3) {
                return false;
            }

            // Decodificar o payload (parte do meio)
            const payload = JSON.parse(atob(parts[1]));
            
            // Verificar se tem campo de expiração
            if (!payload.exp) {
                return false;
            }

            // Verificar se o token não expirou
            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp > currentTime;
        } catch (error) {
            return false;
        }
    }

    // Função para obter informações do JWT (opcional, para debug)
    getJWTInfo(token: string) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }

            const payload = JSON.parse(atob(parts[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            return {
                userId: payload.sub || payload.userId,
                username: payload.username,
                email: payload.email,
                issuedAt: new Date(payload.iat * 1000),
                expiresAt: new Date(payload.exp * 1000),
                isExpired: payload.exp <= currentTime,
                timeUntilExpiry: payload.exp - currentTime
            };
        } catch (error) {
            return null;
        }
    }

    checkTokenValidity() {
        this.hydrate();
        this.isTokenValid = false;

        if (this.user !== null && this.token !== null && this.token !== '') {
            // Verificar se o JWT é válido localmente (sem chamada à API)
            this.isTokenValid = this.isJWTValid(this.token);
        }
    }

    login(authResponse: IAuthResponse) {
        this.user = authResponse.user;
        this.token = authResponse.token;
        this.persistUser();
    }

    logout() {
        this.user = { id: "", username: "", email: "", createdAt: "", updatedAt: "" };
        this.token = "";
        this.unpersistUser();
    }

    private persistUser() {
        this.setCookie('user', JSON.stringify(this.user), 5000);
        this.setCookie('token', this.token, 5000);
        this.isTokenValid = true;
    }

    private unpersistUser() {
        this.removeCookie('user');
        this.removeCookie('token');
        this.isTokenValid = false;
    }

    private hydrate() {
        const userData = this.getCookie('user');
        const tokenData = this.getCookie('token');
        
        if (userData && tokenData) {
            this.user = JSON.parse(userData);
            this.token = tokenData;
        }
    }

    private setCookie(name: string, value: string, days: number) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = 'expires=' + date.toUTCString();
        document.cookie = name + '=' + value + ';' + expires + ';path=/';
    }

    private getCookie(name: string) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    private removeCookie(name: string) {
        this.setCookie(name, '', -1);
    }
}

const authInstance = new Auth();
authInstance.checkTokenValidity();
export default authInstance;