//import "https://unpkg.com/navigo"  
import "./navigo.js"

import {
  setActiveLink, adjustForMissingHash, renderTemplate, loadHtml
} from "./utils.js"

import { initAddproduct } from "./pages/addProduct/addProduct.js"
import { initProducts } from "./pages/products/products.js"
import { initProductOrder } from "./pages/productorder/productOrder.js"
import { initProductOrderList } from "./pages/productOrderList/productOrderList.js"
import { initDeliveryOrderList } from "./pages/createDelivery/createDelivery.js"
import { initDeliveryList } from "./pages/deliveryList/deliveryList.js"

window.addEventListener("load", async () => {

  const templateAddproduct = await loadHtml("./pages/addProduct/addProduct.html")
  const templateProducts = await loadHtml("./pages/products/products.html")
  const templateProductOrder = await loadHtml("./pages/productorder/productOrder.html")
  const templateProductOrderList = await loadHtml("./pages/productorderlist/productOrderList.html")
  const templateDeliveryOrderList = await loadHtml("./pages/createDelivery/createDelivery.html")
  const templateDeliveryList = await loadHtml("./pages/deliveryList/deliveryList.html")

  adjustForMissingHash()

  const router = new Navigo("/", { hash: true });
  window.router = router

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url)
        done()
      }
    })
    .on({
      "/": () => document.getElementById("content").innerHTML = `
        
     `,
      "/add-product": () => {
        renderTemplate(templateAddproduct, "content")
        initAddproduct()
        
      },
      "/products": () => {
        renderTemplate(templateProducts, "content")
        initProducts()
        
      },
      "/product-order": () => {
        renderTemplate(templateProductOrder, "content")
        initProductOrder()
        
      },
      "/product-order-list": () => {
        renderTemplate(templateProductOrderList, "content")
        initProductOrderList()
        
      },
      "/delivery-order-list": () => {
        renderTemplate(templateDeliveryOrderList, "content")
        initDeliveryOrderList()
        
      },
      "/delivery-list": () => {
        renderTemplate(templateDeliveryList, "content")
        initDeliveryList()
        
      },
      
    })
    .notFound(() => {
      renderTemplate(templateNotFound, "content")
    })
    .resolve()
});


window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
    + ' Column: ' + column + ' StackTrace: ' + errorObj);
}