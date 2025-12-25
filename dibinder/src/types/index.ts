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
    task: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface ListByIdResponse {
    _id: string;
    name: string;
    color: string;
    user: string;
    task: TasksResponse[];
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface ListDropdownResponse {
    _id: string;
    name: string;
    color: string;
}

export interface TasksResponse {
    _id: string;
    name: string;
    description: string;
    done: boolean;
    list?: {
        _id: string;
        name: string;
        color: string | null;
    } | null;
    startDate: Date | string;
    dueDate: Date | string;
    subTask: {
        name: string;
        done: boolean;
    }[]
    user: string;
}

export type ButtonColorProps = {
    // id: string;
    // listColor: string;

    /**
     *  @default true
     */
    clickable: boolean;
    data: {
        id: string;
        name: string;
        color: string;
    }
}

export type ButtonColorData = {
    id: string | undefined;
    name: string;
    color: string | undefined;
}

export interface ButtonColorEmits {
    'submit': [payload: {
        event: PointerEvent | Event,
        data: ButtonColorData,
    }]
}

export interface TaskLengthResponse {
    today: number;
    all: number;
}

export interface BodyTask {
    name: string;
    description: string;
    done: boolean;
    list: string;
    startDate: Date | null;
    dueDate: Date | null;
    subTask: {
        name: string;
        done: boolean;
    }[]
}

export interface BodyList{
    name: string;
    color: string | null;
}

export interface CDialogProps {
    // modelValue: boolean;
    visible: boolean;
    header: string;
    data?: ListByIdResponse | undefined;
}

export interface CDialogEmits {
    'submit': [payload: {
        id: string | undefined;
        name: string;
        colors: string;
    }]
}