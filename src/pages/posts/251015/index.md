---
layout: ../../../layouts/MarkdownPostLayout.astro
title: 'VOP学习（八）zego-adapter集成'
pubDate: '2025-10-15'
author: 'Magicalball'
tags: ['VOP学习']
---



> 按照要求，adapter中作为适配层，方法由上层约束，因此这里作为组装中心，里面的私有方法会在后续列出来。

## 一、主要实现的上层方法

### 初始化和销毁方法

#### create(params: { appkey: string; appID?: number })

调用处理逻辑流程：

- 接收参数：appkey（必填）和 appID（可选）

- 执行完整清理：调用 _fullCleanup() 确保干净状态

- 参数处理：appID = params.appID || parseInt(params.appkey)

- 设置服务器地址：_server = ""

- 调用SDK创建：_zego.create({ appID, server })

- 异常处理：捕获并重新抛出错误

#### destroy()

调用处理逻辑流程：

- 移除事件监听器：调用 _offListener()

- 清理所有流：遍历 _streams Map，调用 _destroyStream() 停止流并清理轨道

- 清空数据结构：_streams.clear() 和 _streamIds.clear()

- 退出房间：_zego.leaveRoom()

- 登出大厅：_zego.logoutHall()

### 2. 房间管理方法

#### enterRoom()

调用处理逻辑流程：

- 获取登录令牌：调用 _getHallToken() 从服务器获取token

- 构建登录用户信息：{ userID: RTCCont.accid, userName: RTCCont.accid }

- 配置登录参数：loginConfig 包含设备信息、应用ID、服务器地址等

- 执行登录：_zego.loginHall(loginToken, loginUser, loginConfig)

- 进入房间：_zego.enterRoom(RTCCont.roomId, 0)

- 添加事件监听：调用 _addListener()

#### exitRoom()

调用处理逻辑流程：

- 直接调用：_zego.leaveRoom()

- 返回Promise结果

### 3. 本地流管理方法

#### previewLocalStream(config)

调用处理逻辑流程：

- 构建Zego配置：zegoConfig 对象

- 处理视频轨道：如果 config.videoTrack 存在，使用自定义轨道；否则配置摄像头参数

- 设备配置：处理 cameraId、microphoneId 等设备选择

- 视频质量配置：调用 _convertVideoProfile() 处理分辨率设置

- 创建流：_zego.createStream(zegoConfig)

- 保存流信息：存储到 _streams Map，key为 userId_streamType

- 渲染到DOM：调用 _renderStreamToView() 显示视频

- 设备枚举：获取并记录使用的摄像头和麦克风ID到 RTCCont

#### publishLocalStream()

调用处理逻辑流程：

- 获取本地流：调用 _getLocalStream() 获取主流

- 生成流ID：使用 _generateId() 创建唯一标识

- 开始推流：_zego.startPublishingStream(streamId, localStream)

- 更新流信息：保存 streamId 到 _streamIds Map

- 返回推流结果

#### updateLocalStream(config)

调用处理逻辑流程：

- 获取本地流：验证流是否存在

- 处理视频轨道替换：移除旧轨道，添加新轨道（用于水印功能）

- 处理音频轨道替换：类似视频轨道处理

- 更新推流：如果存在 streamId，先停止再重新开始推流

- 更新本地渲染：调用 _renderStreamToView() 刷新显示

- 更新音视频状态：调用 mutePublishStreamVideo() 和 mutePublishStreamAudio()

#### stopLocalStream()

调用处理逻辑流程：

- 获取主流：通过 streamKey 获取本地主流

- 销毁流：调用 _destroyStream() 停止推流并销毁

- 停止轨道：遍历 stream.getTracks() 调用 track.stop()

- 清理数据结构：从 _streams 和 _streamIds 中删除

- 清理屏幕共享：调用 _cleanupScreenStream()

### 4. 远端流管理方法

#### startRemoteVideo(config: RemoteVideoConfig)

调用处理逻辑流程：

- 解析参数：{ userId, streamType, view, option }

- 获取流：通过 streamKey 从 _streams 获取已拉取的流

- 验证流存在：如果流不存在，抛出错误提示等待 REMOTE_VIDEO_AVAILABLE 事件

