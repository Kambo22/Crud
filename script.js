let books = JSON.parse(localStorage.getItem('books')) || [];

function showDashboard() {
    const dashboard = document.getElementById('dashboard');
    dashboard.innerHTML = '';

    if (books.length === 0) {
        dashboard.innerHTML = '<p>No books available. Add a book to get started.</p>';
        return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Publication Year</th>
            <th>Action</th>
        </tr>
    `;

    books.forEach((book, index) => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.publicationYear}</td>
            <td>
                <button onclick="showDetailView(${index})">View</button>
                <button onclick="showEditForm(${index})">Edit</button>
                <button onclick="deleteBook(${index})">Delete</button>
            </td>
        `;
    });

    dashboard.appendChild(table);
}

function viewLibrary() {
    fetch('https://mocki.io/v1/3f05d22d-dbfd-4836-85b0-504ecee9c92f')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('books', JSON.stringify(data));
            books = data;
            showDashboard();
        });
}

function showAddForm() {
    const addForm = document.getElementById('addForm');
    const bookForm = document.getElementById('bookForm');

    if (addForm.classList.contains('hidden')) {
        addForm.classList.remove('hidden');
        bookForm.reset();
    } else {
        addForm.classList.add('hidden');
    }
}

function addBook(event) {
    event.preventDefault();

    const title = document.getElementById('addTitle').value;
    const author = document.getElementById('addAuthor').value;
    const genre = document.getElementById('addGenre').value;
    const publicationYear = document.getElementById('addYear').value;
    const synopsis = document.getElementById('addSynopsis').value;

    if (!title || !author || !genre || !publicationYear || !synopsis) {
        alert("Please fill in all the fields.");
        return;
    }

    if (isNaN(publicationYear) || publicationYear < 0) {
        alert("Please enter a valid publication year.");
        return;
    }

    const newBook = {
        title: title,
        author: author,
        genre: genre,
        publicationYear: publicationYear,
        synopsis: synopsis
    };

    books.push(newBook);
    localStorage.setItem('books', JSON.stringify(books));

    showDashboard();

    const addForm = document.getElementById('addForm');
    addForm.classList.add('hidden');
}

function deleteBook(index) {
    const confirmDeletion = confirm(`Are you sure you want to delete "${books[index].title}"?`);

    if (confirmDeletion) {
        books.splice(index, 1);
        localStorage.setItem('books', JSON.stringify(books));
        showDashboard();

        const detailView = document.getElementById('detailView');
        detailView.classList.add('hidden');

        const editForm = document.getElementById('editForm');
        if (!editForm.classList.contains('hidden')) {
            editForm.classList.add('hidden');
        }
    }
}

function showEditForm(index) {
    const editForm = document.getElementById('editForm');
    const editTitle = document.getElementById('editTitle');
    const editAuthor = document.getElementById('editAuthor');
    const editGenre = document.getElementById('editGenre');
    const editYear = document.getElementById('editYear');
    const editSynopsis = document.getElementById('editSynopsis');

    editTitle.value = books[index].title;
    editAuthor.value = books[index].author;
    editGenre.value = books[index].genre;
    editYear.value = books[index].publicationYear;
    editSynopsis.value = books[index].synopsis;

    const saveEditButton = document.getElementById('saveEditButton');
    saveEditButton.onclick = function () {
        editBook(index);
    };

    editForm.classList.remove('hidden');
}

function editBook(index) {
    const editTitle = document.getElementById('editTitle').value;
    const editAuthor = document.getElementById('editAuthor').value;
    const editGenre = document.getElementById('editGenre').value;
    const editYear = document.getElementById('editYear').value;
    const editSynopsis = document.getElementById('editSynopsis').value;

    if (!editTitle || !editAuthor || !editGenre || !editYear || !editSynopsis) {
        alert("Please fill in all the fields.");
        return;
    }

    if (isNaN(editYear) || editYear < 0) {
        alert("Please enter a valid publication year.");
        return;
    }

    books[index].title = editTitle;
    books[index].author = editAuthor;
    books[index].genre = editGenre;
    books[index].publicationYear = editYear;
    books[index].synopsis = editSynopsis;

    localStorage.setItem('books', JSON.stringify(books));

    const editForm = document.getElementById('editForm');
    editForm.classList.add('hidden');

    showDashboard();
}

function showDetailView(index) {
    const detailView = document.getElementById('detailView');
    const detailContent = document.getElementById('detailContent');
    const isDetailViewHidden = detailView.classList.contains('hidden');

    if (isDetailViewHidden || parseInt(detailContent.dataset.index) !== index) {
        
        detailContent.innerHTML = `
            <p>Title: ${books[index].title}</p>
            <p>Author: ${books[index].author}</p>
            <p>Genre: ${books[index].genre}</p>
            <p>Publication Year: ${books[index].publicationYear}</p>
            <p>Synopsis: ${books[index].synopsis}</p>
        `;
        detailContent.dataset.index = index; 

    } else {
        
        detailContent.innerHTML = '';
        detailContent.dataset.index = ''; 
    }

    detailView.classList.toggle('hidden');
}

showDashboard();

