---
layout: ../../../layouts/MarkdownPostLayout.astro
title: 'VOP学习（二）api流程'
pubDate: '2025-09-18'
author: 'Magicalball'
tags: ['VOP学习']
---



## 一. previewLocalStream - 预览本地流

### 流程：

#### 1. -- api ：previewLocalStream`

```typescript
 previewLocalStream(config: LocalStreamConfig): Promise<APICommonResponse> {
    return control.previewLocalStream(config);
  }
```

#### 2. -- controlAdpater -- meeting -- index.ts

```typescript
import meetingControl from '../../control/meeting';
previewLocalStream(config: LocalStreamConfig) {
    return meetingControl.previewLocalStream(config);
  }

```

#### 3. -- control -- meeting -- index.ts:

```typescript
 previewLocalStream(config: LocalStreamConfig) {
    return control.rtcHandler.previewLocalStream(config);
  }

const rtcHandler = new RTCHandler();

import RTCHandler from "../../core/rtc";
```

#### 4. -- core -- rtc -- index.ts

```typescript
  // 创建并预览本地流
  async previewLocalStream(config: LocalStreamConfig) {
    if (config.view) {
      RTCCont.localDom = config.view;
    }

    const res = await this._rtcAdapter.previewLocalStream(config);

    if (RTCCont.waterMarks) {
      await this.startWaterMark(RTCCont.waterMarks);
    }
    return res;
  }
```

```typescript
this._rtcAdapter.previewLocalStream(config)
```

```typescript
this._rtcAdapter = rtcModules[RTCCont.rtcChannel]
```

```typescript
const rtcModules = loadRTCModules<RTCAdapter>();
```

##### 4.1. -- utils -- load-modules.ts

```typescript
function loadRTCModules<T>() {
  const rtcModules = { };
  const rtcTypes = publishInfo['rtcConfig']['channel'].split('+');
  for (const rtcType of rtcTypes) {
    const instance = require(`../core/rtc/adapter/${rtcType}-adapter`).default as T;
    rtcModules[rtcType] = instance;
  }  
  return rtcModules;
}

export  {
  loadBuildTypeModules,
  loadIMModules,
  loadRTCModules,//export
  loadVCModules,
};
```

###### 4.1.1. publish.json

```json
"rtcConfig":{
        "channel": "netease+qq",
        "channelType": "tcp"
    }
```

#### -4.

```typescript
RTCCont.rtcChannel = options.rtcChannel || DEFAULT_RTC_CHANNEL;//default qq
```

#### 5(1). --core -- rtc -- adapter -- netease-adapter.ts

```typescript
   // 1. 创建本地流
            clog.warn('uid', RTCCont);
            
            this._localStream = await this._sdk?.createStream({
              uid: RTCCont.accid,
              microphoneId: microphoneId,
              audio: true, //是否启动mic
              video: true, //是否启动camera
              cameraId: cameraId,
              screen: false, //是否启动屏幕共享
            });
```

```typescript
this._localStream = await this._sdk?.createStream({
        audio: true,
        video: true,
        cameraId: config?.option?.cameraId ?? cameras[0].deviceId,
        client: this._client,
      });
```

```typescript
this._sdk = new neteaseSDK();
```

```typescript
import neteaseSDK, { EventTypes } from '../sdk/netease-sdk';
```

#### 6(1). -- core -- rtc -- sdk -- netease-sdk

```typescript
  /**
   * 创建音视频流
   * @param options 流配置
   */
  createStream(options: StreamOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const stream = NERTC.createStream(options);

        if ((stream as any).code) {
          reject(stream);
        } else {
          this._localStream = stream;
          resolve(stream);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
```

```typescript
const stream = NERTC.createStream(options);
```

#### 7(1).

```typescript
import NERTC from 'nertc-web-sdk'; // 假设这是网易云信SDK的导入方式
```

#### 5(2). --core -- rtc -- adapter -- qq-adapter.ts

