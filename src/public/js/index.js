const socket = io();
const form = document.getElementById("form");
const formDelete = document.getElementById("formDelete");
const allProducts = document.getElementById("allProducts") || "";

socket.emit("products");

socket.on("products", (products) => {
  const productsList = products.map(
    (product) =>
      `<li> Title: ${product.title} - Code: ${product.code} - Id: ${product.id}</li>`
  );
  allProducts.innerHTML = productsList.join("");
});

form.addEventListener("submit", () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const code = document.getElementById("code").value;
  const stock = document.getElementById("stock").value;

  if (!title || !description || !price || !code || !stock) {
    alert("Todos los campos son requeridos");
    return;
  }

  socket.emit("addProduct", {
    title,
    description,
    price,
    code,
    stock,
    status: true,
    thumbnail: ["non-image"],
    category: "testing",
  });
});

formDelete.addEventListener("submit", () => {
  const id = Number(document.getElementById("deleteId").value);
  socket.emit("deleteProduct", id);
});
