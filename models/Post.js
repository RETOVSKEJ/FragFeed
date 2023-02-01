const mongoose = require('mongoose');

// create mongoose .pre() middleware to increment id
// https://stackoverflow.com/questions/49579069/mongoose-auto-increment-id



const postSchema = mongoose.Schema({
    id: {type: Number, index: true, unique: true},
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: [true, 'ERROR: brak tytulu - Dodaj tytul']
    },
    body: {
        type: String,
        required: [true, 'ERROR: brak zawartosci - dodaj zawartosc posta']
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
    timestamps: true  // tworzy createdAt i updatedAt
}
) 



postSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next()
})

postSchema.statics.findByPostId = function(id){
    return this.where('id').equals(id).exec()
}

module.exports = mongoose.model('Post', postSchema)





