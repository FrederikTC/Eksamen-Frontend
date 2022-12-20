import { API_URL, FETCH_NO_API_ERROR } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"
import { sanitizeStringWithTableRows } from "../../utils.js"
const URL = API_URL + "/delivery"

export async function initDeliveryList() {
  try {
    const deliveries = await fetch(URL).then(handleHttpErrors)
    const deliveryRows = deliveries.map(delivery => `
  <tr>
  <td>${delivery.id}</td>
  <td>${delivery.deliveryDate}</td>
  <td>${delivery.fromWarehouse}</td>
  <td>${delivery.destination}</td>
  </tr>
  `).join("\n")

    const safeRows = sanitizeStringWithTableRows(deliveryRows);
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