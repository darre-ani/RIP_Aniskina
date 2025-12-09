import {ProductCardComponent} from "../../components/product-card/index.js";
import {ProductPage} from "../product/index.js";
import {ajax} from "../../modules/ajax.js";
import {stockUrls} from "../../modules/stockUrls.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    get pageRoot() {
        return document.getElementById('main-page')
    }
    
    getHTML() {
        return (
            `
                <header>
                    <h1 align="center">Главная страница</h1>
                </header>
                
                <div id="main-page" class="d-flex flex-wrap gap-3 justify-content-center"><div/> 
            `
        )
    }
        
    getData() {
    return [
        {
            id: 1,
            src: "https://i.pinimg.com/originals/c9/ea/65/c9ea654eb3a7398b1f702c758c1c4206.jpg",
            title: "Акция",
            text: "Такой акции вы еще не видели 1"
        },
        {
            id: 2,
            src: "https://i.pinimg.com/originals/c9/ea/65/c9ea654eb3a7398b1f702c758c1c4206.jpg",
            title: "Акция",
            text: "Такой акции вы еще не видели 2"
        },
        {
            id: 3,
            src: "https://yac-wh-sb-prod-s3-media-07001.storage.yandexcloud.net/media/images/Shutterstock_80825497.max-2880x1820.format-jpeg.jpg",
            title: "Акция",
            text: "Такой акции вы еще не видели 3"
        },
    ]
    }
    clickCard(e) {
        const cardId = e.target.dataset.id

        const productPage = new ProductPage(this.parent, cardId)
        productPage.render()
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)
        
        const data = this.getData()
        data.forEach((item) => {
            const productCard = new ProductCardComponent(this.pageRoot)
            productCard.render(item, this.clickCard.bind(this))
        })
    }
}







import {ProductComponent} from "../../components/product/index.js";
import {BackButtonComponent} from "../../components/back-button/index.js";
import {MainPage} from "../main/index.js";
import {Alerts} from "../../components/alerts/index.js";

import {ajax} from "../../modules/ajax.js";
import {stockUrls} from "../../modules/stockUrls.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent
        this.id = id
        this.alerts = null
    }
    
    getData() {
        ajax.get(stockUrls.getStocks(), (data) => {
            this.renderData(data);
        })
    }


    renderData(item) {
        const product = new ProductCardComponent(this.pageRoot)
        product.render(item)
    }
    

    getProductAlertContent() {
        const messages = {
            1: {
                title: "Тайская кошка",
                content: "Элегантная кошка с акромеланическим окрасом (светлое тело с тёмными лапами, мордочкой и хвостом). Умная, общительная и разговорчивая порода. Обладает ярко-голубыми глазами и крепким телосложением."
            },
            2: {
                title: "Персидская кошка", 
                content: "Пушистая аристократка с плоской мордочкой и большими выразительными глазами. Спокойный и ласковый характер. Требует регулярного ухода за длинной густой шерстью."
            },
            3: {
                title: "Шотландская вислоухая",
                content: "Уникальная порода с загнутыми вперёд ушками и круглыми глазами. Дружелюбная, адаптивная кошка с уравновешенным характером. Бывает как короткошёрстной, так и длинношёрстной."
            }
        }
        return messages[this.id] 
    }

    get pageRoot() {
        return document.getElementById('product-page')
    }

    getHTML() {
    return `
        <div id="product-page" >
            <div id="liveAlertPlaceholder" style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1050; max-width: 500px; "></div>
            <button type="button" class="btn btn-primary"  id="liveAlertBtn">Показать живое уведомление</button>
        </div>
    `
    }
    
    clickBack() {
        const mainPage = new MainPage(this.parent)
        mainPage.render()
    }

    clickCard() {
        // Обработчик клика по карточке продукта
        console.log('Card clicked')
    }

    setupAlerts() {
        // Инициализируем систему уведомлений
        this.alerts = new Alerts(this.pageRoot)
        
        // Переопределяем обработчик кнопки для показа информации о продукте
        const alertTrigger = document.getElementById('liveAlertBtn')
        if (alertTrigger) {
            // Удаляем старый обработчик, если он есть
            alertTrigger.replaceWith(alertTrigger.cloneNode(true))
            
            // Добавляем новый обработчик с уникальным сообщением для каждой страницы
            document.getElementById('liveAlertBtn').addEventListener('click', () => {
                const alertContent = this.getProductAlertContent()
                const data = this.getStaticData()
                
                if (data) {
                    // Создаем кастомное сообщение с HTML
                    const customMessage = `
                        <h4 class="alert-heading">${alertContent.title}</h4>
                        <hr>
                        <p class="mb-0">${alertContent.content}</p>
                    `
                    
                    // Используем разные типы уведомлений для разных страниц
                    const alertTypes = {
                        1: 'info',
                        2: 'warning', 
                        3: 'success'
                    }
                    const alertType = alertTypes[this.id] || 'success'
                    
                    // Вызываем соответствующий метод алерта с кастомным HTML
                    switch(alertType) {
                        case 'info':
                            this.alerts.alert(customMessage, 'info')
                            break
                        case 'warning':
                            this.alerts.alert(customMessage, 'warning')
                            break
                        case 'success':
                            this.alerts.alert(customMessage, 'success')
                            break
                        default:
                            this.alerts.alert(customMessage, 'success')
                    }
                } else {
                    this.alerts.error('Продукт не найден')
                }
            })
        }
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const backButton = new BackButtonComponent(this.pageRoot)
        backButton.render(this.clickBack.bind(this))

        this.getData()
    }
}