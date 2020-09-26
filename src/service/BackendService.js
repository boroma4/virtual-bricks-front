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

    async uploadModel(file, modelName, projectId){
        let formData = new FormData();
        formData.append('data', file);
        formData.append('projectId', projectId);
        formData.append('modelName', modelName);

        try {
            const model = await axios.post(
                'https://localhost:5001/api/file/upload',
                formData,
                {
                    headers: {
                        "Content-type": "multipart/form-data",
                    },
                }
            );
            console.log(model);
            return await model.data;
        }
        catch(e){
            return null;
        }
    }

    async uploadExtraFile(modelId, file){
        let formData = new FormData();
        formData.append('data', file);
        formData.append('modelId', modelId);

        try {
            const model = await axios.post(
                'https://localhost:5001/api/file/uploadextra',
                formData,
                {
                    headers: {
                        "Content-type": "multipart/form-data",
                    },
                }
            );
            console.log(model);
            return await model.data;
        }
        catch(e){
            return null;
        }
    }

    async getParentComments(modelId){
        try{
            const comments = await axios.get(`https://localhost:5001/api/comment/${modelId}/comments`);
            return comments
        }
        catch (e) {
            return null;
        }
    }

    async getFile(modelCode){
        try {
            const file = await axios.get('https://localhost:5001/api/file/download?modelCode='+modelCode);
            return file;
        }
        catch (e) {
            return null;
        }
    }

    async getFile2(modelCode){
        try {
            const file = await axios.get('https://localhost:5001/api/file/download2?modelCode='+modelCode);
            return file;
        }
        catch (e) {
            return null;
        }
    }
}
