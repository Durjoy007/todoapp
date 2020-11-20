function itemTemplate(item){
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text"> ${item.text} </span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}

// Initialize Client Side Render
let itemStyle = item.map(function(item){
    return itemTemplate(item)
}).join(" ")

document.getElementById("create-item").insertAdjacentHTML("beforeend", itemStyle)


// Create Feature
let createField = document.getElementById("create-field");

document.getElementById("create-form").addEventListener("submit", function(event){
    event.preventDefault();
    axios.post("/create-item", {text: createField.value}).then(function(response){
        // learning something in new tutorial
        document.getElementById("create-item").insertAdjacentHTML("beforeend", itemTemplate(response.data));
    }).catch(function(){
        console.log("Please try again later");
    });
})


// Delete Feature
document.addEventListener("click", function(event){

    if(event.target.classList.contains("delete-me")){
        if(confirm("Do you want to delete this?")){
            axios.post("/delete-item", {id: event.target.getAttribute("data-id")}).then(function(){
                // learning something in new tutorial
                event.target.parentElement.parentElement.remove();
            }).catch(function(){
                console.log("Please try again later");
            });
        }
    }


// Update Feature
    if(event.target.classList.contains("edit-me")){

        let userInput = prompt("Edit your task", event.target.parentElement.parentElement.querySelector(".item-text").innerHTML);
            if(userInput){
            axios.post("/updated-item", {text: userInput, id: event.target.getAttribute("data-id")}).then(function(){
                // learning something in new tutorial
                event.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput;
            }).catch(function(){
                console.log("Please try again later");
            });
        }
    }
})