const mongoose = require('mongoose');

// create mongoose .pre() middleware to increment id
// https://stackoverflow.com/questions/49579069/mongoose-auto-increment-id



const postSchema = mongoose.Schema({
    id: {type: Number, index: true, unique: true},
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: [true, 'ERROR: Brak Autora']          // additional security
    },
    edited_by: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        minlength: [4, 'Zbyt krótki tytuł - min. 4 znaki'],
        maxlength: [200, 'Zbyt długi tytuł - max. 200 znaków'],
        required: [true, 'Brak tytulu - Dodaj tytul']
    },
    body: {
        type: String,
        minlength: [15, 'Zbyt krótki post - min. 15 znaków'],
        maxlength: [10000, 'Zbyt długi post - max. 10000 znaków'],
        required: [true, 'Brak zawartosci - Dodaj zawartosc posta']
    }
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





