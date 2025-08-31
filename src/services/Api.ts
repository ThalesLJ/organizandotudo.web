import ILogin from "../types/ILogin";
import IResponse from "../types/IResponse";
import IUser from "../types/IUser";
import IUserData from "../types/IUserData";
import INote from "../types/INote";
import INotes from "../types/INotes";

const baseURL = 'https://organizandotudo-api.netlify.app/api';

class Api {
    async CreateAccount(data: IUserData): Promise<IResponse> {
        try {
            let response = await fetch(`${baseURL}/CreateAccount`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }
            );

            let result: IResponse = await response.json();
            return result;
        } catch (ex) {
            return { pt: { message: `${ex}`, code: "Error" }, en: { message: `${ex}`, code: "Error" } };
        }
    }

    async Login(data: ILogin): Promise<IUser> {
        try {
            let response = await fetch(`${baseURL}/Login`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }
            );

            let result: IUser = await response.json();
            return result;
        } catch (ex) {
            return { token: "", username: "", email: "" };
        }
    }

    VerifyToken(data: IUser): IResponse {
        let result: IResponse;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${baseURL}/VerifyToken`, false);  // false = the request is synchronous
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', `${data.token}`);
        
        result = { 
            pt: { message: 'Falha ao verificar o token', code: "Falha" }, 
            en: { message: 'Error verifying token', code: "Error" } 
        };

        try {
            xhr.send(JSON.stringify(data));
            if (xhr.status === 200) {
                result = JSON.parse(xhr.responseText);
            }
        } catch (ex) { }
        
        return result;
    }

    async GetUser(data: IUser): Promise<IUserData> {
        try {
            let response = await fetch(`${baseURL}/User`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `${data.token}` }
                }
            );

            let result: IUserData = await response.json();
            return result;
        } catch (ex) {
            return { username: '', email: '', password: '' };
        }
    }

    async UpdateUser(data: IUserData, token: string): Promise<IResponse> {
        try {
            let response = await fetch(`${baseURL}/User`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
                    body: JSON.stringify({ data: data })
                }
            );

            let result: IResponse = await response.json();
            return result;
        } catch (ex) {
            return { pt: { message: `${ex}`, code: "Error" }, en: { message: `${ex}`, code: "Error" } };
        }
    }

    async CreateNote(data: INote, token: string): Promise<IResponse> {
        try {
            let response = await fetch(`${baseURL}/Note`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
                    body: JSON.stringify({ note: data })
                }
            );

            let result: IResponse = await response.json();
            return result;
        } catch (ex) {
            return { pt: { message: `${ex}`, code: "Error" }, en: { message: `${ex}`, code: "Error" } };
        }
    }

    async UpdateNote(data: INote, id: string, token: string): Promise<IResponse> {
        try {
            let response = await fetch(`${baseURL}/Note?id=${id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
                    body: JSON.stringify({ newNote: data })
                }
            );

            let result: IResponse = await response.json();
            return result;
        } catch (ex) {
            return { pt: { message: `${ex}`, code: "Error" }, en: { message: `${ex}`, code: "Error" } };
        }
    }

    async DeleteNote(id: string, token: string): Promise<IResponse> {
        try {
            let response = await fetch(`${baseURL}/Note?id=${id}`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` }
                }
            );

            let result: IResponse = await response.json();
            return result;
        } catch (ex) {
            return { pt: { message: `${ex}`, code: "Error" }, en: { message: `${ex}`, code: "Error" } };
        }
    }

    async PublishNote(id: string, token: string): Promise<IResponse> {
        try {
            let response = await fetch(`${baseURL}/PublishNote?id=${id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` }
                }
            );

            let result: IResponse = await response.json();
            return result;
        } catch (ex) {
            return { pt: { message: `${ex}`, code: "Error" }, en: { message: `${ex}`, code: "Error" } };
        }
    }

    async GetNote(id: string, token: string): Promise<INote> {
        try {
            let response = await fetch(`${baseURL}/Note?id=${id}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` }
                }
            );

            let result: INote = await response.json();
            return result;
        } catch (ex) {
            return { id: '', title: `${ex}`, content: "Error" };
        }
    }

    async GetPublicNote(id: string): Promise<INote> {
        try {
            let response = await fetch(`${baseURL}/Note?id=${id}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            let result: INote = await response.json();
            return result;
        } catch (ex) {
            return { id: '', title: `${ex}`, content: "Error" };
        }
    }

    async GetNotes(token: string): Promise<INotes[]> {
        try {
            let response = await fetch(`${baseURL}/Notes`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` }
                }
            );

            let result: INotes[] = await response.json();
            return result;
        } catch (ex) {
            return [];
        }
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new Api();