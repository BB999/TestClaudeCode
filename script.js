/**
 * Hello World Web Application with Omikuji Feature
 * シンプルなHello Worldを表示し、現在の日時を更新するWebアプリケーション
 * おみくじ機能を含む
 */

/**
 * Omikuji Class
 * おみくじ機能を提供するクラス
 * TDD実装に基づく包括的なおみくじシステム
 */
class Omikuji {
    constructor() {
        this.fortuneLevels = ['大吉', '中吉', '小吉', '末吉', '凶', '大凶'];
        this.fortuneTypes = ['総合運', '恋愛運', '仕事運', '金運', '健康運'];
        this.storageKey = 'omikuji_history';
    }

    /**
     * 運勢レベルをランダムに選択する
     * @returns {string} 運勢レベル
     */
    getFortuneLevel() {
        const randomIndex = Math.floor(Math.random() * this.fortuneLevels.length);
        return this.fortuneLevels[randomIndex];
    }

    /**
     * 詳細な運勢を生成する
     * @returns {Object} 5種類の詳細運勢
     */
    getDetailedFortune() {
        const fortuneDescriptions = {
            '大吉': ['絶好調', '最高', '素晴らしい', '完璧', '理想的'],
            '中吉': ['とても良い', '良好', '順調', '安定', '上々'],
            '小吉': ['良い', 'まずまず', '普通以上', '悪くない', 'そこそこ'],
            '末吉': ['普通', 'ぼちぼち', '平凡', '無難', '標準的'],
            '凶': ['注意が必要', '慎重に', '気をつけて', '控えめに', '様子見'],
            '大凶': ['大変注意', '慎重すぎるほど', '避けた方が良い', '見送り推奨', '要警戒']
        };

        const level = this.getFortuneLevel();
        const descriptions = fortuneDescriptions[level];
        const detailed = {};

        this.fortuneTypes.forEach((type, index) => {
            detailed[type] = descriptions[index % descriptions.length];
        });

        return detailed;
    }

    /**
     * 運勢レベルに応じたアドバイスを生成する
     * @param {string} level - 運勢レベル
     * @returns {Object} アドバイス、開運アイテム、ラッキーカラー
     */
    getAdvice(level) {
        const adviceData = {
            '大吉': {
                'アドバイス': '積極的に行動すると良い結果が得られるでしょう。チャンスを逃さないようにしましょう。',
                '開運アイテム': '金色のアクセサリー',
                'ラッキーカラー': '金色'
            },
            '中吉': {
                'アドバイス': '着実に努力を重ねることで成果を得られるでしょう。焦らず丁寧に取り組みましょう。',
                '開運アイテム': '青いペン',
                'ラッキーカラー': '青色'
            },
            '小吉': {
                'アドバイス': '小さな幸せを大切にしましょう。周りの人への感謝を忘れずに。',
                '開運アイテム': 'ピンクの花',
                'ラッキーカラー': 'ピンク色'
            },
            '末吉': {
                'アドバイス': 'マイペースで進むことが大切です。無理をせず自分らしさを大切にしましょう。',
                '開運アイテム': '緑の植物',
                'ラッキーカラー': '緑色'
            },
            '凶': {
                'アドバイス': '慎重な判断を心がけましょう。今は準備期間と考えて、焦らず行動しましょう。',
                '開運アイテム': '白いハンカチ',
                'ラッキーカラー': '白色'
            },
            '大凶': {
                'アドバイス': '今は無理をせず、休息を取ることも大切です。明日は今日より良い日になるでしょう。',
                '開運アイテム': '黒い石',
                'ラッキーカラー': '黒色'
            }
        };

        return adviceData[level] || adviceData['末吉'];
    }

    /**
     * おみくじを引く
     * @returns {Object} 完全なおみくじ結果
     */
    drawOmikuji() {
        const level = this.getFortuneLevel();
        const detailed = this.getDetailedFortune();
        const advice = this.getAdvice(level);

        const result = {
            '運勢レベル': level,
            '詳細運勢': detailed,
            'アドバイス': advice,
            '日時': new Date()
        };

        return result;
    }

    /**
     * おみくじ結果をローカルストレージに保存する
     * @param {Object} result - おみくじ結果
     */
    saveResult(result) {
        try {
            let history = this.getHistory();
            
            // 日時をシリアライズ可能な形式に変換
            const serializableResult = {
                ...result,
                '日時': result.日時.toISOString()
            };
            
            history.push(serializableResult);
            
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(this.storageKey, JSON.stringify(history));
            }
        } catch (error) {
            // ローカルストレージエラーを静かに処理
            console.warn('おみくじ結果の保存に失敗しました:', error);
        }
    }

    /**
     * おみくじ履歴を取得する
     * @returns {Array} おみくじ履歴の配列
     */
    getHistory() {
        try {
            if (typeof localStorage === 'undefined') {
                return [];
            }
            
            const historyData = localStorage.getItem(this.storageKey);
            if (!historyData) {
                return [];
            }
            
            const history = JSON.parse(historyData);
            
            // 日時を Date オブジェクトに復元
            return history.map(item => ({
                ...item,
                '日時': new Date(item.日時)
            }));
        } catch (error) {
            // 破損したデータを静かに処理
            console.warn('おみくじ履歴の読み込みに失敗しました:', error);
            return [];
        }
    }

    /**
     * 履歴をクリアする
     */
    clearHistory() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(this.storageKey);
            }
        } catch (error) {
            console.warn('履歴のクリアに失敗しました:', error);
        }
    }

    /**
     * リソースの破棄処理
     */
    destroy() {
        // 現在は特別な破棄処理は不要
    }
}

