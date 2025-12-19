---
layout: ../../../layouts/MarkdownPostLayout.astro
title: 'VOP学习（九）Recorder混音实现'
pubDate: '2025-10-21'
author: 'Magicalball'
tags: ['VOP学习']
---

## WebRTC API

### MediaRecorder()

给定一个要录制 MediaStream ，创建一个新的 MediaRecorder 对象。可用的选项包括设置容器的 MIME 类型（例如 "video/webm" 或 "video/mp4" ），以及音频和视频轨道的比特率，或设置单个总比特率。

简单来说就是使用这个方法并传入MediaStream，可以按指定 `mimeType`（容器/编码格式）和比特率等选项对音视频进行编码并分段输出（通过 `dataavailable` 事件得到 `Blob` chunks），最终组合成文件（`Blob` -> 下载 / 上传 / MediaSource 播放）。

MIME type（媒体类型）：像 `"video/webm"`、`"video/mp4"` 的字符串，它告诉浏览器我们期望的容器/编码组合。

Blob：二进制大对象，`MediaRecorder` 的 `dataavailable` 会返回 `Blob`（通常是 container format 的一段数据，例如 webm chunk）。用途：`URL.createObjectURL(blob)` 预览，或 `blob.arrayBuffer()` 上传 / 存盘。

### MediaStreamTrack()

`MediaStreamTrack` 表示一个单一的媒体轨道：**音频轨道（microphone）或视频轨道（camera / screen）**。它是 `MediaStream` 的基本单元：一个 `MediaStream` 通常由若干 `MediaStreamTrack`（audio/video）组合而成。

## 适配录制与屏幕共享

功能：多流录制，加密，压缩

### 调用流程

```
用户调用
  ↓
MediaRecorderAPI.setupRecorder()
  ↓
EncryptionRecorder.setupRecorder()
  ↓
#buildRecorderOptions() // 参数验证
  ↓
AudioMixer.setupAudioGraph() // 混音处理
  ↓
BaseRecorder.setupRecorder()
  ↓
new MediaRecorder(stream, options)
  ↓
WebRTC MediaRecorder API
```




