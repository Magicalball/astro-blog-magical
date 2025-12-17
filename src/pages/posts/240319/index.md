---
layout: ../../../layouts/MarkdownPostLayout.astro
title: 'Java学习笔记 —— HashMap'
pubDate: '2024-03-19'
author: 'Magicalball'
tags: ['学习']
---

HashMap 作为 Java 中一个重要的知识点，经常出现在面试题中，跟随 Java 学习，因此我决定总结一下今天所学的 HashMap 内容。

## 什么是 HashMap

我们可以参考菜鸟教程给出的定义：

HashMap 是一个散列表，它存储的内容是键值对(key-value)映射。

HashMap 实现了 `Map` 接口，根据键的 `HashCode` 值存储数据，具有很快的访问速度，最多允许一条记录的键为 `null`，不支持线程同步。

HashMap 是无序的，即不会记录插入的顺序。

HashMap 继承于 `AbstractMap` ，实现了 `Map` 、 `Cloneable` 、 `java.io.Serializable` 接口。

**其实我们可以发现** HashMap 能够通过 key 以时间复杂度 `O（1）` 直接获取到对应的 value 值。

要想进一步了解更多有关 HashMap 的内容我们先刨析学习一下 HashMap 的结构。

## HashMap 结构

> 我们都知道数组，数组的特点是存储区间连续的，内存占用严重。 优点是随机读取和修改效率高。 查询来说时间复杂度 O(1) 缺点是插入和删除速度慢。时间复杂度为 O(N) 接下来链表的特点是存储区间是离散的。内存利用率高 优点是插入和删除速度快 缺点是不能随机查找。查询效率低 而树的特点是本身具备了排序能力

看到了这些方法我们是不是有一个大人的想法那就是”小孩子才做选择，我全都要！“，综合起来我们便知道了 HashMap 的结构！

HashMap 就是采用了**数组+链表+红黑树**的结构。

通过分析得知可以通过 HashMap 中的 `key` 得到数组的索引，加快了 CRUD 的所有操作。

如何根据 `key` 得到索引呢？

答案:哈希算法:就是把任意长度值(key)通过散列算法转换成固定长度的 key(索引地址)，通过这个索引地址完成数据的操作。

## HashMap 的各种方法及使用

### HashMap 的 Put 方法

**put(k,v)**

- 首先把 `key` ， `value` 封装成一个 `Node(HashMap的内部类 {hash，key，value，next})` 对象。
    
- 底层调用 `key` 的 `hashCode` 方法得到对应的 Hash 值。
    
- 通过哈希算法将 Hash 值转换成数组对应的索引值。如果索引值对应的位置没有任何元素则把 `Node` 对象放入到此索引位置，如果索引位置已经存在元素，就会拿着 `key` 和链表中所有 `Node` 对象的 `key` 进行 `equals` 比较。如果所有的 `key` 都比较完毕返回 `false` 则把新 `Node` 放入到链表的尾部。如果在比价过程中有一个 `key` 相同，则返回 `true` 。那么这个 `Node` 将会被新的 `Node` 覆盖(相当于修改)。
    

### HashMap 的 Get 方法

**get(key)**

- 底层调用 `key` 的 `hashCode` 方法得到对应的 Hash 值。
    
- 通过哈希算法将 Hash 值转换成数组对应的索引值。
    
- 通过索引定位到链表。如果此位置没有任务数据则返回 `null`，如果此位置存在一个单向链表则使用 `key` 和链表中所有元素的 `key` 进行比较。都不成功返回 `null` ，成功则返回当前 `Node` 。
    

### HashMap 的 Remove 方法

**remove(key,value)**

- `HashMap` 调用 `key` 的 `hashCode` 来计算 Hash 值，这个 Hash 值用来确定存储在 Hash 表中的位置。
- 通过哈希算法将 Hash 值转换成 Hash 表中的索引位置。
- 如果在 Hash 表中的对应位置有多个映射到同一个索引，则发生了哈希冲突，那么就在这些 `key` 的链表或者树结构中遍历去寻找要删除的 `key` 。
- 对比删除 `key` 和链表中的每个节点的 `key` ，直到找到匹配的 `key` 或者遍历全部，当找到匹配的 `key` 时候，将相应的 `entry` （键值对）从链表或者树中删除。

### HashMap 各种方式的使用

**1.引入 HashMap 的包**

```java
import java.util.HashMap;
```

**2.创建 HashMap 对象**

```java
HashMap<Integer,String> Maps = new HashMap<Integer,String>();
//创建一个HashMap对象map，整型的key和String类型的value
```

**3\. `put(key,value)` 添加**

```java
HashMap<Integer,String> Maps = new HashMap<Integer,String>();
//添加4个键值对
Maps.put(1,"Hutao");
Maps.put(2,"Frilyn");
Maps.put(3,"Dazai");
Maps.put(4,"Sakura");
//输出
System.out.println(Maps);
```

输出结果如下：

```java
{1=Hutao, 2=Frilyn, 3=Dazai, 4=Sakura}
```

**4\. `get(key)` 获取/访问**

```java
HashMap<Integer,String> Maps = new HashMap<Integer,String>();
Maps.put(1,"Hutao");
Maps.put(2,"Frilyn");
Maps.put(3,"Dazai");
Maps.put(4,"Sakura");
//输出
System.out.println(Maps.get(2));//获取key对应的value
System.out.println(Maps.get(3));
```

