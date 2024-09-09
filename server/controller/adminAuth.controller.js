import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma=new PrismaClient();

export const signinAdm=async(req,res)=> {
    try {
        const {username,password}=req.body;
        const hashedPassword=await bcrypt.hash(password,10);

        const admin=await prisma.admin.create({
            username,
            password:hashedPassword,
        });
        res.json({
            admin,
            msg:"admin created succesfully"
        });
    } catch (error) {
        res.status(400).json({error:error.message});
    }
}

