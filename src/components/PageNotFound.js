import React, {useEffect} from "react";

export default function PageNotFound(){

    useEffect(()=>{
        let canvas = document.querySelector('canvas');
        if(canvas){
            document.body.removeChild(canvas);
        }
    }, []);
    
    return(
        <div>
            Page Not Found!
        </div>
    )
}
