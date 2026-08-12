const productNameInput = document.querySelector("#product-name");

const productNumberInput = document.querySelector("#product-number");

const generateButton = document.querySelector("#generate-button");

const printButton = document.querySelector("#print-button");

const barcodeCard = document.querySelector("#barcode-card");

const barcode = document.querySelector("#barcode");

const barcodeProductName = document.querySelector("#barcode-product-name");

const barcodeProductNumber = document.querySelector("#barcode-product-number");

const errorMessage = document.querySelector("#error-message");

function showError(message) {
  errorMessage.textContent = message;

  errorMessage.style.display = "block";
}

function clearError() {
  errorMessage.textContent = "";

  errorMessage.style.display = "none";
}


document.addEventListener('paste', function (e) {
    e.preventDefault();

    const pastedData = (e.clipboardData || window.clipboardData)
        .getData('text');

    const values = pastedData
        .split(/\t|\n/)
        .map(value => value.trim())
        .filter(value => value !== '');

    const numberInput =
        document.getElementById('product-number');

    const nameInput =
        document.getElementById('product-name');

    if (values.length > 0) {
        numberInput.value = values[0];
    }

    if (values.length > 1) {
        nameInput.value = values[1];
    }
});

generateButton.addEventListener("click", function () {
  clearError();

  const productName = productNameInput.value.trim();

  const productNumber = productNumberInput.value.trim();

  if (!productName) {
    showError("Please enter a product name.");

    productNameInput.focus();

    return;
  }

  if (!productNumber) {
    showError("Please enter a product number.");

    productNumberInput.focus();

    return;
  }

  if (typeof JsBarcode === "undefined") {
    showError("Barcode library is not loaded.");

    return;
  }

  try {
    JsBarcode("#barcode", productNumber, {
      format: "CODE128",
      width: 2,
      height: 30,
      displayValue: false,
    });

    barcodeProductNumber.textContent = productNumber;

    barcodeProductName.textContent = productName;


      barcodeProductName.textContent =
    productName.length > 82
        ? productName.substring(0, 82) + '...'
        : productName;


    barcodeCard.style.display = "block";
    
    productNumberInput.value = '';

    setTimeout(() => {
      window.print();
    }, 300);

  
  } catch (error) {
    console.error(error);

    showError("Unable to generate barcode.");
  }
});

printButton.addEventListener("click", async function () { // 
  try {
    await window.__TAURI_INTERNALS__.invoke(
      "plugin:printer-v2|print_html",
      {
        options: {
          html: document.documentElement.outerHTML,
          pageWidth: 70,
          pageHeight: 32,
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
          copies: 1,
          orientation: "Portrait"
        }
      }
    );
    console.log("Label sent to printer");
  } catch (error) {
    console.error("Printing failed:", error);
    alert("Printing failed: " + error);
  }
});



// printButton.addEventListener("click", function () {
//   try {

//         await window.__TAURI_INTERNALS__.invoke(
//             "plugin:printer-v2|print_html",
//             {
//                 options: {
//                     html: document.documentElement.outerHTML,

//                     pageWidth: 70,
//                     pageHeight: 32,

//                     margin: {
//                         top: 0,
//                         right: 0,
//                         bottom: 0,
//                         left: 0
//                     },

//                     copies: 1,
//                     orientation: "Portrait"
//                 }
//             }
//         );

//         console.log("Label sent to printer");

//     } catch (error) {

//         console.error("Printing failed:", error);

//         alert("Printing failed: " + error);

//     }
// });

productNumberInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    generateButton.click();
  }
});

productNameInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    productNumberInput.focus();
  }
});
