export default class SpecError extends Error {
    public hint: string
    public path: string

    constructor(message: string, hint: string = null, path: string = null) {
        // Just to satisfy super-call need
        super();

        // Transpilers like tsc/Babel have issues with extending some build-in
        // types (e.g. Error or Array), which make instanceof not work properly.
        // That's why we use a little trick here.
        const self: SpecError = Object.create(SpecError.prototype);

        self.message = message;
        self.hint = hint;
        self.path = path;
        Object.freeze(self);
        return self;
    }

    toString() {
        return 'SpecError: '
            + this.message
            + (this.path ? `(path: ${this.path})` : '');
    }
}
