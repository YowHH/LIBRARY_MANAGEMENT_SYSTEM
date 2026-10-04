// @ts-ignore
import express from "express"
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import { Book } from "../models/bookModel.js"
// @ts-ignore
import { User } from "../models/userModel.js"
import ErrorHandler from "../middlewares/errorMiddlewares.js"

// @ts-ignore
export const addBook = catchAsyncErrors(async(req, res, next) => {
    const { title, author, description, price, quantity } = req.body
    if(!title || !author || !description || !price || !quantity){
        return next(new ErrorHandler("Please fill all fields.", 400))
    }
    // @ts-ignore
    const book  = await Book.create({title, author, description, price, quantity})
    res.status(201).json({
        success: true,
        message: "Book added successfully.",
        book
    })
})

// @ts-ignore
export const deleteBook = catchAsyncErrors(async(req, res, next) => {
    // @ts-ignore
    const books = await Book.find()
    res.status(201).json({
        success: true,
        books
    })
})

// @ts-ignore
export const getAllBooks = catchAsyncErrors(async(req, res, next) => {
    const {id} = req.params
    // @ts-ignore
    const book = await Book.findById(id)
    if(!book){
        return next(new ErrorHandler("Book not found", 404))
    }
    // @ts-ignore
    Book.deleteOne()
    await book.deleteOne()
    res.status(200).json({
        success: true,
        messae: "Book deleted successfully."
    })
})