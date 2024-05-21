document.addEventListener('DOMContentLoaded', function () {
    const userList = document.getElementById('userList');
    let usersData;
    let currentUserId;
    window.myModal = new bootstrap.Modal(document.getElementById('editUserModal'));

    window.loadUsers = function () {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:8080/Java_lab5_war_exploded/user', true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                usersData = JSON.parse(xhr.responseText);
                displayUsers(usersData);
            } else {
                console.error('Произошла ошибка при загрузке списка пользователей:', xhr.statusText);
            }
        };

        xhr.send();
    }

    function displayUsers(users) {
        let tableHTML = `
        <table class="table table-striped table-bordered" style="width: 100%;">
            <thead class="thead-dark">
                <tr>
                    <th style="width: 20%;">Имя</th>
                    <th style="width: 20%;">Почта</th>
                    <th style="width: 20%;">Телефон</th>
                    <th style="width: 20%;">Телеграм</th>
                    <th style="width: 20%;">Вк</th>
                    <th style="width: 30%;">Действия</th> 
                </tr>
            </thead>
            <tbody>
    `;

        users.forEach(function (user) {
            tableHTML += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.telegram}</td>
                <td>${user.vk}</td>
                <td>
                    <button onclick="editUser(${user.id})">Редактировать</button>
                    <button onclick="deleteUser(${user.id})">Удалить</button>
                </td>
            </tr>
        `;
        });

        tableHTML += `
            </tbody>
        </table>
    `;

        userList.innerHTML = tableHTML;
    }

    window.editUser = function (userId) {
        const selectedUser = usersData.find(user => user.id === userId);

        document.getElementById('editName').value = selectedUser.name;
        document.getElementById('editEmail').value = selectedUser.email;
        document.getElementById('editPhone').value = selectedUser.phone;
        document.getElementById('editTelegram').value = selectedUser.telegram;
        document.getElementById('editVK').value = selectedUser.vk;
        currentUserId = userId;
        myModal.show();
    }
    window.saveChanges = function () {
        const name = document.getElementById('editName').value;
        const email = document.getElementById('editEmail').value;
        const phone = document.getElementById('editPhone').value;
        const telegram = document.getElementById('editTelegram').value;
        const vk = document.getElementById('editVK').value;

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', `http://localhost:8080/Java_lab5_war_exploded/user`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            if (xhr.status === 200) {
                loadUsers();
                myModal.hide();
            } else {
                console.error('Произошла ошибка при сохранении изменений:', xhr.statusText);
            }
        };

        xhr.send(JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            telegram: telegram,
            vk: vk,
            id: currentUserId
        }));
    }
    window.deleteUser = function (userId) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:8080/Java_lab5_war_exploded/user?id=${userId}`, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                loadUsers(); // Обновляем список после успешного удаления
            } else {
                console.error('Произошла ошибка при удалении машины:', xhr.statusText);
            }
        };

        xhr.send();
        console.log("Удаление пользователя с ID:", userId);
    }

    loadUsers();
});