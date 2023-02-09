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
        enum: ["Adventure", "Travel", "Fashion", "Technology"]

    },
    featured: {
        type: Boolean,
        default: false

    },
    author: {
        name: {
            type: String
        },
        avtarUrl: {
            type: String,
        }

    },
    comments: [
        {
            user: {

                type: mongoose.Types.ObjectId,
                ref: 'User',

            },
            name: {
                type: String,
            },
            avtarUrl: {
                type: String,
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