```typescript
await this._sdk?.startLocalVideo({
            view: options.view,
            publish: false,
            mute: options.video ? (typeof (options.video) === 'boolean' ? !options.video : options.video) : false,
            option: {
              cameraId: RTCCont.cameraId || options.cameraId,
              mirror: RTCCont.localStreamConfig?.mirror || options.mirror,
              profile: RTCCont.localStreamConfig?.videoProfile || options.videoProfile,
              videoTrack: RTCCont.localStreamConfig?.videoTrack || options.videoTrack,
              fillMode: RTCCont.localStreamConfig?.fillMode || options.fillMode,
              small: RTCCont.localStreamConfig?.small || options.small,
            },
          });
```

```typescript
this._sdk = new TrtcSDK();
```

```typescript
import TrtcSDK from '../sdk/trtc-sdk';
```

#### 6(2). -- core --rtc -- sdk --trtc-sdk.ts

```typescript
startLocalVideo(config?: LocalVideoConfig) {
    return this._trtc.startLocalVideo(config);
  }
```

```typescript
 if (publishInfo.rtcConfig.channelType === 'udp') {
      this._trtc = TRTC.create({ assetsPath: params.assetsPath });
    } else {
      this._trtc = TRTC.create({ plugins: [CustomEncryption], assetsPath: params.assetsPath });
    }
```

#### 7(2). 

```typescript
import TRTC, { EnterRoomConfig, LocalAudioConfig, LocalVideoConfig, RemoteVideoConfig, StopRemoteVideoConfig, TRTCEventTypes, VideoFrameConfig, UpdateScreenShareConfig, AIDenoiserOptions } from 'trtc-sdk-v5';
```

## 二. startRemoteVideo - 开始远程视频

### 流程：

#### 1. -- api -- meeting -- index.ts

```typescript
  startRemoteVideo(config: RemoteVideoConfig): Promise<APICommonResponse> {
    return control.startRemoteVideo(config);
  }
```

#### 2. -- controlAdpater -- meeting -- index.ts

```typescript
  startRemoteVideo(config: RemoteVideoConfig) {
    return meetingControl.startRemoteVideo(config);
  }
```

#### 3. -- control -- meeting -- index.ts

```typescript
  startRemoteVideo(config: RemoteVideoConfig) {
    return control.rtcHandler.startRemoteVideo(config);
  }

const rtcHandler = new RTCHandler();

import RTCHandler from "../../core/rtc";
```

#### 4. -- core -- rtc -- index.ts

```typescript
  startRemoteVideo(config: RemoteVideoConfig) {
    return this._rtcAdapter.startRemoteVideo(config);
  }
```

```typescript
this._rtcAdapter = rtcModules[RTCCont.rtcChannel];
```

```typescript
const rtcModules = loadRTCModules<RTCAdapter>();
```

```typescript
import { loadRTCModules } from '../../utils/load-modules';
```

##### 4.1.  -- utils -- load-modules.ts

```typescript
function loadRTCModules<T>() {
  const rtcModules = { };
  const rtcTypes = publishInfo['rtcConfig']['channel'].split('+');
  for (const rtcType of rtcTypes) {
    const instance = require(`../core/rtc/adapter/${rtcType}-adapter`).default as T;
    rtcModules[rtcType] = instance;
  }  
  return rtcModules;
}

export  {
  loadBuildTypeModules,
  loadIMModules,
  loadRTCModules,//export
  loadVCModules,
};

import publishInfo from '../../publish.json';
```

###### 4.1.1. publish.json

```json
"rtcConfig":{
        "channel": "netease+qq",
        "channelType": "tcp"
    }
```

#### 5(1). -- core -- rtc -- adapter -- netease-adapter

```typescript
await this._sdk?.subscribe(config?.stream, {
            video: true,
            audio: true,
          });
          
 constructor() {
    this._sdk = new neteaseSDK();
  }   

import neteaseSDK, { EventTypes } from '../sdk/netease-sdk';
```

#### 6(1) -- core -- rtc -- sdk -- netease-sdk.ts

