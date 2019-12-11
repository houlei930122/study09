import * as glob from 'glob';
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';

type HTTPMethod = 'get' | 'put' | 'del' | 'post' | 'patch';
type LoadOptions = {
    extname?: string;
};
type RouteOptions = {
    prefix?: string;
    middlewares?: Array<Koa.Middleware>;
};
const router = new KoaRouter()

const decorate = (method: HTTPMethod, path: string, options: RouteOptions = {}, router: KoaRouter) => {
    return (target, property: string) => {
        // console.log('options',options)
        //延后执行
        process.nextTick(() => {
            // 校验
            const middlewares = []
            //若设置中间件，择添加数组
            if (options.middlewares) {
                middlewares.push(...options.middlewares)
            }
            //添加路由处理
            middlewares.push(target[property])
            const url = options.prefix ? options.prefix + path : path;
            router[method](url, ...middlewares)
            // router[method](url, target[property])

        })

    }
}
const method = method => (path: string, options?: RouteOptions) => decorate(method, path, options, router)
export const get = method('get')
export const post = method('post')
export const put = method('put')
export const del = method('del')
export const patch = method('patch')
export const load = (folder: string, options: LoadOptions = {}): KoaRouter => {
    const extname = options.extname || '.{js,ts}'
    glob.sync(require('path').join(folder, `./**/*${extname}`)).forEach((item) => require(item))
    return router
}



import * as Schema from 'async-validator';
export const verifyArgus = (vali) => (target, name, descriptor) => {
    const oldValue = descriptor.value
    descriptor.value = async function () {
        // const argus = Array.prototype.slice.call(arguments)
        const argus = [...arguments]

        const method = argus[0].request.method; //请求接口方式

        const pram = argus[0].request.body
        var validator = new Schema(vali);
        validator.validate(pram, (errors, fields) => {
            if (errors) {
                //   校验失败
                console.log(errors)
            } else {
                //校验成功
                return oldValue.apply(null, arguments);
            }
        });
    }
}


