import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const signin = async (req, res) => {
    try {
        const { username, fullname, email, password } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return res.status(400).json({
                error: "User with the same username already exists",
            });
        }
        const existingEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (existingEmail) {
            return res.status(400).json({
                error: "Email is already in use",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                fullname,
                email,
                password: hashedPassword,
                registration_date: new Date(),
            },
        });

        res.status(201).json({
            msg: "User has been created successfully",
            user,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: `Failed to create a user : \n ${error}`,
        });
    }
};

