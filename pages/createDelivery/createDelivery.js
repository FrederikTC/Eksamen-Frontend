import { API_URL, FETCH_NO_API_ERROR } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"
import { sanitizeStringWithTableRows } from "../../utils.js"
const URL = API_URL + "/productorder"

export async function initDeliveryOrderList() {
  document.getElementById("form").onsubmit = submitDelivery

  try {
    const products = await fetch(URL).then(handleHttpErrors)
    const productRows = products.map(product => `
  <tr name="product-line">
  <td>${product.id}</td>
  <td>${product.productId}</td>
  <td>${product.quantity}</td>
  <td><input type="checkbox" id="${product.id}" name="checkbox-check" /></td>
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

function setStatusMsg(msg, isError) {
  const color = isError ? "red" : "darkgreen"
  const statusNode = document.getElementById("status")
  statusNode.style.color = color
  statusNode.innerText = msg
}

async function submitDelivery(e) {
  e.preventDefault();
  console.log("called");

  const delivery = {};
  delivery.productOrders = []

  document.getElementsByName("product-line").forEach( (productLine) => {
    if (productLine.children[3].children[0].checked) {
      delivery.productOrders.push(
        {
          "productId": productLine.children[1].innerHTML,
          "quantity": productLine.children[2].innerHTML
        }
      );
    }
  });

  try {
    
    
    delivery.deliveryDate = document.getElementById("input-deliverydate").value;
    delivery.fromWarehouse = document.getElementById("input-fromwarehouse").value;
    delivery.destination = document.getElementById("input-destination").value;

    if (delivery.deliveryDate === "" || delivery.fromWarehouse === "" || delivery.destination == "") {
      setStatusMsg(`Missing fields required for a submit`, true);
      return;
    }
    console.log(delivery)
    const options = {};
    options.method = "POST";
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(delivery);
    let newUrl = API_URL + "/delivery"
    console.log(options.body)
    console.log(newUrl);
    
    const newDelivery = await fetch(newUrl, options).then( (res) => setStatusMsg(`The new product is added to the list`), (error) => { console.log(error); } );

    
  } catch (err) {
        if (err.apiError) {
          setStatusMsg(err.apiError.message, true)
        } else {
          setStatusMsg(err.message + FETCH_NO_API_ERROR, true)
          console.error(err.message + FETCH_NO_API_ERROR)
        }
      }
}
