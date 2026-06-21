let alarm = () => {
    console.log('Alarm is ringing!');
};
let setAlarm = (seconds) => {
    return setTimeout(alarm, seconds * 1000);
}
let timerId = setAlarm(0.5);
console.log(`Alarm is set for ${timerId} seconds from now.`);
// clearTimeout(timerId);