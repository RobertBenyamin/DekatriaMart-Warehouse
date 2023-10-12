const csrf_token = document.body.getAttribute("data-csrf-token");

var itemCount = document.getElementById("totalItem").getAttribute("data-count");

async function getProducts() {
    return fetch(`get-item/`).then((res) => res.json());
}

async function refreshProducts() {
    document.getElementById("product_container").innerHTML = ""; // Hapus konten sebelumnya

    const products = await getProducts();

    products.forEach((item, index) => {
        // Buat elemen kartu untuk setiap item
        const card = document.createElement("div");
        card.className = "p-4 sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4"; // Atur gaya kartu di sini

        // Tambahkan class warna berbeda untuk kartu terakhir
        let backgroundClass = "bg-white";
        let textClass = "text-gray-800";
        let descriptionClass = "text-gray-600";
        if (index === products.length - 1) {
            backgroundClass = "bg-gray-700"; // Background color for the last card
            textClass = "text-white"; // Text color for the last card
            descriptionClass = "text-gray-300"; // Description text color for the last card
        }

        // Isi konten kartu
        card.innerHTML = `
            <div class="${backgroundClass} ${textClass} rounded-lg shadow-lg p-4" id="card-${item.pk}">
                <h2 class="text-xl font-semibold" id="name-${item.pk}">${item.fields.name}</h2>
                <p class="${descriptionClass}" id="description-${item.pk}">${item.fields.description}</p>
                <div class="flex justify-between items-center mt-4">
                <p class="text-lg font-semibold" id="price-${item.pk}">${item.fields.price}</p>
                <div>
                    <button onclick="decreaseAmount(${item.pk})" class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-l-full">-</button>
                    <span class="px-2 text-xl font-semibold" id="amount-${item.pk}">${item.fields.amount}</span>
                    <button onclick="increaseAmount(${item.pk})" class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-r-full">+</button>
                </div>
                </div>
                <button onclick="showEditItem(${item.pk})" class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full mt-4">Edit</button>
                <button class="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full mt-2" onclick="showDeleteConfirmation('${item.pk}', '${item.fields.name}')">Delete</button>
            </div>
            `;

        // Tambahkan kartu ke wadah kartu
        document.getElementById("product_container").appendChild(card);
    });
}

refreshProducts();

// Fungsi untuk menutup popup
function closePopUp(popupID) {
    const popup = document.getElementById(popupID);
    popup.style.display = "none";
}

// Fungsi untuk menampilkan popup add item
function showAddItem() {
    const popupAddItem = document.getElementById("addItem");
    popupAddItem.style.display = "block";
}

// Fungsi untuk menambahkan item dengan AJAX
async function addItem() {
    fetch(`create-ajax/`, {
        method: "POST",
        body: new FormData(document.querySelector("#form")),
    }).then(refreshProducts);

    // Update total item yang tersimpan
    const totalItemElement = document.getElementById("totalItem");
    totalItemElement.textContent = `Kamu menyimpan ${++itemCount} item pada aplikasi ini`;
    closePopUp("addItem");
    document.getElementById("form").reset();
    return false;
}

// Fungsi untuk menampilkan popup edit item
function showEditItem(itemID) {
    const editItemPopup = document.getElementById("editItem");

    // Isi nilai-nilai input sesuai dengan data item yang akan diedit
    const card = document.getElementById(`card-${itemID}`);
    const name = document.getElementById(`name-${itemID}`);
    const description = document.getElementById(`description-${itemID}`);
    const price = document.getElementById(`price-${itemID}`);

    document.getElementById("nameEdit").value = name.textContent;
    document.getElementById("amountEdit").value =
        card.querySelector("span").textContent;
    document.getElementById("descriptionEdit").value = description.textContent;
    document.getElementById("priceEdit").value = price.textContent;

    editItemPopup.style.display = "block";

    // Variabel untuk event listener
    const editButton = document.getElementById("editButton");
    const cancelButton = document.getElementById("editClose");

    // Define a function for editItem
    function editItemHandler() {
        editItem(itemID);

        // Menghapus event listener ketika selesai
        editButton.removeEventListener("click", editItemHandler);
        cancelButton.removeEventListener("click", cancelEditItem);
    }

    // Define a function for cancelEditItem
    function cancelEditItem() {
        closePopUp("editItem");

        // Menghapus event listener ketika selesai
        editButton.removeEventListener("click", editItemHandler);
        cancelButton.removeEventListener("click", cancelEditItem);
    }

    // Tambahkan event listener pada tombol "Edit Item" dan "Cancel"
    editButton.addEventListener("click", editItemHandler);
    cancelButton.addEventListener("click", cancelEditItem);
}

