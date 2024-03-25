function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
}



$(document).ready(function () {

function promptForUsername() {
Swal.fire({
    title: 'Enter your name',
    input: 'text',
    inputLabel: 'Your name',
    inputPlaceholder: 'Type your name here',
    inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
    },
    showCancelButton: false,
    confirmButtonText: 'Submit',
    showLoaderOnConfirm: true,
    preConfirm: (name) => {
        if (!name) {
            Swal.showValidationMessage('Username cannot be empty');
        }
        return name;
    },
    allowOutsideClick: () => !Swal.isLoading()
}).then((result) => {
    if (result.isConfirmed) {
        const username = result.value;
        document.getElementById('userNameDisplay').textContent = `Welcome, ${username}!`;
    } else {
        promptForUsername(); 
    }
});
}

promptForUsername();

tampilkanData(); 
});

let sortByFirstAlphabet = true;

function sortData(key) {
    dataMahasiswa.sort((a, b) => {
        let itemA = a[key].toLowerCase();
        let itemB = b[key].toLowerCase();
        if (sortByFirstAlphabet) {
            return itemA.localeCompare(itemB);
        } else {
            return itemB.localeCompare(itemA);
        }
    });
    sortByFirstAlphabet = !sortByFirstAlphabet; 
    tampilkanData();
}

function tampilkanData(data = dataMahasiswa) {
    let tabel = document.getElementById('tabelData');
    tabel.innerHTML = '';
    let start = (currentPage - 1) * dataPerPage;
    let end = start + dataPerPage;
    let displayedData = data.slice(start, end);
    displayedData.forEach((mhs, index) => {
        let baris = `<tr>
            <td data-label="NIM">${mhs.nim}</td>
            <td data-label="Nama">${mhs.nama}</td>
            <td data-label="Alamat">${mhs.alamat}</td>
            <td id="bawahan" class="text-center text-md-start">`; 
            baris += `<button class="btn btn-primary btn-action me-2" onclick="tampilkanModalEdit(${start + index})"><i class="fas fa-pencil-alt"></i> Edit</button>
            <button class="btn btn-danger btn-action" onclick="hapusData(${start + index})"><i class="fas fa-eraser"></i> Hapus</button>`;

        baris += `</td>
    </tr>`;
        tabel.innerHTML += baris;
    });

    let dataInfo = document.getElementById('dataInfo');
    dataInfo.textContent = `Showing ${start + 1} to ${Math.min(start + displayedData.length, dataMahasiswa.length)} of ${dataMahasiswa.length} entries`;

    let paginationButtons = document.getElementById('paginationButtons');
    paginationButtons.innerHTML = '';
    for (let i = 1; i <= Math.ceil(dataMahasiswa.length / dataPerPage); i++) {
        let button = document.createElement('button');
        button.textContent = i;
        button.className = 'btnpage btn-secondary btn-action mr-1';
        button.onclick = function () {
            currentPage = i;
            tampilkanData();
        };
        paginationButtons.appendChild(button);
    }
}

function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateTime, 1000);

let dataMahasiswa = [];

if (localStorage.getItem('dataMahasiswa')) {
    dataMahasiswa = JSON.parse(localStorage.getItem('dataMahasiswa'));
}

let currentPage = 1;
let dataPerPage = 10;

function saveDataToLocalStorage() {
    localStorage.setItem('dataMahasiswa', JSON.stringify(dataMahasiswa));
}


function resetData() {
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Anda tidak dapat mengembalikan data yang sudah dihapus!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus semua data!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            dataMahasiswa = [];
            saveDataToLocalStorage();
            tampilkanData();
            Swal.fire({
                title: 'Sukses!',
                text: 'Semua data berhasil dihapus',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        }
    });
}

function changePerPage() {
    let selectBox = document.getElementById("show");
    dataPerPage = parseInt(selectBox.options[selectBox.selectedIndex].value);
    tampilkanData();
}

function tambahData() {
    let nim = document.getElementById('nim').value;
    let nama = document.getElementById('nama').value;
    let alamat = document.getElementById('alamat').value;

    if (!(/^\d+$/.test(nim))) {
        Swal.fire({
            title: 'Gagal!',
            text: 'NIM harus berupa angka!',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (nim && nama && alamat) {
        dataMahasiswa.push({ nim, nama, alamat });
        saveDataToLocalStorage();
        tampilkanData();
        Swal.fire({
            title: 'Sukses!',
            text: 'Data berhasil ditambahkan',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    } else {
        Swal.fire({
            title: 'Gagal!',
            text: 'Data tidak lengkap, tidak dapat menambahkan data',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

function tampilkanModalEdit(index) {
    let mhs = dataMahasiswa[index];
    document.getElementById('nimEdit').value = mhs.nim;
    document.getElementById('namaEdit').value = mhs.nama;
    document.getElementById('alamatEdit').value = mhs.alamat;
    document.getElementById('indexEdit').value = index;

    $('#myModal.modal').modal('show');
}

function tutupModal() {
    $('#myModal').modal('hide');
}

function simpanEdit() {
    let index = document.getElementById('indexEdit').value;
    dataMahasiswa[index].nama = document.getElementById('namaEdit').value;
    dataMahasiswa[index].alamat = document.getElementById('alamatEdit').value;
    saveDataToLocalStorage();
    tampilkanData();
    $('#myModal').modal('hide');
    Swal.fire({
        title: 'Sukses!',
        text: 'Data berhasil diubah',
        icon: 'success',
        confirmButtonText: 'OK'
    });
}

function hapusData(index) {
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Anda tidak dapat mengembalikan data yang sudah dihapus!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            dataMahasiswa.splice(index, 1);
            saveDataToLocalStorage();
            tampilkanData();
            Swal.fire({
                title: 'Sukses!',
                text: 'Data berhasil dihapus',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        }
    });
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        tampilkanData();
    }
}

function nextPage() {
    if (currentPage < Math.ceil(dataMahasiswa.length / dataPerPage)) {
        currentPage++;
        tampilkanData();
    }
}



window.onload = function () {
    tampilkanData();
};