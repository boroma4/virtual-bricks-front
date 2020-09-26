import axios from 'axios';

export class BackendService{

    async createProject(projectDTO){

        try {
            const req = await fetch('https://localhost:5001/api/project/create', {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectDTO) // body data type must match "Content-Type" header
            });
            return req.status === 200;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    async getProject(pin){
        try {
            console.log("Im here");
            return await axios.get('https://localhost:5001/api/project/' + pin);
        }
        catch (e) {
            return '';
        }
    }

    async getModels(projectId){
        try {
            return await axios.get('https://localhost:5001/api/project/models/' + projectId);
        }
        catch (e) {
            return '';
        }
    }

    async addCommentToModel(dto){
        try {
            const req = await fetch('https://localhost:5001/api/comment/savecomment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dto) // body data type must match "Content-Type" header
            });
            return req.status === 200;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
}
