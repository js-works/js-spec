interface SpecValidator {
    (it: any, path: String);

    withHint(text: string): SpecValidator;
};

export default SpecValidator;