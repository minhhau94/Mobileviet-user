let productList = [];
let productItem = {};
let cartItemList = [];

// ĐƯA SẢN PHẨM LÊN GIAO DIỆN
const renderProduct = (data) => {
  if (!data) data = productList;

  var productHTML = "";

  for (let index in data) {
    let currentProduct = data[index];
    let salePrice = (1- (currentProduct.sale / 100)) * currentProduct.price

    productHTML += `<div class="item" data-key="${currentProduct.id}">
    <div class="img">
      <img
        src="${currentProduct.img}"
        alt=""
      />
    </div>
    <div class="item-content">
      <div class="item-title">${currentProduct.name}</div>
      <div class="item-main">
        <ul>
          <li>Màn hình: ${currentProduct.screen}</li>
          <li>RAM, ROM: ${currentProduct.memory}</li>
          <li>Camera sau: ${currentProduct.backCamera}</li>
          <li>Camera trước: ${currentProduct.frontCamera}</li>
          <li>Pin, Sạc: ${currentProduct.battery}</li>
        </ul>
      </div>
      <div class="add">
      <div>
        <div class="salePrice">${formatCash(salePrice)}</div>
        <div class="price">${formatCash(currentProduct.price)}</div>
      </div>
        <button class="add-btn" onClick="getProductItem(${currentProduct.id})">MUA NGAY</button>
      </div>
    </div>
  </div>`;
  }

  document.getElementById("productList").innerHTML = productHTML;
};

const getProductList = async() => {
  try {
    const res = await axios({
      url: "https://6355725b483f5d2df3b4a6ce.mockapi.io/api/phones",
      method: "GET",
    });
    productList = res.data;
    renderProduct();
    console.log("done", productList);
  } catch (error) {
    console.log(error);
  }
};

// const mapData = (data) => {
//   let result = [];

//   for (var i = 0; i < data.length; i++) {
//     let oldProduct = data[i];
//     let newProduct = new Product(
//       oldProduct.id,
//       oldProduct.type,
//       oldProduct.name,
//       oldProduct.price,
//       oldProduct.screen,
//       oldProduct.backCamera,
//       oldProduct.frontCamera,
//       oldProduct.battery,
//       oldProduct.img,
//       oldProduct.describe
//     );
//     result.push(newProduct);
//   }
//   return result;
// };

window.onload = () => {
  console.log("onload");
  getProductList();
  getCartItemList();
};

// GIỎ HÀNG
const getProductItem = async (id) => {
  try {
    const res = await axios({
      url: "https://6355725b483f5d2df3b4a6ce.mockapi.io/api/phones/" + id,
      method: "GET",
    });

    productItem = res.data;
    addToCart();
    console.log("done", productItem);
  } catch (error) {
    console.log(error);
  }
};

const addToCart = () => {
  let salePrice = (1 - productItem.sale / 100) * productItem.price;
  let newCartItem = productItem;

  let cartIem = new CartItem(
    newCartItem.id,
    newCartItem.name,
    salePrice,
    newCartItem.img,
    1
  );

  console.log(cartIem);

  // kiểm trả trong giỏ hàng đã có sản phẩm đó chưa
  let test = 0;
  for (let i = 0; i < cartItemList.length; i++) {
    if (cartItemList[i].id == productItem.id) {
      cartItemList[i].quantity++;
      test = 1;
      break;
    }
  }
  if (test === 0) {
    cartItemList.push(cartIem);
  }
  renderCartItemList(cartItemList);
  renderQuantity();
  setCartItemList();
};

const renderQuantity = () => {
  let quantityItem = 0;

  if (cartItemList.length !== 0) {
    quantityItem = cartItemList.length;
  }

  document.getElementById("quantityItem").innerHTML = quantityItem;
};

