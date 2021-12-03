
let socket = io("/");

let myStorage = window.sessionStorage;
socket.on("DB",(data)=>{
    console.log(data);
});
socket.on("testing",function(data){
    console.log(data);
});




//handilg events here 

let urlForm = document.querySelector(".url_form"); // form
let frm_field =  document.querySelector(".frm_field"); //input of form
let connect_button = document.querySelector(".connect_button"); //button
let connecting = document.querySelector(".Connecting");
let clickme = document.querySelector(".click_me");
let conn = document.querySelector(".conn");
let renderConnectDBFor= document.querySelector(".render_Url_form");
let content_container = document.querySelector(".content_container");
//getting Section_two of the admin pannel
let containerBox = document.querySelector(".show_Collection_Name_Container");
let holder_1 = document.querySelector(".holder_1");
let addCollectionName  = document.querySelector(".show_names");
let showCollectionData =  document.querySelector(".show_collecion_data");
let progressBar = document.querySelector(".progress");
let spanDBNAme = document.querySelector(".DbName");
let collectionCount = document.querySelector(".Collection_count");
let CreateCollectionButton = document.querySelector(".createCollection");
//Event Handling data
clickme.addEventListener("click",function(){
    console.log("Clicked on click me")
    socket.emit("give_me_response","giveMeResponse")
    containerBox.style.display = "grid";
    renderConnectDBFor.style.display = "none";
    holder_1.style.display ="block";
});

//handling the session detail 
if(sessionStorage.getItem("IsOK")==1){
    socket.emit("give_me_response","giveMeResponse")
    containerBox.style.display = "grid";
    renderConnectDBFor.style.display = "none";
    holder_1.style.display ="block";
    let url = sessionStorage.getItem("url");
    socket.emit("URL",url);
}

//handling close tab event here
window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';
});


urlForm.addEventListener("submit",function(e){
    e.preventDefault();
});

connect_button.addEventListener("click",function(){
    
    if(!frm_field.value){
        return false;
    }
    connect_button.disabled = true;
    connecting.style.display ="block";
    socket.emit("URL",frm_field.value);
    sessionStorage.setItem("url",frm_field.value);
});

CreateCollectionButton.addEventListener("click",function(){
    let NewCollectionName = document.querySelector(".collection_name").value;
    // let NewCollectionData = document.querySelector(".collection_data").value;
    // const text = NewCollectionData;
    // let data = JSON.parse(text) //converting textarea input to object format here
     let finalData = {
        "Collection_Name" : NewCollectionName,
    }
    socket.emit("Create_Collection",finalData); //i need to continue From Here
});

let Add_Data_TO_Collection = document.querySelector(".Add_Data_TO_Collection");
Add_Data_TO_Collection.addEventListener("click",function(){
    let ColName = document.querySelector(".CollectioName").value;
    let ColData =  document.querySelector(".collection_data").value;
    let finalData = JSON.parse(ColData);
     socket.emit("Add_Data_To_Collection",{"Data":finalData,"CollectionN":ColName});
});

//adding data to collections


//socket Evenets
socket.on("connected_user",function(data){
    console.log(data);
    conn.style.display = 'block'
    connecting.style.display ="none";});

socket.on("get_response",function(data){ //gettting response here 
    console.log(data);
});

socket.on("collectionNames",function(data){
    let ul = document.createElement("ul");
    ul.setAttribute("class","ul_listofDataFromDB");
    for(value of data){
        let li = document.createElement("li");
        li.style.listStyle ='none';
         li.innerHTML = `<li class="Collection_list">
                            <p>${value.name}</p>
                           <div class="show_delete_holder">
                           <option class="Show" value=${value.name}>Show</option>
                           <option class="Delete_button" value=${value.name}>Delete</option>
                           </div>
                         </li>`
       let Show =  li.querySelectorAll(".Show");  //Show button Event Listener here
       let delete_button = li.querySelectorAll(".Delete_button");
       delete_button.forEach((e)=>{
            e.addEventListener("click",()=>{
                
                let collection_name= e.value;
                console.log("Deleting the collection having name "+collection_name);
                socket.emit("delete_collection",collection_name);
            });
       })
       Show.forEach((e)=>{
           e.addEventListener("click",()=>{
            progressBar.style.display ="block";
               let CollectionName =  e.value; //getting the collection Name here
                socket.emit("findCollectionData",CollectionName); //emitting the find Collection Data Event
           });
       })
        ul.append(li);
    }
    addCollectionName.innerHTML = "";
    addCollectionName.appendChild(ul);
});

