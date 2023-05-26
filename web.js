const bookShelf = [];
const Render_Event = "render-book";
const events = "event-book";
const storageKey = "bookshelf";

function makeId() {
	return +new Date();
}

function checkStorage() {
	if (typeof Storage === undefined) {
		alert("browser yang digunakan belum support LocalStorage!");
		return false;
	}

	return true;
}

function makeObjectBooks(id, judul, penulis, tahun, terbaca) {
	return {
		id,
		judul,
		penulis,
		tahun,
		terbaca,
	};
}

function makeElements(objectBooks) {
	const { id, judul, penulis, tahun, terbaca } = objectBooks;

	const newCard = document.createElement("div");
	const cardBody = document.createElement("div");
	const cardFooter = document.createElement("div");
	const elementJudul = document.createElement("h5");
	const elementPenulis = document.createElement("p");
	const elementTahun = document.createElement("p");

	newCard.classList.add("card", "shadow-sm", "m-2", "border");
	newCard.setAttribute("id", `buku-${id}`);
	newCard.append(cardBody);
	newCard.append(cardFooter);
	cardBody.setAttribute("class", "card-body");
	cardBody.append(elementJudul, elementPenulis, elementTahun);
	cardFooter.setAttribute("class", "card-footer");
	elementJudul.setAttribute("class", "judulbuku");
	elementJudul.innerText = judul;
	elementPenulis.innerText = penulis;
	elementTahun.innerText = tahun;

	if (terbaca) {
		const btnUnread = document.createElement("button");
		btnUnread.classList.add("btn", "btn-primary", "btn-sm", "me-2");
		btnUnread.innerText = "Belum Dibaca";

		btnUnread.addEventListener("click", function () {
			returnBook(id);
		});

		const btnDelete = document.createElement("button");
		btnDelete.classList.add("btn", "btn-danger", "btn-sm");
		btnDelete.innerText = "Hapus";

		btnDelete.addEventListener("click", function () {
			deleteBook(id);
		});

		cardFooter.append(btnUnread, btnDelete);
	} else {
		const btnDone = document.createElement("button");
		btnDone.classList.add("btn", "btn-success", "btn-sm", "me-2");
		btnDone.innerText = "Selesai Dibaca";
		btnDone.addEventListener("click", function () {
			finishedRead(id);
		});

		const btnDelete = document.createElement("button");
		btnDelete.classList.add("btn", "btn-danger", "btn-sm");
		btnDelete.innerText = "Hapus";
		btnDelete.addEventListener("click", function () {
			deleteBook(id);
		});

		cardFooter.append(btnDone, btnDelete);
	}

	return newCard;
}

function saveData() {
	if (checkStorage()) {
		const convertToJSON = JSON.stringify(bookShelf);
		localStorage.setItem(storageKey, convertToJSON);
		document.dispatchEvent(new Event(events));
	}
}

function addBook() {
	const judul = document.getElementById("judulBuku").value;
	const penulis = document.getElementById("penulisBuku").value;
	const tahun = document.getElementById("tahunBuku").value;
	const terbaca = document.getElementById("sudahDibaca").checked;
	const idUnik = makeId();
	const objectBooks = makeObjectBooks(idUnik, judul, penulis, tahun, terbaca);

	bookShelf.push(objectBooks);

	document.dispatchEvent(new Event(Render_Event));

	saveData();
}

function finishedRead(idBook) {
	const target = findBook(idBook);
	if (target == null) return;
	target.terbaca = true;
	document.dispatchEvent(new Event(Render_Event));

	saveData();
}

function deleteBook(idBook) {
	const target = findIndexBook(idBook);
	if (target === -1) return;
	bookShelf.splice(target, 1);
	document.dispatchEvent(new Event(Render_Event));

	saveData();
}

function returnBook(idBook) {
	const target = findBook(idBook);
	if (target == null) return;
	target.terbaca = false;
	document.dispatchEvent(new Event(Render_Event));

	saveData();
}

function findBook(idBook) {
	for (itemBook of bookShelf) {
		if (itemBook.id === idBook) {
			return itemBook;
		}
	}
	return null;
}

function findIndexBook(idBook) {
	for (index in bookShelf) {
		if (bookShelf[index].id === idBook) {
			return index;
		}
	}
	return -1;
}

function findBookTitle() {
	const valueForm = document.getElementById("carijudul").value;
	const bookTitle = document.querySelectorAll(".judulbuku");

	for (title of bookTitle) {
		if (valueForm !== title.innerText) {
			title.parentElement.parentElement.remove();
		}
	}
}

function loadData() {
	const getBooks = localStorage.getItem(storageKey);
	let books = JSON.parse(getBooks);

	if (books !== null) {
		for (const book of books) {
			bookShelf.push(book);
		}
	}

	document.dispatchEvent(new Event(Render_Event));
}

document.addEventListener("DOMContentLoaded", function () {
	const submitFormBook = document.getElementById("formBuku");
	submitFormBook.addEventListener("submit", function (event) {
		event.preventDefault();
		addBook();
	});

	if (checkStorage()) {
		loadData();
	}

	const search = document.getElementById("searchForm");
	search.addEventListener("submit", function (event) {
		event.preventDefault();
		findBookTitle();
	});
});

document.addEventListener(Render_Event, function () {
	const unreadBooks = document.getElementById("belumdibaca");
	const readBooks = document.getElementById("selesaidibaca");

	unreadBooks.innerHTML = "";
	readBooks.innerHTML = "";

	for (const book of bookShelf) {
		const elementBook = makeElements(book);
		if (book.terbaca) {
			readBooks.append(elementBook);
		} else {
			unreadBooks.append(elementBook);
		}
	}
});
