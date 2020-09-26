import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {BackendService} from "../service/BackendService";
import {useHistory} from 'react-router-dom';

export default function () {

    const [estonianId, setEstonianId] = useState();
    const [customerName, setCustomerName] = useState();
    const [organizationName, setOrganizationName] = useState();
    const [customerPassword, setCustomerPassword] = useState();
    const [organizationPassword, setOrganizationPassword] = useState();
    const [projectName, setProjectName] = useState();
    const [pinCode, setPinCode] = useState();


    const backendService = new BackendService();
    const history = useHistory();

    const onSubmit = async (e) =>{
        // validate
        const dto ={estonianId, customerName,
            organizationName, customerPassword, organizationPassword, projectName, pinCode};
        const result = await backendService.createProject(dto);
        if(result){
            // set active project in state
            console.log(result);
            history.push('/project/'+result.pinCode);
        }else{
            console.log('request failed');
        }
    };

    return (
        <Form style={{width:'100%'}}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Estonian ID</Form.Label>
                <Form.Control placeholder="Enter EHR id" onChange={(e)=>setEstonianId(e.target.value)} required="true"/>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Customer name</Form.Label>
                <Form.Control placeholder="Enter your cst name" onChange={(e)=>setCustomerName(e.target.value)} required="true"/>
            </Form.Group>
            <Form.Group controlId="formLocation">
                <Form.Label>Organization name</Form.Label>
                <Form.Control placeholder="Enter your org name" onChange={(e)=>setOrganizationName(e.target.value)} required="true"/>
            </Form.Group>
            <Form.Group controlId="formName">
                <Form.Label>Organization Password</Form.Label>
                <Form.Control placeholder="Create org password" onChange={(e)=>setOrganizationPassword(e.target.value)} required={"true"}/>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Customer password</Form.Label>
                <Form.Control placeholder="Create a password for cst" onChange={(e)=>setCustomerPassword(e.target.value)} required="true"/>
            </Form.Group>
            <Form.Group controlId="formLocation">
                <Form.Label>Project name</Form.Label>
                <Form.Control placeholder="Name your project" onChange={(e)=>setProjectName(e.target.value)} required="true"/>
            </Form.Group>
            <Form.Group controlId="formName">
                <Form.Label>Pin code</Form.Label>
                <Form.Control placeholder="Enter pin for your project" onChange={(e)=>setPinCode(e.target.value)} required={"true"}/>
            </Form.Group>
            <Button variant="primary" onClick={onSubmit}>
                Submit
            </Button>
        </Form>
    );
}
