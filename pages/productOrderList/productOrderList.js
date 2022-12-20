import { API_URL, FETCH_NO_API_ERROR } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"
import { sanitizeStringWithTableRows } from "../../utils.js"
const URL = API_URL + "/productorder"

export async function initProductOrderList() {
  try {
    const products = await fetch(URL).then(handleHttpErrors)
    const productRows = products.map(product => `
  <tr>
  <td>${product.id}</td>
  <td>${product.productId}</td>
  <td>${product.quantity}</td>
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
