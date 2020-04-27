import Request from "./Request";
import URI from "../config/Uri"

class Resource {
    async login(body, deviceID){
        const header = {                      
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',  
            'deviceID' : deviceID
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

    async logout(body, headers, deviceID){                
        const header = {                                  
            'Authorization': headers.token,
            'deviceID' : deviceID
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

    async tambah_tambak(body, headers){
      const header = {                      
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': headers.token
      }
  
      console.log(JSON.stringify(body))
  
      let res = await Request.post(URI.API_BASE_URL + URI.TAMBAH_TAMBAK, header, body);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async getTambak(token){
      const header = {
        "Authorization": token,
        "Content-Type": "application/json",
      }
  
      let res = await Request.get(URI.API_BASE_URL + URI.GET_TAMBAK, header);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res.data)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async postTambak(list, token){
      // console.warn(token)
      const header = {
        "Authorization": token,
        "Content-Type": "application/json",
      }
  
      let res = await Request.get(URI.API_BASE_URL + URI.LIST_TAMBAK + list, header);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res.data)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async detailTambak(list, token){      
      const header = {
        "Authorization": token,
        "Content-Type": "application/json",
      }
  
      let res = await Request.get(URI.API_BASE_URL + URI.DETAIL_TAMBAK + list, header);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res.data)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async getNotif(token, tambakId, type){      
      const header = {
        "Authorization": token,
        "Content-Type": "application/json",
      }
  
      let res = await Request.get(URI.API_BASE_URL + URI.NOTIF + tambakId + '/' + type, header);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res.data)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async detailNotif(token, notifID){      
      const header = {
        "Authorization": token,
        "Content-Type": "application/json",
      }
  
      let res = await Request.get(URI.API_BASE_URL + URI.DETAIL_NOTIF + notifID , header);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res.data)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async information(token){      
      const header = {
        "Authorization": token,
        "Content-Type": "application/json",
      }
        
      let res = await Request.get(URI.API_BASE_URL + URI.INFO , header);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res.data)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async panduan(token){      
      const header = {
        "Authorization": token,
        "Content-Type": "application/json",
      }
  
      let res = await Request.get(URI.API_BASE_URL + URI.PANDUAN , header);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res.data)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }    

    async monitor(token, id, tanggal){      
      const header = {
        'Accept': 'application/json',
        "Authorization": token,
        'Content-Type': 'multipart/form-data',
      }
        
      let res = await Request.get(URI.API_BASE_URL + URI.MONITOR + id + '/' + tanggal, header);     
      // console.warn(URI.API_BASE_URL + URI.MONITOR + id + '/' + tanggal)   
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res.data)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async edit_tambak(body, headers, id){
      const header = {                      
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': headers.token
      }
  
      console.log(JSON.stringify(body))
  
      let res = await Request.put(URI.API_BASE_URL + URI.EDIT_TAMBAK + id, header, body);
      
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