//handling collection removeing response here
socket.on("remove_from_html",function(data){
        let collectionList = document.querySelectorAll(".Collection_list");
        collectionList.forEach((e)=>{
           if( e.firstElementChild.innerHTML == data){
               e.remove();
               alert("Collected deleted from the database");
           }
        })
});



//handling db Stats

socket.on("db_stats",function(data){
    console.log(data);
    spanDBNAme.innerHTML =  data["db"];
    collectionCount.innerHTML = data['collections']
    if(data.ok==1){
      sessionStorage.setItem("IsOK",data.ok);
    }
});


//getting and adding the data inside the div 
socket.on("foundedDataYourCollection", function(data){
    console.log(data);  
    let parentList =  document.createElement("ol");
    progressBar.style.display ="none";
        for(let e of data){
            let da =  JSON.stringify(e);
            let div = document.createElement("div");
            let li  = document.createElement("li")
            li.setAttribute('class',"listOf_Collection_data_holder")
            div.setAttribute('class',"Collection_data_holder")
            div.innerHTML = `<div >
                                ${da}
                            </div>`
            li.innerHTML = div.innerHTML;
            parentList.append(li);
        }
        if(showCollectionData.children.length > 1){
           showCollectionData.firstElementChild.nextElementSibling.remove()
        }
        showCollectionData.append(parentList);
});

//socket otherSection Events




//hiding the list on page load
$(".input_holder_createCollection_One").hide();
$(".input_holder_createCollection_Two").hide();
$(".input_holder_createCollection_three").hide();
//handling events in jquery 
$(".close_sec").on("click",function(){
    $(containerBox).slideUp(2000);
    $(this).fadeOut(2000);
    $(".show_sec").fadeIn(1000);
});
$(".show_sec").on("click",function(){
    $(this).fadeOut(2000);
    $(".close_sec").fadeIn(1000);
    $(containerBox).slideDown(2000);
});

//handling event of otherDetail Section
$(".show_query_form").on("click",function(){
    $(this).fadeOut(1000).hide();
    // $(".input_holder_createCollection_One").attr("display","flex");
    $(".input_holder_createCollection_One").slideDown(1000);
    $(".hide_query_form").fadeIn(2000);
});
$(".hide_query_form").on("click",function(){
    $(this).fadeOut(1000).hide();
    $(".input_holder_createCollection_One").slideUp(1000);
    $(".show_query_form").fadeIn(2000);
});

//Adding data to the collection Show and Hide Event handling
$(".show_query_form2").on("click",function(){
    $(this).fadeOut(1000).hide();
    $(".input_holder_createCollection_Two").slideDown(1000);
    $(".hide_query_form2").fadeIn(2000);
});
$(".hide_query_form2").on("click",function(){
    $(this).fadeOut(1000).hide();
    $(".input_holder_createCollection_Two").slideUp(1000);
    $(".show_query_form2").fadeIn(2000);
});

$(".show_query_form3").on("click",function(){
    $(this).fadeOut(1000).hide();
    $(".input_holder_createCollection_three").slideDown(1000);
    $(".hide_query_form3").fadeIn(2000);
});
$(".hide_query_form3").on("click",function(){
    $(this).fadeOut(1000).hide();
    $(".input_holder_createCollection_three").slideUp(1000);
    $(".show_query_form3").fadeIn(2000);
});
// input_holder_createCollection_One




