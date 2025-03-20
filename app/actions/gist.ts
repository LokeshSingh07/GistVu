"use server"
import prisma from "../db/index"



interface Gist {
    gistId?: string,
    title: string;
    code: string;
    language?: string;
    userId?: string;
    visibility?: string;
}

export async function createGist({title, code, language, userId}: Gist){
    try{
        await prisma.gist.create({
            data: {
                title,
                code,
                language: language || "cpp",
                userId: userId || "afdfcd45-e845-4a86-affd-def1d423ad1e",
                visibility: "PUBLIC"
            }
        })

        return { 
            success: true, 
            message: "Gist created",
        };
    }
    catch(err){
        return {
            success: false, 
            error: "Something went wrong. Please try again later." 
        }
    }
}

export async function updateGist({gistId, title, code, language, userId}: Gist){
    try{
        const updatedGistDetails = await prisma.gist.update({
            where: {id: gistId},
            data:{
                title,
                code,
                language,
                userId,
                visibility: "PUBLIC"
            }
        })

        return {
            success: true, 
            message: "Gist updated", 
            gist: updatedGistDetails
        }
    }
    catch(err){
        return {
            success:  false,
            error: "Something went wrong. Please try again later." 
        }
    }
}

export async function deleteGist({gistId}: {gistId: string}){
    try{
        const gistDetails = await prisma.gist.delete({
            where: {
                id: gistId
            }
        })

        if(!gistDetails) {
            return { 
                success: false, 
                message: "Gist not found" 
            }
        }

        return {
            success: true,
            message: "Gist deleted",
        }
    }
    catch (err){
        return { 
            success: false, 
            message: "Something went wrong. Please try again later."
        }
    }
}

export async function getSingleGist({gistId}: {gistId: string}){
    try{
        const gistDetails = await prisma.gist.findFirst({
            where:{
                id: gistId
            }
        })

        if (!gistDetails) {
            return {
                success: false, 
                status: 404,
                error: "Gist not found",
            }
        }
        
        return { 
            success: true, 
            message: "Single Gist fetched", 
            gist: gistDetails 
        }
    }
    catch (err){
        return { 
            success: false, 
            error: "Something went wrong. Please try again later."
        }
    }
}

export async function getAllGist(){
    try{
        const gists = await prisma.gist.findMany({});

        return { 
            success: true, 
            message: "All Gist fetched", 
            gists 
        };
    }
    catch (err){
        return { 
            success: false, 
            error: "Something went wrong. Please try again later."
        }
    }
}

