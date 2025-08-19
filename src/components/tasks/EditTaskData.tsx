import { getTaskByID } from "@/api/TaskAPI"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useLocation, useParams } from "react-router-dom"
import EditTaskModal from "./EditTaskModal"


export default function EditTaskData() {

    const params = useParams()
    const projectID = params.projectID!

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskID = queryParams.get('editTask')!

    const { data, isError } = useQuery({
        queryKey: ['task', taskID],
        queryFn: () => getTaskByID({ projectID, taskID }),
        enabled: !!taskID, //Las !! devuelven un boolean si la variable no es null
        retry: false,
    })

    if (isError) return <Navigate to={'/404'} />
    if (data) return <EditTaskModal data={data} taskID={taskID} />
}
