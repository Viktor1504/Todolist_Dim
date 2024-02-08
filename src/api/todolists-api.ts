import axios from 'axios';

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '0cf68ca3-9113-4107-a169-94f299f8016a'
    }
}

type TodolistsType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}

type ResponseType<D> = {
    resultCode: number
    messages: string[],
    data: D
}

export const todolistsApi = {
    getTodolists() {
        return axios.get<TodolistsType[]>('https://social-network.samuraijs.com/api/1.1/todo-lists', settings)
    },
    createTodolist(title: string) {
        return axios.post<ResponseType<{item: TodolistsType}>>('https://social-network.samuraijs.com/api/1.1/todo-lists', {title: title}, settings)
    },
    deleteTodolist(todolistId: string) {
        return axios.delete<ResponseType<{}>>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}`, settings)
    },
    updateTodolist(todolistId: string, title: string) {
        return axios.put<ResponseType<{}>>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}`, {title: title}, settings)
    }
}