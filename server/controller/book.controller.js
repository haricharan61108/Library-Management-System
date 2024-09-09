import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma=new PrismaClient();

export const bookBook=async(req,res)=> {
  const {user_id,book_id}=req.body;

  try {
    const book=await prisma.book.findUnique({
        where: {
            book_id
        }
    });

    if(book && book.copies_available>0) {
        const borrowedBook=await prisma.borrowedBook.create({
            data: {
                user_id,
                book_id,
                borrow_date:new Date(),
                due_date:new Date(date.now()+14*24*60*60*1000)
            }
        })
        await prisma.book.update({
            where:{book_id},
            data: {
                copies_available:book.copies_available-1
            }
        });
        res.status(200).json({msg:"book borrowed succesfully",borrowedBook})
    }
    else {
        res.status(200).json({error:"book is not available"});
    }
  } catch (error) {
    res.status(400).json({error:"Error during booking"})
  }
}
 
export const addBooks=async(req,res)=> {
    const {title,author,copies_available,total_copies,added_date}=req.body;

    try {
        if(!title || !author || !copies_available || !total_copies || !added_date) {
            return res.status(400).json({error:"all fields are required"});
        }

        const newBook=await prisma.book.create({
            data: {
                title,
                author,
                copies_available,
                total_copies,
                added_date:new Date(added_date),
            },
        });
        res.status(201).json(newBook);
    } catch (error) {
        console.error('error while adding book: ',error);
        res.status(500).json({error:"Failed to add the Book"})
    }
}