// document.addEventListener('DOMContentLoaded', ev => {
//     document.querySelector('#preview')
// })

const imageInput = document.getElementById('image')
const image = document.getElementById('img-preview')
const preview = document.getElementById('preview')
const form = document.getElementById('postForm')

function validate(ev){
    ev.preventDefault();
    if(validateSize())  
        throw new Error('Size is too big')
    preview.textContent('Uploading...')
}

function previewImg(ev){
    const fr = new FileReader();
    validateSize()

    fr.readAsDataURL(imageInput.files[0])
    fr.addEventListener('load', ev => {
        const data_img = fr.result;
        image.classList.remove('hidden')
        image.src = data_img
        // TODO Store in session storage
    })

}

function validateSize(ev){
    const file = imageInput.files[0]
    if(!file){
        const err = new Error('No image Selected')
        preview.textContent = err.message;
        return err;
    }

    const SIZE_LIMIT = 4999  // W KiB
    const size = file.size/1024;

    if(size > SIZE_LIMIT)     // file.size jest w Bajtach
    {
        const err = new Error(
        `Image is too big: ${size.toFixed(2) / 1000} MB.
            max: ${SIZE_LIMIT / 1000} MB`)
        return err.message
    }
    
    // preview.textContent = null;
    return false;
}