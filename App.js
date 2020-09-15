
// here we get email input

var email = document.getElementById("email");

// here we get password input


var password = document.getElementById("password");

//here we get user Info

var auth = firebase.auth();

//here we get database info

var db = firebase.firestore();

var storage = firebase.storage();


// here we create  registratioon user function

function registratioon() {

    var Email = email.value;
    var Password = password.value;

    firebase.auth().createUserWithEmailAndPassword(Email, Password).then(function (sucess) {

        alert("Your Email is sucessfully register" + sucess.message);

        redirexted()


    }).catch(function (error, message) {
        alert(error.message);

    });;
}


// here we create  login user function

function login() {

    var Email = email.value;
    var Password = password.value;

    firebase.auth().signInWithEmailAndPassword(Email, Password).then(function (sucess) {

        alert("Your Email is sucess" + sucess);

        redirexted()


    }).catch(function (error) {
        alert(error.message);
    });;
}


// here we start to creating database on firebase


function redirexted() {

    // here we create localStorage data
    
    localStorage.setItem("userInfo", JSON.stringify(auth.currentUser));

    // here we change page

    window.location.href = "home.html";

}

//here we  Add data


var todo = document.getElementById('val');

var fileInput = document.getElementById("file");

var storageRef = storage.ref();


function todoAdd() {

    if(fileInput && todo.value){

        var imageFile = fileInput.files[0];

    var imagesRef = storageRef.child('images/' + fileInput.files[0].name);

    var uploadTask = imagesRef.put(imageFile);

    uploadTask.snapshot.ref.getDownloadURL().then(function(url) {

        db.collection("todo").add({
            todo: todo.value,
            uid: auth.currentUser.uid,
            image: url
        })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
                todo.value = '';
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });

      })

    }else{alert('please pick image and write todo')}

    

    


}

//here we get update on  Realtime Data Update 

var unsubscribe;

function RealtimeData() {

    // here we get localStorage value

    var uid = JSON.parse(localStorage.getItem('userInfo')).uid;



    unsubscribe =   db.collection("todo").where("uid", "==", uid)
        .onSnapshot(function (snapshot) {
            snapshot.docChanges().forEach(function (change) {
                if (change.type === "added") {
                    // console.log("New : ", change.doc.data());
                    todoList(change.doc);
                }
                if (change.type === "modified") {
                    // console.log("Modified : ", change.doc.id , change.doc.data());
                    domUpdateitem(change.doc);
                }
                if (change.type === "removed") {
                    // console.log("Removed : ", change.doc.id , change.doc.data());
                    RemoveDom(change.doc.id);
                }
            });
        });


}





// here we get div 

var getDiv = document.getElementById('list');

// here we Create todoList

function todoList(todoItem) {

    var todoObj = todoItem.data();
    
    todoObj.id = todoItem.id;


    var p = document.createElement('p');

    var textNode = document.createTextNode(todoObj.todo);

    p.appendChild(textNode);
    p.setAttribute('id', todoObj.id);
    getDiv.appendChild(p);

    var EditBtn = document.createElement('button');
    var EditTextnode = document.createTextNode('Edit Item');
    EditBtn.appendChild(EditTextnode);
    p.appendChild(EditBtn);
    EditBtn.setAttribute('onclick' , 'EditNode(this)');

    var deleteBtn = document.createElement('button');
    var deleteTextNode = document.createTextNode("delete");
    deleteBtn.appendChild(deleteTextNode);
    deleteBtn.setAttribute('onclick' , 'deleteItem(this)');
    p.appendChild(deleteBtn);

    var todoImage = document.createElement('img');
    todoImage.setAttribute('src' , todoObj.image);
    todoImage.setAttribute('width' , '50px');
    todoImage.setAttribute('height' , '50px');
    console.log(todo)
    p.appendChild(todoImage);


}

// here we delete item on database

function deleteItem(deleteItemtodo){
    var iteMId = deleteItemtodo.parentNode.id;
    db.collection("todo").doc(iteMId).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

// here we delete doom value

function RemoveDom(id){

    var remove = document.getElementById(id);
    getDiv.removeChild(remove)
}

var Bten = document.getElementById("Bten");
var parentId;
function EditNode(node){

    parentId = node.parentNode.id;
    todo.value = node.parentNode.childNodes[0].nodeValue;
    Bten.innerHTML = "Save Todo";
    Bten.setAttribute('onclick' , 'UpdateItem()');


}

// here is updated value of database

function UpdateItem() {
    db.collection("todo").doc(parentId).update({
        todo: todo.value
    })
    .then(function() {
    parentId = undefined;
    todo.value = '';
    Bten.innerHTML = "Add Todo";
    Bten.setAttribute('onclick' , 'addTodoItem()');
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
    
}

// Here we Update Doom Value

function domUpdateitem(doc){

    var updatedValue = document.getElementById(doc.id);

    updatedValue.childNodes[0].nodeValue = doc.data().todo;
    
}


// here is a log out function


function Logout() {
    firebase.auth().signOut().then(function(success) {
        unsubscribe();

        localStorage.clear()

        window.location.href = 'index.html';
      }).catch(function(error) {

        console.log(error.message);

    });
}




//here we get all user  Data


//  function getData() {

//     db.collection("todo").get().then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//             console.log(doc.id , doc.data());
//         });
//     });



// } 


// here we get current user All  Data


// function getData() {

//     var uid = JSON.parse(localStorage.getItem('userInfo')).uid;


//     db.collection("todo").where("uid", "==", uid)
//     .get()
//     .then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//             console.log(doc.id , doc.data());
//         });
//     });

// }
















// Synchronous, Asynchronous and Promises

// Synchronous

// console.log("1");

// setTimeout(function callback() {
//     console.log("2");
// }, 1000); 

// console.log("3");



// Asynchronous and Promises

// var checkPromise = new Promise(function(resolve,reject){
//     setTimeout(function () {
//         console.log('this is call inside settimeout');
//         var randomNum = Math.ceil((Math.random() * 6));
//         objsub = {
//             randomNum: randomNum,
//             str : 'this is obj'
//         }
//         resolve(objsub)
//         reject(objsub)
//     }, 3000);
// })

// checkPromise
//            .then(function(sucess){
//                console.log(sucess);
//            }).catch(function(reject){
//                console.log(reject)
//            })