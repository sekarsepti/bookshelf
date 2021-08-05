const UNCOMPLETED_LIST_BOOK_ID = "unread";
const COMPLETED_LIST_BOOK_ID = "read";
const BOOK_ITEMID = "itemId";
 
 

function addBook() {
    const uncompletedBOOKList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const inputTitle = document.getElementById("title").value;
    const inputAuthor = document.getElementById("author").value;
    const inputYear = document.getElementById("date").value;

    const book = makeBook(inputTitle, inputAuthor, inputYear, false);
    const bookObject = composeBookObject(inputTitle, inputAuthor, inputYear, false);
    
    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    uncompletedBOOKList.append(book);
    updateDataToStorage();
}

function makeBook(title, author, year, isCompleted) {
    const image = document.createElement('img');
  if(isCompleted) {
    image.setAttribute('src', 'assets/read.jpg')
  } else {
    image.setAttribute('src', 'assets/unread.jpg')
  }

  const imageBook = document.createElement('div');
  imageBook.classList.add('image-book')
  imageBook.append(image)

    const bookTitle = document.createElement("h2");
    bookTitle.innerText = title;

    const authorName = document.createElement("p");
    authorName.innerText = author;

    const bookYear = document.createElement("small");
    bookYear.innerText = year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(bookTitle, authorName, bookYear);

    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(imageBook, textContainer);

    if (isCompleted) {
        container.append(
            createUndoButton(),
            createTrashButton()
        );
    } else {
        container.append(
            createReadButtom(),
            createTrashButton()


        );
    }

    return container;
}


function createUndoButton() {
    return createButton("undo-button", function (event) {
        undoBookFromCompleted(event.target.parentElement);
    });
}

function createTrashButton() {
    return createButton("trash-button", function (event) {
        removeBookFromCompleted(event.target.parentElement);
    });
}

function createReadButtom() {
    return createButton("read-button", function (event) {
        addBookToCompleted(event.target.parentElement);
    });
}

function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}


function addBookToCompleted(bookElement) {
    const bookCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const bookTitle = bookElement.querySelector(".inner > h2").innerText;
    const bookAuthor = bookElement.querySelector(".inner > p").innerText;
    const bookYear = bookElement.querySelector(".inner > small").innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
    

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    bookCompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}



function removeBookFromCompleted(bookElement) {

    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    bookElement.remove();
    updateDataToStorage();
}

function undoBookFromCompleted(bookElement) {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const bookTitle = bookElement.querySelector(".inner > h2").innerText;
    const bookAuthor = bookElement.querySelector(".inner > p").innerText;
    const bookYear = bookElement.querySelector(".inner > small").innerText;
    
    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    listUncompleted.append(newBook);
    bookElement.remove();
    
    updateDataToStorage();
}

function refreshDataFromBooks() {
    const bookUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    let bookCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    for(book of books){
        const newBook = makeBook(book.bookTitle, book.bookAuthor, book.bookYear , book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;

        if(book.isCompleted){
            bookCompleted.append(newBook);
        } else {
            bookUncompleted.append(newBook);
        }
    }
}


document.addEventListener("DOMContentLoaded", function () {

    const submitForm = document.getElementById("form");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    if(checkStorage()){
        loadDataFromStorage();
    }
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil di simpan.");
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});
