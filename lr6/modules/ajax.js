class Ajax {
    /**
     * GET запрос
     * @param {string} url - Адрес запроса
     * @param {function} callback - Функция обратного вызова (data, status)
     */
    async get(url, callback) {
        try {
            const response = await fetch(url);
            await this._handleResponse(response, callback);
        } catch (error) {
            console.error('Network error:', error);
            callback(null, 0);
        }
    }

    /**
     * POST запрос
     * @param {string} url - Адрес запроса
     * @param {object} data - Данные для отправки
     * @param {function} callback - Функция обратного вызова (data, status)
     */
    async post(url, data, callback) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            await this._handleResponse(response, callback);
        } catch (error) {
            console.error('Network error:', error);
            callback(null, 0);
        }
    }

    /**
     * PATCH запрос
     * @param {string} url - Адрес запроса
     * @param {object} data - Данные для обновления
     * @param {function} callback - Функция обратного вызова (data, status)
     */
    async patch(url, data, callback) {
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            await this._handleResponse(response, callback);
        } catch (error) {
            console.error('Network error:', error);
            callback(null, 0);
        }
    }

    /**
     * DELETE запрос
     * @param {string} url - Адрес запроса
     * @param {function} callback - Функция обратного вызова (data, status)
     */
    async delete(url, callback) {
        try {
            const response = await fetch(url, {
                method: 'DELETE'
            });
            await this._handleResponse(response, callback);
        } catch (error) {
            console.error('Network error:', error);
            callback(null, 0);
        }
    }

    /**
     * Обработчик ответа
     * @param {Response} response - Объект ответа Fetch API
     * @param {function} callback - Функция обратного вызова
     */
    async _handleResponse(response, callback) {
        try {
            const text = await response.text();
            let data = null;
            if (text) {
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.error('Ошибка парсинга JSON:', e);
                }
            }
            callback(data, response.status);
        } catch (error) {
            console.error('Response handling error:', error);
            callback(null, response?.status || 0);
        }
    }
}

export const ajax = new Ajax();