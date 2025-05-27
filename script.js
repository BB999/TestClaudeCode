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

/**
 * Omikuji App Integration
 * おみくじアプリケーションの統合機能
 */
class OmikujiApp {
    constructor() {
        this.omikuji = null;
        this.resultElement = null;
        this.historyContainer = null;
        this.isHistoryVisible = false;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupOmikujiElements();
            this.setupEventListeners();
        });
    }

    setupOmikujiElements() {
        if (typeof window !== 'undefined' && window.Omikuji) {
            this.omikuji = new window.Omikuji();
        }
        
        this.resultElement = document.getElementById('omikuji-result');
        this.historyContainer = document.getElementById('history-container');
    }

    setupEventListeners() {
        const drawButton = document.getElementById('draw-omikuji-btn');
        const toggleHistoryButton = document.getElementById('toggle-history-btn');

        if (drawButton) {
            drawButton.addEventListener('click', () => this.drawOmikuji());
        }

        if (toggleHistoryButton) {
            toggleHistoryButton.addEventListener('click', () => this.toggleHistory());
        }
    }

    drawOmikuji() {
        if (!this.omikuji) {
            console.error('Omikuji class not available');
            return;
        }

        try {
            const result = this.omikuji.drawOmikuji();
            this.displayResult(result);
            this.omikuji.saveResult(result);
            this.updateHistory();
        } catch (error) {
            console.error('Error drawing omikuji:', error);
        }
    }

    displayResult(result) {
        if (!this.resultElement) return;

        // 運勢レベルを表示
        const fortuneLevelElement = document.getElementById('fortune-level');
        if (fortuneLevelElement) {
            fortuneLevelElement.textContent = result.fortuneLevel;
            fortuneLevelElement.className = `fortune-level ${result.fortuneLevel}`;
        }

        // 詳細運勢を表示
        const detailedFortuneElement = document.getElementById('detailed-fortune');
        if (detailedFortuneElement) {
            detailedFortuneElement.innerHTML = '';
            Object.entries(result.detailedFortune).forEach(([type, rating]) => {
                const fortuneItem = document.createElement('div');
                fortuneItem.className = 'fortune-item';
                fortuneItem.innerHTML = `
                    <div class="type">${type}</div>
                    <div class="rating ${rating}">${rating}</div>
                `;
                detailedFortuneElement.appendChild(fortuneItem);
            });
        }

        // アドバイスを表示
        const adviceElement = document.getElementById('advice-text');
        if (adviceElement) {
            adviceElement.textContent = result.advice;
        }

        // 開運アイテムを表示
        const luckyItemElement = document.getElementById('lucky-item');
        if (luckyItemElement) {
            luckyItemElement.textContent = result.luckyItem;
        }

        // ラッキーカラーを表示
        const luckyColorElement = document.getElementById('lucky-color');
        if (luckyColorElement) {
            luckyColorElement.textContent = result.luckyColor;
        }

        // 結果を表示
        this.resultElement.classList.add('show');
        
        // アニメーション効果
        setTimeout(() => {
            this.resultElement.style.opacity = '1';
        }, 100);
    }

    toggleHistory() {
        if (!this.historyContainer) return;

        this.isHistoryVisible = !this.isHistoryVisible;
        const toggleButton = document.getElementById('toggle-history-btn');

        if (this.isHistoryVisible) {
            this.updateHistory();
            this.historyContainer.classList.add('show');
            if (toggleButton) {
                toggleButton.textContent = '履歴を隠す';
            }
        } else {
            this.historyContainer.classList.remove('show');
            if (toggleButton) {
                toggleButton.textContent = '履歴を表示';
            }
        }
    }

    updateHistory() {
        if (!this.omikuji || !this.historyContainer) return;

        try {
            const history = this.omikuji.getHistory();
            this.historyContainer.innerHTML = '';

            if (history.length === 0) {
                this.historyContainer.innerHTML = '<p style="text-align: center; color: #ccc;">まだ履歴がありません</p>';
                return;
            }

            history.slice(0, 10).forEach(result => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                const date = new Date(result.timestamp);
                const formattedDate = date.toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                historyItem.innerHTML = `
                    <div class="history-date">${formattedDate}</div>
                    <div class="history-fortune">${result.fortuneLevel}</div>
                    <div class="history-details">
                        開運アイテム: ${result.luckyItem} | 
                        ラッキーカラー: ${result.luckyColor}
                    </div>
                `;
                
                this.historyContainer.appendChild(historyItem);
            });
        } catch (error) {
            console.error('Error updating history:', error);
        }
    }
}

// アプリケーションのインスタンスを作成
const app = new HelloWorldApp();
const omikujiApp = new OmikujiApp();

// グローバルスコープでアプリケーションインスタンスを利用可能にする（テスト用）
if (typeof window !== 'undefined') {
    window.HelloWorldApp = HelloWorldApp;
    window.OmikujiApp = OmikujiApp;
    window.app = app;
    window.omikujiApp = omikujiApp;
}

// Node.js環境での利用をサポート（テスト用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HelloWorldApp, OmikujiApp, app, omikujiApp };
}