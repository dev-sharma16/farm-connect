import { Query } from "appwrite";
import { appwrite } from "./appwrite";

export const authService = {
    
    async createAccount(email: string, password: string, name: string,  userRole: string){
        try {
          const user = await appwrite.account.create(appwrite.ID.unique(), email, password, name);

          if(user){
               const logInUser = await appwrite.account.createEmailPasswordSession(email,password);

               if (logInUser) {
                    const currentUser = await appwrite.account.get();
                
                    const databaseID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
                    const userRoleCollectionID = process.env.NEXT_PUBLIC_APPWRITE_USER_ROLE_COLLECTION_ID;
          
                    // console.log(databaseID);
                    // console.log(userRoleCollectionID);  

                    await appwrite.databases.createDocument(
                      databaseID!,
                      userRoleCollectionID!,
                      appwrite.ID.unique(),
                      {
                        userId: currentUser.$id,
                        role: userRole,  
                      }
                    );
                    return {user, userRole};
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
          const session  = await appwrite.account.createEmailPasswordSession(email,password);

          const user = await appwrite.account.get();
          const userId = user.$id  

          const databaseID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
          const userRoleCollectionID = process.env.NEXT_PUBLIC_APPWRITE_USER_ROLE_COLLECTION_ID  

          const result = await appwrite.databases.listDocuments(
              databaseID!,
              userRoleCollectionID!,
              [Query.equal("userId",userId)]!
            );
          
          const userRole = result.documents[0]?.role;
          console.log(userRole);
          if (!userRole) {
              throw new Error("User role not found");
          }
          
          return { user, userRole };
           
        } catch (error : any) {
            console.log("Error in login :" ,error);
        }
    },

    async getCurrentUser(){
        try {
            return await appwrite.account.get()
        } catch (error : any) {
            console.log("Error in geting the user :" ,error);
        }
    },   

    async loadCurrentuser(){
        try {
           const user = await appwrite.account.get();

           const databaseID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
           const userRoleCollectionID = process.env.NEXT_PUBLIC_APPWRITE_USER_ROLE_COLLECTION_ID  

           const response = await appwrite.databases.listDocuments(
            databaseID!,
            userRoleCollectionID!,
            [Query.equal("userId", user.$id)]
           )
           
           const userRole = response.documents[0]?.role || "guest";

           return {user, userRole};

        } catch (error: any) {
            console.log("Error in loading the user :", error);
        }
    },

    async logout(){
        return appwrite.account.deleteSession('current')
    }
}