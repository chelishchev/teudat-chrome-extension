export default class XhrSubstitute {
    constructor() {
        this.mapHandlers = new Map();
    }

    refineUrl(link) {
        const url = new URL(link);

        return url.origin + url.pathname;
    }

    addHandler(url, handler) {
        this.mapHandlers.set(this.refineUrl(url), handler);
    }

    processRequest(event) {
        if (event.target.readyState === 4 && event.target.status === 200) {
            const handler = this.mapHandlers.get(this.refineUrl(event.target.responseURL));
            if (handler) {
                handler(event.target.responseURL, event.target.response);
            }
        }
    }

    substitute() {
        const OriginalXHR = window.XMLHttpRequest;
        const self = this;

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
                    if (property === 'onreadystatechange' || property === 'onload') {
                        target[property] = function (event) {
                            self.processRequest(event);

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