$(document).ready(function () {

    // global variables

    var quizIntro = $("#intro");
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
    
    // create landing screen

    function landingScreen() {
        quizCont.html($("<h1>Broadway Quiz Challenge</h1>"));
        quizCont.append($("<p>Try to answer the following Broadway related questions within the time limit. Keep in mind that incorrect answers will penalize your score time by 10 seconds!</p>"));
        quizCont.append($("<button type=button id=start-quiz>Start Quiz</button>"));
    }
    
    // create timer

    function createTimer() {
        var timer = $("#timer");    
        timer.html("Time: 1:30");

        interval = setInterval(function () {
            counter++;
            timer.html("Time: " + convertSeconds(timeleft - counter));
            return;
        }, 1000);
    }

    function convertSeconds(s) {
        var min = Math.floor(s / 60);
        var sec = s % 60;
        sec = sec.toString().padStart(2, "0");
        if (timeleft - counter <= 0) {
            clearInterval(interval);
            createScoreForm();
        } else {
            return min + ":" + sec;
        };
    };

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
        var name = localStorage.getItem("initial");
        var highScore = localStorage.getItem("score");
        quizCont.append($("<p class=high-score>" + name + " - " + highScore + "</p>"));
        var button1 = $("<button>");
        var button2 = $("<button>");
        var goBackButton = button1.attr("id", "go-back");
        goBackButton.text("Go Back");
        var clearButton = button2.attr("id", "clear");
        clearButton.text("Clear High Scores")
        quizCont.append(goBackButton);
        quizCont.append(clearButton);
    };

    // store to local storage

    function storeVars() {
        var initialEntry = $("#initial");
        localStorage.setItem("initial", initialEntry.val());
        localStorage.setItem("score", score);
    }

    // get ID

    function buttonID() {

        var id = $(this).attr("id");
        console.log(id);
        var isCorrect = checkAnswer(id);

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
                    clearInterval(interval);
                    pos = 0;
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
            return true;
        }
        console.log("INCORRECT!");
        return false;
    };

    // call functions
    // landing screen
    landingScreen();
    
    // start quiz
    $("body").on("click", "#start-quiz", function () {
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
        clearInterval(interval);
        quizIntro.attr("class", "hidden");
        wrongCorrect.attr("class", "hidden");
        $("#quiz-div").removeClass("hidden");
        createHighScorePage();
    });

    // go back to quiz
    $("body").on("click", "#go-back", function () {
        event.preventDefault();
        landingScreen();
    });

    // clear button
    $("body").on("click", "#clear", function () {
        event.preventDefault();
        $(".high-score").remove();
        localStorage.clear();
    })

});