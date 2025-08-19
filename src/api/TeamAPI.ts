import { isAxiosError } from "axios";
import { teamMembersSchema, type Project, type TeamMember, type TeamMemberFormData } from "../types";
import api from "@/lib/axios";


export async function findUserByEmail({ projectID, formData }: { projectID: Project['_id'], formData: TeamMemberFormData }) {
    try {
        const { data } = await api.post(`/projects/${projectID}/team/find`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function addUserToProject({ projectID, id }: { projectID: Project['_id'], id: TeamMember['_id'] }) {
    try {
        const { data } = await api.post<string>(`/projects/${projectID}/team`, { id })
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getProjectTeam(projectID: Project['_id']) {
    try {
        const { data } = await api(`/projects/${projectID}/team`)
        const response = teamMembersSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function removeUserFromProject({ projectID, userID }: { projectID: Project['_id'], userID: TeamMember['_id'] }) {
    try {
        const { data } = await api.delete<string>(`/projects/${projectID}/team/${userID}`)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
