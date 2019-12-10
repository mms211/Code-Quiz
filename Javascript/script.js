$(document).ready(function () {

    // global variables

    var quizIntro = $("#intro");
    var startQuiz = $("#start-quiz");
    var quizCont = $("#quiz");
    var wrongCorrect = $("#wrong-correct");
    var pos = 0;
    var chA = questions[pos].choices[0];
    var chB = questions[pos].choices[1];
    var chC = questions[pos].choices[2];
    var chD = questions[pos].choices[3];
    console.log(chA, chB, chC, chD);

    // create quiz structure

    function createQuiz(pos) {
        quizCont.html("<h2>" + questions[pos].title + "<h2>");
        for (let i = 0; i < questions[pos].choices.length; i++) {
            var button = $("<button>");
            var newLine = $("<br/>");
            button.addClass("button");
            button.attr("id", i);
            button.text(questions[pos].choices[i]);
            quizCont.append(button);
            quizCont.append(newLine);
        }
    }

    // score page

    function createScorePage() {
        quizCont.html($("<h2> All done! </h2>"));
        quizCont.append($("<p> Your final score is " + "" + "</p>"));
        quizCont.append($("<form class=form-inline action=/action_page.php><label for=initial>Enter initials:</label><input type=text id=initial><button type=submit id=submit>Submit</button></form>"));
    }

    // get ID & check answer

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
                    createScorePage();
                }
            }, 500)
        } else {
            wrongCorrect.html($("<hr>" + "<p> Wrong! </p>"));
            return;
        }
    };

    function checkAnswer(id) {
        if (questions[pos].choices[Number(id)] === questions[pos].answer) {
            console.log("CORRECT!");
            return true
        }
        console.log("INCORRECT!");
        return false
    };



    // call functions

    startQuiz.click(function () {
        quizIntro.attr("class", "hidden");
        createQuiz(pos);
    });

    $("body").on("click", ".button", buttonID);


});