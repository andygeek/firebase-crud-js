// Instantiating Firestore
var db = firebase.firestore();

// Users and user select
let users = [];
let user_select;

const body_table = document.getElementById("body-table");
const save_add = document.getElementById("save_add");
const save_changes = document.getElementById("save_changes");

const txt_name = document.getElementById("txt_name");
const txt_last_name = document.getElementById("txt_last_name");
const txt_country = document.getElementById("txt_country");

const txt_edit_name = document.getElementById("txt_edit_name");
const txt_edit_last_name = document.getElementById("txt_edit_last_name");
const txt_edit_country = document.getElementById("txt_edit_country");

// Render the table
function renderTable() {
  let rows = "";
  users.forEach((element) => {
    rows =
      rows +
      `
            <tr>
                <td>${element.name}</td>
                <td>${element.last_name}</td>
                <td>${element.country}</td>
                <td>
                    <button class="btn btn-warning btn-edit" data-toggle="modal" data-target="#modal_edit" id="btn_edit" data-id="${element.id}">Edit</button>
                    <button class="btn btn-danger btn-delete" data-id="${element.id}">Delete</button>
                </td>
            </tr>
        `;
  });
  body_table.innerHTML = rows;

  // Defining delete button
  const btn_delete = document.querySelectorAll(".btn-delete");
  btn_delete.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      db.collection("users")
        .doc(e.target.dataset.id)
        .delete()
        .then(function () {
          cargarUsuarios();
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
    });
  });

  // Defining edit button
  const btn_edit = document.querySelectorAll(".btn-edit");
  btn_edit.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      //console.log(e.target.dataset.id)
      var obj = users.find((x) => x.id === e.target.dataset.id);
      user_select = obj;
      console.log(obj);
      txt_edit_name.value = obj.name;
      txt_edit_last_name.value = obj.last_name;
      txt_edit_country.value = obj.country;
    });
  });
}

// Fill users list
async function cargarUsuarios() {
  db.collection("users")
    .get()
    .then((querySnapshot) => {
      users = [];
      querySnapshot.forEach((element) => {
        let user = {
          id: element.id,
          name: element.data().name,
          last_name: element.data().last_name,
          country: element.data().country,
        };
        users.push(user);
      });
      renderTable();
    });
}

// When the DOM complete charge
window.addEventListener("DOMContentLoaded", async (e) => {
  await cargarUsuarios();
  //renderTable();
});

// Edit user
save_changes.addEventListener("click", function () {
  let new_user = {
    name: txt_edit_name.value,
    last_name: txt_edit_last_name.value,
    country: txt_edit_country.value,
  };
  db.collection("users")
    .doc(user_select.id)
    .update(new_user)
    .then(function () {
      console.log("Document successfully updated!");
      cargarUsuarios();
    })
    .catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
});

// Add user
save_add.addEventListener("click", function () {
  let name = txt_name.value;
  let last_name = txt_last_name.value;
  let country = txt_country.value;

  db.collection("users")
    .add({
      name: name,
      last_name: last_name,
      country: country,
    })
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
      cargarUsuarios();
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
  txt_name.value = "";
  txt_last_name.value = "";
  txt_country.value = "";
});
