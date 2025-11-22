import {ProductComponent} from "../../components/product/index.js";
import {BackButtonComponent} from "../../components/back-button/index.js";
import {MainPage} from "../main/index.js";
import {Alerts} from "../../components/alerts/index.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent
        this.id = id
        this.alerts = null
    }
    
    getData() {
        const allProducts = [
            {
                id: 1,
                src: "https://royal-groom.ru/sites/default/files/styles/large/public/breed/taiskaya.jpg?itok=T9aOkpFN",
                title: "Тайская кошка",
                text: "Умная, общительная и разговорчивая порода с ярко-голубыми глазами."
            },
            {
                id: 2,
                src: "https://yac-wh-sb-prod-s3-media-07001.storage.yandexcloud.net/media/images/Shutterstock_80825497.max-2880x1820.format-jpeg.jpg",
                title: "Персидская кошка",
                text: "Спокойный и ласковый характер, требует регулярного ухода за шерстью."
            },
            {
                id: 3,
                src: "https://royal-groom.ru/sites/default/files/styles/large/public/breed/skottishfold.jpg?itok=M1gsogkC",
                title: "Шотландская вислоухая",
                text: "Дружелюбная, адаптивная кошка с уравновешенным характером."
            },
        ]
        
        // Находим продукт по ID, преобразуем this.id в число
        const productId = parseInt(this.id)
        return allProducts.find(product => product.id === productId)
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
                const data = this.getData()
                
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

        const data = this.getData()
        
        // Добавляем проверку на случай, если продукт не найден
        if (!data) {
            console.error(`Product with id ${this.id} not found`)
            this.pageRoot.innerHTML = `<p>Продукт не найден</p>`
            return
        }
        
        const product = new ProductComponent(this.pageRoot)
        product.render(data)

        // Настраиваем систему уведомлений
        this.setupAlerts()
    }
}