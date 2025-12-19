---
layout: ../../../layouts/MarkdownPostLayout.astro
title: 'VOP学习（七）MediaStream媒体流'
pubDate: '2025-10-13'
author: 'Magicalball'
tags: ['VOP学习']
---

## 什么是MediaStream？

`MediaStream`是Web API中用于表示音视频的对象。一个`MediaStream`可以包含一个或者多个媒体轨道（MediaStreamTrack）比如：视频轨道，音频轨道，并且每一个**轨道**中也可以包含多个**通道**，**通道**是媒体流的最小单位，即传入信号，左声道等具体的信息。

## MediaStream的特性

- 同步性：音视频的轨道是在时间上同步的。
- 动态性：在运行时可用添加或删除轨道。
- 只读性：不存储数据仅仅如指针一般引用实时的数据。
- 不可序列化：不能跨页面共享，不能通过JSON.stringify()传输。

## MediaStream的“输入”与“输出“

`MediaStream`对象只有一个输入和输出（在源头只能有一个输入，如摄像头，但是输出可以是多个的比如屏幕或者其他的屏幕）

input -> MediaStream -> output

## MediaStream的来源

本地（local），非本地（remote）

本地：自身源头，是否允许调用本地摄像头，麦克风

非本地：来源一般有三种，<video>等标签播放视频，网络（其他人的WebRTC），Web Audio API（代码生成的）

- "cover"（默认）：放大视频填满容器，保持宽高比，可能裁剪

- "contain"：完整显示视频，保持宽高比，可能有黑边

- "fill"：拉伸视频填满容器，不保持宽高比，可能变形
