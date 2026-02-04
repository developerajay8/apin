import axios from "axios";
import { product } from "../types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_PRODUCT_API;

export const getProducts = async (): Promise<product[]> => {
    try{
        const res = await axios.get<product[]>(`${API_BASE_URL}`);
        return res.data;
    } catch(error: any){
        console.error(error.message);
        throw new Error("Failed to fetch product");
        
    }
}

export const getProductById = async (id:number):Promise<product> => {
    try{
        const res = await axios.get<product>(`${API_BASE_URL}/${id}`);
        return res.data;
    } catch(error:any){
        console.error(error.message);
        throw new Error("Failed to fetch product");

    }
}








// import axios from "axios";
// import { product } from "../types/product";

// const API_BASE_URL = process.env.NEXT_PUBLIC_PRODUCT_API;

// export const getProducts = async (): Promise<product[]> => {
//     try{
//         const res = await axios.get<product[]>(`${API_BASE_URL}`);
//         return res.data;
//     } catch(error:any){
//         console.error(error.message);
//         throw new Error("Faled to fetch product");
        
//     }

// };


// export const getProductById = async (id:number):Promise<product> => {
//     try{
//         const res = await axios.get<product>(`${API_BASE_URL}/products/${id}`);
//         return res.data;
//     } catch(error:any){
//         console.error(error.message);
//         throw new Error("Faled to fetch product");

//     }
// };