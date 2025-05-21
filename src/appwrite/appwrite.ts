import { Client, Account, Databases, ID, Storage } from "appwrite";

const client = new Client();
const storage = new Storage(client);

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
// console.log(endpoint);
// console.log(projectId);


client
   .setEndpoint(endpoint!)
   .setProject(projectId!);

export const appwrite = {
    client,
    account: new Account(client),
    databases: new Databases(client),
    ID,
    storage,
}