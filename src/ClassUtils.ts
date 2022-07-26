import { ObjectUtils } from './ObjectUtils';
import { Constructor } from './Types';

export const __class__ = '__class__';

/**
 * 类工具
 */
export class ClassUtils
{
    classUtilsHandlers: Function[] = [];

    /**
     * 返回对象的类名。
     * @param value 需要类名称的对象，可以将任何 JavaScript 值传递给此方法，包括所有可用的 JavaScript 类型、对象实例、原始类型
     * （如number)和类对象
     * @returns 包含类名称的字符串。
     */
    getQualifiedClassName(value: any): string
    {
        if (ObjectUtils.objectIsEmpty(value))
        {
            return 'null';
        }

        const classUtilsHandlers = classUtils.classUtilsHandlers;
        if (classUtilsHandlers)
        {
            classUtilsHandlers.forEach((element) =>
            {
                element(value);
            });
        }

        const prototype: any = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        // eslint-disable-next-line no-prototype-builtins
        if (prototype.hasOwnProperty(__class__))
        {
            return prototype[__class__];
        }

        let className: string = prototype.constructor.name;
        if (globalThis[className] === prototype.constructor)
        {
            return className;
        }
        // 在可能的命名空间内查找
        for (let i = 0; i < _classNameSpaces.length; i++)
        {
            const tryClassName = `${_classNameSpaces[i]}.${className}`;
            if (this.getDefinitionByName(tryClassName) === prototype.constructor)
            {
                className = tryClassName;
                registerClass(prototype.constructor, className);

                return className;
            }
        }
        console.warn(`未在给出的命名空间 ${_classNameSpaces} 内找到 ${value}-${className} 的定义`);

        return null;
    }

    /**
     * 返回 name 参数指定的类的类对象引用。
     * @param name 类的名称。
     */
    getDefinitionByName(name: string, readCache = true): any
    {
        if (name === 'null')
        {
            return null;
        }
        if (!name)
        {
            return null;
        }
        if (globalThis[name])
        {
            return globalThis[name];
        }
        if (readCache && _definitionCache[name])
        {
            return _definitionCache[name];
        }

        const paths = name.split('.');
        const length = paths.length;
        let definition = globalThis;
        for (let i = 0; i < length; i++)
        {
            const path = paths[i];
            definition = definition[path];
            if (!definition)
            {
                return null;
            }
        }
        _definitionCache[name] = definition;

        return definition;
    }

    private defaultInstMap: { [className: string]: any } = {};

    /**
     * 获取默认实例
     *
     * @param name 类名称
     */
    getDefaultInstanceByName(name: string)
    {
        if (name === undefined)
        {
            return null;
        }

        let defaultInst = this.defaultInstMap[name];
        if (defaultInst) return defaultInst;
        //
        defaultInst = this.defaultInstMap[name] = this.getInstanceByName(name);

        // 冻结对象，防止被修改
        Object.freeze(defaultInst);

        return defaultInst;
    }

    /**
     * 获取实例
     *
     * @param name 类名称
     */
    getInstanceByName(name: string)
    {
        const cls = this.getDefinitionByName(name);
        console.assert(cls, `无法获取名称为 ${name} 的实例!`);
        const instance = this.getInstanceByDefinition(cls);

        return instance;
    }

    getInstanceByDefinition<T>(cls: Constructor<T>): T
    {
        console.assert(!!cls);
        if (!cls) return undefined;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (cls.__create__)
        {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return cls.__create__();
        }

        // eslint-disable-next-line new-cap
        return new cls();
    }

    /**
     * 新增反射对象所在的命名空间，使得getQualifiedClassName能够得到正确的结果
     */
    addClassNameSpace(namespace: string)
    {
        if (_classNameSpaces.indexOf(namespace) === -1)
        {
            _classNameSpaces.push(namespace);
        }
    }
}

/**
 * 类工具
 */
export const classUtils = new ClassUtils();

const _definitionCache = {};
const _classNameSpaces = ['feng3d'];

/**
 * 为一个类定义注册类名
 * @param constructor 类定义
 * @param className 类名
 */
export function registerClass(constructor: Constructor<any>, className?: string): void
{
    const prototype = constructor.prototype;
    if (!className)
    {
        className = prototype.constructor.name;
    }
    _definitionCache[className] = constructor;
    Object.defineProperty(prototype, __class__, { value: className, writable: true, enumerable: false });
}

/**
 * 标记objectview对象界面类
 */
export function decoratorRegisterClass(className?: string)
{
    return (constructor: Constructor<any>) =>
    {
        registerClass(constructor, className);
    };
}

