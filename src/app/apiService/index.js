import axios from "axios"
import { apiConstants } from "../utils/apiConstants"
import { v4 as uuidv4 } from 'uuid';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const dashboardApi = axios.create({
    baseURL: API_URL,
    timeout: 20000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export const signIn = () => {
    return uuidv4()
} 

export const getPosts = async(params = null) => {
    try {
        const res = await dashboardApi.get(apiConstants.GETPOSTDATA + '?' + params)
        return res.data
    } catch (error) {
        throw error
    }
}