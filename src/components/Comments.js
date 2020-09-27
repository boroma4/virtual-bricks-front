import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {BackendService} from "../service/BackendService";
import Button from "react-bootstrap/Button";

const marginStyle = {
    margin:15
};

const CommentPage = () => {
    let {modelId} = useParams();
    const[comments,setComments] = useState(undefined);
    const[thread,setThread] = useState(undefined);
    const [threadShown,setThreadShown] = useState(false);
    const[currentParent,setCurrentParent] = useState(undefined);

    const loadComments = async () => {
        let backendCall = new BackendService();
        let response = await  backendCall.getComments(modelId);
        setComments(response.data);
    };

    const loadThread = async (comment) => {
        let backendCall = new BackendService();
        let response = await  backendCall.getThread(comment.commentId);
        setThread(response.data);
        setThreadShown(true);
        setCurrentParent(comment);
    };

    const unloadThread = async () => {
        setThreadShown(false);
        setThread(undefined);
        setCurrentParent(undefined);
    };

    useEffect(()=>{},[thread]);

    useEffect(() => {
        if (!comments){
            loadComments();
        }
    },[comments,modelId]);


    const displayMessageRows = (comments) => {
        return (
            <div className='w-100 h-100'>
                <table>
                    <tbody>
                    {comments?.map((comment,idx)=>{
                        return (

                                <tr key={idx}>
                                    <td style={marginStyle}>
                                        <h3 style={{fontStyle:'italic'}}>{comment.commentHeader}</h3>
                                        <p>{comment.commentText}</p>
                                    </td>
                                    <td style={{...marginStyle, width:'7%'}}/>
                                    <td style={marginStyle}>
                                        <h6>{'Location: ' + comment.locationName} </h6>
                                        <p>{'By: ' + comment.commentAuthor}</p>
                                    </td>
                                    <td style={{...marginStyle, width:'7%'}}/>
                                    {threadShown && currentParent?.commentId === comment.commentId? (<td style={marginStyle}>
                                            <Button variant={'info'} onClick={()=>{unloadThread()}}> Close thread</Button>
                                        </td>)
                                        :
                                        (<td style={marginStyle}>
                                            <Button variant={'secondary'} onClick={()=>{loadThread(comment)}}> View thread</Button>
                                        </td>)
                                    }
                                </tr>
                        )
                    })}
                    </tbody>
                </table>
                {threadShown && thread ? (<Thread isShown={threadShown} thread={thread} setThread={setThread} parent={currentParent}/>): (<></>)}

            </div>)
    };

    return (
        <div className='w-100'  style={{height:'100vh'}}>
            {displayMessageRows(comments)}
        </div>);
};

const Thread = ({isShown,thread, setThread, parent}) => {

    const[input, setInput] = useState("");
    const[author, setAuthor] = useState("");

    if (!thread){
        return <></>;
    }

    const onAuthorChange = (e) => {
        let newAutor = e.target.value;
        setAuthor(newAutor);
    };

    const onInputChange = (e) => {
          let newInput = e.target.value;
          setInput(newInput);
    };

    const addComment = async () => {
        const serviceCall = new BackendService();
        let newComment = await serviceCall.addChildComment({
            "commentText": input ,
            "modelId": parent.modelId ,
            "parentId": parent.commentId,
            "commentHeader": parent.commentHeader,
            "commentAuthor": author,
            "locationName": parent.locationName,
            "commentCoordinates": parent.commentCoordinates
        });

        setThread((prev)=>{
            let lst = [...prev];
            lst.push(newComment.data);
            return lst;
        });

    };

      if (isShown){
          return (
              <div>
                  *************
                  <table>
                      <tbody>
                      {thread?.map((comment,idx)=>{
                          return (

                                  <tr key={idx}>
                                      <td style={marginStyle}>
                                          <h4 >{comment.commentAuthor}</h4>
                                      </td>
                                      <td style={marginStyle}>
                                          {'  ->  ' + comment.commentText}
                                      </td>
                                  </tr>
                          )
                      })}
                      </tbody>

                  </table>
                  *************
                  <div>
                      <input style={{marginLeft:'5px'}} onChange={(e) => onInputChange(e)} value={input} placeholder="Your reply..."/>
                      <input style={{marginLeft:'5px'}} onChange={(e) => onAuthorChange(e)} value={author} placeholder="Author"/>
                      <Button style={{marginLeft:'5px'}} onClick={()=>{addComment()}}>Add comment</Button>
                  </div>

              </div>
              );
      }else{
          return (<></>);
      }
};

export default CommentPage;
