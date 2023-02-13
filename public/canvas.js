const img = document.querySelector('img')
WIDTH = 500;

img.addEventListener('load', (ev) => {
    let canvas = document.createElement('canvas')
      // target to po prostu nasz element html, tutaj img i .width czyli canvas.width
    let ratio = WIDTH / ev.target.width 
    canvas.width = WIDTH; 
    canvas.heigth = ev.target.height * ratio; 

    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, canvas.width, canvas.height)  // image, pos x, pos y, width, hegiht

    let new_image_url = context.canvas.toDataURL('image/jpeg', 90)
})