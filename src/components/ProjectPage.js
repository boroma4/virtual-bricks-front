import React, {useEffect, useState} from "react";
import { useHistory,useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import {BackendService} from "../service/BackendService";

export default function MainPage(){

    const history = useHistory();
    // const location = useLocation();
    let {pin} = useParams();
    const[currentProject, setCurrentProject] = useState(undefined);
    const[models, setModels] = useState([]);
    const[modelCards, setModelCards] = useState(undefined);

    const  deAsyncGetProjects = async (func,arg) => {
        let result = await func(arg);
        setCurrentProject(result.data)
    };

    const  deAsyncGetModels = async (func,arg) => {
        let result = await func(arg);
        setModels(result.data)
    };

    const makeCards = () => {
        return (<div>
            {models.map((card,idx)=>{
                return (
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>{card.modelName}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Model code: {card.modelCode}</Card.Subtitle>
                            <Card.Link href="#">See 3D</Card.Link>
                            <Card.Link href="#">See Comments</Card.Link>
                        </Card.Body>
                    </Card>)
            })}
        </div>);

    };

    useEffect(()=>{
        let canvas = document.querySelector('canvas');
        if(canvas){
            document.body.removeChild(canvas);
        }

        if (!currentProject){
            const serviceCall = new BackendService();
            deAsyncGetProjects(serviceCall.getProject,pin);
        }

    }, []);

    useEffect(()=>{
        console.log(currentProject);
        if (currentProject){
            const serviceCall = new BackendService();
            deAsyncGetModels(serviceCall.getModels,currentProject.projectId);
        }
    },[currentProject]);

    return(
        <div>
            <h1>Project name: {(currentProject?.projectName) ? (currentProject.projectName) : ("N/A")} </h1>
            <h3>Customer: {(currentProject?.customerName) ? (currentProject.customerName) : ("N/A")} </h3>
            <h3>Organization: {(currentProject?.organizationName) ? (currentProject.organizationName) : ("N/A")} </h3>
            {models ? (makeCards()):(<></>)}
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>Add new model</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted"> </Card.Subtitle>
                    <Card.Link href="#">Add</Card.Link>
                </Card.Body>
            </Card>
        </div>
    )
}
