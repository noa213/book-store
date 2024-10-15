import data from "./data.json" with {type: 'json'}

const container = document.getElementById('container');
const table = document.getElementById('table');

// localStorage.setItem('books', JSON.stringify(data.books));
const books = JSON.parse(localStorage.getItem('books')) || [];

function getBooks(sortBy = null) {
    if (sortBy === 'title') {
        books.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'price') {
        books.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }

    table.innerHTML = '';
    const header = document.createElement('tr');
    header.classList.add('header');
    header.innerHTML = `
        <th >Id</th>
        <th >Title</th>
        <th id='sort-prife' >Price</th>
        <th >Action</th>
    `;

    table.appendChild(header);
    // header.querySelector('.sort-title').addEventListener('click', () => getBooks('title'));

    books.forEach(book => {
        const card = document.createElement('tr');
        card.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.price}$</td>
            <td>
            <button type="button" class="read-btn" data-id="${book.id}">read</button>
            <button type="button" class="update-btn" data-id="${book.id}">update</button>
            <button type="button" class="remove-btn" data-id="${book.id}">remove</button><br></td>
        `;
        table.appendChild(card);

        // הוספת מאזין לאירוע כפתור המחיקה
        card.querySelector('.remove-btn').addEventListener('click', (event) => {
            const bookId = book.id;
            const bookIndex = books.findIndex(b => b.id === bookId);

            if (bookIndex > -1) {
                books.splice(bookIndex, 1);
                localStorage.setItem('books', JSON.stringify(books));
                getBooks();
            }
        });

        card.querySelector('.read-btn').addEventListener('click', () => {
            showBookDetails(book);
        });

        card.querySelector('.update-btn').addEventListener('click', () => {
            showUpdateForm(book);
        });
    });
}

function showBookDetails(book) {
    const detailsCard = document.createElement('div');
    detailsCard.classList.add('details-card');
    detailsCard.innerHTML = `
        <h2>פרטי הספר</h2>
        <p><strong>Id:</strong> ${book.id}</p>
        <p><strong>Title:</strong> ${book.title}</p>
        <p><strong>Price:</strong> ${book.price} $</p>
        <p><strong>Cover Image:</strong></p>
        <img src="${book.img}" alt="${book.title} cover" style="width:100px; height:auto;">
        <p><strong>Rating:</strong> <span id="book-rating">${book.rating || 'לא דירוג'}</span></p>
        <label for="rating-slider">דרג את הספר:</label>
        <input type="range" id="rating-slider" min="1" max="5" value="${book.rating || 1}" step="1">
        <button id="close-details">סגור</button>
    `;
    container.appendChild(detailsCard);
    document.getElementById('rating-slider').addEventListener('input', function () {
        const rating = this.value;
        book.rating = rating;
        document.getElementById('book-rating').innerText = rating;
        localStorage.setItem('books', JSON.stringify(books));
    });
    // הוספת מאזין לכפתור הסגירה
    document.getElementById('close-details').addEventListener('click', () => {
        detailsCard.remove();
    });
}

function showUpdateForm(book) {
    // ניקוי טופס עדכון קודם אם קיים
    const existingForm = document.getElementById('update-form');
    if (existingForm) existingForm.remove();

    const updateForm = document.createElement('div');
    updateForm.id = 'update-form';
    updateForm.innerHTML = `
        <h1>Update Book</h1>
        <label for="update-id">Id: <input type="text" id="update-id" value="${book.id}" disabled></label><br>
        <label for="update-title">Title: <input type="text" id="update-title" value="${book.title}"></label><br>
        <label for="update-price">Price: <input type="text" id="update-price" value="${book.price}"></label><br>
        <label for="update-img">Cover Image URL: <input type="text" id="update-img" value="${book.img}"></label><br>
        <button type="button" id="save-update">Save</button><br>
    `;
    container.appendChild(updateForm);

    // הוספת מאזין לכפתור השמירה
    document.getElementById('save-update').addEventListener('click', function () {
        const updatedTitle = document.getElementById('update-title').value;
        const updatedPrice = document.getElementById('update-price').value;
        const updatedImg = document.getElementById('update-img').value;

        book.title = updatedTitle;
        book.price = updatedPrice;
        book.img = updatedImg;
        updateForm.remove();

        localStorage.setItem('books', JSON.stringify(books));
        getBooks();
    });
}

document.getElementById('new-book-btn').addEventListener('click', function () {
    const existingForm = document.getElementById('add-form');
    if (existingForm) existingForm.remove();

    const addForm = document.createElement('div');
    addForm.id = 'add-form';
    addForm.innerHTML = `
        <h1>New Book</h1>
        <label for="new-id">Id: <input type="text" id="new-id"></label><br>
        <label for="new-title">Title: <input type="text" id="new-title"></label><br>
        <label for="new-price">Price: <input type="text" id="new-price"></label><br>
        <label for="new-img">Cover Image URL: <input type="text" id="new-img"></label><br>
        <button type="button" id="add-new">Add</button><br>
    `;
    container.appendChild(addForm);

    // הוספת מאזין לכפתור השמירה
    document.getElementById('add-new').addEventListener('click', function () {
        const id = document.getElementById('new-id').value;
        const title = document.getElementById('new-title').value;
        const price = document.getElementById('new-price').value;
        const img = document.getElementById('new-img').value;

        books.push({ id, title, price, img });
        addForm.remove();

        localStorage.setItem('books', JSON.stringify(books));
        getBooks();
    });
});
document.getElementById('sort-title').addEventListener('click', () => getBooks('title'));
document.getElementById('sort-price').addEventListener('click', () => getBooks('price'));

getBooks();
