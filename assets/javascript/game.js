const sampleResults = [
    {
        "category"         : "Entertainment: Video Games",
        "type"             : "multiple",
        "difficulty"       : "hard",
        "question"         : "How many people can you recruit in the game Suikoden in a single playthrough?",
        "correct_answer"   : "107",
        "incorrect_answers": ["108", "93", "96"]
    },
    {
        "category"         : "Entertainment: Music",
        "type"             : "multiple",
        "difficulty"       : "easy",
        "question"         : "In the Rossini opera, what was the name of &#039;The Barber of Seville&#039;?",
        "correct_answer"   : "Figaro",
        "incorrect_answers": ["Angelo", "Fernando", "Dave"]
    },
    {
        "category"         : "Vehicles",
        "type"             : "multiple",
        "difficulty"       : "medium",
        "question"         : "What part of an automobile engine uses lobes to open and close intake and exhaust valves, and allows an air\/fuel mixture into the engine?",
        "correct_answer"   : "Camshaft",
        "incorrect_answers": ["Piston", "Drive shaft", "Crankshaft"]
    },
    {
        "category"         : "Science & Nature",
        "type"             : "multiple",
        "difficulty"       : "easy",
        "question"         : "This element, when overcome with extreme heat and pressure, creates diamonds.",
        "correct_answer"   : "Carbon",
        "incorrect_answers": ["Nitrogen", "Oxygen", "Hydrogen"]
    },
    {
        "category"         : "History",
        "type"             : "multiple",
        "difficulty"       : "medium",
        "question"         : "On what day did Germany invade Poland?",
        "correct_answer"   : "September 1, 1939",
        "incorrect_answers": ["December 7, 1941", "June 22, 1941", "July 7, 1937"]
    },
    {
        "category"         : "Art",
        "type"             : "multiple",
        "difficulty"       : "hard",
        "question"         : "Albrecht D&uuml;rer&#039;s birthplace and place of death were in...",
        "correct_answer"   : "N&uuml;rnberg",
        "incorrect_answers": ["Augsburg", "Bamberg", "Berlin"]
    },
    {
        "category"         : "Entertainment: Books",
        "type"             : "multiple",
        "difficulty"       : "easy",
        "question"         : "Who was the author of the 1954 novel, &quot;Lord of the Flies&quot;?",
        "correct_answer"   : "William Golding",
        "incorrect_answers": ["Stephen King", "F. Scott Fitzgerald", "Hunter Fox"]
    },
    {
        "category"         : "History",
        "type"             : "multiple",
        "difficulty"       : "hard",
        "question"         : "The Hagia Sophia was commissioned by which emperor of the Byzantine Empire?",
        "correct_answer"   : "Justinian I",
        "incorrect_answers": ["Constantine IV", "Arcadius", "Theodosius the Great"]
    },
    {
        "category"         : "Entertainment: Video Games",
        "type"             : "multiple",
        "difficulty"       : "hard",
        "question"         : "Which monster in &quot;Monster Hunter Tri&quot; was causing earthquakes in Moga Village?",
        "correct_answer"   : "Ceadeus",
        "incorrect_answers": ["Alatreon", "Rathalos", "Lagiacrus"]
    },
    {
        "category"         : "Entertainment: Video Games",
        "type"             : "multiple",
        "difficulty"       : "medium",
        "question"         : "Which of these is not a DLC vehicle in &quot;Mario Kart 8&quot;?",
        "correct_answer"   : "Wild Wiggler",
        "incorrect_answers": ["Bone Rattler", "B Dasher", "300 SL Roadster"]
    }
];

