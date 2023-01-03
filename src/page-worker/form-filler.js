const NODE_IDS = {
    ID_KEYPAD: 'ID_KEYPAD',
    PHONE_KEYPAD: 'PHONE_KEYPAD',
    mobileNumber: 'mobileNumber',
}
export class FormFiller {

    constructor() {
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


    fillIDTeudat(idNumber) {
        const idTeudat = document.querySelector(`#${NODE_IDS.ID_KEYPAD}`);
        if (idTeudat) {
            this.setValueAndDispatchEvent(idTeudat, idNumber);
            this.submitFormAfterDelay('form[name="questionnaireForm"] button', 100);
        }
    }

    fillPhoneShort(shortMobilePhone) {
        const phoneShort = document.querySelector(`#${NODE_IDS.PHONE_KEYPAD}`);
        if (phoneShort) {
            this.setValueAndDispatchEvent(phoneShort, shortMobilePhone);
            this.submitFormAfterDelay('form[name="questionnaireForm"] button', 100);
        }
    }

    fillMobileNumber(phoneNumber) {
        const mobileNumber = document.querySelector(`#${NODE_IDS.mobileNumber}`);
        if (mobileNumber) {
            this.setValueAndDispatchEvent(mobileNumber, phoneNumber);
            this.submitFormAfterDelay('form[name="smsSettingsForm"] input[type="submit"]', 100);
            this.focusElementAfterDelay('#verficationNumber', 400);
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
            if (continueButton) {
                continueButton.click();
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