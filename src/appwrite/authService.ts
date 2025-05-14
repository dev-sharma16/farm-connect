import { create } from "domain";
import { appwrite } from "./appwrite";

export const authService = {
    async createAccount(email: string, password: string, name: string){
        try {
          return appwrite.account.create(appwrite.ID.unique(), email, password, name)
        } catch (error : any) {
            console.log("Error in creating an account :" ,error);
        }
    },

        async login(email: string, password: string){
        try{
          return appwrite.account.createEmailPasswordSession(email,password)
        } catch (error : any) {
            console.log("Error in  :" ,error);
        }
    },

    async getCurrentUser(){
        try {
            return await appwrite.account.get()
        } catch (error : any) {
            console.log("Error in geting the user :" ,error);
        }
    },   

    async logout(){
        return appwrite.account.deleteSession('current')
    }
}