const TriviaGame = function () {

    let intervalID;
    const numQuestions = 10,
        numChoicesPerQuestion = 4;
    const timeAllowed = 10,
        timeWarning = 5;

    let timeLeft;
    let answers, numCorrectAnswers, currentQuestion;


    this.startNewGame = function () {
        displayPage(0);
    }

    this.startQuiz = function () {
        answers = new Array(numQuestions);
        numCorrectAnswers = 0;
        currentQuestion = 0;

        $("#question, #answer, #timer").css({
            "display": "none"
        });
        resetTimer();
        displayPage(1);

        const output = parseData(sampleResults);

        updateDOM(output);

        displayCurrentQuestion();
    }

    function gradeQuiz() {
        clearInterval(intervalID);

        $("#numCorrectAnswers").text(numCorrectAnswers);
        $("#numQuestions").text(numQuestions);
        displayPage(2);
    }


    function displayPage(page) {
        $(".page").css({
            "display": "none"
        });
        $(`.page:nth-of-type(${page + 1})`).css({
            "display": "block"
        });
    }

    function displayCurrentQuestion() {
        if (currentQuestion < numQuestions) {
            if (currentQuestion > 0) {
                $(`#q${currentQuestion - 1}`).css({
                    "display": "none"
                });
            }

            $(`#q${currentQuestion}`).css({
                "display": "block"
            });
            $("#question, #timer").css({
                "display": "block"
            });
            $("#answer").css({
                "display": "none"
            });

            resetTimer();

            intervalID = setInterval(updateTimer, 1000);

        } else {
            gradeQuiz();

        }
    }

    function displayAnswer(index) {
        clearInterval(intervalID);

        let output;

        if (index === answers[currentQuestion].index) {
            numCorrectAnswers++;
            output = "<h2>Correct!</h2>";

        } else if (index !== -1) {
            output = "<h2>Incorrect!</h2>";

        } else {
            output = "<h2>Time's up!</h2>";

        }

        output += `<p>The answer is ${answers[currentQuestion].value}.</p>`;

        $("#question, #timer").css({
            "display": "none"
        });
        $("#answer").html(output);
        $("#answer").css({
            "display": "block"
        });

        setTimeout(updateQuestion, 2000);
    }

    function updateQuestion() {
        currentQuestion++;
        displayCurrentQuestion();
    }

    function updateTimer() {
        timeLeft--;

        $("#timer").text(timeLeft);

        $("#timer").replaceWith($("#timer").clone());

        if (timeLeft === 0) {
            displayAnswer(-1);
        }
    }

    function resetTimer() {
        timeLeft = timeAllowed;

        $("#timer").text(timeLeft);
        $("#timer").css({
            "animation": "spin 0.50s cubic-bezier(.15, .07, .20, .97) both"
        });
    }

    function parseData(data) {
        let output = "";

        // Temporary variables
        let i, j, choices;

        for (i = 0; i < numQuestions; i++) {
            // Display the subcategory
            const index = data[i].category.indexOf(":");

            if (index >= 0) {
                // Account for the space after colon
                data[i].category = data[i].category.substring(index + 2, data[i].category.length);
            }

            // Insert the correct answer among the incorrect ones
            choices = data[i].incorrect_answers;

            answers[i] = {
                "index": Math.floor(numChoicesPerQuestion * Math.random()),
                "value": data[i].correct_answer
            };

            choices.splice(answers[i].index, 0, answers[i].value);

            // Write to HTML
            output += `<div class=\"questions\" id=\"q${i}\">
                       <div class=\"category\"><p>${data[i].category}</p></div>
                       <div class=\"prompt\"><p>Question ${i + 1}. ${data[i].question}</p></div>`;

            for (j = 0; j < numChoicesPerQuestion; j++) {
                output += `<div class=\"choices choices_q${i}\">${String.fromCharCode(65 + j)}. ${choices[j]}</div>`;
            }

            output += "</div>";
        }

        return output;
    }

    function updateDOM(output) {
        $("#question").html(output);
        $(".questions").css({
            "display": "none"
        });

        $(".choices").on("click", function () {
            const index = $(".choices").index(this) % numChoicesPerQuestion;

            displayAnswer(index);
        });
    }
}

$(document).ready(function () {
    let game = new TriviaGame();

    game.startNewGame();

    $("#button_start").on("click", game.startQuiz);

    $("#button_restart").on("click", game.startNewGame);
});