- 渲染到DOM：调用 _renderStreamToView() 显示远端视频

- 配置显示选项：处理 mirror、fillMode 等显示参数

#### stopRemoteVideo(config: StopRemoteVideoConfig)

调用处理逻辑流程：

- 获取流信息：通过 userId 和 streamType 构建 streamKey

- 获取流ID：从 _streamIds 获取对应的 streamId

- 停止拉流：调用 _zego.stopPlayingStream(streamId)

- 清理数据：从 _streams 和 _streamIds 中删除

### 5. 屏幕共享方法

#### startScreenShare(config)

调用处理逻辑流程：

- 构建屏幕配置：zegoScreenConfig 包含音频和视频质量设置

- 处理视频质量：调用 _convertVideoProfile() 处理分辨率配置

- 创建屏幕流：_zego.createStream({ screen: zegoScreenConfig })

- 生成流ID：使用 _generateId() 创建屏幕共享流ID

- 开始推流：_zego.startPublishingStream(streamId, stream)

- 保存流信息：存储到 _streams 和 _streamIds

- 渲染到DOM：如果提供 view，调用 _renderStreamToView()

#### stopScreenShare()

调用处理逻辑流程：

- 调用清理方法：_cleanupScreenStream()

- 返回成功结果

#### updateScreenShare(config)

调用处理逻辑流程：

- 先停止：调用 stopScreenShare()

- 重新开始：调用 startScreenShare(config)

- 返回结果

### 6. 设备管理方法

#### getCameraList()

调用处理逻辑流程：

- 调用SDK：_zego.enumDevices()

- 处理摄像头列表：映射设备信息为统一格式

- 返回格式：{ deviceId, label } 数组

#### getMicrophoneList()

调用处理逻辑流程：

- 调用SDK：_zego.enumDevices()

- 处理麦克风列表：映射设备信息为统一格式

- 返回格式：{ deviceId, label } 数组

#### getSpeakerList()

调用处理逻辑流程：

- 调用SDK：_zego.enumDevices()

- 处理扬声器列表：映射设备信息为统一格式

- 返回格式：{ deviceId, label } 数组

### 7. 轨道获取方法

#### getVideoTrack()

调用处理逻辑流程：

- 获取本地流：调用 _getLocalStream()

- 提取视频轨道：localStream?.getVideoTracks()[0]

- 返回轨道或null

#### getAudioTrack()

调用处理逻辑流程：

- 获取本地流：调用 _getLocalStream()

- 提取音频轨道：localStream?.getAudioTracks()[0]

- 返回轨道或null

### 8. 功能支持检查

#### isSupported()

- 检查WebRTC支持：!!navigator.mediaDevices?.getUserMedia

- 检查Zego SDK支持：!!(window as any).ZegoExpressEngine

- 综合判断：两个条件都满足才支持

- 返回标准响应格式

## 二、私有成员变量

### 核心SDK实例

_zego: ZegoSDK - Zego SDK的封装实例，负责与底层SDK交互

### 服务器配置

_server: string - 存储Zego服务器地址，用于登录和连接

### 事件管理

_emitter: EventEmitter - 事件发射器，用于统一管理自定义事件

### 流管理数据结构

- _streams: Map<string, MediaStream> - 流对象映射表，key格式为"userId_streamType"，value为MediaStream对象

- _streamIds: Map<string, string> - 流ID映射表，key格式为"userId_streamType"，value为Zego SDK的streamId

### 事件监听器引用

_listeners - 存储绑定的事件监听器引用，用于在清理时正确移除监听器

## 三、私有方法

### 流管理相关

#### _destroyStream(streamKey: string, isLocal: boolean)

作用和设计思路：

- 统一处理流的销毁逻辑，区分本地流和远端流

- 本地流：调用 stopPublishingStream() 停止推流，然后 destroyStream() 销毁

- 远端流：调用 stopPlayingStream() 停止拉流

- 设计思路：通过 isLocal 参数区分处理方式，避免重复代码

####  _fullCleanup()

作用和设计思路：

- 在初始化前执行完整清理，确保系统处于干净状态

- 遍历所有流进行销毁，停止所有轨道，清空数据结构

