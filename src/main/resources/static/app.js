const url = 'http://localhost:7070/api/users';
getAllUsers()

async function getAllUsers() {
    const res = await fetch(url)
    const users = await res.json()
    users.forEach(user => showUsersHtml(user))
}

function showUsersHtml(data) {
    const row = document.createElement("tr")
    row.id = "user" + data.id
    const rolesString = Array.isArray(data.roles)
        ? data.roles.map(roleObj => roleObj.role.replace(/^ROLE_/, '')).join(', ')
        : ''
    row.innerHTML = `
        <td>${data.id}</td>
        <td>${data.firstName}</td>
        <td>${data.lastName}</td>
        <td>${data.age}</td>
        <td>${data.email}</td>
        <td>${rolesString}</td>
        <td>
            <button onclick="modalEdit(${data.id}, '${data.firstName}', '${data.lastName}', ${data.age}, '${data.email}')"  
            type="button" class="btn btn-info" data-toggle="modal">Edit</button>
        </td>
        <td>
            <button onclick="modalDelete(${data.id}, '${data.firstName}', '${data.lastName}', ${data.age}, '${data.email}', '${rolesString}')"  
            type="button" class="btn btn-danger" data-toggle="modal">Delete</button>
        </td>
    `
    const tbody = document.getElementById('tbodyOfTable')
    tbody.appendChild(row)
}

//Всплывание модального окна для удаления для каждого юзера
function modalDelete(id, firstName, lastName, age, email, rolesString) {
    console.log(rolesString)
    const modalElement = document.getElementById('modalDelete')
    const modal = new bootstrap.Modal(modalElement)
    const deleteId = document.getElementById('deleteId')
    const deleteFirstname = document.getElementById('deleteFirstName')
    const deleteLastName = document.getElementById('deleteLastName')
    const deleteAge = document.getElementById('deleteAge')
    const deleteEmail = document.getElementById('deleteEmail')
    const deleteRoles = document.getElementById('deleteRoles')
    const deleteButton = document.getElementById('deleteButton')

    deleteRoles.innerHTML = ''

    let arrayOfRoles = rolesString.split(',').map(role =>
        role.trim().charAt(0).toUpperCase() + role.trim().slice(1).toLowerCase()
    )
    console.log(arrayOfRoles)

    deleteId.value = id
    deleteFirstname.value = firstName
    deleteLastName.value = lastName
    deleteAge.value = age
    deleteEmail.value = email

    arrayOfRoles.forEach(role => {
        const option = document.createElement('option')
        option.value = role
        option.textContent = role
        deleteRoles.appendChild(option)
    })
    deleteButton.onclick = function (event) {
        event.preventDefault()
        deleteUser(id, firstName, lastName, age, email, arrayOfRoles)
        modal.hide()
    }
    modal.show()
}

//Вспывание модального окна для редактирования для каждого юзера
function modalEdit(id, firstName, lastName, age, email) {
    const modalEdit = document.getElementById('modalEdit')
    const modal = new bootstrap.Modal(modalEdit)
    const editId = document.getElementById('editId')
    const editFirstname = document.getElementById('editFirstName')
    const editLastName = document.getElementById('editLastName')
    const editAge = document.getElementById('editAge')
    const editEmail = document.getElementById('editEmail')
    const editPassword = document.getElementById('editPassword')
    const editButton = document.getElementById('editButton')

    editId.value = id
    editFirstname.value = firstName
    editLastName.value = lastName
    editAge.value = age
    editEmail.value = email

    editButton.onclick = function (event) {
        event.preventDefault()
        updateUser(editId.value, editFirstname.value, editLastName.value, editAge.value, editEmail.value, editPassword.value)
        modal.hide()
    }

    modal.show()
}

// Функция удаление юзера
async function deleteUser(id) {
    try {
        const res = await fetch(`http://localhost:7070/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const answer = await res.text();
        console.log(answer)
        if (res.ok) {
            const row = document.getElementById(`user${id}`).remove();
        } else {
            console.error('Ошибка при удалении пользователя:', answer)
        }
    } catch (error) {
        console.error('Ошибка запроса на удаление пользователя:', error)
    }
}

//Функция обновления юзера
function updateUser(id, editFirstName, editLastName, editAge, editEmail, editPassword) {
    const roleMapping = {
        1: "ADMIN",
        2: "USER"
    };

    const selectedRoleIds = [...document.getElementById('editRoleSelect').selectedOptions]
        .map(option => {
            const roleId = parseInt(option.id)
            return {
                id: roleId,
                role: roleMapping[roleId] || ""
            };
        });

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id": id,
            "firstName": editFirstName,
            "lastName": editLastName,
            "age": editAge,
            "email": editEmail,
            "password": editPassword,
            "roles": selectedRoleIds
        })
    })
        .then(response => response.json())
        .then(res => {
            console.log(res);

            // Обновляем строку в таблице
            const row = document.getElementById(`user${id}`);
            if (row) {
                row.innerHTML = `
                    <td>${res.id}</td>
                    <td>${res.firstName}</td>
                    <td>${res.lastName}</td>
                    <td>${res.age}</td>
                    <td>${res.email}</td>
                    <td>${res.roles.map(roleObj => roleObj.role.replace(/^ROLE_/, '')).join(', ')}</td>
                    <td>
                        <button onclick="modalEdit(${res.id}, '${res.firstName}', '${res.lastName}', ${res.age}, '${res.email}')"
                        type="button" class="btn btn-info" data-toggle="modal">Edit</button>
                    </td>
                    <td>
                        <button onclick="modalDelete(${res.id}, '${res.firstName}', '${res.lastName}', ${res.age}, '${res.email}', '${res.roles.map(roleObj => roleObj.role.replace(/^ROLE_/, '')).join(', ')}')"
                        type="button" class="btn btn-danger" data-toggle="modal">Delete</button>
                    </td>
                `;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


//Форма для нового юзера
const myNewUserForm = document.getElementById('myFormToAddUser')
const firstName = document.getElementById('firstName')
const lastName = document.getElementById('lastName')
const age = document.getElementById('age')
const email = document.getElementById('email')
const password = document.getElementById('password')

myNewUserForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const selectedRoleIds = [...document.getElementById('roleSelect').selectedOptions].map(option => option.value);
    const objectsOfRoles = selectedRoleIds.map(number => ({id: number}));
    console.log(objectsOfRoles)

    const res = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "firstName": firstName.value,
            "lastName": lastName.value,
            "age": age.value,
            "email": email.value,
            "password": password.value,
            "roles": objectsOfRoles
        })
    }).then(res => res.json().then(res => showUsersHtml(res)))
    myNewUserForm.value = ''
    firstName.value = ''
    lastName.value = ''
    age.value = ''
    email.value = ''
    password.value = ''
})




