// Modal box
const addButton = document.getElementById("tambah-buku");
const modalBox = document.getElementById("modal-box");
const closeButton = document.getElementById("close-button");

addButton.onclick = function() {
  modalBox.style.visibility = "visible";
};

closeButton.onclick = function() {
  modalBox.style.visibility = "hidden";
};

window.onclick = function(event) {
  if (event.target == modalBox) {
    modalBox.style.visibility = "hidden";
  }
};

// ---------------------------------------------------------------

// Search Box
const searchButton = document.querySelector(".tombol-cari");
const searchButtonn = document.querySelector(".tombol-carii");
const searchBox = document.querySelector("#search-book");

searchButton.onclick = function() {
  searchBox.style.margin = "0 15px";
  searchBox.style.width = "250px";
  searchBox.style.color = "black";

  searchButton.style.display = "none";

  searchButtonn.style.display = "flex";
  searchButtonn.style.backgroundColor = "cadetblue";
  searchButtonn.style.color = "darkmagenta";
};

searchButtonn.onclick = function() {
  searchBox.style.margin = "0";
  searchBox.style.width = "0";

  searchButton.style.display = "flex";
  searchButtonn.style.display = "none";
};
// ================================

searchBox.addEventListener("keyup", pencarian);

function pencarian(e) {
  const itemBuku = e.target.value.toLowerCase();
  let bukuBukuItem = document.querySelectorAll(".item-list");

  bukuBukuItem.forEach((item) => {
    const halamanBuku = item.firstChild.textContent.toLowerCase();

    if (halamanBuku.indexOf(itemBuku) != -1) {
      item.setAttribute("style", "display: flex;");
    } else {
      item.setAttribute("style", "display: none;");
    }
  });
}

// -----------------------------------------------------------------

// function of all

const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "bookShelf";

// Checking Web Storage

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage!");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function() {
  console.log(localStorage.getItem(STORAGE_KEY));
});

