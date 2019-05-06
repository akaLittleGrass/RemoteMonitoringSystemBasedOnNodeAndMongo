import axios from "axios";

export default function(path, method, data){
    const url = 'http://localhost:3000' + path;
    if(method === 'GET'){
        return axios.get(url).then(function(response){
            return Promise.resolve(response);
        })
        .catch(function(error){
            console.log(error);
            return Promise.resolve(error);
        })
    }else if(method === 'POST'){
        return axios.post(url, data).then(function(response){
            console.log(response);
            return Promise.resolve(response);
        })
        .catch(function(error){
            console.log(error);
            return Promise.resolve(error);
        })
    }
}