- 移除所有事件监听器

- 设计思路：防止重复初始化导致的状态混乱和内存泄漏

#### _getStreamKey(userId: string, streamType: string)

作用和设计思路：

- 生成统一的流标识符，格式为"userId_streamType"

- 用于在Map中快速定位和管理流对象

- 设计思路：使用统一的命名规范，便于流的管理和查找

#### _getLocalStream()

作用和设计思路：

- 获取当前用户的本地主流

- 通过固定的streamKey从_streams中获取

- 设计思路：封装获取本地流的逻辑，提供统一的访问接口

### 配置转换相关

#### _convertVideoProfile(profile: string, cameraConfig: any)

作用和设计思路：

- 将标准视频分辨率配置转换为Zego SDK的配置参数

- 支持Zego原生档位（240p/480p/720p）和自定义档位（档位4）

- 提供标准分辨率映射表，支持120p到4K的配置

- 设计思路：统一不同厂商的配置格式，提供标准化的分辨率配置接口

### 渲染相关

#### _renderStreamToView(stream: MediaStream, view: string | HTMLElement, options)

作用和设计思路：

- 将MediaStream渲染到指定的DOM容器中

- 支持字符串ID和HTMLElement对象两种view参数

- 处理视频元素的属性设置：autoplay、muted、playsInline等

- 支持镜像显示和填充模式配置

- 设计思路：封装视频渲染逻辑，提供统一的显示接口，支持多种显示选项

### 事件处理相关

#### _onRoomStreamUpdate(roomID, updateType, streamList, extendedData)

作用和设计思路：

- 处理房间流状态更新事件，包括流新增和删除

- ADD类型：自动拉取新流，保存到_streams，触发REMOTE_VIDEO_AVAILABLE事件

- DELETE类型：停止拉流，清理数据，触发REMOTE_VIDEO_UNAVAILABLE事件

- 通过streamId判断流类型（主流或屏幕共享流）

- 设计思路：实现自动流管理，减少上层调用复杂度

#### _onRoomUserUpdate(roomID, updateType, userList)

作用和设计思路：

- 处理用户进出房间事件

- ADD类型：触发REMOTE_USER_ENTER事件

- DELETE类型：触发REMOTE_USER_EXIT事件

- 设计思路：统一用户状态管理，提供标准的事件通知

#### _onScreenShareStopped(mediaStream)

作用和设计思路：

- 处理用户主动停止屏幕共享的事件

- 清理屏幕共享流数据

- 触发SCREEN_SHARE_STOPPED事件

- 设计思路：处理用户主动操作，确保状态同步

### 工具方法

#### _generateId(...parts)

作用和设计思路：

- 统一的ID生成器，将多个部分组合成唯一标识符

- 过滤null值，使用下划线连接

- 设计思路：提供统一的ID生成规范，确保标识符的唯一性和可读性

#### _getHallToken()

作用和设计思路：

- 从服务器获取大厅登录所需的token

- 构建请求参数：timestamp、app_id、user_name等

- 发送POST请求到token服务器

- 设计思路：封装token获取逻辑，提供统一的认证接口

#### handleSdkCall<T>(sdkMethod, successMsg)

作用和设计思路：

- 统一的SDK调用错误处理方法

- 执行SDK方法，捕获异常并转换为标准响应格式

- 返回APICommonResponse格式的结果

- 设计思路：统一错误处理，提供一致的API响应格式

#### _cleanupScreenStream(emitEvent: boolean)

作用和设计思路：

- 专门清理屏幕共享流的方法

- 销毁流、停止轨道、清理数据

- 可选择是否触发SCREEN_SHARE_STOPPED事件

- 设计思路：封装屏幕共享流的清理逻辑，支持不同的清理场景

## 四、核心内容总结

### 核心功能实现流程

#### 1. 初始化流程

```
create() → _fullCleanup() → _zego.create() → 设置_server
```

#### 2. 进入房间流程

```
enterRoom() → _getHallToken() → _zego.loginHall() → _zego.enterRoom() → _addListener()
```

#### 3. 本地流发布流程

```
previewLocalStream() → _zego.createStream() → 保存到_streams → _renderStreamToView()
publishLocalStream() → _generateId() → _zego.startPublishingStream() → 保存streamId
```

