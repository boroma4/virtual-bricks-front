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

    const loadComments = async () => {
        let backendCall = new BackendService();
        let response = await  backendCall.getComments(modelId);
        setComments(response.data);
    };

    const loadThread = async (commentId) => {
        let backendCall = new BackendService();
        let response = await  backendCall.getThread(commentId);
        setThread(response.data);
        setThreadShown(true);
    };

    const unloadThread = async () => {
        setThreadShown(false);
        setThread(undefined);
    };

    useEffect(() => {
        if (!comments){
            loadComments();
        }
    },[comments,modelId]);

    // useEffect(() => {
    //     if (thread){
    //         setThreadShown(true);
    //     }
    // },[thread]);

    const displayMessageRows = (comments) => {
        return (
            <div>
                <table>
                    <tbody>
                    {comments?.map((comment,idx)=>{
                        return (
                            <h3>
                                <tr key={idx}>
                                    <td style={marginStyle}>
                                        {comment.commentHeader}
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

                                    {threadShown? (<td style={marginStyle}>
                                            <button onClick={()=>{unloadThread()}}> Close thread</button>
                                        </td>)
                                        :
                                        (<td style={marginStyle}>
                                            <button onClick={()=>{loadThread(comment.commentId)}}> View thread</button>
                                        </td>)
                                    }
                                </tr>
                            </h3>
                        )
                    })}
                    </tbody>
                </table>
                {threadShown? (<Thread isShown={threadShown} thread={thread} />): (<></>)}

            </div>)
    };

    return (
        <div>
            {displayMessageRows(comments)}
        </div>);
};

const Thread = ({isShown,thread}) => {
      if (isShown){
          return (
              <table>
                  ***
              <tbody>
              {thread?.map((comment,idx)=>{
                  return (
                      <h4>
                          <tr key={idx}>
                              <td style={marginStyle}>
                                  {comment.commentAuthor}
                              </td>
                              <td style={marginStyle}>
                                  {comment.commentText}
                              </td>
                          </tr>
                      </h4>
                  )
              })}
              </tbody>
                  ***
          </table>);
      }else{
          return (<></>);
      }
};

export default CommentPage;