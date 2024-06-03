# Zenith Cloudkit

[English](README.md) | 简体中文

欢迎使用 Zenith Cloudkit! 这是一个出色的工具包，旨在使您的云开发更加轻松。无论您是经验丰富的专业人士，还是刚刚入门的初学者，本README都将指导您了解使用Zenith Cloudkit所需的一切。

## Table of Contents

- [开始](#getting-started)
  - [架构](#architecture)
  - [安装](#installation)
  - [使用](#usage)
- [特征](#features)
- [贡献](#contributing)
- [使用许可](#license)

## 开始

本说明文档将帮助您在本地计算机上安装和使用Zenith Cloudkit。

### 架构

![architecture](/source/app/public/imgs/architecture.png)

### 安装

要安装Zenith Cloudkit，请按照以下步骤操作：

1. 克隆代码仓库到本地机器:

   ```bash
   git clone https://github.com/530051970/zenith-cloudkit.git

2. 进入 Zenith Cloudkit 目录:

   ```bash
   cd zenith-cloudkit/source/app

3. 安装必要的依赖:

   ```bash
   npm install

### Usage

1. 安装完成后，您可以通过运行以下命令来使用Zenith Cloudkit:

   ```bash
   npm run start

这将启动应用程序，您可以在Web浏览器中通过 http://localhost:3000 进行访问。

![login](/source/app/public/imgs/login.png)

### 特征
- 特征 1: 工具集.
  ### S3 消消乐
  在控制台删除S3存储桶时，必须首先手动清空存储桶，如下图所示。

![emptyS3](/source/app/public/imgs/emptyS3.png)

  在实际场景中，经常会有数十个需要清理的S3存储桶，逐个手动删除非常低效。S3 消消乐可以一键删除多个S3存储桶，无论这些存储桶是否为空，如下图所示。

![s3crusher-1](/source/app/public/imgs/s3crusher-1.png)
![s3crusher-2](/source/app/public/imgs/s3crusher-2.png)

  ### 内网穿透
  在云应用程序开发中，经常会遇到需要从本地环境连接到VPC私有子网资源的情况。通常，这需要在VPC中设置一个堡垒主机并配置安全组，这是一个繁琐的过程。使用这个工具，您可以在两个步骤中轻松设置一个堡垒主机，从而实现从本地环境访问云资源。

![nat-1](/source/app/public/imgs/nat-1.png)
![nat-2](/source/app/public/imgs/nat-2.png)

- 特征 2: 模版集市
  这个模块将逐步发布一系列小应用程序。用户可以下载相应的模板，部署到他们的账户，并立即开始使用它们。如果需要，您可以提交一个问题来联系作者进行新模板的开发。您也可以点击这里提交PR进行二次开发。

![template](/source/app/public/imgs/template.png) 

  ### 数据生成器 
  在toB产品、toC产品开发或当今比较火热的模型训练过程中，对数据集的要求变得越来越严格。一般来说，这些要求可以概括如下：
![dataset](/source/app/public/imgs/dataset.png) 
  此产品允许您仅通过几个简单的步骤完成从数据生成到数据注入的整个过程。具体如下：
  1）自定义字段

![customize](/source/app/public/imgs/customize-fields.png) 

  2）配置其他参数

![params](/source/app/public/imgs/tool-params.png) 

  3）设置输出终端

![endpoint](/source/app/public/imgs/endpoint.png) 

  4）预览 & 开启任务

![preview](/source/app/public/imgs/preview.png)   

- 特征 3: 脚手架.
  持续更新中，敬请关注。

### 贡献
我们欢迎来自社区的贡献！如果您有新功能或改进的想法，请提交issue或代码PR。

1. Fork仓库.
2. 创建自己的分支: 

   ```bash
   git checkout -b my-new-feature

3. 提交变更:

   ```bash
   git commit -am 'Add some feature'

4. 提交到自己的远程分支:

   ```bash
   git push origin my-new-feature

5. 提交PR。

### 使用许可
该项目根据 Apache 许可证 2.0 版获得许可 - 有关详细信息，请参见 [LICENSE](http://www.apache.org/licenses/) 文件。
