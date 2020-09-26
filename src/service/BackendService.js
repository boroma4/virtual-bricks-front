export class BackendService{

    async createProject(projectDTO){

        try {
            await fetch('https://localhost:5001/api/project/create', {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                body: JSON.stringify(projectDTO) // body data type must match "Content-Type" header
            });
            return true;
        }
        catch (e) {
            return false;
        }
    }

    async getProject(pin){
        try {
            const res = await fetch('https://localhost:5001/api/project/' + pin);
            return res.json();
        }
        catch (e) {
            return '';
        }
    }
}
