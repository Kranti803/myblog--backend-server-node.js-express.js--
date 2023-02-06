import mongoose from "mongoose";


const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, 
    },
    content: {
        type: String,
        required: true
    },
    poster: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    category: {
        type: String,
        required: [true, "Please Select Product Category"],
        

    },
    featured: {
        type:Boolean,
        default:false

    },
    comments: [
        {
            user: {

                type: mongoose.Schema.ObjectId,
                ref: 'User',
    
            },
            comment: {
                type: String,
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }


})

export const Blog = mongoose.model('Blog', blogSchema);