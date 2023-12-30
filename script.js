document.addEventListener("DOMContentLoaded", () => {
    getCard("", 'card-field')
    getCategory()
});

function getCard(_category = "", _htmlId, _page = 0, _id = 0) {
    const offset = 10
    console.log("Time to fetch")
    let url = ""
    if (_category == "") {
        if (_id == 0)
            url = `https://fakestoreapi.com/products`
        else
            url = `https://fakestoreapi.com/products/${_id}`
    } else {
        url = `https://fakestoreapi.com/products/category/${_category}`
    }

    console.log(url)

    const cardField = document.getElementById(_htmlId)
    if (cardField != null) {

        const paginationField = document.getElementById('pagination')
        while (paginationField.firstChild) {
            paginationField.firstChild.remove()
        }

        while (cardField.firstChild) {
            cardField.firstChild.remove()
        }



        fetch(url)
            .then(res => res.json())
            .then(json => {
                if (!Array.isArray(json))
                    create(json, true)
                else {
                    console.log(typeof json)
                    let start = _page * offset
                    let end = start + offset
                    for (let index = start; index < end; index++) {
                        const element = json[index];
                        if (element !== undefined)
                            create(element, false)
                    }

                    let pageCount = json.length / offset
                    if (pageCount > 1) {
                        const pagination = document.getElementById("pagination")
                        for (let index = 0; index < pageCount; index++) {
                            pagination.appendChild(createPagination(pagination, index))
                        }
                    }
                }
            })
    } else {
        console.log("Can't find card-field")
    }
    console.log("Fetch ended")

    function create(element, isModal = false) {
        let card = document.createElement('div')
        card.className = 'card'
        if (isModal)
            card.style = "padding: 1rem"
        else
            card.style = "width: 15rem; padding: 1rem"
        card.onclick = function () { getDescription(element.id) }

        let imageCard = document.createElement('img')
        imageCard.src = element.image
        imageCard.className = "card-img-top"

        let cardBody = document.createElement('div')
        cardBody.className = "card-body d-flex align-items-end"

        let cardText = document.createElement('ul')
        cardText.className = "list-group list-group-flush"

        let cardName = document.createElement('li')
        cardName.className = "list-group-item"
        cardName.textContent = `${element.title}`
        cardText.appendChild(cardName)

        let cardPrice = document.createElement('li')
        cardPrice.className = "list-group-item"
        cardPrice.textContent = `Цена: $${element.price}`
        cardText.appendChild(cardPrice)

        let cardCategory = document.createElement('li')
        cardCategory.className = "list-group-item"
        cardCategory.textContent = `Категория: ${element.category}`
        cardText.appendChild(cardCategory)

        let cardRate = document.createElement('li')
        cardRate.className = "list-group-item"
        cardRate.textContent = `Оценка: ${element.rating.rate}`
        cardText.appendChild(cardRate)

        if (isModal) {
            let cardRateCount = document.createElement('li')
            cardRateCount.className = "list-group-item"
            cardRateCount.textContent = `Количество оценок: ${element.rating.count}`
            cardText.appendChild(cardRateCount)

            let cardDescription = document.createElement('li')
            cardDescription.className = "list-group-item"
            cardDescription.textContent = `Описание: ${element.description}`
            cardText.appendChild(cardDescription)
        }

        cardBody.appendChild(cardText)
        card.appendChild(imageCard)
        card.appendChild(cardBody)

        cardField.appendChild(card)
    }

    function createPagination(_element, _num) {
        let liPage = document.createElement('li')
        liPage.className = "page-item"

        let aPage = document.createElement('a')
        aPage.className = "page-link"
        aPage.textContent = _num + 1
        aPage.onclick = function () { getCard("", "card-field", _num, 0) }

        liPage.appendChild(aPage)
        return liPage
    }
}

function getCategory() {
    console.log("Time to fetch category")
    fetch('https://fakestoreapi.com/products/categories')
        .then(res => res.json())
        .then(json => {
            const categoryMenu = document.getElementById("category-menu")
            json.forEach(element => {
                let categoryLi = document.createElement('li')
                let categoryButton = document.createElement('button')

                categoryButton.className = "dropdown-item"
                categoryButton.type = "button"
                categoryButton.textContent = element
                categoryButton.onclick = function () { getProductsInCategory(element) }
                categoryLi.appendChild(categoryButton)
                categoryMenu.appendChild(categoryLi)
            });
        })
    console.log("Fetch ended")
}

function getProductsInCategory(_category) {
    console.log("Time to fetch products category " + _category)
    getCard(_category, 'card-field')
    console.log("Fetch ended")
}

function getDescription(_id) {
    const elemModal = document.querySelector('#product-description');
    const modal = new bootstrap.Modal(elemModal);
    getCard("", "modal-body", 1, _id)

    modal.show()
}