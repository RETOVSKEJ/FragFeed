const mongoose = require('mongoose');

// create mongoose .pre() middleware to increment id
// https://stackoverflow.com/questions/49579069/mongoose-auto-increment-id



const postSchema = mongoose.Schema({
    id: {type: Number, default: 0},
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: [true, 'Error MSG']
    },
    body: {
        type: String,
        required: true,
    }
    // createdAt: {
    //     type: Date,
    //     immutable: true,
    //     default: () => Date.now()
    // },
    // updatedAt: {
    //     type: Date,
    //     default: () => Date.now()
    // }
}, {
    timestamps: true
}
) 

postSchema.pre('save', function(next) {
    updatedAt = Date.now();
    next()
})

postSchema.statics.findByPostId = function(id){
    return this.where('id').equals(id)
}

module.exports = mongoose.model('Post', postSchema)





