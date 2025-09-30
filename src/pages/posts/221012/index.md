---
layout: ../../../layouts/MarkdownPostLayout.astro
title: "【算法学习】——链表"
pubDate: "2022-10-12"
author: 'Magicalball'
tags: ['学习']
---

将两个链表相加，返回新的链表，然后遍历输出

```
package LK;

public class 两个链表相加 {
    public static class Lode {
        public int val;
        public Lode next;

        public int getVal() {
            return val;
        }

        public void setVal(int val) {
            this.val = val;
        }

        public Lode getNext() {
            return next;
        }

        public void setNext(Lode next) {
            this.next = next;
        }

        public Lode(int val) {
            this.val = val;
        }

        @Override
        public String toString() {
            return "Node{" +
                    "val=" + val +
                    '}';
        }
    }

    public static int listLength(Lode head) {
        int length = 0;
        while (head != null) {
            head = head.next;
            length++;
        }
        return length;
    }

    public static Lode Add(Lode head1, Lode head2) {
        int len1 = listLength(head1);
        int len2 = listLength(head2);
        Lode l = len1 >= len2 ? head1 : head2;
        Lode s = l == head1 ? head2 : head1;
        Lode curL = l;
        Lode curS = s;
        Lode last = curL;
        int carry = 0;//进位
        int curNum = 0;
        while (curS != null) {
            curNum = curL.val + curS.val + carry;
            curL.val = curNum % 10;
            carry = curNum / 10;
            last = curL;
            curL = curL.next;
            curS = curS.next;

        }
        while (curL != null) {
            curNum = curL.val + carry;
            curL.val = curNum % 10;
            carry = curNum / 10;
            last = curL;
            curL = curL.next;

        }
        if (carry != 0) {
            last.next = new Lode(1);

        }
        return l;
    }

    public static void main(String[] args) {
          Lode l1=new Lode(1);
          l1.next=new Lode(2);
          Lode l2=new Lode(1);
          l2.next=new Lode(9);
          l1=Add(l1,l2);
          while(l1!=null){
              System.out.println(l1.val);
              l1=l1.next;
          }

    }
}
```