// Menampilkan data yang tersimpan ke dalam container
function loadDataFromStorage() {
  const realData = localStorage.getItem(STORAGE_KEY);
  let nilaiData = JSON.parse(realData);

  if (nilaiData !== null) {
    for (book of nilaiData) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
// ------------------------------------------------------------------------

// Menyimpan data buku yang input
function simpanData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
// --------------------------------------------------------------------

// Form Add
document.addEventListener("DOMContentLoaded", function() {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: "success",
      title: "Buku berhasil ditambah",
    });

    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
// --------------------------------------------------------------------

// Menambahkan daftar buku
function addBook() {
  const bookTitle = document.getElementById("book-title").value;
  const authorBook = document.getElementById("author").value;
  const tahunTerbit = document.getElementById("book-year").value;
  const generatedIdBook = generatedBookId();
  const bookDetail = generateBookDetail(
    generatedIdBook,
    bookTitle,
    authorBook,
    tahunTerbit,
    checkList()
  );

  books.push(bookDetail);

  document.dispatchEvent(new Event(RENDER_EVENT));
  simpanData();
}

function generatedBookId() {
  return +new Date();
}

function generateBookDetail(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}
// ------------------------------------------------------------------

// Menambahkan ke list sudah atau belum
document.addEventListener(RENDER_EVENT, function() {
  const belumSelesai = document.getElementById("reading");
  belumSelesai.innerHTML = "";

  const telahSelesai = document.getElementById("already-reading");
  telahSelesai.innerHTML = "";

  for (bookItem of books) {
    const bookElement = makeBookList(bookItem);

    if (bookItem.isCompleted == false) {
      belumSelesai.append(bookElement);
    } else {
      telahSelesai.append(bookElement);
    }
  }
});

function checkList() {
  const bookCheck = document.getElementById("completed-book");

  if (bookCheck.checked == true) {
    return true;
  }
  return false;
}

// Membuat list buku
function makeBookList(bookDetail) {
  const titleText = document.createElement("h3");
  titleText.innerText = "Judul buku: " + bookDetail.title;

  const authorText = document.createElement("p");
  authorText.innerText = "Penulis: " + bookDetail.author;

  const yearText = document.createElement("p");
  yearText.innerText = "Tahun terbit: " + bookDetail.year;

  const bodyText = document.createElement("div");
  bodyText.classList.add("book-detail");
  bodyText.append(titleText, authorText, yearText);

  const bodyList = document.createElement("div");
  bodyList.classList.add("item-list");
  bodyList.append(bodyText);
  bodyList.setAttribute("id", `book-${bookDetail.id}`);

  const buttons = document.createElement("div");
  buttons.classList.add("button-action");

  if (bookDetail.isCompleted) {
    const unComplete = document.createElement("button");
    unComplete.classList.add("undo-read");
    unComplete.innerHTML = '<i class="fa-solid fa-rotate-left"></i>';
    unComplete.addEventListener("click", function() {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: "success",
        title: "Buku berhasil dipindahkan ke rak belum selesai dibaca",
      });
      undoReadCompleted(bookDetail.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-book");
    deleteButton.innerHTML = '<i class="fa-solid fa-circle-minus"></i>';
    deleteButton.addEventListener("click", function() {
      Swal.fire({
        text: "Apa kamu yakin ingin menghapus buku ini?",
        icon: "warning",
        showDenyButton: true,
        confirmButtonColor: "#d33",
        denyButtonColor: "#aaa",
        confirmButtonText: "Hapus",
        denyButtonText: "Batal",
      }).then((deleteButton) => {
        if (deleteButton.isConfirmed) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
          });

          Toast.fire({
            icon: "success",
            title: "Buku berhasil dihapus",
          });
          removeBook(bookDetail.id);
        }
      });
    });

    buttons.append(unComplete, deleteButton);
    bodyList.append(buttons);
  } else {
    const completeButton = document.createElement("button");
    completeButton.classList.add("already");
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    completeButton.addEventListener("click", function() {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: "success",
        title: "Buku berhasil dipindahkan ke rak selesai dibaca",
      });
      completeRead(bookDetail.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-book");
    deleteButton.innerHTML = '<i class="fa-solid fa-circle-minus"></i>';
    deleteButton.addEventListener("click", function() {
      Swal.fire({
        text: "Apa kamu yakin ingin menghapus buku ini?",
        icon: "warning",
        showDenyButton: true,
        confirmButtonColor: "#d33",
        denyButtonColor: "#aaa",
        confirmButtonText: "Hapus",
        denyButtonText: "Batal",
      }).then((deleteButton) => {
        if (deleteButton.isConfirmed) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
          });

          Toast.fire({
            icon: "success",
            title: "Buku berhasil dihapus",
          });
          removeBook(bookDetail.id);
        }
      });
    });

    buttons.append(completeButton, deleteButton);
    bodyList.append(buttons);
  }
  return bodyList;
}
// -----------------------------------------------------------------------

// Buku yang telah selesai dibaca
function completeRead(bookID) {
  const targetBook = findBook(bookID);

  if (targetBook == null) return;

  targetBook.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  simpanData();
}

function findBook(bookID) {
  for (bookItem of books) {
    if (bookItem.id == bookID) {
      return bookItem;
    }
  }
  return null;
}
// -----------------------------------------------------------------------

// Hapus buku dari list
function removeBook(bookID) {
  const targetBook = findIndexBook(bookID);

  if (targetBook === -1) return;
  books.splice(targetBook, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  simpanData();
}

// Mengembalikan buku menjadi belum dibaca
function undoReadCompleted(bookID) {
  const targetBook = findBook(bookID);

  if (targetBook == null) return;
  targetBook.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  simpanData();
}

function findIndexBook(bookID) {
  for (index in books) {
    if (books[index].id === bookID) {
      return index;
    }
  }
  return -1;
}
// --------------------------------------------------------------------
