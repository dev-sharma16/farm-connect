import { appwrite } from "./appwrite";

export const authService = {
    
    async createAccount(email: string, password: string, name: string,  role: string){
        try {
          const user = await appwrite.account.create(appwrite.ID.unique(), email, password, name);

          if(user){
               const logInUser = await appwrite.account.createEmailPasswordSession(email,password);

               if (logInUser) {
                    const currentUser = await appwrite.account.get();
                
                    const databaseID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
                    const userRoleCollectionID = process.env.NEXT_PUBLIC_APPWRITE_USER_ROLE_COLLECTION_ID;
          
                    console.log(databaseID);
                    console.log(userRoleCollectionID);  

                    await appwrite.databases.createDocument(
                      databaseID!,
                      userRoleCollectionID!,
                      appwrite.ID.unique(),
                      {
                        userId: currentUser.$id,
                        role: role,  
                      }
                    );
                    return true;
                }
            } else{
                return false;
            }

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