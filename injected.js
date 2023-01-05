console.log('XhrSubstitute substitute');
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
                        console.log('GOT response', event, event.target.response, target);
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

console.warn('XMLHttpRequest has been patched!\n XMLHttpRequest: ', window.XMLHttpRequest);
