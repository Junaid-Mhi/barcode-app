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

// Load saved Auto Print setting

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
      displayValue: true,
    });

    barcodeProductName.textContent = productName;

    barcodeProductNumber.textContent = productNumber;

    barcodeCard.style.display = "block";

    setTimeout(() => {
      window.print();
    }, 300);
  } catch (error) {
    console.error(error);

    showError("Unable to generate barcode.");
  }
});

printButton.addEventListener("click", function () {
  window.print();
});

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