// Fungsi untuk mengedit item dengan AJAX
async function editItem(itemID) {
    fetch(`edit-item-ajax/${itemID}/`, {
        method: "POST",
        body: new FormData(document.querySelector("#editForm")),
    }).then(refreshProducts);

    closePopUp("editItem");
    document.getElementById("editForm").reset();
}

// Fungsi untuk menambahkan amount item dengan AJAX
async function increaseAmount(itemID) {
    const response = await fetch(`increase-amount/${itemID}/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": csrf_token,
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        const data = await response.json();
        if (data.success) {
            const newAmount = data.new_amount;
            document.getElementById(`amount-${itemID}`).textContent = newAmount;
        } else {
            console.error(data.error_message);
        }
    } else {
        console.error("Terjadi kesalahan saat mengirim permintaan.");
    }
}

// Fungsi untuk mengurangi amount item dengan AJAX
async function decreaseAmount(itemID) {
    const response = await fetch(`decrease-amount/${itemID}/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": csrf_token,
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        const data = await response.json();
        if (data.success) {
            const newAmount = data.new_amount;
            document.getElementById(`amount-${itemID}`).textContent = newAmount;
        } else {
            console.error(data.error_message);
        }
    } else {
        console.error("Terjadi kesalahan saat mengirim permintaan.");
    }
}

// Fungsi untuk menampilkan popup konfirmasi
function showDeleteConfirmation(itemID, itemName) {
    const deleteConfirmationText = document.getElementById(
        "deleteConfirmationText"
    );
    deleteConfirmationText.innerText = `Are you sure you want to delete "${itemName}"?`;
    const deleteConfirmation = document.getElementById("deleteConfirmation");
    deleteConfirmation.style.display = "block";

    // Variabel untuk event listener
    const deleteButton = document.getElementById("deleteButton");
    const cancelButton = document.getElementById("deleteClose");

    // Define a function for deleteItem
    function deleteItemHandler(event) {
        event.preventDefault();
        deleteItem(itemID);

        // Menghapus event listener ketika selesai
        deleteButton.removeEventListener("click", deleteItemHandler);
        cancelButton.removeEventListener("click", cancelDeleteItem);
    }

    // Define a function for cancelDeleteItem
    function cancelDeleteItem(event) {
        event.preventDefault();
        closePopUp("deleteConfirmation");

        // Menghapus event listener ketika selesai
        deleteButton.removeEventListener("click", deleteItemHandler);
        cancelButton.removeEventListener("click", cancelDeleteItem);
    }

    // Tambahkan event listener pada tombol "Delete Item" dan "Cancel"
    deleteButton.addEventListener("click", deleteItemHandler);
    cancelButton.addEventListener("click", cancelDeleteItem);
}

// Fungsi untuk menghapus item dengan AJAX
async function deleteItem(itemID) {
    const response = await fetch(`delete-item/${itemID}/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": csrf_token,
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        const data = await response.json();
        if (data.success) {
            // Hapus baris item dari tabel berdasarkan ID
            const cardToDelete = document.getElementById(`card-${itemID}`);
            if (cardToDelete) {
                cardToDelete.remove();
                refreshProducts();
            }
            // Update total item yang tersimpan
            const totalItemElement = document.getElementById("totalItem");
            totalItemElement.textContent = `Kamu menyimpan ${--itemCount} item pada aplikasi ini`;
        } else {
            console.error("Gagal menghapus item.");
        }
    } else {
        console.error("Terjadi kesalahan saat mengirim permintaan.");
    }

    // Tutup popup konfirmasi
    closePopUp("deleteConfirmation");
}
