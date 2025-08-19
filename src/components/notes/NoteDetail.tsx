import { deleteNote } from "@/api/NoteAPI"
import { useAuth } from "@/hooks/useAuth"
import type { Note } from "@/types/index"
import { formatDate } from "@/utils/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { Flip, toast } from "react-toastify"


type NoteDetailProps = {
    note: Note
}

export default function NoteDetail({ note }: NoteDetailProps) {

    const { data, isLoading } = useAuth()

    const canDelete = useMemo(() => data?._id == note.createdBy._id, [data])

    const params = useParams()
    const location = useLocation()

    const queryParams = new URLSearchParams(location.search)
    const projectID = params.projectID!
    const taskID = queryParams.get('viewTask')!

    const queryClient = useQueryClient()
    const {mutate} = useMutation({
        mutationFn: deleteNote,
        onError: (error) => {
            toast.error(error.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "dark",
                transition: Flip
            })
        },
        onSuccess: (data) => {
            toast.success(data, {
                toastId: 'delete-success',
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "dark",
                transition: Flip
            })
            queryClient.invalidateQueries({queryKey: ['task', taskID]})
        }
    })

    if (isLoading) return 'Cargando...'
    return (
        <div
            className="p-3 flex justify-between items-center"
        >
            <div>
                <p>{note.content} por <span className="font-bold">{note.createdBy.name}</span></p>
                <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
            </div>

            {canDelete && (
                <button
                    type="button"
                    className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transition-colors rounded-lg"
                    onClick={() => mutate({projectID, taskID, noteID: note._id})}
                >Eliminar</button>
            )}
        </div>
    )
}
