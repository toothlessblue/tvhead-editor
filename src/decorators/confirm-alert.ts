function confirmThenRun<T, R>(this: any, message: string, cb: (...args: T[]) => R, ...args: T[]): R | null {
    if (confirm(message)) {
        return cb.apply(this, args);
    } else {
        return null;
    }
}

export function confirmAlert(message: string, warnCondition?: (this: any) => boolean) {
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        let cb = descriptor.value as (...args: any[]) => any;
        descriptor.value = function(this: any, ...args: any[])  {
            if (warnCondition && !warnCondition.apply(this)) {
                return cb.apply(this, args);
            }

            return confirmThenRun.apply(this, [message, cb, ...args]);
        }
    };
}
