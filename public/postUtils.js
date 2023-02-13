// document.addEventListener('DOMContentLoaded', ev => {
//     document.querySelector('#preview')
// })
const imageInput = document.getElementById('image')
const preview = document.getElementById('preview')
const form = document.getElementById('postForm')
const sendBtn = document.getElementById('sendBtn')

form.addEventListener('submit', validate)

function validate(ev){
    const res = validateSize();
    if(res) { ev.preventDefault(); throw res;}

    const info_msg =  document.createElement('p', {classList: 'info'})
    info_msg.textContent = "Uploading..."
    preview.prepend(info_msg)
}

function previewImg(ev){
    /// CHECK FOR ERRORS
    if(document.getElementById('error-message')) // old Errors to delete
        document.getElementById('error-message').remove()
    if(document.getElementById('img-preview'))
        document.getElementById('img-preview').remove()

    const err = validateSize()
    if(err){
        const err_msg = 
        document.createElement('p', {classList: 'error-message'})
        err_msg.id = 'error-message'
        err_msg.textContent = err
        // preview.before(err_msg)
        preview.prepend(err_msg)
        return err;
    }

    /// READ IMAGE
    const image = document.createElement('img')

    const fr = new FileReader();
    fr.readAsDataURL(imageInput.files[0])
    fr.addEventListener('load', ev => {
        const data_img = fr.result;
        image.src = data_img
        image.id = 'img-preview'
        image.classList.add('img-preview')

        preview.append(image)
        })
}



function validateSize(ev){
    const file = imageInput.files[0]
    if(!file){
        const err = new Error('No image Selected')
        return err.message
    }

    const SIZE_LIMIT = 5000  // W KiB // tyle samo co limit w express.urlencoded({}) lub .json({})
    const size = file.size/1024;

    if(size > SIZE_LIMIT)     // file.size jest w Bajtach
    {
        sendBtn.disabled = true;
        sendBtn.classList.add('disabled')
        const err = new Error(
        `Image is too big: ${size.toFixed(2) / 1000} MB.
            max: ${SIZE_LIMIT / 1000} MB`)
        return err.message
    }

    sendBtn.disabled = false;
    sendBtn.classList.remove('disabled')
    
    return false;
}



