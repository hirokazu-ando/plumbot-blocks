//% weight=100 color=#ea618e icon=""
namespace Plumbot {

    /**
     * OLEDディスプレイを初期化するブロック
     */
    //% block="OLEDを使う"
    export function initOLED(): void {
        OLED12864_I2C.init(60); // OLEDディスプレイの初期化
    }

    /**
     * ラインセンサーのモニタリングを行うブロック
     * P3とP4はラインセンサー用
     */
    //% block="ラインセンサモニタリング"
    export function LinesensorMonitoring(): void {
        basic.forever(function () {
            // ラインセンサの値 (左: P3、右: P4) - 1行目
            OLED12864_I2C.showString(0, 0, "Line_L Line_R", 1);

            if (pins.analogReadPin(AnalogPin.P3) < 999) {
                OLED12864_I2C.showString(0, 1, " ", 1);
                OLED12864_I2C.showNumber(1, 1, pins.analogReadPin(AnalogPin.P3), 1);
                OLED12864_I2C.showString(4, 1, " ", 1);
            } else {
                OLED12864_I2C.showNumber(0, 1, pins.analogReadPin(AnalogPin.P3), 1);
            }

            if (pins.analogReadPin(AnalogPin.P4) < 999) {
                OLED12864_I2C.showString(8, 1, " ", 1);
                OLED12864_I2C.showNumber(9, 1, pins.analogReadPin(AnalogPin.P4), 1);
                OLED12864_I2C.showString(12, 1, " ", 1);
            } else {
                OLED12864_I2C.showNumber(8, 1, pins.analogReadPin(AnalogPin.P4), 1);
            }
        });
    }
    /**
     * 超音波センサーのモニタリングを行うブロック
     * P12とP11は超音波センサー用
     */
    //% block="超音波センサモニタリング"
    export function SonarsensorMonitoring(): void {
        Plumbot.initOLED()
        OLED12864_I2C.showNumber(0,0,sonar.ping(DigitalPin.P12,DigitalPin.P11,PingUnit.Centimeters),1)
        OLED12864_I2C.showString(3,0,"cm",1)
    }
    /**
    * 左のラインセンサーの値を取得するブロック
    * P3に固定
    */
    //% block="左ラインセンサの値"
    export function getLeftLineSensorValue(): number {
        return pins.analogReadPin(AnalogPin.P3); // 左のラインセンサーはP3に接続
    }

    /**
    * 右のラインセンサーの値を取得するブロック
    * P4に固定
    */
    //% block="右ラインセンサの値"
    export function getRightLineSensorValue(): number {
        return pins.analogReadPin(AnalogPin.P4); // 右のラインセンサーはP4に接続
    }
    
    /**
     * 超音波センサの値を取得するブロック
     * TrigピンはP12、EchoピンはP11、単位はcmに固定
     */
    //% block="超音波センサの値"
    export function UltrasonicSensor(): number {
        // トリガーピンとエコーピンを固定
        const trig = DigitalPin.P12;
        const echo = DigitalPin.P11;
        const maxCmDistance = 500;

        // トリガーピンでパルスを送信
        pins.setPull(trig, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);

        // エコーピンでパルスの返り時間を読み取る
        const d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);

        // センチメートルに変換して返す
        return Math.idiv(d, 58);
    }

    /**
     * ロボットが直進するブロック
     */
    //% block="ロボット直進"
    export function moveForward(): void {
        // 左モータ正転 (P13), 右モータ正転 (P15)
        pins.analogWritePin(AnalogPin.P13, 1023); // 左モーター正転
        pins.analogWritePin(AnalogPin.P14, 0);     // 左モーター逆転停止
        pins.analogWritePin(AnalogPin.P15, 1023); // 右モーター正転
        pins.analogWritePin(AnalogPin.P16, 0);     // 右モーター逆転停止
    }

    /**
     * ロボットが後退するブロック
     */
    //% block="ロボット後退"
    export function moveBackward(): void {
        // 左モータ逆転 (P14), 右モータ逆転 (P16)
        pins.analogWritePin(AnalogPin.P13, 0);     // 左モーター正転停止
        pins.analogWritePin(AnalogPin.P14, 1023); // 左モーター逆転
        pins.analogWritePin(AnalogPin.P15, 0);     // 右モーター正転停止
        pins.analogWritePin(AnalogPin.P16, 1023); // 右モーター逆転
    }

    /**
     * ロボットが左回転するブロック
     */
    //% block="ロボット左回転"
    export function turnLeft(): void {
        // 左モータ逆転 (P14), 右モータ正転 (P15)
        pins.analogWritePin(AnalogPin.P13, 0);     // 左モーター正転停止
        pins.analogWritePin(AnalogPin.P14, 1023); // 左モーター逆転
        pins.analogWritePin(AnalogPin.P15, 1023); // 右モーター正転
        pins.analogWritePin(AnalogPin.P16, 0);     // 右モーター逆転停止
    }

    /**
     * ロボットが右回転するブロック
     */
    //% block="ロボット右回転"
    export function turnRight(): void {
        // 左モータ正転 (P13), 右モータ逆転 (P16)
        pins.analogWritePin(AnalogPin.P13, 1023); // 左モーター正転
        pins.analogWritePin(AnalogPin.P14, 0);     // 左モーター逆転停止
        pins.analogWritePin(AnalogPin.P15, 0);     // 右モーター正転停止
        pins.analogWritePin(AnalogPin.P16, 1023); // 右モーター逆転
    }

    /**
     * ロボットを停止させるブロック
     */
    //% block="ロボット停止"
    export function stop(): void {
        // すべてのモーターを停止
        pins.analogWritePin(AnalogPin.P13, 0); // 左モーター正転停止
        pins.analogWritePin(AnalogPin.P14, 0); // 左モーター逆転停止
        pins.analogWritePin(AnalogPin.P15, 0); // 右モーター正転停止
        pins.analogWritePin(AnalogPin.P16, 0); // 右モーター逆転停止
    }
    /**
     * 左のラインセンサーが黒色を検出したときのブロック
     * @returns true なら黒色、false なら白色
     */
    //% block="左ラインセンサが黒色の時"
    export function isLeftLineSensorBlack(): boolean {
        // 左ラインセンサ (P3) の値が800以上なら黒色
        return pins.analogReadPin(AnalogPin.P3) >= 800;
    }

    /**
     * 右のラインセンサーが黒色を検出したときのブロック
     * @returns true なら黒色、false なら白色
     */
    //% block="右ラインセンサが黒色の時"
    export function isRightLineSensorBlack(): boolean {
        // 右ラインセンサ (P4) の値が800以上なら黒色
        return pins.analogReadPin(AnalogPin.P4) >= 800;
    }

    /**
     * 左のラインセンサーが白色を検出したときのブロック
     * @returns true なら白色、false なら黒色
     */
    //% block="左ラインセンサが白色の時"
    export function isLeftLineSensorWhite(): boolean {
        // 左ラインセンサ (P3) の値が800未満なら白色
        return pins.analogReadPin(AnalogPin.P3) < 800;
    }

    /**
     * 右のラインセンサーが白色を検出したときのブロック
     * @returns true なら白色、false なら黒色
     */
    //% block="右ラインセンサが白色の時"
    export function isRightLineSensorWhite(): boolean {
        // 右ラインセンサ (P4) の値が800未満なら白色
        return pins.analogReadPin(AnalogPin.P4) < 800;
    }
}
