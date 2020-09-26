import React, {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useHistory, withRouter} from "react-router-dom";

function MainPage(){
    const history = useHistory();
    const [pin,setPin] = useState("");

    const onClick = (e) =>{
        // if authenticated, get Data for all models (e.g name,
        history.push("/project/"+pin);
    };


    useEffect(()=>{
        let canvas = document.querySelector('canvas');
        if(canvas){
            document.body.removeChild(canvas);
        }
    }, []);

    return(
        <Form>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Project PIN</Form.Label>
                <Form.Control placeholder="Enter project id" onChange={(e)=>{setPin(e.target.value)}}/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="primary" onClick={onClick}>
                Go
            </Button>
        </Form>
    )
}

export default withRouter(MainPage);