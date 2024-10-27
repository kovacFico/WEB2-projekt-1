function showForm(id) {
    const form = document.getElementById(id).nextElementSibling;
    form.style.display = form.style.display === "none" ? "block" : "none";
}

