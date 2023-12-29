
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
});

async function addUser() {
  const userForm = document.getElementById('userForm');
  const formData = new FormData(userForm);

  try {

    const imageFile = formData.get('image');
    const imageUrl = await uploadImageToCloudinary(imageFile);

    const user = {};
    formData.forEach((value, key) => {
      user[key] = value;
    });

    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const result = await response.json();
    console.log('User added:', result);

    loadUsers();
  } catch (error) {
    console.error('Error adding user:', error);
  }
}

async function uploadImageToCloudinary(imageFile) {
  const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dmubojkcz/image/upload';
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('upload_preset', 'preset');

  const response = await fetch(cloudinaryUrl, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  return result.secure_url;
}

async function loadUsers() {
  const userListDiv = document.getElementById('userList');

  try {
    const response = await fetch('http://localhost:3000/api/users');
    const users = await response.json();

    userListDiv.innerHTML = '<h2>User List</h2>';
    users.forEach(user => {
      userListDiv.innerHTML += `
        <div>
          <p>Name: ${user.name}</p>
          <p>Email: ${user.email}</p>
          <p>Phone: ${user.phone}</p>
          <p>DOB: ${user.dob}</p>
          <button onclick="editUser('${user._id}')">Edit</button>
          <button onclick="deleteUser('${user._id}')">Delete</button>
        </div>
      `;
    });
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

async function editUser(userId) {

}

async function deleteUser(userId) {
  try {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    console.log('User deleted:', result);

    loadUsers();
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}