class HelloWorldApp {
    constructor() {
        this.dateTimeElement = null;
        this.updateInterval = null;
        this.omikuji = new Omikuji();
        this.init();
    }

    /**
     * アプリケーションの初期化
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.dateTimeElement = document.getElementById('datetime-text');
            this.startDateTimeUpdate();
            this.initOmikuji();
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
     * おみくじ機能の初期化
     */
    initOmikuji() {
        const drawButton = document.getElementById('draw-omikuji-btn');
        const clearButton = document.getElementById('clear-history-btn');
        
        if (drawButton) {
            drawButton.addEventListener('click', () => this.handleDrawOmikuji());
        }
        
        if (clearButton) {
            clearButton.addEventListener('click', () => this.handleClearHistory());
        }
        
        this.updateHistoryDisplay();
    }

    /**
     * おみくじを引く処理
     */
    handleDrawOmikuji() {
        const result = this.omikuji.drawOmikuji();
        this.omikuji.saveResult(result);
        this.displayOmikujiResult(result);
        this.updateHistoryDisplay();
    }

    /**
     * おみくじ結果を表示
     * @param {Object} result - おみくじ結果
     */
    displayOmikujiResult(result) {
        const resultElement = document.getElementById('omikuji-result');
        if (!resultElement) return;

        const formatResult = (result) => {
            const fortuneLevel = result.運勢レベル;
            return `
                <div class="fortune-result level-${fortuneLevel}">
                    <h3>🎋 ${fortuneLevel} 🎋</h3>
                    <div class="detailed-fortune">
                        <h4>詳細運勢:</h4>
                        <ul>
                            ${Object.entries(result.詳細運勢).map(([key, value]) => 
                                `<li><strong>${key}:</strong> ${value}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    <div class="advice">
                        <h4>アドバイス:</h4>
                        <p>${result.アドバイス.アドバイス}</p>
                        <p><strong>開運アイテム:</strong> ${result.アドバイス.開運アイテム}</p>
                        <p><strong>ラッキーカラー:</strong> ${result.アドバイス.ラッキーカラー}</p>
                    </div>
                    <div class="timestamp">
                        <small>引いた時間: ${result.日時.toLocaleString('ja-JP')}</small>
                    </div>
                </div>
            `;
        };

        resultElement.innerHTML = formatResult(result);
        
        // Add entrance animation for the new result
        const fortuneResultDiv = resultElement.querySelector('.fortune-result');
        if (fortuneResultDiv) {
            fortuneResultDiv.style.opacity = '0';
            fortuneResultDiv.style.transform = 'translateY(20px)';
            
            // Trigger animation after a brief delay
            setTimeout(() => {
                fortuneResultDiv.style.transition = 'all 0.5s ease-out';
                fortuneResultDiv.style.opacity = '1';
                fortuneResultDiv.style.transform = 'translateY(0)';
            }, 100);
        }
        
        resultElement.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * 履歴表示を更新
     */
    updateHistoryDisplay() {
        const historyList = document.getElementById('history-list');
        if (!historyList) return;

        const history = this.omikuji.getHistory();
        
        if (history.length === 0) {
            historyList.innerHTML = '<p>まだおみくじを引いていません</p>';
            return;
        }

        const historyHTML = history
            .slice(-5) // 最新5件のみ表示
            .reverse()
            .map(item => `
                <div class="history-item">
                    <span class="fortune-level">${item.運勢レベル}</span>
                    <span class="timestamp">${new Date(item.日時).toLocaleString('ja-JP')}</span>
                </div>
            `).join('');

        historyList.innerHTML = historyHTML;
    }

    /**
     * 履歴をクリア
     */
    handleClearHistory() {
        if (confirm('履歴をすべて削除しますか？')) {
            this.omikuji.clearHistory();
            this.updateHistoryDisplay();
            
            const resultElement = document.getElementById('omikuji-result');
            if (resultElement) {
                resultElement.innerHTML = '<p>履歴がクリアされました</p>';
            }
        }
    }

    /**
     * アプリケーションの破棄処理
     */
    destroy() {
        this.stopDateTimeUpdate();
        if (this.omikuji) {
            this.omikuji.destroy();
        }
    }
}

// アプリケーションのインスタンスを作成
const app = new HelloWorldApp();

// グローバルスコープでアプリケーションインスタンスを利用可能にする（テスト用）
if (typeof window !== 'undefined') {
    window.HelloWorldApp = HelloWorldApp;
    window.Omikuji = Omikuji;
    window.app = app;
}

// Node.js環境での利用をサポート（テスト用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HelloWorldApp, Omikuji, app };
}