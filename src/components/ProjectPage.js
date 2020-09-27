import React, {useEffect, useState} from "react";
import { useHistory,useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import {BackendService} from "../service/BackendService";
import AddModelModal from "../cmp/AddModelModal";
import {reactLocalStorage} from 'reactjs-localstorage';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function MainPage(){

    const history = useHistory();
    // const location = useLocation();
    let {pin} = useParams();
    const[currentProject, setCurrentProject] = useState(undefined);
    const[models, setModels] = useState([]);
    const[modelCards, setModelCards] = useState(undefined);
    const[modalShow, setModalShow] = useState(undefined);
    const[isOrg, setIsOrg] = useState(reactLocalStorage.get('isOrg', false) == 'true');

    const  deAsyncGetProjects = async (func,arg) => {
        let result = await func(arg);
        setCurrentProject(result.data)
    };

    const  deAsyncGetModels = async (func,arg) => {
        let result = await func(arg);
        setModels(result.data)
    };

    const onSeeCommentsClick = (modelId) => {
        console.log("FOR REAL");
        history.push("/model/comments/"+modelId);
    };

    const onSee3D = (model) =>{
        reactLocalStorage.set('model', model.modelCode);
        reactLocalStorage.set('model2', model.modelCode2);
        reactLocalStorage.set('modelId', model.modelId);
        history.push('/model');
    };

    const makeCards = () => {
        return (<Row>
            {models.map((card,idx)=>{
                return (
                    <Col xl={3} l ={3} md = {4} sm={6} style ={{margin:'15px'}}>
                        <Card style={{ width: '18rem' }} key={idx}>
                            <Card.Body>
                                <Card.Title>{card.modelName}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Model code: {card.modelCode}</Card.Subtitle>
                                <Card.Link href="#" onClick ={()=>onSee3D(card)}>See 3D</Card.Link>
                                <Card.Link onClick={()=> onSeeCommentsClick(card.modelId)}>See Comments</Card.Link>
                            </Card.Body>
                        </Card>
                    </Col>)
            })}
        </Row>);

    };

    useEffect(()=>{
        let canvas = document.querySelector('canvas');
        if(canvas){
            document.body.removeChild(canvas);
        }
        console.log(reactLocalStorage.get('isOrg', false));
        if (!currentProject){
            const serviceCall = new BackendService();
            deAsyncGetProjects(serviceCall.getProject, pin);
        }

    }, []);

    useEffect(()=>{
        if (currentProject){
            const serviceCall = new BackendService();
            deAsyncGetModels(serviceCall.getModels,currentProject.projectId);
        }
    },[currentProject]);


    return(
        <div style={{width:'100%',height:'100vh', margin:'15px'}}>
            <h1 style ={{margin:'15px'}} className='text-center'>Project name: {(currentProject?.projectName) ? (currentProject.projectName) : ("N/A")} </h1>
            <h3 style ={{margin:'15px'}}>Customer: {(currentProject?.customerName) ? (currentProject.customerName) : ("N/A")} </h3>
            <h3 style ={{margin:'15px'}}>Organization: {(currentProject?.organizationName) ? (currentProject.organizationName) : ("N/A")} </h3>
            <Container style={{width:'100%'}}>
                    {models ? (makeCards()):(<></>)}
                    {isOrg ? (<Card style={{ width: '18rem', margin:'15px' }}>
                    <Card.Body>
                                <Card.Title>Add new model</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted"> </Card.Subtitle>
                            <Card.Link href="#" onClick={()=>setModalShow(true)}>Add</Card.Link>
                        </Card.Body>
                    </Card>) : (<></>)}
            </Container>
            <AddModelModal
                show={modalShow}
                project={currentProject}
                setModels={setModels}
                onHide={() => setModalShow(false)}
            />
        </div>
    )
}
