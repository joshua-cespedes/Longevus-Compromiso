import axios from "axios";

const URL_BASE = "http://localhost:8080/api/auth";
export interface ISchedule {
    id: number;
    days: string;
    entryTime1: string;
    exitTime1: string | null;
    entryTime2: string | null;
    exitTime2: string | null;
}
interface IUserBase {
    id: number;
    identification: string;
    name: string;
    photoUrl: string;
    salary: number;
    email: string;
    schedule: ISchedule;
}

export interface ICaregiver extends IUserBase {
    shift: string;
    officeContact: never;

}

export interface IAdmin extends IUserBase {
    officeContact: string;
    shift?: never;
}
export interface ILoginCredentials {
    email: string;
    password: string;
}

export type UserProfile = ICaregiver | IAdmin;

interface ILoginResponse {
    jwt: string;
    email: string;
    authorities: string[];
    user?: UserProfile;
}


export function isAdmin(user: UserProfile): user is IAdmin {
    return 'officeContact' in user && user.officeContact !== undefined && user.officeContact !== null;
}
export function isCaregiver(user: UserProfile): user is ICaregiver {
    return 'shift' in user && user.shift !== undefined && user.shift !== null;
}

export const login = async (credentials: ILoginCredentials): Promise<ILoginResponse> => {
    try {

        const response = await axios.post<ILoginResponse>(`${URL_BASE}/login`, credentials);
        const token = response.data.jwt;
        const authorities = response.data.authorities;
        const user = response.data.user;
        console.log("INFORMACION DEL LOGIN", user);

        if (token && authorities) {
            localStorage.setItem('accessToken', token);
            localStorage.setItem('userAuthorities', JSON.stringify(authorities));
            localStorage.setItem('userProfile', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return response.data;

    } catch (error) {
        console.log('ERROR AL INTENTEAR HACER LOGIN', error);
        throw error;

    }
}

export const logout = () => {

    localStorage.removeItem('accessToken');
    localStorage.removeItem('userAuthorities');
    localStorage.removeItem('userProfile');
    delete axios.defaults.headers.common['Authorization'];
};

export const updatePassword = async (formData: ILoginCredentials): Promise<void> => {
    try {
        const data = new FormData();
        data.append("email", formData.email);
        data.append("newPassword", formData.password);

        const response = await axios.post(`${URL_BASE}/newPassword`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;

    } catch (error) {
        console.log('Ocurrio un error inesperado');
        throw error;
    }
    return;
}