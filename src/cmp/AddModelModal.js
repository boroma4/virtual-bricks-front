import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {BackendService} from "../service/BackendService";

export default function (props) {

    const [name, setName] = useState();
    const[file, setFile] = useState();
    const[file2, setFile2] = useState();

    const onSubmit = async (e) =>{
        const backendService = new BackendService();
        let model_half = await backendService.uploadModel(file, name, props.project.projectId);
        const model = await backendService.uploadExtraFile(model_half.modelId, file2);
        if(model){
            props.setModels(prev=>{
                if(prev){
                    return [...prev, model]
                }else{
                    return [model]
                }
            });
            setName(undefined);
            setFile(undefined);
            props.onHide();
        }
    };


    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add a model
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formName">
                        <Form.Label>Model Name</Form.Label>
                        <Form.Control placeholder="Enter project name" onChange={(e)=>setName(e.target.value)} required={"true"}/>
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <Form.Label>.obj model</Form.Label>
                        <Form.Control placeholder="Select 3D model" type={'file'} onChange={(e)=>setFile(e.target.files[0])} required={"true"}/>
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <Form.Label>.mtl file</Form.Label>
                        <Form.Control placeholder="Select .mtl material file" type={'file'} onChange={(e)=>setFile2(e.target.files[0])} required={"true"}/>
                    </Form.Group>
                    <Button variant="primary" onClick={onSubmit}>
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
