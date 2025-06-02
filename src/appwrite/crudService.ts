import { appwrite } from './appwrite'
import { Query } from 'appwrite';
import { authService } from './authService';
// import { CropPost } from "@/app/dashboard-farmer/page"

const Db_Id = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const Collection_Crop_Id = process.env.NEXT_PUBLIC_APPWRITE_CROPS_COLLECTION_ID;
const Bucket_Id = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;
const Requests_Is = process.env.NEXT_PUBLIC_APPWRITE_REQUESTS_COLLECTION_ID;

export const crudService = {
    async uploadCropImage(file: File){
        try {
            return await appwrite.storage.createFile(Bucket_Id!,appwrite.ID.unique(),file)
        } catch (error: any) {
            console.log("Error in uploading image : ", error);
        }
    },

    async createCrop(data: {
       name: string,
       availability: number,
       price: number,
       state: string,
       city: string,
       imageId: string,
       userId: string,
    }){
        try {
            return appwrite.databases.createDocument(Db_Id!, Collection_Crop_Id!, appwrite.ID.unique(), data);
        } catch (error: any) {
            console.log("Error in creating a post : ",error);
        }
    },

    async getCrops(){
        try {

            const postData = await appwrite.databases.listDocuments(Db_Id!,Collection_Crop_Id!);

            const postWithImageUrl = await Promise.all(
                postData.documents.map(async (crop:any)=>(
                   {
                    ...crop,
                    imageUrl: appwrite.storage.getFileView(Bucket_Id!, crop.imageId).href
                   }
                ))
            );

            return postWithImageUrl;
                
        } catch (error:any) {
            console.log("Error in getting the crop posts : ",error);
        }
    },

    async getCropsByUser(userId? : string){
        try {

            const queries = userId ? [Query.equal('userId', userId)] : [];

            const cropsData = await appwrite.databases.listDocuments(Db_Id!, Collection_Crop_Id!, queries)

            const cropWithImageUrl = await Promise.all(
                cropsData.documents.map(async (crop:any)=>(
                    {
                        ...crop,
                        imageUrl: appwrite.storage.getFileView(Bucket_Id!,crop.imageId).href
                    }
                ))
            );
            
            return cropWithImageUrl

        } catch (error: any) {
            console.log("Error in getting the crop post : ",error);
            return[];
        }
    },
    
    async getCropById(postId: string){
        try {
            const post = await appwrite.databases.getDocument(Db_Id!,Collection_Crop_Id!,postId);

            const postImageUrl = appwrite.storage.getFileView(Bucket_Id!,post.imageId).href;

            return{
                ...post,
                postImageUrl
            }
        } catch (error:any) {
            console.log("Error in fetching the post : ",error);
            return null;
        }
    },
    
    async updateCrop(cropId: string, newData: any){
        try {
            const updatedPost = await appwrite.databases.updateDocument(Db_Id!, Collection_Crop_Id!, cropId, newData)

            return updatedPost;
        } catch (error: any) {
            console.log("Error in getting the crop post : ",error);
        }
    },
    
    async deleteCrops(cropId: string){
        try {
            return appwrite.databases.deleteDocument(Db_Id!, Collection_Crop_Id!,cropId)
        } catch (error: any) {
            console.log("Error in getting the crop post : ",error);
        }
    },
    
    async deleteCropImage(cropImageId: string){
        try {
            return appwrite.storage.deleteFile(Bucket_Id!, cropImageId)
        } catch (error: any) {
            console.log("Error in getting the crop post : ",error);
        } 
    },

    async getRequestsByUser(userId?: string){
      try {
          const querie = userId?[Query.or([Query.equal("customerId",userId), Query.equal("farmerId",userId)])]:[];

           const response = await appwrite.databases.listDocuments(Db_Id!,Requests_Is!,querie);
           return response;

        } catch (error: any) {
          console.log("Error in listing the requests : ",error);
           return { documents: [], total: 0 };
        } 
    },

    async deleteRequest(requestId: string){
        try {
            return appwrite.databases.deleteDocument(Db_Id!,Requests_Is!,requestId);
            
        } catch (error: any) {
            console.log("Error in deleting the request : ",error);
            
        }
    }

};
