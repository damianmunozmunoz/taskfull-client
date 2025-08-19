import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTaskByID, updateStatus } from '@/api/TaskAPI';
import { Flip, toast } from 'react-toastify';
import { formatDate } from '@/utils/index';
import { statusTranslations } from '@/locales/es';
import type { TaskStatus } from '@/types/index';
import NotesPanel from '../notes/NotesPanel';


export default function TaskModalDetails() {

    const params = useParams()
    const projectID = params.projectID!

    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskID = queryParams.get('viewTask')!

    const show = taskID ? true : false

    const { data, isError, error } = useQuery({
        queryKey: ['task', taskID],
        queryFn: () => getTaskByID({ projectID, taskID }),
        enabled: !!taskID,
        retry: false,
    })

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: updateStatus,
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
            queryClient.invalidateQueries({ queryKey: ['project', projectID] })
            queryClient.invalidateQueries({ queryKey: ['task', taskID] })
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value as TaskStatus
        const data = { projectID, taskID, status }
        mutate(data)
    }

    if (isError) {
        toast.error(error.message, {
            toastId: 'error',
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            theme: "dark",
            transition: Flip
        })
        return <Navigate to={`/projects/${projectID}`} />
    }

    if (data) return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true })}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    <p className='text-sm text-slate-400'>Agregada el {formatDate(data.createdAt)}</p>
                                    <p className='text-sm text-slate-400'>Última actualización el {formatDate(data.updatedAt)}</p>
                                    <Dialog.Title
                                        as="h3"
                                        className="font-black text-4xl text-slate-600 my-5"
                                    >{data.name}</Dialog.Title>

                                    <p className='text-lg text-slate-500 mb-2'>Descripción: {data.description}</p>

                                    {data.completedBy.length ?
                                        (
                                            <>
                                                <p className='font-bold text-2xl text-slate-600 my-5'>Historial de cambios</p>
                                                <ul className='list-decimal'>
                                                    {data.completedBy.map((activityLog) => (
                                                        <li className='text-lg text-slate-500 mb-2' key={activityLog._id}>
                                                            {statusTranslations[activityLog.status]}{' '} por: {' '}
                                                            <span
                                                                className='text-slate-600 font-bold'
                                                            >{activityLog.user.name} </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        ) : null
                                    }

                                    <div className='my-5 space-y-3'>
                                        <label className='font-bold'>Estado Actual: </label>
                                        <select
                                            className='w-full p-3 bg-white border border-gray-300 mt-2'
                                            defaultValue={data.status}
                                            onChange={handleChange}
                                        >
                                            {Object.entries(statusTranslations).map(([key, value]) => (
                                                <option key={key} value={key}>{value}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <NotesPanel
                                     notes={data.notes}
                                    />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}