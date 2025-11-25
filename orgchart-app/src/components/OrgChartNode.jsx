import { useState } from "react"
import { useForm } from "react-hook-form"
import Modal from "./Modal"
import "../App.css"

const OrgChartNode = (props) => {
    const [selectedNode, setSelectedNode] = useState({
                                                id: 0, 
                                                name:"", 
                                                description:"",
                                                manager_id: 0,
                                                manager_name: "",
                                                level: 0
                                            });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isConfDelModalOpen, setIsConfDelModalOpen] = useState(false);
    const [actionType, setActionType] = useState(false);
    const [addEditManagerName, setAddEditManagerName] = useState("");
    const [frmTitle, setFrmTitle] = useState("");
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const handleOpenAddModal = (selNode) => {
        assignSelNode(selNode);
        setActionType("add");
        setFrmTitle("Add Node");
        setAddEditManagerName(selNode.name);
        setValue("name", "");
        setValue("description", "");
        setIsAddModalOpen(true);
    }

    const handleOpenEditModal = (selNode) => {
        assignSelNode(selNode);
        setActionType("edit");
        setFrmTitle("Edit Node");

        let manager_name = ""
        if (selNode.manager_id != 0)
            manager_name = props.datamap.get(selNode.manager_id).name;
        setAddEditManagerName(manager_name);
        setValue("name", selNode.name);
        setValue("description", selNode.description)
        setIsAddModalOpen(true);
    }

    const handleOpenInfoModal = (selNode) => {
        assignSelNode(selNode);
        setIsInfoModalOpen(true); 
    }

    const handleOpenConfDelModal = (selNode) => {
        assignSelNode(selNode);
        setIsConfDelModalOpen(true); 
    }

    const assignSelNode = (selNode) => {
        let manager_name = "";
        if (selNode.manager_id != 0)
            manager_name = props.datamap.get(selNode.manager_id).name;
        setSelectedNode({ 
                         id: selNode.id, 
                         name: selNode.name, 
                         description: selNode.description,
                         manager_id: selNode.manager_id,
                         manager_name: manager_name,
                         level: selNode.level
                        });  
    }

    const handleCloseAddModal = () => setIsAddModalOpen(false);
    const handleCloseInfoModal = () => setIsInfoModalOpen(false);
    const handleCloseConfDelModal = () => setIsConfDelModalOpen(false);

    const onSubmit = async (vals) => {
        if  (actionType == "add") 
            vals.manager_id = selectedNode.id;
        else
            vals.manager_id = selectedNode.manager_id;

        let method = "POST";
        let url = "http://localhost:5000/orgchart";
        if (actionType == "edit") {
            method = "PUT";
            url += "/" + selectedNode.id;
        }

        const response = await fetch(url,
                    {
                        method: method,
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

    const handleDeleteNode = async (selNode) => {
        const response = await fetch("http://localhost:5000/orgchart/" + selNode.id,
                        {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        setIsConfDelModalOpen(false);
        props.loaddata();
    }
    
    return(
        <div>
            <Modal isOpen={isAddModalOpen} onClose={handleCloseAddModal}>
                <h2>{frmTitle}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <table>
                        <tbody>
                            <tr>
                                <td> 
                                    <label className="frmlbl">Manager</label>
                                </td>
                                <td>
                                    {addEditManagerName}
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

            <Modal isOpen={isInfoModalOpen} onClose={handleCloseInfoModal}>
                <h2>Node Info</h2>
                <table className="nodeinfotbl">
                  <tbody>
                    <tr>
                        <td className="infocell"><label className="frmlbl">Name</label></td>
                        <td>{selectedNode.name}</td>
                    </tr>
                    <tr>
                        <td><label className="frmlbl">Description</label></td>
                        <td>{selectedNode.description}</td>
                    </tr>
                    <tr>
                        <td><label className="frmlbl">Manager</label></td>
                        <td>{selectedNode.manager_name}</td>
                    </tr>
                  </tbody>
                </table>
            </Modal>

            <Modal isOpen={isConfDelModalOpen} onClose={handleCloseConfDelModal}>
                <h2>Delete Confirmation</h2>
                <table>
                  <tbody>
                    <tr>
                        <td>
                            Are you sure you want to delete this node (Name={selectedNode.name })?
                        </td>
                    </tr>
                    <tr>
                        <td className="subbtncell">
                            <input type="button" className="subbtn" value="OK" onClick={() => { handleDeleteNode(selectedNode)}} />                            
                            &nbsp; &nbsp;&nbsp; &nbsp;
                            <input type="button" className="subbtn" value="No" onClick={ handleCloseConfDelModal } />                            
                        </td>
                    </tr>
                  </tbody>
                </table>
            </Modal>
 
            { props.orgchart.map( chartnode => (
            <table  key={chartnode.id} className="orgnode">
            <tbody>
                <tr>
                    <td className="orgleft">
                        <img src="horiz.png" />
                    </td>
                    <td>
                        <div className="orgnodebg">
                            <div className="orgicon">
                                <img src="add_icon.png" onClick={ () => { handleOpenAddModal(chartnode) } }/>
                                &nbsp;
                                <img src="edit_icon.png" onClick={ () => { handleOpenEditModal(chartnode) } }/>
                                &nbsp;
                                <img src="delete_icon.png"  onClick={ () => { handleOpenConfDelModal(chartnode) } }/>
                                &nbsp;
                                <img src="info_icon.png" onClick={ () => { handleOpenInfoModal(chartnode) } }/>
                            </div>
                            {chartnode.name} 
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colSpan="2">
                        <table className="orgnode2">
                        <tbody>
                            <tr>
                                <td className="orgleft">
                                </td>
                                <td>
                                    <OrgChartNode 
                                    orgchart={chartnode.emps} 
                                    loaddata={props.loaddata}
                                    datamap={props.datamap}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table> 
                    </td>
                </tr>
            </tbody>
            </table>
            ))}
            
            </div>
        )
}
export default OrgChartNode;