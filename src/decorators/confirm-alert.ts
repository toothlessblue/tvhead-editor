function confirmThenRun<T, R>(this: any, message: string, cb: (...args: T[]) => R, ...args: T[]): R | null {
    if (confirm(message)) {
        return cb.apply(this, args);
    } else {
        return null;
    }
}

export function confirmAlert(message: string) {
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        let cb = descriptor.value;
        descriptor.value = function(this: any, ...args: any[])  {
            return confirmThenRun.apply(this, [message, cb, ...args]);
        }
    };
}
