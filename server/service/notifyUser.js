import cron from "node-cron"
import { Borrow } from "../models/borrowModel.js"
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";

export const notifyUsers = () =>{
    cron.schedule("*/30 * * * *", async() => {
        try {
            const oneDayAgo = new Date(Date.now() -24 *60 *60 *1000);
            const borrowers = await Borrow.find({
                dueDate: {
                    $lt: oneDayAgo
                },
                returnDate: null,
                notified: false
            });
            for(const element of borrowers){
                    if(element.user){
                        const user = await User.findById(element.user)
                        if (!user) continue
                    sendEmail({
                            email: user.email,
                        subject: "Book Return Reminder",
                            message: `Hello ${user.name}, \n\nThis is a reminder that the book you borrowed s due for return today. Please return the book to the library 
                            as soon as possible. \n\nThan you.`
                    })
                    element.notified = true
                    await element.save()
                        console.log(`Email sent to ${user.name}`);
                }
            }
        } catch (error) {
            console.log("Some error occured while notifying users.", error);
        }
    })
}