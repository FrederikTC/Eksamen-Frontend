
import { API_URL, FETCH_NO_API_ERROR } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"
import { sanitizeStringWithTableRows } from "../../utils.js"
const URL = API_URL + "/products"

let productIdInput
let productQuantityInput


export async function initProductOrder() {

  //Initialise nodes used more than once
  productIdInput = document.getElementById("product-id")
  productQuantityInput = document.getElementById("product-quantity")
  
  try {
    const products = await fetch(URL).then(handleHttpErrors)
    document.getElementById("table-rows").onclick = setupProductOrderModal
    const productRows = products.map(product => `
  <tr>
  <td>${product.id}</td>
  <td>${product.name}</td>
  <td>${product.price}</td>
  <td>${product.weight}</td>
  <td><button data-product=${JSON.stringify(product)} id="${product.id}-product-id" class="btn btn-sm btn-secondary" data-bs-toggle="modal" data-bs-target="#productOrder-modal">Order Product</button> </td>      
  </tr>
  `).join("\n")

    const safeRows = sanitizeStringWithTableRows(productRows);
    document.getElementById("table-rows").innerHTML = safeRows
  } catch (err) {
    if (err.apiError) {
      setStatusMsg(err.apiError.message, true, "error")
    } else {
      setStatusMsg(err.message + FETCH_NO_API_ERROR, true, "error")
      console.error(err.message + FETCH_NO_API_ERROR)
    }
  }
}

async function setupProductOrderModal(evt) {
  const btn = evt.target
  if (!btn.id.includes("product-id")) {
    return 
  }
  const product = JSON.parse(btn.dataset.product)
  const headerText = `Order product:`
  document.getElementById("productOrder-modal-label").innerText = headerText
  
  productIdInput.value = product.id
  productQuantityInput.value = ""
  
  setStatusMsg("", false)
  document.getElementById("btn-productOrder").onclick = productOrder
}

async function productOrder() {
  const URL = API_URL + "/productorder"
  const productorderRequest = {}    
  productorderRequest.productId = productIdInput.value
  productorderRequest.quantity = productQuantityInput.value
  const fetchOptions = {}
  fetchOptions.method = "POST"
  fetchOptions.headers = { "Content-Type": "application/json" }
  fetchOptions.body = JSON.stringify(productorderRequest)
  try {
    setStatusMsg("Product was added to order list", true)
    await fetch(URL, fetchOptions).then(handleHttpErrors)
    setStatusMsg("Product was added to order list", true)
    
  } catch (ex) {
    const errorMsg = ex.apiError ? ex.apiError.message : ex.message
    setStatusMsg(errorMsg, true)
  }
}
function setStatusMsg(msg, isError) {
  const color = isError ? "red" : "darkgreen"
}