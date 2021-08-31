import { FieldModel, FieldModelOptions, FieldType } from "./model";

export type ObjectFieldModel = {
    [s: string]: FieldModel<unknown>;
};

export class ObjectField<T extends ObjectFieldModel> extends FieldModel<ObjectFieldType<T>> {
    model: T;

    constructor(model: T, options?: FieldModelOptions<ObjectFieldType<T>>) {
        super(options);

        this.model = model;
    }

    override validate(value: unknown): true | never {
        if (value === null) {
            throw new TypeError("'value' must not be 'null'");
        }

        if (typeof value !== "object") {
            throw new TypeError("'value' must be an 'object'");
        }

        const modelKeys: (string & keyof ObjectFieldType<T>)[] = Object.keys(this.model);
        const testedKeys: string[] = [];

        modelKeys.forEach((key) => {
            this.model[key].validate((<ObjectFieldType<T>>value)[key]);
            testedKeys.push(key);
        });

        Object.keys(value).forEach((key) => {
            if (!testedKeys.includes(key)) {
                throw new RangeError(`'value' contains an unknown key '${key}'`);
            }
        });

        return true;
    }
}

export type ObjectFieldType<T extends ObjectFieldModel> = {
    [K in keyof T]: FieldType<T[K]>;
};
