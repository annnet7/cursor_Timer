//////////////////////////////////////
//////////////////////////////////////

//таймер
class myTimer {
    constructor() {
            this.startMin = 0;
            this.startSec = 0;
            this.autoStart = false;
        }
        // сеттеры для того что бы можно было достучаться до параметров
    set setFullTime(timeStr) {
        let splitTime = timeStr.split(':');
        this.startMin = parseInt(splitTime[0]);
        let checkSec = parseInt(splitTime[1]);
        if (checkSec > 59 || checkSec < 0)
            this.startSec = 59;
        else
            this.startSec = checkSec;
    }
    set setAutoStart(_autoStart) {
            this.autoStart = _autoStart;
        }
        //самый главный сеттер задаем все параметры разом
    set setAllParams(params) {
            this.setFullTime = params[0];
            this.setAutoStart = params[1];
            this.setDiv = params[2];
            params[2].innerText = params[0];
            //т.к. дивка записывается после отработки сеттера то автостарт не отрабатывал не видел дивку, а  если ее передать параметром то все ок
            if (params[1]) {
                this.countDown(params[2]);
            }
        }
        //удобная фигулина для отладки
    get showStatus() {
        return `${this.startMin}:${this.startSec}, Autostart:${this.autoStart}, contain in : ${this.divTimerContainer}`;
    }
    get getTimeInSec() {
            return this.startMin * 60 + this.startSec;
        }
        //методы
        //начинаем отсчет            
    countDown(divContainer) {

            let min = this.startMin;
            let sec = this.startSec;
            let obj = this; // потому что в интервале this = window
            this.countInterval = setInterval(function() {
                if (min > 0 || sec > 0) {
                    if (sec == 0) {
                        min--;
                        sec = 59;
                    } else sec--;
                    divContainer.innerText = (min < 10 ? ("0" + min) : min) + ":" + (sec < 10 ? ("0" + sec) : sec);
                    obj.startMin = min;
                    obj.startSec = sec;


                } else clearInterval(this.countInterval);
            }, 1000);


            return;
        }
        //останавливаем отсчет
    stopCount() {
        clearInterval(this.countInterval);
    }
}

function btnControl(btnLink, timerLink, divLink, timeLine = false) {
    let startTimer = true;
    if (timerLink.autoStart) {
        startTimer = false;
        btnLink.innerText = "autostart, wona Stop!";
    }
    btnLink.addEventListener("click", function() {
        if (startTimer) {
            timerLink.countDown(divLink);
            btnLink.innerText = "Stop!";
            startTimer = false;
            if (timeLine != false) timeLine.continueAnimation();
        } else {
            timerLink.stopCount();
            btnLink.innerText = "Start :)";
            startTimer = true;
            if (timeLine != false) timeLine.pauseAnimation();
        }
    });
}
//линия загрузки 
class LoadLineDiv {
    constructor(autoStart) {
        this.tl = new TimelineMax({
            repeat: 0
        });
        if (!autoStart) this.tl.pause();
    }
    startAnimation(divLoader, timeInSec) {
        this.tl.to(divLoader, timeInSec, {
            width: 0
        }, 0.0);
    }
    continueAnimation() {
        this.tl.play();
    }
    pauseAnimation() {
        this.tl.pause();
    }
}


let genBtn = document.getElementById('generateBtn');
genBtn.addEventListener("click", function() {

    console.log();
    //получим время и автостарт
    let timeFromInput = document.getElementById('inputMin').value + ":" + document.getElementById('inputSec').value;
    let autoFromInput = document.getElementById('inputAutoStart').checked;
    //
    let divTimer = document.createElement('div');
    divTimer.innerText = '00:00';
    let btnTimer = document.createElement('button');
    btnTimer.innerText = "Start :)";
    let divLoad = document.createElement('div');
    divLoad.className = "loadLine";

    let timeContainer = document.getElementById('container');
    timeContainer.appendChild(divTimer);
    timeContainer.appendChild(btnTimer);
    timeContainer.appendChild(divLoad);


    let objTimer = new myTimer();
    objTimer.setAllParams = [timeFromInput, autoFromInput, divTimer];

    let objLoad = new LoadLineDiv(autoFromInput);
    objLoad.startAnimation(divLoad, objTimer.getTimeInSec);

    btnControl(btnTimer, objTimer, divTimer, objLoad);
});