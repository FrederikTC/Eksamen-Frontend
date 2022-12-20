import { API_URL, FETCH_NO_API_ERROR } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"
import { sanitizeStringWithTableRows } from "../../utils.js"
const URL = API_URL + "/products"

export async function initProducts() {
  document.getElementById("search-input").onchange = filterAndShowProducts;
  document.getElementById("table-rows").onclick = gotoToAddOrder;
  await filterAndShowProducts();
}
async function gotoToAddOrder(evt) {
  const target = evt.target


  if (!target.id.includes("-column-id")) {
    return
  }
  const id = target.id.replace("-column-id", "")
  window.router.navigate("product-order")
}

async function filterAndShowProducts() {
  try {
    const products = await fetch(URL).then(handleHttpErrors)
    let filteredproducts = products;
    const searchStr = document.getElementById("search-input").value
    let searchTypeId = undefined;
    try {
      searchTypeId = parseInt(searchStr);
    } catch (err) {
      console.debug(err);
    }
    if (searchStr.length > 0 && Number.isInteger(searchTypeId)) {


      filteredproducts = products.filter((item) => { return item.id == searchTypeId });
    } else if (searchStr.length > 0) {
      filteredproducts = products.filter((item) => { return item.name.toLowerCase().includes(searchStr.toLowerCase()) });
    }
    const productRows = filteredproducts.map(product => `
  <tr>
  <td>${product.id}</td>
  <td>${product.name}</td>
  <td>${product.price}</td>
  <td>${product.weight}</td>
  <td><button id="${product.id}-column-id" class="btn btn-sm btn-secondary">Order</button> </td>      
  </tr>
  `).join("\n")

    const safeRows = sanitizeStringWithTableRows(productRows);
    document.getElementById("table-rows").innerHTML = safeRows
  } catch (err) {
    if (err.apiError) {
      document.getElementById("error").innerText = err.apiError.message
    } else {
      document.getElementById("error").innerText = err.message + FETCH_NO_API_ERROR
      console.error(err.message + FETCH_NO_API_ERROR)
    }
  }
}
