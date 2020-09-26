import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function (props) {

    const [title, setTitle] = useState();
    const [name, setName] = useState();
    const [location, setLocation] = useState();
    const [body, setBody] = useState();

    const onSubmit = (e) =>{
        // validate
        props.setComment(prev=>{
            return {body:[`t:${title}`,`c:${body}`,`by:${name}`,`at:${location}`].join('\n'), event:prev.event}
        });
        setTitle(undefined);
        setName(undefined);
        setBody(undefined);
        setLocation(undefined);

        props.onHide();
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
                    Add a comment
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Title</Form.Label>
                        <Form.Control placeholder="Enter title" onChange={(e)=>setTitle(e.target.value)} required="true"/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Location</Form.Label>
                        <Form.Control placeholder="Describe the location you clicked at" onChange={(e)=>setLocation(e.target.value)} required="true"/>
                    </Form.Group>
                    <Form.Group controlId="formLocation">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control placeholder="Describe your thoughts" onChange={(e)=>setBody(e.target.value)} required="true"/>
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control value={''} placeholder="Enter name" onChange={(e)=>setName(e.target.value)} required={"true"}/>
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
