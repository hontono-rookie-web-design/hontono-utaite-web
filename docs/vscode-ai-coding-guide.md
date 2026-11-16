# VS CodeとAIコーディングツールの導入ガイド

VS Codeのインストール方法と、AIコーディングツールの導入方法を紹介します。

## 1. VS Codeのインストール

[Visual Studio Code（VS Code）](https://code.visualstudio.com/)
は、Microsoftが提供する無料のコードエディタです。

### インストール手順

1. [VS Code公式ダウンロードページ](https://code.visualstudio.com/download)を開きます。
2. 使用しているOS（Windows / macOS / Linux）に対応したファイルをダウンロードします。
3. 画面の案内に従ってインストールし、VS Codeを起動します。

<img width="1418" height="837" alt="image" src="https://github.com/user-attachments/assets/c4812b1e-0f47-4988-af9d-6814f5510b8c" />

詳しくは[VS Code公式インストールガイド](https://code.visualstudio.com/docs/setup/setup-overview)を参照してください。

## 2. VS Codeの拡張機能について

VS Codeでは、「拡張機能」を追加することで、AIツールなどを利用できます。

### 拡張機能のインストール方法

1. VS Code左側の「拡張機能（Extensions）」アイコンをクリックします。

   <img width="674" height="551" alt="image" src="https://github.com/user-attachments/assets/5c176ff6-d554-47d8-a686-e6c9bda9fe1a" />
   
2. 検索欄に拡張機能の名前を入力します。
3. 目的の拡張機能を選択し、「インストール（Install）」をクリックします。

   <img width="663" height="253" alt="image" src="https://github.com/user-attachments/assets/afac86d8-d1d9-4910-940e-3cac57e7235a" />


詳しくは[VS Code拡張機能の公式ガイド](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace)を参照してください。

## 3. GitHub Copilotの導入

[GitHub Copilot](https://github.com/features/copilot)は、VS Codeでコードの補完・生成や質問への回答を行うAIツールです。

**料金：無料プランあり（利用回数に制限あり）**

### 導入方法

1. VS CodeのCopilotアイコンから「Use AI Features」を選択します。

   <img width="278" height="46" alt="image" src="https://github.com/user-attachments/assets/5e1b780a-0c29-4f47-a018-65fb0f3c1418" />
   
2. GitHubアカウントでサインインします。

   <img width="610" height="385" alt="image" src="https://github.com/user-attachments/assets/b3277bf0-7ef3-4d95-a9c3-06709ea2aa51" />
   
3. 画面の案内に従って設定を完了します。

   <img width="389" height="168" alt="image" src="https://github.com/user-attachments/assets/1259990d-8e43-46af-a695-a948c07df872" />

詳しくは[GitHub Copilotのセットアップガイド](https://code.visualstudio.com/docs/setup/copilot/)を参照してください。

## 4. その他のAIコーディングツール

以下の順番でおすすめします。

### 4.1 OpenCode

[OpenCode](https://opencode.ai/ja)は、無料で使い始められるオープンソースのAIコーディングツールです。

**料金：無料モデルあり（一部はアカウント登録不要）**

初めてAIツールを利用する方には、OpenCodeをおすすめします。

#### 導入方法

1. [OpenCode公式サイト](https://opencode.ai/ja)からダウンロードしてインストールします。

   <img width="1303" height="949" alt="image" src="https://github.com/user-attachments/assets/bfc2eff4-f35f-4d14-926a-0c3d09488619" />
   
2. OpenCodeを起動します。
3. 無料モデルを選択して利用を開始します。

VS Codeと連携する場合は、[公式IDE連携ガイド](https://opencode.ai/docs/ja/ide/)を参照してください。

VsCode のターミナルで：
1. `node -v; npm -v`

<img width="304" height="93" alt="image" src="https://github.com/user-attachments/assets/0702362d-335c-4eb8-962c-828533027f7d" />

2. `npm install -g @opencode/cli`

<img width="323" height="599" alt="image" src="https://github.com/user-attachments/assets/d80aa9fe-d553-467b-bb3e-5816e2a36d34" />

3. `opencode`

<img width="298" height="26" alt="image" src="https://github.com/user-attachments/assets/20983198-c04e-418c-b0a9-db4894fec9a7" />

4. OpenCode を起動します。

<img width="303" height="368" alt="image" src="https://github.com/user-attachments/assets/4ac07dac-f806-42c5-8d85-dfb68f9aa387" />

5. OpenCodeを終了するには、`Ctrl + C`（macOSでも同様）または `/exit` と入力します。

### 4.2 Claude Code

[Claude Code](https://claude.com/product/claude-code)は、Anthropicが提供するAIコーディングツールです。

**料金：基本的に有料プランが必要**

VS Codeの拡張機能としても利用できます。

- [Claude Code公式サイト](https://claude.com/product/claude-code)
- [VS Codeでの導入方法](https://code.claude.com/docs/en/vs-code)

<img width="1399" height="485" alt="image" src="https://github.com/user-attachments/assets/8afe4766-53e2-4044-8566-6fed1ad74c0a" />

<img width="1447" height="655" alt="image" src="https://github.com/user-attachments/assets/8ed0d65b-e945-4659-85d5-9a41b8b4311c" />


### 4.3 Codex

[Codex](https://openai.com/codex/)は、OpenAIが提供するAIコーディングエージェントです。

**料金：有料プラン中心（ChatGPT無料プランでも利用制限付きで使用可能）**

VS Codeの拡張機能としても利用できます。

- [Codex公式サイト](https://openai.com/codex/)
- [VS Codeでの導入方法](https://developers.openai.com/codex/ide)
- [利用プランについて](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan)

<img width="1365" height="358" alt="image" src="https://github.com/user-attachments/assets/8f711a91-f577-442b-9498-c66fbe6e1546" />


※ 各ツールの無料枠や利用条件は変更される場合があります。最新情報は公式サイトをご確認ください。
