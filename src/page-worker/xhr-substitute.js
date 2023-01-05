export default class XhrSubstitute {
    constructor() {
    }

    substitute() {
        const OriginalXHR = window.XMLHttpRequest;

        window.XMLHttpRequest = function () {
            return new Proxy(new OriginalXHR(), {
                get(target, prop, receiver) {
                    const value = target[prop];
                    if (value instanceof Function) {
                        return function (...args) {
                            return value.apply(this === receiver ? target : this, args);
                        };
                    }
                    return value;
                },
                set(target, property, value) {
                    if (property === 'onreadystatechange') {
                        target[property] = function (event) {
                            if (event.target.readyState === 4 && event.target.status === 200) {
                                console.log('GOT onreadystatechange response', event, event.target.response, target);
                            }

                            value.apply(target, arguments);
                        }
                        return true;
                    }
                    if (property === 'onload') {
                        target[property] = function (event) {
                            if (event.target.readyState === 4 && event.target.status === 200) {
                                console.log('GOT onload response', event, target, target.status, target.response);
                            }

                            value.apply(target, arguments);
                        }
                        return true;
                    }

                    target[property] = value;
                    return true;
                }
            });
        }
    }
}