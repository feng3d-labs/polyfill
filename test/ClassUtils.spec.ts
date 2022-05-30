import { equal } from 'assert';
import { classUtils, decoratorRegisterClass } from '../src';

describe('ClassUtils', () =>
{
    it('getQualifiedClassName', () =>
    {
        let className: string;

        className = classUtils.getQualifiedClassName(true);
        equal(className, 'Boolean');

        className = classUtils.getQualifiedClassName(Boolean);
        equal(className, 'Boolean');

        className = classUtils.getQualifiedClassName('1');
        equal(className, 'String');

        className = classUtils.getQualifiedClassName(String);
        equal(className, 'String');

        className = classUtils.getQualifiedClassName(123);
        equal(className, 'Number');

        className = classUtils.getQualifiedClassName(Number);
        equal(className, 'Number');
    });

    it('getQualifiedClassName 自定义类', () =>
    {
        /**
         * 未使用 @decoratorRegisterClass() 进行注册的类
         */
        class UnregisteredClass
        {

        }

        /**
         * 使用 @decoratorRegisterClass() 进行注册的类
         */
        @decoratorRegisterClass()
        class RegisteredClass
        {

        }

        let className: string;

        className = classUtils.getQualifiedClassName(UnregisteredClass);
        equal(className, null); // UnregisteredClass 未注册返回 null

        className = classUtils.getQualifiedClassName(RegisteredClass);
        equal(className, 'RegisteredClass');
    });
});
