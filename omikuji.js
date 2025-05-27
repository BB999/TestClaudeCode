/**
 * Omikuji Class - おみくじクラス
 * 日本の伝統的なおみくじ機能を実装するクラス
 */

class Omikuji {
    constructor() {
        this.fortuneLevels = ['大吉', '中吉', '小吉', '末吉', '凶', '大凶'];
        this.fortuneTypes = ['総合運', '恋愛運', '仕事運', '金運', '健康運'];
        this.fortuneRatings = ['◎', '○', '△', '×'];
        
        this.adviceMap = {
            '大吉': [
                '今日は最高の日です。新しいことにチャレンジしてみましょう。',
                '素晴らしい運気が流れています。積極的に行動しましょう。',
                '幸運が舞い込む絶好のタイミングです。',
                '今日の決断が良い結果をもたらすでしょう。'
            ],
            '中吉': [
                '良い運気が続いています。順調に進むでしょう。',
                '努力が実を結ぶ時期です。継続は力なりです。',
                '安定した幸運に恵まれています。',
                '着実に歩みを進めれば良い結果が得られます。'
            ],
            '小吉': [
                '小さな幸せが見つかるでしょう。',
                '穏やかな運気に包まれています。',
                'ささやかな喜びがあなたを待っています。',
                '日常の中に幸運が隠れています。'
            ],
            '末吉': [
                '後半に向けて運気が上昇するでしょう。',
                '忍耐強く待てば良いことがあります。',
                '今は準備の時期です。チャンスを待ちましょう。',
                'ゆっくりと良い方向に向かっています。'
            ],
            '凶': [
                '慎重に行動することが大切です。',
                '今は控えめに過ごしましょう。',
                '注意深く周りを見回してください。',
                '無理をせず、安全第一で過ごしましょう。'
            ],
            '大凶': [
                '今日は特に注意が必要です。慎重に行動してください。',
                '大きな決断は避けて、様子を見ましょう。',
                '困難な時期ですが、必ず明けない夜はありません。',
                '今は静かに過ごし、嵐が過ぎるのを待ちましょう。'
            ]
        };
        
        this.luckyItems = [
            'お守り', '鈴', '招き猫', '四つ葉のクローバー', '馬蹄', 
            '水晶', 'ペンダント', '指輪', '時計', '財布',
            '鏡', '花', '本', 'キーホルダー', 'ストラップ'
        ];
        
        this.luckyColors = [
            '赤', '青', '黄', '緑', '紫', '白', '黒', '金', '銀', 'ピンク',
            'オレンジ', '茶色', '水色', '紺色', '灰色'
        ];
        
        this.currentResult = this.generateResult();
    }

    /**
     * ランダムな要素を配列から選択
     * @param {Array} array 選択元の配列
     * @returns {*} ランダムに選択された要素
     */
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * 運勢レベルを取得
     * @returns {string} 運勢レベル
     */
    getFortuneLevel() {
        return this.currentResult.fortuneLevel;
    }

    /**
     * 詳細な運勢を取得
     * @returns {Object} 詳細運勢オブジェクト
     */
    getDetailedFortune() {
        return this.currentResult.detailedFortune;
    }

    /**
     * アドバイスを取得
     * @returns {string} アドバイス文
     */
    getAdvice() {
        return this.currentResult.advice;
    }

    /**
     * 開運アイテムを取得
     * @returns {string} 開運アイテム
     */
    getLuckyItem() {
        return this.currentResult.luckyItem;
    }

    /**
     * ラッキーカラーを取得
     * @returns {string} ラッキーカラー
     */
    getLuckyColor() {
        return this.currentResult.luckyColor;
    }

    /**
     * 詳細運勢を生成
     * @returns {Object} 詳細運勢オブジェクト
     */
    generateDetailedFortune() {
        const detailedFortune = {};
        this.fortuneTypes.forEach(type => {
            detailedFortune[type] = this.getRandomElement(this.fortuneRatings);
        });
        return detailedFortune;
    }

    /**
     * 運勢レベルに基づいたアドバイスを生成
     * @param {string} fortuneLevel 運勢レベル
     * @returns {string} アドバイス
     */
    generateAdvice(fortuneLevel) {
        const adviceList = this.adviceMap[fortuneLevel] || this.adviceMap['小吉'];
        return this.getRandomElement(adviceList);
    }

    /**
     * おみくじ結果を生成
     * @returns {Object} おみくじ結果オブジェクト
     */
    generateResult() {
        const fortuneLevel = this.getRandomElement(this.fortuneLevels);
        const detailedFortune = this.generateDetailedFortune();
        const advice = this.generateAdvice(fortuneLevel);
        const luckyItem = this.getRandomElement(this.luckyItems);
        const luckyColor = this.getRandomElement(this.luckyColors);
        const timestamp = new Date().toISOString();

        return {
            fortuneLevel,
            detailedFortune,
            advice,
            luckyItem,
            luckyColor,
            timestamp
        };
    }

    /**
     * おみくじを引く
     * @returns {Object} おみくじ結果
     */
    drawOmikuji() {
        this.currentResult = this.generateResult();
        return { ...this.currentResult };
    }

    /**
     * 結果をローカルストレージに保存
     * @param {Object} result おみくじ結果
     */
    saveResult(result) {
        try {
            // 引数の検証
            if (!result || typeof result !== 'object') {
                console.warn('Invalid result data for saving');
                return;
            }

            // ローカルストレージが利用可能かチェック
            if (typeof window === 'undefined' || !window.localStorage) {
                console.warn('localStorage is not available');
                return;
            }

            // 既存の履歴を取得
            let history = this.getHistory();
            
            // 新しい結果を追加
            history.unshift(result);
            
            // 履歴の上限を50件に制限
            if (history.length > 50) {
                history = history.slice(0, 50);
            }
            
            // ローカルストレージに保存
            window.localStorage.setItem('omikuji-history', JSON.stringify(history));
        } catch (error) {
            console.error('Error saving omikuji result:', error);
        }
    }

    /**
     * 保存された履歴を取得
     * @returns {Array} おみくじ履歴の配列
     */
    getHistory() {
        try {
            // ローカルストレージが利用可能かチェック
            if (typeof window === 'undefined' || !window.localStorage) {
                return [];
            }

            const savedData = window.localStorage.getItem('omikuji-history');
            if (!savedData) {
                return [];
            }

            const history = JSON.parse(savedData);
            return Array.isArray(history) ? history : [];
        } catch (error) {
            console.error('Error loading omikuji history:', error);
            // 破損したデータの場合は空の配列を返す
            return [];
        }
    }

    /**
     * 履歴をクリア
     */
    clearHistory() {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem('omikuji-history');
            }
        } catch (error) {
            console.error('Error clearing omikuji history:', error);
        }
    }
}

// Node.js環境での利用をサポート（テスト用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Omikuji };
}

// ブラウザ環境での利用をサポート
if (typeof window !== 'undefined') {
    window.Omikuji = Omikuji;
}