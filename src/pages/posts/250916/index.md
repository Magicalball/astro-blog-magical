---
layout: ../../../layouts/MarkdownPostLayout.astro
title: 'VOP学习（一）客户端服务端配置不一致'
pubDate: '2025-09-16'
author: 'Magicalball'
tags: ['VOP学习']
---



## 问题发现

在进入登录页面以后，点击加入房间并推流，摄像头，麦克风等功能未能启用。

## 排查分析

查看控制台报错，显示为undefined

发现是sdk暂不支持，即应当使用qq的sdk却使用了网易的sdk

## 问题发现

客户端选择了qq，但实际使用的时候却是网易的。

## 排查分析

客户端选择了qq，但却使用了服务端的默认配置即网易

打log寻找被改变的地方

找到问题的核心代码：/src/control/meeting/index.ts

```typescript
const rtcChannel = newloginRes.enableRTCChannelList.filter(i => i.isDefault === 1 && i.isEnable === 1)[0];
```

通过控制台打印发现，因rtcChannel为undefined，导致该段代码的逻辑直接选择了默认的可用的，忽视了客户端的选择。

因此修改成逐渐降级的策略

```typescript
// 通道选择策略：用户选择 → 默认通道 → 第一个可用 → 降级默认
        let rtcChannel = {
          channel: RTCCont.rtcChannel || "qq",
          isEnable: 1,
          isDefault: 1,
        };

        if (newloginRes.enableRTCChannelList?.length) {
          rtcChannel =
            //用户选择 → 默认通道 → 第一个可用 → 降级默认
            newloginRes.enableRTCChannelList.find(
              (i) => i.channel === RTCCont.rtcChannel && i.isEnable === 1
            ) ||
            newloginRes.enableRTCChannelList.find(
              (i) => i.isDefault === 1 && i.isEnable === 1
            ) ||
            newloginRes.enableRTCChannelList.find((i) => i.isEnable === 1) ||
            rtcChannel;
        }

        console.log("Selected RTC channel:", rtcChannel);
```

## 问题解决

修改后重新登录，使用的配置与客户端相同，并且功能可用。



