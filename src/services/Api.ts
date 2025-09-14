import ILogin from "../types/ILogin";
import IResponse from "../types/IResponse";
import IUser from "../types/IUser";
import IUserData from "../types/IUserData";
import INote from "../types/INote";
import INotes from "../types/INotes";
import IAuthResponse from "../types/IAuthResponse";
import IApiError from "../types/IApiError";
import ICreateNote from "../types/ICreateNote";
import IUpdateNote from "../types/IUpdateNote";

const baseURL = 'https://organizandotudo.api.thaleslj.com/api';

class Api {
    private getAuthHeaders(token: string) {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    async CreateAccount(data: IUserData): Promise<IResponse> {
        try {
            const response = await fetch(`${baseURL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error: IApiError = await response.json();
                return { 
                    pt: { message: error.message, code: "Error" }, 
                    en: { message: error.message, code: "Error" } 
                };
            }

            await response.json();
            return { 
                pt: { message: "Usuário criado com sucesso", code: "Success" }, 
                en: { message: "User created successfully", code: "Success" } 
            };
        } catch (ex) {
            return { pt: { message: `${ex}`, code: "Error" }, en: { message: `${ex}`, code: "Error" } };
        }
    }

    async Login(data: ILogin): Promise<IAuthResponse> {
        try {
            const response = await fetch(`${baseURL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error: IApiError = await response.json();
                throw new Error(error.message);
            }

            const result: IAuthResponse = await response.json();
            return result;
        } catch (ex) {
            throw ex;
        }
    }


    async GetUser(token: string): Promise<IUser> {
        try {
            const response = await fetch(`${baseURL}/users/profile`, {
                method: 'GET',
                headers: this.getAuthHeaders(token)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const result: IUser = await response.json();
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async UpdateUser(data: IUserData, token: string): Promise<IResponse> {
        try {
            const response = await fetch(`${baseURL}/users/profile`, {
                method: 'PUT',
                headers: this.getAuthHeaders(token),
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error: IApiError = await response.json();
                return { 
                    pt: { message: error.message, code: "Error" }, 
                    en: { message: error.message, code: "Error" } 
                };
            }

            return { 
                pt: { message: "Perfil atualizado com sucesso", code: "Success" }, 
                en: { message: "Profile updated successfully", code: "Success" } 
            };
        } catch (ex) {
            return { pt: { message: `${ex}`, code: "Error" }, en: { message: `${ex}`, code: "Error" } };
        }
    }

    async CreateNote(data: ICreateNote, token: string): Promise<IResponse> {
        try {
            const response = await fetch(`${baseURL}/notes`, {
                method: 'POST',
                headers: this.getAuthHeaders(token),
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error: IApiError = await response.json();
                return { 
                    pt: { message: error.message, code: "Error" }, 
                    en: { message: error.message, code: "Error" } 
                };
            }

            return { 
                pt: { message: "Nota criada com sucesso", code: "Success" }, 
                en: { message: "Note created successfully", code: "Success" } 
            };
        } catch (ex) {
            return { pt: { message: `${ex}`, code: "Error" }, en: { message: `${ex}`, code: "Error" } };
        }
    }

    async UpdateNote(data: IUpdateNote, id: string, token: string): Promise<IResponse> {
        try {
            const response = await fetch(`${baseURL}/notes/${id}`, {
                method: 'PATCH',
                headers: this.getAuthHeaders(token),
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error: IApiError = await response.json();
                return { 
                    pt: { message: error.message, code: "Error" }, 
                    en: { message: error.message, code: "Error" } 
                };
            }

            return { 
                pt: { message: "Nota atualizada com sucesso", code: "Success" }, 
                en: { message: "Note updated successfully", code: "Success" } 
            };
        } catch (ex) {
            return { pt: { message: `${ex}`, code: "Error" }, en: { message: `${ex}`, code: "Error" } };
        }
    }

    async DeleteNote(id: string, token: string): Promise<IResponse> {
        try {
            const response = await fetch(`${baseURL}/notes/${id}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders(token)
            });

            if (!response.ok) {
                const error: IApiError = await response.json();
                return { 
                    pt: { message: error.message, code: "Error" }, 
                    en: { message: error.message, code: "Error" } 
                };
            }

            return { 
                pt: { message: "Nota deletada com sucesso", code: "Success" }, 
                en: { message: "Note deleted successfully", code: "Success" } 
            };
        } catch (ex) {
            return { pt: { message: `${ex}`, code: "Error" }, en: { message: `${ex}`, code: "Error" } };
        }
    }

    async PublishNote(id: string, token: string): Promise<IResponse> {
        try {
            const response = await fetch(`${baseURL}/notes/${id}/toggle-public`, {
                method: 'PATCH',
                headers: this.getAuthHeaders(token)
            });

            if (!response.ok) {
                const error: IApiError = await response.json();
                return { 
                    pt: { message: error.message, code: "Error" }, 
                    en: { message: error.message, code: "Error" } 
                };
            }

            return { 
                pt: { message: "Visibilidade da nota alterada com sucesso", code: "Success" }, 
                en: { message: "Note visibility changed successfully", code: "Success" } 
            };
        } catch (ex) {
            return { pt: { message: `${ex}`, code: "Error" }, en: { message: `${ex}`, code: "Error" } };
        }
    }

    async GetNote(id: string, token: string): Promise<INote> {
        try {
            const response = await fetch(`${baseURL}/notes/${id}`, {
                method: 'GET',
                headers: this.getAuthHeaders(token)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch note');
            }

            const result: INote = await response.json();
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async GetPublicNote(id: string): Promise<INote> {
        try {
            const response = await fetch(`${baseURL}/notes/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch public note');
            }

            const result: INote = await response.json();
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async GetNotes(token: string, page: number = 1, limit: number = 100, search?: string): Promise<INotes[]> {
        try {
            let url = `${baseURL}/notes?page=${page}&limit=${limit}`;
            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getAuthHeaders(token)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const result = await response.json();
            return result.notes || [];
        } catch (ex) {
            return [];
        }
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new Api();