import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {BackendService} from "../service/BackendService";

const marginStyle = {
    margin:10
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
            <div>
                <table>
                    <tbody>
                    {comments?.map((comment,idx)=>{
                        return (

                                <tr key={idx}>
                                    <td style={marginStyle}>
                                        <h3>{comment.commentHeader}</h3>
                                    </td>
                                    <td style={marginStyle}>
                                        {comment.commentAuthor}
                                    </td>
                                    <td style={marginStyle}>
                                        {comment.locationName}
                                    </td>
                                    <td style={marginStyle}>
                                        {comment.commentText}
                                    </td>

                                    {threadShown && currentParent?.commentId === comment.commentId? (<td style={marginStyle}>
                                            <button onClick={()=>{unloadThread()}}> Close thread</button>
                                        </td>)
                                        :
                                        (<td style={marginStyle}>
                                            <button onClick={()=>{loadThread(comment)}}> View thread</button>
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
        <div>
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
                  ***
                  <table>
                      <tbody>
                      {thread?.map((comment,idx)=>{
                          return (

                                  <tr key={idx}>
                                      <td style={marginStyle}>
                                          {comment.commentText}
                                      </td>
                                      <td style={marginStyle}>
                                          <h4 >{comment.commentAuthor}</h4>
                                      </td>
                                  </tr>
                          )
                      })}
                      </tbody>

                  </table>
                  ***
                  <div>

                      <input onChange={(e) => onInputChange(e)} value={input} placeholder="Your reply..."/>
                      <input onChange={(e) => onAuthorChange(e)} value={author} placeholder="Author"/>
                      <button onClick={()=>{addComment()}}>Add comment</button>
                  </div>

              </div>
              );
      }else{
          return (<></>);
      }
};

export default CommentPage;