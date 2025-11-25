import { useState } from "react"
import { useForm } from "react-hook-form"
import Modal from "./Modal"
import "../App.css"

const RootContent = (props) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const handleOpenAddRootModal = () => {
        setValue("name", "");
        setValue("description", "");
        setIsAddModalOpen(true);
    }

    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const onSubmit = async (vals) => {
        vals.manager_id = 0;

        const response = await fetch("http://localhost:5000/orgchart",
                    {
                        method: "POST",
                        headers: {
                           "Content-Type": "application/json", 
                        },
                        body: JSON.stringify(vals)
                    });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        setIsAddModalOpen(false);
        props.loaddata();
    }

    if (props.orgchartlen)
        return(<div className="topdiv"><h2>Organization Chart</h2></div>);
    
    return(
        <div>
            <div className="topdiv">
                <h2>Organization Chart</h2>
                <input type="button" className="subbtn" value="Add Root" onClick={ handleOpenAddRootModal }/>
            </div>
            <Modal isOpen={isAddModalOpen} onClose={handleCloseAddModal}>
                <h2>Add Root</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <table>
                        <tbody>
                            <tr>
                                <td> 
                                    <label className="frmlbl">Manager</label>
                                </td>
                                <td>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className="frmlbl">Name</label>
                                </td>
                                <td>
                                    <input type="text" 
                                    {...register("name", { required: "Name is required" })} />
                                    <br/>
                                    <label className="suberror">
                                        {errors.name && errors.name.message}
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className="frmlbl">Description</label>
                                </td>
                                <td>
                                    <input type="text" size="35" 
                                    {...register("description", { required: "Description is required" })} />
                                    <br/>
                                    <label className="suberror">
                                        {errors.description && errors.description.message}
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2" className="subbtncell">
                                    <input className="subbtn" type="submit" value="Add" />
                                    <input type="hidden" 
                                    {...register("manager_id") }
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>                
                </form>
            </Modal>
        </div>
    );
}
export default RootContent;