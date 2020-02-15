import Request from "./Request";
import URI from "../config/Uri"

class Resource {
    async login(body){
        const header = {                      
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',  
        }
    
        console.log(JSON.stringify(body))
    
        let res = await Request.post(URI.API_BASE_URL + URI.LOGIN, header, body);
        
        return new Promise((resolve, reject) => {
          try{
            resolve(res)
          } catch (err) {
            reject("An error occurred")
          }
        });
    }

    async register(body){
        const header = {                      
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',  
        }
    
        console.log(JSON.stringify(body))
    
        let res = await Request.post(URI.API_BASE_URL + URI.REGISTER, header, body);
        
        return new Promise((resolve, reject) => {
          try{
            resolve(res)
          } catch (err) {
            reject("An error occurred")
          }
        });
    }

    async logout(body, headers){                
        const header = {                                  
            'Authorization': headers.token
        }
    
        console.log(JSON.stringify(body))
    
        let res = await Request.post(URI.API_BASE_URL + URI.LOGOUT, header, body);
        
        return new Promise((resolve, reject) => {
          try{
            resolve(res)
          } catch (err) {
            reject("An error occurred")
          }
        });
    }
}

export default new Resource();