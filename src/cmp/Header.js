import React from "react";
import Navbar from "react-bootstrap/Navbar";
import img from './65b.jpg'
import Form from'react-bootstrap/Form'
import Button from "react-bootstrap/Button";
import {useHistory} from 'react-router-dom'

export default function Header() {
    const history = useHistory();

    return(
        <>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand onClick={()=>history.push('/')}>
                    <img
                        alt=""
                        src={img}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    Virtual Bricks
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Form inline >
                        <Button variant={'secondary'} onClick={()=>history.push('/create')}>Create project</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}