输出结果如下：

```java
Frilyn
Dazai
```

**5\. `remove(key)` 删除**

```java
HashMap<Integer,String> Maps = new HashMap<Integer,String>();
Maps.put(1,"Hutao");
Maps.put(2,"Frilyn");
Maps.put(3,"Dazai");
Maps.put(4,"Sakura");
//将key为4对应的键值对（key-value）删去
Maps.remove(4);
//输出
System.out.println(Maps);
```

输出结果如下：

```java
{1=Hutao, 2=Frilyn, 3=Dazai}
```

**6\. `size()` 计算大小**

```java
HashMap<Integer,String> Maps = new HashMap<Integer,String>();
Maps.put(1,"Hutao");
Maps.put(2,"Frilyn");
Maps.put(3,"Dazai");
Maps.put(4,"Sakura");
//获取元素数量并输出
System.out.println(Maps.size());
```

输出结果如下：

```java
4
```

**7\. `keySet()` 返回 hashMap 中所有 key 组成的集合视图**

```java
HashMap<Integer,String> Maps = new HashMap<Integer,String>();
Maps.put(1,"Hutao");
Maps.put(2,"Frilyn");
Maps.put(3,"Dazai");
Maps.put(4,"Sakura");
//返回所有 key 组成的 set 集合视图
System.out.println(Maps.keySet());
```

输出结果如下：

```java
[1, 2, 3, 4]
```

**8\. `getOrDefault(key,defaultValue)` 获取指定 key 对应对 value，如果找不到 key ，则返回设置的默认值** `defaultValue` 当指定的 `key` 不存在映射关系中时返回该默认值。

```java
HashMap<Integer,String> Maps = new HashMap<Integer,String>();
Maps.put(1,"Hutao");
Maps.put(2,"Frilyn");
Maps.put(3,"Dazai");
Maps.put(4,"Sakura");
//key映射存在
String a = Maps.getOrDefault(1,"没找到");
System.out.println(a);
//key映射不存在
String b = Maps.getOrDefault(5,"没找到");
System.out.println(b);
```

输出结果如下：

```java
Hutao
没找到
```

HashMap 还有许多方法这里暂时没有举例，引用菜鸟教程的常用方法列表：

| 方法 | 描述 |
| --- | --- |
| clear() | 删除 hashMap 中的所有键/值对 |
| clone() | 复制一份 hashMap |
| isEmpty() | 判断 hashMap 是否为空 |
| putAll() | 将所有键/值对添加到 hashMap 中 |
| putIfAbsent() | 如果 hashMap 中不存在指定的键，则将指定的键/值对插入到 hashMap 中。 |
| containsKey() | 检查 hashMap 中是否存在指定的 key 对应的映射关系。 |
| containsValue() | 检查 hashMap 中是否存在指定的 value 对应的映射关系。 |
| replace() | 替换 hashMap 中是指定的 key 对应的 value。 |
| replaceAll() | 将 hashMap 中的所有映射关系替换成给定的函数所执行的结果。 |
| forEach() | 对 hashMap 中的每个映射执行指定的操作。 |
| entrySet() | 返回 hashMap 中所有映射项的集合集合视图。 |
| values() | 返回 hashMap 中存在的所有 value 值。 |
| merge() | 添加键值对到 hashMap 中 |
| compute() | 对 hashMap 中指定 key 的值进行重新计算 |
| computeIfAbsent() | 对 hashMap 中指定 key 的值进行重新计算，如果不存在这个 key，则添加到 hasMap 中 |
| computeIfPresent() | 对 hashMap 中指定 key 的值进行重新计算，前提是该 key 存在于 hashMap 中。 |

## HashMap 的一些知识点

**Q：为什么效率快?** A：添加和修改功能都在链表上操作。而查询功能通过索引可以快速排除大部分数据，只在一部分链表上进行检索。

**Q：为什么使用红黑树?** A：当链表长度过长的时候会出现查询速度慢的情况，链表在理论上来说可以无限延长。这时候就需要切换成红黑树。红黑树的特点就是插入慢(因为要判断小中大)，查询速度快。

**Q：HashMap 的扩容和转换** **A：** **扩容(数组):** `HashMap` 默认的数组长度为 16.负载因子为 0.75(数组的长度达到容器 0.75 的时候就扩容)。每次扩容是原来的 2 倍。每次扩容后原来数组中的元素会依次重新计算并且插入。

**转换(链表和红黑树)：** 链表长度大于 8 并且数组长度大于 64 则转换成红黑树。链表长度低于 6 的时候红黑树会转换成链表

## HashMap 与 HashTable

**HashTable 和 HashMap 的区别：**

从用法角度来看是一样的，区别是以下几点:

- `HashMap` 是线程不安全的。 `HashTable` 是线程安全的
- `HashMap` 效率高，`HashTable` 效率低
- `HashMap` 中的 `key` 和 `value` 都可以为 `null` ， `HashTable` 不可以为 `null` 。

## 总结

`HasdMap` 是 `Java` 中常见且重要的内容，本文章写于 `HashMap` 学习后，经整理而写，由于对 `HashMap` 的掌握还不够深刻，全文并没有太深度的讲解底层原理以及一些高级应用的方法，属于一篇基础版，在攥写过程中内容主要参考了菜鸟教程。希望通过本文章能够帮助到你，感谢阅读。
