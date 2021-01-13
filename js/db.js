db.enablePersistence().catch(function (err) {
  if (err.code == "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
  } else if (err.code == "unimplemented") {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
  }
});
const contactForm = document.querySelector(".add-contact form");
const addContactModal = document.querySelector("#add_contact_modal");
const editForm = document.querySelector(".edit-contact form");
const editContactModal = document.querySelector("#edit_contact_modal");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const contact = {
    name: contactForm.name.value,
    phone: contactForm.phone.value,
    favorite: false,
  };

  db.collection("contacts")
    .add(contact)
    .then(() => {
      contactForm.reset();
      let instance = M.Modal.getInstance(addContactModal);
      instance.close();
      contactForm.querySelector(".error").textContent = "";
    })
    .catch((err) => {
      contactForm.querySelector(".error").textContent = err.message;
    });
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const contact = {
    name: editForm.name.value,
    phone: editForm.phone.value,
  };

  db.collection("contacts")
    .doc(updateId)
    .update(contact)
    .then(() => {
      editForm.reset();
      let instance = M.Modal.getInstance(editContactModal);
      instance.close();
      editForm.querySelector(".error").textContent = "";
    })
    .catch((err) => {
      editForm.querySelector(".error").textContent = err.message;
    });
});

db.collection("contacts").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    console.log(change, change.doc.data(), change.doc.id);
    if (change.type === "added") {
      if (
        window.location.pathname == "/" ||
        window.location.pathname == "/index.html"
      ) {
        renderContacts(change.doc.data(), change.doc.id);
      }
      if (window.location.pathname == "/pages/favorite.html") {
        if (change.doc.data().favorite) {
          renderContacts(change.doc.data(), change.doc.id);
        }
      }
    }
    if (change.type === "removed") {
      removeContact(change.doc.id);
    }
    if (change.type === "modified") {
      updateContact(change.doc.data(), change.doc.id);
    }
  });
});

const contactContainer = document.querySelector(".contacts");

let updateId = null;
contactContainer.addEventListener("click", (e) => {
  console.log(e.target.textContent);
  if (e.target.textContent === "delete_outline") {
    const id = e.target.parentElement.getAttribute("data-id");
    db.collection("contacts").doc(id).delete();
  }
  if (e.target.textContent === "edit") {
    updateId = e.target.parentElement.getAttribute("data-id");
    const contact = document.querySelector(`.contact[data-id=${updateId}]`);
    const name = contact.querySelector(".name").innerHTML;
    const phone = contact.querySelector(".phone").innerHTML;
    /* console.log(name, phone); */

    editForm.name.value = name;
    editForm.phone.value = phone;
  }
  if (e.target.textContent === "star_border") {
    const id = e.target.parentElement.getAttribute("data-id");
    contact = { favorite: true };

    db.collection("contacts").doc(id).update(contact);
  }
  if (e.target.textContent === "star") {
    const id = e.target.parentElement.getAttribute("data-id");
    contact = { favorite: false };

    db.collection("contacts").doc(id).update(contact);
  }
});
