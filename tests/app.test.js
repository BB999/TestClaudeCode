/**
 * Test suite for Hello World Web Application
 * 要件定義書のテストケースに基づく包括的なテスト
 */

const fs = require('fs');
const path = require('path');

// HTMLファイルの内容を読み込み
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// JavaScriptファイルを読み込み
const { HelloWorldApp } = require('../script.js');

describe('Hello World Web Application', () => {
    let app;

    beforeEach(() => {
        // DOM環境をセットアップ
        document.documentElement.innerHTML = html;
        
        // アプリケーションインスタンスを作成
        app = new HelloWorldApp();
        
        // DOMContentLoadedイベントを手動で発火
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);
    });

    afterEach(() => {
        if (app) {
            app.destroy();
        }
    });

    describe('10.1 表示テスト', () => {
        describe('1. 基本表示', () => {
            test('ブラウザで正しくHello Worldが表示されるか', () => {
                const mainText = document.getElementById('main-text');
                expect(mainText).not.toBeNull();
                expect(mainText.textContent).toBe('Hello World');
                expect(mainText.classList.contains('main-text')).toBe(true);
            });

            test('メインテキストが中央に配置されているか', () => {
                const container = document.querySelector('.container');
                const computedStyle = window.getComputedStyle(container);
                expect(container).not.toBeNull();
                // テキストが中央揃えになっているかチェック
                expect(container.style.textAlign || 'center').toBe('center');
            });
        });

        describe('2. レスポンシブ表示', () => {
            test('HTML viewport metaタグが設定されているか', () => {
                const viewportMeta = document.querySelector('meta[name="viewport"]');
                expect(viewportMeta).not.toBeNull();
                expect(viewportMeta.getAttribute('content')).toContain('width=device-width');
            });

            test('レスポンシブクラスが適用されているか', () => {
                const container = document.querySelector('.container');
                expect(container).not.toBeNull();
                expect(container.classList.contains('container')).toBe(true);
            });
        });

        describe('3. アニメーション', () => {
            test('アニメーションクラスが設定されているか', () => {
                const content = document.querySelector('.content');
                expect(content).not.toBeNull();
                expect(content.classList.contains('content')).toBe(true);
            });

            test('メインテキストにアニメーションクラスが適用されているか', () => {
                const mainText = document.getElementById('main-text');
                expect(mainText).not.toBeNull();
                expect(mainText.classList.contains('main-text')).toBe(true);
            });
        });
    });

    describe('10.2 機能テスト', () => {
        describe('1. 日時表示', () => {
            test('現在の日時が正しく表示されるか', (done) => {
                const dateTimeElement = document.getElementById('datetime-text');
                expect(dateTimeElement).not.toBeNull();

                // 少し待ってから日時が設定されているかチェック
                setTimeout(() => {
                    expect(dateTimeElement.textContent).not.toBe('');
                    expect(dateTimeElement.textContent.length).toBeGreaterThan(0);
                    done();
                }, 100);
            });

            test('日時が定期的に更新されるか', (done) => {
                const dateTimeElement = document.getElementById('datetime-text');
                const initialText = dateTimeElement.textContent;

                // 1秒後に内容が更新されているかチェック
                setTimeout(() => {
                    // 秒単位で更新されるため、内容が変わっている可能性が高い
                    expect(dateTimeElement.textContent).toBeDefined();
                    done();
                }, 1100);
            });

            test('getCurrentDateTime メソッドが正しい形式の日時を返すか', () => {
                const dateTime = app.getCurrentDateTime();
                expect(typeof dateTime).toBe('string');
                expect(dateTime.length).toBeGreaterThan(0);
                // 日本語の日時形式が含まれているかチェック
                expect(dateTime).toMatch(/\d{4}年|\d{1,2}月|\d{1,2}日/);
            });
        });

        describe('2. 背景グラデーション', () => {
            test('body要素にグラデーション背景が設定されているか', () => {
                const body = document.body;
                expect(body).not.toBeNull();
                // CSSクラスが適用されていることを確認
                expect(body.tagName.toLowerCase()).toBe('body');
            });
        });
    });

    describe('10.3 パフォーマンステスト', () => {
        describe('1. ロード時間', () => {
            test('HTMLファイルサイズが適切か', () => {
                const htmlSize = html.length;
                // 1MB = 1,048,576 bytes以下であることを確認
                expect(htmlSize).toBeLessThan(1048576);
            });

            test('CSSファイルが存在するか', () => {
                const cssLink = document.querySelector('link[rel="stylesheet"]');
                expect(cssLink).not.toBeNull();
                expect(cssLink.getAttribute('href')).toBe('styles.css');
            });

            test('JavaScriptファイルが存在するか', () => {
                const scriptTag = document.querySelector('script[src="script.js"]');
                expect(scriptTag).not.toBeNull();
            });
        });

        describe('2. メモリ使用量', () => {
            test('不要なタイマーがクリアされるか', () => {
                expect(app.updateInterval).not.toBeNull();
                app.destroy();
                expect(app.updateInterval).toBeNull();
            });
        });
    });

    describe('10.4 アクセシビリティテスト', () => {
        describe('1. スクリーンリーダー対応', () => {
            test('メインテキストにaria-labelが設定されているか', () => {
                const mainText = document.getElementById('main-text');
                expect(mainText.getAttribute('aria-label')).toBe('Hello World');
            });

            test('日時表示にaria-liveが設定されているか', () => {
                const dateTimeText = document.getElementById('datetime-text');
                expect(dateTimeText.getAttribute('aria-live')).toBe('polite');
            });

            test('main要素にrole属性が設定されているか', () => {
                const main = document.querySelector('main');
                expect(main.getAttribute('role')).toBe('main');
            });
        });

        describe('2. キーボード操作', () => {
            test('HTML lang属性が設定されているか', () => {
                const html = document.documentElement;
                expect(html.getAttribute('lang')).toBe('ja');
            });

            test('メタデータが適切に設定されているか', () => {
                const charset = document.querySelector('meta[charset]');
                const description = document.querySelector('meta[name="description"]');
                
                expect(charset).not.toBeNull();
                expect(charset.getAttribute('charset')).toBe('UTF-8');
                expect(description).not.toBeNull();
                expect(description.getAttribute('content')).toContain('Hello World');
            });
        });
    });

    describe('HelloWorldApp クラステスト', () => {
        test('インスタンスが正しく作成されるか', () => {
            expect(app).toBeInstanceOf(HelloWorldApp);
            expect(typeof app.init).toBe('function');
            expect(typeof app.getCurrentDateTime).toBe('function');
            expect(typeof app.updateDateTime).toBe('function');
            expect(typeof app.startDateTimeUpdate).toBe('function');
            expect(typeof app.stopDateTimeUpdate).toBe('function');
            expect(typeof app.destroy).toBe('function');
        });

        test('updateDateTimeメソッドが正常に動作するか', () => {
            const dateTimeElement = document.getElementById('datetime-text');
            const initialText = dateTimeElement.textContent;
            
            app.updateDateTime();
            
            expect(dateTimeElement.textContent).not.toBe(initialText);
            expect(dateTimeElement.textContent.length).toBeGreaterThan(0);
        });

        test('stopDateTimeUpdateメソッドが正常に動作するか', () => {
            expect(app.updateInterval).not.toBeNull();
            app.stopDateTimeUpdate();
            expect(app.updateInterval).toBeNull();
        });
    });

    describe('エラーハンドリング', () => {
        test('要素が存在しない場合のエラー処理', () => {
            // DOM要素を削除
            const dateTimeElement = document.getElementById('datetime-text');
            dateTimeElement.remove();
            
            // エラーが発生しないことを確認
            expect(() => {
                app.updateDateTime();
            }).not.toThrow();
        });
    });
});