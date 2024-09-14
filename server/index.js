import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import userAuth from "./route/userAuth.route.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import addBook from "./route/addBook.route.js";

const prisma = new PrismaClient();

dotenv.config();

const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cors());


//route for the user
app.use("/auth/user", userAuth);

//route for adding books
app.use("/auth/admin",addBook);

app.get("/api/user/books", async (req, res) => {
    try {
        const books = await prisma.book.findMany();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch books" });
    }
});


app.get("/api/user/collections", async (req, res) => {
    try {
        const collections = await prisma.book.findMany({
            where: {
                BorrowedBooks: {
                    some: {} // This ensures that only books with at least one BorrowedBook record are fetched
                }
            },
            include: {
                BorrowedBooks: true,
            }
        })
        res.json(collections)
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch borrowed books" })
    }
})

//collections with userid
app.get("/api/user/collections/:userId",async(req,res)=> {
    try {
        const {userId}=req.params;

        const collections=await prisma.borrowedBook.findMany({
            where: {
                user_id:parseInt(userId)
            },
            include: {
                Book: {
                    select: {
                        book_id:true,
                        title:true,
                        author:true
                    }
                }
            }
        });
        const response=collections.map(collection=> ({
            book_id:collection.Book.book_id,
            title:collection.Book.title,
            author:collection.Book.author,
            borrow_date:collection.borrow_date,
            due_date:collection.due_date,
            return_date:collection.return_date,
            fine:collection.fine
        }))

        res.json(response);
    } catch (error) {
        res.status(500).json({error:"Failed to fetch user collections"})
    }
})

//requests with user id
app.get("/api/user/requests/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const requests = await prisma.borrowRequest.findMany({
            where: {
                user_id: parseInt(userId),
                status:"pending",
            },
            include: {
                Book: {
                    select: {
                        book_id: true,
                        title: true,
                        author: true
                    }
                }
            }
        });

        const response = requests.map(request => ({
            request_id: request.request_id,
            book: {
                book_id: request.Book.book_id,
                title: request.Book.title,
                author: request.Book.author
            },
            status: request.status
        }));

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user requests" });
    }
});

//deleting requested book
app.delete('/api/user/requests/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params
        await prisma.borrowRequest.delete({
            where: {
                request_id: parseInt(requestId)
            },
        })
    } catch (error) {
        res.status(500).json({ error: "Failed to delete request" });
    }
})

// Login
app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    try {
        let user = await prisma.user.findUnique({ where: { username } });
        let role = 'user';

        if (!user) {
            user = await prisma.admin.findUnique({ where: { username } });
            role = 'admin';
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (role === 'admin') {
            if (user.password !== password) {
                return res.status(400).json({ error: "Invalid credentials" });
            }
        } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid credentials" });
            }
        }
        res.json({ msg: "Login successful", user, role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Login failed" });
    }
});

//route for requesting book
app.post("/api/user/bookRequest/", async (req, res) => {
    try {
        const { bookId, userId } = req.body;
        console.log("Book ID:", bookId);
        console.log("User ID:", userId);

        const requestCheck = await prisma.borrowRequest.findFirst({
            where: {
                user_id: userId,
                book_id: bookId,
                status:"pending",
            }
        })

        if (requestCheck) {
            return res.status(400).json({ error: "Book Already Requested" });
        }

        const bookRequest = await prisma.borrowRequest.create({
            data: {
                user_id: userId,
                book_id: bookId,
                request_date: new Date(),
                status: "pending"
            }
        })
        res.json({
            msg: "Book Request is succesfull",
            bookRequest
        })
    } catch (error) {
        res.status(500).json({ error: "Failed to post borrow request" })
    }
})
//route for updating book
app.put("/api/admin/books/:id",async(req,res)=> {
    const {id}=req.params;
    const {title,author,copies_available,total_copies}=req.body;

    try {
        const updatedBook=await prisma.book.update({
            where: {book_id:parseInt(id)},
            data: {
                title,
                author,
                copies_available,
                total_copies,
            }
        })
        res.json(updatedBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"failed to update Book"});
        
    }
})

//route for deleting a book
app.delete("/api/admin/books/:id",async(req,res)=> {
    const {id}=req.params;

    try {
        const deletedBook=await prisma.book.delete({
            where: {
                book_id:parseInt(id)
            },
        });
        res.json(deletedBook);
    } catch (error) {
        console.error('Error updating book:', error.message);
        res.status(500).json({ error: "failed to update Book", details: error.message });
    }
})

