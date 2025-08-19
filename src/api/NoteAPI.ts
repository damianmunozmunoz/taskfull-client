import { isAxiosError } from "axios";
import type { Note, NoteFormData, Project, Task } from "../types";
import api from "@/lib/axios";

type NoteAPIType = {
    formData: NoteFormData
    projectID: Project['_id']
    taskID: Task['_id']
    noteID: Note['_id']
}

export async function createNote({ projectID, taskID, formData }: Pick<NoteAPIType, 'projectID' | 'taskID' | 'formData'>) {
    try {
        const { data } = await api.post<string>(`/projects/${projectID}/tasks/${taskID}/notes`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteNote({ projectID, taskID, noteID }: Pick<NoteAPIType, 'projectID' | 'taskID' | 'noteID'>) {
    try {
        const { data } = await api.delete<string>(`/projects/${projectID}/tasks/${taskID}/notes/${noteID}`)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}