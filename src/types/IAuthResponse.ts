import IUser from "./IUser";

export default interface IAuthResponse {
    message: string,
    token: string,
    user: IUser
}
