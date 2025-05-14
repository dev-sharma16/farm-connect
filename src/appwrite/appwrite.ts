import { Client, Account, Databases, ID } from "appwrite";

const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

client
   .setEndpoint(endpoint!)
   .setProject(projectId!);

export const appwrite = {
    client,
    account: new Account(client),
    databases: new Databases(client),
    ID,
}