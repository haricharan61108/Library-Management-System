import express from "express";
import { addBooks } from "../controller/book.controller.js";


const router=express.Router();
router.post("/addBooks",addBooks);

export default router;