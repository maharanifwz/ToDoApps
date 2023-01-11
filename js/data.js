//untuk menyediakan key yang digunakan untuk mengakses data pada local storage
const STORAGE_KEY = "TODO_APPS";
 
//untuk menyimpan data temporary dari TODO.
let todos = [];
 
//untuk mengecek dukungan web storage pada browser. Mengembalikan nilai false apabila tidak didukung.
function isStorageExist() /* boolean */ {
   if(typeof(Storage) === undefined){
       alert("Browser kamu tidak mendukung local storage");
       return false
   }
   return true;
}

//untuk menyimpan data TODO ke storage
/*  Ia mengkonversikan data pada global variabel todo ke JSON-formatted string untuk disimpan.
    Setelah itu, fungsi ini mentrigger custom event ‘ondatasaved’
*/
function saveData() {
   const parsed = JSON.stringify(todos);
   localStorage.setItem(STORAGE_KEY, parsed);
   document.dispatchEvent(new Event("ondatasaved"));
}
 
/*  Memuat data TODO dari web storage ke dalam variabel todos. 
    Kemudian trigger custom event ‘ondataloaded’ agar kita bisa menggunakannya untuk load data pada aplikasi.
*/
function loadDataFromStorage() {
   const serializedData = localStorage.getItem(STORAGE_KEY);
   
   let data = JSON.parse(serializedData);
   
   if(data !== null)
       todos = data;
 
   document.dispatchEvent(new Event("ondataloaded"));
}
 
/*  Fungsi yang digunakan sebagai perantara dalam menyimpan data, 
    ia memastikan terlebih dahulu apakah web storage sudah didukung oleh browser sebelum memanggil saveData()
*/
function updateDataToStorage() {
   if(isStorageExist())
       saveData();
}
 
//untuk membuat objek TODO baru dari beberapa parameter yang telah ditentukan.
function composeTodoObject(task, timestamp, isCompleted) {
   return {
       id: +new Date(),
       task,
       timestamp,
       isCompleted
   };
}
 
/*  Mencari objek task TODO yang ada pada array todos berdasarkan ID yang di input pada argumen pertama. 
    Lalu mengembalikan objek TODO jika ditemukan, dan null sebaliknya.
*/
function findTodo(todoId) {
   for(todo of todos){
       if(todo.id === todoId)
           return todo;
   }
   return null;
}
 
/*  Mencari index dari objek task TODO yang ada pada array todos berdasarkan ID yang di input pada argumen pertama. 
    Lalu mengembalikan nilai index (posisi) jika ditemukan, dan - 1 sebaliknya.
*/ 
function findTodoIndex(todoId) {
   let index = 0
   for (todo of todos) {
       if(todo.id === todoId)
           return index;
 
       index++;
   }
 
   return -1;
}

//notes jangan lupa tambahin di console localStorage.getItem("TODO_APPS");
//ini buat mengambil objek JSON yang telah disimpan pada web storage, dengan nilai key TODO_APPS sehingga to do yang udh ditulis walaupun di reload ttp bisa keliatan

//untuk me-render data TODO yang ada pada object array todos.
//dalam mengambil data dari array, tentu kita membutuhkan sebuah perulangan atau iterasi supaya data yang ada pada array tersebut bisa diakses satu per satu
//akan membuat elemen task TODO, kemudian diteruskan dengan percabangan untuk menentukan ‘tempat’ bagi elemen tersebut dibuat
function refreshDataFromTodos() {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_TODO_ID);
    let listCompleted = document.getElementById(COMPLETED_LIST_TODO_ID);
  
  
    for(todo of todos){
        const newTodo = makeTodo(todo.task, todo.timestamp, todo.isCompleted);
        newTodo[TODO_ITEMID] = todo.id;
  
        //kalo misal to do nya udh kelar, maka ditempatin di listcompleted, kalo ngga di uncompleted
        if(todo.isCompleted){
            listCompleted.append(newTodo);
        } else {
            listUncompleted.append(newTodo);
        }
    }
 }