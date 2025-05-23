import { appwrite } from './appwrite'
import { Query } from 'appwrite';
// import { CropPost } from "@/app/dashboard-farmer/page"

const Db_Id = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const Collection_Crop_Id = process.env.NEXT_PUBLIC_APPWRITE_CROPS_COLLECTION_ID;
const Bucket_Id = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

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

    // TODO: implement funtion for all post loading for consumer on homepage
    async getCrops(){},

    async deleteCrops(cropId: string){
        try {
            return appwrite.databases.deleteDocument(Db_Id!, Collection_Crop_Id!,cropId)
        } catch (error: any) {
            console.log("Error in getting the crop post : ",error);
        }
    },
    
    async updateCrop(cropId: string, newData: any){
        try {
            return appwrite.databases.updateDocument(Db_Id!, Collection_Crop_Id!, cropId, newData)
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
    }

}
