
const COUNT_OF_DAYS = 16;
const SEEMS_CLOSE_DATE = COUNT_OF_DAYS*24*60*60*1000;

export class ResultTable {
    constructor({gifPath, backendService}) {
		/** @type {BackendService} */
		this.backendService = backendService;
        this.statusValue = null;
        this.errorStatusValue = null;
        this.lastCheckDatetime = null;
        this.resultList = null;
        this.gifPath = gifPath;
        this.loadingImage = null;
    }

    createNode() {
        const container = this.createElement('div', 'teudat-container');
        this.loadingImage = this.createLoadingImage();

        const settingRow = this.createRow([
            document.createTextNode('Изменить отделения для поиска вы можете на странице расширения MyVisit Rega Helper, кликнув на значок (🧩) в правом верхнем углу браузера'),
            document.createElement('br'),
            document.createElement('br'),
        ]);

        const statusRow = this.createRow([
            this.createElement('span', null, 'Статус:&nbsp;'),
            this.statusValue = this.createElement('span', null, 'Ищем...'),
            this.loadingImage,
        ]);

        const lastCheckDatetime = this.createRow([
            this.createElement('span', null, 'Последняя проверка:&nbsp;'),
            this.lastCheckDatetime = this.createElement('span', null, '...'),
        ]);

        const results = this.createRow([
            this.resultList = this.createElement('ul', null)
        ]);

        container.appendChild(settingRow);
        container.appendChild(statusRow);
        container.appendChild(lastCheckDatetime);
        container.appendChild(results);

        return container;
    }

    changeDepartment(departmentName) {
        this.statusValue.innerText = 'Ищем...' + ' ' + departmentName;
        // this.departmentValue.innerText = departmentName;
    }

    changeLastCheckDatetime() {
        const currentDateTime = (new Date()).toLocaleTimeString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        this.lastCheckDatetime.innerText = currentDateTime;
    }

    changeStatusAsWorking() {
        this.statusValue.innerText = 'Ищем...';
    }

    changeStatusAsFinished() {
        this.statusValue.innerText = 'Закончили';
    }

    changeStatusAsContinue() {
        this.errorStatusValue = null;
        this.statusValue.innerText = 'Продолжим поиск через несколько минут...';
    }

    changeStatusAsError(type) {
        if (this.errorStatusValue) {
            return;
        }
        if (type === 'blockedPage') {
            this.statusValue.innerText = 'Ошибка. Пожалуйста, перезагрузите страницу через 30-40 минут и попробуйте снова.';
        } else {
            this.statusValue.innerText = 'Ошибка. Пожалуйста, перезагрузите страницу и попробуйте снова.';
        }
        this.errorStatusValue = type;
        this.loadingImage.style.display = 'none';
    }

    clearResults() {
        this.resultList.innerHTML = '';
    }

	isCloseEnough(dateString) {
		return (new Date(dateString)).getTime() - Date.now() < SEEMS_CLOSE_DATE;
	}

    appendResult(department) {
        const link = department.href;
        const name = department.name;
        const date = department.date;
        const serviceId = department.serviceId;

        let hrefLink = this.createElement('span', null, 'no slots');
        if (date) {
            const closeEnough = this.isCloseEnough(date);
			if(closeEnough) {
				console.warn('CLOSE ENOUGH', name, date, Date.now());
				this.backendService.notify('closeDate', {
                    department: {
                        name,
                        serviceId,
                    },
                    date
                });
			}

            const formattedDate = (new Date(date)).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

            hrefLink = this.createElement('a', null, formattedDate);
            hrefLink.href = link;
            hrefLink.target = '_blank';
            if (closeEnough) {
                hrefLink.style.color = 'forestgreen';
            }
        }

        const departmentNode = this.createElement('li', null, [
            this.createElement('span', null, name + ':&nbsp;'),
            hrefLink
        ]);

        this.resultList.appendChild(departmentNode);
    }

    createRow(children) {
        const row = this.createElement('div', 'teudat-row');
        children.forEach(child => row.appendChild(child));

        return row;
    }

    createLoadingImage() {
        const img = document.createElement('img');
        img.src = this.gifPath;
        img.style.width = '25px';
        img.style.height = '25px';

        return img;
    }

    createElement(type, className, innerHTML) {
        const element = document.createElement(type);
        if (className) {
            element.classList.add(className);
        }
        if(Array.isArray(innerHTML)) {
            innerHTML.forEach(child => element.appendChild(child));
        }
        else if (typeof innerHTML === 'string') {
            element.innerHTML = innerHTML;
        }
        return element;
    }

    renderTo(node) {
        node.appendChild(this.node);
    }
}