---
layout: ../../../layouts/MarkdownPostLayout.astro
title: 'VOP学习（五）im开发适配学习'
pubDate: '2025-09-25'
author: 'Magicalball'
tags: ['VOP学习']
---

## 项目架构设计

> 引言：虽说也可以直接讲解im的开发流程，但却总觉得少了些什么，回顾前四节可以发现，虽然通过一系列的小节来进行所谓的学习，但究其本质其实就是在熟悉项目的架构。故此，理应当将当前对项目架构的理解进行总结，即有利于后面内容的讲解，也可以对当下的项目理解现状做一次总结。
>
> > PS：以下的VOP项目无特殊注明均默认代表该项目。
> >
> > ​		以下内容包含的相关概念，均以该项目为基础来进行讲解，如有名称疑问请参考项目文件来理解。

### 1. 背景简介：

这是一个VOP的项目(Video Over Platform)

#### 1.1. 什么是VOP项目？

VOP是一种统一通信平台架构，它将多种通信能力（音视频通话、即时消息、呼叫中心等）整合到一个统一的SDK平台中。VOP项目的核心特征包括：

- 多厂商适配：音视频RTC（支持网易，QQ等厂商），即时通讯IM（支持网易，QQ等厂商），呼叫中心VC（有多个版本如：3.0，3.1等）
- 多端统一架构：客户端（Client），座席端（Teller），会客室（Meeting）
- 动态配置的能力：通过配置文件（publish.json）实现 
``` json
	"imConfig":{
        "channel": "qq+feihu"
    },
    "rtcConfig":{
        "channel": "netease+qq",
        "channelType": "tcp"
    }
```

#### 1.2. VOP架构设计

VOP项目采用了六层架构，以顶层至底层如下：

- API层：对外暴露的接口
- 桥接适配层（controlAdapter）：转发，暂无其他
- 桥接层（control）：业务逻辑控制，协调各模块交互
- 核心层（core）：业务模块的核心（IM，RTC，VC）
- 适配器层：各家厂商的SDK适配，封装实现
- SDK层：底层SDK封装，统一日志

#### 1.3. 核心业务模块

IM模块（即时通信）：

```typescript
class IMHandler {
  // 支持腾讯、网易等多厂商
}
```

RTC模块（音视频）：

```typescript
class RTCHandler {
  // 支持腾讯TRTC、网易等多厂商
}
```

VC模块（呼叫中心）：

```typescript
// 统一的VC接口，支持多版本
class VCHandler {
  // 支持2.9、3.0、3.1等多版本
}
```

#### 1.4. 动态加载

通过`src/utils/load-modules.ts`来实现

```typescript
function loadIMModules<T>(){
//...
return imModules;
}
function loadRTCModules<T>(){
//...
return rtcModules;
}
function loadVCModules<T>(){
//...
return vcModules;
}
export  {
  loadBuildTypeModules,
  loadIMModules,
  loadRTCModules,
  loadVCModules,
};
```

### 2. VOP项目与SDK关系

Software Development Kit（软件开发工具包）

> SDK 就是一套“工具箱”，由第三方（如腾讯、阿里、Zoom、TRTC）提供，让你能快速集成某项功能到自己的应用中，而不用从零造轮子。 

**VOP是SDK的统一封装平台**

VOP项目本身就是一个SDK开发的项目，封装底层SDK，提供统一的接口，解耦设计，应用层无需考虑底层厂商的实现。

---

## 开发前的准备

在通过SDK进行VOP的适配开发之前，我们应该思考，作为一名开发人员，应该如何开发？

经过上面对项目架构的理解，我们可以知道，我们在开发什么：

- 一个统一SDK的平台，适配多通道多厂商。

- 要为不同的厂商做适配器，确保不同的厂商都能被统一的SDK接口调用。

- 要进行业务逻辑封装，将复杂的逻辑封装成简单的API，提供一致性的使用。

综上我们对项目架构和需要开发的内容已经有了概念，那么接下来我们便开始做新厂商的IM适配开发吧~

## SDK层开发

创建新的sdk文件`feihu-sdk.ts`，根据文档封装方法。

login() 该部分的方法与qq-sdk方法不同，为了适配，在`im-types.ts`中新增

```typescript
export interface LoginIMParams {
    accid: string;
    token: string;
    imSecretKey?: string;
    secretType?: number;
}
```

而在sdk中，为了防止返回值`timestamp`不存在，对login()做参数的处理

```typescript
  async login(
    accid: string,
    token: string,
    imSecretKey?: string,
    secretType?: number
  ): Promise<{ code: number; timeStamp: number }> {
    const res = await this._fvcim!.login({
      uid: accid,
      userSig: token,
      ...(imSecretKey ? { imSecretKey } : {}),
      ...(typeof secretType === "number" ? { secretType } : {}),
    });
    return { code: res.code || 0, timeStamp: res?.timestamp || Date.now() };
  }
```

在sdk的开发中，参考其他sdk(这里主要是qq-sdk.ts)，对constructor()方法进行分析和仿做。

主要功能为统一的日志记录和调试信息过滤。

## Adapter层开发

创建adapter文件`feihu-adapter.ts`，根据文档自定义事件名称。

