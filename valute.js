function createElement(tag, append, id = "", className = "", content = "", value = "", placeholder = "") {
    let tagName = document.createElement(tag);

    id !== "" ? tagName.id = id : "";
    className !== "" ? tagName.className = className : "";
    value !== "" ? tagName.value = value : "";
    placeholder !== "" ? tagName.placeholder = placeholder : "";

    tagName.innerHTML = content;
    append.appendChild(tagName);

    return tagName;
}

async function runAPI() {
    let container = document.querySelector(".container")
    let selectTag = document.querySelector(".form-select");

    let bankAPI = "https://cbu.uz/uz/arkhiv-kursov-valyut/json/";
    let bankData = await fetch(bankAPI);
    let valuteData = await bankData.json();

    let div = createElement("div", document.body, "container");

    let tagSelect = createElement("select", div, "selection");

    createElement("option", tagSelect, "", "option", "Mamlakatni tanlang", "");

    valuteData.forEach((country, i) => {
        createElement("option", tagSelect, country.CcyNm_UZ, "option", country.CcyNm_UZ, i);
    });

    let changed = false;
    let selectedRate = null;

    // Handle currency selection and show rate
    tagSelect.addEventListener("change", function(event) {
        let country = valuteData[event.target.value];
        selectedRate = parseFloat(country.Rate);

        let p = document.querySelector("p.date");
        if (!p) {
            p = createElement("p", div, "", "date", "Sana: " + country.Date);
        } else {
            p.textContent = "Sana: " + country.Date;
        }

        let h1 = document.querySelector("h1.countryName");
        if (!h1) {
            h1 = createElement("h1", div, "", "countryName", country.CcyNm_UZ);
        } else {
            h1.textContent = country.CcyNm_UZ;
        }

        let h3 = document.querySelector("h3.rate");
        if (!h3) {
            h3 = createElement("h3", div, "", "rate", country.Rate + " so'm");
        } else {
            h3.textContent = country.Rate + " so'm";
        }
    });

    // Create input fields and buttons
    let div2 = createElement("div", div, "div2", "div2");
    let inpUz = createElement("input", div2, "uz", "uz", "", "", "UZS");
    inpUz.type = "number";

    let btnSwap = createElement("button", div2, "swap", "swap", "<i class='bi bi-arrow-left-right'></i>", "", "");

    let inpValute = createElement("input", div2, "valute", "valute", "", "", "Currency");
    inpValute.type = "number";

    let btnCalc = createElement("button", div2, "calculate", "calculate", "Convert", "", "");

    btnSwap.addEventListener("click", function () {
        changed = !changed;

        // Swap placeholder labels
        let tempPlaceholder = inpUz.placeholder;
        inpUz.placeholder = inpValute.placeholder;
        inpValute.placeholder = tempPlaceholder;

        // Swap input values too
        let tempValue = inpUz.value;
        inpUz.value = inpValute.value;
        inpValute.value = tempValue;
    });

    btnCalc.addEventListener("click", function () {
        if (!selectedRate) {
            alert("Iltimos, avval valyutani tanlang.");
            return;
        }

        if (!inpUz.value) {
            alert("Iltimos, miqdorni kiriting.");
            return;
        }

        let result;
        if (!changed) {
            // Convert from UZS to selected currency
            result = parseFloat(inpUz.value) / selectedRate;
            inpValute.value = result.toFixed(2);
        } else {
            // Convert from selected currency to UZS
            result = parseFloat(inpUz.value) * selectedRate;
            inpValute.value = result.toFixed(2);
        }
    });
    document.body.appendChild(div);
}
runAPI();