$(document).ready(function () {

    // global variables

    var quizIntro = $("#intro");
    var startQuiz = $("#start-quiz");
    var quizCont = $("#quiz");
    var wrongCorrect = $("#wrong-correct");
    var pos = 0;
    var counter = 0;
    var timeleft = 90;
    var score;
    var interval;
    var chA = questions[pos].choices[0];
    var chB = questions[pos].choices[1];
    var chC = questions[pos].choices[2];
    var chD = questions[pos].choices[3];
    console.log(chA, chB, chC, chD);

    // create timer

    function createTimer() {
        var timer = $("#timer");
        timer.html("Time: 1:30");

        var interval = setInterval(function timeIt() {
            counter++;
            timer.html("Time: " + convertSeconds(timeleft - counter));
            return;
        }, 1000);

        function convertSeconds(s) {
            var min = Math.floor(s / 60);
            var sec = s % 60;
            sec = sec.toString().padStart(2, "0");
            if (min <= 0 && Number(sec) <= 0) {
                clearInterval(interval);
                createScoreForm();
            } else if (pos > questions.length) {
                clearInterval(interval);
            } else {
                return min + ":" + sec;
            };
        };
    }

    // create quiz structure

    function createQuiz(pos) {
        quizCont.html("<h2>" + questions[pos].title + "<h2>");
        for (let i = 0; i < questions[pos].choices.length; i++) {
            var button = $("<button>");
            button.addClass("button btn-block");
            button.attr("id", i);
            button.text(questions[pos].choices[i]);
            quizCont.append(button);
        }
    }

    // calculate score

    function calcScore() {
        if (timeleft - counter <= 0) {
            score = 0;
        } else {
            score = timeleft - counter;
        }
    }

    // initial entry page

    function createScoreForm() {
        calcScore();
        quizCont.html($("<h2> All done! </h2>"));
        quizCont.append($("<p> Your final score is " + score + "</p>"));
        quizCont.append($("<form class=form-inline action=/action_page.php><label for=initial id=initials>Enter initials: </label><input type=text id=initial><button type=submit id=submit>Submit</button></form>"));
    }

    // high scores page

    function createHighScorePage(event) {
        quizCont.html($("<h2>High Scores</h2>"));
    }

    // store to local storage

    function storeVars() {
        var initialEntry = $("#initial");
        localStorage.setItem("initial", initialEntry.value);
        localStorage.setItem("score", score);
    }

    // get ID

    function buttonID() {

        var id = $(this).attr("id");
        console.log(id)
        var isCorrect = checkAnswer(id)

        if (isCorrect) {
            console.log("Correct");
            wrongCorrect.html($("<hr>" + "<p> Correct! </p>"));
            setTimeout(function nextQuest() {
                wrongCorrect.empty();
                pos = pos + 1;
                if (pos < questions.length) {
                    createQuiz(pos);
                } else {
                    createScoreForm();
                }
            }, 500)
        } else {
            wrongCorrect.html($("<hr>" + "<p> Wrong! </p>"));
            timeleft = timeleft - 10;
            return;
        }
    };

    // check answer

    function checkAnswer(id) {
        if (questions[pos].choices[Number(id)] === questions[pos].answer) {
            console.log("CORRECT!");
            return true
        }
        console.log("INCORRECT!");
        return false
    };

    // call functions

    // start quiz
    startQuiz.click(function () {
        quizIntro.attr("class", "hidden");
        $("#quiz-div").removeClass("hidden");
        createTimer();
        createQuiz(pos);
    });

    // quiz choices buttons
    $("body").on("click", ".button", buttonID);

    // submit high score
    $("body").on("click", "#submit", function () {
        event.preventDefault();
        storeVars();
        createHighScorePage();
    });

    // view high scores
    $("body").on("click", "#view-high-score", function () {
        event.preventDefault();
        quizIntro.attr("class", "hidden");
        wrongCorrect.attr("class", "hidden");
        $("#quiz-div").removeClass("hidden");
        createHighScorePage();
    });

});