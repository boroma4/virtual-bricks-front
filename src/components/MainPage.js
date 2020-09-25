import React, {useEffect} from "react";
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";

export default function MainPage(){
    const history = useHistory();

    const onClick = (e) =>{
        // if authenticated, get Data for all models (e.g name,
        history.push("/project");
    };


    useEffect(()=>{
        let canvas = document.querySelector('canvas');
        if(canvas){
            document.body.removeChild(canvas);
        }
    });


    return(
        <Form>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Project Id</Form.Label>
                <Form.Control placeholder="Enter project id" />
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
