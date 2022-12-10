export class FormFiller {
    constructor() {
    }

    fill(person) {
        this.fillIDTeudat(person.idNumber);
        this.fillPhoneShort(person.shortMobilePhone);
        this.fillMobileNumber(person.phoneNumber);
    }

    fillIDTeudat(idNumber) {
        const idTeudat = document.querySelector('#ID_KEYPAD');
        if (idTeudat) {
            this.setValueAndDispatchEvent(idTeudat, idNumber);
            this.submitFormAfterDelay('form[name="questionnaireForm"] button', 100);
        }
    }

    fillPhoneShort(shortMobilePhone) {
        const phoneShort = document.querySelector('#PHONE_KEYPAD');
        if (phoneShort) {
            this.setValueAndDispatchEvent(phoneShort, shortMobilePhone);
            this.submitFormAfterDelay('form[name="questionnaireForm"] button', 100);
        }
    }

    fillMobileNumber(phoneNumber) {
        const mobileNumber = document.querySelector('#mobileNumber');
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