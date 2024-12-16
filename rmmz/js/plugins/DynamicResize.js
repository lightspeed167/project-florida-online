/*:
 * @target MV MZ
 * @plugindesc 在浏览器中自动适配游戏窗口尺寸
 * @author 
 *
 * @param Base Width
 * @text 基础宽度
 * @type number
 * @min 1
 * @default 816
 * @desc 原始设计的游戏画面宽度（MV默认816）
 *
 * @param Base Height
 * @text 基础高度
 * @type number
 * @min 1
 * @default 624
 * @desc 原始设计的游戏画面高度（MV默认624）
 *
 * @param Maintain Aspect Ratio
 * @text 保持宽高比例
 * @type boolean
 * @default true
 * @desc 是否在自适应时保持宽高比例
 *
 * @param Resize Delay
 * @text 调整延迟（毫秒）
 * @type number
 * @min 0
 * @default 100
 * @desc 当窗口resize事件发生后延迟多少毫秒执行适配，避免频繁触发
 *
 * @help
 * 此插件将会在网页中根据当前浏览器窗口大小自动调整游戏视图。
 * 将插件放入js/plugins目录下并在插件管理器中启用。
 *
 * 原理：监听window的resize事件，计算合适的宽高，然后调用Graphics.resize()来动态更改游戏画面大小。
 *
 * 注意事项：
 *  - 如果保持宽高比例为true，那么画面会尽量放大/缩小以适配窗口，同时保持比例。
 *  - 如果为false，则会直接拉伸以填满窗口（可能会造成画面变形）。
 *  - UI和文字也会跟着缩放，需要根据你自己的界面设计进行测试。
 */

(function() {
    var parameters = PluginManager.parameters('DynamicResize');
    var BASE_WIDTH = Number(parameters['Base Width'] || 816);
    var BASE_HEIGHT = Number(parameters['Base Height'] || 624);
    var MAINTAIN_ASPECT = parameters['Maintain Aspect Ratio'] === 'true';
    var RESIZE_DELAY = Number(parameters['Resize Delay'] || 100);

    function resizeGame() {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;

        if (MAINTAIN_ASPECT) {
            var aspectRatio = BASE_WIDTH / BASE_HEIGHT;
            var newWidth = windowWidth;
            var newHeight = Math.floor(newWidth / aspectRatio);

            // 如果高度超出窗口，则以高度为基准
            if (newHeight > windowHeight) {
                newHeight = windowHeight;
                newWidth = Math.floor(newHeight * aspectRatio);
            }

            Graphics.resize(newWidth, newHeight);
        } else {
            // 不保持比例，直接填充
            Graphics.resize(windowWidth, windowHeight);
        }
    }

    var _resizeTimeout = null;
    window.addEventListener('resize', function() {
        if (_resizeTimeout) clearTimeout(_resizeTimeout);
        _resizeTimeout = setTimeout(resizeGame, RESIZE_DELAY);
    });

    // 页面加载完成后先进行一次适配
    document.addEventListener('DOMContentLoaded', resizeGame);
})();
