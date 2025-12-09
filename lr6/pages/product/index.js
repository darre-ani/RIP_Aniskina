import {ProductCardComponent} from "../../components/product-card/index.js";
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
        this.data = null
    }
    
    getData() {
        ajax.get(stockUrls.getStocks(), (data) => {
            this.renderData(data);
        })
    }

    // Добавляем метод для получения статических данных
    getStaticData() {
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

    renderData(items) {
        // Находим товар по ID
        const item = items.find(item => item.id == this.id);
        if (item) {
            const productCard = new ProductCardComponent(this.pageRoot)
            productCard.render(item, this.clickCard.bind(this))
        }
    }

    getProductAlertContent() {
        return this.getStaticData();
    }

    get pageRoot() {
        return document.getElementById('product-page')
    }

    getHTML() {
        return `
            <div id="product-page">
                <div id="liveAlertPlaceholder" style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1050; max-width: 500px;"></div>
                <div class="container mt-4">
                    <div id="back-button-container" class="mb-3"></div>
                    <div id="product-card-container"></div>
                    <div class="text-center mt-4">
                        <button type="button" class="btn btn-primary" id="liveAlertBtn">Показать информацию о породе</button>
                    </div>
                </div>
            </div>
        `
    }
    
    clickBack() {
        const mainPage = new MainPage(this.parent)
        mainPage.render()
    }

    clickCard() {
        console.log('Card clicked')
    }

    setupAlerts() {
        this.alerts = new Alerts(this.pageRoot)
        
        const alertTrigger = document.getElementById('liveAlertBtn')
        if (alertTrigger) {
            alertTrigger.addEventListener('click', () => {
                const alertContent = this.getProductAlertContent()
                
                if (alertContent) {
                    const customMessage = `
                        <h4 class="alert-heading">${alertContent.title}</h4>
                        <hr>
                        <p class="mb-0">${alertContent.content}</p>
                    `
                    
                    const alertTypes = {
                        1: 'info',
                        2: 'warning', 
                        3: 'success'
                    }
                    const alertType = alertTypes[this.id] || 'success'
                    
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
                    this.alerts.error('Информация о породе не найдена')
                }
            })
        }
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const backButton = new BackButtonComponent(this.pageRoot.querySelector('#back-button-container'))
        backButton.render(this.clickBack.bind(this))

        this.getData()
        this.setupAlerts()
    }
}