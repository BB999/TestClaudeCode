/**
 * Test suite for Omikuji Class
 * おみくじクラスのTDD実装テストスイート
 * 要件定義書に基づく包括的なテスト
 */

const fs = require('fs');
const path = require('path');

// テスト対象のクラスをインポート（実装後）
let Omikuji;
try {
    const omikujiModule = require('../omikuji.js');
    Omikuji = omikujiModule.Omikuji || omikujiModule.default;
} catch (error) {
    // まだ実装されていない場合は undefined
    Omikuji = undefined;
}

describe('Omikuji Class - TDD Implementation', () => {
    let omikuji;
    let localStorageMock;

    beforeEach(() => {
        // ローカルストレージのモック作成
        localStorageMock = {
            store: {},
            getItem: jest.fn((key) => localStorageMock.store[key] || null),
            setItem: jest.fn((key, value) => {
                localStorageMock.store[key] = value;
            }),
            removeItem: jest.fn((key) => {
                delete localStorageMock.store[key];
            }),
            clear: jest.fn(() => {
                localStorageMock.store = {};
            })
        };

        // グローバルlocalStorageを置き換え
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
            writable: true
        });

        if (Omikuji) {
            omikuji = new Omikuji();
        }
    });

    afterEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
    });

    describe('4.2 おみくじの内容テスト', () => {
        describe('1. 運勢レベル', () => {
            test('Omikujiクラスが存在する', () => {
                expect(Omikuji).toBeDefined();
                expect(typeof Omikuji).toBe('function');
            });

            test('インスタンスが正しく作成される', () => {
                expect(omikuji).toBeInstanceOf(Omikuji);
            });

            test('6段階の運勢レベルが定義されている', () => {
                const expectedLevels = ['大吉', '中吉', '小吉', '末吉', '凶', '大凶'];
                expect(omikuji.getFortuneLevel()).toBeDefined();
                expect(expectedLevels).toContain(omikuji.getFortuneLevel());
            });

            test('getFortuneLevel()が有効な運勢レベルを返す', () => {
                const validLevels = ['大吉', '中吉', '小吉', '末吉', '凶', '大凶'];
                const fortuneLevel = omikuji.getFortuneLevel();
                expect(validLevels).toContain(fortuneLevel);
            });

            test('複数回実行で異なる結果が生成される可能性がある', () => {
                const results = new Set();
                for (let i = 0; i < 20; i++) {
                    const newOmikuji = new Omikuji();
                    results.add(newOmikuji.getFortuneLevel());
                }
                // 20回の実行で少なくとも2つ以上の異なる結果が出ることを期待
                expect(results.size).toBeGreaterThan(1);
            });
        });

        describe('2. 詳細な運勢', () => {
            test('5種類の詳細運勢が定義されている', () => {
                const expectedTypes = ['総合運', '恋愛運', '仕事運', '金運', '健康運'];
                const detailedFortune = omikuji.getDetailedFortune();
                
                expect(detailedFortune).toBeDefined();
                expect(typeof detailedFortune).toBe('object');
                
                expectedTypes.forEach(type => {
                    expect(detailedFortune).toHaveProperty(type);
                    expect(typeof detailedFortune[type]).toBe('string');
                    expect(detailedFortune[type].length).toBeGreaterThan(0);
                });
            });

            test('詳細運勢の内容が適切である', () => {
                const detailedFortune = omikuji.getDetailedFortune();
                const validRatings = ['◎', '○', '△', '×'];
                
                Object.values(detailedFortune).forEach(rating => {
                    expect(validRatings).toContain(rating);
                });
            });
        });

        describe('3. アドバイス機能', () => {
            test('getAdvice()が文字列を返す', () => {
                const advice = omikuji.getAdvice();
                expect(typeof advice).toBe('string');
                expect(advice.length).toBeGreaterThan(0);
            });

            test('getLuckyItem()が開運アイテムを返す', () => {
                const luckyItem = omikuji.getLuckyItem();
                expect(typeof luckyItem).toBe('string');
                expect(luckyItem.length).toBeGreaterThan(0);
            });

            test('getLuckyColor()がラッキーカラーを返す', () => {
                const luckyColor = omikuji.getLuckyColor();
                expect(typeof luckyColor).toBe('string');
                expect(luckyColor.length).toBeGreaterThan(0);
            });

            test('運勢レベルに応じたアドバイスが提供される', () => {
                const fortuneLevel = omikuji.getFortuneLevel();
                const advice = omikuji.getAdvice();
                
                expect(advice).toBeDefined();
                expect(typeof advice).toBe('string');
                
                // アドバイスが運勢レベルに関連している（具体的な検証は実装に依存）
                if (fortuneLevel === '大吉') {
                    expect(advice).toMatch(/良い|幸運|吉|順調/);
                } else if (fortuneLevel === '大凶') {
                    expect(advice).toMatch(/注意|慎重|控えめ|気をつけ/);
                }
            });
        });
    });

    describe('4.1 基本機能テスト', () => {
        describe('1. おみくじを引く機能', () => {
            test('drawOmikuji()メソッドが存在する', () => {
                expect(typeof omikuji.drawOmikuji).toBe('function');
            });

            test('drawOmikuji()が完全な結果オブジェクトを返す', () => {
                const result = omikuji.drawOmikuji();
                
                expect(result).toBeDefined();
                expect(typeof result).toBe('object');
                expect(result).toHaveProperty('fortuneLevel');
                expect(result).toHaveProperty('detailedFortune');
                expect(result).toHaveProperty('advice');
                expect(result).toHaveProperty('luckyItem');
                expect(result).toHaveProperty('luckyColor');
                expect(result).toHaveProperty('timestamp');
                
                // 日時が現在時刻に近いことを確認
                const now = new Date();
                const resultTime = new Date(result.timestamp);
                const timeDiff = Math.abs(now - resultTime);
                expect(timeDiff).toBeLessThan(1000); // 1秒以内
            });
        });

        describe('2. 結果の保存機能', () => {
            test('saveResult()メソッドが存在する', () => {
                expect(typeof omikuji.saveResult).toBe('function');
            });

            test('結果がローカルストレージに保存される', () => {
                const result = omikuji.drawOmikuji();
                omikuji.saveResult(result);
                
                expect(localStorageMock.setItem).toHaveBeenCalled();
                const savedData = JSON.parse(localStorageMock.store['omikuji-history']);
                expect(Array.isArray(savedData)).toBe(true);
                expect(savedData.length).toBe(1);
                expect(savedData[0]).toEqual(result);
            });

            test('複数の結果が保存される', () => {
                const result1 = omikuji.drawOmikuji();
                const result2 = omikuji.drawOmikuji();
                
                omikuji.saveResult(result1);
                omikuji.saveResult(result2);
                
                const savedData = JSON.parse(localStorageMock.store['omikuji-history']);
                expect(savedData.length).toBe(2);
                expect(savedData).toContain(result1);
                expect(savedData).toContain(result2);
            });

            test('getHistory()で履歴を取得できる', () => {
                expect(typeof omikuji.getHistory).toBe('function');
                
                const result1 = omikuji.drawOmikuji();
                const result2 = omikuji.drawOmikuji();
                
                omikuji.saveResult(result1);
                omikuji.saveResult(result2);
                
                const history = omikuji.getHistory();
                expect(Array.isArray(history)).toBe(true);
                expect(history.length).toBe(2);
                expect(history).toContain(result1);
                expect(history).toContain(result2);
            });

            test('履歴の上限制御（最新50件まで）', () => {
                // 60件のデータを保存
                for (let i = 0; i < 60; i++) {
                    const result = omikuji.drawOmikuji();
                    omikuji.saveResult(result);
                }
                
                const history = omikuji.getHistory();
                expect(history.length).toBeLessThanOrEqual(50);
            });
        });
    });

    describe('エラーハンドリング', () => {
        test('ローカルストレージが利用できない場合のエラー処理', () => {
            // localStorageを無効化
            Object.defineProperty(window, 'localStorage', {
                value: null,
                writable: true
            });
            
            expect(() => {
                const newOmikuji = new Omikuji();
                const result = newOmikuji.drawOmikuji();
                newOmikuji.saveResult(result);
            }).not.toThrow();
        });

        test('不正なデータでのsaveResult呼び出し', () => {
            expect(() => {
                omikuji.saveResult(null);
            }).not.toThrow();
            
            expect(() => {
                omikuji.saveResult(undefined);
            }).not.toThrow();
            
            expect(() => {
                omikuji.saveResult({});
            }).not.toThrow();
        });

        test('破損したローカルストレージデータの処理', () => {
            // 不正なJSONデータを設定
            localStorageMock.store['omikuji-history'] = 'invalid json data';
            
            expect(() => {
                const history = omikuji.getHistory();
                expect(Array.isArray(history)).toBe(true);
                expect(history.length).toBe(0);
            }).not.toThrow();
        });
    });

    describe('ランダム性のテスト', () => {
        test('統計的にランダムな結果が生成される', () => {
            const fortuneLevels = {};
            const iterations = 100;
            
            for (let i = 0; i < iterations; i++) {
                const newOmikuji = new Omikuji();
                const level = newOmikuji.getFortuneLevel();
                fortuneLevels[level] = (fortuneLevels[level] || 0) + 1;
            }
            
            // 少なくとも3種類以上の運勢レベルが出現することを期待
            expect(Object.keys(fortuneLevels).length).toBeGreaterThanOrEqual(3);
            
            // どの運勢も偏りすぎていないことを確認（70%以下）
            Object.values(fortuneLevels).forEach(count => {
                expect(count).toBeLessThan(iterations * 0.7);
            });
        });
    });

    describe('パフォーマンステスト', () => {
        test('大量の結果生成が高速に実行される', () => {
            const startTime = performance.now();
            
            for (let i = 0; i < 1000; i++) {
                const newOmikuji = new Omikuji();
                newOmikuji.drawOmikuji();
            }
            
            const endTime = performance.now();
            const executionTime = endTime - startTime;
            
            // 1000回の実行が1秒以内に完了することを期待
            expect(executionTime).toBeLessThan(1000);
        });
    });
});