//route for getting all the book requests for the admin to see(of all users)
app.get("/api/admin/pendingRequests",async(req,res)=> {
    try {
        const pendingRequests=await prisma.borrowRequest.findMany({
            where: {
                status:"pending"
            },
            include: {
                Book:true,
                User:true
            }
        });
        res.json(pendingRequests);
    } catch (error) {
        console.error('Error fetching pending requests:', error.message);
        res.status(500).json({ error: "Failed to fetch pending requests" });
    }
})

//route for accepting the borrow request by admin
app.post("/api/admin/acceptRequest",async(req,res)=> {
    try {
        const {id,userId,bookId}=req.body;

        const updatedRequest=await prisma.borrowRequest.update({
            where: {request_id:id},
            data: {status:"Accepted"},
        });

        const borrowDate=new Date();
        const dueDate=new Date(borrowDate);
        dueDate.setDate(dueDate.getDate()+14);

        const borrowedBook=await prisma.borrowedBook.create({
            data: {
                user_id:userId,
                book_id:bookId,
                borrow_date:borrowDate,
                due_date:dueDate,
            },
        });
        res.json({
            msg:"Request accepted and book borrowed succesfully",
            updatedRequest,
            borrowedBook
        })
    } catch (error) {
        console.error("error accepting: ",error.message);
        res.status(500).json({error:"Failed to accept Request"});
    }
})

//marking the status as Rejected if the request is rejected
app.post("/api/admin/rejectRequest",async(req,res)=> {
    try {
        const {requestId}=req.body;

        const updatedRequest=await prisma.borrowRequest.update({
            where: {
                request_id:requestId
            },
            data: {
                status:"Rejected"
            }
        });
        res.json({
            msg:"Request rejected succesfully",
            updatedRequest
        })
    } catch (error) {
        console.error("error rejecting request",error);
        res.status(500).json({error:"Failed to reject request"});
    }
})

//route for getting user details and showing it in profile section

app.get("/api/user/:userId",async(req,res)=> {
    try {
        const userId=parseInt(req.params.userId,10);
        const user=await prisma.user.findUnique({
            where: {
                user_id:userId,
            },
            include: {
                BorrowedBooks: {
                    include: {
                        Book:true,
                    },
                },
            },
        });
        if(!user) {
            return res.status(404).json({error:"User not found"});
        }

        res.json(user);
    } catch (error) {
        console.error(`Failed to fetch user details: ${error}`);
        res.status(500).json({ error: "Failed to fetch user details" });
    }
})

//route for returning book
app.post("/api/user/return/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const bookId = parseInt(id);

        if (isNaN(bookId)) {
            return res.status(400).send("Invalid book ID");
        }

        // Find the borrowed book by the borrowId, which matches your Prisma model
        const borrowedBook = await prisma.borrowedBook.findUnique({
            where: {
                borrowId: bookId  // Ensure this matches your model schema
            }
        });

        if (!borrowedBook) {
            return res.status(404).send("Book Not Found");
        }

        const dueDate = new Date(borrowedBook.due_date);
        const returnDate = new Date();
        let fine = 0;

        // Calculate fine if the book is returned late
        if (returnDate > dueDate) {
            const daysLate = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
            fine = daysLate * 10;  // Assume $10 fine per day
        }

        // Delete the borrowed book entry to mark it as returned
        await prisma.borrowedBook.delete({
            where: {
                borrowId: bookId  // Ensure this matches your model schema
            }
        });

        // Create a fine record if necessary
        await prisma.fine.create({
            data: {
                userId: borrowedBook.user_id,
                bookId: borrowedBook.book_id,
                borrow_date: borrowedBook.borrow_date,
                return_date: returnDate,
                fine: fine
            }
        });

        res.status(200).send("Book returned successfully");
    } catch (error) {
        console.error(`Error returning book: ${error}`);
        res.status(500).send("Internal server error");
    }
});  

//route for fetching all the fines of a user
app.get("/api/user/fines/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const fines = await prisma.fine.findMany({
        where: { userId: parseInt(userId) },
        include: {
         Book:true,
         User:true, 
        },
      });
      res.status(200).json(fines);
    } catch (error) {
      console.error(`Error fetching fines: ${error}`);
      res.status(500).send("Internal server error");
    }
  });
app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`);
})