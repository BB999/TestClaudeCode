/**
 * Hello World Web Application
 * シンプルなHello Worldを表示し、現在の日時を更新するWebアプリケーション
 */

class HelloWorldApp {
    constructor() {
        this.dateTimeElement = null;
        this.updateInterval = null;
        this.init();
    }

    /**
     * アプリケーションの初期化
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.dateTimeElement = document.getElementById('datetime-text');
            this.startDateTimeUpdate();
        });
    }

    /**
     * 現在の日時を取得してフォーマットする
     * @returns {string} フォーマットされた日時文字列
     */
    getCurrentDateTime() {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        };
        
        return now.toLocaleDateString('ja-JP', options);
    }

    /**
     * 日時表示を更新する
     */
    updateDateTime() {
        if (this.dateTimeElement) {
            this.dateTimeElement.textContent = this.getCurrentDateTime();
        }
    }

    /**
     * 日時の自動更新を開始する
     */
    startDateTimeUpdate() {
        // 初回更新
        this.updateDateTime();
        
        // 1秒ごとに更新
        this.updateInterval = setInterval(() => {
            this.updateDateTime();
        }, 1000);
    }

    /**
     * 日時の自動更新を停止する
     */
    stopDateTimeUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * アプリケーションの破棄処理
     */
    destroy() {
        this.stopDateTimeUpdate();
    }
}

// アプリケーションのインスタンスを作成
const app = new HelloWorldApp();

// グローバルスコープでアプリケーションインスタンスを利用可能にする（テスト用）
if (typeof window !== 'undefined') {
    window.HelloWorldApp = HelloWorldApp;
    window.app = app;
}

// Node.js環境での利用をサポート（テスト用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HelloWorldApp, app };
}