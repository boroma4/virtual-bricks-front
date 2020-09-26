import React from "react";
import Navbar from "react-bootstrap/Navbar";
import img from './65b.jpg'
export default function Header() {

    return(
        <>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>
                    <img
                        alt=""
                        src={img}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    Virtual Bricks
                </Navbar.Brand>
            </Navbar>
        </>
    )
}
