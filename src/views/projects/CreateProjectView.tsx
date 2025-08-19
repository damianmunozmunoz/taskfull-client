import { createProject } from "@/api/ProjectAPI";
import ProjectForm from "@/components/projects/ProjectForm";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Flip, toast } from "react-toastify";
import type { ProjectFormData } from "types";


export default function CreateProjectView() {

    const navigate = useNavigate()

    const initialValues: ProjectFormData = {
        projectName: "",
        clientName: "",
        description: ""
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const { mutate } = useMutation({
        mutationFn: createProject,
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
            navigate('/')
        }
    })

    const handleForm = (formData: ProjectFormData) => mutate(formData)

    return (
        <>
            <div
                className="max-w-3xl mx-auto"
            >
                <h1
                    className="text-5xl font-black"
                >
                    Crear proyecto
                </h1>

                <p
                    className="text-2xl font-light text-gray-500 mt-5"
                >Llena el siguiente formulario para crear un proyecto</p>

                <nav className="my-5">
                    <Link
                        className="bg-teal-400 hover:bg-teal-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                        to='/'
                    >
                        Volver a proyectos
                    </Link>
                </nav>

                <form
                    className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >
                    <ProjectForm
                        register={register}
                        errors={errors}
                    />
                    <input
                        type="submit"
                        value="Crear proyecto"
                        className="bg-emerald-600 hover:bg-emerald-700 w-full p-3 text-white uppercase font-bold
                    cursor-pointer transition-colors"
                    />
                </form>
            </div>
        </>
    )
}