```typescript
  /**
   * 订阅远端流
   * @param stream 远端流
   * @param options 订阅选项
   */
  subscribe(stream: Stream, options?: SubscribeOptions): Promise<void> {
    if (!this._client) {
      return Promise.reject(new Error('Client not created'));
    }
    return this._client.subscribe(stream, options);
  }
```

```typescript
  /**
   * 创建客户端实例
   * @param options 配置参数
   */
  createClient(options: { appkey: string; debug?: boolean }):Client {
    this._client = NERTC.createClient(options);
    return this._client;
  }
```

#### 7(1).

```typescript
import NERTC from 'nertc-web-sdk'; // 假设这是网易云信SDK的导入方式
```

#### 5(2). -- core -- rtc -- adapter -- qq-adapter.ts

```typescript
  async startRemoteVideo(config: RemoteVideoConfig): Promise<APICommonResponse> {
    return this.handleSdkCall(
      async () => this._sdk?.startRemoteVideo({
        ...config,
        option: {
          ...config.option,
          fillMode: config.option?.fillMode || 'contain',
        },
        streamType: config.streamType as unknown as TRTCStreamType,
      }),
      'RTC-startRemoteVideo success',
    );
  }
```

```typescript
  create(params: { assetsPath: string }) {
    if (!this._sdk) {
      this._sdk = new TrtcSDK();
      this._sdk?.create(params);
    }
  }
```

```typescript
import TrtcSDK from '../sdk/trtc-sdk';
```

#### 6(2). -- core -- rtc -- sdk -- trtc-sdk.ts

```typescript
  startRemoteVideo(config: RemoteVideoConfig) {
    return this._trtc.startRemoteVideo(config);
  }
```

```typescript
if (publishInfo.rtcConfig.channelType === 'udp') {
      this._trtc = TRTC.create({ assetsPath: params.assetsPath });
    } else {
      this._trtc = TRTC.create({ plugins: [CustomEncryption], assetsPath: params.assetsPath });
    }
```

#### 7(2).

```typescript
import TRTC, { EnterRoomConfig, LocalAudioConfig, LocalVideoConfig, RemoteVideoConfig, StopRemoteVideoConfig, TRTCEventTypes, VideoFrameConfig, UpdateScreenShareConfig, AIDenoiserOptions } from 'trtc-sdk-v5';
```

## 三. 总结

> 综上内容，项目API调用链如下

API层（对外暴露的接口）	       顶

controlAdapter层（转发）		↓

control层（业务逻辑）		     底 

core层（核心逻辑）

core - adapter 层（适配器对应不同厂商）

core - sdk层（厂商具体的sdk）

> 各层级作用

API层：该部分是对外保留的api，统一调用的入口。

controlAdapter层：一个转发层。

control层：业务逻辑，通用模块index，meeting，teller，client

core层：技术核心，将第三方的接口抽象成统一接口，多厂商适配，向上层提供统一的接口。

​	index为上层提供统一的接口Handler，屏蔽底层SDK差异。event对各个事件作统一定义，动态适配器选择，还有状态管理——统一接口代理（如条件代理，转发代理，状态管理等）。简化上层调用（代理模式）。

​	rtc-types定义统一的接口规范。

​	rtc-cont对RTC进行集中状态管理。

core - adapter 层：对应厂商的sdk在这里将他们的差异化处理成统一的。主要是业务封装，关注业务逻辑，业务流程编排。让不同SDK实现相同的业务效果。

core - sdk层：封装第三方sdk，提供统一的调用接口，二次封装。只关注技术封装。



> 设计模式

| 设计模式   | 应用场景        | 具体实现         | 优势               |
| :--------- | :-------------- | :--------------- | :----------------- |
| 适配器模式 | 不同SDK接口适配 | RTCAdapter接口   | 统一API，易扩展    |
| 工厂模式   | 动态创建适配器  | loadRTCModules() | 配置驱动，灵活切换 |
| 代理模式   | 日志记录和监控  | Proxy拦截        | 无侵入式增强       |
| 单例模式   | 状态管理        | RTCCont实例      | 全局状态统一       |
| 策略模式   | 多SDK选择       | 适配器选择机制   | 运行时切换策略     |





















