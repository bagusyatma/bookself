// [{id: <int>, title: <string>, author: <string>, year: <int>, isCompleted: <bool>}]
const books = [];
let filteredBooks = [];

// Action Types
const RENDER_EVENT = "RENDER_EVENT";
const SAVED_EVENT = "SAVED_EVENT";
const SEARCH_EVENT = "SEARCH_EVENT";

// Constant
const STORAGE_KEY = "booker";

document.addEventListener(RENDER_EVENT, () => {
  const unfinishedBooks = document.getElementById("unfinished-book");
  const finishedBooks = document.getElementById("finished-book");

  unfinishedBooks.innerHTML = "";
  finishedBooks.innerHTML = "";

  books.forEach((book) => {
    const bookElement = makeBookElement(book);

    if (book.isCompleted) {
      finishedBooks.append(bookElement);
    } else {
      unfinishedBooks.append(bookElement);
    }
  });
});

document.addEventListener(SEARCH_EVENT, () => {
  const unfinishedBooks = document.getElementById("unfinished-book");
  const finishedBooks = document.getElementById("finished-book");

  unfinishedBooks.innerHTML = "";
  finishedBooks.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookElement = makeBookElement(book);

    if (book.isCompleted) {
      finishedBooks.append(bookElement);
    } else {
      unfinishedBooks.append(bookElement);
    }
  });
});

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
  });

  const buttonSearch = document.getElementById("button-search");
  buttonSearch.addEventListener("click", () => {
    searchBook();
  });

  const buttonReset = document.getElementById("button-reset");
  buttonReset.addEventListener("click", () => {
    resetSearch();
  });

  if (isStorageExist()) {
    loadDataFromLocalStorage();
  }
});

const loadDataFromLocalStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);
  if (data) {
    for (let i = 0; i < data.length; i++) {
      books.push(data[i]);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
};

const generateId = () => {
  return +new Date();
};

const generateBookObject = (title, author, year, isCompleted) => {
  return {
    id: generateId(),
    title,
    author,
    year,
    isCompleted,
  };
};

const findBook = (id) => {
  return books.find((book) => book.id === id);
};

const findBookIndex = (id) => {
  return books.findIndex((book) => book.id === id);
};

const addBook = () => {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const isCompleted = document.getElementById("finished").checked;

  const book = generateBookObject(title, author, year, isCompleted);
  books.push(book);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

  resetForm();
};

const resetForm = () => {
  document.getElementById("form").reset();
};

const makeBookElement = (book) => {
  const card = document.createElement("div");
  card.classList.add("card", "mb-3");
  card.setAttribute("id", book.id);

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.setAttribute("id", "title");
  cardTitle.innerText = book.title;

  const cardSubtitle = document.createElement("h6");
  cardSubtitle.classList.add("card-subtitle", "mb-3", "text-muted");
  cardSubtitle.innerText = book.author;

  const cardText = document.createElement("p");
  cardText.classList.add("card-text");
  cardText.innerText = book.year;

  card.appendChild(cardBody);
  cardBody.append(cardTitle, cardSubtitle, cardText);

  const buttonFinished = document.createElement("button");
  buttonFinished.classList.add("btn", "btn-light");
  buttonFinished.innerText = "Finished";

  const buttonUnfinished = document.createElement("button");
  buttonUnfinished.classList.add("btn", "btn-light");
  buttonUnfinished.innerText = "Unfinished";

  const buttonDelete = document.createElement("button");
  buttonDelete.classList.add("btn", "btn-light", "text-danger");
  buttonDelete.innerText = "Delete";

  if (book.isCompleted) {
    buttonUnfinished.addEventListener("click", () => {
      unfinishedBook(book.id);
    });

    buttonDelete.addEventListener("click", () => {
      deleteBook(book.id);
    });

    cardBody.append(buttonUnfinished, buttonDelete);
  } else {
    buttonFinished.addEventListener("click", () => {
      finishedBook(book.id);
    });

    buttonDelete.addEventListener("click", () => {
      deleteBook(book.id);
    });

    cardBody.append(buttonFinished, buttonDelete);
  }

  return card;
};

const finishedBook = (id) => {
  const book = findBook(id);
  if (!book) return;

  book.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const unfinishedBook = (id) => {
  const book = findBook(id);
  if (!book) return;

  book.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const deleteBook = (id) => {
  const index = findBookIndex(id);
  if (index === -1) return;

  books.splice(index, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const searchBook = () => {
  const keyword = document.getElementById("search").value;

  if (keyword === "") {
    document.dispatchEvent(new Event(RENDER_EVENT));
  } else {
    const newList = books.filter((book) => {
      return book.title.toLowerCase().includes(keyword.toLowerCase());
    });

    filteredBooks.push(...newList);
    document.dispatchEvent(new Event(SEARCH_EVENT));
  }
};

const resetSearch = () => {
  const keyword = (document.getElementById("search").value = "");

  filteredBooks = [];
  document.dispatchEvent(new Event(RENDER_EVENT));
};
