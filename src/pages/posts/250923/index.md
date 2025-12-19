---
layout: ../../../layouts/MarkdownPostLayout.astro
title: 'VOP学习（四）im与events'
pubDate: '2025-09-23'
author: 'Magicalball'
tags: ['VOP学习']
---



## node.js - events

event - 事件
node.js 使用事件驱动 
EventEmitter() 这是基础class
创建：

```typescript
// import events module
const events = require('events');
// create event emitter instance
let emitter = new events.EventEmitter();
// on off emit once
// on -> emit
emitter.on('fnon',() => {
    consle.log('hello on')
})

emitter.emit('fnon')
emitter.emit('fnon')
// 'hello on'
// 'hello on'
// once -> emit
emitter.once('fnonce',() => {
    consle.log('hello once')
})

emitter.emit('fnon')
emitter.emit('fnon')
// 'hello on' <- only once
emitter.on('fnon',() => {
    consle.log('hello on')
})

emitter.off('fnon')
emitter.emit('fnon')
// 无输出

```
## im - qq-adapter 实现

实现六个方法
- create() 调用sdk中的create()初始化创建实例，之后setLogLevel(0) 应该是日志或者相关配置
- destroy() 销毁sdk实例
- login()登录 调用sdk.login(accid,token)成功以后返回{ success: true, code: '0', msg: 'IM-login success', data: res }
- logout()登出 直接调用sdk.logout()
- on() 订阅sdk事件
eventname的case三个选择：
1.MESSAGE_RECEIVED：
接受触发的msgData，并且遍历每一条消息，如果是TIMTextElem并且不为空就格式映射为：

``` typescript
type:'TextElem',
                  text:item.payload.text 
```

并回调给上层的监听器index中listener。
``` typescript
on(eventname, listener) {
    this._emitter.on(eventname, listener);
  }
如果消息类型为TIMCustomElem并且不为空就映射为type:'CustomElem',
                  data:item.payload.data,
                  time:item.time,
                  from:item.from,
```
同上
该部分首先被sdk触发之后进入回调，处理以后抛给上层的index中on订阅的listener，然后那边emit事件。
职责：订阅->读取->归一化->上抛
2.KICKED_OUT：
SDK 触发 KICKED_OUT 事件，并返回回调参数event，根据event.data.type的值对应到_kickOutTypeMap中映射的_kickOutTypeMap，相关映射见上面，最后将适配器映射的_kickOutTypeMap回调上层的listener。
职责：订阅->读取->映射->上抛
3.NET_STATE_CHANGE：
sdk触发NET_STATE_CHANGE事件，返回event，根据event.data.state对应_netStateMap映射为对应的值，之后回调listener。
职责同上：订阅->读取->映射->上抛
4.default break：
未匹配，什么也不做
- off() 取消订阅sdk事件

## 小结

im中的adapter职责：

1. 初始化实例与配置 create()
2. 销毁SDK实例 destroy()
3. 登录与登出 login/logout
4. 订阅监听器（职责为订阅->读取->映射/归一化->上抛）
5. 移除监听器

Q: adapter与index? on与emint?到底在做什么？

A: 首先index把回调函数作为参数传递给了adapter
之后sdk事件发生时候，adapter调用这个回调函数，把归一化后的处理结果上抛给index
然后index在自己的回调中再emit转发


生命周期（index）：
create->on
login
off->logout->destory
逐一分析，首先是create，
```typescript
  // 处理统一参数、切换sdk、创建IM实例等
  create(options: IMConfig) {
    // 根据不同的channel，切换不同的sdk
    const imModules = loadIMModules<IMAdapter>();
    if (!imModules[IMCont.imChannel]) {
      clog.error('IM-', `当前IM不支持${IMCont.imChannel}渠道`);
      return false;
    }
    // 设置IM统一数据层数据
    this._setInitCont(options);
    
    this._imAdapter = imModules[IMCont.imChannel];
    this._imAdapter.create({
      appid:IMCont.appid,
      proxyServer:IMCont.proxyServer,
    });
    this._addListener();
    return true;
  }
```
由此可以发现，在初始化实例并创建完成后调用了_addListener()
```typescript
private _addListener() {
    console.log('this._imAdapter',this._imAdapter.EVENT);
    this._imAdapter.on(this._imAdapter.EVENT.MESSAGE_RECEIVED, (item) => {
      // 过滤登录之前的消息 
      if(this._loginTime > item.time){
        clog.log('IM-Filtration message', item);
        return;
      }
      if (item.type == 'TextElem') {
        //文字聊天
        if (item.text != '') {
          this._emitter.emit(this.EVENT.TEXT_CHAT, item.text);
        }
      }
      if (item.type == 'CustomElem') {
        //自定义消息
        if (item.data != '') {
          this._emitter.emit(this.EVENT.RECEIVED_MESSAGE, item);
        }
      }
    });

```
因此实例创建完成以后，马上订阅事件。
login单独触发，里面也是正常调用login()正常用。
logout如下：
```typescript
  logout() {
    this._removeListener();
    // 再次登录时需要 imChannel 值
    // IMCont.resetParameters();
    return this._imAdapter.destroy();
  }
```
先是调用了_removeListener()
```typescript
private _removeListener() {
    this._imAdapter.off(this._imAdapter.EVENT.MESSAGE_RECEIVED, () => { });
    this._imAdapter.off(this._imAdapter.EVENT.KICKED_OUT, () => { });
    this._imAdapter.off(this._imAdapter.EVENT.ERROR, () => { });
  }
```
我们可以发现，在内部逐个取消订阅的监视器，而后destroy()，销毁实例。先退订再销毁。





