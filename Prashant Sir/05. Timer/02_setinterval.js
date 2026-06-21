let alarm = () => {
    console.log(`Alarm is ringing! Time: ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getHours() >= 12 ? 'PM' : 'AM'}`);
}
let setAlarm = (seconds) => {
    return setInterval(alarm, seconds * 1000);
}
let timerId = setAlarm(1);
console.log(`Alarm is set for 1 second from now.`);

setTimeout(() => {
    clearInterval(timerId);
    console.log('Alarm stopped.');
}, 6 * 1000);