const renderCartItemList = () => {
  let cartItemHTML = "";
  let totalAmount = 0;
  let totalquatity = cartItemList.length;
  

  for (let i = 0; i < cartItemList.length; i++) {
    let currentCartItem = cartItemList[i];
    let amount = currentCartItem.price * currentCartItem.quantity;
    totalAmount += amount;

    // thẻ <sup></sup> để sủ dùng cho số nhỏ ở trên
    cartItemHTML += `<tr>
    <td>
      <img
        src="${currentCartItem.img}"
      />
    </td>
    <td><div>${currentCartItem.name}</div></td>
    <td>
      <div>${formatCash(currentCartItem.price)}</div>
    </td>
    <td>
      <div class="buttons_added">
        <input
          class="minus is-form"
          type="button"
          value="-"
          onclick="minus(${
            currentCartItem.id
          })"
        />
        <input
          aria-label="quantity"
          class="input-qty"
          id="input-qty"
          min="0"
          name=""
          type="number"
          value=${currentCartItem.quantity}
        />
        <input class="plus is-form" type="button" value="+" onclick="plus(${
          currentCartItem.id
        })"/>
      </div>
    </td>
    <td><div>${formatCash(amount)}</div></td>
    <td>
      <button class="btnDelete" onclick="deleteCartItem(${currentCartItem.id})">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </td>
  </tr>`;
  }
  let priceTotalHTML = `<p>Tổng thanh toán <span>(${totalquatity} sản phẩm):</span> <span class="amount" id="amount">${formatCash(
    totalAmount
  )}</span></p>`;

  document.getElementById("tbodyCart").innerHTML = cartItemHTML;
  document.getElementById("price-total").innerHTML = priceTotalHTML;
};

const setCartItemList = () => {
  var cartItemListJSON = JSON.stringify(cartItemList);

  localStorage.setItem("cart", cartItemListJSON);
};

const getCartItemList = () => {
  let cartItemListJSON = localStorage.getItem("cart");

  if (!cartItemListJSON) return;
  cartItemList = JSON.parse(cartItemListJSON);

  renderCartItemList();
  renderQuantity();
};

const deleteCartItem = (id) => {
  let index = cartItemList.findIndex((item) => item.id == id);

  if (index !== -1) {
    cartItemList.splice(index, 1);
  }
  // let index = findCartItemId(id);

  renderCartItemList();
  renderQuantity();
  setCartItemList();
};

const plus = (id) => {
  const res = [];
  const currentItem = cartItemList;
  const foundItem = currentItem.find((item) => id == item.id);

  if (foundItem.quantity > 0) {
    foundItem.quantity += 1;
    res.push(foundItem);
  }

  // for (let i in cartItemList){
  //   const currentItem = cartItemList[i];
  //   if(currentItem.id == id) {
  //     currentItem.quantity+=1;
  //     res.push(currentItem);
  //   }
  // }

  renderCartItemList();
  setCartItemList();
};

const minus = (id) => {
  const res = [];
  const currentItem = cartItemList;
  const foundItem = currentItem.find((item) => id == item.id);
  let text = `Bạn muốn xóa sản phẩm ${foundItem.name} khỏi giỏ hàng?`;

  if (foundItem.quantity == 1) {
    if (confirm(text) == true) {
      deleteCartItem(foundItem.id);
    }
  } else {
    foundItem.quantity -= 1;
    res.push(foundItem);
  }

  renderCartItemList();
  setCartItemList();
};

// show cart
// const showCart = () => {
//   document.getElementById("cart").classList.toggle("hiddenCart");
// };

// // chọn điện thoại theo hãng
const searchType = () => {
  let result = [];
  let phoneType = document.getElementById("phoneType").value;

  if (phoneType == "totalType") {
    result = productList;
    renderProduct(result);
  }

  for (let i = 0; i < productList.length; i++) {
    if (productList[i].type == phoneType) {
      result.push(productList[i]);
    }
  }
  console.log(result);
  renderProduct(result);
};

// có thể dùng hàm findIndex để thay thế hàm này
// function findCartItemId(id) {
//   for (var i = 0; i < cartItemList.length; i++) {
//     if (cartItemList[i].id === id) {
//       return i;
//     }
//   }
//   return -1;
// }

// const vdPrice = 12345;
// const VND = new Intl.NumberFormat("vi-VN", {
//   style: "currency",
//   currency: "VND",
// });

// console.log(VND.format(vdPrice));

const formatCash = (price) => {
  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return VND.format(price);
};