#### 4. 远端流播放流程

```
_onRoomStreamUpdate(ADD) → _zego.startPlayingStream() → 保存到_streams → 触发REMOTE_VIDEO_AVAILABLE
startRemoteVideo() → 从_streams获取流 → _renderStreamToView()
```

#### 5. 屏幕共享流程

```
startScreenShare() → _zego.createStream({screen}) → _zego.startPublishingStream() → 保存流信息
```

### 关键参数处理

流标识符管理

- streamKey格式："userId_streamType"（如："user123_main"、"user123_sub"）

- streamType类型："main"（主流）、"sub"（屏幕共享流）

- streamId生成："stream_userId_streamType_timestamp"

视频配置转换

- Zego原生档位：240p(1)、480p(2)、720p(3)

- 自定义档位：档位4，支持width/height/frameRate/bitrate配置

- 标准分辨率映射：120p到4K的完整配置表

事件系统设计

- 标准事件名：统一的事件命名规范，如"remote-user-enter"

- 事件数据格式：包含userId、streamId、streamType等关键信息

- 自动流管理：通过事件自动处理流的拉取和清理

错误处理机制

- 统一响应格式：APICommonResponse包含success、code、msg、data字段

- 异常捕获：所有SDK调用都通过handleSdkCall包装

- 状态清理：确保异常情况下的资源正确释放



## 本地流的详细流程

```
用户调用
  ↓
previewLocalStream()  ────────┐
  │                           │ 
  ├─ createStream()           │ [1] 创建流
  ├─ _getStreamKey()          │     生成key: "user123_main"
  └─ _streams.set()           │ [2] 存入Map（streamID为空）
                              │
publishLocalStream()  ────────┤
  │                           │
  ├─ _getLocalStream()        │ [3] 从Map读取
  │   └─ _streams.get()       │
  ├─ startPublishingStream()  │ [4] SDK推流，生成真实streamID
  └─ _streams.set()           │ [5] 更新Map（填入streamID）
                              │
updateLocalStream()  ─────────┤
  └─ _getLocalStream()        │ [6] 读取流进行操作
      └─ _streams.get()       │
                              │
stopLocalStream()  ───────────┤
  ├─ _streams.get()           │ [7] 读取并停止
  └─ _streams.delete()        │ [8] 从Map移除
```


## 屏幕共享流的详细流程


```
startScreenShare()
  │
  ├─ createStream({ screen })   [1] 创建屏幕流
  ├─ _getStreamKey(accid, "sub") 
  │   └─ 生成key: "user123_sub"
  └─ _streams.set()              [2] 存入Map，key用"sub"表示辅流

stopScreenShare()
  └─ _cleanupScreenStream()
      ├─ _streams.get()          [3] 读取
      └─ _streams.delete()       [4] 移除
```


## 远端流的详细流程


```
SDK触发事件
  ↓
_onRoomStreamUpdate(updateType="ADD", streamList)
  │
  ├─ for each streamInfo:
  │   ├─ 判断streamType            [1] 通过streamID识别流类型
  │   │   └─ streamID.includes("_screen_") ? "sub" : "main"
  │   │
  │   ├─ startPlayingStream()      [2] SDK自动拉流
  │   │
  │   ├─ _getStreamKey(userId, streamType)
  │   │   └─ 生成key: "remoteUser_main"
  │   │
  │   └─ _streams.set()            [3] 存入Map（isLocal=false）
  │
  └─ emit REMOTE_VIDEO_AVAILABLE   [4] 通知业务层

业务层调用
  ↓
startRemoteVideo({ userId, streamType, view })
  │
  ├─ _getStreamKey()               [5] 生成查询key
  ├─ _streams.get()                [6] 从Map取出已拉取的流
  └─ _renderStreamToView()         [7] 渲染到DOM

stopRemoteVideo()
  ├─ _streams.get()                [8] 读取
  ├─ stopPlayingStream()           [9] 停止拉流
  └─ _streams.delete()             [10] 移除
```

设计流程：

```
SDK事件驱动 → Adapter自动拉流 → 存入流池 → 触发业务事件 → 业务层被动渲染
```





