import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { taskSchema, type Project, type Task, type TaskFormData } from "../types";

type TaskAPI = {
    formData: TaskFormData
    projectID: Project['_id']
    taskID: Task['_id']
    status: Task['status']
}

export async function createTask({ formData, projectID }: Pick<TaskAPI, 'formData' | 'projectID'>) {
    try {
        const url = `/projects/${projectID}/tasks`
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getTaskByID({ projectID, taskID }: Pick<TaskAPI, 'projectID' | 'taskID'>) {
    try {
        const url = `/projects/${projectID}/tasks/${taskID}`
        const { data } = await api(url)
        const response = taskSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function updateTask({ projectID, taskID, formData }: Pick<TaskAPI, 'projectID' | 'taskID' | 'formData'>) {
    try {
        const url = `/projects/${projectID}/tasks/${taskID}`
        const { data } = await api.put<string>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteTask({ projectID, taskID }: Pick<TaskAPI, 'projectID' | 'taskID'>) {
    try {
        const url = `/projects/${projectID}/tasks/${taskID}`
        const { data } = await api.delete<string>(url)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function updateStatus({ projectID, taskID, status }: Pick<TaskAPI, 'projectID' | 'taskID' | 'status'>) {
    try {
        const url = `/projects/${projectID}/tasks/${taskID}/status`
        const { data } = await api.post<string>(url, {status})
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
