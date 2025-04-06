let elapsedTimes = [];
let lengths =[];

$(document).ready(function () {
    let $theButton = $('#theButton');
    let $summaryButton = $('#summaryButton');
    let $attemptButton = $('#attemptButton');
    let $summaryText = $('#summaryText');
    let $attemptText = $('#attemptText');
    let $results = $('#results');

    let $startTime = 0;
    let $endTime = 0;
    let $elapsedTime = 0;
    let startTimes = [];
    let endTimes = [];
    let summaryClick = 0;
    let attemptClick = 0;
    const WINNING_SECONDS = 3;

    $theButton.click(function () {
        date = new Date();
        if ( !$theButton.hasClass('btn-secondary') ) {
            $(this).addClass("btn-secondary");
            $(this).val("Stop")

            if ($theButton.hasClass('btn-primary')) {
                $(this).removeClass("btn-primary");
            }
            else if ($theButton.hasClass('btn-info')) {
                $(this).removeClass("btn-info");
            }
            else if ($theButton.hasClass('btn-success')) {
                $(this).removeClass("btn-success");
            }
            else if ($theButton.hasClass('btn-warning')) {
                $(this).removeClass("btn-warning");
            }
            else if ($theButton.hasClass('btn-danger')) {
                $(this).removeClass("btn-danger");
            }

            //console.log("Start button was Clicked");
            let $startTimeMilli = date.getMilliseconds();
            let $startTimeSeconds = date.getSeconds();
            $startTime = $startTimeSeconds + ($startTimeMilli/1000)
            startTimes.push($startTime);
            //console.log($startTimeSeconds+" Seconds "+$startTimeMilli+" milliseconds " + $startTime);
        }
        else if ($theButton.hasClass('btn-secondary')) {
            $(this).removeClass("btn-secondary");
            $(this).val("Start");
            //console.log("End button was Clicked");
            let $endTimeMilli = date.getMilliseconds();
            let $endTimeSeconds = date.getSeconds();
            $endTime = $endTimeSeconds + ($endTimeMilli/1000);
            endTimes.push($endTime);
            $elapsedTime = $endTime - $startTime;
            if ($elapsedTime < 0) {
                $elapsedTime = $endTime - $startTime + 60;
            }
            //console.log($endTimeSeconds+" Seconds "+$endTimeMilli+" milliseconds "+$endTime+" Elapsed Time " + $elapsedTime);
            checkTime($elapsedTime);
        }
    })

    $summaryButton.click(function () {
        if (summaryClick === 0) {
            let $totalTimes = 0;
            for (let i = 0; i < elapsedTimes.length; i++) {
                $totalTimes = $totalTimes + elapsedTimes[i];
            }
            let $averageTime = $totalTimes / elapsedTimes.length;

            let $minimumTime = Math.min(...elapsedTimes);
            let $maximumTime = Math.max(...elapsedTimes);
            $summaryText.html("<p>Summary</p><p>Total Attempts: " + elapsedTimes.length + "</p><p>Minimum Time: " + $minimumTime + "</p>" +
                "<p>Maximum Time: " + $maximumTime + "</p><p>Average Time: "+ $averageTime +"</p>");
            $summaryText.show();
            summaryClick = 1;
        }
        else if (summaryClick === 1) {
            summaryClick = 0;
            $summaryText.hide();
        }
    })

    $attemptButton.click(function () {
        if (attemptClick === 0) {
            $attemptText.html("<div class='row justify-content-lg-center'>Attempt Log</div><div class=\"row justify-content-md-center\"><div class=\"col-lg-1 border\"> Attempt Number </div><div class=\"col-lg-1 border\">Start Time</div><div class=\"col-lg-1 border\">Stop Time</div></div>");
            for (let i = 0; i < elapsedTimes.length; i++) {
                $attemptText.append("<div class=\"row justify-content-md-center\"> <div class=\"col-lg-1 border\">" + i + "</div><div class=\"col-lg-1 border\">" + startTimes[i] + "</div><div class=\"col-lg-1 border\">" + endTimes[i] + "</div>");
            }
            $attemptText.show();
            $results.show();
            attemptClick=1;
        }
        else if (attemptClick === 1) {
            $attemptText.hide();
            $results.hide();
            attemptClick=0;
        }

    })

    function checkTime($elapsedTime) {
        if ($elapsedTime === WINNING_SECONDS) {
            console.log("3 Seconds");
            $theButton.addClass("btn-success");
        } else if ($elapsedTime >= (WINNING_SECONDS - .2) && $elapsedTime <= (WINNING_SECONDS + .2)) {
            console.log("+/-.2 Seconds");
            $theButton.addClass("btn-primary");
        }
        else if ($elapsedTime >= (WINNING_SECONDS -.5) && $elapsedTime <= (WINNING_SECONDS +.5)) {
            console.log("+/-.5 Seconds");
            $theButton.addClass("btn-warning");
        }
        else{
            console.log("Other");
            $theButton.addClass("btn-danger");
        }
        elapsedTimes.push($elapsedTime);
        lengths.push(elapsedTimes.length);
        myChart.update();
        console.log(elapsedTimes);
    }
})

//Chart
const ctx = document.getElementById('myChart').getContext('2d');

const data = {
    labels: lengths,
    datasets: [{
        label: 'Elapsed times (Seconds)',
        data: elapsedTimes,
        fill: true,
    }]
};

const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        scales: {
            x: {
                beginAtZero: true
            }
        }
    }
};

const myChart = new Chart(ctx, config);