```typescript
  EVENT = {
    MESSAGE_RECEIVED: "onRecvNewMessage",
    NET_STATE_CHANGE: "onNetStateChange", // 网络状态事件,string 类型
    KICKED_OUT: "onKickedOffline",
    ERROR: "onError",
  };
```

1. 消息接收事件 (MESSAGE_RECEIVED)

   ```typescript
   case this.EVENT.MESSAGE_RECEIVED:
           {
             sdk.on(this.EVENT.MESSAGE_RECEIVED, (msg) => {
               console.log("测试msg", msg);
               if (msg.extra === "@@TEXT@@") {
                 // 文本消息
                 if (msg.content && msg.content !== "") {
                   listener({
                     type: "TextElem",
                     text: msg.content,
                   });
                 }
               } else if (msg.extra === "@@SYSTEM@@") {
                 // 自定义消息
                 if (msg.content && msg.content !== "") {
                   listener({
                     type: "CustomElem",
                     data: msg.content,
                     time: msg.timestamp,
                     from: msg.sender,
                   });
                 }
               }
             });
           }
   
           break;
   ```

   - 使用msg.extra字段区分消息类型（@@TEXT@@ / @@SYSTEM@@）

   - 转换为统一的消息结构（TextElem / CustomElem）

   - 保持与QQ-Adapter相同的输出格式，确保上层兼容性

1. 网络状态事件 (NET_STATE_CHANGE)

   ```typescript
   // 网络状态类型映射
     private _netStateMap = {
       onConnecting: IMNetState.NET_STATE_CONNECTING,
       onConnectSuccess: IMNetState.NET_STATE_CONNECTED,
       onConnectFailed: IMNetState.NET_STATE_DISCONNECTED,
     };
   ```

   - f的SDK的网络状态事件名称与t的SDK不同

   - 需要将f的状态值映射到统一的IMNetState枚举

   ```typescript
   case this.EVENT.NET_STATE_CHANGE:
           {
             sdk.on(this.EVENT.NET_STATE_CHANGE, (event) => {
               this._netStateMap[event.data.state] &&
                 listener(this._netStateMap[event.data.state]);
             });
           }
           break;
   ```

   ## constants层 index.ts添加

   constants层是适配器的映射和配置中心作用。

   因此我们在新添加了IM以后，需要将它加入进去。

   ```typescript
   export const IM_CHANNEL = {
     'qq': 'qq',
     'netease': 'NIM',
     'zego': 'zego',
     'fvc':'fvc'  // 加入
   }; //IM通道（厂商和通道的对应关系） 
   
   export const IM_CHANNEL_PRIVITE = {
     'qq': 'qq_in',
     'netease': 'NIM',
     'zego': 'zego',
     'fvc':'fvc'  // 加入
   }; // IM通道私有化（厂商和通道的对应关系）
   ```

   ## control层的适配

   ### metting/index.ts添加

   IM的配置参数适配处理，将服务端返回的IM配置信息转换为标准化的IM初始化参数。

   - 配置映射：将 ext.fvc 中的认证信息映射到统一的配置对象
   - 网络区域适配：根据 VCCont.netWorkArea 动态选择内网或外网代理服务器地址
   - 容错处理：使用可选链操作符和默认值确保配置安全性

   ```typescript
   case "fvc":
           config.accid = ext.fvc.accid;
           config.token = ext.fvc.token;
           VCCont.netWorkArea &&
             (config.proxyServer =
               VCCont.netWorkArea == NetWorkArea.IN
                 ? ext.fvc?.inConfig?.webAddress || ""
                 : ext.fvc?.outConfig?.webAddress || "");
           break;
   ```

   ### teller/index.ts添加

   基本原理同上。

   ```typescript
       case 'fvc':
         config.accid = ext.fvc.accid;
         config.token = ext.fvc.token;
         VCCont.netWorkArea && (
           config.proxyServer = VCCont.netWorkArea == NetWorkArea.IN ? ext.fvc?.inConfig?.webAddress || '' : ext.fvc?.outConfig?.webAddress || ''
         );
   ```
   
   ## im-type.ts 配置
   
   fvc的私有参数配置，不破坏原有接口，通过可选参数扩展支持fvcIM特有功能。
   
   ```typescript
   export interface LoginIMParams {
       accid:string;
       token:string;
       imSecretKey?:string;
       secretType?:number;
   }
   ```
   
   ## utils/request/type.ts配置
   
   对服务端进行配置约定，服务端与客户端的”桥梁“，进行类型约束。相关涉及的类型根据文档，以及控制台的打印。
   
   ```typescript
   fvc:{
           accid:string,
           token:string,
           inConfig?:{
               appAddress:string,
               webAddress:string,
           },
           outConfig?:{
               appAddress:string,
               webAddress:string,
           }
       }   
   ```
   
   ## 总结
   
   通过上面的流程，我们已经对VOP项目的架构有了进一步的理解，IM的开发本质上就是sdk和adapter层的开发，其他层对应做适配添加和修改，而在初步开发以后通过运行调试，查看控制台和网络的返回值进行调整，从各种报错或者响应中对新内容进行适配，通过实际的操作，理解IM适配开发的流程以及VOP平台开发的思路。
   
   
   
   
   
   





