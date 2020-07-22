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

    async register(body, otp, data){
        const header = {                      
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',  
            'otp' : otp,
            'token': data
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

    async user(token){      
      const header = {
        'Accept': 'application/json',
        "Authorization": token,        
      }
        
      let res = await Request.get(URI.API_BASE_URL + URI.USER , header);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res.data)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async edit_profile(body, headers){
      const header = {                      
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': headers.token
      }
  
      console.log(JSON.stringify(body))
  
      let res = await Request.put(URI.API_BASE_URL + URI.USER, header, body);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async edit_pass(body, headers){
      const header = {                      
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': headers.token
      }
  
      console.log(JSON.stringify(body))
  
      let res = await Request.put(URI.API_BASE_URL + URI.CHANGE_PASS, header, body);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async push_notif(body, token){
      const header = {                      
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': token
      }
  
      console.log(JSON.stringify(body))
  
      let res = await Request.post(URI.API_BASE_URL + URI.PUSHNOTIF, header, body);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async save_notif(body, token){
      const header = {                      
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': token
      }
  
      console.log(JSON.stringify(body))
  
      let res = await Request.post(URI.API_BASE_URL + URI.SAVENOTIF, header, body);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async edit_info(body, headers, id_info){
      const header = {                      
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': headers.token
      }
  
      console.log(JSON.stringify(body))
  
      let res = await Request.put(URI.API_BASE_URL + URI.EDIT_INFO + id_info, header, body);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async create_info(body, headers){
      const header = {                      
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': headers.token
      }
  
      console.log(JSON.stringify(body))
  
      let res = await Request.post(URI.API_BASE_URL + URI.CREATE_INFO, header, body);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async delete_info(headers, id){      
      const header = {
        "Authorization": headers.token,
        "Content-Type": "application/json",
      }
  
      let res = await Request.delete(URI.API_BASE_URL + URI.DELETE_INFO + id, header);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res.data)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async edit_panduan(body, headers, id){
      const header = {                      
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': headers.token
      }
  
      console.log(JSON.stringify(body))
  
      let res = await Request.put(URI.API_BASE_URL + URI.EDIT_PANDUAN + id, header, body);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res)
        } catch (err) { 
          reject("An error occurred")
        }
      });
    }

    async create_panduan(body, headers){
      const header = {                      
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': headers.token
      }
  
      console.log(JSON.stringify(body))
  
      let res = await Request.post(URI.API_BASE_URL + URI.CREATE_PANDUAN, header, body);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async delete_panduan(headers, id){      
      const header = {
        "Authorization": headers.token,
        "Content-Type": "application/json",
      }
  
      let res = await Request.delete(URI.API_BASE_URL + URI.DELETE_PANDUAN + id, header);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res.data)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async edit_jadwal(body, headers, id){
      const header = {                      
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': headers.token
      }
  
      console.log(JSON.stringify(body))
  
      let res = await Request.put(URI.API_BASE_URL + URI.EDIT_JADWAL + id, header, body);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res)
        } catch (err) { 
          reject("An error occurred")
        }
      });
    }

    async verify(body){
      const header = {                      
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',  
      }
  
      console.log(JSON.stringify(body))
  
      let res = await Request.post(URI.API_BASE_URL + URI.VERIFY, header, body);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async forgot(token, otp, body, devices){
      const header = {                      
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',  
          'token': token,
          'otp': otp,
          'deviceID' : devices
      }
  
      console.log(JSON.stringify(body))
  
      let res = await Request.post(URI.API_BASE_URL + URI.FORGOT, header, body);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async listSensor(){      
      const header = {
        'Accept': 'application/json',        
      }
        
      let res = await Request.get(URI.API_BASE_URL + URI.SENSOR , header);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res.data)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async edit_sensor(body, headers, id){
      const header = {                      
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',     
          'Authorization': headers.token
      }
  
      console.log(JSON.stringify(body))
  
      let res = await Request.put(URI.API_BASE_URL + URI.EDIT_SENSOR + id, header, body);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res)
        } catch (err) { 
          reject("An error occurred")
        }
      });
    }

    async listGuideline(token){      
      const header = {
        'Accept': 'application/json',
        'Authorization': token  
      }
        
      let res = await Request.get(URI.API_BASE_URL + URI.GUIDELINE , header);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res.data)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }

    async edit_guideline(body, headers, id){
      const header = {                      
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',     
          'Authorization': headers.token
      }
  
      console.log(JSON.stringify(body))
  
      let res = await Request.put(URI.API_BASE_URL + URI.EDITGUIDELINE + id, header, body);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res)
        } catch (err) { 
          reject("An error occurred")
        }
      });
    }

    async tambah_guideline(body, headers){
      const header = {                      
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',     
          'Authorization': headers.token
      }
  
      console.log(JSON.stringify(body))
  
      let res = await Request.post(URI.API_BASE_URL + URI.TAMBAHGUIDELINE, header, body);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res)
        } catch (err) { 
          reject("An error occurred")
        }
      });
    }

    async save_monitor(body){
      const header = {                      
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',               
      }
  
      console.log(JSON.stringify(body))
  
      let res = await Request.post(URI.API_BASE_URL + URI.SAVE_MONITOR, header, body);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res)
        } catch (err) { 
          reject("An error occurred")
        }
      });
    }

    async get_now(token){      
      const header = {
        'Accept': 'application/json',
        'Authorization': token  
      }
        
      let res = await Request.get(URI.API_BASE_URL + URI.GET_NOW , header);
      
      return new Promise((resolve, reject) => {
        try{
          resolve(res.data)
        } catch (err) {
          reject("An error occurred")
        }
      });
    }
}

export default new Resource();