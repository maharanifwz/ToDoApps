//berfungsi sebagai listener yang akan menjalankan kode di dalamnya jika DOM sudah di-load dengan baik.
document.addEventListener("DOMContentLoaded", function () {

    const submitForm = document.getElementById("form");

    //tombol submit diklik maka browser akan mengirimkan data ke url yang tertera pada properti action dan browser akan di-refresh.
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        //agar todo dapat ditampilkan ke tampilan browser
        addTodo();
    });

    //part 2 -> agar data yang udh ditulis walaupun direload masih keliatan
    // untuk memanggil fungsi yang digunakan untuk memuat data dari storage (loadDataFromStorage()) ketika semua elemen sudah ready
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

/*  Kode di atas berguna untuk catch (menangkap) event yang telah kita buat. 
    Event yang ditangkap bernama ‘ondatasaved’, yang berfungsi untuk memberitahu kepada observer (event listener) bahwa data telah berhasil disimpan. 
    Yang mana, event ini dipanggil (dispatch) oleh fungsi saveData() yang telah kita buat sebelumnya.
*/
document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan.");
});

/*untuk menangkap event ketika data berhasil dimuat ke dalam array todos. 
Setelah itu, kita panggil fungsi refreshDataFromTodos() yang telah dibuat sebelumnya.
*/
document.addEventListener("ondataloaded", () => {
    refreshDataFromTodos();

});

