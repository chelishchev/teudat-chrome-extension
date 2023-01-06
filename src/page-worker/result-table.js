export class ResultTable {
    constructor({gifPath}) {
        this.statusValue = null;
        this.lastCheckDatetime = null;
        this.resultList = null;
        this.gifPath = gifPath;
        this.loadingImage = null;
    }

    createNode() {
        const container = this.createElement('div', 'teudat-container');
        this.loadingImage = this.createLoadingImage();

        const statusRow = this.createRow([
            this.createElement('span', null, 'Status:&nbsp;'),
            this.statusValue = this.createElement('span', null, 'Working...'),
            this.loadingImage,
        ]);

        // const currentDepartmentInWork = this.createRow([
        //     this.createElement('span', null, 'Work with Department:&nbsp;'),
        //     this.departmentValue = this.createElement('span', null, '...'),
        // ]);

        const lastCheckDatetime = this.createRow([
            this.createElement('span', null, 'Last check:&nbsp;'),
            this.lastCheckDatetime = this.createElement('span', null, '...'),
        ]);

        const results = this.createRow([
            this.resultList = this.createElement('ul', null)
        ]);

        container.appendChild(statusRow);
        container.appendChild(lastCheckDatetime);
        container.appendChild(results);

        return container;
    }

    changeDepartment(departmentName) {
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
        this.statusValue.innerText = 'Working...';
    }

    changeStatusAsFinished() {
        this.statusValue.innerText = 'Finished';
        this.changeDepartment('end');
    }

    changeStatusAsError() {
        this.statusValue.innerText = 'Error. Please refresh the page and try again.';
        this.loadingImage.style.display = 'none';
    }

    clearResults() {
        this.resultList.innerHTML = '';
    }

    appendResult(department, payAttention = false) {
        const link = department.href;
        const name = department.name;
        const date = department.date;

        let hrefLink = this.createElement('span', null, 'no slots');
        if (date) {
            const formattedDate = (new Date(date)).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

            hrefLink = this.createElement('a', null, formattedDate);
            hrefLink.href = link;
            hrefLink.target = '_blank';
            if (payAttention) {
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