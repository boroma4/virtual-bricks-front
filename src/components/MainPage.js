import React, {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useHistory, withRouter} from "react-router-dom";
import {BackendService} from "../service/BackendService";
import {reactLocalStorage} from 'reactjs-localstorage';

function MainPage(){
    const history = useHistory();
    const [pin,setPin] = useState("");
    const [password, setPassword] = useState('');

    const  deAsyncGetProjects = async (func,arg) => {
        let result = await func(arg);
        return result.data;
    };

    const onClick = async (e) =>{
        const serviceCall = new BackendService();
        const project = await deAsyncGetProjects(serviceCall.getProject, pin);
        const{customerPassword, organizationPassword} = project;
        if(password === customerPassword){
            reactLocalStorage.set('isOrg', false);
            history.push("/project/"+pin);
        }else if (password === organizationPassword){
            reactLocalStorage.set('isOrg', true);
            history.push("/project/"+pin);
        }else{
            alert('Wrong PIN code or password');
        }
    };


    useEffect(()=>{
        let canvas = document.querySelector('canvas');
        if(canvas){
            document.body.removeChild(canvas);
        }
    }, []);

    return(
        <Form style={{marginTop:'20%', height:'80vh'}}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Project PIN</Form.Label>
                <Form.Control placeholder="Enter project id" onChange={(e)=>{setPin(e.target.value)}}/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password"  onChange={(e)=>{setPassword(e.target.value)}}/>
            </Form.Group>
            <Button variant="primary" onClick={onClick}>
                Go
            </Button>
        </Form>
    )
}

export default withRouter(MainPage);
