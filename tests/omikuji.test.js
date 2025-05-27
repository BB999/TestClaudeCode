/**
 * Test suite for Omikuji Class
 * おみくじクラスのTDD実装に基づく包括的なテスト
 * 要件定義書のテストケースに準拠
 */

const fs = require('fs');
const path = require('path');

// JavaScriptファイルを読み込み（まだ存在しないため、テスト駆動で作成）
let OmikujiClass;
try {
    const scriptModule = require('../script.js');
    OmikujiClass = scriptModule.Omikuji;
} catch (error) {
    // Omikujiクラスがまだ存在しない場合のハンドリング
    OmikujiClass = null;
}

describe('Omikuji Class - TDD Implementation', () => {
    let omikuji;

    beforeEach(() => {
        // ローカルストレージのモック
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => null),
                setItem: jest.fn(() => null),
                clear: jest.fn(() => null),
                removeItem: jest.fn(() => null),
            },
            writable: true,
        });

        if (OmikujiClass) {
            omikuji = new OmikujiClass();
        }
    });

    afterEach(() => {
        if (omikuji && typeof omikuji.destroy === 'function') {
            omikuji.destroy();
        }
        jest.clearAllMocks();
    });

    describe('クラス基本構造テスト', () => {
        test('Omikujiクラスが定義されている', () => {
            expect(OmikujiClass).toBeDefined();
            expect(typeof OmikujiClass).toBe('function');
        });

        test('Omikujiインスタンスが正しく作成される', () => {
            expect(omikuji).toBeInstanceOf(OmikujiClass);
        });

        test('必要なメソッドが定義されている', () => {
            expect(typeof omikuji.drawOmikuji).toBe('function');
            expect(typeof omikuji.getFortuneLevel).toBe('function');
            expect(typeof omikuji.getDetailedFortune).toBe('function');
            expect(typeof omikuji.getAdvice).toBe('function');
            expect(typeof omikuji.saveResult).toBe('function');
            expect(typeof omikuji.getHistory).toBe('function');
        });
    });

    describe('おみくじ機能テスト', () => {
        describe('1. 運勢レベル生成', () => {
            test('運勢レベルが正しい6段階のいずれかを返す', () => {
                const validLevels = ['大吉', '中吉', '小吉', '末吉', '凶', '大凶'];
                const level = omikuji.getFortuneLevel();
                expect(validLevels).toContain(level);
            });

            test('運勢レベルが文字列で返される', () => {
                const level = omikuji.getFortuneLevel();
                expect(typeof level).toBe('string');
            });

            test('複数回実行してもいずれかの運勢レベルが返される', () => {
                const validLevels = ['大吉', '中吉', '小吉', '末吉', '凶', '大凶'];
                for (let i = 0; i < 10; i++) {
                    const level = omikuji.getFortuneLevel();
                    expect(validLevels).toContain(level);
                }
            });
        });

        describe('2. 詳細な運勢生成', () => {
            test('5種類の詳細運勢を正しく生成する', () => {
                const detailed = omikuji.getDetailedFortune();
                expect(detailed).toHaveProperty('総合運');
                expect(detailed).toHaveProperty('恋愛運');
                expect(detailed).toHaveProperty('仕事運');
                expect(detailed).toHaveProperty('金運');
                expect(detailed).toHaveProperty('健康運');
            });

            test('詳細運勢の各項目が文字列で返される', () => {
                const detailed = omikuji.getDetailedFortune();
                expect(typeof detailed.総合運).toBe('string');
                expect(typeof detailed.恋愛運).toBe('string');
                expect(typeof detailed.仕事運).toBe('string');
                expect(typeof detailed.金運).toBe('string');
                expect(typeof detailed.健康運).toBe('string');
            });

            test('詳細運勢の各項目が空文字でない', () => {
                const detailed = omikuji.getDetailedFortune();
                expect(detailed.総合運.length).toBeGreaterThan(0);
                expect(detailed.恋愛運.length).toBeGreaterThan(0);
                expect(detailed.仕事運.length).toBeGreaterThan(0);
                expect(detailed.金運.length).toBeGreaterThan(0);
                expect(detailed.健康運.length).toBeGreaterThan(0);
            });
        });

        describe('3. アドバイス生成', () => {
            test('運勢レベルに応じたアドバイスを生成する', () => {
                const advice = omikuji.getAdvice('大吉');
                expect(advice).toHaveProperty('アドバイス');
                expect(advice).toHaveProperty('開運アイテム');
                expect(advice).toHaveProperty('ラッキーカラー');
            });

            test('アドバイスの各項目が文字列で返される', () => {
                const advice = omikuji.getAdvice('中吉');
                expect(typeof advice.アドバイス).toBe('string');
                expect(typeof advice.開運アイテム).toBe('string');
                expect(typeof advice.ラッキーカラー).toBe('string');
            });

            test('異なる運勢レベルで異なるアドバイスが生成される', () => {
                const advice1 = omikuji.getAdvice('大吉');
                const advice2 = omikuji.getAdvice('大凶');
                // 少なくとも一部のアドバイスが異なることを確認
                expect(
                    advice1.アドバイス !== advice2.アドバイス ||
                    advice1.開運アイテム !== advice2.開運アイテム ||
                    advice1.ラッキーカラー !== advice2.ラッキーカラー
                ).toBe(true);
            });

            test('全ての運勢レベルでアドバイスが生成される', () => {
                const levels = ['大吉', '中吉', '小吉', '末吉', '凶', '大凶'];
                levels.forEach(level => {
                    const advice = omikuji.getAdvice(level);
                    expect(advice.アドバイス.length).toBeGreaterThan(0);
                    expect(advice.開運アイテム.length).toBeGreaterThan(0);
                    expect(advice.ラッキーカラー.length).toBeGreaterThan(0);
                });
            });
        });

        describe('4. おみくじを引く統合機能', () => {
            test('drawOmikujiが完全な結果オブジェクトを返す', () => {
                const result = omikuji.drawOmikuji();
                expect(result).toHaveProperty('運勢レベル');
                expect(result).toHaveProperty('詳細運勢');
                expect(result).toHaveProperty('アドバイス');
                expect(result).toHaveProperty('日時');
            });

            test('日時が正しい形式で記録される', () => {
                const result = omikuji.drawOmikuji();
                expect(result.日時).toBeInstanceOf(Date);
                expect(result.日時.getTime()).toBeLessThanOrEqual(Date.now());
            });

            test('結果が一意である（運勢レベルは毎回異なる可能性がある）', () => {
                const results = [];
                for (let i = 0; i < 5; i++) {
                    results.push(omikuji.drawOmikuji());
                }
                // 少なくとも日時は異なるはず
                const uniqueTimes = new Set(results.map(r => r.日時.getTime()));
                expect(uniqueTimes.size).toBeGreaterThan(1);
            });
        });
    });

    describe('結果保存機能テスト', () => {
        describe('1. ローカルストレージ保存', () => {
            test('結果がローカルストレージに保存される', () => {
                const result = omikuji.drawOmikuji();
                omikuji.saveResult(result);
                
                expect(window.localStorage.setItem).toHaveBeenCalled();
                const saveCall = window.localStorage.setItem.mock.calls[0];
                expect(saveCall[0]).toBe('omikuji_history');
                expect(typeof saveCall[1]).toBe('string');
            });

            test('保存されたデータが正しいJSON形式である', () => {
                const result = omikuji.drawOmikuji();
                omikuji.saveResult(result);
                
                const saveCall = window.localStorage.setItem.mock.calls[0];
                const savedData = saveCall[1];
                expect(() => JSON.parse(savedData)).not.toThrow();
            });

            test('複数の結果を保存できる', () => {
                const result1 = omikuji.drawOmikuji();
                const result2 = omikuji.drawOmikuji();
                
                omikuji.saveResult(result1);
                omikuji.saveResult(result2);
                
                expect(window.localStorage.setItem).toHaveBeenCalledTimes(2);
            });
        });

        describe('2. 履歴表示', () => {
            test('履歴が配列として返される', () => {
                const history = omikuji.getHistory();
                expect(Array.isArray(history)).toBe(true);
            });

            test('空の履歴で空配列が返される', () => {
                window.localStorage.getItem.mockReturnValue(null);
                const history = omikuji.getHistory();
                expect(history).toEqual([]);
            });

            test('保存された履歴が正しく復元される', () => {
                const mockHistory = [
                    {
                        運勢レベル: '大吉',
                        詳細運勢: { 総合運: 'とても良い' },
                        アドバイス: { アドバイス: 'がんばって' },
                        日時: new Date().toISOString()
                    }
                ];
                window.localStorage.getItem.mockReturnValue(JSON.stringify(mockHistory));
                
                const history = omikuji.getHistory();
                expect(history).toHaveLength(1);
                expect(history[0].運勢レベル).toBe('大吉');
            });
        });
    });

    describe('パフォーマンステスト', () => {
        test('おみくじを引く処理が高速である（100ms未満）', () => {
            const start = Date.now();
            omikuji.drawOmikuji();
            const end = Date.now();
            expect(end - start).toBeLessThan(100);
        });

        test('大量の履歴を処理できる', () => {
            const largeHistory = Array.from({ length: 100 }, (_, i) => ({
                運勢レベル: '大吉',
                詳細運勢: { 総合運: `テスト${i}` },
                アドバイス: { アドバイス: `アドバイス${i}` },
                日時: new Date().toISOString()
            }));
            
            window.localStorage.getItem.mockReturnValue(JSON.stringify(largeHistory));
            
            const start = Date.now();
            const history = omikuji.getHistory();
            const end = Date.now();
            
            expect(history).toHaveLength(100);
            expect(end - start).toBeLessThan(50);
        });
    });

    describe('エラーハンドリング', () => {
        test('無効な運勢レベルでもアドバイスが生成される', () => {
            const advice = omikuji.getAdvice('無効な運勢');
            expect(advice).toHaveProperty('アドバイス');
            expect(advice).toHaveProperty('開運アイテム');
            expect(advice).toHaveProperty('ラッキーカラー');
        });

        test('ローカルストレージエラー時もエラーを投げない', () => {
            window.localStorage.setItem.mockImplementation(() => {
                throw new Error('Storage full');
            });
            
            const result = omikuji.drawOmikuji();
            expect(() => omikuji.saveResult(result)).not.toThrow();
        });

        test('破損したローカルストレージデータを処理できる', () => {
            window.localStorage.getItem.mockReturnValue('invalid json');
            expect(() => omikuji.getHistory()).not.toThrow();
            expect(omikuji.getHistory()).toEqual([]);
        });
    });
});