export type ConfigEnv = {
    api_url: string;
}

export type RouteMeta = {
    useNavbar?: boolean;
    title?: string;
}

export type ErrorsForm = {
    message: string;
}

export interface LoginInputValue {
    email: string;
    password: string;
}

export type ErrorCatch = {
    name: string;
    message: string;
    stack?: string;
}

export type BinderViewProps = {
    username: string;
    routeName: string;
}

export type SideBarTaskList = {
    name: string;
    link: string;
    isActive: boolean;
}

export interface RegisterInputValue {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
}

export interface DecodedToken {
    id: string;
    name: string;
    email: string;
    photoUrl?: string;
    iat: number;
    exp: number;
}

export interface ResponseAPI<T> {
    error: boolean;
    message: string;
    data: T;
}

export interface ListResponse {
    _id: string;
    name: string;
    color: string;
    user: string;
    task: TasksResponse[];
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface TasksResponse {
    _id: string;
    name: string;
    description: string;
    done: boolean;
    list?: string;
    startDate: Date | string;
    dueDate: Date | string;
    subTask: {
        name: string;
        done: boolean;
    }[]
    user: string;
}

export type ButtonColorProps = {
    id: string;
    listColor: string;
}