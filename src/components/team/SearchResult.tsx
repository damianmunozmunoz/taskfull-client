import { addUserToProject } from "@/api/TeamAPI"
import type { TeamMember } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { Flip, toast } from "react-toastify"


type SearchResultProps = {
    user: TeamMember
    reset: () => void
}

export default function SearchResult({ user, reset }: SearchResultProps) {

    const navigate = useNavigate()
    const params = useParams()
    const projectID = params.projectID!

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: addUserToProject,
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
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "dark",
                transition: Flip
            })
            reset()
            navigate(location.pathname, { replace: true })
            queryClient.invalidateQueries({ queryKey: ['projectTeam', projectID] })
        }
    })

    const handleAddUserToProject = () => {
        const data = {
            projectID,
            id: user._id
        }
        mutate(data)
    }

    return (
        <>
            <p className="mt-10 text-center font-bold">Resultado:</p>
            <div className="flex justify-between items-center">
                <p>{user.name}</p>
                <button
                    className="text-teal-600 hover:bg-teal-100 px-10 py-3 font-bold cursor-pointer"
                    onClick={handleAddUserToProject}
                >
                    Agregar al proyecto
                </button>
            </div>
        </>
    )
}
