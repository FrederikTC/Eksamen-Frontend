import { handleHttpErrors } from "../../utils.js"
import { API_URL,FETCH_NO_API_ERROR } from "../../settings.js"

//Add id to this URL to get a single user
const URL = API_URL + "/products"

export async function initAddproduct(match) {
  document.getElementById("form").onsubmit = submitProduct

}

function setStatusMsg(msg, isError) {
  const color = isError ? "red" : "darkgreen"
  const statusNode = document.getElementById("status")
  statusNode.style.color = color
  statusNode.innerText = msg
}


async function submitProduct(evt) {
  evt.preventDefault()

  try {
    const product = {}
    product.name = document.getElementById("name").value
    product.price = document.getElementById("price").value
    product.weight = document.getElementById("weight").value

    if (product.name === "" || product.price === "" || product.weight == "") {
      setStatusMsg(`Missing fields required for a submit`, true)
      return
    }

    const options = {}
    options.method = "POST"
    options.headers = { "Content-type": "application/json" }
    options.body = JSON.stringify(product)

    const newProduct = await fetch(URL, options).then(handleHttpErrors)
    setStatusMsg(`The new product is added to the list`)

  } catch (err) {

    if (err.apiError) {
      setStatusMsg(err.apiError.message, true)
    } else {
      setStatusMsg(err.message + FETCH_NO_API_ERROR, true)
      console.error(err.message + FETCH_NO_API_ERROR)
    }
  }
}

