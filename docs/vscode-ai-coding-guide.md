# VS CodeとAIコーディングツールの導入ガイド

このドキュメントでは、VS Codeのインストール方法と、AIコーディングツールの導入方法を紹介します。

初めて利用する方でも導入できるように、基本的な手順と公式ガイドへのリンクをまとめています。

## 1. VS Codeのインストール

[Visual Studio Code（VS Code）](https://code.visualstudio.com/)は、Microsoftが提供する無料のコードエディタです。

### インストール手順

1. [VS Code公式ダウンロードページ](https://code.visualstudio.com/download)を開きます。
2. 使用しているOS（Windows / macOS / Linux）に対応したファイルをダウンロードします。
3. ダウンロードしたファイルを開き、画面の案内に従ってインストールします。
4. VS Codeを起動します。

詳しくは[VS Code公式ドキュメント](https://code.visualstudio.com/docs/setup/setup-overview)を参照してください。

## 2. VS Codeの拡張機能について

VS Codeでは、「拡張機能」をインストールすることで、さまざまな機能を追加できます。

### 拡張機能のインストール方法

1. VS Codeを起動します。
2. 左側のメニューにある「拡張機能（Extensions）」アイコンをクリックします。
3. 検索欄にインストールしたい拡張機能の名前を入力します。
4. 該当する拡張機能を選択して「Install」をクリックします。

詳しくは[拡張機能の公式ガイド](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace)を参照してください。


## 3. GitHubアカウントとVS Codeの連携（任意）

VS Codeでは、GitHubアカウントと連携することで、GitHub上のリポジトリを扱いやすくなります。

### 連携手順

1. VS Codeを起動します。
2. 画面左下（または左側のアカウントアイコン）をクリックします。
3. 「Sign in with GitHub」を選択します。
4. ブラウザが開いたら、GitHubアカウントでログインし、画面の案内に従って認証します。
5. VS Codeに戻り、サインインできていることを確認します。

※ GitHubアカウントを持っていない場合は、[GitHub公式サイト](https://github.com/)から作成できます。

詳しくは[VS Code公式ドキュメント（GitHubとの連携）](https://code.visualstudio.com/docs/sourcecontrol/github)を参照してください。

## 4. GitHub Copilotの導入

[GitHub Copilot](https://github.com/features/copilot)は、AIを利用してコードの補完や生成、質問への回答などを行うツールです。

VS Code内で利用でき、GitHubアカウントでのサインインが必要です。

### 導入方法

1. VS Codeを起動します。
2. CopilotアイコンからAI機能のセットアップを開始します。
3. GitHubアカウントでサインインします。
4. 画面の案内に従って設定を完了します。

VS Codeのバージョンによっては、拡張機能のインストールを案内される場合があります。

詳しくは[GitHub Copilotのセットアップガイド](https://code.visualstudio.com/docs/copilot/setup)を参照してください。

## 5. その他のAIコーディングツール

GitHub Copilot以外にも、開発作業をサポートするAIツールがあります。

### Codex

OpenAIが提供するAIコーディングエージェントです。コードの作成・修正や、既存コードの理解などをサポートします。

- [Codex公式サイト](https://openai.com/codex/)
- [VS Codeでの導入方法](https://developers.openai.com/codex/ide)

### Claude Code

Anthropicが提供するAIコーディングツールです。コードの作成・修正、プロジェクト内のコードの理解などに利用できます。

- [Claude Code公式サイト](https://claude.com/product/claude-code)
- [VS Codeでの導入方法](https://code.claude.com/docs/en/vs-code)

### OpenCode

オープンソースのAIコーディングツールです。さまざまなAIモデルを使用でき、ターミナルやエディタから利用できます。

- [OpenCode公式サイト](https://opencode.ai/)
- [VS Codeとの連携方法](https://opencode.ai/docs/ide/)

※ ツールによって、別途アカウント登録や料金が必要になる場合があります。詳しくは各公式サイトを確認してください。

## 6. AIツールを利用する際の注意点

- AIの回答や生成したコードが必ず正しいとは限りません。使用前に内容を確認してください。
- パスワードやAPIキーなどの機密情報を入力しないようにしてください。
- プロジェクトの情報をAIに送信する場合は、チーム内のルールに従ってください。

## 7. 参考リンク

- [VS Code公式サイト](https://code.visualstudio.com/)
- [GitHub Copilot公式サイト](https://github.com/features/copilot)
- [Codex公式サイト](https://openai.com/codex/)
- [Claude Code公式サイト](https://claude.com/product/claude-code)
- [OpenCode公式サイト](https://opencode.ai/)