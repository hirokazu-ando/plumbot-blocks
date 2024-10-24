basic.forever(function () {
    if (Plumbot.isLeftLineSensorWhite() && Plumbot.isRightLineSensorBlack()) {
        Plumbot.turnRight()
    } else if (Plumbot.isLeftLineSensorBlack() && Plumbot.isRightLineSensorWhite()) {
        Plumbot.turnLeft()
    } else {
        Plumbot.moveForward()
    }
})
