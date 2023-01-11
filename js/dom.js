// untuk menampung id elemen Todo yang belum selesai
const UNCOMPLETED_LIST_TODO_ID = "todos";

//untuk menampung id dari elemen container todo yang sudah selesai
const COMPLETED_LIST_TODO_ID = "completed-todos";

//untuk menyimpan id dari masing-masing task pada objek HTMLElement.
const TODO_ITEMID = "itemId";

//untuk menampilkan todo pada console browser
function addTodo() {
    // mengambil elemen container untuk menampung todo yang belum selesai
    const uncompletedTODOList = document.getElementById(UNCOMPLETED_LIST_TODO_ID);

    const textTodo = document.getElementById("title").value;
    const timestamp = document.getElementById("date").value;

    const todo = makeTodo(textTodo, timestamp);

    const todoObject = composeTodoObject(textTodo, timestamp, false);

    /*  Supaya kita bisa track perubahan pada masing masing elemen, 
        maka perlu dilakukan ‘penandaan’ pada setiap elemen yang ditambahkan dengan menambahkan properti baru pada elemen TODO.
    */
    todo[TODO_ITEMID] = todoObject.id;

    //untuk menyimpan objek task yang kita buat ke dalam variabel todos yang telah dibuat sebelumnya
    //sehingga mudah memuat dan menyimpan data dari dan ke web storage.
    //lanjutannya dari const todoObject = composeTodoObject(textTodo, timestamp, false);
    todos.push(todoObject);

    uncompletedTODOList.append(todo);

    //agar data pada storage bisa up-to-date
    updateDataToStorage();

}


//buat ngebuat to do listnya
//parameternya buat agar to do yang dimasukkan sesuai dengan yang diinputkan(dinamis)
//isCompleted buat ngebedain mana to do yang udah selesai sm yg belom
function makeTodo(data, timestamp, isCompleted) {

    const textTitle = document.createElement("h2");
    textTitle.innerText = data;

    const textTimestamp = document.createElement("p");
    textTimestamp.innerText = timestamp;

    //div inituh buat ngebungkus si textTitle dan textTimestamp
    //class inner buat yg kaya <div class= "inner" gitu
    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textTitle, textTimestamp);

    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer);

    //buat ngebedain aksi klo to do udh selesai dilakukan sm yg belom
    if (isCompleted) {
        container.append(
            createUndoButton(),
            createTrashButton()
        );
    } else {
        container.append(createCheckButton());
    }

    return container;

    /* Hasilnya nanti bakal kaya gini
        <div class="item shadow">
            <div class="inner">
                <h2>Tugas Android</h2>
                <p>2021-05-01</p>
            </div>
        </div>
    */
}

//membuat sebuah tombol untuk menandai bahwa todo sudah selesai dilakukan
//membuat sebuah elemen button dengan class yang didapat dari parameter buttonTypeClass
function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    //ketika button tersebut diklik maka fungsi pada parameter eventListener akan dijalankan
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

//untuk menampilkan todo yang sudah ditandai sebagai todo yang telah selesai.
//biar masuk ke yang sudah dilakukan
function addTaskToCompleted(taskElement) {
    const taskTitle = taskElement.querySelector(".inner > h2").innerText;
    const taskTimestamp = taskElement.querySelector(".inner > p").innerText;

    const newTodo = makeTodo(taskTitle, taskTimestamp, true);
    const listCompleted = document.getElementById(COMPLETED_LIST_TODO_ID);

    //untuk memperbarui status (isCompleted) dari masing-masing objek TODO
    //pertama, kita mencari objek TODO yang akan di-update pada array todos yang telah dideklarasikan sebelumnya dengan menggunakan fungsi findTodo()
    //setelah objek task TODO ditemukan, maka kita ubah property isCompleted menjadi true supaya TODO ini ditandai ‘selesai’
    const todo = findTodo(taskElement[TODO_ITEMID]);
    todo.isCompleted = true;

    //update lagi identifier yang ada pada elemen TODO yang baru.
    newTodo[TODO_ITEMID] = todo.id;

    listCompleted.append(newTodo);
    taskElement.remove();

    updateDataToStorage();
}

//membuat elemen button yang dapat menjalankan addtaskToComplete()
function createCheckButton() {
    return createButton("check-button", function (event) {
        addTaskToCompleted(event.target.parentElement);
    });
}

//untuk menghapus elemen todo yang sudah selesai
function removeTaskFromCompleted(taskElement) {
    /*  Kode ini berfungsi untuk menghapus data dari array TODO berdasarkan posisi data pada array yang diperoleh dari findTodoIndex(). 
        Fungsi ini mempunyai cara kerja yang sama dengan find(), yaitu mencari objek TODO. 
        Namun, bedanya nilai yang dikembalikan (return) pada fungsi ini adalah integer dari posisi objek yang match.
    */
    //Setelah posisi dari objek telah ditemukan, maka kita bisa menghapus objek tersebut dengan menggunakan fungsi splice().
    //Karena kita hanya butuh untuk menghapus satu objek saja, maka pada argumen kedua kita definisikan ke 1 (satu).
    const todoPosition = findTodoIndex(taskElement[TODO_ITEMID]);
    todos.splice(todoPosition, 1);

    taskElement.remove();

    updateDataToStorage();
}

//untuk membuat button hapus todo
function createTrashButton() {
    return createButton("trash-button", function (event) {
        removeTaskFromCompleted(event.target.parentElement);
    });
}

//untuk mengembalikan todo yang sudah selesai ke todo yang belum selesai
function undoTaskFromCompleted(taskElement) {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_TODO_ID);
    const taskTitle = taskElement.querySelector(".inner > h2").innerText;
    const taskTimestamp = taskElement.querySelector(".inner > p").innerText;

    const newTodo = makeTodo(taskTitle, taskTimestamp, false);

    /*Kode ini mirip seperti pada fungsi addTaskToCompleted(), 
    namun perbedaannya ialah pada bagian property isCompleted diubah ke false, 
    yang berarti akan mengubah statusnya menjadi ‘not completed’.
    */
    const todo = findTodo(taskElement[TODO_ITEMID]);
    todo.isCompleted = false;
    newTodo[TODO_ITEMID] = todo.id;

    listUncompleted.append(newTodo);
    taskElement.remove();

    updateDataToStorage();
}

//buat button undo
function createUndoButton() {
    return createButton("undo-button", function (event) {
        undoTaskFromCompleted(event.target.parentElement);
    });
}