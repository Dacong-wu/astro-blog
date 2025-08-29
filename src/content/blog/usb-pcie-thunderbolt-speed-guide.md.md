---
publishDate: 2025-08-29
title: USB、PCIe、Thunderbolt 接口与速率全解析
excerpt: 各种接口标准（USB 3.x / USB4、PCIe 3.0/4.0/5.0、Thunderbolt 3/4）命名复杂、速率各不相同，经常让人困惑。本文整理了一份对照表和简明解释，涵盖 USB 协议版本、PCIe 通道速率、雷雳与 USB4 的关系，以及在实际设备（如 NVMe 硬盘盒、拓展坞）中的带宽分配规则，方便快速查阅。
image: '~/assets/images/blog/thomas-crozier-Ngj2u4PHjBY-unsplash.jpg'
category: notes
tags:
  - usb
  - pcie
  - thunderbolt
metadata:
  image_author:
    link: https://unsplash.com/@crozier
    name: crozier
---

# 接口/协议速率备忘录

整理 USB、PCIe、Thunderbolt 等常见接口标准。

---

## 一、USB 标准发展

USB 的命名非常混乱，以下是对应关系：

| 名称（旧称） | 新称                          | 理论速率     | 实际速率        | 说明                       |
| ------------ | ----------------------------- | ------------ | --------------- | -------------------------- |
| USB 3.0      | USB 3.1 Gen1 / USB 3.2 Gen1x1 | 5 Gbps       | ~500 MB/s       | 入门 USB3                  |
| USB 3.1 Gen2 | USB 3.2 Gen2x1                | 10 Gbps      | ~1000 MB/s      | 主流高速硬盘盒             |
| -            | USB 3.2 Gen2x2                | 20 Gbps      | ~2000 MB/s      | 双通道，较少见             |
| -            | USB4                          | 20 / 40 Gbps | ~2000–4000 MB/s | 与雷雳3统一，支持 Alt Mode |

**注意**：  
- **Type-C** 只是接口外形，不代表速率。  
- 如果标注 **Type-C 2.0**，那只是 **USB 2.0 协议（480 Mbps ≈ 60 MB/s）**。  

---

## 二、PCIe 标准

PCIe 是 NVMe SSD 的底层协议，速率取决于 **代际** + **通道数（x1、x2、x4...）**。

| PCIe 版本 | 每通道速率 | x4 总速率 | 常见应用                   |
| --------- | ---------- | --------- | -------------------------- |
| PCIe 1.0  | 250 MB/s   | 1 GB/s    | 早期显卡                   |
| PCIe 2.0  | 500 MB/s   | 2 GB/s    | 老显卡/SSD                 |
| PCIe 3.0  | ~985 MB/s  | ~4 GB/s   | 主流 NVMe SSD（3500 MB/s） |
| PCIe 4.0  | ~1969 MB/s | ~8 GB/s   | 高端 NVMe SSD（7000 MB/s） |
| PCIe 5.0  | ~3938 MB/s | ~16 GB/s  | 新旗舰 SSD（12000 MB/s+）  |
| PCIe 6.0  | ~7877 MB/s | ~32 GB/s  | 刚发布，未普及             |

---

## 三、Thunderbolt（雷雳）

Intel 推出的高速互联标准，从 3 代开始用 USB-C 接口：

| 版本          | 速率    | 接口   | 特点                                 |
| ------------- | ------- | ------ | ------------------------------------ |
| Thunderbolt 1 | 10 Gbps | MiniDP | 早期标准                             |
| Thunderbolt 2 | 20 Gbps | MiniDP | 提升速率                             |
| Thunderbolt 3 | 40 Gbps | USB-C  | 与 USB 融合，支持外接显卡/双 4K 显示 |
| Thunderbolt 4 | 40 Gbps | USB-C  | 更强制规范，更好兼容性               |

---

## 四、USB4 与 Thunderbolt 的关系

- **USB4 = 开放标准**，最高 40Gbps，融合了雷雳3 技术。  
- **Thunderbolt 3/4 = Intel 认证标准**，同样 40Gbps，但兼容性、功能保障更好。  
- 所有 Thunderbolt 3/4 设备兼容 USB4 接口。  
- 但不是所有 USB4 设备都有完整的 Thunderbolt 功能。  

---

## 五、实际应用对比（SSD 外置硬盘盒）

| 硬盘盒接口                      | 理论速率 | 实测速度   | 能否跑满 NVMe 3500 MB/s |
| ------------------------------- | -------- | ---------- | ----------------------- |
| USB 3.2 Gen2 (10Gbps)           | ~1 GB/s  | ~1000 MB/s | ❌ 浪费性能              |
| USB 3.2 Gen2x2 (20Gbps)         | ~2 GB/s  | ~2000 MB/s | ⚠️ 一半性能              |
| USB4 / Thunderbolt 3/4 (40Gbps) | ~4 GB/s  | ~3500 MB/s | ✅ 完美匹配              |

---

## 六、USB-C 接口多功能复用

USB-C 一根线可以同时传输：  
- **数据**（USB 3.x/4 带宽，10–40Gbps）  
- **视频**（DisplayPort / HDMI Alt Mode，独立针脚，不占 USB 带宽）  
- **电力**（USB PD，最高 240W）  

👉 举例：拓展坞一个 10Gbps Type-C 接口：  
- 3 个 USB 口共享这 10Gbps 带宽。  
- HDMI 走独立视频通道（Alt Mode），不占 USB 带宽。  
- 供电也独立传输。  

---

# ✅ 总结

- **USB 看协议版本，不要只看 Type-C 外形**。  
- **PCIe 版本 + 通道数** 决定 NVMe SSD 的速度。  
- **Thunderbolt 3/4 ≈ USB4 40Gbps**，但雷雳认证更有保障。  
- 要让 NVMe SSD（PCIe 3.0 x4，3500 MB/s）跑满，必须选 **USB4/雷雳 3/4 硬盘盒**。  
