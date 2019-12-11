import * as Koa from 'koa'
import { get, post, verifyArgus } from '../utils/route-decors'

const users = [{ name: 'tom' }]
export default class User {
    
    @get('/users')
    @verifyArgus({
        token: {
          type: "string",
          required: true,
        },
      })
    public list(ctx: Koa.Context) {
        ctx.body = { ok: 1, data: users }
    }
    @post('/users')
    @verifyArgus({
        name: {
          type: "string",
          required: true,
        },
        token: {
          type: "string",
          required: true,
        }
      })
    public add(ctx: Koa.Context) {
        users.push(ctx.request.body)
        ctx.body = { ok: 1, msg: '提交成功' }
    }
}
