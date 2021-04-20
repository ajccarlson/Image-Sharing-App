let numPhotos = 0;

document.getElementById("getphotos").onclick = fetchPhotos;

function fetchPhotos(event){
    function buildImageDiv(data){
        let div = document.createElement('div');
        let img = document.createElement('img');
        let h1 = document.createElement('h1');
        div.setAttribute("id", `photo-${data.id}`);
        div.setAttribute("class", "fadeOut");
        div.addEventListener('click', fadeOut);
        img.src = data.url;
        img.width = "200";
        img.height = "200";

        let tempTitle = data.title;
        if (tempTitle.length > 25) {
            tempTitle = tempTitle.slice(0, 25) + "..."
        }
        h1.setAttribute("id", "photo-text");
        h1.innerHTML = tempTitle;

        div.appendChild(img);
        div.appendChild(h1);

        return div;
    }
    event.preventDefault();
    var url = "https://jsonplaceholder.typicode.com/albums/2/photos";
    fetch(url)
    .then((response) =>{
        return response.json();
    })
    .then( (photos) => {
            //console.log(photos)
            var div = document.getElementById("photo-storage");
            photos.forEach( (photo) => {
                //console.log(photo.url);
                div.appendChild(buildImageDiv(photo));
            });
            /*for (let i = 0; i < 50; i++) {
                div.appendChild(buildImageDiv(photo.url));
            }*/
            if(window.offset){
                window.offset = window.offset + 25;
            }else{
                window.offset = 25;
            } 
            numPhotos += photos.length;
            document.getElementById('items-count').innerHTML = `There are ${numPhotos} photo(s) being shown`
    })
    .catch((error) =>{
        console.log(error);
    });
}

function fadeOut(event) {
    var temp = event.currentTarget

    temp.classList.add("fadeElement");
    setTimeout(function(){temp.remove();}, 100);

    numPhotos--;
    document.getElementById('items-count').innerHTML = `There are ${numPhotos} photo(s) being shown`
}