const NODE_IDS = {
    ID_KEYPAD: 'ID_KEYPAD',
    PHONE_KEYPAD: 'PHONE_KEYPAD',
    mobileNumber: 'mobileNumber',
}
export class FormFiller {

    constructor() {
        this.observer = this.buildIntersectionObserver();
        this.expectedNodesWithCallbacks = new Map();
    }

    buildIntersectionObserver() {
        const options = {
            rootMargin: '0px',
            threshold: 1.0
        };

        return new IntersectionObserver(this.handleIntersection.bind(this), options);
    }

    handleIntersection(entries, observer) {
        entries.forEach((entry) => {
            if(!entry.isIntersecting) {
                return;
            }
            if(!this.expectedNodesWithCallbacks.has(entry.target)) {
                return;
            }
            const callback = this.expectedNodesWithCallbacks.get(entry.target);
            callback();

            this.expectedNodesWithCallbacks.delete(entry.target);
            this.observer.unobserve(entry.target);
        });
    }

    doWhenElementVisible(node, callback) {
        this.expectedNodesWithCallbacks.set(node, callback);
        this.observer.observe(node);
    }

    fill(person) {
        this.fillIDTeudat(person.idNumber);
        this.fillPhoneShort(person.shortMobilePhone);
        this.fillMobileNumber(person.phoneNumber);

        this.registerAutoFiller(person);
    }

    registerAutoFiller(person) {
        const processFill = this.debounce(() => {
            this.fillIDTeudat(person.idNumber);
            this.fillPhoneShort(person.shortMobilePhone);
            this.fillMobileNumber(person.phoneNumber);
        }, 250);

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes') {
                    const nodeId = mutation.target.id;
                    if (NODE_IDS.hasOwnProperty(nodeId)) {
                        processFill();
                    }
                }
            });
        });

        observer.observe(document.body, {childList: true, subtree: true, attributes: true,});
    }

    debounce(fn, delay) {
        let timer = null;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(context, args);
            }, delay);
        }
    }

    isVisible(node) {
        return node && node.offsetParent !== null;
    }

    fillIDTeudat(idNumber) {
        const idTeudat = document.querySelector(`#${NODE_IDS.ID_KEYPAD}`);

        const work = (node) => {
            this.setValueAndDispatchEvent(node, idNumber);
            this.submitFormAfterDelay('form[name="questionnaireForm"] button', 100);
        }
        if (idTeudat) {
            if (this.isVisible(idTeudat)) {
                work(idTeudat);
            } else {
                this.doWhenElementVisible(idTeudat, () => work(idTeudat));
            }
        }
    }

    fillPhoneShort(shortMobilePhone) {
        const phoneShort = document.querySelector(`#${NODE_IDS.PHONE_KEYPAD}`);

        const work = (node) => {
            this.setValueAndDispatchEvent(node, shortMobilePhone);
            this.submitFormAfterDelay('form[name="questionnaireForm"] button', 100);
        }

        if (phoneShort) {
            if (this.isVisible(phoneShort)) {
                work(phoneShort);
            } else {
                this.doWhenElementVisible(phoneShort, () => work(phoneShort));
            }
        }
    }

    fillMobileNumber(phoneNumber) {
        const mobileNumber = document.querySelector(`#${NODE_IDS.mobileNumber}`);
        const work = (node) => {
            this.setValueAndDispatchEvent(node, phoneNumber);
            this.submitFormAfterDelay('form[name="smsSettingsForm"] input[type="submit"]', 200);
            this.focusElementAfterDelay('#verficationNumber', 400);
        }

        if (mobileNumber) {
            if (this.isVisible(mobileNumber)) {
                work(mobileNumber);
            } else {
                this.doWhenElementVisible(mobileNumber, () => work(mobileNumber));
            }
        }
    }

    setValueAndDispatchEvent(node, value) {
        node.value = value;
        const event = new Event('input');
        node.dispatchEvent(event);
    }

    submitFormAfterDelay(selector, delay) {
        setTimeout(() => {
            const continueButton = document.querySelector(selector);
            if (this.isVisible(continueButton)) {
                continueButton.click();
            } else {
                console.log('submitFormAfterDelay continueButton not found', Date.now());
            }
        }, delay);
    }

    focusElementAfterDelay(selector, delay) {
        setTimeout(() => {
            const element = document.querySelector(selector);
            if (element) {
                element.focus();
            }
        }, delay);
    }
}