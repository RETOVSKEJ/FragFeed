// document.addEventListener('DOMContentLoaded', ev => {
//     document.querySelector('#preview')
// })

const imageInput = document.getElementById('image')
const preview = document.getElementById('preview')
const form = document.getElementById('postForm')
const button = document.getElementById('sendBtn')

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
    const new_image = document.createElement('img')
    const canvas = document.createElement('canvas')

    const fr = new FileReader();
    fr.readAsDataURL(imageInput.files[0])
    fr.addEventListener('load', ev => {
        const data_img = fr.result;
        image.src = data_img

        // compress image
        image.addEventListener('load', ev => {
            const WIDTH = 500;

            let ratio = WIDTH / ev.target.width
            canvas.width = WIDTH;
            canvas.height = ev.target.height * ratio;

            const context = canvas.getContext('2d')
            context.drawImage(image, 0, 0, canvas.width, canvas.height)

            const new_image_url = context.canvas.toDataURL('image/jpeg', 90)
            new_image.src = new_image_url; 
            new_image.id = 'img-preview' 
            preview.appendChild(new_image)  // mozemy dodac canvas, ale wolimy operować na tagu <img> niz <canvas>
            
            //store image
            const image_file = urlToFile(new_image_url)
            uploadImage(image_file)

            localStorage.setItem('data_img', new_image.src)
            console.log(data_img.length)
            console.log(new_image_url.length)

        })
    })
}
const urlToFile = (url) => {
    const arr = url.split(',')
    const mime = arr[0].match(/:(.*?);/)[1];   // [0] = :image/jpeg; [1] = image/jpeg
    const data = arr[1]; // data

    const decoded_data = atob(data)      // ascii to base64
    let size = decoded_data.length;      // dlugosc danych
    const dataArr = new Uint8Array(size)    // typedArray of size = size

    while(size--)
    {
        dataArr[size] = decoded_data.charCodeAt(size)   // zamienia kazda literke z arraya, na kod utf16
    }

    return new File([dataArr], `${Date.now()}.jpg`, {type: mime})
}

const uploadImage = (file) => {
    const url = `${window.location.origin}/upload`  // path for our POST request
    let formData = new FormData()
    formData.append('file', file)  // 'file' - key from server,  file - value

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
    }).then(log => console.log(log))
}



function validateSize(ev){
    const file = imageInput.files[0]
    if(!file){
        const err = new Error('No image Selected')
        return err.message
    }

    const SIZE_LIMIT = 3800  // W KiB
    const size = file.size/1024;

    if(size > SIZE_LIMIT)     // file.size jest w Bajtach
    {
        button.disabled = true;
        button.classList.add('disabled')
        const err = new Error(
        `Image is too big: ${size.toFixed(2) / 1000} MB.
            max: ${SIZE_LIMIT / 1000} MB`)
        return err.message
    }

    button.disabled = false;
    button.classList.remove('disabled')
    
    return false;
}



